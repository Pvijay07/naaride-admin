import { NextResponse } from 'next/server';

let mockRides = [
  {
    id: 'ride-101',
    rider_name: 'Aditya Sen',
    rider_phone: '+91 9998887776',
    captain_name: 'Amit Patel',
    captain_phone: '+91 8765432109',
    vehicle_type: 'auto',
    status: 'in_progress',
    estimated_fare: 120.00,
    final_fare: null,
    payment_mode: 'online',
    payment_status: 'pending',
    created_at: '2026-07-16T10:30:00Z',
    flagged: false,
    pickup: { lat: 12.971598, lng: 77.594562, address: 'Cubbon Park Metro Station' },
    drop: { lat: 12.925453, lng: 77.582811, address: 'Jayanagar 4th Block' },
    pings: [
      { lat: 12.971598, lng: 77.594562, time: '10:31:00' },
      { lat: 12.955400, lng: 77.590000, time: '10:35:00' },
      { lat: 12.940000, lng: 77.585000, time: '10:39:00' },
    ],
    history: [
      { status: 'requested', changed_by: 'rider', reason: 'Ride requested', created_at: '2026-07-16T10:30:00Z' },
      { status: 'accepted', changed_by: 'captain', reason: 'Ride accepted by Amit Patel', created_at: '2026-07-16T10:32:00Z' },
      { status: 'arrived', changed_by: 'captain', reason: 'Captain arrived at pickup location', created_at: '2026-07-16T10:35:00Z' },
      { status: 'in_progress', changed_by: 'captain', reason: 'Trip started (OTP verified)', created_at: '2026-07-16T10:36:00Z' },
    ]
  },
  {
    id: 'ride-102',
    rider_name: 'Priyanka Sharma',
    rider_phone: '+91 9997776665',
    captain_name: 'Rajesh Kumar',
    captain_phone: '+91 9876543210',
    vehicle_type: 'bike',
    status: 'completed',
    estimated_fare: 65.00,
    final_fare: 65.00,
    payment_mode: 'cash',
    payment_status: 'captured',
    created_at: '2026-07-16T09:15:00Z',
    flagged: false,
    pickup: { lat: 12.935242, lng: 77.624476, address: 'Koramangala 3rd Block' },
    drop: { lat: 12.978432, lng: 77.640854, address: 'Indiranagar 100ft Road' },
    pings: [
      { lat: 12.935242, lng: 77.624476, time: '09:16:00' },
      { lat: 12.952000, lng: 77.632000, time: '09:22:00' },
      { lat: 12.978432, lng: 77.640854, time: '09:30:00' },
    ],
    history: [
      { status: 'requested', changed_by: 'rider', reason: 'Ride requested', created_at: '2026-07-16T09:15:00Z' },
      { status: 'accepted', changed_by: 'captain', reason: 'Ride accepted by Rajesh Kumar', created_at: '2026-07-16T09:17:00Z' },
      { status: 'arrived', changed_by: 'captain', reason: 'Captain arrived at pickup', created_at: '2026-07-16T09:20:00Z' },
      { status: 'in_progress', changed_by: 'captain', reason: 'Trip started', created_at: '2026-07-16T09:22:00Z' },
      { status: 'completed', changed_by: 'captain', reason: 'Trip completed successfully', created_at: '2026-07-16T09:31:00Z' },
    ]
  }
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');

  let list = mockRides;
  if (status) {
    list = mockRides.filter(r => r.status === status);
  }

  return NextResponse.json({ success: true, data: list });
}

export function getRideById(id: string) {
  return mockRides.find(r => r.id === id);
}

export function flagRide(id: string) {
  const ride = mockRides.find(r => r.id === id);
  if (ride) {
    ride.flagged = true;
    return true;
  }
  return false;
}
