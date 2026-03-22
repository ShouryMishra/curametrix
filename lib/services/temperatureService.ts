import { adminDb } from '../firebaseAdmin';
import { TemperatureReading } from '../../types';

const COLLECTION = 'temperature_readings';

export async function logTemperature(readingData: Omit<TemperatureReading, 'id' | 'recordedAt'>): Promise<TemperatureReading> {
  const docRef = adminDb.collection(COLLECTION).doc();
  const newReading: TemperatureReading = {
    ...readingData,
    id: docRef.id,
    recordedAt: new Date(),
  };
  await docRef.set(newReading);
  
  // Potential integration: trigger alert if isBreached === true
  if (newReading.isBreached) {
    const alertRef = adminDb.collection('alerts').doc();
    await alertRef.set({
      id: alertRef.id,
      type: 'temperature',
      severity: 'critical',
      title: 'Temperature breach detected',
      message: `Zone ${newReading.zone} recorded unsafe temp ${newReading.temperature}°C`,
      status: 'active',
      hospitalId: newReading.hospitalId,
      createdAt: new Date(),
      smsSent: false,
      emailSent: false,
    });
  }

  return newReading;
}

export async function getRecentReadings(hospitalId: string, limit: number = 24): Promise<TemperatureReading[]> {
  const snapshot = await adminDb.collection(COLLECTION)
    .where('hospitalId', '==', hospitalId)
    .orderBy('recordedAt', 'desc')
    .limit(limit)
    .get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as TemperatureReading));
}
