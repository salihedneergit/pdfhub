import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { useParams } from "react-router-dom";

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true); // Track loading state
  const [error, setError] = useState(null); // Track errors
  const [imageFailed, setImageFailed] = useState(false); // Track image load status

  const { userId } = useParams();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          `http://13.51.106.41:3001/api/users/${userId}/details`
        );
        setUserData(response.data.user);
      } catch (error) {
        setError("Error fetching user data");
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false); // Set loading to false after request completion
      }
    };

    fetchUserData();
  }, [userId]); // Add userId to dependencies

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

  const { _id, name, email, picture, createdAt, streak } = userData || {};
  const firstLetter = email ? email[0].toUpperCase() : "?";
  const colorClass = React.useMemo(() => generateGoogleColor(), []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="rounded-[20px] bg-white p-4 shadow-sm animate-pulse">
          <div className="h-8 w-32 bg-gray-300 rounded mb-4"></div>
          <div className="h-8 w-48 bg-gray-300 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="rounded-[20px] bg-white p-4 shadow-sm">
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-2 p-1">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="rounded-[20px] bg-white shadow-sm p-2"
      >
        <div className="flex flex-col md:flex-row items-center">
          {/* Left Side: Profile Image */}
          <div className="w-full md:w-1/3 flex items-center justify-center p-6">
            <div className="relative h-[100px] w-[100px]">
              {/* Fallback content (only shown if image fails) */}
              {imageFailed ? (
                <div
                  className={`absolute inset-0 flex items-center justify-center rounded-full text-white font-bold ${colorClass}`}
                >
                  <span className="text-3xl">{firstLetter}</span>
                </div>
              ) : null}

              {/* Profile Image (only shown if image loads successfully) */}
              <img
                src={picture}
                alt={name}
                className={`h-[100px] w-[100px] rounded-full border-2 border-white shadow-lg ${
                  imageFailed ? "hidden" : "block"
                }`}
                onError={() => setImageFailed(true)} // Trigger fallback if image fails
                onLoad={() => setImageFailed(false)} // Ensure image is displayed when loaded
              />
            </div>
          </div>

          {/* Right Side: Profile Details */}
          <div className="w-full md:w-2/3 p-6">
            <h1 className="text-2xl font-bold text-navy-700 mb-4">{name}</h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="rounded-[20px] bg-[#F4F7FE] p-4 shadow-sm"
              >
                <p className="font-medium text-gray-600">User ID:</p>
                <p className="text-gray-800">{_id}</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="rounded-[20px] bg-[#F4F7FE] p-4 shadow-sm"
              >
                <p className="font-medium text-gray-600">Email:</p>
                <p className="text-gray-800">{email}</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="rounded-[20px] bg-[#F4F7FE] p-4 shadow-sm"
              >
                <p className="font-medium text-gray-600">Registered At:</p>
                <p className="text-gray-800">
                  {new Date(createdAt).toLocaleDateString()}
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="rounded-[20px] bg-[#F4F7FE] p-4 shadow-sm"
              >
                <p className="font-medium text-gray-600">Current Streak:</p>
                <p className="text-gray-800">{streak?.streakCount || 0} days</p>
              </motion.div>
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">
                Last Activity: {new Date(streak?.lastActivity).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Profile;
