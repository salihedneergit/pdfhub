import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Book, Calendar, Loader2, AlertTriangle, Lock } from 'lucide-react';
import ProgressBar from '../../../components/ProgressBar';

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      const user = JSON.parse(localStorage.getItem('user'));
      const userId = user?._id;

      try {
        const response = await fetch(`http://13.51.106.41:3001/api/course/user-courses/${userId}`);
        const data = await response.json();

        if (data.success) {
          // Sort courses so active ones appear first
          const sortedCourses = data.courses.sort((a, b) => {
            if (a.isExpired === b.isExpired) return 0;
            return a.isExpired ? 1 : -1; // Active courses first
          });
          setCourses(sortedCourses);
        } else {
          alert(data.message);
        }
      } catch (error) {
        console.error('Error fetching courses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen flex-col">
        <Loader2 className="w-8 h-8 animate-spin text-[rgba(67,24,255,0.85)]" />
        <p className="mt-4 text-gray-600">Loading your courses...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 md:p-10">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-4">
          Your Learning Dashboard
        </h1>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course) => {
            const isExpired = course.isExpired;

            return (
              <div
                key={course.id}
                className={`bg-white rounded-xl shadow-lg transition-all duration-300 transform ${
                  isExpired
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:shadow-xl cursor-pointer hover:-translate-y-1'
                }`}
                onClick={() => {
                  if (!isExpired) navigate(`/user/course/${course.id}`);
                }}
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="bg-[rgba(67,24,255,0.1)] p-3 rounded-lg">
                      <Book className="w-6 h-6 text-[rgba(67,24,255,0.85)]" />
                    </div>
                    <span
                      className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                        isExpired
                          ? 'bg-red-100 text-red-600'
                          : 'bg-[rgba(67,24,255,0.1)] text-[rgba(67,24,255,0.85)]'
                      }`}
                    >
                      {isExpired ? 'Expired' : 'In Progress'}
                    </span>
                  </div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">
                    {course.name}
                  </h2>
                  <div className="flex items-center text-gray-500 text-sm mb-4 font-semibold">
                    <Calendar className="w-4 h-4 mr-2" />
                    {new Date(course.expiryDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </div>
                  <ProgressBar progress={isExpired ? 0 : 100} />
                  <div className="mt-2 flex justify-between text-sm">
                    <span className="text-gray-500">
                      {isExpired ? 'Inactive' : 'Course'}
                    </span>
                    {isExpired && (
                      <Lock className="text-red-600 w-4 h-4" title="Expired" />
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Warning Message */}
        <div className="mt-10 bg-yellow-100 border-l-4 border-yellow-500 p-4 rounded-xl shadow-md">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="w-6 h-6 text-yellow-500" />
            <div>
              <p className="text-yellow-800 font-semibold">Warning:</p>
              <p className="text-yellow-700 mt-2 text-sm">
                This content and subscription are licensed for individual use
                only. Sharing, copying, or unauthorized distribution will result
                in immediate access termination. Refunds are not provided. Usage
                is actively monitored.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Courses;
