import React from "react";
import { motion } from "framer-motion";

// ===== BUBBLES (from the first snippet) =====
const bubbles = [
  { size: 80, initialX: -20, initialY: -20, duration: 15 },
  { size: 60, initialX: 50, initialY: 100, duration: 18 },
  { size: 40, initialX: 150, initialY: -50, duration: 20 },
  { size: 70, initialX: 250, initialY: 80, duration: 17 },
  { size: 50, initialX: 350, initialY: -30, duration: 19 },
];

const bubbleVariants = {
  animate: (custom) => ({
    x: [custom.initialX, custom.initialX + 30, custom.initialX],
    y: [custom.initialY, custom.initialY - 30, custom.initialY],
    rotate: [0, 360],
    transition: {
      duration: custom.duration,
      repeat: Infinity,
      ease: "linear",
    },
  }),
};

// ===== FEATURES (from the first snippet) =====
const features = [
  {
    icon: (
      <svg
        className="h-6 w-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
        />
      </svg>
    ),
    title: "Effortless Login",
    description: "Quick and secure access with Google login.",
  },
  {
    icon: (
      <svg
        className="h-6 w-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
        />
      </svg>
    ),
    title: "Personalized Dashboard",
    description: "Stay motivated with streaks and progress tracking.",
  },
  {
    icon: (
      <svg
        className="h-6 w-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
        />
      </svg>
    ),
    title: "PDF Viewer",
    description: "Access your notes anytime, anywhere.",
  },
  {
    icon: (
      <svg
        className="h-6 w-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
    title: "Pomodoro Timer",
    description: "Boost your focus with built-in timers.",
  },
  {
    icon: (
      <svg
        className="h-6 w-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
        />
      </svg>
    ),
    title: "To-Do List",
    description: "Stay organized with an integrated task manager.",
  },
  {
    icon: (
      <svg
        className="h-6 w-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
        />
      </svg>
    ),
    title: "Seamless Access",
    description: "Learn across devices without missing a beat.",
  },
];

// ===== ANIMATED DOCUMENTS (from the second snippet) =====
const documents = [
  { rotation: 15, delay: 0.2 },
  { rotation: 10, delay: 0.3 },
  { rotation: 5, delay: 0.4 },
  { rotation: 0, delay: 0.5 },
  { rotation: -5, delay: 0.6 },
  { rotation: -10, delay: 0.7 },
  { rotation: -15, delay: 0.8 },
];

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 20,
    x: 100,
  },
  visible: (custom) => ({
    opacity: 1,
    y: 0,
    x: 0,
    transition: {
      delay: custom.delay,
      duration: 0.8,
      ease: "easeOut",
    },
  }),
  float: (custom) => ({
    y: [0, -10, 0],
    rotate: custom.rotation,
    transition: {
      y: {
        repeat: Infinity,
        duration: 3,
        ease: "easeInOut",
        delay: custom.delay,
      },
    },
  }),
};

const mobileCardVariants = {
  hidden: {
    opacity: 0,
    x: 100,
  },
  visible: (custom) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: custom.delay,
      duration: 0.5,
      ease: "easeOut",
    },
  }),
  float: (custom) => ({
    x: [-5, 5, -5],
    y: [-2, 2, -2],
    transition: {
      x: {
        repeat: Infinity,
        duration: 4,
        ease: "easeInOut",
        delay: custom.delay,
      },
      y: {
        repeat: Infinity,
        duration: 3,
        ease: "easeInOut",
        delay: custom.delay + 0.5,
      },
    },
  }),
};

const DocumentCard = ({ custom, index, isMobile = false }) => (
  <motion.div
    custom={custom}
    variants={isMobile ? mobileCardVariants : cardVariants}
    initial="hidden"
    animate={["visible", "float"]}
    className={`rounded-lg bg-white p-6 shadow-lg ${
      isMobile ? "mx-2 h-28 w-64 flex-shrink-0" : "absolute h-32 w-72"
    }`}
    style={
      !isMobile
        ? {
            right: `${index * 20}px`,
            top: `${index * 60}px`,
            zIndex: documents.length - index,
          }
        : undefined
    }
  >
    <div className="space-y-3">
      <div className="h-2 w-4/5 rounded bg-gray-200"></div>
      <div className="h-2 w-3/5 rounded bg-gray-200"></div>
      {!isMobile && <div className="h-2 w-2/3 rounded bg-gray-200"></div>}
    </div>
    <div className="absolute right-3 top-3">
      <svg
        className="h-4 w-4 text-gray-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
    </div>
  </motion.div>
);

