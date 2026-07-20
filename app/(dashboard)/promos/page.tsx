'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { BadgePercent, Plus, Check, X } from 'lucide-react';

interface PromoCode {
  id: string;
  code: string;
  discount_percentage: number;
  max_discount: number;
  active: boolean;
  usage_count: number;
}

export default function PromosPage() {
  const queryClient = useQueryClient();
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCode, setNewCode] = useState('');
  const [newPct, setNewPct] = useState(20);
  const [newMax, setNewMax] = useState(50);

  const { data, isLoading, error } = useQuery<{ success: boolean; data: PromoCode[] }>({
    queryKey: ['promoCodes'],
    queryFn: async () => {
      const res = await fetch('/api/admin/promos');
      if (!res.ok) throw new Error('Failed to load promos');
      return res.json();
    },
  });

  const toggleMutation = useMutation({
    mutationFn: async (promo: Partial<PromoCode>) => {
      const res = await fetch('/api/admin/promos', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(promo),
      });
      if (!res.ok) throw new Error('Failed to update promo');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['promoCodes'] });
    },
  });

  const createMutation = useMutation({
    mutationFn: async (promo: Partial<PromoCode>) => {
      const res = await fetch('/api/admin/promos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(promo),
      });
      if (!res.ok) throw new Error('Failed to create promo');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['promoCodes'] });
      setShowAddForm(false);
      setNewCode('');
    },
  });

  function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    createMutation.mutate({
      code: newCode.toUpperCase(),
      discount_percentage: newPct,
      max_discount: newMax,
    });
  }

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-surface border-1 border-asphalt p-6 shadow-brutalist">
        <div>
          <h1 className="font-display text-3xl font-extrabold uppercase text-asphalt flex items-center gap-2">
            <BadgePercent /> Promo Codes Management
          </h1>
          <p className="font-mono text-sm text-gray-500 mt-1 uppercase">Configure marketing campaigns and customer discount rates</p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="inline-flex items-center gap-1.5 btn-brutalist-primary py-2 text-sm"
        >
          <Plus size={16} /> New Code
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Table List */}
        <div className="lg:col-span-2 bg-surface border-1 border-asphalt shadow-brutalist overflow-x-auto">
          {isLoading ? (
            <div className="p-8 text-center animate-pulse">Loading promos...</div>
          ) : error || !data?.success ? (
            <div className="p-8 text-center font-mono text-roadCoral">Error loading promo codes database.</div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-1 border-asphalt bg-chalk/50 font-mono text-xs uppercase text-gray-600">
                  <th className="p-3">Code</th>
                  <th className="p-3">Discount %</th>
                  <th className="p-3">Max Cap</th>
                  <th className="p-3">Usage Count</th>
                  <th className="p-3">Active Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y-1 divide-asphalt/10 font-mono text-sm">
                {data.data.map((promo) => (
                  <tr key={promo.id} className="hover:bg-chalk/15">
                    <td className="p-3 font-bold text-asphalt">{promo.code}</td>
                    <td className="p-3">{promo.discount_percentage}% Off</td>
                    <td className="p-3">₹{promo.max_discount}</td>
                    <td className="p-3 text-gray-500">{promo.usage_count} times</td>
                    <td className="p-3">
                      <span className={`text-xs uppercase px-1.5 py-0.5 border-1 font-bold ${
                        promo.active 
                          ? 'bg-meterGreen/10 text-meterGreen border-meterGreen' 
                          : 'bg-roadCoral/10 text-roadCoral border-roadCoral'
                      }`}>
                        {promo.active ? 'active' : 'inactive'}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => toggleMutation.mutate({ id: promo.id, active: !promo.active })}
                        className={`text-xs px-2.5 py-1 border-1 border-asphalt font-bold uppercase transition-all ${
                          promo.active 
                            ? 'bg-roadCoral text-white hover:translate-y-[-1px]' 
                            : 'bg-meterGreen text-white hover:translate-y-[-1px]'
                        }`}
                      >
                        {promo.active ? 'deactivate' : 'activate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Creation Card */}
        {showAddForm && (
          <div className="bg-surface border-1 border-asphalt p-6 shadow-brutalist space-y-4">
            <h2 className="font-display text-xl font-extrabold uppercase text-asphalt">Create Campaign</h2>
            <p className="font-mono text-xs text-gray-500 uppercase font-bold">Inject new coupon properties</p>

            <form onSubmit={handleCreate} className="space-y-4 font-mono text-sm">
              <div>
                <label className="block text-xs font-bold uppercase mb-1">Coupon Code</label>
                <input
                  type="text"
                  required
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value)}
                  className="w-full bg-chalk border-1 border-asphalt px-2 py-1.5 uppercase focus:outline-none"
                  placeholder="e.g. MONSOON50"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase mb-1">Discount (%)</label>
                <input
                  type="number"
                  required
                  min="1"
                  max="100"
                  value={newPct}
                  onChange={(e) => setNewPct(parseInt(e.target.value))}
                  className="w-full bg-chalk border-1 border-asphalt px-2 py-1.5 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase mb-1">Maximum Cap (INR)</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={newMax}
                  onChange={(e) => setNewMax(parseInt(e.target.value))}
                  className="w-full bg-chalk border-1 border-asphalt px-2 py-1.5 focus:outline-none"
                />
              </div>

              <button type="submit" className="w-full btn-brutalist-primary py-2 uppercase mt-2">
                Inject Coupon Code
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
