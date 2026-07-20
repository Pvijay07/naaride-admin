import { NextResponse } from 'next/server';
import { getRideById, flagRide } from '../route';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const ride = getRideById(params.id);
  if (!ride) {
    return NextResponse.json({ success: false, error: { message: 'Ride not found' } }, { status: 404 });
  }
  return NextResponse.json({ success: true, data: ride });
}

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const flagged = flagRide(params.id);
  if (!flagged) {
    return NextResponse.json({ success: false, error: { message: 'Ride not found' } }, { status: 404 });
  }
  return NextResponse.json({ success: true, data: { message: 'Ride flagged for investigation successfully' } });
}
