/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import {
  Clock,
  Monitor,
  Smartphone,
  X,
  Shield,
  ShieldAlert,
  MoreVertical,
  LogOut,
  Laptop,
  AlertCircle,
  LogIn,
  Trash2,
  MapPinned,
} from "lucide-react";
import toast from "react-hot-toast";
import Modal from "react-modal";
import jsPDF from "jspdf";
import "jspdf-autotable";
import AnalyticsSection from "./AnalyticsSection"
import Avatar from "./components/Avatar";

Modal.setAppElement("#root");

function UserTable() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSkeleton, setShowSkeleton] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [accessDate, setAccessDate] = useState("");
  const [currentUserId, setCurrentUserId] = useState(null);
  const [courses, setCourses] = useState([]);
  const [selectedCourses, setSelectedCourses] = useState([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(20);

  const [showAnalyticsPopup, setShowAnalyticsPopup] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

  const [showAnalytics, setShowAnalytics] = useState(false)

  // Function to open the analytics modal
  const openAnalyticsModal = (userId) => {
    setSelectedUserId(userId);
    // setShowAnalytics(true); 
    window.location.assign(`http://13.51.106.41:3001/admin/users/${userId}`);
  };

  // Function to close the analytics modal
  const closeAnalyticsModal = () => {
    setShowAnalytics(false); // Hide the modal
  };


  const handleUserSelect = (user) => {
    setSelectedUser(user);
    setShowSidebar(true);
  };

  const handleAnalyticsPopup = (userId) => {
    setSelectedUserId(userId);
    setShowAnalyticsPopup(true);
  };

  const generatePDF = async (user) => {
    try {
      const response = await fetch(
        `http://13.51.106.41:3001/api/users/${user._id}/details`
      );
      const userDetails = await response.json();

      if (userDetails.success) {
        const doc = new jsPDF();

        // Set title and basic user info
        doc.setFontSize(20);
        doc.text("User Login History Report", 14, 15);

        doc.setFontSize(12);
        doc.text(`Name: ${userDetails.user.name}`, 14, 25);
        doc.text(`Email: ${userDetails.user.email}`, 14, 32);

        // Add Login History Section
        const startY = 40; // Starting position for the login history table
        doc.setFontSize(14);
        doc.text("Login History", 14, startY);

        if (userDetails.user.loginHistory?.length > 0) {
          const loginHistoryData = userDetails.user.loginHistory.map(
            (session) => [
              new Date(session.loginTime).toLocaleString(),
              session.logoutTime
                ? new Date(session.logoutTime).toLocaleString()
                : "Active",
              session.deviceInfo?.os || "Unknown OS",
              session.deviceInfo?.browser || "Unknown Browser",
              session.ip || "Unknown IP",
            ]
          );

          doc.autoTable({
            head: [
              ["Login Time", "Logout Time", "OS", "Browser", "IP Address"],
            ],
            body: loginHistoryData,
            startY: startY + 5,
            theme: "grid",
            styles: {
              fontSize: 10,
              cellPadding: 4,
            },
            headStyles: {
              fillColor: [67, 160, 255], // Blue header
              textColor: [255, 255, 255], // White text
            },
            alternateRowStyles: {
              fillColor: [240, 240, 240], // Light gray alternate rows
            },
          });
        } else {
          doc.setFontSize(12);
          doc.text("No login history available.", 14, startY + 5);
        }

        // Save the PDF
        doc.save(`${userDetails.user.name}_LoginHistory.pdf`);
      } else {
        throw new Error("Failed to fetch user details.");
      }
    } catch (error) {
      console.error("Error generating report:", error);
      toast.error("Error generating report. Please try again.");
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://13.51.106.41:3001/api/users");
        const data = await response.json();
        if (data.success) {
          setUsers(data.users);
        } else {
          toast.error("Failed to fetch users");
        }
      } catch (error) {
        toast.error("Error loading users");
      } finally {
        setTimeout(() => {
          setLoading(false);
          setShowSkeleton(false);
        }, 100);
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch(
          "http://13.51.106.41:3001/api/course/courses"
        );
        const data = await response.json();
        if (data.courses && Array.isArray(data.courses)) {
          setCourses(data.courses); // Set the courses in state
        } else {
          toast.error("Invalid response format for courses");
        }
      } catch (error) {
        toast.error("Error fetching courses");
      }
    };

    fetchCourses();
  }, []);

  const handleCourseSelection = (courseName, isSelected, expiryDate = null) => {
    setSelectedCourses((prev) => {
      if (isSelected) {
        const updatedCourses = [...prev];
        const existingCourse = updatedCourses.find((c) => c.courseName === courseName);
        if (existingCourse) {
          existingCourse.expiryDate = expiryDate; // Update expiry date
        } else {
          updatedCourses.push({ courseName, expiryDate }); // Add new course
        }
        return updatedCourses;
      } else {
        return prev.filter((course) => course.courseName !== courseName); // Remove course
      }
    });
  };
  
  const handleExpiryDateChange = (courseName, expiryDate) => {
    setSelectedCourses((prev) =>
      prev.map((course) =>
        course.courseName === courseName ? { ...course, expiryDate } : course
      )
    );
  };
  
  

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "active" && user.isActive) ||
      (filterStatus === "blocked" && !user.isActive);

    return matchesSearch && matchesStatus;
  });

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const handleUnblockClick = async (userId) => {
    setCurrentUserId(userId);
    setIsModalOpen(true);
  
    try {
      const response = await fetch(`http://13.51.106.41:3001/api/usersDetails/${userId}`);
      const data = await response.json();
  
      if (data.success && data.user) {
        // Transform courseSelection data into the expected format
        const transformedCourses = (data.user.courseSelection || []).map((course) => ({
          courseName: course.courseName,
          expiryDate: course.expiryDate ? new Date(course.expiryDate).toISOString().split("T")[0] : "",
        }));
  
        setSelectedCourses(transformedCourses); // Set courses with expiry dates
        setAccessDate(
          data.user.accessUntil
            ? new Date(data.user.accessUntil).toISOString().split("T")[0]
            : ""
        );
      } else {
        toast.error("Failed to fetch user details");
      }
    } catch (error) {
      toast.error("Error fetching user details");
    }
  };
  
  
  

  const handleUnblockSubmit = async () => {
    if (!accessDate || new Date(accessDate) <= new Date()) {
      toast.error("Please select a valid date greater than today");
      return;
    }
  
    if (
      selectedCourses.some(
        (course) =>
          !course.expiryDate || new Date(course.expiryDate) <= new Date()
      )
    ) {
      toast.error("Please provide valid expiry dates for all selected courses");
      return;
    }
  
    try {
      const response = await fetch(
        `http://13.51.106.41:3001/api/users/${currentUserId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            accessUntil: accessDate,
            courses: selectedCourses,
          }),
        }
      );
  
      const data = await response.json();
  
      if (data.success) {
        setUsers(
          users.map((user) =>
            user._id === currentUserId
              ? {
                  ...user,
                  isActive: true,
                  accessUntil: accessDate,
                  courseSelection: selectedCourses,
                }
              : user
          )
        );
        toast.success("User unblocked successfully");
        setIsModalOpen(false);
      } else {
        toast.error("Failed to unblock user");
      }
    } catch (error) {
      toast.error("Error unblocking user");
    }
  };
  
  
  

  const toggleUserStatus = async (userId, currentStatus) => {
    if (!currentStatus) {
      handleUnblockClick(userId); // Show modal for unblocking
      return;
    }
    try {
      const response = await fetch(
        `http://13.51.106.41:3001/api/users/${userId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ isActive: !currentStatus }),
        }
      );

      const data = await response.json();

      if (data.success) {
        setUsers(
          users.map((user) =>
            user._id === userId ? { ...user, isActive: !user.isActive } : user
          )
        );
        // Fix the toast message
        toast.success(
          `User ${currentStatus ? "blocked" : "unblocked"} successfully`
        );
      } else {
        toast.error("Failed to update user status");
      }
    } catch (error) {
      toast.error("Error updating user status");
    }
  };

  const deleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      const response = await fetch(
        `http://13.51.106.41:3001/api/users/${userId}`,
        {
          method: "DELETE",
        }
      );
      const data = await response.json();

      if (data.success) {
        setUsers(users.filter((user) => user._id !== userId));
        toast.success("User deleted successfully");
      } else {
        toast.error("Failed to delete user");
      }
    } catch (error) {
      toast.error("Error deleting user");
    }
  };

  const getDeviceIcon = (userAgent) => {
    if (!userAgent) return <Monitor className="h-4 w-4" />;
    if (userAgent.toLowerCase().includes("mobile")) {
      return <Smartphone className="h-4 w-4" />;
    }
    if (userAgent.toLowerCase().includes("macintosh")) {
      return <Laptop className="h-4 w-4" />;
    }
    return <Monitor className="h-4 w-4" />;
  };

  const formatDuration = (loginTime, logoutTime) => {
    if (!logoutTime) return "Active";
    const duration = new Date(logoutTime) - new Date(loginTime);
    const minutes = Math.floor(duration / 60000);
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ${minutes % 60}m`;
  };

  

  const SessionSidebar = ({ user, onClose }) => {
    if (!user) return null;

    return (
      <div className="fixed inset-y-0 right-0 z-50 w-full transform overflow-hidden bg-white shadow-2xl transition-transform duration-300 ease-in-out md:w-96">
        <div className="h-full overflow-y-auto">
          {/* Header */}
          <div className="relative bg-gradient-to-r from-[#4318FF] to-[#9f87ff] p-6 text-white">
            <div className="absolute right-0 top-0 mr-4 mt-4">
              <button
                onClick={onClose}
                className="rounded-full p-2 transition-colors hover:bg-white/20"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="mt-6 flex items-center space-x-4">
              <div className="relative">
                {/* <img
                  src={user.picture}
                  onError={(e) =>
                    (e.target.src =
                      "https://via.placeholder.com/96?text=No+Image")
                  }
                  alt=""
                  className="h-16 w-16 rounded-full border-2 border-white shadow-lg"
                /> */}

<Avatar name={user.name} email={user.email} picture={user.picture} />

                {user.isBlocked && (
                  <div className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1">
                    <ShieldAlert className="h-4 w-4 text-white" />
                  </div>
                )}
              </div>
              <div>
                <h3 className="text-lg font-semibold">{user.name}</h3>
                <p className="text-sm opacity-90">{user.email}</p>
                <div
                  className={`mt-2 inline-flex items-center space-x-1 rounded-full px-3 py-1 text-sm
                  ${
                    user.isBlocked
                      ? "bg-red-400/20 text-red-100"
                      : "bg-green-400/20 text-green-100"
                  }`}
                >
                  {user.isBlocked ? (
                    <ShieldAlert className="h-3 w-3" />
                  ) : (
                    <Shield className="h-3 w-3" />
                  )}
                  <span>{user.isBlocked ? "Blocked" : "Active"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Current Session */}
          {user.currentSession && (
            <div className="border-b p-6">
              <h3 className="mb-4 flex items-center text-lg font-semibold text-gray-800">
                <Clock className="mr-2 h-5 w-5 text-blue-600" />
                Current/Last Session
              </h3>
              <div className="rounded-lg border border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50 p-4">
                <div className="mb-3 flex items-center space-x-2">
                  {getDeviceIcon(user.currentSession.deviceInfo?.browser)}
                  <span className="font-medium text-blue-800">
                    {user.currentSession.deviceInfo?.browser?.split(" ")[0]}
                  </span>
                </div>
                <div className="space-y-2">
                  <p className="flex items-center text-sm text-gray-600">
                    <Monitor className="mr-2 h-4 w-4" />
                    OS: {user.currentSession.deviceInfo?.os}
                  </p>
                  <p className="flex items-center text-sm text-gray-600">
                    <MapPinned className="mr-2 h-4 w-4" />
                    IP: {user.currentSession?.ip}
                  </p>
                  <p className="flex items-center text-sm text-gray-600">
                    <Clock className="mr-2 h-4 w-4" />
                    Started:{" "}
                    {new Date(user.currentSession.lastLogin).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Login History */}
          <div className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="flex items-center text-lg font-semibold text-gray-800">
                <Clock className="mr-2 h-5 w-5 text-purple-600" />
                Login History
              </h3>
              <button
                onClick={() => generatePDF(user)} // Call your generatePDF function
                className="rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600"
              >
                Export PDF
              </button>
            </div>
            <div className="space-y-4">
              {user.loginHistory?.map((session, index) => (
                <div
                  key={session._id || index}
                  className="rounded-lg border p-4 transition-colors hover:bg-gray-50"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {getDeviceIcon(session.deviceInfo?.browser)}
                      <span className="font-medium text-gray-800">
                        {session.deviceInfo?.browser?.split(" ")[0]}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500">
                      {formatDuration(session.loginTime, session.logoutTime)}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Monitor className="h-4 w-4 text-blue-600" />
                      <span>OS: {session.deviceInfo?.os || "Unknown OS"}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <MapPinned className="h-4 w-4 text-red-400" />
                      <span>IP: {session?.ip || "Unknown IP"}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <LogIn className="h-4 w-4 text-green-600" />
                      <span>
                        {new Date(session.loginTime).toLocaleString()}
                      </span>
                    </div>
                    {session.logoutTime && (
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <LogOut className="h-4 w-4 text-red-600" />
                        <span>
                          {new Date(session.logoutTime).toLocaleString()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderSkeleton = () => (
    <div className="space-y-4">
      {[...Array(5)].map((_, index) => (
        <div
          key={index}
          className="animate-pulse rounded-lg bg-white p-4 shadow"
        >
          <div className="flex items-center space-x-4">
            <div className="h-12 w-12 rounded-full bg-gray-200"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 w-1/4 rounded bg-gray-200"></div>
              <div className="h-3 w-1/2 rounded bg-gray-200"></div>
            </div>
            <div className="h-8 w-24 rounded bg-gray-200"></div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderTableSkeleton = () => (
    <div className="overflow-hidden rounded-lg shadow">
      <div className="animate-pulse">
        <div className="h-16 bg-gray-200"></div>
        {[...Array(5)].map((_, index) => (
          <div key={index} className="flex border-t border-gray-200">
            <div className="w-16 p-4">
              <div className="h-12 w-12 rounded-full bg-gray-200"></div>
            </div>
            <div className="flex-1 space-y-2 p-4">
              <div className="h-4 w-1/4 rounded bg-gray-200"></div>
              <div className="h-3 w-1/2 rounded bg-gray-200"></div>
            </div>
            <div className="w-32 p-4">
              <div className="h-8 rounded bg-gray-200"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  if (showSkeleton) {
    return (
      <div className="container mx-auto p-6">
        <div className="md:hidden">{renderSkeleton()}</div>
        <div className="hidden md:block">{renderTableSkeleton()}</div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gray-50">
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        className="
    relative
    mx-auto
    w-full
    max-w-md
    transform
    rounded-2xl
    bg-white
    p-6
    shadow-xl
    transition-all
  "
        overlayClassName="
    fixed
    inset-0
    bg-black
    bg-opacity-50
    backdrop-blur-sm
    flex
    items-center
    justify-center
    px-4
  "
      >
        {/* Title & Description */}
        <h2 className="mb-2 text-3xl font-bold text-gray-800">Unblock User</h2>
        <p className="mb-6 text-base text-gray-500">
          Provide an access date and select courses to unblock the user.
        </p>

        {/* Access Date */}
        <label className="mb-2 block text-base font-semibold text-gray-700">
          Access Until:
        </label>
        <input
          type="date"
          value={accessDate}
          onChange={(e) => setAccessDate(e.target.value)}
          className="
      mb-4
      block
      w-full
      rounded-lg
      border
      border-gray-300
      p-3
      text-base
      transition-colors
      focus:outline-none
      focus:ring-2
      focus:ring-[rgba(67,24,255,0.85)]
    "
        />

        {/* Course Selection */}
        <label className="mb-2 block text-base font-semibold text-gray-700">
          Select Courses:
        </label>
        <div
  className="mb-4 max-h-40 overflow-y-auto rounded-lg border border-gray-300 p-2"
>
{courses.map((course) => {
  const isSelected = selectedCourses.some((c) => c.courseName === course.name);
  const selectedCourse = selectedCourses.find((c) => c.courseName === course.name);

  return (
    <div
      key={course._id}
      className="flex items-center space-x-4 rounded px-2 py-1 transition-colors hover:bg-gray-50"
    >
      <input
        type="checkbox"
        id={`course-${course._id}`}
        checked={isSelected}
        onChange={(e) =>
          handleCourseSelection(
            course.name,
            e.target.checked,
            selectedCourse?.expiryDate || ""
          )
        }
        className="h-5 w-5 cursor-pointer rounded text-[rgba(67,24,255,0.85)] focus:ring-0"
      />
      <label
        htmlFor={`course-${course._id}`}
        className="cursor-pointer text-base text-gray-700"
      >
        {course.name}
      </label>
      {isSelected && (
        <input
          type="date"
          value={selectedCourse?.expiryDate || ""}
          onChange={(e) =>
            handleExpiryDateChange(course.name, e.target.value)
          }
          className="ml-4 rounded-lg border border-gray-300 p-2 text-sm focus:ring-[rgba(67,24,255,0.85)]"
        />
      )}
    </div>
  );
})}


</div>


        {/* Modal Buttons */}
        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={() => setIsModalOpen(false)}
            className="
        rounded-lg
        border
        border-gray-300
        px-4
        py-2
        text-base
        text-gray-700
        transition-colors
        hover:bg-gray-100
      "
          >
            Cancel
          </button>
          <button
            onClick={handleUnblockSubmit}
            className="
        rounded-lg
        bg-[rgba(67,24,255,0.85)]
        px-4
        py-2
        text-base
        text-white
        transition-colors
        hover:bg-[rgba(67,24,255,0.95)]
      "
          >
            Submit
          </button>
        </div>
      </Modal>

      {/* Analytics Popup */}
      {showAnalytics && selectedUserId && (
        <Modal
          isOpen={showAnalytics}
          closePopup={closeAnalyticsModal}
          onRequestClose={() => setShowAnalyticsPopup(false)}
          className="relative mx-auto w-full max-w-4xl transform rounded-2xl bg-white p-6 shadow-xl transition-all"
          overlayClassName="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center px-4"
        >
          <AnalyticsSection userId={selectedUserId} /> 
        </Modal>
      )}

      <div className="container mx-auto p-4">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
          <div className="text-sm text-gray-500">
            Total Users: {users.length}
          </div>
        </div>

        <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          {/* Search Bar */}
          <div className="relative w-full md:w-1/3">
            <input
              type="text"
              placeholder="Search by name or email"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-4 py-2 text-gray-700 shadow-sm focus:border-[rgba(67,24,255,0.85)] focus:ring-2 focus:ring-[rgba(67,24,255,0.85)]"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-5.197-5.197M10.5 18A7.5 7.5 0 1018 10.5 7.5 7.5 0 0010.5 18z"
              />
            </svg>
          </div>

          {/* Filter Dropdown */}
          <div className="relative w-full md:w-auto">
            <div className="relative">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full appearance-none rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-700 shadow-sm focus:border-[rgba(67,24,255,0.85)] focus:outline-none focus:ring-2 focus:ring-[rgba(67,24,255,0.85)] md:w-auto"
              >
                <option value="all">All</option>
                <option value="active">Active</option>
                <option value="blocked">Blocked</option>
              </select>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.25 15l3.75-3.75 3.75 3.75"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Mobile View */}
        <div className="space-y-4 md:hidden">
  {currentUsers.map((user) => (
    <div key={user._id} className="rounded-lg bg-white p-4 shadow-sm">
      <div className="flex flex-col space-y-3">
        <div
          className="flex items-center space-x-3 cursor-pointer"
          onClick={() => openAnalyticsModal(user._id)}
        >
          {/* <img
            src={user.picture}
            alt=""
            className="h-12 w-12 rounded-full"
          /> */}
<Avatar name={user.name} email={user.email} picture={user.picture} />

          <div>
            <h3 className="font-medium text-gray-900">{user.name}</h3>
            <p className="text-sm text-gray-500 truncate max-w-[200px]">
              {user.email}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between space-x-2">
          <button
            onClick={() => toggleUserStatus(user._id, user.isActive)}
            className={`rounded-lg p-2 text-sm font-medium text-white ${
              user.isActive
                ? "bg-red-500 hover:bg-red-600"
                : "bg-green-500 hover:bg-green-600"
            } transition-colors`}
          >
            {user.isActive ? "Block" : "Unblock"}
          </button>
          <button
            onClick={() => deleteUser(user._id)}
            className="rounded-lg p-2 text-red-500 transition-colors hover:bg-red-600"
          >
            <Trash2 className="h-5 w-5" />
          </button>
          <button
            onClick={() => handleUserSelect(user)}
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
          >
            <MoreVertical className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  ))}
</div>


        {/* Desktop View */}
        <div className="hidden md:block" >
          <div className="rounded-lg bg-white shadow">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">
                    User
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">
                    Email
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">
                    Last Login
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-medium text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50" >
                    <td style={{cursor:'pointer'}} className="px-6 py-4" onClick={() => openAnalyticsModal(user._id)}>
                      <div className="flex items-center space-x-3">
                        {/* <img
                          src={user.picture}
                          alt=""
                          className="h-10 w-10 rounded-full"
                        /> */}
                        <Avatar name={user.name} email={user.email} picture={user.picture} />

                        <span className="font-medium text-gray-900">
                          {user.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-500">{user.email}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${
                          user.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {user.isActive ? (
                          <Shield className="mr-1 h-4 w-4" />
                        ) : (
                          <ShieldAlert className="mr-1 h-4 w-4" />
                        )}
                        {user.isActive ? "Active" : "Blocked"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {user.currentSession
                        ? new Date(
                            user.currentSession.lastLogin
                          ).toLocaleString()
                        : "No active session"}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() =>
                            toggleUserStatus(user._id, user.isActive)
                          }
                          className={`rounded-lg px-4 py-2 text-sm font-medium text-white ${
                            user.isActive
                              ? "bg-red-500 hover:bg-red-600"
                              : "bg-green-500 hover:bg-green-600"
                          } transition-colors`}
                        >
                          {user.isActive ? "Block" : "Unblock"}
                        </button>
                        <button
                          onClick={() => deleteUser(user._id)}
                          className="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600"
                        >
                          Delete
                        </button>
                        <button
                          onClick={() => handleUserSelect(user)}
                          className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
                        >
                          <MoreVertical className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="m-5 mt-4 flex flex-row items-center justify-between gap-4 md:flex-row">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}
          className={`rounded-lg px-4 py-2 text-white ${
            currentPage === 1
              ? "bg-gray-300"
              : "bg-[rgba(67,24,255,0.85)] hover:bg-[rgba(67,24,255,0.95)]"
          }`}
        >
          Previous
        </button>
        <span className="text-gray-700">
          Page {currentPage} of {totalPages}
        </span>
        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((prev) => prev + 1)}
          className={`rounded-lg px-4 py-2 text-white ${
            currentPage === totalPages
              ? "bg-gray-300"
              : "bg-[rgba(67,24,255,0.85)] hover:bg-[rgba(67,24,255,0.95)]"
          }`}
        >
          Next
        </button>
      </div>

      {/* Overlay */}
      {showSidebar && (
        <div
          className="bg-black fixed inset-0 z-40 bg-opacity-50 transition-opacity"
          onClick={() => setShowSidebar(false)}
        />
      )}

      {/* Sidebar */}
      {showSidebar && (
        <SessionSidebar
          user={{
            ...selectedUser,
            loginHistory: selectedUser.loginHistory.sort(
              (a, b) => new Date(b.loginTime) - new Date(a.loginTime)
            ),
          }}
          onClose={() => setShowSidebar(false)}
        />
      )}
    </div>
  );
}

export default UserTable;
