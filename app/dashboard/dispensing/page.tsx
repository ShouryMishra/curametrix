"use client";
import { useState } from "react";
import { FileText, Clock, TrendingUp, X, Plus, Search } from "lucide-react";
import { mockDispensingLogs } from "@/lib/mockData";
import { formatDate } from "@/lib/utils";

function NewDispenseDrawer({ onClose }: { onClose: () => void }) {
  const [formData, setFormData] = useState({
    medicineName: "", batchNumber: "", quantity: 1, patientName: "", doctorName: "", notes: ""
  });

  const handleSave = () => {
    if (!formData.medicineName || !formData.quantity) return alert("Medicine name and quantity are required.");
    onClose();
    alert(`Dispense logged: ${formData.quantity}x ${formData.medicineName} to ${formData.patientName || "Walk-in"}. This will save permanently once Firebase is connected.`);
  };

  return (
    <>
      <div className="modal-backdrop" onClick={onClose} />
      <div className="drawer" style={{ display: "flex", flexDirection: "column", width: "100%", maxWidth: 450 }}>
        <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: 17, fontWeight: 700 }}>New Dispense Log</div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)" }}><X size={20} /></button>
        </div>
        
        <div style={{ padding: 24, flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: "var(--text-muted)", marginBottom: 4, display: "block" }}>Medicine</label>
            <input className="input" placeholder="Search or scan medicine..." value={formData.medicineName} onChange={e => setFormData({ ...formData, medicineName: e.target.value })} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: "var(--text-muted)", marginBottom: 4, display: "block" }}>Batch Number</label>
              <input className="input" placeholder="e.g. B-2024-01" value={formData.batchNumber} onChange={e => setFormData({ ...formData, batchNumber: e.target.value })} />
            </div>
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: "var(--text-muted)", marginBottom: 4, display: "block" }}>Quantity</label>
              <input type="number" min="1" className="input" value={formData.quantity} onChange={e => setFormData({ ...formData, quantity: Number(e.target.value) })} />
            </div>
          </div>
          <div style={{ height: 1, background: "var(--border)", margin: "8px 0" }} />
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: "var(--text-muted)", marginBottom: 4, display: "block" }}>Patient Name</label>
            <input className="input" placeholder="e.g. Rahul Kumar (Leave blank for Walk-in)" value={formData.patientName} onChange={e => setFormData({ ...formData, patientName: e.target.value })} />
          </div>
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: "var(--text-muted)", marginBottom: 4, display: "block" }}>Prescribing Doctor (Optional)</label>
            <input className="input" placeholder="Dr. Name" value={formData.doctorName} onChange={e => setFormData({ ...formData, doctorName: e.target.value })} />
          </div>
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: "var(--text-muted)", marginBottom: 4, display: "block" }}>Additional Notes</label>
            <textarea className="input" placeholder="Any special instructions..." rows={3} value={formData.notes} onChange={e => setFormData({ ...formData, notes: e.target.value })} />
          </div>

          <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
            <button className="btn-primary" onClick={handleSave} style={{ flex: 1, justifyContent: "center" }}>Confirm Dispense</button>
            <button className="btn-secondary" onClick={onClose} style={{ flex: 1, justifyContent: "center" }}>Cancel</button>
          </div>
        </div>
      </div>
    </>
  );
}

export default function DispensingPage() {
  const [showAdd, setShowAdd] = useState(false);
  const [search, setSearch] = useState("");

  const filteredLogs = mockDispensingLogs.filter(log => 
    log.medicineName.toLowerCase().includes(search.toLowerCase()) || 
    (log.patientName?.toLowerCase().includes(search.toLowerCase()) ?? false) ||
    log.batchNumber.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", gap: 12 }}>
        {[
          { label: "Total Transactions Today", value: "47", color: "#1E3A8A", bg: "#EFF6FF" },
          { label: "Units Dispensed", value: "312", color: "#10B981", bg: "#F0FDF4" },
          { label: "Value Dispensed", value: "₹84,200", color: "#0EA5E9", bg: "#F0F9FF" },
        ].map(s => (
          <div key={s.label} style={{ flex: 1, background: s.bg, borderRadius: 10, padding: "14px 18px", border: `1px solid ${s.color}20` }}>
            <div style={{ fontSize: 26, fontWeight: 800, fontFamily: "JetBrains Mono, monospace", color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 500, marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: 10, alignItems: "center", justifyContent: "space-between", background: "white", padding: "14px 16px", borderRadius: 12, border: "1px solid var(--border)" }}>
        <div style={{ position: "relative", width: 300 }}>
          <Search size={14} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
          <input className="input" placeholder="Search logs by medicine, patient or batch..." 
                 value={search} onChange={e => setSearch(e.target.value)} 
                 style={{ paddingLeft: 36, fontSize: 13 }} />
        </div>
        <button className="btn-primary" onClick={() => setShowAdd(true)} style={{ fontSize: 13 }}><Plus size={14} /> New Dispense Log</button>
      </div>

      <div className="table-container">
        <table>
          <thead><tr><th>Medicine</th><th>Patient</th><th>Dispensed By</th><th>Batch</th><th>Qty</th><th>Time</th></tr></thead>
          <tbody>
            {filteredLogs.map(log => (
              <tr key={log.id}>
                <td><div style={{ fontWeight: 600 }}>{log.medicineName}</div></td>
                <td>{log.patientName}</td>
                <td>{log.dispensedByName}</td>
                <td style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 12 }}>{log.batchNumber}</td>
                <td style={{ fontWeight: 700 }}>{log.quantity}</td>
                <td style={{ fontSize: 12, color: "var(--text-muted)" }}>{new Date(log.dispensedAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {showAdd && <NewDispenseDrawer onClose={() => setShowAdd(false)} />}
    </div>
  );
}
