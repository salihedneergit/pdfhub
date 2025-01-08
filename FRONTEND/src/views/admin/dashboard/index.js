import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  MdDashboard,
  MdPeople,
  MdInsertDriveFile,
  MdTrendingUp,
} from "react-icons/md";
import {
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  LineChart,
  Line,
  ResponsiveContainer,
  PieChart,
  Pie,
} from "recharts";
import { motion } from "framer-motion";
import Leaderboard from "./components/Leaderboard";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from 'react-router-dom'

import one from '../../../assets/icons/first.png'
import two from '../../../assets/icons/second.png'
import three from '../../../assets/icons/third.png'


  ;/*------------------------------------------
  Reusable Stat Card
------------------------------------------*/
import { LogOut } from "lucide-react";
const StatCard = ({ title, icon, value }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="rounded-[20px] bg-white p-4 shadow-sm"
  >
    <div className="flex items-center">
      <div className="rounded-full bg-[#F4F7FE] p-3 text-[#4318FF]">{icon}</div>
      <div className="ml-4">
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-lg font-bold text-navy-700">{value}</p>
      </div>
    </div>
  </motion.div>
);

/*------------------------------------------
  Reusable List Item
------------------------------------------*/
const ListItem = ({ icon, primaryText, secondaryText }) => {
  return (
    <li className="mb-2 flex items-center justify-between rounded-md p-3 transition hover:bg-gray-50">
      <div className="flex items-center space-x-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-500">
          {icon}
        </div>
        <span className="font-medium">{primaryText}</span>
      </div>
      <span className="text-gray-500">{secondaryText}</span>
    </li>
  );
};








