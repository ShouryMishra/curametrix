import { adminDb } from '../firebaseAdmin';
import { Batch, Medicine } from '../../types';
import { updateMedicine } from './medicineService';

const COLLECTION = 'batches';

export async function getBatchesForMedicine(medicineId: string): Promise<Batch[]> {
  const snapshot = await adminDb.collection(COLLECTION)
    .where('medicineId', '==', medicineId)
    .where('remainingQuantity', '>', 0)
    .get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Batch));
}

export async function createBatch(batchData: Omit<Batch, 'id' | 'isExpired' | 'daysToExpiry' | 'expiryStatus'>): Promise<Batch> {
  const docRef = adminDb.collection(COLLECTION).doc();
  const now = new Date();
  const expiryDate = new Date(batchData.expiryDate);
  const diffTime = Math.abs(expiryDate.getTime() - now.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  const isExpired = now > expiryDate;
  let expiryStatus: Batch['expiryStatus'] = 'safe';
  if (isExpired) expiryStatus = 'expired';
  else if (diffDays <= 30) expiryStatus = 'critical';
  else if (diffDays <= 90) expiryStatus = 'near_expiry';

  const newBatch: Batch = {
    ...batchData,
    id: docRef.id,
    isExpired,
    daysToExpiry: diffDays,
    expiryStatus,
  };
  await docRef.set(newBatch);

  // Update total quantity in medicine collection
  const medDoc = await adminDb.collection('medicines').doc(batchData.medicineId).get();
  if (medDoc.exists) {
    const med = medDoc.data() as Medicine;
    await updateMedicine(batchData.medicineId, {
      totalQuantity: med.totalQuantity + batchData.quantity
    });
  }

  return newBatch;
}
