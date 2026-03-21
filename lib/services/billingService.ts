import { adminDb } from '../firebaseAdmin';
import { Medicine, Batch } from '../../types';

export interface BillingItem {
  medicineId: string;
  batchId: string;
  quantity: number;
  price: number;
}

export interface BillingRecord {
  id?: string;
  hospitalId: string;
  patientName: string;
  doctorName?: string;
  items: BillingItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  paymentMethod: string;
  createdAt: Date;
  createdBy: string;
}

export async function createBill(billData: Omit<BillingRecord, 'id' | 'createdAt'>): Promise<BillingRecord> {
  const docRef = adminDb.collection('billing_records').doc();
  const now = new Date();
  
  const newBill: BillingRecord = {
    ...billData,
    id: docRef.id,
    createdAt: now,
  };

  await adminDb.runTransaction(async (transaction) => {
    for (const item of billData.items) {
      // 1. Update Medicine Stock
      const medRef = adminDb.collection('medicines').doc(item.medicineId);
      const medDoc = await transaction.get(medRef);
      if (!medDoc.exists) throw new Error(`Medicine ${item.medicineId} not found`);
      const med = medDoc.data() as Medicine;
      
      if (med.totalQuantity < item.quantity) {
        throw new Error(`Insufficient stock for ${med.name}`);
      }
      
      transaction.update(medRef, { 
        totalQuantity: med.totalQuantity - item.quantity,
        updatedAt: now
      });

      // 2. Update Batch Stock (if batchId is provided)
      if (item.batchId) {
        const batchRef = adminDb.collection('batches').doc(item.batchId);
        const batchDoc = await transaction.get(batchRef);
        if (batchDoc.exists) {
          const batch = batchDoc.data() as Batch;
          transaction.update(batchRef, { 
            remainingQuantity: batch.remainingQuantity - item.quantity 
          });
        }
      }

      // 3. Create Dispensing Log (Automated)
      const logRef = adminDb.collection('dispensing_logs').doc();
      transaction.set(logRef, {
        medicineId: item.medicineId,
        medicineName: med.name,
        batchId: item.batchId || "",
        batchNumber: "AUTO-BILL",
        quantity: item.quantity,
        patientName: billData.patientName,
        dispensedBy: billData.createdBy,
        dispensedAt: now,
        hospitalId: billData.hospitalId,
        status: 'dispensed'
      });
    }

    // 4. Create Billing Record
    transaction.set(docRef, newBill);
  });

  return newBill;
}

export async function getBillingRecords(hospitalId: string, limit: number = 50): Promise<BillingRecord[]> {
  const snapshot = await adminDb.collection('billing_records')
    .where('hospitalId', '==', hospitalId)
    .orderBy('createdAt', 'desc')
    .limit(limit)
    .get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as BillingRecord));
}
