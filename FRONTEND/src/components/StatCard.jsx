import React from 'react';

const StatCard = ({ icon: Icon, title, value }) => (
  <div className="bg-white rounded-xl shadow-md p-4 flex items-center space-x-4">
    <div className="bg-[rgba(67,24,255,0.1)] p-3 rounded-lg">
      <Icon className="w-6 h-6 text-[rgba(67,24,255,0.85)]" />
    </div>
    <div>
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-xl font-semibold text-gray-800">{value}</p>
    </div>
  </div>
);

export default StatCard;