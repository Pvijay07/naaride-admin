import { NextResponse } from 'next/server';

let mockPricingRules = [
  { id: 'rule-1', city: 'Bengaluru', vehicle_type: 'bike', base_fare: 40.00, per_km_rate: 15.00, per_min_rate: 2.00, min_fare: 50.00, cancellation_fee: 20.00 },
  { id: 'rule-2', city: 'Bengaluru', vehicle_type: 'auto', base_fare: 60.00, per_km_rate: 18.00, per_min_rate: 2.50, min_fare: 70.00, cancellation_fee: 25.00 },
  { id: 'rule-3', city: 'Bengaluru', vehicle_type: 'cab', base_fare: 80.00, per_km_rate: 22.00, per_min_rate: 3.00, min_fare: 100.00, cancellation_fee: 40.00 },
  { id: 'rule-4', city: 'Delhi NCR', vehicle_type: 'bike', base_fare: 35.00, per_km_rate: 14.00, per_min_rate: 1.80, min_fare: 45.00, cancellation_fee: 15.00 },
  { id: 'rule-5', city: 'Delhi NCR', vehicle_type: 'auto', base_fare: 55.00, per_km_rate: 17.00, per_min_rate: 2.20, min_fare: 65.00, cancellation_fee: 20.00 },
];

export async function GET() {
  return NextResponse.json({ success: true, data: mockPricingRules });
}

export async function PUT(request: Request) {
  try {
    const updatedRule = await request.json();
    mockPricingRules = mockPricingRules.map(r => r.id === updatedRule.id ? { ...r, ...updatedRule } : r);
    return NextResponse.json({ success: true, data: updatedRule });
  } catch (err) {
    return NextResponse.json({ success: false, error: { message: 'Failed to update rule' } }, { status: 500 });
  }
}
