import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '../../../lib/auth';
import { getDispensingLogs, dispenseMedicine } from '../../../lib/services/dispensingService';

async function handler(req: NextRequest) {
  const user = (req as any).user;
  const hospitalId = user.hospitalId;

  if (req.method === 'GET') {
    try {
      const logs = await getDispensingLogs(hospitalId);
      return NextResponse.json({ logs });
    } catch (err: any) {
      return NextResponse.json({ error: err.message }, { status: 500 });
    }
  }

  if (req.method === 'POST') {
    try {
      const body = await req.json();
      body.hospitalId = hospitalId;
      body.dispensedBy = user.uid;
      const newLog = await dispenseMedicine(body);
      return NextResponse.json({ log: newLog }, { status: 201 });
    } catch (err: any) {
      return NextResponse.json({ error: err.message }, { status: 500 });
    }
  }

  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}

export const GET = withAuth(handler);
export const POST = withAuth(handler);
