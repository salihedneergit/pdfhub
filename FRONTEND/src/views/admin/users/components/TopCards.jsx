import React, { useState, useMemo } from "react";
import {
  FaChartPie,
  FaClock,
  FaTasks,
  FaBook,
  FaNetworkWired,
  FaSignInAlt,
  FaCalendarAlt,
  FaTimes,
} from "react-icons/fa";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import { format } from "date-fns";
import { motion } from "framer-motion";

function TopCards({ coursesTimeData, userDetails }) {
  const [popupType, setPopupType] = useState(null);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [ipDetailsDialog, setIpDetailsDialog] = useState({
    open: false,
    data: null,
    loading: false,
  });
  const [todosFilter, setTodosFilter] = useState("all"); // 'all', 'completed', 'archived'

  const fetchIpDetails = async (ip) => {
    try {
      setIpDetailsDialog({ open: true, data: null, loading: true });
      const response = await fetch(
        `https://ipinfo.io/${ip}?token=34a576fcfd0894`
      );
      const data = await response.json();
      setIpDetailsDialog({ open: true, data, loading: false });
    } catch (error) {
      console.error("Error fetching IP details:", error);
      setIpDetailsDialog({ open: true, data: null, loading: false });
    }
  };

  const isValidDate = (date) => {
    return date instanceof Date && !isNaN(date);
  };

  const parseTime = (timeStr) => {
    const parsed = parseFloat(timeStr || "0");
    return parsed < 0 ? 0 : parsed;
  };

  const {
    coursesTotal,
    coursesAvg,
    taskCompletionRatio,
    coursesRegistered,
    uniqueIPs,
    totalLogins,
    completedTasks,
    totalTasks,
    registeredIp,
    longestStreak,
    loginCounts,
  } = useMemo(() => {
    const { totalTime: cTotal = 0, days: cDays = 0 } = coursesTimeData
      ? Object.values(coursesTimeData).reduce(
          (acc, dates) => {
            Object.values(dates).forEach((time) => {
              acc.totalTime += parseTime(time);
              acc.days++;
            });
            return acc;
          },
          { totalTime: 0, days: 0 }
        )
      : { totalTime: 0, days: 0 };

    const cAvg = cDays > 0 ? cTotal / cDays : 0;

    const ratio = cTotal > 0 ? (100 / cTotal) * 90 : 0;

    const coursesRegistered = userDetails?.courseSelection || [];
    const uniqueIPs =
      userDetails?.flagged?.ipFlag?.map((flag) => flag.ip) || [];
    const totalLogins = userDetails?.loginHistory?.length || 0;
    const registeredIp = userDetails?.registeredIp || [];
    const totalTasks = userDetails?.todos ? userDetails?.todos.length : 0;
    const completedTasks = userDetails?.todos
      ? userDetails.todos.filter((task) => task.completed).length
      : 0;

    const loginCounts = totalLogins;
    const longestStreak = userDetails?.streak?.longestCount || 0;

    return {
      coursesTotal: cTotal,
      coursesAvg: cAvg,
      taskCompletionRatio: ratio,
      coursesRegistered,
      uniqueIPs,
      totalLogins,
      completedTasks,
      totalTasks,
      registeredIp,
      longestStreak,
      loginCounts,
    };
  }, [coursesTimeData, userDetails]);

  const showPopup = (type) => {
    setPopupType(type);
    setIsPopupVisible(true);
  };

  const closePopup = () => {
    setIsPopupVisible(false);
    setPopupType(null);
    setTodosFilter("all");
  };

  const filteredTodos = useMemo(() => {
    if (!userDetails?.todos) return [];
    const todos = userDetails.todos.map((todo) => ({
      ...todo,
      priority: todo.priority || "normal",
      dueDate: todo.dueDate ? new Date(todo.dueDate) : null,
    }));

    switch (todosFilter) {
      case "completed":
        return todos.filter((todo) => todo.completed && !todo.archived);
      case "archived":
        return todos.filter((todo) => todo.archived);
      default:
        return todos.filter((todo) => !todo.archived);
    }
  }, [userDetails?.todos, todosFilter]);

  return (
    <div className=" bg-[#F4F7FE] p-2 mb-3">
   
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3 lg:grid-cols-4">
        {/* Total Study Time */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="rounded-[20px] bg-white p-4 shadow-sm"
        >
          <div className="flex items-center">
            <div className="rounded-full bg-[rgba(67,24,255,0.15)] p-3 text-[rgba(67,24,255,0.85)]">
              <FaChartPie className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Total Study Time
              </p>
              <p className="text-lg font-bold text-navy-700">
                {coursesTotal.toFixed(2)} mins
              </p>
            </div>
          </div>
        </motion.div>

        {/* Daily Average */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="rounded-[20px] bg-white p-4 shadow-sm"
        >
          <div className="flex items-center">
            <div className="rounded-full bg-[rgba(67,24,255,0.15)] p-3 text-[rgba(67,24,255,0.85)]">
              <FaClock className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Daily Average</p>
              <p className="text-lg font-bold text-navy-700">
                {coursesAvg.toFixed(2)} mins
              </p>
            </div>
          </div>
        </motion.div>

        {/* Task Completion */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="cursor-pointer rounded-[20px] bg-white p-4 shadow-sm"
          onClick={() => showPopup("todos")}
        >
          <div className="flex items-center">
            <div className="rounded-full bg-[rgba(67,24,255,0.15)] p-3 text-[rgba(67,24,255,0.85)]">
              <FaTasks className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Task Completion
              </p>
              <p className="text-lg font-bold text-navy-700">
                {completedTasks} / {totalTasks} (
                {((completedTasks / totalTasks) * 100 || 0).toFixed(2)}%)
              </p>
            </div>
          </div>
        </motion.div>

        {/* Courses Registered */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="cursor-pointer rounded-[20px] bg-white p-4 shadow-sm"
          onClick={() => showPopup("courses")}
        >
          <div className="flex items-center">
            <div className="rounded-full bg-[rgba(67,24,255,0.15)] p-3 text-[rgba(67,24,255,0.85)]">
              <FaBook className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Courses Registered
              </p>
              <p className="text-lg font-bold text-navy-700">
                {coursesRegistered.length}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Unique IPs Detected */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="cursor-pointer rounded-[20px] bg-white p-4 shadow-sm"
          onClick={() => showPopup("ips")}
        >
          <div className="flex items-center">
            <div className="rounded-full bg-[rgba(67,24,255,0.15)] p-3 text-[rgba(67,24,255,0.85)]">
              <FaNetworkWired className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Unique IPs Detected
              </p>
              <p className="text-lg font-bold text-navy-700">
                {uniqueIPs.length}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Registered IPs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="cursor-pointer rounded-[20px] bg-white p-4 shadow-sm"
          onClick={() => fetchIpDetails(registeredIp)}
        >
          <div className="flex items-center">
            <div className="rounded-full bg-[rgba(67,24,255,0.15)] p-3 text-[rgba(67,24,255,0.85)]">
              <FaSignInAlt className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Registered IPs
              </p>
              <p className="text-lg font-bold text-navy-700">{registeredIp}</p>
            </div>
          </div>
        </motion.div>

        {/* Total Login Counts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="rounded-[20px] bg-white p-4 shadow-sm"
        >
          <div className="flex items-center">
            <div className="rounded-full bg-[rgba(67,24,255,0.15)] p-3 text-[rgba(67,24,255,0.85)]">
              <FaSignInAlt className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Login Counts</p>
              <p className="text-lg font-bold text-navy-700">{loginCounts}</p>
            </div>
          </div>
        </motion.div>

        {/* Longest Streak */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="rounded-[20px] bg-white p-4 shadow-sm"
        >
          <div className="flex items-center">
            <div className="rounded-full bg-[rgba(67,24,255,0.15)] p-3 text-[rgba(67,24,255,0.85)]">
              <FaCalendarAlt className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Longest Streak
              </p>
              <p className="text-lg font-bold text-navy-700">
                {longestStreak} days
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Popup Dialog */}
      {isPopupVisible && (
        <div
        className="bg-black fixed inset-0 z-50 flex items-center justify-center bg-opacity-50 backdrop-blur-sm"
        onClick={closePopup}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-md rounded-[20px] bg-white p-6 shadow-lg"
          onClick={(e) => e.stopPropagation()} // Prevent click propagation to the background
        >
{/*       
      <button
  onClick={closePopup}
  className="absolute top-2 right-2 bg-white rounded-full p-2 text-red-500 shadow-md hover:text-red-700 hover:shadow-lg transition"
  style={{ transform: "translate(-50%, -50%)" }}
>
  <FaTimes className="h-5 w-5" />
</button> */}


            {popupType === "ips" && (
              <div>
                <h2 className="mb-4 text-xl font-bold text-[rgba(67,24,255,0.85)]">
                  Unique IPs Detected
                </h2>
                <div className="space-y-2">
                  {uniqueIPs.length > 0 ? (
                    uniqueIPs.map((ip, index) => (
                      <button
                        key={index}
                        onClick={() => fetchIpDetails(ip)}
                        className="w-full rounded-lg bg-gray-100 p-3 text-left text-gray-800 shadow-sm transition hover:bg-gray-200"
                      >
                        {ip}
                      </button>
                    ))
                  ) : (
                    <p className="text-center italic text-gray-500">
                      No unique IPs detected.
                    </p>
                  )}
                </div>
              </div>
            )}

{popupType === "courses" && (
  <div>
    <h2 className="mb-4 text-xl font-bold text-[rgba(67,24,255,0.85)]">
      Courses Registered
    </h2>
    <ul className="list-disc space-y-2 pl-6">
      {coursesRegistered.map((course, index) => (
        <li key={index} className="text-gray-600">
          {course.courseName} - {new Date(course.expiryDate).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </li>
      ))}
    </ul>
  </div>
)}


{popupType === "todos" && (
  <div>
    <h2 className="mb-4 text-xl font-bold text-[rgba(67,24,255,0.85)]">
      Todo List
    </h2>

    {/* Filter Buttons */}
    <div className="mb-4 flex justify-center gap-3">
      <button
        onClick={() => setTodosFilter("all")}
        className={`rounded-lg border px-4 py-2 ${
          todosFilter === "all"
            ? "bg-[rgba(67,24,255,0.85)] text-white"
            : "bg-gray-100 text-gray-600"
        } transition-all`}
      >
        Active
      </button>
      <button
        onClick={() => setTodosFilter("completed")}
        className={`rounded-lg border px-4 py-2 ${
          todosFilter === "completed"
            ? "bg-green-500 text-white"
            : "bg-gray-100 text-gray-600"
        } transition-all`}
      >
        Completed
      </button>
      <button
        onClick={() => setTodosFilter("archived")}
        className={`rounded-lg border px-4 py-2 ${
          todosFilter === "archived"
            ? "bg-red-500 text-white"
            : "bg-gray-100 text-gray-600"
        } transition-all`}
      >
        Archived
      </button>
    </div>

    {/* ToDo Items */}
    <div className="max-h-80 space-y-4 overflow-y-auto">
      {filteredTodos.length > 0 ? (
        filteredTodos.map((todo) => (
          <div
            key={todo._id}
            className={`rounded-lg border p-4 shadow-sm transition hover:shadow-md ${
              todo.completed
                ? "bg-green-100 border-green-300"
                : todo.archived
                ? "bg-red-100 border-red-300"
                : "bg-gray-100"
            }`}
          >
            <h3 className="text-lg font-semibold text-gray-800">{todo.title}</h3>
            <p className="text-sm text-gray-600">{todo.taskName}</p>
            <div className="mt-2 text-sm text-gray-500">
              <p>
                Status:{" "}
                <span
                  className={`font-medium ${
                    todo.completed
                      ? "text-green-700"
                      : todo.archived
                      ? "text-red-700"
                      : "text-gray-700"
                  }`}
                >
                  {todo.completed
                    ? "Completed"
                    : todo.archived
                    ? "Archived"
                    : "Pending"}
                </span>
              </p>
              <p>
                Due:{" "}
                {isValidDate(todo.dueDate)
                  ? format(todo.dueDate, "MMM dd, yyyy")
                  : "No due date"}
              </p>
            </div>
          </div>
        ))
      ) : (
        <p className="text-center italic text-gray-500">
          No todos found in this category.
        </p>
      )}
    </div>
  </div>
)}


          </motion.div>
        </div>
      )}

      {/* IP Details Dialog */}
      <Dialog
        open={ipDetailsDialog.open}
        onClose={() =>
          setIpDetailsDialog({ open: false, data: null, loading: false })
        }
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            borderRadius: 8,
            boxShadow: 5,
          },
        }}
      >
        <DialogTitle
          sx={{
            fontSize: "1.25rem",
            fontWeight: 600,
            textAlign: "center",
            padding: "16px 24px",
            borderBottom: "1px solid #e0e0e0",
          }}
        >
          IP Address Details
        </DialogTitle>
        <DialogContent
          sx={{
            padding: "24px",
            backgroundColor: "#fafafa",
          }}
        >
          {ipDetailsDialog.loading ? (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              height="200px"
            >
              <CircularProgress />
            </Box>
          ) : ipDetailsDialog.data ? (
            <Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  textAlign: "center",
                  marginBottom: 2,
                  color: "#424242",
                }}
              >
                IP Address: {ipDetailsDialog.data.ip}
              </Typography>
              <Box
                sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 3 }}
              >
                <Typography variant="body2" sx={{ color: "#616161" }}>
                  <strong>ISP/Org:</strong> {ipDetailsDialog.data.org || "N/A"}
                </Typography>
                <Typography variant="body2" sx={{ color: "#616161" }}>
                  <strong>Region:</strong>{" "}
                  {ipDetailsDialog.data.region || "N/A"}
                </Typography>
                <Typography variant="body2" sx={{ color: "#616161" }}>
                  <strong>City:</strong> {ipDetailsDialog.data.city || "N/A"}
                </Typography>
                <Typography variant="body2" sx={{ color: "#616161" }}>
                  <strong>Postal:</strong>{" "}
                  {ipDetailsDialog.data.postal || "N/A"}
                </Typography>
                <Typography variant="body2" sx={{ color: "#616161" }}>
                  <strong>Country:</strong>{" "}
                  {ipDetailsDialog.data.country || "N/A"}
                </Typography>
                <Typography variant="body2" sx={{ color: "#616161" }}>
                  <strong>Time Zone:</strong>{" "}
                  {ipDetailsDialog.data.timezone || "N/A"}
                </Typography>
                {ipDetailsDialog.data.loc &&
                  (() => {
                    const [lat, lon] = ipDetailsDialog.data.loc.split(",");
                    return (
                      <>
                        <Typography variant="body2" sx={{ color: "#616161" }}>
                          <strong>Latitude:</strong> {lat}
                        </Typography>
                        <Typography variant="body2" sx={{ color: "#616161" }}>
                          <strong>Longitude:</strong> {lon}
                        </Typography>
                      </>
                    );
                  })()}
              </Box>
            </Box>
          ) : (
            <Typography
              variant="body1"
              color="error"
              align="center"
              sx={{ marginTop: "20px", color: "#d32f2f" }}
            >
              Unable to fetch IP details.
            </Typography>
          )}
        </DialogContent>
        <DialogActions
          sx={{
            padding: "12px 24px",
            justifyContent: "flex-end",
            borderTop: "1px solid #e0e0e0",
          }}
        >
          <Button
            onClick={() =>
              setIpDetailsDialog({ open: false, data: null, loading: false })
            }
            sx={{
              textTransform: "none",
              fontWeight: 600,
              color: "#1976d2",
              padding: "8px 16px",
              borderRadius: 4,
              "&:hover": {
                backgroundColor: "#e3f2fd",
              },
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default TopCards;
