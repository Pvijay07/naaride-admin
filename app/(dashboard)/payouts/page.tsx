'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Wallet, CheckSquare, Square, CheckCircle } from 'lucide-react';

interface PayoutRequest {
  id: string;
  captain_name: string;
  phone: string;
  amount: number;
  request_date: string;
  status: 'pending' | 'processed';
}

export default function PayoutsPage() {
  const queryClient = useQueryClient();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const { data, isLoading, error } = useQuery<{ success: boolean; data: PayoutRequest[] }>({
    queryKey: ['payoutsQueue'],
    queryFn: async () => {
      const res = await fetch('/api/admin/payouts');
      if (!res.ok) throw new Error('Failed to load payouts queue');
      return res.json();
    },
  });

  const approveMutation = useMutation({
    mutationFn: async (ids: string[]) => {
      const res = await fetch('/api/admin/payouts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids }),
      });
      if (!res.ok) throw new Error('Failed to approve payouts');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payoutsQueue'] });
      setSelectedIds([]);
    },
  });

  const payouts = data?.data || [];
  const pendingPayouts = payouts.filter((p) => p.status === 'pending');

  function toggleSelect(id: string) {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  }

  function toggleSelectAll() {
    if (selectedIds.length === pendingPayouts.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(pendingPayouts.map((p) => p.id));
    }
  }

  function handleBatchApprove() {
    if (selectedIds.length === 0) return;
    approveMutation.mutate(selectedIds);
  }

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-surface border-1 border-asphalt p-6 shadow-brutalist">
        <div>
          <h1 className="font-display text-3xl font-extrabold uppercase text-asphalt flex items-center gap-2">
            <Wallet /> Payouts Settlement Queue
          </h1>
          <p className="font-mono text-sm text-gray-500 mt-1 uppercase">Approve and settle captain wallet withdrawals</p>
        </div>

        {selectedIds.length > 0 && (
          <button
            onClick={handleBatchApprove}
            disabled={approveMutation.isPending}
            className="inline-flex items-center gap-1.5 btn-brutalist-primary py-2 text-sm bg-meterGreen text-white border-asphalt"
          >
            <CheckCircle size={16} /> Approve Selected ({selectedIds.length})
          </button>
        )}
      </div>

      {/* Payouts Table */}
      <div className="bg-surface border-1 border-asphalt shadow-brutalist overflow-x-auto">
        {isLoading ? (
          <div className="p-8 text-center animate-pulse">Loading payout requests...</div>
        ) : error || !data?.success ? (
          <div className="p-8 text-center font-mono text-roadCoral">Error loading payouts database.</div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-1 border-asphalt bg-chalk/50 font-mono text-xs uppercase text-gray-600">
                <th className="p-3 w-10">
                  <button onClick={toggleSelectAll} className="focus:outline-none">
                    {selectedIds.length === pendingPayouts.length && pendingPayouts.length > 0 ? (
                      <CheckSquare size={16} />
                    ) : (
                      <Square size={16} />
                    )}
                  </button>
                </th>
                <th className="p-3">Captain</th>
                <th className="p-3">Phone</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Request Date</th>
                <th className="p-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y-1 divide-asphalt/10 font-mono text-sm">
              {payouts.map((pay) => {
                const isPending = pay.status === 'pending';
                const isSelected = selectedIds.includes(pay.id);
                return (
                  <tr key={pay.id} className={`hover:bg-chalk/10 ${isSelected ? 'bg-signal/5' : ''}`}>
                    <td className="p-3">
                      {isPending ? (
                        <button onClick={() => toggleSelect(pay.id)} className="focus:outline-none">
                          {isSelected ? <CheckSquare size={16} /> : <Square size={16} />}
                        </button>
                      ) : (
                        <div className="w-4 h-4" />
                      )}
                    </td>
                    <td className="p-3 font-bold text-asphalt">{pay.captain_name}</td>
                    <td className="p-3 text-gray-600">{pay.phone}</td>
                    <td className="p-3 font-bold text-asphalt">₹{pay.amount.toFixed(2)}</td>
                    <td className="p-3 text-xs text-gray-500">{pay.request_date}</td>
                    <td className="p-3 text-right">
                      <span className={`text-xs uppercase px-2 py-0.5 border-1 font-bold ${
                        pay.status === 'processed' 
                          ? 'bg-meterGreen/10 text-meterGreen border-meterGreen' 
                          : 'bg-signal/20 text-asphalt border-asphalt'
                      }`}>
                        {pay.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
              {payouts.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-gray-500 font-mono">
                    No payout settlement requests in queue.
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
