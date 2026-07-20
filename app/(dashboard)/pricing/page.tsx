'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { IndianRupee, Calculator, Edit, Check, X } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface PricingRule {
  id: string;
  city: string;
  vehicle_type: string;
  base_fare: number;
  per_km_rate: number;
  per_min_rate: number;
  min_fare: number;
  cancellation_fee: number;
}

export default function PricingPage() {
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<PricingRule>>({});
  
  // Calculator State
  const [calcCity, setCalcCity] = useState('Bengaluru');
  const [calcVehicle, setCalcVehicle] = useState('bike');
  const [calcDistance, setCalcDistance] = useState(5);
  const [calcDuration, setCalcDuration] = useState(15);

  const { data, isLoading, error } = useQuery<{ success: boolean; data: PricingRule[] }>({
    queryKey: ['pricingRules'],
    queryFn: async () => {
      const res = await fetch('/api/admin/pricing');
      if (!res.ok) throw new Error('Failed to load rules');
      return res.json();
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (rule: Partial<PricingRule>) => {
      const res = await fetch('/api/admin/pricing', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rule),
      });
      if (!res.ok) throw new Error('Failed to update rule');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pricingRules'] });
      toast({
        title: 'Pricing Matrix Updated',
        description: 'Pricing rule modified and saved successfully',
        variant: 'success',
      });
      setEditingId(null);
    },
    onError: (err: any) => {
      toast({
        title: 'Update Failed',
        description: err.message,
        variant: 'destructive',
      });
    },
  });

  function startEdit(rule: PricingRule) {
    setEditingId(rule.id);
    setEditForm(rule);
  }

  function handleSave() {
    updateMutation.mutate(editForm);
  }

  // Live calculator calculation
  const rulesList = data?.data || [];
  const activeRule = rulesList.find(r => r.city === calcCity && r.vehicle_type === calcVehicle);
  
  let calculatedFare = 0;
  let breakdown = { base: 0, distance: 0, duration: 0 };
  
  if (activeRule) {
    const base = parseFloat(activeRule.base_fare as any);
    const distVal = calcDistance * parseFloat(activeRule.per_km_rate as any);
    const durVal = calcDuration * parseFloat(activeRule.per_min_rate as any);
    breakdown = { base, distance: distVal, duration: durVal };
    calculatedFare = base + distVal + durVal;
    if (calculatedFare < parseFloat(activeRule.min_fare as any)) {
      calculatedFare = parseFloat(activeRule.min_fare as any);
    }
  }

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="bg-surface border-1 border-asphalt p-6 shadow-brutalist">
        <h1 className="font-display text-3xl font-extrabold uppercase text-asphalt flex items-center gap-2">
          <IndianRupee /> Fare Pricing Rules
        </h1>
        <p className="font-mono text-sm text-gray-500 mt-1 uppercase">Adjust base fares, mileage rates, and min floors</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Rules Table */}
        <div className="lg:col-span-2 bg-surface border-1 border-asphalt p-6 shadow-brutalist space-y-4">
          <h2 className="font-display text-xl font-extrabold uppercase text-asphalt">Active City Matrix</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-1 border-asphalt bg-chalk/50 font-mono text-xs uppercase text-gray-600">
                  <th className="p-3">City</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Base</th>
                  <th className="p-3">Per Km</th>
                  <th className="p-3">Per Min</th>
                  <th className="p-3">Min Fare</th>
                  <th className="p-3">Cancel Fee</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y-1 divide-asphalt/10 font-mono text-sm">
                {isLoading ? (
                  <tr><td colSpan={8} className="p-6 text-center animate-pulse">Loading rates...</td></tr>
                ) : (
                  rulesList.map((rule) => {
                    const isEditing = editingId === rule.id;
                    return (
                      <tr key={rule.id} className="hover:bg-chalk/10">
                        <td className="p-3 font-bold">{rule.city}</td>
                        <td className="p-3 uppercase text-xs">
                          <span className="px-1.5 py-0.5 border-1 border-asphalt bg-chalk">{rule.vehicle_type}</span>
                        </td>
                        <td className="p-3">
                          {isEditing ? (
                            <input
                              type="number"
                              className="w-16 border-1 border-asphalt px-1 bg-chalk text-xs"
                              value={editForm.base_fare || 0}
                              onChange={(e) => setEditForm({ ...editForm, base_fare: parseFloat(e.target.value) })}
                            />
                          ) : (
                            `₹${rule.base_fare}`
                          )}
                        </td>
                        <td className="p-3">
                          {isEditing ? (
                            <input
                              type="number"
                              className="w-16 border-1 border-asphalt px-1 bg-chalk text-xs"
                              value={editForm.per_km_rate || 0}
                              onChange={(e) => setEditForm({ ...editForm, per_km_rate: parseFloat(e.target.value) })}
                            />
                          ) : (
                            `₹${rule.per_km_rate}`
                          )}
                        </td>
                        <td className="p-3">
                          {isEditing ? (
                            <input
                              type="number"
                              className="w-16 border-1 border-asphalt px-1 bg-chalk text-xs"
                              value={editForm.per_min_rate || 0}
                              onChange={(e) => setEditForm({ ...editForm, per_min_rate: parseFloat(e.target.value) })}
                            />
                          ) : (
                            `₹${rule.per_min_rate}`
                          )}
                        </td>
                        <td className="p-3">
                          {isEditing ? (
                            <input
                              type="number"
                              className="w-16 border-1 border-asphalt px-1 bg-chalk text-xs"
                              value={editForm.min_fare || 0}
                              onChange={(e) => setEditForm({ ...editForm, min_fare: parseFloat(e.target.value) })}
                            />
                          ) : (
                            `₹${rule.min_fare}`
                          )}
                        </td>
                        <td className="p-3">
                          {isEditing ? (
                            <input
                              type="number"
                              className="w-16 border-1 border-asphalt px-1 bg-chalk text-xs"
                              value={editForm.cancellation_fee || 0}
                              onChange={(e) => setEditForm({ ...editForm, cancellation_fee: parseFloat(e.target.value) })}
                            />
                          ) : (
                            `₹${rule.cancellation_fee}`
                          )}
                        </td>
                        <td className="p-3 text-right">
                          {isEditing ? (
                            <div className="flex gap-1 justify-end">
                              <button onClick={handleSave} className="p-1 border-1 border-asphalt bg-meterGreen text-white">
                                <Check size={12} />
                              </button>
                              <button onClick={() => setEditingId(null)} className="p-1 border-1 border-asphalt bg-chalk text-asphalt">
                                <X size={12} />
                              </button>
                            </div>
                          ) : (
                            <button onClick={() => startEdit(rule)} className="p-1 border-1 border-asphalt bg-signal text-asphalt">
                              <Edit size={12} />
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Live Fare Calculator Widget */}
        <div className="bg-surface border-1 border-asphalt p-6 shadow-brutalist space-y-4">
          <h2 className="font-display text-xl font-extrabold uppercase text-asphalt flex items-center gap-2">
            <Calculator /> Live Fare Preview
          </h2>
          <p className="font-mono text-xs text-gray-500 uppercase">Test pricing rules configurations live</p>

          <div className="space-y-4 font-mono text-sm">
            <div>
              <label className="block text-xs font-bold uppercase mb-1">Select City</label>
              <select
                value={calcCity}
                onChange={(e) => setCalcCity(e.target.value)}
                className="w-full bg-chalk border-1 border-asphalt px-2 py-1.5 focus:outline-none"
              >
                <option value="Bengaluru">Bengaluru</option>
                <option value="Delhi NCR">Delhi NCR</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase mb-1">Vehicle Class</label>
              <select
                value={calcVehicle}
                onChange={(e) => setCalcVehicle(e.target.value)}
                className="w-full bg-chalk border-1 border-asphalt px-2 py-1.5 focus:outline-none"
              >
                <option value="bike">Bike</option>
                <option value="auto">Auto</option>
                <option value="cab">Cab</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase mb-1">Distance (km): {calcDistance}</label>
              <input
                type="range"
                min="1"
                max="50"
                value={calcDistance}
                onChange={(e) => setCalcDistance(parseInt(e.target.value))}
                className="w-full accent-asphalt bg-chalk h-1 border-1 border-asphalt"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase mb-1">Duration (minutes): {calcDuration}</label>
              <input
                type="range"
                min="2"
                max="120"
                value={calcDuration}
                onChange={(e) => setCalcDuration(parseInt(e.target.value))}
                className="w-full accent-asphalt bg-chalk h-1 border-1 border-asphalt"
              />
            </div>

            <div className="border-t-1 border-dashed border-asphalt pt-4 space-y-2">
              <div className="flex justify-between text-xs text-gray-500">
                <span>Base Fare</span>
                <span>₹{breakdown.base.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>Distance Fare</span>
                <span>₹{breakdown.distance.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>Duration Fare</span>
                <span>₹{breakdown.duration.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg text-asphalt pt-2 border-t-1 border-asphalt">
                <span>Estimated Total</span>
                <span>₹{calculatedFare.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
