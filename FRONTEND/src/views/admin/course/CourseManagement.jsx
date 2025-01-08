import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiBookOpen, FiPlus } from 'react-icons/fi';
import CourseList from './CourseList';
import CourseCreation from './CourseCreation';
import { Toaster, toast } from 'react-hot-toast';

const LoadingState = () => (
  <div className="space-y-4">
    {[1, 2, 3].map((i) => (
      <div key={i} className="animate-pulse">
        <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
      </div>
    ))}
  </div>
);

const CourseManagement = () => {
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [courseToEdit, setCourseToEdit] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [error, setError] = useState(null);

  const fetchCourses = async () => {
    try {
      setError(null);
      const response = await fetch('http://localhost:3001/api/course/courses');
      if (!response.ok) {
        throw new Error('Failed to fetch courses');
      }
      const data = await response.json();
      setCourses(data.courses || []);
      // Simulate loading for better UX
      setTimeout(() => setIsLoading(false), 500);
      return;
    } catch (err) {
      setError(err.message);
      toast.error('Failed to load courses');
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleCourseCreated = async (updatedCourse) => {
    try {
      setCourses((prevCourses) => {
        if (courseToEdit) {
          return prevCourses.map((course) =>
            course._id === updatedCourse._id ? updatedCourse : course
          );
        }
        return [updatedCourse, ...prevCourses];
      });
      
      setCourseToEdit(null);
      setShowCreateModal(false);
      toast.success(courseToEdit ? 'Course updated successfully!' : 'Course created successfully!');
    } catch (err) {
      toast.error('Failed to save course');
    }
  };

  const handleEditCourse = (course) => {
    setCourseToEdit(course);
    setShowCreateModal(true);
  };

  const handleDeleteCourse = async (courseId) => {
    try {
      const response = await fetch(`http://localhost:3001/api/course/delete-course/${courseId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete course');
      }

      setCourses((prevCourses) => prevCourses.filter((course) => course._id !== courseId));
      toast.success('Course deleted successfully!');
    } catch (err) {
      toast.error('Failed to delete course');
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const buttonVariants = {
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.2,
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    },
    tap: { scale: 0.95 }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
              <FiBookOpen className="w-8 h-8 mr-3 text-primary" />
              Course Management
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Manage your courses and their content
            </p>
          </div>

          <motion.button
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            onClick={() => {
              setCourseToEdit(null);
              setShowCreateModal(true);
            }}
            className="inline-flex items-center px-4 py-2 bg-[#4318ffd9] text-white 
                     rounded-lg shadow-lg shadow-primary/30 hover:bg-primary/90 
                     transition-colors duration-200"
          >
            <FiPlus className="w-5 h-5 mr-2" />
            Create Course
          </motion.button>
        </div>

        {/* Main Content */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden">
          {isLoading ? (
            <div className="p-6">
              <LoadingState />
            </div>
          ) : error ? (
            <div className="p-6 text-center">
              <p className="text-red-500">{error}</p>
              <button
                onClick={fetchCourses}
                className="mt-4 text-primary hover:text-primary/80"
              >
                Try Again
              </button>
            </div>
          ) : (
            <CourseList
              courses={courses}
              onEditCourse={handleEditCourse}
              onDeleteCourse={handleDeleteCourse}
            />
          )}
        </div>

        {/* Course Creation/Edit Modal */}
        <AnimatePresence>
          {showCreateModal && (
            <CourseCreation
              onCourseCreated={handleCourseCreated}
              courseToEdit={courseToEdit}
              onClose={() => {
                setShowCreateModal(false);
                setCourseToEdit(null);
              }}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Toast Container */}
      <Toaster
        position="bottom-right"
        
      />
    </motion.div>
  );
};

export default CourseManagement;