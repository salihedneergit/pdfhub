const { OAuth2Client } = require('google-auth-library');
const { v4: uuidv4 } = require('uuid');

// Models
const User = require('../models/User');
const Course = require('../models/Course'); // Import Course model

const googleAuth = async (req, res) => {
  try {
    const { googleId, name, email, picture, deviceInfo, userIp } = req.body;
    const deviceId = uuidv4();

    // Check if user exists in the database
    let user = await User.findOne({ googleId });

    if (!user) {
      // Create a new user if not found
      user = new User({
        googleId,
        name,
        email,
        picture,
        isActive: false, // Default to inactive for new users
        currentSession: {
          deviceId,
          deviceInfo,
          ip: userIp,
          lastLogin: new Date(),
          isActive: true,
        },
        loginHistory: [
          {
            deviceInfo,
            ip: userIp,
            loginTime: new Date(),
          },
        ],
        registeredIp: userIp,
        flagged: {
          flag: false,
          ipFlag: [],
          loginFlag: [],
        },
        streak: {
          streakCount: 1,
          longestCount: 1,
          lastActivity: new Date(),
          activity: [
            {
              day: new Date().toLocaleDateString('en-US', { weekday: 'short' }),
              date: new Date().toISOString().split('T')[0],
              active: true,
            },
          ],
        },
      });

      await user.save();
      return res.status(200).json({
        success: true,
        user: { ...user.toJSON(), token: uuidv4(), deviceId },
        message: 'Account created successfully. Awaiting activation.',
      });
    }

    // If user exists, check if they are active
    if (user.isActive) {
      // Update current session for the active user
      user.currentSession = {
        deviceId,
        deviceInfo,
        ip: userIp,
        lastLogin: new Date(),
        isActive: true,
      };

      // Update streak logic
      const today = new Date().toISOString().split('T')[0];
      const lastActivityDate = user.streak?.lastActivity
        ? new Date(user.streak.lastActivity).toISOString().split('T')[0]
        : null;

      if (lastActivityDate !== today) {
        if (
          lastActivityDate &&
          new Date(lastActivityDate).getTime() ===
            new Date(today).getTime() - 24 * 60 * 60 * 1000
        ) {
          user.streak.streakCount += 1;
          if (user.streak.streakCount > user.streak.longestCount) {
            user.streak.longestCount = user.streak.streakCount;
          }
        } else {
          user.streak.streakCount = 1;
        }

        user.streak.lastActivity = new Date();
        const activityLog = user.streak.activity || [];
        if (activityLog.length >= 7) activityLog.shift();
        activityLog.push({
          day: new Date().toLocaleDateString('en-US', { weekday: 'short' }),
          date: today,
          active: true,
        });
        user.streak.activity = activityLog;
      }

      // Add to login history
      user.loginHistory.push({
        deviceInfo,
        ip: userIp,
        loginTime: new Date(),
      });

      await user.save();
      const token = uuidv4();
      return res.status(200).json({
        success: true,
        user: { ...user.toJSON(), token, deviceId },
        message: 'Login successful.',
        status: 'active',
      });
    }

    // If the user is not active, return a 403 status code
    return res.status(403).json({
      success: false,
      message: 'Your account is not active. Please contact support.',
    });
  } catch (error) {
    console.error('Error in Google Authentication:', error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};


// Block/Activate User
const toggleUserStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    const { accessUntil, courses } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (accessUntil) {
      user.accessUntil = new Date(accessUntil);
    }

    if (Array.isArray(courses)) {
      // Validate that each course has a valid expiryDate
      const validCourses = courses.every(
        (course) => course.courseName && course.expiryDate && new Date(course.expiryDate) > new Date()
      );

      if (!validCourses) {
        return res.status(400).json({
          success: false,
          message: 'Each course must have a valid expiry date greater than today.',
        });
      }

      user.courseSelection = courses;
    }

    // Toggle the user's active status
    user.isActive = !user.isActive;

    await user.save();

    res.status(200).json({
      success: true,
      message: 'User status updated successfully',
      user,
    });
  } catch (error) {
    console.error('Error updating user status:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};


const updateStreakActivity = async (userId) => {
  const user = await User.findById(userId);

  if (!user) throw new Error("User not found");

  const today = new Date();
  const todayDateString = today.toISOString().split("T")[0];

  // Ensure streak object exists
  if (!user.streak) {
    user.streak = {
      streakCount: 0,
      longestCount: 0,
      lastActivity: null,
      activity: [],
    };
  }

  // Remove any duplicate entries for today's date
  user.streak.activity = user.streak.activity.filter(
    (entry) => entry.date !== todayDateString
  );

  // Add today's activity
  user.streak.activity.push({
    day: today.toLocaleDateString("en-US", { weekday: "short" }),
    date: todayDateString,
    active: true,
  });

  // Calculate streak
  const lastActivityDate = user.streak.lastActivity
    ? new Date(user.streak.lastActivity).toISOString().split("T")[0]
    : null;

  if (
    lastActivityDate &&
    new Date(lastActivityDate).getTime() ===
      new Date(todayDateString).getTime() - 24 * 60 * 60 * 1000
  ) {
    // If last activity was yesterday, increment the streak
    user.streak.streakCount += 1;
  } else if (lastActivityDate === todayDateString) {
    // If last activity is today, do not reset the streak
    // Streak remains unchanged
  } else {
    // Otherwise, reset the streak
    user.streak.streakCount = 1;
  }

  // Update longest streak count
  if (user.streak.streakCount > user.streak.longestCount) {
    user.streak.longestCount = user.streak.streakCount;
  }

  // Update last activity to today
  user.streak.lastActivity = today;

  // Save the user object
  await user.save();

  return user.streak;
};




const getUserStreak = async (req, res) => {
  try {
    const { userId } = req.params;

    // Ensure userId is provided and valid
    if (!userId) {
      return res.status(400).json({ success: false, message: "User ID is required" });
    }

    const streak = await updateStreakActivity(userId);
    res.status(200).json({ success: true, streak });
  } catch (error) {
    console.error("Error updating streak:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to update streak", error });
  }
};



const logout = async (req, res) => {
  try {
    const { userId, deviceId } = req.body;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Update login history with logout time
    if (user.currentSession && user.currentSession.deviceId === deviceId) {
      const currentLogin = user.loginHistory[user.loginHistory.length - 1];
      if (currentLogin && !currentLogin.logoutTime) {
        currentLogin.logoutTime = new Date();
      }
      user.currentSession.isActive = false;
    }

    await user.save();
    res.status(200).json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    console.error('Error during logout:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({ success: true, users });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};


const sessionCheck = async (req, res) => {
  try {
    const { userId, deviceId } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        isValidSession: false,
        message: 'User not found',
      });
    }

    // Check if user is blocked
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        isValidSession: false,
        message: 'Account is blocked',
      });
    }

    // Check if current session matches
    const isValidSession =
      user.currentSession &&
      user.currentSession.deviceId === deviceId &&
      user.currentSession.isActive;

    if (!isValidSession) {
      return res.status(200).json({
        success: true,
        isValidSession: false,
        message: 'Session is invalid or expired',
      });
    }

    // Update last login time
    user.currentSession.lastLogin = new Date();
    await user.save();

    return res.status(200).json({
      success: true,
      isValidSession: true,
      message: 'Session is valid',
      user: {
        _id: user._id,
        email: user.email,
        adminAuthorization: user.adminAuthorization, // Added this field
      },
    });
  } catch (error) {
    console.error('Error checking session:', error);
    res.status(500).json({
      success: false,
      isValidSession: false,
      message: 'Internal server error',
    });
  }
};


