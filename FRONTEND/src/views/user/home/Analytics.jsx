import React, { useEffect, useState, useRef } from 'react';
import { Bar } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import zoomPlugin from 'chartjs-plugin-zoom'; 
import { FaExpand } from 'react-icons/fa';

// NEW: Import the separate TopCards component
import TopCards from './components/TopCards';

Chart.register(ChartDataLabels, zoomPlugin);

function AnalyticsSection() {
  // States for each dataset
  const [coursesTimeData, setCoursesTimeData] = useState(null);
  const [todosTimeData, setTodosTimeData] = useState([]);
  const [pomodoroTimeData, setPomodoroTimeData] = useState([]);

  // UI states
  const [filter, setFilter] = useState('weekly');
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

  // Helper: Calculate date range (kept for existing code)
  const calculateDateRange = (filterType) => {
    const today = new Date();
    const ranges = {
      daily: 1,
      weekly: 7,
      monthly: 30,
      yearly: 365
    };
    return {
      endDate: today,
      startDate: new Date(today.getTime() - (ranges[filterType] || 7) * 24 * 60 * 60 * 1000)
    };
  };

  // Helper: Check if date is within range (kept for existing code)
  const isInRange = (dateStr, startDate, endDate) => {
    const d = new Date(dateStr);
    return d >= startDate && d <= endDate;
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
      const userData = JSON.parse(localStorage.getItem('user'));
      const userId = userData?._id;
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

  // CHANGED: does NOT depend on [filter]; 
  // -> chart won't change on filter selection
  useEffect(() => {
    fetchAllAnalytics();
    // eslint-disable-next-line
  }, []); 

  // 1) Subjects Analysis
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
      'rgba(255, 99, 132, 0.85)',
      'rgba(54, 162, 235, 0.85)',
      'rgba(255, 206, 86, 0.85)',
      'rgba(75, 192, 192, 0.85)',
      'rgba(153, 102, 255, 0.85)',
      'rgba(255, 159, 64, 0.85)',
      'rgba(201, 203, 207, 0.85)',
    ];

    const datasets = courses.map((course, index) => ({
      label: course,
      data: labels.map((date) => subjectsMap[date]?.[course] || 0),
      backgroundColor: brightColors[index % brightColors.length],
    }));

    return { labels, datasets };
  };

  // 2) Pomodoro / Todos Chart Data
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
      {/* Fullscreen button */}
      <button
        onClick={() => setFullscreenChart({ data, options })}
        className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
      >
        <FaExpand size={18} />
      </button>
  
      {/* Reset Zoom button */}
      <button
        onClick={() => chartRef.current?.resetZoom()}
        className="absolute top-2 right-12 bg-gray-600 text-white text-xs px-2 py-1 rounded"
      >
        Reset Zoom
      </button>
  
      {/* Responsive Wrapper */}
      <div className="mt-8">
        <div className="w-[80%] overflow-x-auto">
          <div className="min-w-[250px] md:min-w-[600px] lg:min-w-[1000px]">
            <Bar ref={chartRef} data={data} options={options} />
          </div>
        </div>
      </div>
    </div>
  );
  

  // Chart options with Zoom (unchanged)
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
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

  // Render
  return (
    <div className="min-h-screen p-4">
      <div className="container mx-auto bg-white rounded-2xl shadow-2xl p-6">
        {/* Header */}
        <div className="flex flex-wrap justify-between items-center mb-6">
          <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight">Performance Analytics</h1>
          {/* <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 border-2 border-blue-500 rounded-lg text-blue-600 focus:outline-none"
          >
            {['daily', 'weekly', 'monthly', 'yearly'].map((period) => (
              <option key={period} value={period}>
                {period.charAt(0).toUpperCase() + period.slice(1)}
              </option>
            ))}
          </select> */}
        </div>

        {loading ? (
          <div className="text-center py-10 text-gray-500">Loading analytics...</div>
        ) : (
          <>
            {/* Now using the separate TopCards component */}
            <TopCards 
              coursesTimeData={coursesTimeData} 
              todosTimeData={todosTimeData} 
            />

            {/* Bar Graphs */}
            <div className="grid gap-8">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Subjects */}
                <div className="bg-white border rounded-lg p-6 shadow-lg">
                  <h2 className="text-xl font-bold mb-4 text-gray-800">Subjects Analysis</h2>
                  {renderBarChart(getSubjectsChartData(), chartOptions, subjectsChartRef)}
                </div>

                {/* Pomodoro */}
                <div className="bg-white border rounded-lg p-6 shadow-lg">
                  <h2 className="text-xl font-bold mb-4 text-gray-800">Pomodoro Analysis</h2>
                  {renderBarChart(
                    getChartData(pomodoroTimeData, 'Pomodoro Time (mins)', colorPalette.tertiary),
                    chartOptions,
                    pomodoroChartRef
                  )}
                </div>

                {/* Todos */}
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
          </>
        )}
      </div>

      {/* Fullscreen Modal (existing code) */}
      {fullscreenChart && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-4 rounded-lg w-full h-full overflow-auto relative">
            <button
              onClick={() => setFullscreenChart(null)}
              className="absolute top-4 right-4 px-4 py-2 bg-gray-800 text-white rounded"
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
