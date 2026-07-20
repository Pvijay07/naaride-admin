'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { ShieldCheck, Filter, ArrowRight } from 'lucide-react';

interface Captain {
  id: string;
  name: string;
  phone: string;
  vehicle_type: string;
  kyc_status: 'pending' | 'approved' | 'rejected';
  rating: number;
  joined_date: string;
}

export default function CaptainsPage() {
  const [statusFilter, setStatusFilter] = useState<string>('');

  const { data, isLoading, error } = useQuery<{ success: boolean; data: Captain[] }>({
    queryKey: ['captains', statusFilter],
    queryFn: async () => {
      const query = statusFilter ? `?status=${statusFilter}` : '';
      const res = await fetch(`/api/admin/captains${query}`);
      if (!res.ok) throw new Error('Failed to load captains');
      return res.json();
    },
  });

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-surface border-1 border-asphalt p-6 shadow-brutalist">
        <div>
          <h1 className="font-display text-3xl font-extrabold uppercase text-asphalt flex items-center gap-2">
            <ShieldCheck /> Captain KYC Queue
          </h1>
          <p className="font-mono text-sm text-gray-500 mt-1 uppercase">Verify and manage driver onboarding documents</p>
        </div>

        {/* Filter Controls */}
        <div className="flex items-center gap-2">
          <Filter size={16} className="text-gray-500" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-chalk border-1 border-asphalt px-3 py-2 text-xs font-mono uppercase focus:outline-none"
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-surface border-1 border-asphalt shadow-brutalist overflow-x-auto">
        {isLoading ? (
          <div className="p-12 space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-12 bg-chalk/50 border-1 border-dashed border-asphalt/20 animate-pulse" />
            ))}
          </div>
        ) : error || !data?.success ? (
          <div className="p-8 text-center font-mono text-roadCoral">
            Error loading captain records.
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-1 border-asphalt bg-chalk/50 font-mono text-xs uppercase text-gray-600">
                <th className="p-4">Name</th>
                <th className="p-4">Phone</th>
                <th className="p-4">Vehicle</th>
                <th className="p-4">KYC Status</th>
                <th className="p-4">Rating</th>
                <th className="p-4">Joined Date</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y-1 divide-asphalt/10 font-mono text-sm">
              {data.data.map((captain) => (
                <tr key={captain.id} className="hover:bg-chalk/20 transition-all">
                  <td className="p-4 font-bold text-asphalt">{captain.name}</td>
                  <td className="p-4 text-gray-600">{captain.phone}</td>
                  <td className="p-4">
                    <span className="uppercase text-xs px-2 py-0.5 border-1 border-asphalt bg-chalk">
                      {captain.vehicle_type}
                    </span>
                  </td>
                  <td className="p-4">
                    <span
                      className={`text-xs uppercase px-2 py-1 font-bold ${
                        captain.kyc_status === 'approved'
                          ? 'bg-meterGreen/10 text-meterGreen border-1 border-meterGreen'
                          : captain.kyc_status === 'rejected'
                          ? 'bg-roadCoral/10 text-roadCoral border-1 border-roadCoral'
                          : 'bg-signal/15 text-asphalt border-1 border-asphalt bg-signal/20'
                      }`}
                    >
                      {captain.kyc_status}
                    </span>
                  </td>
                  <td className="p-4">⭐ {captain.rating}</td>
                  <td className="p-4 text-xs text-gray-500">{captain.joined_date}</td>
                  <td className="p-4 text-right">
                    <Link
                      href={`/captains/${captain.id}`}
                      className="inline-flex items-center gap-1 text-xs font-bold border-1 border-asphalt px-2 py-1 bg-signal hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[1px_1px_0px_0px_rgba(28,29,34,1)] transition-all uppercase"
                    >
                      Review <ArrowRight size={12} />
                    </Link>
                  </td>
                </tr>
              ))}
              {data.data.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-gray-500 font-mono">
                    No captains found in this queue state.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
