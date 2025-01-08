/* eslint-disable react-hooks/exhaustive-deps */
import React, { createContext, useContext, useEffect, useState } from "react";
import { Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import AdminLayout from "layouts/admin";
import AuthLayout from "layouts/auth";
import UserLayout from "layouts/user";
import Landing from "./layouts/landing/index";
import Waiting from "./pages/waiting";
import PrivacyPolicy from "pages/privacy";
import TermsAndConditions from "pages/Terms";
import AnalyticsSection from './views/admin/users/AnalyticsSection';
import CourseDetails from "./views/user/courseDetails/index";

// Create session context
const SessionContext = createContext();

// SessionProvider component
  const SessionProvider = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation(); 
  const [sessionValid, setSessionValid] = useState(null); 
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkSession = async () => {
    setLoading(true);
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user._id || !user.deviceId) {
      setSessionValid(false);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("http://13.51.106.41:3001/api/auth/session-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user._id,
          deviceId: user.deviceId,
        }),
      });

      const data = await response.json();

      if (!data.success || !data.isValidSession) {
        localStorage.clear();
        toast.error("Session expired or logged in from another device");
        setSessionValid(false);
        setLoading(false);
        navigate("/auth/sign-in");
      } else {
        setSessionValid(true);
        setIsAdmin(data.user?.adminAuthorization || false);
        setLoading(false);
      }
    } catch (error) {
      console.error("Session check failed:", error);
      toast.error("Failed to verify session. Please log in again.");
      setSessionValid(false);
      setLoading(false);
      navigate("/auth/sign-in");
    }
  };

  useEffect(() => {
    checkSession();
  }, [location]);

  return (
    <SessionContext.Provider value={{ sessionValid, isAdmin, loading }}>
      {children}
    </SessionContext.Provider>
  );
};

// Custom hook for accessing session context
export const useSession = () => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
};

// Protected Route wrapper
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { sessionValid, isAdmin, loading } = useSession();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (!sessionValid) {
        navigate("/auth/sign-in");
      } else if (adminOnly && !isAdmin) {
        navigate("/user");
      }
    }
  }, [sessionValid, isAdmin, adminOnly, loading, navigate]);

  if (loading) {
    return null; // Or render a loading indicator
  }

  return sessionValid ? children : null;
};

// Public Route wrapper
const PublicRoute = ({ children }) => {
  const { sessionValid, isAdmin, loading } = useSession();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (sessionValid) {
        if (isAdmin) {
          navigate("/admin");
        } else {
          navigate("/user");
        }
      }
    }
  }, [sessionValid, isAdmin, loading, navigate]);

  if (loading) {
    return null; // Or render a loading indicator
  }

  return !sessionValid ? children : null;
};

// Main App Component
const App = () => {
  return (
    <SessionProvider>
      <Routes>
        {/* Authentication Routes */}
        <Route
          path="auth/*"
          element={
            <PublicRoute>
              <AuthLayout />
            </PublicRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path="admin/*"
          element={
            <ProtectedRoute adminOnly={true}>
              <AdminLayout />
            </ProtectedRoute>
          }
        />

        {/* User Routes */}
        <Route
          path="user/*"
          element={
            <ProtectedRoute>
              <UserLayout />
            </ProtectedRoute>
          }
        />

        {/* Public and Utility Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/waiting" element={<Waiting />} />
        <Route path="*" element={<Navigate to="/auth/sign-in" replace />} />
        <Route path="/privacy" element={<PrivacyPolicy/>} />
        <Route path="/terms" element={<TermsAndConditions/>} />
        <Route path="/user/course/:id" element={<CourseDetails />} /> 

        <Route path="/" element={<Landing />}/>
        <Route path="/waiting" element={<Waiting />} />
        <Route path="user/course/:id" element={<CourseDetails />} />
        <Route path="*" element={<Navigate to="/user" replace />} />
        <Route path="/landing" element={<Landing />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        {/* <Route path="/terms" element={<Terms />} /> */}
        <Route path="/admin/users/:userId" element={<AnalyticsSection />} />
      </Routes>
    </SessionProvider>
  );
};

export default App;
