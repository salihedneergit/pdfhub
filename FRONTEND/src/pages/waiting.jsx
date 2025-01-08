import React from 'react';
import { Lock, MessageCircle, PhoneCall, Mail } from 'lucide-react';

function Waiting() {
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-white overflow-hidden">
      {/* Background accent bubbles (top-left / bottom-right) */}
      <div className="absolute w-72 h-72 bg-gradient-to-br from-[#4318FF] to-[#9f87ff] rounded-full blur-3xl opacity-20 -top-16 -left-16 animate-pulse"></div>
      <div className="absolute w-72 h-72 bg-gradient-to-br from-[#4318FF] to-[#9f87ff] rounded-full blur-3xl opacity-20 -bottom-16 -right-16 animate-pulse"></div>

      {/* Main Card */}
      <div className="relative z-10 bg-white shadow-xl rounded-xl max-w-lg w-full p-6 sm:p-8 md:p-10 flex flex-col items-center space-y-6 transform transition-all duration-700 ease-out">
        {/* Animated icon */}
        <div className="bg-gradient-to-br from-[#4318FF] to-[#9f87ff] p-5 rounded-full shadow-md ">
          <Lock className="w-8 h-8 text-white" />
        </div>

        {/* Title */}
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 text-center">
          Your Account is Pending
        </h1>

        {/* Subtitle / Info */}
        <p className="text-center text-gray-600 leading-relaxed max-w-md">
          We’re currently reviewing your registration. Once approved, you’ll have full access to all features.
          If you need immediate assistance or want to speed up the process, feel free to reach out to us.
        </p>

        {/* Contact Options */}
        <div className="flex flex-col md:flex-row gap-4 w-full justify-center">
          {/* Telegram */}
          <a
            href="https://t.me/recallmaster"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-md text-white bg-[#0088cc] hover:bg-[#007bb5] transition-colors duration-300 w-full md:w-auto"
          >
            <MessageCircle className="w-5 h-5" />
            <span className="font-medium">Telegram</span>
          </a>

          {/* WhatsApp */}
          <a
            href="https://wa.me/16693223444"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-md text-white bg-[#25D366] hover:bg-[#20b958] transition-colors duration-300 w-full md:w-auto"
          >
            <PhoneCall className="w-5 h-5" />
            <span className="font-medium">WhatsApp</span>
          </a>

          {/* Gmail */}
          <a
            href="mailto:usmleshops@gmail.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-md text-white bg-[#EA4335] hover:bg-[#d9362a] transition-colors duration-300 w-full md:w-auto"
          >
            <Mail className="w-5 h-5" />
            <span className="font-medium">Email</span>
          </a>
        </div>

        {/* Extra Note */}
        <p className="text-sm text-gray-500 text-center pt-4">
          Thank you for your patience! Our team typically responds within a few hours.
        </p>
      </div>
    </div>
  );
}

export default Waiting;
