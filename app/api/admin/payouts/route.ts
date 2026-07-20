import { NextResponse } from 'next/server';

let mockPayouts = [
  { id: 'pay-1', captain_name: 'Rajesh Kumar', phone: '+91 9876543210', amount: 4500.00, request_date: '2026-07-15', status: 'pending' },
  { id: 'pay-2', captain_name: 'Amit Patel', phone: '+91 8765432109', amount: 1200.00, request_date: '2026-07-16', status: 'pending' },
  { id: 'pay-3', captain_name: 'Suresh Raina', phone: '+91 7654321098', amount: 780.00, request_date: '2026-07-16', status: 'pending' },
  { id: 'pay-4', captain_name: 'Vikram Singh', phone: '+91 6543210987', amount: 5200.00, request_date: '2026-07-14', status: 'processed' },
];

export async function GET() {
  return NextResponse.json({ success: true, data: mockPayouts });
}

export async function POST(request: Request) {
  try {
    const { ids } = await request.json();
    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ success: false, error: { message: 'Invalid payout ids list' } }, { status: 400 });
    }

    mockPayouts = mockPayouts.map(p => ids.includes(p.id) ? { ...p, status: 'processed' } : p);
    
    return NextResponse.json({ success: true, data: { message: `Batch of ${ids.length} payouts approved successfully` } });
  } catch (err) {
    return NextResponse.json({ success: false, error: { message: 'Failed to process payouts batch' } }, { status: 500 });
  }
}
