import { NextRequest, NextResponse } from "next/server";
import { createMedicine } from "@/lib/services/medicineService";
import { Medicine } from "@/types";

export async function POST(req: NextRequest) {
  try {
    const medicines: Partial<Medicine>[] = await req.json();
    
    if (!Array.isArray(medicines)) {
      return NextResponse.json({ error: "Invalid data format. Expected an array." }, { status: 400 });
    }

    const results = [];
    for (const med of medicines) {
      if (med.name) {
        const result = await createMedicine(med as Omit<Medicine, "id" | "createdAt" | "updatedAt">);
        results.push(result.id);
      }
    }

    return NextResponse.json({ 
      success: true, 
      count: results.length,
      message: `Successfully uploaded ${results.length} medicines.` 
    });
  } catch (error: any) {
    console.error("Bulk upload error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
