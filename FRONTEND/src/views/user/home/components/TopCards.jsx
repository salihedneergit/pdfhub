import React, { useState, useEffect } from "react";
import {
  FaBook,
  FaTasks,
  FaClock,
  FaChartPie,
} from "react-icons/fa";

export default function TopCards() {
  const [timeData, setTimeData] = useState(null);
  const [filter, setFilter] = useState("daily");
  const [showHours, setShowHours] = useState(false);

  useEffect(() => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user || !user._id) return;

      fetch(`http://13.51.106.41:3001/api/users/${user._id}/sections/time`)
        .then((res) => res.json())
        .then((json) => {
          if (json?.success && json?.data) {
            setTimeData(json.data);
          }
        })
        .catch((error) => {
          console.error("Error fetching time data:", error);
        });
    } catch (e) {
      console.error("Error parsing user from localStorage:", e);
    }
  }, []);

  // Map filter selection to API response attribute
  const getTimeValue = (section) => {
    if (!timeData || !timeData[section]) return 0;
    
    const filterMap = {
      daily: "avgTimePerDay",
      weekly: "avgTimePerWeek",
      monthly: "avgTimePerMonth",
      yearly: "avgTimePerYear",
      total: "totalTime"
    };

    const value = timeData[section][filterMap[filter]] || 0;
    const numValue = parseFloat(value);
    
    if (isNaN(numValue) || !isFinite(numValue)) return 0;
    return showHours ? (numValue / 60).toFixed(2) : numValue.toFixed(2);
  };

  const cards = [
    {
      title: "Course Time",
      section: "course",
      icon: <FaBook size={24} />,
      bgColor: "bg-gradient-to-br from-blue-50 to-blue-100",
      borderColor: "border-blue-200",
      iconColor: "text-blue-500",
      hoverEffect: "hover:shadow-blue-100",
    },
    {
      title: "Todo Time",
      section: "todo",
      icon: <FaTasks size={24} />,
      bgColor: "bg-gradient-to-br from-green-50 to-green-100",
      borderColor: "border-green-200",
      iconColor: "text-green-500",
      hoverEffect: "hover:shadow-green-100",
    },
    {
      title: "Pomodoro Time",
      section: "pomodoro",
      icon: <FaClock size={24} />,
      bgColor: "bg-gradient-to-br from-amber-50 to-amber-100",
      borderColor: "border-amber-200",
      iconColor: "text-amber-500",
      hoverEffect: "hover:shadow-amber-100",
    },
    {
      title: "Total Time",
      section: "overall",
      icon: <FaChartPie size={24} />,
      bgColor: "bg-gradient-to-br from-purple-50 to-purple-100",
      borderColor: "border-purple-200",
      iconColor: "text-purple-500",
      hoverEffect: "hover:shadow-purple-100",
    },
  ];

  const filterLabels = {
    daily: "Daily Average",
    weekly: "Weekly Average",
    monthly: "Monthly Average",
    yearly: "Yearly Average",
    total: "Total Time"
  };

  return (
    <div className="p-4">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <div className="flex items-center gap-2">
          <label className="font-medium text-gray-700">View:</label>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
            <option value="total">Total</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="hourToggle"
            checked={showHours}
            onChange={() => setShowHours(!showHours)}
            className="rounded text-blue-500 focus:ring-blue-500"
          />
          <label htmlFor="hourToggle" className="font-medium text-gray-700">
            Show in hours
          </label>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => (
          <div
            key={card.section}
            className={`
              ${card.bgColor}
              ${card.borderColor}
              ${card.hoverEffect}
              border rounded-xl p-6
              transition-all duration-300
              hover:shadow-xl
            `}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`${card.iconColor} p-2 rounded-lg`}>
                {card.icon}
              </div>
              <h3 className="font-semibold text-gray-700">
                {card.title}
              </h3>
            </div>

            <div className="mt-4">
              <div className="flex flex-col">
                <span className="text-sm text-gray-500 font-medium">
                  {filterLabels[filter]}
                </span>
                <span className={`text-2xl font-bold ${card.iconColor} mt-1`}>
                  {getTimeValue(card.section)} {showHours ? "hrs" : "mins"}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}