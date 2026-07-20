import { NextResponse } from 'next/server';
import { getCaptainById, updateCaptainKyc } from '../route';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const captain = getCaptainById(params.id);
  if (!captain) {
    return NextResponse.json({ success: false, error: { message: 'Captain not found' } }, { status: 404 });
  }
  return NextResponse.json({ success: true, data: captain });
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const { status, reason } = body;

    if (status !== 'approved' && status !== 'rejected') {
      return NextResponse.json({ success: false, error: { message: 'Invalid KYC status' } }, { status: 400 });
    }

    const updated = updateCaptainKyc(params.id, status, reason);
    if (!updated) {
      return NextResponse.json({ success: false, error: { message: 'Captain not found' } }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: { message: `KYC status updated to ${status}` } });
  } catch (err) {
    return NextResponse.json({ success: false, error: { message: 'Failed to update KYC status' } }, { status: 500 });
  }
}
