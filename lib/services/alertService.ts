import { adminDb } from '../firebaseAdmin';
import { Alert, AlertType, AlertSeverity } from '../../types';

const COLLECTION = 'alerts';

export async function getActiveAlerts(hospitalId: string): Promise<Alert[]> {
  const snapshot = await adminDb.collection(COLLECTION)
    .where('hospitalId', '==', hospitalId)
    .where('status', '==', 'active')
    .get();
    
  const alerts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Alert));
  return alerts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function createAlert(alertData: Omit<Alert, 'id' | 'createdAt' | 'status'>): Promise<Alert> {
  const docRef = adminDb.collection(COLLECTION).doc();
  const newAlert: Alert = {
    ...alertData,
    id: docRef.id,
    createdAt: new Date(),
    status: 'active',
  };
  await docRef.set(newAlert);
  return newAlert;
}

export async function acknowledgeAlert(id: string): Promise<void> {
  await adminDb.collection(COLLECTION).doc(id).update({
    status: 'acknowledged',
  });
}

export async function resolveAlert(id: string): Promise<void> {
  await adminDb.collection(COLLECTION).doc(id).update({
    status: 'resolved',
    resolvedAt: new Date()
  });
}
