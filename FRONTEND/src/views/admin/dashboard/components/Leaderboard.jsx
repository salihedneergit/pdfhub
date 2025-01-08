import React, { useState, useEffect } from "react";
import { MdTrendingUp } from "react-icons/md";
import axios from "axios";
import { motion } from "framer-motion";

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await axios.get(
          "http://13.51.106.41:3001/api/users/leaderboard/time"
        );
        if (response.data.success) {
          setLeaderboard(response.data.leaderboard);
        }
      } catch (error) {
        console.error("Error fetching leaderboard data:", error);
      }
    };

    fetchLeaderboard();
  }, []);

  const filteredLeaderboard = leaderboard.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="rounded-[20px] bg-white p-4 shadow-sm"
    >
      <h4 className="mb-4 text-lg font-bold text-navy-700">Leaderboard</h4>

      {/* Search and Show More Section */}
      <div className="mb-4 flex flex-wrap justify-between items-center gap-2">
        <input
          type="text"
          placeholder="Search user..."
          className="rounded-md border px-4 py-2 text-sm shadow-sm w-full sm:w-auto flex-grow focus:outline-none focus:ring-2 focus:ring-[rgba(67,24,255,0.85)]"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button
          onClick={() => setShowAll((prev) => !prev)}
          className="rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600"
        >
          {showAll ? "Show Less" : "Show More"}
        </button>
      </div>

      {/* Display Leaderboard */}
      <ul className="space-y-3">
        {(showAll ? filteredLeaderboard : filteredLeaderboard.slice(0, 10)).map(
          (user, idx) => (
            <li
              key={idx}
              className="flex flex-wrap items-center justify-between rounded-md p-4 hover:bg-gray-100 hover:shadow-md transition-colors gap-2"
            >
              {/* User Details */}
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-500 font-bold">
                  {user.name[0].toUpperCase()}
                </div>
                <div className="max-w-full">
                  <p className="text-sm font-semibold text-gray-800 truncate">
                    {user.name}
                  </p>
                  <p className="text-xs text-gray-500 truncate max-w-[150px] md:max-w-[200px]">
                    {user.email}
                  </p>
                </div>
              </div>

              {/* Time Spent */}
              <p className="text-sm font-medium text-gray-700">
                {user.totalTimeSpent} mins
              </p>
            </li>
          )
        )}
      </ul>
    </motion.div>
  );
};

export default Leaderboard;
