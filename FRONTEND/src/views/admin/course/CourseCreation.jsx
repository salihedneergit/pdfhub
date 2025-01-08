import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiFolder, FiPlusCircle, FiX, FiTrash2, FiFile } from 'react-icons/fi';

const CourseCreation = ({ onCourseCreated, courseToEdit, onClose }) => {
  const [courseName, setCourseName] = useState('');
  const [folders, setFolders] = useState([{ name: '', pdfs: [] }]);
  const [availablePdfs, setAvailablePdfs] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [showPdfSelector, setShowPdfSelector] = useState(false);

  useEffect(() => {
    const fetchPdfs = async () => {
      try {
        const response = await fetch('http://13.51.106.41:3001/api/pdf/list-pdfs');
        const data = await response.json();
        setAvailablePdfs(data);
      } catch (error) {
        console.error('Error fetching PDFs:', error);
      }
    };

    fetchPdfs();

    if (courseToEdit) {
      setCourseName(courseToEdit.name);
      setFolders(courseToEdit.folders);
    }
  }, [courseToEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const endpoint = courseToEdit
        ? `http://13.51.106.41:3001/api/course/update-course/${courseToEdit._id}`
        : 'http://13.51.106.41:3001/api/course/create-course';

      const response = await fetch(endpoint, {
        method: courseToEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: courseName,
          folders: folders.filter(folder => folder.name.trim() !== '')
        }),
      });

      const result = await response.json();
      if (response.ok) {
        onCourseCreated(result.course);
      }
    } catch (error) {
      console.error('Error saving course:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const addFolder = () => {
    setFolders([...folders, { name: '', pdfs: [] }]);
  };

  const removeFolder = (index) => {
    setFolders(folders.filter((_, i) => i !== index));
  };

  const updateFolderName = (index, name) => {
    const updatedFolders = [...folders];
    updatedFolders[index].name = name;
    setFolders(updatedFolders);
  };

  const togglePdfInFolder = (folderIndex, pdf) => {
    const updatedFolders = [...folders];
    const folder = updatedFolders[folderIndex];
    
    if (folder.pdfs.includes(pdf)) {
      folder.pdfs = folder.pdfs.filter(p => p !== pdf);
    } else {
      folder.pdfs = [...folder.pdfs, pdf];
    }
    
    setFolders(updatedFolders);
  };

  // Animation variants
  const modalVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: { type: 'spring', damping: 20, stiffness: 300 }
    },
    exit: { 
      opacity: 0, 
      scale: 0.9, 
      y: 20,
      transition: { duration: 0.2 }
    }
  };

  const folderVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <motion.div
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-2xl"
        >
          {/* Modal Header */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {courseToEdit ? 'Edit Course' : 'Create New Course'}
              </h2>
              <motion.button
                whileHover={{ rotate: 90 }}
                transition={{ duration: 0.2 }}
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500 p-1"
              >
                <FiX className="w-6 h-6" />
              </motion.button>
            </div>
          </div>

          {/* Modal Body */}
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Course Name Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Course Name
                </label>
                <input
                  type="text"
                  value={courseName}
                  onChange={(e) => setCourseName(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 
                           focus:ring-2 focus:ring-primary/50 focus:border-primary 
                           dark:bg-gray-700 dark:border-gray-600 dark:text-white
                           transition-all duration-200"
                  placeholder="Enter course name"
                  required
                />
              </div>

              {/* Folders Section */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Course Folders
                  </label>
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={addFolder}
                    className="flex items-center text-primary hover:text-primary/80 
                             transition-colors px-3 py-1 rounded-lg hover:bg-primary/10"
                  >
                    <FiPlusCircle className="w-4 h-4 mr-2" />
                    Add Folder
                  </motion.button>
                </div>

                {/* Folder List */}
                <div className="space-y-4">
                  <AnimatePresence>
                    {folders.map((folder, index) => (
                      <motion.div
                        key={index}
                        variants={folderVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 space-y-4"
                      >
                        <div className="flex items-center space-x-4">
                          <FiFolder className="w-5 h-5 text-primary" />
                          <input
                            type="text"
                            value={folder.name}
                            onChange={(e) => updateFolderName(index, e.target.value)}
                            placeholder="Folder name"
                            className="flex-1 px-3 py-2 rounded-lg border border-gray-300
                                     focus:ring-2 focus:ring-primary/50 focus:border-primary
                                     dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                          />
                          <motion.button
                            type="button"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => removeFolder(index)}
                            className="text-red-500 hover:text-red-600 p-1"
                          >
                            <FiTrash2 className="w-5 h-5" />
                          </motion.button>
                        </div>

                        {/* PDF Selection */}
                        <div className="pl-9">
                          <div className="flex flex-wrap gap-2">
                            {folder.pdfs.map((pdf) => (
                              <div
                                key={pdf}
                                className="flex items-center bg-primary/10 text-primary
                                         px-3 py-1 rounded-full text-sm"
                              >
                                <FiFile className="w-4 h-4 mr-2" />
                                {pdf}
                                <button
                                  type="button"
                                  onClick={() => togglePdfInFolder(index, pdf)}
                                  className="ml-2 hover:text-red-500"
                                >
                                  <FiX className="w-4 h-4" />
                                </button>
                              </div>
                            ))}
                            <motion.button
                              type="button"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => {
                                setSelectedFolder(index);
                                setShowPdfSelector(true);
                              }}
                              className="flex items-center text-primary hover:text-primary/80
                                       px-3 py-1 rounded-full border border-primary/30
                                       hover:bg-primary/10 text-sm"
                            >
                              <FiPlusCircle className="w-4 h-4 mr-2" />
                              Add PDFs
                            </motion.button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full py-3 rounded-xl text-white font-medium bg-[#4318ffd9]
                            shadow-lg shadow-primary/30 transition-all duration-200
                            ${isSubmitting 
                              ? 'bg-primary/70 cursor-not-allowed' 
                              : 'bg-primary hover:bg-primary/90'}`}
                >
                  {isSubmitting ? 'Saving...' : courseToEdit ? 'Update Course' : 'Create Course'}
                </motion.button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>

      {/* PDF Selector Modal */}
      <AnimatePresence>
        {showPdfSelector && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-60 flex items-center justify-center p-4"
          >
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowPdfSelector(false)} />
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="relative bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-lg p-6"
            >
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                Select PDFs
              </h3>
              <div className="max-h-96 overflow-y-auto">
                {availablePdfs.map((pdf) => (
                  <motion.div
                    key={pdf}
                    whileHover={{ x: 4 }}
                    className="flex items-center p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                  >
                    <label className="flex items-center space-x-3 cursor-pointer w-full">
                      <input
                        type="checkbox"
                        checked={folders[selectedFolder]?.pdfs.includes(pdf)}
                        onChange={() => togglePdfInFolder(selectedFolder, pdf)}
                        className="w-4 h-4 text-primary rounded border-gray-300
                                 focus:ring-primary dark:border-gray-600"
                      />
                      <span className="flex items-center text-gray-700 dark:text-gray-300">
                        <FiFile className="w-4 h-4 mr-2 text-primary" />
                        {pdf}
                      </span>
                    </label>
                  </motion.div>
                ))}
              </div>
              <div className="mt-4 flex justify-end">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowPdfSelector(false)}
                  className="px-4 py-2 bg-primary text-white rounded-lg"
                >
                  Done
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CourseCreation;