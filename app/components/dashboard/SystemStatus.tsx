import React from 'react';

const SystemStatus: React.FC = () => {
  return (
    <div className="bg-gsDark bg-opacity-50 backdrop-blur-xs border border-gsBlue/20 p-4 rounded-lg">
      <h3 className="text-lg font-display text-gsNeon">System Status</h3>
      <p className="text-2xl font-body text-green-500">All Systems Operational</p>
    </div>
  );
};

export default SystemStatus;
