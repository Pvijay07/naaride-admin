'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ShieldCheck, ArrowLeft, Check, X } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface CaptainDetails {
  id: string;
  name: string;
  phone: string;
  vehicle_type: string;
  kyc_status: 'pending' | 'approved' | 'rejected';
  rating: number;
  joined_date: string;
  docs: {
    license: string;
    registration: string;
  };
}

export default function CaptainDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectForm, setShowRejectForm] = useState(false);

  const { data, isLoading, error } = useQuery<{ success: boolean; data: CaptainDetails }>({
    queryKey: ['captainDetails', params.id],
    queryFn: async () => {
      const res = await fetch(`/api/admin/captains/${params.id}`);
      if (!res.ok) throw new Error('Captain record not found');
      return res.json();
    },
  });

  const kycMutation = useMutation({
    mutationFn: async ({ status, reason }: { status: 'approved' | 'rejected'; reason?: string }) => {
      const res = await fetch(`/api/admin/captains/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, reason }),
      });
      if (!res.ok) throw new Error('Failed to update KYC status');
      return res.json();
    },
    onSuccess: (res, variables) => {
      queryClient.invalidateQueries({ queryKey: ['captains'] });
      queryClient.invalidateQueries({ queryKey: ['captainDetails', params.id] });
      toast({
        title: 'KYC Status Updated',
        description: `Captain account successfully marked as ${variables.status}`,
        variant: 'success',
      });
      router.push('/captains');
    },
    onError: (err: any) => {
      toast({
        title: 'KYC Update Failed',
        description: err.message,
        variant: 'destructive',
      });
    },
  });

  if (isLoading) {
    return <div className="p-12 font-mono text-center animate-pulse">Loading onboarding profile files...</div>;
  }

  if (error || !data?.success) {
    return (
      <div className="bg-roadCoral/10 border-1 border-roadCoral text-roadCoral p-6 font-mono">
        Error loading driver onboarding details.
      </div>
    );
  }

  const captain = data.data;

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <div className="flex items-center gap-4">
        <Link
          href="/captains"
          className="inline-flex items-center gap-2 border-1 border-asphalt px-3 py-2 bg-surface hover:bg-chalk transition-all text-xs font-mono uppercase font-bold"
        >
          <ArrowLeft size={14} /> Back to Queue
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Details */}
        <div className="lg:col-span-1 bg-surface border-1 border-asphalt p-6 shadow-brutalist space-y-6">
          <div className="border-b-1 border-asphalt pb-4">
            <h2 className="font-display text-2xl font-extrabold uppercase text-asphalt">{captain.name}</h2>
            <p className="font-mono text-xs text-gray-500 uppercase">Driver Profile Reference</p>
          </div>

          <div className="space-y-4 font-mono text-sm">
            <div>
              <span className="text-xs text-gray-400 block uppercase">Phone Number</span>
              <span className="text-asphalt font-bold">{captain.phone}</span>
            </div>
            <div>
              <span className="text-xs text-gray-400 block uppercase">Vehicle Registry Class</span>
              <span className="text-asphalt font-bold uppercase">{captain.vehicle_type}</span>
            </div>
            <div>
              <span className="text-xs text-gray-400 block uppercase">System Rating</span>
              <span className="text-asphalt font-bold">⭐ {captain.rating}</span>
            </div>
            <div>
              <span className="text-xs text-gray-400 block uppercase">Registration Date</span>
              <span className="text-asphalt">{captain.joined_date}</span>
            </div>
            <div>
              <span className="text-xs text-gray-400 block uppercase">Onboarding Status</span>
              <span
                className={`text-xs uppercase px-2 py-0.5 font-bold ${
                  captain.kyc_status === 'approved'
                    ? 'bg-meterGreen/10 text-meterGreen border-1 border-meterGreen'
                    : captain.kyc_status === 'rejected'
                    ? 'bg-roadCoral/10 text-roadCoral border-1 border-roadCoral'
                    : 'bg-signal/20 text-asphalt border-1 border-asphalt'
                }`}
              >
                {captain.kyc_status}
              </span>
            </div>
          </div>

          {/* Action buttons */}
          {captain.kyc_status === 'pending' && (
            <div className="space-y-3 pt-4 border-t-1 border-asphalt">
              {!showRejectForm ? (
                <>
                  <button
                    onClick={() => kycMutation.mutate({ status: 'approved' })}
                    disabled={kycMutation.isPending}
                    className="w-full bg-meterGreen text-white border-1 border-asphalt font-display font-extrabold text-lg py-2 uppercase flex items-center justify-center gap-2 hover:translate-y-[-2px] transition-all"
                  >
                    <Check size={18} /> Approve KYC
                  </button>
                  <button
                    onClick={() => setShowRejectForm(true)}
                    className="w-full bg-roadCoral text-white border-1 border-asphalt font-display font-extrabold text-lg py-2 uppercase flex items-center justify-center gap-2 hover:translate-y-[-2px] transition-all"
                  >
                    <X size={18} /> Reject KYC
                  </button>
                </>
              ) : (
                <div className="space-y-3">
                  <label className="block text-xs font-mono font-bold uppercase text-asphalt">
                    Rejection Reason (Required)
                  </label>
                  <textarea
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    required
                    className="w-full border-1 border-asphalt p-2 text-sm bg-chalk font-mono focus:outline-none"
                    placeholder="e.g. License scan is blurry or expired"
                    rows={3}
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => kycMutation.mutate({ status: 'rejected', reason: rejectReason })}
                      disabled={!rejectReason || kycMutation.isPending}
                      className="flex-1 bg-roadCoral text-white border-1 border-asphalt font-mono text-xs py-2 uppercase font-bold"
                    >
                      Confirm Rejection
                    </button>
                    <button
                      onClick={() => setShowRejectForm(false)}
                      className="flex-1 bg-chalk text-asphalt border-1 border-asphalt font-mono text-xs py-2 uppercase font-bold"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* KYC Document Previews */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-surface border-1 border-asphalt p-6 shadow-brutalist">
            <h3 className="font-display text-xl font-extrabold uppercase text-asphalt mb-4">
              Driver License Document File
            </h3>
            <div className="aspect-[4/3] bg-chalk border-1 border-asphalt overflow-hidden relative">
              <img
                src={captain.docs.license}
                alt="Driver License preview"
                className="object-cover w-full h-full"
              />
            </div>
          </div>

          <div className="bg-surface border-1 border-asphalt p-6 shadow-brutalist">
            <h3 className="font-display text-xl font-extrabold uppercase text-asphalt mb-4">
              Vehicle Registration certificate
            </h3>
            <div className="aspect-[4/3] bg-chalk border-1 border-asphalt overflow-hidden relative">
              <img
                src={captain.docs.registration}
                alt="Vehicle Registration preview"
                className="object-cover w-full h-full"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
