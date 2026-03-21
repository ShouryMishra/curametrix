import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '../../../lib/auth';
import { createBatch, getBatchesForMedicine } from '../../../lib/services/batchService';

async function handler(req: NextRequest) {
  const user = (req as any).user;
  const hospitalId = user.hospitalId;

  if (req.method === 'GET') {
    const medId = req.nextUrl.searchParams.get('medicineId');
    if (!medId) return NextResponse.json({ error: 'medicineId is required' }, { status: 400 });
    try {
      // In a real app, optionally verify if this medicine belongs to hospitalId
      const batches = await getBatchesForMedicine(medId);
      return NextResponse.json({ batches });
    } catch (err: any) {
      return NextResponse.json({ error: err.message }, { status: 500 });
    }
  }

  if (req.method === 'POST') {
    try {
      const body = await req.json();
      body.hospitalId = hospitalId; // Security enforcement
      const newBatch = await createBatch(body);
      return NextResponse.json({ batch: newBatch }, { status: 201 });
    } catch (err: any) {
      return NextResponse.json({ error: err.message }, { status: 500 });
    }
  }

  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}

export const GET = withAuth(handler);
export const POST = withAuth(handler);
