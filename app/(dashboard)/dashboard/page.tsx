'use client';

import { useQuery } from '@tanstack/react-query';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  Navigation,
  IndianRupee,
  ShieldCheck,
  TrendingUp,
  XCircle,
} from 'lucide-react';

interface MetricsData {
  ridesToday: number;
  gmv: number;
  activeCaptains: number;
  completionRate: number;
  cancellationRate: number;
  chartData: Array<{ date: string; rides: number }>;
}

export default function DashboardPage() {
  const { data, isLoading, error } = useQuery<{ success: boolean; data: MetricsData }>({
    queryKey: ['adminMetrics'],
    queryFn: async () => {
      const res = await fetch('/api/admin/metrics');
      if (!res.ok) throw new Error('Network error');
      return res.json();
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Loading Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-surface border-1 border-asphalt p-6 h-28 animate-pulse" />
          ))}
        </div>
        <div className="bg-surface border-1 border-asphalt p-6 h-96 animate-pulse" />
      </div>
    );
  }

  if (error || !data?.success) {
    return (
      <div className="bg-roadCoral/10 border-1 border-roadCoral text-roadCoral p-6 font-mono">
        Error loading dashboard operations telemetry.
      </div>
    );
  }

  const metrics = data.data;

  return (
    <div className="space-y-8">
      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        {/* Card 1: Rides Today */}
        <div className="bg-surface border-1 border-asphalt p-6 shadow-brutalist flex flex-col justify-between">
          <div>
            <span className="text-xs font-mono uppercase text-gray-500 flex items-center gap-1.5">
              <Navigation size={12} className="rotate-45" /> Rides Today
            </span>
            <p className="font-display text-4xl font-extrabold text-asphalt uppercase mt-2">
              {metrics.ridesToday.toLocaleString('en-IN')}
            </p>
          </div>
        </div>

        {/* Card 2: GMV */}
        <div className="bg-surface border-1 border-asphalt p-6 shadow-brutalist flex flex-col justify-between">
          <div>
            <span className="text-xs font-mono uppercase text-gray-500 flex items-center gap-1.5">
              <IndianRupee size={12} /> Today's GMV
            </span>
            <p className="font-display text-4xl font-extrabold text-asphalt uppercase mt-2">
              ₹{metrics.gmv.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>

        {/* Card 3: Active Captains */}
        <div className="bg-surface border-1 border-asphalt p-6 shadow-brutalist flex flex-col justify-between">
          <div>
            <span className="text-xs font-mono uppercase text-gray-500 flex items-center gap-1.5">
              <ShieldCheck size={12} /> Active Captains
            </span>
            <p className="font-display text-4xl font-extrabold text-asphalt uppercase mt-2">
              {metrics.activeCaptains.toLocaleString('en-IN')}
            </p>
          </div>
        </div>

        {/* Card 4: Completion Rate */}
        <div className="bg-surface border-1 border-asphalt p-6 shadow-brutalist flex flex-col justify-between">
          <div>
            <span className="text-xs font-mono uppercase text-gray-500 flex items-center gap-1.5">
              <TrendingUp size={12} /> Completion Rate
            </span>
            <p className="font-display text-4xl font-extrabold text-meterGreen uppercase mt-2">
              {metrics.completionRate}%
            </p>
          </div>
        </div>

        {/* Card 5: Cancellation Rate */}
        <div className="bg-surface border-1 border-asphalt p-6 shadow-brutalist flex flex-col justify-between">
          <div>
            <span className="text-xs font-mono uppercase text-gray-500 flex items-center gap-1.5">
              <XCircle size={12} /> Cancellation Rate
            </span>
            <p className="font-display text-4xl font-extrabold text-roadCoral uppercase mt-2">
              {metrics.cancellationRate}%
            </p>
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="bg-surface border-1 border-asphalt p-6 shadow-brutalist">
        <div className="mb-6">
          <h2 className="font-display text-2xl font-extrabold uppercase text-asphalt">
            Ride volume telemetry (last 14 days)
          </h2>
          <p className="text-xs font-mono text-gray-500 uppercase">Daily system-wide demand logs</p>
        </div>
        
        <div className="h-96 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={metrics.chartData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis 
                dataKey="date" 
                stroke="#1C1D22" 
                tick={{ fontSize: 11, fontFamily: 'monospace' }}
              />
              <YAxis 
                stroke="#1C1D22" 
                tick={{ fontSize: 11, fontFamily: 'monospace' }}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#FAF9F9',
                  border: '1px solid #1C1D22',
                  fontFamily: 'monospace',
                  fontSize: '12px',
                }}
              />
              <Line
                type="monotone"
                dataKey="rides"
                stroke="#F3C511"
                strokeWidth={3}
                activeDot={{ r: 8, stroke: '#1C1D22', strokeWidth: 1 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
