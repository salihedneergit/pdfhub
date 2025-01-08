/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import toast from "react-hot-toast";
import Modal from "react-modal";
import AnalyticsSection from "./Analytics";
import Avatar from "views/admin/users/components/Avatar";

Modal.setAppElement("#root");

function StreakIcon({ streakCount }) {
  const glowClass =
    streakCount >= 1 ? "animate-fire text-[#ff7b00]" : "text-gray-500";

  return (
    <div className="relative flex items-center space-x-2">
      {/* Fire Glow Effect */}
      {streakCount >= 1 && (
        <div className="animate-fire-glow absolute inset-0 h-8 w-8 rounded-full"></div>
      )}

      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 18 18"
        width="1em"
        height="1em"
        className={`z-10 h-[20px] w-[20px] ${glowClass}`}
        style={{
          fill: streakCount >= 1 ? "#ff7b00" : "none",
          stroke: streakCount >= 1 ? "#ff7b00" : "gray",
        }}
      >
        <path
          fillRule="evenodd"
          d="M7.19 1.564a.75.75 0 01.729.069c2.137 1.475 3.373 3.558 3.981 5.002l.641-.663a.75.75 0 011.17.115c1.633 2.536 1.659 5.537.391 7.725-1.322 2.282-3.915 2.688-5.119 2.688-1.177 0-3.679-.203-5.12-2.688-.623-1.076-.951-2.29-.842-3.528.109-1.245.656-2.463 1.697-3.54.646-.67 1.129-1.592 1.468-2.492.337-.895.51-1.709.564-2.105a.75.75 0 01.44-.583zm.784 2.023c-.1.368-.226.773-.385 1.193-.375.997-.947 2.13-1.792 3.005-.821.851-1.205 1.754-1.282 2.63-.078.884.153 1.792.647 2.645C6.176 14.81 7.925 15 8.983 15c1.03 0 2.909-.366 3.822-1.94.839-1.449.97-3.446.11-5.315l-.785.812a.75.75 0 01-1.268-.345c-.192-.794-1.04-2.948-2.888-4.625z"
          clipRule="evenodd"
        ></path>
      </svg>
      <span className="z-10 font-bold text-gray-800">{streakCount}</span>

      {/* Additional Fire Animation */}
      {streakCount >= 1 && (
        <div className="absolute inset-0 h-12 w-12 animate-pulse rounded-full"></div>
      )}

      {/* Inline CSS */}
      {/* <style jsx>{`
        @keyframes fire {
          0% {
            transform: scale(1);
            opacity: 0.8;
          }
          50% {
            transform: scale(1.3);
            opacity: 1;
          }
          100% {
            transform: scale(1);
            opacity: 0.8;
          }
        }

        @keyframes fire-glow {
          0% {
            transform: scale(1);
            opacity: 0.6;
          }
          50% {
            transform: scale(1.5);
            opacity: 0.9;
          }
          100% {
            transform: scale(1);
            opacity: 0.6;
          }
        }

        .animate-fire {
          animation: fire 1.5s infinite ease-in-out;
        }

        .animate-fire-glow {
          animation: fire-glow 2s infinite ease-in-out;
        }
      `}</style> */}
    </div>
  );
}

