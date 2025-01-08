import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiFolder,
  FiFile,
  FiEdit2,
  FiTrash2,
  FiMenu,
  FiX,
  FiChevronRight,
  FiSearch,
  FiGrid,
  FiList,
} from "react-icons/fi";

const CourseList = ({ courses, onEditCourse, onDeleteCourse }) => {
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'list'

  // Filter courses based on search query
  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      const searchLower = searchQuery.toLowerCase();
      return (
        course.name.toLowerCase().includes(searchLower) ||
        course.folders.some(
          (folder) =>
            folder.name.toLowerCase().includes(searchLower) ||
            folder.pdfs.some((pdf) => pdf.toLowerCase().includes(searchLower))
        )
      );
    });
  }, [courses, searchQuery]);

  const handleDeleteClick = async (courseId, event) => {
    event.stopPropagation();
    if (window.confirm("Are you sure you want to delete this course?")) {
      try {
        await onDeleteCourse(courseId);
      } catch (error) {
        console.error("Error deleting course:", error);
      }
    }
  };

  // Search Header Component
const SearchHeader = () => {
  const [localSearchValue, setLocalSearchValue] = useState(searchQuery);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setLocalSearchValue(value);
    setSearchQuery(value);
  };

  return (
    <div className="m-5 mb-6 space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          {/* <div className="relative flex items-center">
            <FiSearch className="absolute left-3 h-5 w-5 text-gray-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search courses, folders, or files..."
              value={localSearchValue}
              onChange={handleSearchChange}
              className="w-full min-w-[300px] rounded-xl border-2 border-[#4318ffd9] py-2 pl-10 pr-4 
                       outline-none focus:ring-2 focus:ring-[#4318ffd9]/30
                       dark:bg-gray-700 dark:text-white transition-all duration-200
                       placeholder:text-gray-400"
            />
          </div> */}
        </div>
        <div className="flex items-center space-x-2">
          <ViewToggle />
        </div>
      </div>
      {searchQuery && (
        <div className="m-5 text-lg text-gray-500 dark:text-gray-400">
          Found {filteredCourses.length}{" "}
          {filteredCourses.length === 1 ? "result" : "results"}
        </div>
      )}
    </div>
  );
};


  // View Toggle Component
  const ViewToggle = () => (
    <div className="flex items-center rounded-lg bg-gray-100 p-1 dark:bg-gray-700">
      <button
        onClick={() => setViewMode("grid")}
        className={`rounded-lg p-2 transition-colors ${
          viewMode === "grid"
            ? "bg-white text-[#4318ffd9] shadow-sm dark:bg-gray-600"
            : "text-gray-500 hover:text-[#4318ffd9]"
        }`}
      >
        <FiGrid className="h-5 w-5" />
      </button>
      <button
        onClick={() => setViewMode("list")}
        className={`rounded-lg p-2 transition-colors ${
          viewMode === "list"
            ? "bg-white text-[#4318ffd9] shadow-sm dark:bg-gray-600"
            : "text-gray-500 hover:text-[#4318ffd9]"
        }`}
      >
        <FiList className="h-5 w-5" />
      </button>
    </div>
  );

  const CourseCard = ({ course, isMobile = false }) => (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-xl bg-white shadow-sm transition-all duration-200
                 hover:shadow-md dark:bg-gray-800 ${isMobile ? "p-4" : "p-6"}
                 ${viewMode === "list" ? "col-span-full" : ""}`}
      onClick={() => {
        setSelectedCourse(course);
        setShowMobileSidebar(true);
      }}
    >
      <div
        className={`flex items-center justify-between ${
          viewMode === "list" ? "mb-2" : "mb-4"
        }`}
      >
        <div className="flex items-center space-x-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#4318ffd9]/10">
            <FiFolder className="h-6 w-6 text-[#4318ffd9]" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {course.name}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {course.folders.length}{" "}
              {course.folders.length === 1 ? "folder" : "folders"}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              onEditCourse(course);
            }}
            className="rounded-lg p-2 text-gray-600 transition-colors
                     hover:bg-[#4318ffd9]/10 hover:text-[#4318ffd9]"
          >
            <FiEdit2 className="h-5 w-5" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => handleDeleteClick(course._id, e)}
            className="rounded-lg p-2 text-gray-600 transition-colors
                     hover:bg-red-50 hover:text-red-500"
          >
            <FiTrash2 className="h-5 w-5" />
          </motion.button>
        </div>
      </div>

      <div className={`space-y-4 ${viewMode === "list" ? "ml-16" : ""}`}>
        {course.folders.map((folder) => (
          <div
            key={folder.name}
            className="border-l-2 border-gray-100 pl-4 dark:border-gray-700"
          >
            <div className="mb-2 flex items-center space-x-3">
              <FiChevronRight className="h-4 w-4 text-gray-400" />
              <span className="text-base font-medium text-gray-700 dark:text-gray-300">
                {folder.name}
              </span>
              <span className="text-sm text-gray-500">
                ({folder.pdfs.length})
              </span>
            </div>
            <div className="ml-6 space-y-2">
              {folder.pdfs.map((pdf) => (
                <div
                  key={pdf}
                  className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400"
                >
                  <FiFile className="h-4 w-4 text-red-500" />
                  <span className="truncate">{pdf}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );

  // Mobile Sidebar
  const MobileSidebar = () => (
    <AnimatePresence>
      {showMobileSidebar && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-black/50 fixed inset-0 z-40 backdrop-blur-sm lg:hidden"
            onClick={() => setShowMobileSidebar(false)}
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 20 }}
            className="fixed bottom-0 right-0 top-0 z-50 w-full max-w-md overflow-y-auto 
                     bg-white shadow-xl dark:bg-gray-800 lg:hidden"
          >
            <div className="mt-15 sticky top-0 border-b border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Course Details
                </h2>
                <button
                  onClick={() => setShowMobileSidebar(false)}
                  className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400"
                >
                  <FiX className="h-6 w-6" />
                </button>
              </div>
            </div>
            <div className="p-4">
              {selectedCourse && (
                <CourseCard course={selectedCourse} isMobile={true} />
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  return (
    <>
      {/* Search and View Toggle Header */}
      <SearchHeader />

      {/* Mobile Toggle Button */}
      <div className="mb-4 lg:hidden">
        <button
          onClick={() => setShowMobileSidebar(true)}
          className="rounded-lg p-2 text-gray-600 hover:bg-[#4318ffd9]/10 hover:text-[#4318ffd9]"
        >
          {/* <FiMenu className="h-6 w-6" /> */}
        </button>
      </div>

      {/* Main Grid Layout */}
      <motion.div
        layout
        className={`grid ${
          viewMode === "grid"
            ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
            : "grid-cols-1"
        } gap-6`}
      >
        {filteredCourses.map((course) => (
          <CourseCard key={course._id} course={course} />
        ))}
        {filteredCourses.length === 0 && (
          <div className="col-span-full py-12 text-center">
            <FiFolder className="mx-auto mb-4 h-12 w-12 text-gray-400" />
            <p className="text-lg text-gray-500 dark:text-gray-400">
              {searchQuery
                ? "No courses found matching your search."
                : "No courses found. Create your first course to get started."}
            </p>
          </div>
        )}
      </motion.div>

      {/* Mobile Sidebar */}
      <MobileSidebar />
    </>
  );
};

export default CourseList;
