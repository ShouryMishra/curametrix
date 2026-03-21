import { adminDb } from '../firebaseAdmin';
import { DispensingLog, Batch, Medicine } from '../../types';
import { updateMedicine } from './medicineService';

const COLLECTION = 'dispensing_logs';

export async function dispenseMedicine(logData: Omit<DispensingLog, 'id' | 'dispensedAt'>): Promise<DispensingLog> {
  const docRef = adminDb.collection(COLLECTION).doc();
  const now = new Date();
  
  const newLog: DispensingLog = {
    ...logData,
    id: docRef.id,
    dispensedAt: now,
  };

  await adminDb.runTransaction(async (transaction) => {
    // Check batch
    const batchRef = adminDb.collection('batches').doc(logData.batchId);
    const batchDoc = await transaction.get(batchRef);
    if (!batchDoc.exists) throw new Error('Batch not found');
    const batch = batchDoc.data() as Batch;

    if (batch.remainingQuantity < logData.quantity) {
      throw new Error('Insufficient quantity in batch');
    }

    // Check medicine
    const medRef = adminDb.collection('medicines').doc(logData.medicineId);
    const medDoc = await transaction.get(medRef);
    if (!medDoc.exists) throw new Error('Medicine not found');
    const med = medDoc.data() as Medicine;

    if (med.totalQuantity < logData.quantity) {
      throw new Error('Insufficient total quantity mapping');
    }

    // Deduct stock
    transaction.update(batchRef, { remainingQuantity: batch.remainingQuantity - logData.quantity });
    transaction.update(medRef, { totalQuantity: med.totalQuantity - logData.quantity });
    
    // Create Log
    transaction.set(docRef, newLog);
  });

  return newLog;
}

export async function getDispensingLogs(hospitalId: string, limit: number = 50): Promise<DispensingLog[]> {
  const snapshot = await adminDb.collection(COLLECTION)
    .where('hospitalId', '==', hospitalId)
    .orderBy('dispensedAt', 'desc')
    .limit(limit)
    .get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as DispensingLog));
}
