const express = require('express');
const {getAllUsers, toggleUserStatus,deleteUser,getUserById,getUserStreak , getUserSubscriptions,getUserPrint,getCoursesTimeByUser, getTodoTimeByUser,getPomodoroTimeByUser,getTotalTimeBySections,topLeaderboard} = require('../controllers/User');
const router = express.Router();

router.get('/users', getAllUsers); 
router.get('/usersDetails/:userId', getUserById);
router.patch(
  '/users/:userId/status',
  toggleUserStatus
);
router.get("/users/:userId/streak", getUserStreak);
router.delete('/users/:userId', deleteUser);
router.get('/users/subscriptions', getUserSubscriptions);
router.get('/user/flaggedUsers',);
router.get('/users/:userId/details',getUserPrint);
router.get('/users/:userId/courses/time', getCoursesTimeByUser); // New API route
router.get('/users/:userId/todos/time', getTodoTimeByUser);
router.get('/users/:userId/pomodoro/time', getPomodoroTimeByUser);
router.get('/users/:userId/sections/time', getTotalTimeBySections);
router.get('/users/leaderboard/time', topLeaderboard);
module.exports = router;