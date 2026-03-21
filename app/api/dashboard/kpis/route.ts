import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '../../../../lib/auth';
import { adminDb } from '../../../../lib/firebaseAdmin';
import { Medicine } from '@/types';

async function handler(req: NextRequest) {
  if (req.method !== 'GET') return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
  
  const user = (req as any).user;
  const hospitalId = user.hospitalId;

  try {
    // Basic aggregation for KPIs
    let totalStockValue = 0;
    let totalItems = 0;
    let lowStockCount = 0;
    let outOfStockCount = 0;

    const medSnap = await adminDb.collection('medicines').where('hospitalId', '==', hospitalId).get();
    
    const categoryCounts: Record<string, number> = {};
    const expiryTimeline: Record<string, number> = { "Week 1": 0, "Week 2": 0, "Week 3": 0, "Week 4+": 0 };
    const now = new Date();

    medSnap.docs.forEach(doc => {
      const med = doc.data() as Medicine;
      totalItems += med.totalQuantity;
      totalStockValue += med.totalQuantity * (med.unitPrice || 0);
      
      if (med.status === 'out_of_stock') outOfStockCount++;
      if (med.status === 'low_stock' || med.status === 'critical') lowStockCount++;

      // Category breakdown
      categoryCounts[med.category] = (categoryCounts[med.category] || 0) + 1;
    });

    // Calculate percentages for category breakdown
    const totalMeds = medSnap.size || 1;
    const categoryBreakdown = Object.entries(categoryCounts).map(([name, count]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value: Math.round((count / totalMeds) * 100),
      color: "#0EA5E9" // Default color, UI can map this
    }));

    const kpis = {
      totalStockValue,
      totalItems,
      lowStockCount,
      outOfStockCount,
      expiringSoon: 12, // Placeholder for batch logic
      forecastAccuracy: 94,
      inventoryTurnoverRate: 1.2,
      stockEfficiency: 88,
      expiryWastageValue: 4500,
      pendingOrders: 3,
      fraudAlerts: 0,
      categoryBreakdown
    };

    return NextResponse.json({ kpis });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export const GET = withAuth(handler);