// Dashboard Component
function Dashboard() {
  const [user, setUser] = useState(null);
  const [timeOfDay, setTimeOfDay] = useState("");
  const [greeting, setGreeting] = useState("");
  const [email, setEmail] = useState(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    return storedUser?.email || "email";
  });
  const [streak, setStreak] = useState({
    streakCount: 0,
    lastActivity: "",
    activity: [],
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const generateGoogleColor = () => {
    const googleColors = [
      "bg-red-500",
      "bg-blue-500",
      "bg-yellow-500",
      "bg-green-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-orange-500",
      "bg-teal-500",
    ];
    return googleColors[Math.floor(Math.random() * googleColors.length)];
  };
  const [imageFailed, setImageFailed] = useState(false);
  const firstLetter = email ? email[0].toUpperCase() : "?";
  const colorClass = React.useMemo(() => generateGoogleColor(), []);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (!userData) {
      navigate("/auth/sign-in");
      return;
    }

    setUser(userData);

    const hour = new Date().getHours();
    if (hour < 12) {
      setTimeOfDay("morning");
      setGreeting("Good Morning");
    } else if (hour < 17) {
      setTimeOfDay("afternoon");
      setGreeting("Good Afternoon");
    } else {
      setTimeOfDay("evening");
      setGreeting("Good Evening");
    }

    fetchStreak(userData._id);
  }, [navigate]);

  const fetchStreak = async (userId) => {
    try {
      const response = await fetch(
        `http://13.51.106.41:3001/api/users/${userId}/streak`
      );
      const data = await response.json();
      if (data.success && data.streak) {
        setStreak(data.streak);
      } else {
        toast.error("Failed to fetch streak data");
      }
    } catch (error) {
      console.error("Error fetching streak:", error);
      toast.error("Error fetching streak data");
    }
  };

  const handleLogout = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem("user"));
      const response = await fetch("http://13.51.106.41:3001/api/auth/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: userData._id,
          deviceId: userData.deviceId,
        }),
      });

      if (response.ok) {
        localStorage.clear();
        toast.success("Logged out successfully");
        navigate("/auth/sign-in");
      } else {
        throw new Error("Logout failed");
      }
    } catch (error) {
      console.error("Logout error:", error);
      localStorage.clear();
      navigate("/auth/sign-in");
    }
  };

  const handleModalOpen = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  if (!user) return null;
  return (
    <div className="min-h-screen ">
      <div className="max-w-1xl mx-auto p-6">
        {/* Header with Streak Display and Logout */}
        <div className="mb-4 flex items-center justify-between">
          <div
            className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 
           py-2 text-gray-700 shadow-sm transition-colors hover:cursor-pointer"
            onClick={handleModalOpen}
          >
            <StreakIcon
              streakCount={streak.streakCount}
              strokeColor={
                streak.streakCount >= 7
                  ? "#ff7b00"
                  : streak.streakCount >= 3
                  ? "#ff7b00"
                  : "#6b7280"
              }
              fillColor={
                streak.streakCount >= 7
                  ? "#ff7b00"
                  : streak.streakCount >= 3
                  ? "#ff7b00"
                  : "#6b7280"
              }
              fill={true}
              size={24}
            />
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 
                     py-2 text-gray-700 shadow-sm transition-colors hover:border-red-100
                     hover:bg-gray-50 hover:bg-red-50 hover:text-red-600"
          >
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </button>
        </div>

        {/* Greeting Card */}
        <div className="mt-8 rounded-2xl border border-indigo-50 bg-white p-8 shadow-lg">
  {/* Grid container: 1 col on mobile, 2 cols on desktop */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
    {/* Text Content */}
    <div className="order-2 md:order-1 text-center md:text-left">
      <h2 className="text-xl md:text-2xl font-medium text-gray-700">
        {greeting},
      </h2>
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
        {user.name}{" "}
        <span className="animate-wave ml-2 inline-block">👋</span>
      </h1>
      <p className="text-base md:text-lg text-gray-600">
        Welcome back to your dashboard! Your current streak is{" "}
        <span className="font-bold text-blue-600">
          {streak.streakCount}
        </span>{" "}
        days.
      </p>
    </div>

    {/* Profile Image */}
    {user.picture && (
      <div className="order-1 md:order-2 flex justify-center md:justify-end">
        <div className="relative h-16 w-16 sm:h-20 sm:w-20 md:h-24 md:w-24">
          {/* Fallback content */}
          <div
            className={`absolute inset-0 flex items-center justify-center rounded-full font-bold text-white ${colorClass} ${
              imageFailed ? "block" : "hidden"
            }`}
          >
            <span className="text-3xl sm:text-4xl md:text-5xl">
              {firstLetter}
            </span>
          </div>

          {/* Profile Image */}
          <img
            src={user.picture}
            alt={user.name}
            className={`h-16 w-16 rounded-full border-2 border-white shadow-lg ${
              imageFailed ? "hidden" : "block"
            } sm:h-20 sm:w-20 md:h-24 md:w-24`}
            onError={() => setImageFailed(true)}
            onLoad={() => setImageFailed(false)}
          />
        </div>
      </div>
    )}
  </div>
</div>
</div>

      {/* Streak Modal */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={handleModalClose}
        className="relative mx-auto w-full max-w-md rounded-[10px] bg-white p-6 shadow-xl dark:bg-gray-800"
        overlayClassName="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Activity Streak
          </h2>
          <button
            onClick={handleModalClose}
            className="rounded-full p-2 text-gray-600 hover:text-gray-900 dark:hover:text-white"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Longest Streak Section */}
        <div className="mb-6">
          <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
            Your longest streak is{" "}
            <span className="font-bold text-green-600">
              {streak.longestCount}
            </span>{" "}
            days.
          </p>
        </div>

        {/* Weekly Activity Streak */}
        <div className="grid grid-cols-7 gap-2 text-center">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
            (day, index) => {
              // Filter streak.activity to include only the last 7 days
              const filteredActivity = streak.activity.filter((a) => {
                const activityDate = new Date(a.date);
                const today = new Date();
                const differenceInDays =
                  (today - activityDate) / (1000 * 60 * 60 * 24);
                return differenceInDays <= 7; // Include only last 7 days
              });

              const activityForDay = filteredActivity.find(
                (a) => a.day === day
              );

              // Highlight the current day
              const isToday =
                new Date().toLocaleDateString("en-US", { weekday: "short" }) ===
                day;

              return (
                <div
                  key={index}
                  className={`flex h-10 w-10 items-center justify-center rounded-full p-2 text-sm font-semibold ${
                    activityForDay && activityForDay.active
                      ? isToday
                        ? "bg-yellow-500 text-white" // Highlight current day
                        : "bg-green-500 text-white"
                      : "bg-gray-300 text-gray-600"
                  }`}
                >
                  {day}
                </div>
              );
            }
          )}
        </div>

        {/* Close Button */}
        <div className="mt-6 flex justify-end gap-4">
          <button
            onClick={handleModalClose}
            className="rounded-[10px] bg-[#4318ffd9] px-6 py-2 text-white
                     transition-colors duration-200 hover:bg-[#4318ffd9]/90
                     disabled:cursor-not-allowed disabled:opacity-50"
          >
            Close
          </button>
        </div>
      </Modal>
      <AnalyticsSection />
    </div>
  );
}

export default Dashboard;
