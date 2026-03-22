import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '../../../../lib/auth';
import { adminDb } from '../../../../lib/firebaseAdmin';

async function handler(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  const user = (req as any).user;
  const hospitalId = user.hospitalId;

  if (req.method === 'PATCH') {
    try {
      const body = await req.json();
      delete body.id;
      delete body.hospitalId;
      
      const docRef = adminDb.collection('medicines').doc(id);
      const doc = await docRef.get();
      
      if (!doc.exists || doc.data()?.hospitalId !== hospitalId) {
        return NextResponse.json({ error: 'Medicine not found' }, { status: 404 });
      }

      await docRef.update({
        ...body,
        updatedAt: new Date()
      });

      return NextResponse.json({ success: true });
    } catch (err: any) {
      return NextResponse.json({ error: err.message }, { status: 500 });
    }
  }

  if (req.method === 'DELETE') {
    try {
      const docRef = adminDb.collection('medicines').doc(id);
      const doc = await docRef.get();
      
      if (!doc.exists || doc.data()?.hospitalId !== hospitalId) {
        return NextResponse.json({ error: 'Medicine not found' }, { status: 404 });
      }

      await docRef.delete();
      return NextResponse.json({ success: true });
    } catch (err: any) {
      return NextResponse.json({ error: err.message }, { status: 500 });
    }
  }

  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}

export const PATCH = withAuth(handler);
export const DELETE = withAuth(handler);
