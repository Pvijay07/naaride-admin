import { NextResponse } from 'next/server';

// In-memory mock database of captains for admin dashboard
let mockCaptains = [
  {
    id: 'cap-1',
    name: 'Rajesh Kumar',
    phone: '+91 9876543210',
    vehicle_type: 'bike',
    kyc_status: 'pending',
    rating: 4.8,
    joined_date: '2026-07-01',
    docs: {
      license: 'https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?w=500',
      registration: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=500',
    }
  },
  {
    id: 'cap-2',
    name: 'Amit Patel',
    phone: '+91 8765432109',
    vehicle_type: 'auto',
    kyc_status: 'approved',
    rating: 4.5,
    joined_date: '2026-06-15',
    docs: {
      license: 'https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?w=500',
      registration: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=500',
    }
  },
  {
    id: 'cap-3',
    name: 'Suresh Raina',
    phone: '+91 7654321098',
    vehicle_type: 'cab',
    kyc_status: 'pending',
    rating: 4.9,
    joined_date: '2026-07-10',
    docs: {
      license: 'https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?w=500',
      registration: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=500',
    }
  },
  {
    id: 'cap-4',
    name: 'Vikram Singh',
    phone: '+91 6543210987',
    vehicle_type: 'bike',
    kyc_status: 'rejected',
    rating: 4.2,
    joined_date: '2026-05-20',
    docs: {
      license: 'https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?w=500',
      registration: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=500',
    }
  }
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');

  let list = mockCaptains;
  if (status) {
    list = mockCaptains.filter(c => c.kyc_status === status);
  }

  return NextResponse.json({ success: true, data: list });
}

// Export for use in the dynamic detail route
export function getCaptainById(id: string) {
  return mockCaptains.find(c => c.id === id);
}

export function updateCaptainKyc(id: string, status: 'approved' | 'rejected', reason?: string) {
  const cap = mockCaptains.find(c => c.id === id);
  if (cap) {
    cap.kyc_status = status;
    return true;
  }
  return false;
}