/*------------------------------------------
  Skeleton Loader
  (Displays while data is being fetched)
------------------------------------------*/
const SkeletonLoader = () => {
  const skeletonStatCards = Array.from({ length: 5 }); // for your 5 stat cards

  return (
    <div className="min-h-screen bg-[#F4F7FE] p-6">
      {/* Page Title Skeleton */}
      <div className="mb-8 h-6 w-1/3 animate-pulse rounded bg-gray-300" />

      {/* Skeleton Stat Cards */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3 lg:grid-cols-5">
        {skeletonStatCards.map((_, idx) => (
          <div
            key={idx}
            className="flex items-center rounded-[20px] bg-white p-4 shadow-sm animate-pulse"
          >
            <div className="h-10 w-10 rounded-full bg-gray-200" />
            <div className="ml-4 flex-1">
              <div className="mb-2 h-4 w-24 rounded bg-gray-200" />
              <div className="h-4 w-16 rounded bg-gray-200" />
            </div>
          </div>
        ))}
      </div>

      {/* Skeleton Charts */}
      <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="h-[320px] rounded-[20px] bg-white p-4 shadow-sm animate-pulse" />
        <div className="h-[320px] rounded-[20px] bg-white p-4 shadow-sm animate-pulse" />
      </div>

      {/* Skeleton Lists */}
      <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="h-[200px] rounded-[20px] bg-white p-4 shadow-sm animate-pulse" />
        <div className="h-[200px] rounded-[20px] bg-white p-4 shadow-sm animate-pulse" />
        <div className="h-[200px] rounded-[20px] bg-white p-4 shadow-sm animate-pulse" />
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  const navigate = useNavigate();

  // Existing stats
  const [stats, setStats] = useState(null);
  const [topUsers, setTopUsers] = useState([]);
  const [topCourses, setTopCourses] = useState([]);

  // Additional stats
  const [activeUsers, setActiveUsers] = useState(0);
  const [inactiveUsers, setInactiveUsers] = useState(0);
  const [expiringUsers, setExpiringUsers] = useState([]);
  const [loginCounts, setLoginCounts] = useState([]);
  const [showAllLogins, setShowAllLogins] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Filtered Login Counts based on Search Query
  const filteredLoginCounts = loginCounts.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );


  // Monthly & Weekly chart data (REAL data from API)
  const [monthlyData, setMonthlyData] = useState([]);
  const [weeklyData, setWeeklyData] = useState([]);
  const [yearlyData, setYearlyData] = useState([]);


  // Loading state
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState('');

  // Filter users based on search term
  const filteredUsers = topUsers
    .filter(
      (user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .slice(0, 1000);


  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // 1) Main Stats
        const statsResponse = await axios.get("http://13.51.106.41:3001/api/dashboard/stats");
        // 2) Top Users
        const topUsersResponse = await axios.get("http://13.51.106.41:3001/api/dashboard/top-users");
        // 3) Top Courses
        const topCoursesResponse = await axios.get("http://13.51.106.41:3001/api/dashboard/top-courses");
        // 4) Active/Inactive Users
        const activeInactiveResponse = await axios.get("http://13.51.106.41:3001/api/dashboard/active-inactive");
        // 5) Expiring Subscriptions
        const expiringSubscriptionsResponse = await axios.get("http://13.51.106.41:3001/api/dashboard/expiring-subscriptions");
        // 6) Login Stats
        const loginStatsResponse = await axios.get("http://13.51.106.41:3001/api/dashboard/login-stats");
        // 7) Monthly Progress (real data)
        const monthlyProgressResponse = await axios.get("http://13.51.106.41:3001/api/dashboard/monthly-progress");
        // 8) Weekly Progress (real data)
        const weeklyProgressResponse = await axios.get("http://13.51.106.41:3001/api/dashboard/weekly-progress");
        // 9) yearly progress (real data)
        const yearlyProgressResponse = await axios.get("http://13.51.106.41:3001/api/dashboard/yearly-overview");



        // Update local states
        setStats(statsResponse.data.stats);
        setTopUsers(topUsersResponse.data.topUsers);
        setTopCourses(topCoursesResponse.data.topCourses);

        setActiveUsers(activeInactiveResponse.data.activeUsers);
        setInactiveUsers(activeInactiveResponse.data.inactiveUsers);
        setExpiringUsers(expiringSubscriptionsResponse.data.expiringUsers);
        setLoginCounts(loginStatsResponse.data.loginCounts);

        setMonthlyData(monthlyProgressResponse.data.data);
        setWeeklyData(weeklyProgressResponse.data.data);
        setYearlyData(yearlyProgressResponse.data.data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Show Skeleton while loading
  if (loading) {
    return <SkeletonLoader />;
  }

  const handleLogout = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem('user'));
      const response = await fetch('http://13.51.106.41:3001/api/auth/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: userData._id, deviceId: userData.deviceId }),
      });

      if (response.ok) {
        localStorage.clear();
        toast.success('Logged out successfully');
        navigate('/auth/sign-in');
      } else {
        throw new Error('Logout failed');
      }
    } catch (error) {
      console.error('Logout error:', error);
      localStorage.clear();
      navigate('/auth/sign-in');
    }
  };



  return (
    <div className="min-h-screen bg-[#F4F7FE] p-2">
      {/* <h1 className="mb-8 text-2xl font-bold text-navy-700">Dashboard</h1> */}
      <div className="flex justify-end">
        <button
          onClick={handleLogout}
          className="mb-[30px] flex items-center gap-2 px-4 py-2 text-gray-700 bg-white rounded-lg 
               shadow-sm hover:bg-gray-50 border border-gray-200 transition-colors
               hover:text-red-600 hover:border-red-100 hover:bg-red-50"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>

      {/* Stat Cards Section */}
      {stats && (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3 lg:grid-cols-5">
          <StatCard
            title="Total Users"
            icon={<MdPeople className="h-6 w-6" />}
            value={stats.totalUsers}
          />
          <StatCard
            title="Total Courses"
            icon={<MdDashboard className="h-6 w-6" />}
            value={stats.totalCourses}
          />
          <StatCard
            title="Total PDFs"
            icon={<MdInsertDriveFile className="h-6 w-6" />}
            value={stats.totalPDFs}
          />
          <StatCard
            title="Active Users"
            icon={<MdTrendingUp className="h-6 w-6" />}
            value={activeUsers}
          />
          <StatCard
            title="Inactive Users"
            icon={<MdTrendingUp className="h-6 w-6" />}
            value={inactiveUsers}
          />
        </div>
      )}

      {/* Charts Section */}
      <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-3">

        {/* Yearly Progress (BarChart) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="rounded-[20px] bg-white p-4 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">Yearly Progress</p>
          </div>
          <div className="mt-4 h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={yearlyData.filter((item) => item.year >= 2024)} // Filter data for years 2024 and later
                  dataKey="total"
                  nameKey="year"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#4318FF"
                  label={({ year, total }) => `${year}: ${total}`}
                />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
        {/* Monthly Overview (LineChart) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="rounded-[20px] bg-white p-4 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">Monthly Overview</p>
          </div>
          <div className="mt-4 h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData}>
                <XAxis dataKey="month" />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="total"
                  stroke="#4318FF"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Weekly Progress (BarChart) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="rounded-[20px] bg-white p-4 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">Weekly Progress</p>
          </div>
          <div className="mt-4 h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData}>
                <XAxis dataKey="name" />
                <Tooltip />
                <Bar dataKey="value" fill="#4318FF" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

      </div>


      {/* Lists Section (Top Users, Top Courses, Expiring Subscriptions, and Top Login Stats) */}
      <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-3">
        {/* Top Users */}
        <motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
  className="rounded-[20px] bg-white p-4 shadow-sm"
>
  <h4 className="mb-4 text-lg font-bold text-navy-700">Top Streakers</h4>

  {/* Search Bar */}
  <input
    type="text"
    placeholder="Search users..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    className="mb-4 w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:border-blue-500"
  />

  {/* User List Container with Scroll */}
  <div className="max-h-80 overflow-y-auto">
  <ul className="space-y-3">
    {filteredUsers.length > 0 ? (
      filteredUsers.map((user) => (
        <li
          key={user._id}
          className="flex items-center justify-between rounded-md p-4 hover:bg-gray-100 hover:shadow-md transition-colors"
        >
          {/* User Details */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-500 font-bold">
              {user.name[0].toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800">{user.name}</p>
              <p className="text-xs text-gray-500 truncate max-w-[150px] md:max-w-[200px] overflow-hidden group relative">
                {/* Tooltip for overflowing email */}
                {user.email}
                <span
                  className="absolute bottom-full left-0 hidden w-max max-w-xs p-2 text-xs text-white bg-black rounded opacity-0 group-hover:block group-hover:opacity-100"
                  style={{
                    whiteSpace: "nowrap",
                    zIndex: 10,
                  }}
                >
                  {user.email}
                </span>
              </p>
            </div>
          </div>

          {/* Streak Section */}
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium text-gray-700">
              {user.streak.longestCount} days
            </p>
          </div>
        </li>
      ))
    ) : (
      <li className="text-center text-gray-500">No users found.</li>
    )}
  </ul>
</div>

</motion.div>




        {/* Top Courses */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="rounded-[20px] bg-white p-4 shadow-sm"
        >
          <h4 className="mb-4 text-lg font-bold text-navy-700">Top Courses</h4>
          <ul>
            {topCourses.map((course) => (
              <ListItem
                key={course._id}
                icon={<MdInsertDriveFile />}
                primaryText={course.name}
                secondaryText={`PDFs: ${course.totalPDFs}`}
              />
            ))}
          </ul>
        </motion.div>

        {/* Expiring Subscriptions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="rounded-[20px] bg-white p-4 shadow-sm"
        >
          <h4 className="mb-4 text-lg font-bold text-navy-700">Expiring Soon</h4>
          <ul>
            {expiringUsers.length === 0 ? (
              <li className="text-gray-500">No subscriptions expiring soon</li>
            ) : (
              expiringUsers.map((user) => (
                <ListItem
                  key={user._id}
                  icon={<MdTrendingUp />}
                  primaryText={user.name}
                  secondaryText={
                    user.accessUntil
                      ? `Expires on ${new Date(user.accessUntil).toLocaleDateString()}`
                      : "N/A"
                  }
                />
              ))
            )}
          </ul>
        </motion.div>
      </div>

      {/* Top Leaderboard Stats not finished */}
      <div className="mt-5 grid gap-5 grid-cols-1 md:grid-cols-2 w-full">
      <Leaderboard />
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="rounded-[20px] bg-white p-4 shadow-sm"
  >
    <h4 className="mb-4 text-lg font-bold text-navy-700">
      Top Login Activity
    </h4>

    {/* Search and Show More Section */}
    <div className="mb-4 flex flex-col md:flex-row justify-between items-center gap-2">
      <input
        type="text"
        placeholder="Search user..."
        className="w-full md:w-auto rounded-md border px-4 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-[rgba(67,24,255,0.85)]"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <button
        onClick={() => setShowAllLogins((prev) => !prev)}
        className="rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 w-full md:w-auto"
      >
        {showAllLogins ? "Show Less" : "Show More"}
      </button>
    </div>

    {/* Display Login Counts */}
    <ul className="space-y-3">
      {(showAllLogins ? filteredLoginCounts : filteredLoginCounts.slice(0, 5)).map(
        (item, idx) => (
          <ListItem
            key={idx}
            icon={<MdTrendingUp />}
            primaryText={item.name}
            secondaryText={`Logins: ${item.loginCount}`}
          />
        )
      )}
    </ul>
  </motion.div>
</div>



      <Toaster />
    </div>
  );
};

export default AdminDashboard;
