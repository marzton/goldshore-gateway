import React from 'react';

const MetricsCard: React.FC<{ title: string; value: string }> = ({ title, value }) => {
  return (
    <div className="bg-gsDark bg-opacity-50 backdrop-blur-xs border border-gsBlue/20 p-4 rounded-lg">
      <h3 className="text-lg font-display text-gsNeon">{title}</h3>
      <p className="text-2xl font-body text-white">{value}</p>
    </div>
  );
};

export default MetricsCard;
