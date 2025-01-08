import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useGoogleLogin } from '@react-oauth/google';
import toast, { Toaster } from 'react-hot-toast';
import { Lock, Sparkles, ShieldCheck, Zap, Users } from 'lucide-react';
import Footer from "components/footer/FooterAuthDefault";
import routes from "routes.js";
import axios from 'axios';

export default function Auth() {
  const [loading, setLoading] = useState(false);
  const [theme] = useState('light');
  const navigate = useNavigate();

  const getDeviceInfo = () => {
    return {
      browser: navigator.userAgent,
      os: navigator.platform,
      language: navigator.language,
      screenResolution: `${window.screen.width}x${window.screen.height}`,
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      timestamp: new Date().toISOString(),
    };
  };

  const startSessionCheck = (userId, deviceId) => {
    const intervalId = setInterval(async () => {
      try {
        const response = await fetch('http://13.51.106.41:3001/api/auth/session-check', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId, deviceId }),
        });

        const data = await response.json();
        
        // Handle blocked user
        if (response.status === 403) {
          clearInterval(intervalId);
          localStorage.clear();
          toast.error(data.message || 'Account is blocked');
          navigate('/waiting');
          return;
        }

        // Handle invalid session
        if (!data.success || !data.isValidSession) {
          clearInterval(intervalId);
          localStorage.clear();
          toast.error('Session expired or logged in from another device');
          navigate('/auth/sign-in');
        }

      } catch (error) {
        console.error('Session check failed:', error);
      }
    }, 30000);

    localStorage.setItem('sessionCheckInterval', intervalId);
  };

  useEffect(() => {
    // Clear any existing intervals on component mount
    const existingInterval = localStorage.getItem('sessionCheckInterval');
    if (existingInterval) {
      clearInterval(parseInt(existingInterval));
      localStorage.removeItem('sessionCheckInterval');
    }

    // Clear interval on component unmount
    return () => {
      const interval = localStorage.getItem('sessionCheckInterval');
      if (interval) {
        clearInterval(parseInt(interval));
        localStorage.removeItem('sessionCheckInterval');
      }
    };
  }, []);

  // const login = useGoogleLogin({
  //   onSuccess: async (response) => {
  //     setLoading(true);
  //     try {
  //       // fetch ip
  //       const ipResponse = await axios.get('https://api.ipify.org?format=json');
  //       const userIp = ipResponse.data.ip;
  //       console.log(userIp);
  //       // Fetch user info from Google
  //       const googleResponse = await fetch(
  //         'https://www.googleapis.com/oauth2/v3/userinfo',
  //         {
  //           headers: {
  //             Authorization: `Bearer ${response.access_token}`,
  //           },
  //         }
  //       );
  //       const userInfo = await googleResponse.json();

  //       // Gather device info
  //       const deviceInfo = getDeviceInfo();
  //       // Send to your backend
  //       const res = await fetch('http://13.51.106.41:3001/api/auth/google', {
  //         method: 'POST',
  //         headers: { 'Content-Type': 'application/json' },
  //         body: JSON.stringify({
  //           googleId: userInfo.sub,
  //           name: userInfo.name,
  //           email: userInfo.email,
  //           picture: userInfo.picture,
  //           deviceInfo,
  //           userIp,
  //         }),
  //       });

  //       // Check status first, then parse JSON
  //       const { status } = res;
  //       const data = await res.json();
  //       toast.remove();

  //       // If 403 => blocked
  //       if (status === 403) {
  //         toast.error(data.message || 'Blocked');
  //         navigate('/waiting');
  //         setLoading(false);
  //         return;
  //       }

  //       // Otherwise, proceed as normal
  //       if (data.success) {
  //         // Prepare user data for Local Storage
  //         const userData = {
  //           _id: data.user._id,
  //           googleId: userInfo.sub,
  //           name: userInfo.name,
  //           email: userInfo.email,
  //           picture: userInfo.picture,
  //           deviceId: data.user.deviceId,
  //           token: data.user.token,
  //           isActive: data.user.isActive,
  //         };

  //         // Store user data
  //         localStorage.setItem('user', JSON.stringify(userData));
  //         localStorage.setItem('isAuthenticated', 'true');

  //         startSessionCheck(userData._id, userData.deviceId);

  //         toast.success('Login Successful!');

  //         // If user is active, go to admin or user dashboard
  //         if (userData.isActive) {
  //           if (
  //             userData.email === 'alsl.masters@gmail.com' ||
  //             userData.email === 'admin@gmail.com' ||
  //             userData.email === 'adbit.tesa@gmail.com'
  //           ) {
  //             navigate('/admin/dashboard');
  //           } else {
  //             navigate('/user/dashboard');
  //           }
  //         } else {
            
  //           navigate('/pending');
  //         }
  //       } else {
  //         // If `data.success` is false
  //         console.error('Failed to log in:', data.message);
  //         toast.error(data.message || 'Failed to log in.');
  //       }
  //     } catch (error) {
  //       toast.error('An error occurred during login.');
  //       console.error('Error during authentication:', error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   },
  //   onError: () => {
  //     toast.error('Google Sign-In Failed');
  //     console.error('Login Failed');
  //   },
  // });

  const login = useGoogleLogin({
    onSuccess: async (response) => {
      setLoading(true);
      toast.loading('Signing in...');
  
      try {
        // Get user's IP
        const ipResponse = await axios.get('https://api.ipify.org?format=json');
        const userIp = ipResponse.data.ip;
  
        // Get Google user info
        const googleResponse = await fetch(
          'https://www.googleapis.com/oauth2/v3/userinfo',
          {
            headers: {
              Authorization: `Bearer ${response.access_token}`,
            },
          }
        );
        
        if (!googleResponse.ok) {
          throw new Error('Failed to fetch Google user info');
        }
  
        const userInfo = await googleResponse.json();
        const deviceInfo = getDeviceInfo();
  
        // Authenticate with backend
        const authResponse = await fetch('http://13.51.106.41:3001/api/auth/google', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            googleId: userInfo.sub,
            name: userInfo.name,
            email: userInfo.email,
            picture: userInfo.picture,
            deviceInfo,
            userIp,
          }),
        });
  
        const data = await authResponse.json();
        toast.dismiss(); // Clear the loading toast
  
        // First check if request was successful
        if (!data.success) {
          toast.error(data.message || 'Authentication failed');
          return;
        }
  
        // Handle blocked user case
        if (authResponse.status === 403) {
          toast.error(data.message || 'Account is blocked');
          navigate('/waiting');
          return;
        }
  
        // For new users or pending activation
        if (!data.user.isActive) {
          toast.success('Account created! Awaiting activation.');
          navigate('/waiting');
          return;
        }
  
        // For active users
        if (data.user.isActive) {
          // Prepare user data for storage
          const userData = {
            _id: data.user._id,
            googleId: userInfo.sub,
            name: userInfo.name,
            email: userInfo.email,
            picture: userInfo.picture,
            deviceId: data.user.deviceId,
            token: data.user.token,
            isActive: data.user.isActive,
          };
  
          // Store user data
          localStorage.setItem('user', JSON.stringify(userData));
          localStorage.setItem('isAuthenticated', 'true');
  
          // Start session check
          startSessionCheck(userData._id, userData.deviceId);
  
          toast.success('Login successful!');
  
          // Navigate based on email
          if (
            userData.email === 'alsl.masters@gmail.com' ||
            userData.email === 'admin@gmail.com' ||
            userData.email === 'adbit.tesa@gmail.com'
          ) {
            navigate('/admin/dashboard');
          } else {
            navigate('/user/dashboard');
          }
        }
  
      } catch (error) {
        console.error('Login error:', error);
        toast.error('Login failed. Please try again.');
      } finally {
        setLoading(false);
      }
    },
    onError: () => {
      toast.error('Google Sign-In Failed');
      console.error('Login Failed');
      setLoading(false);
    },
  });


  const getRoutes = (routes) => {
    return routes.map((prop, key) => {
      if (prop.layout === "/auth") {
        return (
          <Route path={`/${prop.path}`} element={prop.component} key={key} />
        );
      } else {
        return null;
      }
    });
  };

  document.documentElement.dir = "ltr";

  return (
    <div className={`${theme}`}>
      <div className="relative float-right h-full min-h-screen w-full bg-white dark:bg-gray-900 transition-colors duration-300">
        <main className="mx-auto min-h-screen">
          <div className="relative flex min-h-screen">
            {/* Left Section */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#4318FF] to-[#9f87ff] relative overflow-hidden">
              {/* Animated Background */}
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIj4KPGRlZnM+CjxwYXR0ZXJuIGlkPSJwYXR0ZXJuIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgcGF0dGVyblRyYW5zZm9ybT0icm90YXRlKDQ1KSI+CjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjEpIi8+CjwvcGF0dGVybj4KPC9kZWZzPgo8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI3BhdHRlcm4pIi8+Cjwvc3ZnPg==')] opacity-20"></div>

              {/* Content */}
              <div className="relative z-10 text-white w-full flex flex-col justify-center p-16">
                <div className="mb-8 flex items-center">
                  <Sparkles className="w-8 h-8 mr-4" />
                  <h1 className="text-5xl font-bold">Welcome Back</h1>
                </div>
                <p className="text-xl text-gray-100 mb-16 leading-relaxed max-w-xl">
                  Access a vast library of high-quality study notes created by top students and educators. Find exactly what you need to excel in your studies.
                </p>
                
                <div className="space-y-8">
                  <div className="flex items-center space-x-6 backdrop-blur-sm bg-white/10 p-4 rounded-xl transform hover:scale-105 transition-all duration-300">
                    <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center shrink-0">
                      <ShieldCheck className="w-6 h-6 text-white" />
                    </div>
                    <p className="text-lg text-gray-100">Verified notes from top-performing students</p>
                  </div>
                  
                  <div className="flex items-center space-x-6 backdrop-blur-sm bg-white/10 p-4 rounded-xl transform hover:scale-105 transition-all duration-300">
                    <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center shrink-0">
                      <Zap className="w-6 h-6 text-white" />
                    </div>
                    <p className="text-lg text-gray-100">Instant access to notes across all subjects</p>
                  </div>
                  
                  <div className="flex items-center space-x-6 backdrop-blur-sm bg-white/10 p-4 rounded-xl transform hover:scale-105 transition-all duration-300">
                    <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center shrink-0">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <p className="text-lg text-gray-100">24/7 study support when you need it</p>
                  </div>
                </div>
              </div>

              {/* Animated circles */}
              <div className="absolute top-0 right-0 -mt-32 -mr-32 w-96 h-96 rounded-full bg-white opacity-10"></div>
              <div className="absolute bottom-0 left-0 -mb-32 -ml-32 w-96 h-96 rounded-full bg-white opacity-10"></div>
            </div>

            {/* Right Section */}
            <div className="w-full lg:w-1/2 flex flex-col min-h-screen">
              <div className="flex-1 flex flex-col">
                <div className="flex-1 flex items-center justify-center">
                  <div className="w-full max-w-md px-8">
                    <div className="text-center mb-8">
                      <div className="mx-auto w-16 h-16 bg-gradient-to-br from-[#4318FF] to-[#9f87ff] rounded-full flex items-center justify-center mb-6 shadow-lg shadow-purple-200 dark:shadow-purple-900/20">
                        <Lock className="w-8 h-8 text-white" />
                      </div>
                      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">Welcome Back</h1>
                      <p className="text-gray-500 dark:text-gray-400">Sign in to your account to continue</p>
                    </div>

                    <div className="w-full space-y-6">
                      <button
                        onClick={() => {
                          if (!loading) login();
                        }}
                        disabled={loading}
                        className={`w-full flex items-center justify-center gap-3 px-6 py-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-400 dark:hover:border-gray-600 transition-all duration-300 shadow-sm hover:shadow-md ${
                          loading ? 'cursor-not-allowed opacity-75' : ''
                        }`}
                      >
                        {loading ? (
                          <div className="w-5 h-5 border-2 border-[#4318FF] border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <img
                            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQgMhgB-GccVnB-ZJFuZg7HUsmdifnuxStqmA&s"
                            alt="Google Icon"
                            className="w-5 h-5"
                          />
                        )}
                        <span className="text-gray-700 dark:text-gray-200 font-medium">Continue with Google</span>
                      </button>

                      <div className="text-center space-y-4">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          By signing in, you agree to our{' '}
                          <a href="http://13.51.106.41:3001/terms" className="text-[#4318FF] hover:text-[#9f87ff] transition-colors duration-300">
                            Terms of Service
                          </a>{' '}
                          and{' '}
                          <a href="http://13.51.106.41:3001/privacy" className="text-[#4318FF] hover:text-[#9f87ff] transition-colors duration-300">
                            Privacy Policy
                          </a>
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Need help?{' '}
                          <a href="mailto:usmleshops@gmail.com" className="text-[#4318FF] hover:text-[#9f87ff] transition-colors duration-300">
                            Contact Support
                          </a>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Hidden Routes */}
                <div className="hidden">
                  <Routes>
                    {getRoutes(routes)}
                    <Route
                      path="/"
                      element={<Navigate to="/auth/sign-in" replace />}
                    />
                  </Routes>
                </div>
              </div>

              {/* Footer */}
              <Footer />
            </div>
          </div>
        </main>
      </div>
      <Toaster 
        position="top-center"
        toastOptions={{
          duration: 3001,
          style: {
            background: theme === 'dark' ? '#374151' : '#fff',
            color: theme === 'dark' ? '#fff' : '#000',
          },
        }}
      />
    </div>
  );
}
