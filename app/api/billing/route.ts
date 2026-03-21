import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '../../../lib/auth';
import { createBill, getBillingRecords } from '../../../lib/services/billingService';

async function handler(req: NextRequest) {
  const user = (req as any).user;
  const hospitalId = user.hospitalId;

  if (req.method === 'GET') {
    try {
      const bills = await getBillingRecords(hospitalId);
      return NextResponse.json({ bills });
    } catch (err: any) {
      return NextResponse.json({ error: err.message }, { status: 500 });
    }
  }

  if (req.method === 'POST') {
    try {
      const body = await req.json();
      body.hospitalId = hospitalId;
      body.createdBy = user.uid;
      const newBill = await createBill(body);
      return NextResponse.json({ bill: newBill }, { status: 201 });
    } catch (err: any) {
      return NextResponse.json({ error: err.message }, { status: 500 });
    }
  }

  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}

export const GET = withAuth(handler);
export const POST = withAuth(handler);
