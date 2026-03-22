import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '../../../lib/auth';
import { getActiveAlerts, acknowledgeAlert, resolveAlert } from '../../../lib/services/alertService';

async function handler(req: NextRequest) {
  const user = (req as any).user;
  const hospitalId = user.hospitalId;

  if (req.method === 'GET') {
    try {
      const alerts = await getActiveAlerts(hospitalId);
      return NextResponse.json({ alerts });
    } catch (err: any) {
      return NextResponse.json({ error: err.message }, { status: 500 });
    }
  }

  if (req.method === 'PATCH') {
    try {
      const { id, action } = await req.json(); // action: 'acknowledge' or 'resolve'
      if (!id || !action) return NextResponse.json({ error: 'id and action required' }, { status: 400 });

      if (action === 'acknowledge') await acknowledgeAlert(id);
      else if (action === 'resolve') await resolveAlert(id);
      else return NextResponse.json({ error: 'invalid action' }, { status: 400 });

      return NextResponse.json({ success: true });
    } catch (err: any) {
      return NextResponse.json({ error: err.message }, { status: 500 });
    }
  }

  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}

export const GET = withAuth(handler);
export const PATCH = withAuth(handler);
