"use client";

import { useState } from "react";
import { ShieldAlert, Eye, AlertTriangle, TrendingDown, Search, Filter, X } from "lucide-react";

const anomalies = [
  { id: "f1", type: "Stock Disappearance", medicine: "Morphine Sulfate", detail: "10 units removed without billing record", time: "Today, 2:15 PM", user: "Unknown", severity: "critical", status: "investigating" },
  { id: "f2", type: "Unusual Dispensing", medicine: "Tramadol 100mg", detail: "50 units dispensed in a single transaction — 5× normal pattern", time: "Today, 11:42 AM", user: "Pharmacist Ravi", severity: "high", status: "flagged" },
  { id: "f3", type: "Repeated Entry", medicine: "Insulin Glargine", detail: "Same batch B-2024-01 added twice within 10 minutes by different users", time: "Yesterday, 4:30 PM", user: "Admin Priya", severity: "medium", status: "resolved" },
  { id: "f4", type: "Price Anomaly", medicine: "Amoxicillin 500mg", detail: "Dispensing price ₹22 exceeds MRP ₹15 — possible billing error", time: "Yesterday, 2:10 PM", user: "Pharmacist Amit", severity: "medium", status: "resolved" },
  { id: "f5", type: "Fake Entry Detected", medicine: "Paracetamol 650mg", detail: "GRN entered without corresponding purchase order. Supplier not in system.", time: "2 days ago", user: "Store Manager", severity: "high", status: "flagged" },
];

const severityConfig: Record<string, { color: string; bg: string; border: string }> = {
  critical: { color: "#DC2626", bg: "#FEF2F2", border: "#FECACA" },
  high:     { color: "#D97706", bg: "#FFFBEB", border: "#FCD34D" },
  medium:   { color: "#2563EB", bg: "#EFF6FF", border: "#BFDBFE" },
};

const typeIcon: Record<string, string> = {
  "Stock Disappearance": "🕵️",
  "Unusual Dispensing": "📊",
  "Repeated Entry": "🔁",
  "Price Anomaly": "💸",
  "Fake Entry Detected": "⚠️",
};

