import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '../../../lib/auth';
import { getRecentTransactions, createTransaction } from '../../../lib/services/auditService';

async function handler(req: NextRequest) {
  const user = (req as any).user;
  const hospitalId = user.hospitalId;

  if (req.method === 'GET') {
    try {
      const limit = parseInt(req.nextUrl.searchParams.get('limit') || '100');
      const txs = await getRecentTransactions(hospitalId, limit);
      return NextResponse.json({ transactions: txs });
    } catch (err: any) {
      return NextResponse.json({ error: err.message }, { status: 500 });
    }
  }

  if (req.method === 'POST') {
    try {
      const body = await req.json();
      body.hospitalId = hospitalId;
      body.performedBy = user.uid;
      const newTx = await createTransaction(body);
      return NextResponse.json({ transaction: newTx }, { status: 201 });
    } catch (err: any) {
      return NextResponse.json({ error: err.message }, { status: 500 });
    }
  }

  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}

export const GET = withAuth(handler);
export const POST = withAuth(handler);
