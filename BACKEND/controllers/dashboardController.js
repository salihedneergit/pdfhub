const User = require('../models/User');
const Course = require('../models/Course');

const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalCourses = await Course.countDocuments();
    const totalPDFs = await Course.aggregate([
      { $unwind: "$folders" },
      { $unwind: "$folders.pdfs" },
      { $count: "totalPDFs" },
    ]);
    const totalFolders = await Course.aggregate([
      { $unwind: "$folders" },
      { $count: "totalFolders" },
    ]);

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalCourses,
        totalPDFs: totalPDFs.length > 0 ? totalPDFs[0].totalPDFs : 0,
        totalFolders: totalFolders.length > 0 ? totalFolders[0].totalFolders : 0,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const getTopUsers = async (req, res) => {
  try {
    const topUsers = await User.find()
      .sort({ "streak.longestCount": -1 })
      // .limit(5)
      .select("name email picture streak.longestCount");

    res.status(200).json({ success: true, topUsers });
  } catch (error) {
    console.error("Error fetching top users:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const getTopCourses = async (req, res) => {
  try {
    const topCourses = await Course.aggregate([
      { $project: { name: 1, totalPDFs: { $size: "$folders.pdfs" } } },
      { $sort: { totalPDFs: -1 } },
      { $limit: 5 },
    ]);
    res.status(200).json({ success: true, topCourses });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const getActiveInactiveUsers = async (req, res) => {
  try {
    const activeUsers = await User.countDocuments({ isActive: true });
    const inactiveUsers = await User.countDocuments({ isActive: false });

    res.status(200).json({
      success: true,
      activeUsers,
      inactiveUsers,
    });
  } catch (error) {
    console.error("Error fetching user activity data:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};


const getExpiringSubscriptions = async (req, res) => {
  try {
    const today = new Date(); // Current date
    const oneWeekFromNow = new Date();
    oneWeekFromNow.setDate(today.getDate() + 7); // 7 days from today

    // Find users whose subscriptions expire within the next 7 days
    const expiringUsers = await User.find({
      accessUntil: { $gte: today, $lte: oneWeekFromNow },
    })
      .sort({ accessUntil: 1 }) // Sort by accessUntil in ascending order
      .limit(5); // Limit to 5 users

    res.status(200).json({
      success: true,
      expiringUsers,
    });
  } catch (error) {
    console.error("Error fetching expiring subscriptions:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};



const getLoginStats = async (req, res) => {
  try {
    const loginCounts = await User.aggregate([
      {
        $project: {
          name: 1,
          loginCount: { $size: "$loginHistory" },
        },
      },
      { $sort: { loginCount: -1 } },
    ]);

    res.status(200).json({
      success: true,
      loginCounts,
    });
  } catch (error) {
    console.error("Error fetching login statistics:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const getMonthlyProgress = async (req, res) => {
  try {
    const currentYear = new Date().getFullYear();
    const monthlyRegistrations = await User.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(currentYear, 0, 1),
            $lt: new Date(currentYear + 1, 0, 1), 
          },
        },
      },
      {
        $group: {
          _id: { $month: "$createdAt" },
          total: { $sum: 1 },
        },
      },
      { $sort: { "_id": 1 } },
    ]);

    const formattedData = Array.from({ length: 12 }, (_, i) => {
      const month = i + 1;
      const found = monthlyRegistrations.find((item) => item._id === month);
      return { month, total: found ? found.total : 0 };
    });

    res.status(200).json({ success: true, data: formattedData });
  } catch (error) {
    console.error("Error fetching monthly progress:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const getWeeklyProgress = async (req, res) => {
  try {
    const today = new Date();
    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 6);

    const weeklyRegistrations = await User.aggregate([
      {
        $match: {
          createdAt: {
            $gte: lastWeek,
            $lte: today,
          },
        },
      },
      {
        $group: {
          _id: {
            $dayOfWeek: "$createdAt",
          },
          total: { $sum: 1 },
        },
      },
      { $sort: { "_id": 1 } },
    ]);

    const dayMap = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    const formattedData = dayMap.map((dayName, index) => {
      const dayIndex = index + 1;
      const found = weeklyRegistrations.find((item) => item._id === dayIndex);
      return {
        name: dayName,
        value: found ? found.total : 0,
      };
    });

    res.status(200).json({ success: true, data: formattedData });
  } catch (error) {
    console.error("Error fetching weekly progress:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};


const getYearlyOverview = async (req, res) => {
  try {
    const yearlyRegistrations = await User.aggregate([
      {
        $group: {
          _id: { $year: "$createdAt" },
          total: { $sum: 1 },
        },
      },
      { $sort: { "_id": 1 } },
    ]);

    const formattedData = yearlyRegistrations.map((item) => ({
      year: item._id,
      total: item.total,
    }));

    res.status(200).json({ success: true, data: formattedData });
  } catch (error) {
    console.error("Error fetching yearly overview:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};



module.exports = { getDashboardStats, getTopUsers, getTopCourses,getActiveInactiveUsers,getExpiringSubscriptions,getLoginStats, getMonthlyProgress,
  getWeeklyProgress, getYearlyOverview };