function InvestigateDrawer({ anomaly, onClose }: { anomaly: any, onClose: () => void }) {
  const [resolution, setResolution] = useState(anomaly.status);
  const [notes, setNotes] = useState("");

  const handleSave = () => {
    onClose();
    alert(`Fraud Investigation Updated for ${anomaly.medicine}\n\nStatus set to: ${resolution.toUpperCase()}\n\nThis update will reflect globally once Firebase is connected.`);
  };

  return (
    <>
      <div className="modal-backdrop" onClick={onClose} />
      <div className="drawer" style={{ display: "flex", flexDirection: "column", width: "100%", maxWidth: 450 }}>
        <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: 17, fontWeight: 700 }}>Investigate Anomaly</div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)" }}><X size={20} /></button>
        </div>
        
        <div style={{ padding: 24, flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ padding: 16, background: "var(--bg)", borderRadius: 12, border: "1px solid var(--border)" }}>
            <div style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase", marginBottom: 8 }}>Incident Details</div>
            <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>{anomaly.type}</div>
            <div style={{ fontSize: 13, marginBottom: 8 }}>{anomaly.detail}</div>
            <div style={{ fontSize: 12, color: "var(--text-muted)", display: "flex", flexDirection: "column", gap: 4 }}>
              <span><b>Medicine:</b> {anomaly.medicine}</span>
              <span><b>User/System:</b> {anomaly.user}</span>
              <span><b>Detected:</b> {anomaly.time}</span>
            </div>
          </div>

          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: "var(--text-muted)", marginBottom: 4, display: "block" }}>Update Status</label>
            <div style={{ display: "flex", gap: 8 }}>
              {["flagged", "investigating", "resolved"].map(s => (
                <button 
                  key={s} onClick={() => setResolution(s)} 
                  style={{
                    flex: 1, padding: "8px 0", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer", textTransform: "capitalize",
                    border: resolution === s ? "2px solid var(--accent)" : "1px solid var(--border)",
                    background: resolution === s ? "var(--accent-light)" : "white",
                    color: resolution === s ? "var(--accent)" : "var(--text)",
                    transition: "all 0.15s"
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: "var(--text-muted)", marginBottom: 4, display: "block" }}>Investigation Notes</label>
            <textarea className="input" placeholder="Document your findings, actions taken, or reasons for resolution..." rows={6} value={notes} onChange={e => setNotes(e.target.value)} />
          </div>

          <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
            <button className="btn-primary" onClick={handleSave} style={{ flex: 1, justifyContent: "center" }}>Save Investigation</button>
            <button className="btn-secondary" onClick={onClose} style={{ flex: 1, justifyContent: "center" }}>Cancel</button>
          </div>
        </div>
      </div>
    </>
  );
}

export default function FraudPage() {
  const [status, setStatus] = useState("all");
  const [selectedAnomaly, setSelectedAnomaly] = useState<any>(null);

  const filtered = anomalies.filter(a => status === "all" || a.status === status);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Stats */}
      <div style={{ display: "flex", gap: 12 }}>
        {[
          { label: "Total Anomalies", value: anomalies.length, color: "#1E3A8A", bg: "#EFF6FF" },
          { label: "Critical", value: anomalies.filter(a => a.severity === "critical").length, color: "#DC2626", bg: "#FEF2F2" },
          { label: "Under Investigation", value: anomalies.filter(a => a.status === "investigating").length, color: "#D97706", bg: "#FFFBEB" },
          { label: "Resolved", value: anomalies.filter(a => a.status === "resolved").length, color: "#15803D", bg: "#F0FDF4" },
        ].map(s => (
          <div key={s.label} style={{ flex: 1, background: s.bg, borderRadius: 10, padding: "14px 18px", border: `1px solid ${s.color}20` }}>
            <div style={{ fontSize: 26, fontWeight: 800, fontFamily: "JetBrains Mono, monospace", color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 500, marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* How it works */}
      <div style={{ background: "linear-gradient(135deg, #FFF7ED, #FEF3C7)", borderRadius: 12, padding: "14px 18px", border: "1px solid #FCD34D", display: "flex", gap: 16, alignItems: "center" }}>
        <div style={{ fontSize: 28 }}>🔍</div>
        <div>
          <div style={{ fontWeight: 700, fontSize: 14 }}>How Fraud Detection Works</div>
          <div style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 2 }}>
            Rule-based engine + ML anomaly scoring monitors: stock removals without billing, quantities 3× above daily average, price &gt; MRP, duplicate GRN entries, and unrecognized supplier records.
          </div>
        </div>
      </div>

      {/* Filter + Table */}
      <div style={{ background: "white", borderRadius: 12, border: "1px solid var(--border)", overflow: "hidden" }}>
        <div style={{ display: "flex", gap: 8, padding: "12px 16px", borderBottom: "1px solid var(--border)", alignItems: "center" }}>
          <span style={{ fontSize: 14, fontWeight: 700 }}>Suspicious Activity Log</span>
          <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
            {["all", "flagged", "investigating", "resolved"].map(s => (
              <button key={s} onClick={() => setStatus(s)} style={{
                padding: "5px 12px", border: `1px solid ${status === s ? "var(--accent)" : "var(--border)"}`,
                borderRadius: 6, background: status === s ? "var(--accent-light)" : "white",
                color: status === s ? "var(--accent)" : "var(--text-muted)",
                fontSize: 12, fontWeight: 600, cursor: "pointer", textTransform: "capitalize",
              }}>{s}</button>
            ))}
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {filtered.map(a => {
            const cfg = severityConfig[a.severity];
            return (
              <div key={a.id} style={{
                display: "flex", gap: 14, padding: "14px 18px",
                borderBottom: "1px solid #F8FAFC",
                borderLeft: `4px solid ${cfg.color}`,
                background: a.status === "resolved" ? "#FAFAFA" : "white",
                opacity: a.status === "resolved" ? 0.7 : 1,
                transition: "background 0.15s",
              }}
                onMouseEnter={e => (e.currentTarget.style.background = "#F8FFF8")}
                onMouseLeave={e => (e.currentTarget.style.background = a.status === "resolved" ? "#FAFAFA" : "white")}
              >
                <div style={{ fontSize: 24, alignSelf: "flex-start", marginTop: 2 }}>{typeIcon[a.type]}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 14, fontWeight: 700 }}>{a.type}</span>
                    <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 999, background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }}>
                      {a.severity.toUpperCase()}
                    </span>
                    <span style={{
                      fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 999,
                      background: a.status === "resolved" ? "#DCFCE7" : a.status === "investigating" ? "#FEF3C7" : "#FEE2E2",
                      color: a.status === "resolved" ? "#15803D" : a.status === "investigating" ? "#B45309" : "#B91C1C",
                    }}>{a.status.toUpperCase()}</span>
                  </div>
                  <div style={{ fontSize: 13, color: "var(--text)", marginBottom: 4 }}>
                    <b>{a.medicine}</b> — {a.detail}
                  </div>
                  <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
                    {a.time} · By: {a.user}
                  </div>
                </div>
                <div style={{ display: "flex", gap: 6, alignSelf: "center" }}>
                  <button className="btn-ghost" onClick={() => setSelectedAnomaly(a)} style={{ fontSize: 12, padding: "5px 10px" }}><Eye size={13} /> Investigate</button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {selectedAnomaly && <InvestigateDrawer anomaly={selectedAnomaly} onClose={() => setSelectedAnomaly(null)} />}
    </div>
  );
}
