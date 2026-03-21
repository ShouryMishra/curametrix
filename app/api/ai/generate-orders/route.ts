import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";
import { Medicine } from "@/types";

export async function POST(req: NextRequest) {
  try {
    const { hospitalId = 'hosp001' } = await req.json().catch(() => ({}));
    
    const medSnap = await adminDb.collection('medicines').where('hospitalId', '==', hospitalId).get();
    
    // Simulate Weather-based ML trends
    const weatherConditions = ["monsoon", "summer_heatwave", "winter_chill", "normal"];
    const currentWeather = weatherConditions[Math.floor(Math.random() * weatherConditions.length)];
    
    const orders = [];
    const batch = adminDb.batch();
    
    for (const doc of medSnap.docs) {
      const med = doc.data() as Medicine;
      
      // AI Logic: Calculate 30-day predicted demand
      let baseDemand = 100; 
      let multiplier = 1.0;
      
      if (currentWeather === "monsoon" && (med.category === "antibiotic" || med.genericName.toLowerCase().includes("paracetamol"))) {
        multiplier = 1.5; 
      } else if (currentWeather === "winter_chill" && med.category === "cold_chain") {
        multiplier = 1.3;
      }
      
      const predictedDemand = Math.round(baseDemand * multiplier);
      
      // Condition: Stock is less than 30-day demand
      if (med.totalQuantity < predictedDemand) {
        const orderQuantity = predictedDemand - med.totalQuantity + 50; // Buffer
        
        const alertRef = adminDb.collection('alerts').doc();
        const alert = {
          id: alertRef.id,
          type: "auto_order",
          severity: "info",
          title: `AI Reorder: ${med.name} (${currentWeather.replace('_', ' ').toUpperCase()})`,
          message: `Weather impact detected. Predicted 30-day demand: ${predictedDemand} units. Current stock: ${med.totalQuantity}. Automated Request: ${orderQuantity} units.`,
          status: "active",
          smsSent: false,
          emailSent: true,
          hospitalId: hospitalId,
          createdAt: new Date().toISOString()
        };
        
        batch.set(alertRef, alert);
        orders.push(alert);
      }
    }
    
    // Also delete old auto_order alerts to prevent spam in demo
    const oldAlerts = await adminDb.collection('alerts').where('hospitalId', '==', hospitalId).where('type', '==', 'auto_order').get();
    for (const doc of oldAlerts.docs) {
       batch.delete(doc.ref);
    }

    await batch.commit();
    
    return NextResponse.json({ success: true, ordersGenerated: orders.length, weather: currentWeather, orders });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
