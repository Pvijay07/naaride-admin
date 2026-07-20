import { NextResponse } from 'next/server';

let mockPromos = [
  { id: 'promo-1', code: 'naaride50', discount_percentage: 50, max_discount: 50.00, active: true, usage_count: 1420 },
  { id: 'promo-2', code: 'BIKETAXI', discount_percentage: 20, max_discount: 30.00, active: true, usage_count: 890 },
  { id: 'promo-3', code: 'MONSOON', discount_percentage: 30, max_discount: 60.00, active: false, usage_count: 412 },
];

export async function GET() {
  return NextResponse.json({ success: true, data: mockPromos });
}

export async function POST(request: Request) {
  try {
    const newPromo = await request.json();
    const id = `promo-${Date.now()}`;
    const created = { id, usage_count: 0, active: true, ...newPromo };
    mockPromos.push(created);
    return NextResponse.json({ success: true, data: created });
  } catch (err) {
    return NextResponse.json({ success: false, error: { message: 'Failed to create promo' } }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const updatedPromo = await request.json();
    mockPromos = mockPromos.map(p => p.id === updatedPromo.id ? { ...p, ...updatedPromo } : p);
    return NextResponse.json({ success: true, data: updatedPromo });
  } catch (err) {
    return NextResponse.json({ success: false, error: { message: 'Failed to update promo' } }, { status: 500 });
  }
}
