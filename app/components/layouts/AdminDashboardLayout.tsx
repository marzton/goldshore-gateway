import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, BarChart2, Monitor, Radio, Settings, LogOut } from 'lucide-react';

const Sidebar: React.FC = () => (
  <aside className="w-64 bg-gsDark bg-opacity-50 backdrop-blur-xs border-r border-gsBlue/20 flex flex-col justify-between">
    <div>
      <div className="p-4 border-b border-gsBlue/20">
        <h1 className="text-2xl font-display text-gsNeon">Gold Shore</h1>
      </div>
      <nav className="mt-4">
        <ul>
          <li><NavLink to="/" className={({ isActive }) => `flex items-center p-4 text-white hover:bg-gsBlue/20 ${isActive ? 'bg-gsBlue/30' : ''}`}><Home className="mr-2" /> Overview</NavLink></li>
          <li><NavLink to="/trading-analytics" className={({ isActive }) => `flex items-center p-4 text-white hover:bg-gsBlue/20 ${isActive ? 'bg-gsBlue/30' : ''}`}><BarChart2 className="mr-2" /> Trading Analytics</NavLink></li>
          <li><NavLink to="/api-monitor" className={({ isActive }) => `flex items-center p-4 text-white hover:bg-gsBlue/20 ${isActive ? 'bg-gsBlue/30' : ''}`}><Monitor className="mr-2" /> API Monitor</NavLink></li>
          <li><NavLink to="/alpaca-control" className={({ isActive }) => `flex items-center p-4 text-white hover:bg-gsBlue/20 ${isActive ? 'bg-gsBlue/30' : ''}`}><Radio className="mr-2" /> Alpaca Control</NavLink></li>
          <li><NavLink to="/logs" className={({ isActive }) => `flex items-center p-4 text-white hover:bg-gsBlue/20 ${isActive ? 'bg-gsBlue/30' : ''}`}><Settings className="mr-2" /> Logs</NavLink></li>
        </ul>
      </nav>
    </div>
    <div className="p-4 border-t border-gsBlue/20">
        <a href="#" className="flex items-center p-4 text-white hover:bg-gsBlue/20"><LogOut className="mr-2" /> Logout</a>
    </div>
  </aside>
);

const TopNav: React.FC = () => (
  <header className="bg-gsDark bg-opacity-50 backdrop-blur-xs border-b border-gsBlue/20 p-4 flex justify-between items-center">
    <div>
        <h2 className="text-xl font-display text-white">Dashboard</h2>
    </div>
    <div>
      {/* User profile, notifications, etc. */}
    </div>
  </header>
);

const AdminDashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex h-screen bg-gsDark text-white font-body" style={{ background: 'url(/penrose-fractal.svg) no-repeat center center fixed', backgroundSize: 'cover' }}>
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <TopNav />
        <main className="flex-1 p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboardLayout;
