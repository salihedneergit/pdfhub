const express = require('express');
const { getDashboardStats,getTopUsers,getTopCourses,getActiveInactiveUsers,getExpiringSubscriptions,getLoginStats,getMonthlyProgress,
    getWeeklyProgress, getYearlyOverview } = require('../controllers/dashboardController');
const router = express.Router();

router.get('/dashboard/stats', getDashboardStats);
router.get('/dashboard/top-users', getTopUsers);
router.get('/dashboard/top-courses', getTopCourses);
router.get("/dashboard/active-inactive", getActiveInactiveUsers);
router.get("/dashboard/expiring-subscriptions", getExpiringSubscriptions);
router.get("/dashboard/login-stats", getLoginStats);
router.get('/dashboard/monthly-progress', getMonthlyProgress);
router.get('/dashboard/weekly-progress', getWeeklyProgress);
router.get('/dashboard/yearly-overview', getYearlyOverview);


module.exports = router;