// ===== MAIN COMPONENT =====
const Index = () => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Animated Background Bubbles */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {bubbles.map((bubble, index) => (
          <motion.div
            key={index}
            custom={bubble}
            variants={bubbleVariants}
            animate="animate"
            className="absolute rounded-full opacity-20"
            style={{
              width: bubble.size,
              height: bubble.size,
              background:
                "linear-gradient(90deg, #501E9C 0%, #8169F1 40%, #A44CEE 75%, #FF847F 100%)",
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
          <div className="flex flex-col items-center justify-between gap-12 lg:flex-row lg:gap-16">
            {/* Left Section */}
            <div className="w-full space-y-8 lg:w-1/2">
              {/* Logo Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="flex items-center space-x-4"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 shadow-lg">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-7 w-7 text-white"
                  >
                    <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
                    <path d="M14 2v4a2 2 0 0 0 2 2h4" />
                  </svg>
                </div>
                <span className="text-transparent bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-3xl font-bold">
                  NotesDaddy
                </span>
              </motion.div>

              {/* Hero Content */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="space-y-6"
              >
                <h1 className="text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
                  Your{" "}
                  <span
                    style={{
                      background:
                        "linear-gradient(90deg, #501E9C 0%, #8169F1 40%, #A44CEE 75%, #FF847F 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    Ultimate
                  </span>
                  <span className="mt-2 block">Study Companion</span>
                  <span className="relative">
                    <motion.span
                      className="absolute bottom-0 left-0 h-3 w-full bg-purple-200 opacity-50"
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ delay: 1, duration: 0.8 }}
                    />
                  </span>
                </h1>

                <p className="max-w-xl text-xl text-gray-600">
                  Boost your learning journey with our suite of powerful tools
                  designed for ultimate productivity and seamless organization.
                </p>

                <motion.button
                  onClick={() =>
                    (window.location.href =
                      "http://13.51.106.41:3001/auth/sign-in")
                  }
                  className="text-black relative z-0 flex items-center space-x-2 rounded-xl px-20 py-3"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    position: "relative",
                  }}
                >
                  {/* Glow effect container */}
                  <div
                    className="absolute inset-0 -z-10 rounded-xl opacity-100"
                    style={{
                      background:
                        "linear-gradient(50deg, #4285F4, #34A853, #FBBC05, #EA4335, #4285F4)",
                      backgroundSize: "200%",
                      filter: "blur(6px)",
                      animation: "glowing 20s linear infinite",
                      top: "4px",
                      left: "12px",
                      width: "calc(95% + 0px)",
                      height: "calc(95% + 0px)",
                      border: "20px",
                    }}
                  />

                  {/* Button background */}
                  <div className="absolute inset-0 -z-10 rounded-xl bg-white" />

                  {/* Button content */}
                  <svg className="h-6 w-6" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  <span className="text-lg font-medium">
                    Sign in with Google
                  </span>

                  <style jsx global>{`
                    @keyframes glowing {
                      0% {
                        background-position: 0 0;
                      }
                      50% {
                        background-position: 400% 0;
                      }
                      100% {
                        background-position: 0 0;
                      }
                    }
                  `}</style>
                </motion.button>
              </motion.div>
            </div>

            {/* Right Section - Animated Documents (replaces the image) */}
            <div className="mt-1 w-full lg:w-1/2">
              {/* Desktop Documents */}
              <div className="relative hidden h-[600px] w-full md:block">
                {documents.map((doc, index) => (
                  <DocumentCard key={index} custom={doc} index={index} />
                ))}
              </div>

              {/* Mobile Documents */}
              <div className="w-full overflow-hidden md:hidden " >
               
                {/* <motion.div className="flex space-x-4 overflow-x-auto px-4 pb-6">
                  {documents.map((doc, index) => (
                    <DocumentCard
                      key={index}
                      custom={doc}
                      index={index}
                      isMobile={true}
                    />
                  ))}
                </motion.div> */}
              </div>
            </div>
          </div>

          {/* Features Section */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-10 sm:mt-32"
          >
            <div className="mb-16 text-center">
              <h2 className="text-transparent mb-4 bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-3xl font-bold sm:text-4xl">
                Everything You Need
              </h2>
              <p className="text-xl text-gray-600">
                Powerful features to supercharge your study routine
              </p>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {features.map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  className="group relative"
                >
                  <div className="absolute inset-0 transform rounded-2xl bg-gradient-to-r from-purple-50 to-indigo-50 transition-transform duration-300 group-hover:scale-105" />
                  <div className="relative rounded-2xl border border-purple-100/50 bg-white/80 p-8 shadow-lg backdrop-blur-sm transition-shadow duration-300 hover:shadow-xl">
                    <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600/10 to-indigo-600/10">
                      <div className="text-purple-600">{feature.icon}</div>
                    </div>
                    <h3 className="mb-3 text-xl font-semibold text-gray-800">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-24 bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {/* Company Info */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10">
                  <svg
                    className="h-6 w-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                </div>
                <span className="text-xl font-bold">NotesDaddy</span>
              </div>
              <p className="text-white/80">
                Making study organization effortless and efficient for students
                worldwide.
              </p>
            </div>
          </div>

          {/* Bottom Footer */}
          <div className="mt-12 border-t border-white/20 pt-8">
            <div className="flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
              <p className="text-white/80">
                © 2024 NotesDaddy. All rights reserved. Contact -{" "}
                <span className="inline-block">
                  For technical help or inquiries,{" "}
                  <a
                    href="mailto:info@notesdaddy.com"
                    className="underline hover:text-white"
                  >
                    contact us
                  </a>
                  .
                </span>
              </p>
              <div className="flex space-x-6">
                <a
                  href="#"
                  className="text-white/80 transition hover:text-white"
                >
                  <span className="sr-only">Twitter</span>
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 4.557a9.83 9.83 0 01-2.828.775 4.94 4.94 0 002.164-2.723 9.772 9.772 0 01-3.127 1.196 4.92 4.92 0 00-8.389 4.482A13.978 13.978 0 011.671 3.149 4.917 4.917 0 003.195 9.72a4.893 4.893 0 01-2.229-.616v.06a4.924 4.924 0 003.946 4.827 4.902 4.902 0 01-2.224.084 4.927 4.927 0 004.6 3.417A9.868 9.868 0 010 19.54 13.945 13.945 0 007.548 22c9.057 0 14.01-7.514 14.01-14.02 0-.213-.005-.426-.014-.637A9.936 9.936 0 0024 4.557z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-white/80 transition hover:text-white"
                >
                  <span className="sr-only">GitHub</span>
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-white/80 transition hover:text-white"
                >
                  <span className="sr-only">LinkedIn</span>
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
