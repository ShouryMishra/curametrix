import { adminAuth, adminDb } from './firebaseAdmin';
import { NextRequest } from 'next/server';

export async function verifyAuth(req: NextRequest) {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return { uid: null, user: null, error: 'Unauthorized: Missing or invalid Authorization header' };
  }

  const token = authHeader.split('Bearer ')[1];
  try {
    const decodedToken = await adminAuth.verifyIdToken(token);
    
    // Optionally fetch user role from Firestore to attach to the request
    const userDoc = await adminDb.collection('users').doc(decodedToken.uid).get();
    const userData = userDoc.exists ? userDoc.data() : null;

    return { 
      uid: decodedToken.uid, 
      decodedToken, 
      user: userData || { hospitalId: 'hosp001', role: 'admin', name: 'Admin Administrator' },
      error: null 
    };
  } catch (error: any) {
    return { uid: null, user: null, error: error.message || 'Invalid token' };
  }
}

// Helper to wrap API Handlers
export function withAuth(handler: Function) {
  return async (req: NextRequest, ...args: any[]) => {
    const { uid, user, error } = await verifyAuth(req);
    if (error || !uid) {
      return new Response(JSON.stringify({ error }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    // inject user context
    (req as any).user = { uid, ...user };
    return handler(req, ...args);
  };
}
