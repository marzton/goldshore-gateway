import React from 'react';

const ActivityFeed: React.FC = () => {
  return (
    <div className="bg-gsDark bg-opacity-50 backdrop-blur-xs border border-gsBlue/20 p-4 rounded-lg">
      <h3 className="text-lg font-display text-gsNeon">Activity Feed</h3>
      <ul>
        <li className="border-b border-gsBlue/20 py-2">Trade Executed: BUY 100 AAPL @ $150.00</li>
        <li className="border-b border-gsBlue/20 py-2">API Key Generated</li>
        <li className="py-2">User Login: john.doe@goldshore.org</li>
      </ul>
    </div>
  );
};

export default ActivityFeed;
