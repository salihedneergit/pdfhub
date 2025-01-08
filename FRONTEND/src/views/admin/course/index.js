import React, { Suspense } from 'react';
import { motion } from 'framer-motion';
const CourseManagement = React.lazy(() => import('./CourseManagement'));

const LoadingScreen = () => (
  <div className="fixed inset-0 bg-white dark:bg-gray-900 flex items-center justify-center">
    <div className="space-y-4">
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
        }}
        className="w-16 h-16 rounded-full bg-primary/50"
      />
      <p className="text-center text-primary font-medium">Loading...</p>
    </div>
  </div>
);

const App = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Suspense fallback={<LoadingScreen />}>
        <CourseManagement />
      </Suspense>
    </div>
  );
};

export default App;