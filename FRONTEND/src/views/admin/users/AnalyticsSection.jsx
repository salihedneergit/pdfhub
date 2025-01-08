import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Bar } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import zoomPlugin from 'chartjs-plugin-zoom'; 
import { FaExpand, FaTimes } from 'react-icons/fa';
import TopCards from './components/TopCards';
import Profile from './components/Profile';
import FourCards from './components/FourCards';

Chart.register(ChartDataLabels, zoomPlugin);

function AnalyticsSection() {


  const navigate = useNavigate();
  const { userId } = useParams();

  const [userDetails, setUserDetails] = useState(null);

const fetchUserDetails = async () => {
  try {
    const response = await fetch(`http://13.51.106.41:3001/api/users/${userId}/details`);
    const data = await response.json();
    if (data.success) setUserDetails(data.user);
  } catch (error) {
    console.error('User Details Fetch Error:', error);
  }
};

useEffect(() => {
  fetchUserDetails();
}, [userId]);

  // States for each dataset
  const [coursesTimeData, setCoursesTimeData] = useState(null);
  const [todosTimeData, setTodosTimeData] = useState([]);
  const [pomodoroTimeData, setPomodoroTimeData] = useState([]);

  // UI states
  const [loading, setLoading] = useState(true);
  const [fullscreenChart, setFullscreenChart] = useState(null);

  // Chart references for zoom reset
  const subjectsChartRef = useRef(null);
  const pomodoroChartRef = useRef(null);
  const todosChartRef = useRef(null);

  // Color palette
  const colorPalette = {
    primary: 'rgba(59, 130, 246, 0.85)',   // Vibrant Blue
    secondary: 'rgba(16, 185, 129, 0.85)', // Teal Green
    tertiary: 'rgba(245, 158, 11, 0.85)',  // Amber
  };

  // Helper: Parse time, clamp negatives to 0
  const parseTime = (timeStr) => {
    const parsed = parseFloat(timeStr || '0');
    return parsed < 0 ? 0 : parsed;
  };

  // Data fetch
  const fetchAllAnalytics = async () => {
    setLoading(true);
    try {
      const endpoints = [
        `http://13.51.106.41:3001/api/users/${userId}/courses/time`,
        `http://13.51.106.41:3001/api/users/${userId}/todos/time`,
        `http://13.51.106.41:3001/api/users/${userId}/pomodoro/time`
      ];

      const responses = await Promise.all(endpoints.map(url => fetch(url)));
      const [coursesJson, todosJson, pomodoroJson] = await Promise.all(
        responses.map(res => res.json())
      );

      if (coursesJson.success) setCoursesTimeData(coursesJson.data);
      if (todosJson.success) setTodosTimeData(todosJson.data);
      if (pomodoroJson.success) setPomodoroTimeData(pomodoroJson.data);
    } catch (error) {
      console.error('Analytics Fetch Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllAnalytics();
  }, [userId]);

  // Chart data generation
  const getSubjectsChartData = () => {
    if (!coursesTimeData) return { labels: [], datasets: [] };

    const subjectsMap = {};

    Object.entries(coursesTimeData).forEach(([courseName, dateObj]) => {
      Object.entries(dateObj).forEach(([dateStr, timeStr]) => {
        const timeValue = parseTime(timeStr);
        if (!subjectsMap[dateStr]) subjectsMap[dateStr] = {};
        if (!subjectsMap[dateStr][courseName]) subjectsMap[dateStr][courseName] = 0;
        subjectsMap[dateStr][courseName] += timeValue;
      });
    });

    const labels = Object.keys(subjectsMap).sort();
    const courses = Array.from(
      new Set(Object.values(subjectsMap).flatMap((obj) => Object.keys(obj)))
    );

    const brightColors = [
      'rgba(255, 99, 132, 0.85)', // Red
      'rgba(54, 162, 235, 0.85)', // Blue
      'rgba(255, 206, 86, 0.85)', // Yellow
      'rgba(75, 192, 192, 0.85)', // Teal
      'rgba(153, 102, 255, 0.85)', // Purple
      'rgba(255, 159, 64, 0.85)', // Orange
      'rgba(122, 55, 255, 0.85)', // Custom vibrant color
    ];

    const datasets = courses.map((course, index) => ({
      label: course,
      data: labels.map((date) => subjectsMap[date]?.[course] || 0),
      backgroundColor: brightColors[index % brightColors.length],
    }));

    return { labels, datasets };
  };

  const getChartData = (data, label, color) => {
    if (!Array.isArray(data) && !data) return { labels: [], datasets: [] };

    const items = Array.isArray(data)
      ? data
      : Object.entries(data).map(([date, time]) => ({ date, time: parseTime(time) }));

    if (!items.length) {
      return { labels: ['No Data'], datasets: [{ label, data: [0], backgroundColor: color }] };
    }

    const sortedItems = items.sort((a, b) => new Date(a.date) - new Date(b.date));

    return {
      labels: sortedItems.map((item) => item.date),
      datasets: [
        {
          label,
          data: sortedItems.map((item) => parseTime(item.time || item.timeSpent || '0')),
          backgroundColor: color,
        },
      ],
    };
  };

  // Chart rendering with horizontal scroll & fullscreen
  const renderBarChart = (data, options, chartRef) => (
    <div className="relative">
      <button
        onClick={() => setFullscreenChart({ data, options })}
        className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
      >
        <FaExpand size={18} />
      </button>
  
      <button
        onClick={() => chartRef.current?.resetZoom()}
        className="absolute top-2 right-12 bg-gray-600 text-white text-xs px-2 py-1 rounded"
      >
        Reset Zoom
      </button>
  
      {/* Responsive Wrapper */}
      <div className="w-full overflow-x-auto mt-8">
        <div className="min-w-[300px] h-[300px] sm:h-[400px] md:h-[500px]">
          <Bar ref={chartRef} data={data} options={options} />
        </div>
      </div>
    </div>
  );
  

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false, // Disable fixed aspect ratio for better responsiveness
    scales: {
      x: {
        ticks: { color: '#333' },
      },
      y: {
        beginAtZero: true,
        ticks: { color: '#333' },
      },
    },
    plugins: {
      datalabels: {
        color: '#000',
        anchor: 'end',
        align: 'top',
        formatter: (value) => `${value} mins`,
        font: { size: 12, weight: 'bold' },
      },
      zoom: {
        pan: {
          enabled: true,
          mode: 'x',
        },
        zoom: {
          wheel: {
            enabled: true,
          },
          pinch: {
            enabled: true,
          },
          mode: 'x',
        },
      },
    },
  };
  
  if (loading) {
    // return <div className="min-h-screen p-4">Loading...</div>;
    return (
      <div className="min-h-screen p-4 bg-gray-100">
      {/* Sidebar Skeleton */}
      <div className="flex flex-col md:flex-row">
        <div className="w-full md:w-1/4 p-4 bg-white shadow-md rounded-lg">
          <div className="h-10 w-full bg-gray-300 rounded mb-6 animate-pulse"></div>
          <div className="h-10 w-full bg-gray-300 rounded mb-4 animate-pulse"></div>
          <div className="h-10 w-full bg-gray-300 rounded mb-4 animate-pulse"></div>
          <div className="h-10 w-full bg-gray-300 rounded mb-4 animate-pulse"></div>
        </div>

        {/* Main Content Area */}
        <div className="w-full md:w-3/4 p-4">
          {/* Header Skeleton */}
          <div className="flex items-center justify-between mb-6">
            <div className="h-10 w-1/4 bg-gray-300 rounded animate-pulse"></div>
            <div className="h-10 w-1/6 bg-gray-300 rounded animate-pulse"></div>
          </div>

          {/* Content Cards Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="bg-white shadow-md rounded-lg p-6">
              <div className="h-6 w-1/3 bg-gray-300 rounded mb-4 animate-pulse"></div>
              <div className="h-20 w-full bg-gray-300 rounded animate-pulse"></div>
            </div>

            {/* Card 2 */}
            <div className="bg-white shadow-md rounded-lg p-6">
              <div className="h-6 w-1/3 bg-gray-300 rounded mb-4 animate-pulse"></div>
              <div className="h-20 w-full bg-gray-300 rounded animate-pulse"></div>
            </div>

            {/* Card 3 */}
            <div className="bg-white shadow-md rounded-lg p-6">
              <div className="h-6 w-1/3 bg-gray-300 rounded mb-4 animate-pulse"></div>
              <div className="h-20 w-full bg-gray-300 rounded animate-pulse"></div>
            </div>
          </div>

          {/* Table Skeleton */}
          <div className="mt-6 bg-white shadow-md rounded-lg p-6">
            <div className="h-8 w-1/4 bg-gray-300 rounded mb-4 animate-pulse"></div>
            <div className="space-y-4">
              <div className="flex justify-between">
                <div className="h-4 w-1/4 bg-gray-300 rounded animate-pulse"></div>
                <div className="h-4 w-1/4 bg-gray-300 rounded animate-pulse"></div>
              </div>
              <div className="flex justify-between">
                <div className="h-4 w-1/4 bg-gray-300 rounded animate-pulse"></div>
                <div className="h-4 w-1/4 bg-gray-300 rounded animate-pulse"></div>
              </div>
              <div className="flex justify-between">
                <div className="h-4 w-1/4 bg-gray-300 rounded animate-pulse"></div>
                <div className="h-4 w-1/4 bg-gray-300 rounded animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    )
  }

  return (
    <div className="min-h-screen p-4 ">
      <div className="bg-[#F4F7FE] p-4 rounded-lg w-full h-full overflow-auto relative">
        <button
          onClick={() => navigate('/admin/users/')}
          className="absolute top-4 right-4 px-4 py-4 bg-[#EE4B2B] text-white rounded-full"
        >
          <FaTimes size={18} />
        </button>

        <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight mb-6">User Analytics</h1>
        <Profile/>

      <FourCards/>

        <TopCards 
          coursesTimeData={coursesTimeData} 
          todosTimeData={todosTimeData}
          userDetails={userDetails} 
        />

        <div className="grid gap-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white border rounded-lg p-6 shadow-lg">
              <h2 className="text-xl font-bold mb-4 text-gray-800">Subjects Analysis</h2>
              {renderBarChart(getSubjectsChartData(), chartOptions, subjectsChartRef)}
            </div>

            <div className="bg-white border rounded-lg p-6 shadow-lg">
              <h2 className="text-xl font-bold mb-4 text-gray-800">Pomodoro Analysis</h2>
              {renderBarChart(
                getChartData(pomodoroTimeData, 'Pomodoro Time (mins)', colorPalette.tertiary),
                chartOptions,
                pomodoroChartRef
              )}
            </div>

            <div className="bg-white border rounded-lg p-6 shadow-lg">
              <h2 className="text-xl font-bold mb-4 text-gray-800">Todos Analysis</h2>
              {renderBarChart(
                getChartData(todosTimeData, 'Todos Time (mins)', colorPalette.secondary),
                chartOptions,
                todosChartRef
              )}
            </div>
          </div>
        </div>
      </div>

      {fullscreenChart && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-2 rounded-lg w-full h-full overflow-auto relative">
            <button
              onClick={() => setFullscreenChart(null)}
              className="absolute top-2 right-2 px-2 py-2 bg-gray-800 text-white rounded"
            >
              Close
            </button>
            <div className="overflow-x-scroll h-full flex items-center">
              <div className="min-w-[1000px] sm:min-w-[1200px] md:min-w-[1400px] h-[80vh]">
                <Bar data={fullscreenChart.data} options={fullscreenChart.options} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AnalyticsSection;
