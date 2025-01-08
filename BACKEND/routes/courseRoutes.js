const express = require('express'); // To create and handle routes
const { ObjectId } = require('mongodb'); // To validate MongoDB Object IDs
const Course = require('../models/Course'); // Import your Course model
const User = require('../models/User'); // Import your User model (to update users when courses are modified)
const { listFiles } = require('../models/s3Services'); // Import the function to list files from S3 if used



const router = express.Router();

// Create a new course
router.post('/create-course', async (req, res) => {
  const { name, folders } = req.body;

  if (!name || !folders) {
    return res.status(400).json({ message: 'Invalid input. Ensure all fields are valid.' });
  }

  try {
    const course = new Course({ name, folders });
    await course.save();

    res.status(201).json({ message: 'Course created successfully', course });
  } catch (error) {
    console.error('Error creating course:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get all courses
router.get('/courses', async (req, res) => {
  try {
    const courses = await Course.find();
    res.status(200).json({ courses });
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update an existing course
// Update a course
router.put('/update-course/:id', async (req, res) => {
  const { id } = req.params;
  const { name, folders } = req.body;

  if (!name || !folders) {
    return res.status(400).json({ message: 'Invalid input. Ensure all fields are valid.' });
  }

  try {
    const existingCourse = await Course.findOne({ name });
    if (existingCourse && existingCourse._id.toString() !== id) {
      return res.status(400).json({ message: 'A course with this name already exists.' });
    }

    const courseToUpdate = await Course.findById(id);

    if (!courseToUpdate) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const oldName = courseToUpdate.name;

    // Update the course
    const updatedCourse = await Course.findByIdAndUpdate(
      id,
      { name, folders },
      { new: true }
    );

    if (!updatedCourse) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Update the course name in users
    await User.updateMany(
      { courseSelection: oldName },
      { $set: { 'courseSelection.$': name } } // Replace the old name with the new name
    );

    res.status(200).json({ message: 'Course updated successfully', course: updatedCourse });
  } catch (error) {
    console.error('Error updating course:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


// List available PDFs
router.get('/available-pdfs', async (req, res) => {
  try {
    const pdfs = await listFiles(); // Retrieve PDFs from S3 bucket
    res.status(200).json({ pdfs });
  } catch (error) {
    console.error('Error fetching PDFs:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


// Delete a course
router.delete('/delete-course/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Ensure the ID is valid before trying to delete
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid course ID format' });
    }

    // Find the course by ID
    const courseToDelete = await Course.findById(id);

    if (!courseToDelete) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Remove the course from all users
    await User.updateMany(
      { courseSelection: courseToDelete.name },
      { $pull: { courseSelection: courseToDelete.name } }
    );

    // Delete the course
    await Course.findByIdAndDelete(id);

    res.status(200).json({ message: 'Course deleted successfully' });
  } catch (error) {
    console.error('Error deleting the course:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

router.get('/user-courses/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    // Ensure the user ID is valid
    if (!ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user ID format' });
    }

    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the user has selected any courses
    if (!user.courseSelection || user.courseSelection.length === 0) {
      return res.status(404).json({ message: 'No courses assigned to the user' });
    }

    const currentDate = new Date();

    // Fetch all course details
    const courses = await Course.find({
      name: { $in: user.courseSelection.map((c) => c.courseName) },
    });

    if (!courses || courses.length === 0) {
      return res.status(404).json({ message: 'No matching courses found for the user' });
    }

    // Prepare the response with active and expired courses
    const courseDetails = courses.map((course) => {
      const userCourse = user.courseSelection.find((c) => c.courseName === course.name);
      const isExpired = new Date(userCourse?.expiryDate) <= currentDate;

      return {
        id: course._id,
        name: course.name,
        expiryDate: userCourse?.expiryDate,
        isExpired, // Add flag to indicate if the course has expired
        folders: course.folders.map((folder) => ({
          folderName: folder.name,
          pdfs: folder.pdfs,
        })),
        createdAt: course.createdAt,
      };
    });

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      courses: courseDetails,
    });
  } catch (error) {
    console.error('Error fetching user courses:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});




module.exports = router;
