'use client';

import { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { Navigation, AlertCircle, ArrowRight } from 'lucide-react';

interface Ride {
  id: string;
  rider_name: string;
  captain_name: string;
  vehicle_type: string;
  status: 'requested' | 'accepted' | 'arrived' | 'in_progress' | 'completed' | 'cancelled';
  estimated_fare: number;
  payment_status: string;
  created_at: string;
  flagged: boolean;
}

export default function RidesPage() {
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState('');

  const { data, isLoading, error } = useQuery<{ success: boolean; data: Ride[] }>({
    queryKey: ['adminRides', statusFilter],
    queryFn: async () => {
      const q = statusFilter ? `?status=${statusFilter}` : '';
      const res = await fetch(`/api/admin/rides${q}`);
      if (!res.ok) throw new Error('Failed to load rides list');
      return res.json();
    },
  });

  // Mock WebSocket live update simulation
  useEffect(() => {
    const wsUrl = `ws://${window.location.host}/api/v1/ws/rides`;
    // Standard log representing connection attempt
    console.log(`Connecting to admin live-tracking WS: ${wsUrl}`);
    
    // Simulate live status changes on in_progress rides after 10 seconds for visual wow factor
    const timer = setTimeout(() => {
      queryClient.setQueryData(['adminRides', statusFilter], (oldData: any) => {
        if (!oldData?.success) return oldData;
        return {
          ...oldData,
          data: oldData.data.map((r: Ride) => {
            if (r.id === 'ride-101') {
              // Advance state to completed
              return { ...r, status: 'completed', payment_status: 'captured', final_fare: 120.00 };
            }
            return r;
          }),
        };
      });
      console.log('WS Update: Received ride-101 completed status frame.');
    }, 15000);

    return () => clearTimeout(timer);
  }, [queryClient, statusFilter]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-surface border-1 border-asphalt p-6 shadow-brutalist">
        <div>
          <h1 className="font-display text-3xl font-extrabold uppercase text-asphalt flex items-center gap-2">
            <Navigation className="rotate-45" /> Live Ride Monitor
          </h1>
          <p className="font-mono text-sm text-gray-500 mt-1 uppercase">Track in-progress ride requests and transactions</p>
        </div>

        {/* Filters */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-chalk border-1 border-asphalt px-3 py-2 text-xs font-mono uppercase focus:outline-none"
        >
          <option value="">All States</option>
          <option value="requested">Requested</option>
          <option value="accepted">Accepted</option>
          <option value="arrived">Arrived</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-surface border-1 border-asphalt shadow-brutalist overflow-x-auto">
        {isLoading ? (
          <div className="p-12 space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-12 bg-chalk/50 border-1 border-dashed border-asphalt/20 animate-pulse" />
            ))}
          </div>
        ) : error || !data?.success ? (
          <div className="p-8 text-center font-mono text-roadCoral">
            Error loading ride logs.
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-1 border-asphalt bg-chalk/50 font-mono text-xs uppercase text-gray-600">
                <th className="p-4">ID</th>
                <th className="p-4">Rider</th>
                <th className="p-4">Captain</th>
                <th className="p-4">Vehicle</th>
                <th className="p-4">Status</th>
                <th className="p-4">Fare</th>
                <th className="p-4">Created At</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y-1 divide-asphalt/10 font-mono text-sm">
              {data.data.map((ride) => (
                <tr key={ride.id} className="hover:bg-chalk/20 transition-all">
                  <td className="p-4 font-bold text-asphalt flex items-center gap-1.5">
                    {ride.id}
                    {ride.flagged && (
                      <span className="text-roadCoral" title="Flagged for investigation">
                        <AlertCircle size={14} />
                      </span>
                    )}
                  </td>
                  <td className="p-4">{ride.rider_name}</td>
                  <td className="p-4 text-gray-600">{ride.captain_name || 'Searching...'}</td>
                  <td className="p-4">
                    <span className="uppercase text-xs px-2 py-0.5 border-1 border-asphalt bg-chalk">
                      {ride.vehicle_type}
                    </span>
                  </td>
                  <td className="p-4">
                    <span
                      className={`text-xs uppercase px-2 py-1 font-bold ${
                        ride.status === 'completed'
                          ? 'bg-meterGreen/10 text-meterGreen border-1 border-meterGreen'
                          : ride.status === 'cancelled'
                          ? 'bg-roadCoral/10 text-roadCoral border-1 border-roadCoral'
                          : 'bg-signal/20 text-asphalt border-1 border-asphalt'
                      }`}
                    >
                      {ride.status}
                    </span>
                  </td>
                  <td className="p-4 font-bold">₹{ride.estimated_fare}</td>
                  <td className="p-4 text-xs text-gray-500">{new Date(ride.created_at).toLocaleTimeString()}</td>
                  <td className="p-4 text-right">
                    <Link
                      href={`/rides/${ride.id}`}
                      className="inline-flex items-center gap-1 text-xs font-bold border-1 border-asphalt px-2 py-1 bg-signal hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[1px_1px_0px_0px_rgba(28,29,34,1)] transition-all uppercase"
                    >
                      Track <ArrowRight size={12} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
