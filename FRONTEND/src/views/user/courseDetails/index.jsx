import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FileText, Folder, Loader2, ChevronRight, X, Menu } from 'lucide-react';
import PdfViewer from './PdfViewer';
import { trackPageTime } from 'utils/socket'; // Import the tracking utility

const CourseDetails = () => {
  const { id } = useParams(); // Course ID
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPdf, setSelectedPdf] = useState(null);
  const [expandedFolder, setExpandedFolder] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    const userId = user?._id;

    // Start tracking when the page is loaded
    const stopTracking = trackPageTime(userId, 'course', id);

    const fetchCourseDetails = async () => {
      try {
        const response = await fetch(
          `http://13.51.106.41:3001/api/course/user-courses/${userId}`
        );
        const data = await response.json();
        if (data.success) {
          const selectedCourse = data.courses.find((course) => course.id === id);
          setCourse(selectedCourse);
          setSelectedPdf(selectedCourse.folders[0]?.pdfs[0]);
          setExpandedFolder(selectedCourse.folders[0]?.folderName);
        } else {
          alert(data.message);
        }
      } catch (error) {
        console.error('Error fetching course details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseDetails();

    // Stop tracking when the component is unmounted
    return () => {
      stopTracking();
    };
  }, [id]);

  const Sidebar = () => (
    <div className="p-6 h-screen overflow-y-auto">
      <h2 className="text-xl font-bold text-gray-800 mb-6">Course Content</h2>
      <div className="space-y-4">
        {course.folders.map((folder) => (
          <div key={folder.folderName} className="bg-gray-50 rounded-lg">
            <button
              className="flex items-center justify-between w-full p-4 text-left"
              onClick={() =>
                setExpandedFolder(
                  expandedFolder === folder.folderName
                    ? null
                    : folder.folderName
                )
              }
            >
              <div className="flex items-center gap-2">
                <Folder className="w-5 h-5 text-[rgba(67,24,255,0.85)]" />
                <span className="font-medium text-gray-700">
                  {folder.folderName}
                </span>
              </div>
              <ChevronRight
                className={`w-5 h-5 text-gray-400 transition-transform ${
                  expandedFolder === folder.folderName ? 'rotate-90' : ''
                }`}
              />
            </button>

            {expandedFolder === folder.folderName && (
              <div className="p-4 pt-0 space-y-2">
                {folder.pdfs.map((pdf) => (
                  <button
                    key={pdf}
                    className={`flex items-center gap-3 w-full p-2 rounded-lg transition-colors ${
                      selectedPdf === pdf
                        ? 'bg-[rgba(67,24,255,0.1)] text-[rgba(67,24,255,0.85)]'
                        : 'hover:bg-gray-100 text-gray-600'
                    }`}
                    onClick={() => {
                      setSelectedPdf(pdf);
                      setIsSidebarOpen(false);
                    }}
                  >
                    <FileText className="w-4 h-4" />
                    <span className="text-sm truncate">{pdf}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-[rgba(67,24,255,0.85)]" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-600">
        Course not found
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Mobile Sidebar */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity lg:hidden ${
          isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsSidebarOpen(false)}
      />

      <div
        className={`fixed inset-y-0 left-0 w-80 bg-white shadow-lg z-50 transform transition-transform lg:hidden ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <Sidebar />
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-80 bg-white shadow-lg">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1">
        <div className="p-4">
          <div className="bg-white rounded-xl shadow-lg p-6 mb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setIsSidebarOpen(true)}
                  className="lg:hidden p-2 hover:bg-[rgba(67,24,255,0.1)] rounded-full transition-colors duration-200"
                >
                  <Menu className="w-6 h-6 text-[rgba(67,24,255,0.85)]" />
                </button>
                <h1 className="text-3xl font-bold text-gray-800">
                  {course.name}
                </h1>
              </div>
              <button
                onClick={() => navigate('/user/courses')}
                className="p-2 hover:bg-[rgba(67,24,255,0.1)] rounded-full transition-colors duration-200"
              >
                <X className="w-6 h-6 text-[rgba(67,24,255,0.85)]" />
              </button>
            </div>
          </div>

          {/* PDF Viewer */}
          <div className="h-[calc(100vh-180px)]">
            <PdfViewer pdfKey={selectedPdf} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;
