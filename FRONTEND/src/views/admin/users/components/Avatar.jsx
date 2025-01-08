import React, { useState } from "react";

// Utility to generate Google-like colors
const generateGoogleColor = () => {
  const googleColors = [
    "bg-red-500",
    "bg-blue-500",
    "bg-yellow-500",
    "bg-green-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-orange-500",
    "bg-teal-500",
  ];
  return googleColors[Math.floor(Math.random() * googleColors.length)];
};

const Avatar = ({ name, email, picture }) => {
  const [imageFailed, setImageFailed] = useState(false); // Track image load status
  const firstLetter = email ? email[0].toUpperCase() : "?";
  const colorClass = React.useMemo(() => generateGoogleColor(), []);

  return (
    <div className="relative h-16 w-16">
      {/* Fallback content */}
      <div
        className={`absolute inset-0 flex items-center justify-center rounded-full font-bold text-white ${colorClass} ${
          imageFailed ? "block" : "hidden"
        }`}
      >
        <span className="text-3xl">{firstLetter}</span> {/* Larger letter */}
      </div>

      {/* Profile Image */}
      <img
        src={picture}
        alt={name}
        className={`h-16 w-16 rounded-full border-2 border-white shadow-lg ${
          imageFailed ? "hidden" : "block"
        }`}
        onError={() => setImageFailed(true)} // Trigger fallback
        onLoad={() => setImageFailed(false)} // Ensure image is displayed when loaded
      />
    </div>
  );
};

export default Avatar;
