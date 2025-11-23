import MetricsCard from '../components/dashboard/MetricsCard';
import ActivityFeed from '../components/dashboard/ActivityFeed';
import SystemStatus from '../components/dashboard/SystemStatus';
import AlpacaAccountStatus from '../components/dashboard/AlpacaAccountStatus';

export default function Home() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      <div className="md:col-span-2 lg:col-span-4">
        <h1 className="text-3xl font-display text-gsNeon">Dashboard Overview</h1>
      </div>
      <MetricsCard title="Active Trades" value="12" />
      <MetricsCard title="P&L" value="$1,250.00" />
      <SystemStatus />
      <AlpacaAccountStatus />
      <div className="md:col-span-2 lg:col-span-4">
        <ActivityFeed />
      </div>
    </div>
  );
}
