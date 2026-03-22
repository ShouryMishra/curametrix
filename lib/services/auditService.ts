import { adminDb } from '../firebaseAdmin';
import { StockTransaction } from '../../types';

const COLLECTION = 'stock_transactions';

export async function createTransaction(txData: Omit<StockTransaction, 'id' | 'createdAt'>): Promise<StockTransaction> {
  const docRef = adminDb.collection(COLLECTION).doc();
  const newTx: StockTransaction = {
    ...txData,
    id: docRef.id,
    createdAt: new Date(),
  };
  await docRef.set(newTx);
  return newTx;
}

export async function getRecentTransactions(hospitalId: string, limit: number = 100): Promise<StockTransaction[]> {
  const snapshot = await adminDb.collection(COLLECTION)
    .where('hospitalId', '==', hospitalId)
    .orderBy('createdAt', 'desc')
    .limit(limit)
    .get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as StockTransaction));
}
