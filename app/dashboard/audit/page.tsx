"use client";

import { useState } from "react";
import { Search, Plus, X } from "lucide-react";

const auditLogs = [
  { id: "a1", action: "Medicine Added", detail: "Added Paracetamol 650mg (500 strips)", user: "Admin Priya", time: "Today, 3:14 PM", type: "create" },
  { id: "a2", action: "Stock Dispensed", detail: "10 units Insulin Glargine to Patient Kumar", user: "Pharmacist Sunita", time: "Today, 2:45 PM", type: "dispense" },
  { id: "a3", action: "PO Approved", detail: "Purchase Order PO-2026-089 approved (₹2.48L)", user: "Store Manager Amit", time: "Today, 1:30 PM", type: "approve" },
  { id: "a4", action: "Alert Acknowledged", detail: "Acknowledged: Insulin Glargine Expiry Alert", user: "Admin Priya", time: "Today, 12:15 PM", type: "acknowledge" },
  { id: "a5", action: "User Login", detail: "Login from IP 192.168.1.45", user: "Pharmacist Ravi", time: "Today, 11:00 AM", type: "auth" },
  { id: "a6", action: "Batch Received", detail: "GRN-2026-042: 200 vials Insulin Glargine received", user: "Store Manager Amit", time: "Yesterday, 4:20 PM", type: "receive" },
  { id: "a7", action: "⚠️ Fraud Flagged", detail: "Suspicious: 10 units Morphine removed without billing", user: "System", time: "Yesterday, 2:15 PM", type: "fraud" },
];

const typeColors: Record<string, string> = {
  create: "#10B981", dispense: "#0EA5E9", approve: "#1E3A8A",
  acknowledge: "#F59E0B", auth: "#64748B", receive: "#8B5CF6", fraud: "#EF4444",
};

const typeIcons: Record<string, string> = {
  create: "➕", dispense: "💊", approve: "✅", acknowledge: "🔔", auth: "🔐", receive: "📦", fraud: "🚨",
};

function NewAuditLogDrawer({ onClose }: { onClose: () => void }) {
  const [formData, setFormData] = useState({ type: "create", action: "", detail: "" });

  const handleSave = () => {
    if (!formData.action || !formData.detail) return alert("Action and Detail are required.");
    onClose();
    alert(`Mock Audit Log Added: ${formData.action}. This will save permanently when Firebase is connected.`);
  };

  return (
    <>
      <div className="modal-backdrop" onClick={onClose} />
      <div className="drawer" style={{ display: "flex", flexDirection: "column", width: "100%", maxWidth: 450 }}>
        <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: 17, fontWeight: 700 }}>Add Manual Audit Log</div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)" }}><X size={20} /></button>
        </div>
        
        <div style={{ padding: 24, flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ padding: "12px 14px", background: "#FEF2F2", borderRadius: 8, border: "1px solid #FECACA", fontSize: 12, color: "#DC2626" }}>
            ⚠️ <b>Note:</b> In a real production environment, Audit Trails are immutable and auto-generated. Manual logs are permitted here for demonstration and override testing.
          </div>

          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: "var(--text-muted)", marginBottom: 4, display: "block" }}>Log Category</label>
            <select className="select" value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })} style={{ fontSize: 13 }}>
              {Object.keys(typeColors).map(t => (
                <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
              ))}
            </select>
          </div>
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: "var(--text-muted)", marginBottom: 4, display: "block" }}>Action Title</label>
            <input className="input" placeholder="e.g. Manual Stock Adjustment" value={formData.action} onChange={e => setFormData({ ...formData, action: e.target.value })} />
          </div>
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: "var(--text-muted)", marginBottom: 4, display: "block" }}>Details & Reason</label>
            <textarea className="input" placeholder="e.g. Adjusted inventory count after physical audit..." rows={4} value={formData.detail} onChange={e => setFormData({ ...formData, detail: e.target.value })} />
          </div>

          <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
            <button className="btn-primary" onClick={handleSave} style={{ flex: 1, justifyContent: "center" }}>Save Log</button>
            <button className="btn-secondary" onClick={onClose} style={{ flex: 1, justifyContent: "center" }}>Cancel</button>
          </div>
        </div>
      </div>
    </>
  );
}

export default function AuditPage() {
  const [showAdd, setShowAdd] = useState(false);
  const [search, setSearch] = useState("");

  const filteredLogs = auditLogs.filter(log => 
    log.action.toLowerCase().includes(search.toLowerCase()) || 
    log.detail.toLowerCase().includes(search.toLowerCase()) ||
    log.user.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", gap: 12 }}>
        {[
          { label: "Actions Today", value: "47", color: "#1E3A8A", bg: "#EFF6FF" },
          { label: "Unique Users Active", value: "5", color: "#10B981", bg: "#F0FDF4" },
          { label: "Suspicious Actions", value: "1", color: "#DC2626", bg: "#FEF2F2" },
        ].map(s => (
          <div key={s.label} style={{ flex: 1, background: s.bg, borderRadius: 10, padding: "14px 18px", border: `1px solid ${s.color}20` }}>
            <div style={{ fontSize: 26, fontWeight: 800, fontFamily: "JetBrains Mono, monospace", color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 500, marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: 10, alignItems: "center", justifyContent: "space-between", background: "white", padding: "14px 16px", borderRadius: 12, border: "1px solid var(--border)" }}>
        <div style={{ position: "relative", width: 340 }}>
          <Search size={14} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
          <input className="input" placeholder="Search logs by action, user, or details..." 
                 value={search} onChange={e => setSearch(e.target.value)} 
                 style={{ paddingLeft: 36, fontSize: 13 }} />
        </div>
        <button className="btn-primary" onClick={() => setShowAdd(true)} style={{ fontSize: 13 }}><Plus size={14} /> Add Manual Log</button>
      </div>

      <div className="table-container">
        <table>
          <thead><tr><th>Action</th><th>Details</th><th>User</th><th>Time</th></tr></thead>
          <tbody>
            {filteredLogs.map(log => (
              <tr key={log.id}>
                <td>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 16 }}>{typeIcons[log.type]}</span>
                    <span style={{ fontWeight: 700, fontSize: 13, color: typeColors[log.type] }}>{log.action}</span>
                  </div>
                </td>
                <td style={{ fontSize: 13, color: "var(--text-muted)" }}>{log.detail}</td>
                <td style={{ fontWeight: 600, fontSize: 13 }}>{log.user}</td>
                <td style={{ fontSize: 12, color: "var(--text-muted)", fontFamily: "JetBrains Mono, monospace" }}>{log.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showAdd && <NewAuditLogDrawer onClose={() => setShowAdd(false)} />}
    </div>
  );
}