const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const getUserById = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error('Error fetching user details:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};



const getUserSubscriptions = async (req, res) => {
  try {
    const users = await User.find({}, "name email isActive accessUntil");

    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    console.error("Error fetching user subscriptions:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


const getUserPrint = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}

const getCoursesTimeByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    // Find the user and retrieve their tracking data
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Filter tracking data for courses
    const courseTracking = user.tracking.filter((entry) => entry.page === 'course');

    if (!courseTracking.length) {
      return res.status(404).json({ success: false, message: 'No tracking data found for any course' });
    }

    // Calculate the total time for each course by date
    const coursesTime = {};

    courseTracking.forEach((entry) => {
      const courseId = entry.pageId; // Course ID
      const date = new Date(entry.startTime).toISOString().split('T')[0]; // Group by date
      const startTime = new Date(entry.startTime).getTime();
      const endTime = entry.endTime ? new Date(entry.endTime).getTime() : startTime; // Use startTime if endTime is null
      const timeSpent = (endTime - startTime) / 1000 / 60; // Convert to minutes

      // Initialize course data if not present
      if (!coursesTime[courseId]) {
        coursesTime[courseId] = {};
      }

      // Accumulate time for the specific date
      if (coursesTime[courseId][date]) {
        coursesTime[courseId][date] += timeSpent;
      } else {
        coursesTime[courseId][date] = timeSpent;
      }
    });

    // Fetch course names for the course IDs
    const courseIds = Object.keys(coursesTime);
    const courses = await Course.find({ _id: { $in: courseIds } });

    const result = {};

    courses.forEach((course) => {
      const courseId = course._id.toString();
      if (coursesTime[courseId]) {
        result[course.name] = {};
        Object.keys(coursesTime[courseId]).forEach((date) => {
          result[course.name][date] = coursesTime[courseId][date].toFixed(2); // Time in minutes, rounded to 2 decimal places
        });
      }
    });

    res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.error('Error calculating courses time:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const getTodoTimeByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    // Find the user and retrieve their tracking data
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Filter tracking data for todos
    const todoTracking = user.tracking.filter((entry) => entry.page === 'todo');

    if (!todoTracking.length) {
      return res.status(404).json({ success: false, message: 'No tracking data found for todos' });
    }

    // Calculate the total time for todos grouped by date
    const timeByDate = {};

    todoTracking.forEach((entry) => {
      const date = new Date(entry.startTime).toISOString().split('T')[0]; // Group by date
      const startTime = new Date(entry.startTime).getTime();
      const endTime = entry.endTime ? new Date(entry.endTime).getTime() : startTime; // Use startTime if endTime is null
      const timeSpent = (endTime - startTime) / 1000 / 60; // Convert to minutes

      // Accumulate time for the specific date
      if (timeByDate[date]) {
        timeByDate[date] += timeSpent;
      } else {
        timeByDate[date] = timeSpent;
      }
    });

    // Convert the result to an array of [date, time]
    const result = Object.entries(timeByDate).map(([date, time]) => ({
      date,
      time: time.toFixed(2), // Time in minutes, rounded to 2 decimal places
    }));

    res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.error('Error calculating todo time:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const getPomodoroTimeByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    // Find the user and retrieve their tracking data
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Filter tracking data for Pomodoro
    const pomodoroTracking = user.tracking.filter((entry) => entry.page === 'pomodoro');

    if (!pomodoroTracking.length) {
      return res.status(404).json({ success: false, message: 'No tracking data found for Pomodoro' });
    }

    // Calculate total time spent on Pomodoro grouped by date
    const pomodoroTimeByDate = {};

    pomodoroTracking.forEach((entry) => {
      const date = new Date(entry.startTime).toISOString().split('T')[0]; // Extract the date
      const startTime = new Date(entry.startTime).getTime();
      const endTime = entry.endTime ? new Date(entry.endTime).getTime() : startTime; // Use startTime if endTime is null
      const timeSpent = (endTime - startTime) / 1000 / 60; // Convert to minutes

      if (pomodoroTimeByDate[date]) {
        pomodoroTimeByDate[date] += timeSpent; // Accumulate time
      } else {
        pomodoroTimeByDate[date] = timeSpent; // Initialize time for the date
      }
    });

    // Convert the result to an array or object as needed
    const result = Object.keys(pomodoroTimeByDate).map((date) => ({
      date,
      timeSpent: pomodoroTimeByDate[date].toFixed(2), // Round to 2 decimal places
    }));

    res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.error('Error calculating Pomodoro time:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const getTotalTimeBySections = async (req, res) => {
  try {
    const { userId } = req.params;

    // Find the user and retrieve their tracking data
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Initialize total and daily time storage for each section
    const sections = ['course', 'todo', 'pomodoro'];
    const totalTimeBySection = {};
    const avgTimeBySection = {};

    sections.forEach((section) => {
      totalTimeBySection[section] = 0; // Initialize total time
      avgTimeBySection[section] = {}; // Initialize daily time
    });

    // Calculate time for each section
    user.tracking.forEach((entry) => {
      const section = entry.page; // `course`, `todo`, or `pomodoro`
      if (sections.includes(section)) {
        const date = new Date(entry.startTime).toISOString().split('T')[0]; // Group by date
        const startTime = new Date(entry.startTime).getTime();
        const endTime = entry.endTime ? new Date(entry.endTime).getTime() : startTime; // Use startTime if endTime is null
        const timeSpent = (endTime - startTime) / 1000 / 60; // Convert to minutes

        // Add to total time
        totalTimeBySection[section] += timeSpent;

        // Add to daily time
        if (avgTimeBySection[section][date]) {
          avgTimeBySection[section][date] += timeSpent;
        } else {
          avgTimeBySection[section][date] = timeSpent;
        }
      }
    });

    // Calculate averages (daily, weekly, monthly, yearly, overall)
    const result = {};
    const currentDate = new Date();
    const userRegistrationDate = new Date(user.createdAt);
    let totalDaysSinceRegistration = Math.ceil((currentDate - userRegistrationDate) / (1000 * 60 * 60 * 24));

    // Ensure at least 1 day to avoid NaN
    if (totalDaysSinceRegistration <= 0) {
      totalDaysSinceRegistration = 1;
    }

    Object.keys(totalTimeBySection).forEach((section) => {
      const dates = Object.keys(avgTimeBySection[section]);
      const totalDays = dates.length;
      const totalMinutes = totalTimeBySection[section];
      
      const dailyAvg = totalDays > 0 ? totalMinutes / totalDays : 0;

      // Weekly Average
      const weeklyAvg = totalMinutes / Math.min(7, totalDays);

      // Monthly Average
      const monthlyAvg = totalMinutes / Math.min(30, totalDays);

      // Yearly Average
      const yearlyAvg = totalMinutes / Math.min(365, totalDays);

      // Overall Average
      const overallAvg = totalMinutes / totalDaysSinceRegistration;

      result[section] = {
        totalTime: totalMinutes.toFixed(2), // Total time spent in minutes
        avgTimePerDay: dailyAvg.toFixed(2),
        avgTimePerWeek: weeklyAvg.toFixed(2),
        avgTimePerMonth: monthlyAvg.toFixed(2),
        avgTimePerYear: yearlyAvg.toFixed(2),
        overallAvg: overallAvg.toFixed(2),
      };
    });

    // Combine all sections for "overall" statistics
    const combinedTotalTime = Object.values(totalTimeBySection).reduce((acc, time) => acc + time, 0);
    result["overall"] = {
      totalTime: combinedTotalTime.toFixed(2),
      avgTimePerDay: (combinedTotalTime / Object.keys(avgTimeBySection["course"]).length || 1).toFixed(2),
      avgTimePerWeek: (combinedTotalTime / Math.min(7, Object.keys(avgTimeBySection["course"]).length || 1)).toFixed(2),
      avgTimePerMonth: (combinedTotalTime / Math.min(30, Object.keys(avgTimeBySection["course"]).length || 1)).toFixed(2),
      avgTimePerYear: (combinedTotalTime / Math.min(365, Object.keys(avgTimeBySection["course"]).length || 1)).toFixed(2),
      overallAvg: (combinedTotalTime / totalDaysSinceRegistration).toFixed(2),
    };

    res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.error('Error calculating total time by sections:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const topLeaderboard = async (req, res) => {
  try {
    // Fetch all users and their tracking data
    const users = await User.find({}, "name email tracking");

    // Create an array to store user time data
    const leaderboard = [];

    users.forEach((user) => {
      const courseTracking = user.tracking.filter((entry) => entry.page === 'course');

      // Calculate total time spent on courses
      const totalTimeSpent = courseTracking.reduce((acc, entry) => {
        const startTime = new Date(entry.startTime).getTime();
        const endTime = entry.endTime ? new Date(entry.endTime).getTime() : startTime;
        const timeSpent = (endTime - startTime) / 1000 / 60; // Time in minutes
        return acc + timeSpent;
      }, 0);

      // Add user data to leaderboard if they have course tracking data
      if (totalTimeSpent > 0) {
        leaderboard.push({
          name: user.name,
          email: user.email,
          totalTimeSpent: totalTimeSpent.toFixed(2), // Rounded to 2 decimal places
        });
      }
    });

    // Sort leaderboard by total time spent in descending order
    leaderboard.sort((a, b) => b.totalTimeSpent - a.totalTimeSpent);

    res.status(200).json({ success: true, leaderboard });
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};



module.exports = { googleAuth, getAllUsers, toggleUserStatus, logout , sessionCheck,deleteUser,getUserById,updateStreakActivity,getUserStreak , getUserSubscriptions,getUserPrint,getCoursesTimeByUser,getTodoTimeByUser, getPomodoroTimeByUser,getTotalTimeBySections,topLeaderboard};