// import React, { useState } from 'react';
// import { useGoogleLogin } from '@react-oauth/google';
// import toast, { Toaster } from 'react-hot-toast';
// import { Lock } from 'lucide-react';

// const GoogleAuth = () => {
//   const [loading, setLoading] = useState(false);

//   const login = useGoogleLogin({
//     onSuccess: async (response) => {
//       setLoading(true);
//       try {
//         const googleResponse = await fetch(
//           'https://www.googleapis.com/oauth2/v3/userinfo',
//           {
//             headers: {
//               Authorization: `Bearer ${response.access_token}`,
//             },
//           }
//         );
//         const userInfo = await googleResponse.json();

//         console.log('Google User Info:', userInfo);

//         const res = await fetch('http://localhost:3001/api/auth/google', {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({
//             googleId: userInfo.sub,
//             name: userInfo.name,
//             email: userInfo.email,
//             picture: userInfo.picture,
//           }),
//         });

//         const data = await res.json();
//         toast.remove();
//         if (data.success) {
//           console.log('User stored successfully:', data.user);
//           toast.success('Login Successful!');
//         } else {
//           console.error('Failed to log in:', data.message);
//           toast.error('Failed to log in.');
//         }
//       } catch (error) {
//         toast.error('An error occurred.');
//         console.error('Error during authentication:', error);
//       } finally {
//         setLoading(false);
//       }
//     },
//     onError: () => {
//       toast.error('Google Sign-In Failed');
//       console.error('Login Failed');
//     },
//   });

//   return (
//     <div className="w-full flex items-center justify-center">
//       <div className="w-full mx-8">
//         <div className="text-center mb-8">
//           <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
//             <Lock className="w-6 h-6 text-blue-600" />
//           </div>
//           <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome Back</h1>
//           <p className="text-gray-500">Sign in to your account to continue</p>
//         </div>

//         <div className="w-full space-y-6 mt-8">
//           <button
//             onClick={() => {
//               if (!loading) login();
//             }}
//             disabled={loading}
//             className={`w-full flex items-center justify-center gap-3 px-6 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all ${
//               loading ? 'cursor-not-allowed opacity-75' : ''
//             }`}
//           >
//             {loading ? (
//               <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
//             ) : (
//               <img
//                 src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQgMhgB-GccVnB-ZJFuZg7HUsmdifnuxStqmA&s"
//                 alt="Google Icon"
//                 className="w-5 h-5"
//               />
//             )}
//             <span className="text-gray-700 font-medium">Continue with Google</span>
//           </button>

//           <div className="relative my-8">
//             <div className="absolute inset-0 flex items-center">
//               <div className="w-full  border-gray-200"></div>
//             </div>
           
//           </div>

//           <div className="text-center space-y-4 mt-8">
//             <p className="text-sm text-gray-500">
//               By signing in, you agree to our{' '}
//               <a href="#" className="text-blue-600 hover:text-blue-500">
//                 Terms of Service
//               </a>{' '}
//               and{' '}
//               <a href="#" className="text-blue-600 hover:text-blue-500">
//                 Privacy Policy
//               </a>
//             </p>
//             <p className="text-sm text-gray-500">
//               Need help?{' '}
//               <a href="#" className="text-blue-600 hover:text-blue-500">
//                 Contact Support
//               </a>
//             </p>
//           </div>
//         </div>
//       </div>
//       <Toaster />
//     </div>
//   );
// };

// export default GoogleAuth;

import React from 'react'

function GoogleAuth() {
  return (
    <div>GoogleAuth</div>
  )
}

export default GoogleAuth