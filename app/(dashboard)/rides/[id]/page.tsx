'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { ArrowLeft, AlertTriangle, Navigation, MapPin } from 'lucide-react';

interface LocationInfo {
  lat: number;
  lng: number;
  address: string;
}

interface Ping {
  lat: number;
  lng: number;
  time: string;
}

interface HistoryItem {
  status: string;
  changed_by: string;
  reason: string;
  created_at: string;
}

interface RideDetails {
  id: string;
  rider_name: string;
  rider_phone: string;
  captain_name: string;
  captain_phone: string;
  vehicle_type: string;
  status: string;
  estimated_fare: number;
  final_fare: number | null;
  payment_mode: string;
  payment_status: string;
  created_at: string;
  flagged: boolean;
  pickup: LocationInfo;
  drop: LocationInfo;
  pings: Ping[];
  history: HistoryItem[];
}

export default function RideDetailsPage({ params }: { params: { id: string } }) {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery<{ success: boolean; data: RideDetails }>({
    queryKey: ['rideDetails', params.id],
    queryFn: async () => {
      const res = await fetch(`/api/admin/rides/${params.id}`);
      if (!res.ok) throw new Error('Ride not found');
      return res.json();
    },
  });

  const flagMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/admin/rides/${params.id}`, {
        method: 'POST',
      });
      if (!res.ok) throw new Error('Failed to flag ride');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminRides'] });
      queryClient.invalidateQueries({ queryKey: ['rideDetails', params.id] });
    },
  });

  if (isLoading) {
    return <div className="p-12 font-mono text-center animate-pulse">Loading ride dispatcher telemetry...</div>;
  }

  if (error || !data?.success) {
    return (
      <div className="bg-roadCoral/10 border-1 border-roadCoral text-roadCoral p-6 font-mono">
        Error loading ride tracking data.
      </div>
    );
  }

  const ride = data.data;

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <div className="flex justify-between items-center">
        <Link
          href="/rides"
          className="inline-flex items-center gap-2 border-1 border-asphalt px-3 py-2 bg-surface hover:bg-chalk transition-all text-xs font-mono uppercase font-bold"
        >
          <ArrowLeft size={14} /> Back to Monitor
        </Link>

        {!ride.flagged && (
          <button
            onClick={() => flagMutation.mutate()}
            disabled={flagMutation.isPending}
            className="inline-flex items-center gap-2 border-1 border-asphalt px-3 py-2 bg-roadCoral text-white hover:translate-y-[-1px] transition-all text-xs font-mono uppercase font-bold"
          >
            <AlertTriangle size={14} /> Flag for Investigation
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Route Replay Map Simulation */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-surface border-1 border-asphalt p-6 shadow-brutalist flex flex-col">
            <h2 className="font-display text-xl font-extrabold uppercase text-asphalt mb-4 flex items-center gap-2">
              <Navigation size={18} className="rotate-45" /> Live Route Tracker & Replay
            </h2>
            
            {/* Visual Route Schematic instead of heavy Mapbox API */}
            <div className="h-96 border-1 border-asphalt bg-chalk relative p-8 flex flex-col justify-between overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(#1c1d22_1px,transparent_1px)] [background-size:16px_16px] opacity-10"></div>
              
              {/* Pickup representation */}
              <div className="flex items-start gap-4 z-10">
                <div className="w-8 h-8 bg-asphalt text-white flex items-center justify-center font-bold font-mono border-1 border-asphalt shadow-[2px_2px_0px_0px_rgba(243,197,17,1)]">
                  P
                </div>
                <div className="leading-tight">
                  <h4 className="font-mono text-xs text-gray-500 uppercase">Pickup Location</h4>
                  <p className="font-mono font-bold text-asphalt">{ride.pickup.address}</p>
                  <p className="text-[10px] text-gray-400 font-mono">Lat: {ride.pickup.lat}, Lng: {ride.pickup.lng}</p>
                </div>
              </div>

              {/* Connecting Path Representation */}
              <div className="flex-1 flex items-center justify-center relative py-6">
                <div className="w-0.5 h-full border-l-2 border-dashed border-asphalt absolute left-4"></div>
                {/* Moving Bike Icon Overlay representing live trace */}
                <div className="absolute left-[3px] top-1/2 w-3 h-3 bg-signal border-1 border-asphalt rounded-full animate-bounce"></div>
              </div>

              {/* Drop representation */}
              <div className="flex items-start gap-4 z-10">
                <div className="w-8 h-8 bg-signal text-asphalt flex items-center justify-center font-bold font-mono border-1 border-asphalt">
                  D
                </div>
                <div className="leading-tight">
                  <h4 className="font-mono text-xs text-gray-500 uppercase">Destination Drop</h4>
                  <p className="font-mono font-bold text-asphalt">{ride.drop.address}</p>
                  <p className="text-[10px] text-gray-400 font-mono">Lat: {ride.drop.lat}, Lng: {ride.drop.lng}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Ride History Logs */}
          <div className="bg-surface border-1 border-asphalt p-6 shadow-brutalist">
            <h3 className="font-display text-xl font-extrabold uppercase text-asphalt mb-4">
              Ride Status Timeline History
            </h3>
            <div className="space-y-4 font-mono">
              {ride.history.map((log, index) => (
                <div key={index} className="flex gap-4 items-start border-l-1 border-asphalt pl-4 pb-2 relative">
                  <div className="absolute w-2 h-2 bg-asphalt left-[-4.5px] top-1.5" />
                  <div className="text-xs text-gray-400 min-w-[70px]">
                    {new Date(log.created_at).toLocaleTimeString()}
                  </div>
                  <div>
                    <span className="font-bold text-xs uppercase px-1.5 py-0.5 border-1 border-asphalt bg-chalk mr-2">
                      {log.status}
                    </span>
                    <span className="text-sm text-asphalt">{log.reason}</span>
                    <span className="text-[10px] text-gray-400 block mt-0.5 uppercase">Triggered by: {log.changed_by}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Telemetry info cards */}
        <div className="space-y-6">
          {/* Main Info */}
          <div className="bg-surface border-1 border-asphalt p-6 shadow-brutalist font-mono text-sm space-y-4">
            <div className="border-b-1 border-asphalt pb-3">
              <h3 className="font-display text-lg font-extrabold uppercase text-asphalt">Ride Info Card</h3>
              <p className="text-[10px] text-gray-400 uppercase">System Telemetry Log: {ride.id}</p>
            </div>
            
            <div>
              <span className="text-xs text-gray-400 block uppercase">Rider Account</span>
              <span className="font-bold text-asphalt">{ride.rider_name}</span>
              <span className="text-xs text-gray-500 block">{ride.rider_phone}</span>
            </div>

            <div>
              <span className="text-xs text-gray-400 block uppercase">Assigned Captain</span>
              <span className="font-bold text-asphalt">{ride.captain_name || 'N/A'}</span>
              <span className="text-xs text-gray-500 block">{ride.captain_phone || 'Searching...'}</span>
            </div>

            <div>
              <span className="text-xs text-gray-400 block uppercase">Estimated Fare breakdown</span>
              <span className="font-bold text-asphalt">INR {ride.estimated_fare.toFixed(2)}</span>
            </div>

            <div>
              <span className="text-xs text-gray-400 block uppercase">Transaction Method</span>
              <span className="font-bold text-asphalt uppercase">{ride.payment_mode}</span>
            </div>

            <div>
              <span className="text-xs text-gray-400 block uppercase">Invoice Settlement</span>
              <span className={`text-xs font-bold uppercase px-2 py-0.5 border-1 ${
                ride.payment_status === 'captured' 
                  ? 'bg-meterGreen/10 text-meterGreen border-meterGreen' 
                  : 'bg-signal/20 text-asphalt border-asphalt'
              }`}>
                {ride.payment_status}
              </span>
            </div>
          </div>

          {/* Flagged Status alert */}
          {ride.flagged && (
            <div className="bg-roadCoral/10 border-1 border-roadCoral p-6 shadow-brutalist font-mono">
              <h4 className="text-sm font-bold text-roadCoral uppercase flex items-center gap-1.5 mb-2">
                <AlertTriangle size={16} /> Disputed Status
              </h4>
              <p className="text-xs text-roadCoral/80">
                This transaction has been flagged for ops inspection due to potential route deviation or rating dispute.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
