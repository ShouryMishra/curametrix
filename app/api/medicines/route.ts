import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '../../../lib/auth';
import { getAllMedicines, createMedicine } from '../../../lib/services/medicineService';

async function handler(req: NextRequest) {
  const user = (req as any).user;
  const hospitalId = user.hospitalId;

  if (req.method === 'GET') {
    try {
      const medicines = await getAllMedicines(hospitalId);
      return NextResponse.json({ medicines });
    } catch (err: any) {
      return NextResponse.json({ error: err.message }, { status: 500 });
    }
  }

  if (req.method === 'POST') {
    try {
      const body = await req.json();
      body.hospitalId = hospitalId; // Security enforcement
      const newMed = await createMedicine(body);
      return NextResponse.json({ medicine: newMed }, { status: 201 });
    } catch (err: any) {
      return NextResponse.json({ error: err.message }, { status: 500 });
    }
  }

  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}

export const GET = withAuth(handler);
export const POST = withAuth(handler);
