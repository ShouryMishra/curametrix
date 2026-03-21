import { adminDb } from '../firebaseAdmin';
import { Medicine } from '../../types';

const COLLECTION = 'medicines';

export async function getMedicine(id: string): Promise<Medicine | null> {
  const doc = await adminDb.collection(COLLECTION).doc(id).get();
  return doc.exists ? (doc.data() as Medicine) : null;
}

export async function getAllMedicines(hospitalId: string): Promise<Medicine[]> {
  const snapshot = await adminDb.collection(COLLECTION).where('hospitalId', '==', hospitalId).get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Medicine));
}

export async function createMedicine(medicineData: Omit<Medicine, 'id' | 'createdAt' | 'updatedAt'>): Promise<Medicine> {
  const docRef = adminDb.collection(COLLECTION).doc();
  const now = new Date();
  const newMed: Medicine = {
    ...medicineData,
    id: docRef.id,
    createdAt: now,
    updatedAt: now,
  };
  await docRef.set(newMed);
  return newMed;
}

export async function updateMedicine(id: string, updates: Partial<Medicine>): Promise<void> {
  await adminDb.collection(COLLECTION).doc(id).update({
    ...updates,
    updatedAt: new Date(),
  });
}

export async function deleteMedicine(id: string): Promise<void> {
  await adminDb.collection(COLLECTION).doc(id).delete();
}
