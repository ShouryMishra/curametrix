"use client";

import { useState } from "react";
import { Truck, Package, FileText, ArrowLeftRight, Plus, CheckCircle2, Clock, XCircle, X } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

const suppliers = [
  { id: "s1", name: "MedLine Pharma Pvt Ltd", contact: "Rajesh Kumar", phone: "+91 98765 43210", email: "rajesh@medline.com", city: "Mumbai", rating: 4.8, isActive: true, lastOrder: "Mar 18, 2026" },
  { id: "s2", name: "HealthFirst Distributors", contact: "Anita Singh", phone: "+91 87654 32109", email: "anita@healthfirst.com", city: "Delhi", rating: 4.5, isActive: true, lastOrder: "Mar 15, 2026" },
  { id: "s3", name: "CureWell Supplies", contact: "Mohan Rao", phone: "+91 76543 21098", email: "mohan@curewell.com", city: "Hyderabad", rating: 3.8, isActive: true, lastOrder: "Mar 10, 2026" },
];

const purchaseOrders = [
  { id: "po1", number: "PO-2026-089", supplier: "MedLine Pharma", items: 3, amount: 248500, status: "pending", created: "Mar 20, 2026", auto: true },
  { id: "po2", number: "PO-2026-088", supplier: "HealthFirst Distributors", items: 5, amount: 184200, status: "approved", created: "Mar 18, 2026", auto: false },
  { id: "po3", number: "PO-2026-087", supplier: "CureWell Supplies", items: 2, amount: 62400, status: "received", created: "Mar 15, 2026", auto: false },
  { id: "po4", number: "PO-2026-086", supplier: "MedLine Pharma", items: 7, amount: 412000, status: "sent", created: "Mar 12, 2026", auto: true },
];

const transfers = [
  { id: "t1", from: "City General Hospital", to: "District Hospital B", medicine: "Insulin Glargine", qty: 100, status: "suggested", isAI: true, reason: "200 units expiring in 7 days vs shortage at District B" },
  { id: "t2", from: "City General Hospital", to: "Community Health Center A", medicine: "Amoxicillin 500mg", qty: 200, status: "approved", isAI: false, reason: "Manual transfer request" },
];

const poStatusConfig: Record<string, { color: string; bg: string; icon: React.ElementType }> = {
  pending:  { color: "#D97706", bg: "#FEF3C7", icon: Clock },
  approved: { color: "#2563EB", bg: "#DBEAFE", icon: CheckCircle2 },
  sent:     { color: "#7C3AED", bg: "#F5F3FF", icon: Truck },
  received: { color: "#15803D", bg: "#DCFCE7", icon: CheckCircle2 },
  cancelled:{ color: "#DC2626", bg: "#FEE2E2", icon: XCircle },
};

const tabs = ["Suppliers", "Purchase Orders", "Inter-Hospital Transfers", "Returns & Disposal"];

function AddSupplierDrawer({ onClose }: { onClose: () => void }) {
  const [formData, setFormData] = useState({
    name: "", contact: "", phone: "", email: "", city: "", notes: ""
  });

  const handleSave = () => {
    if (!formData.name || !formData.phone) return alert("Supplier Name and Phone are required.");
    onClose();
    alert(`Supplier "${formData.name}" added successfully. This will permanently save once Firebase is connected.`);
  };

  return (
    <>
      <div className="modal-backdrop" onClick={onClose} />
      <div className="drawer" style={{ display: "flex", flexDirection: "column", width: "100%", maxWidth: 450 }}>
        <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: 17, fontWeight: 700 }}>Add New Supplier</div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)" }}><X size={20} /></button>
        </div>
        
        <div style={{ padding: 24, flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: "var(--text-muted)", marginBottom: 4, display: "block" }}>Supplier/Company Name *</label>
            <input className="input" placeholder="e.g. MedLine Pharma Pvt Ltd" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
          </div>
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: "var(--text-muted)", marginBottom: 4, display: "block" }}>Contact Person</label>
            <input className="input" placeholder="e.g. Rajesh Kumar" value={formData.contact} onChange={e => setFormData({ ...formData, contact: e.target.value })} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: "var(--text-muted)", marginBottom: 4, display: "block" }}>Phone Number *</label>
              <input className="input" placeholder="+91..." value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
            </div>
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: "var(--text-muted)", marginBottom: 4, display: "block" }}>Email</label>
              <input type="email" className="input" placeholder="@" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
            </div>
          </div>
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: "var(--text-muted)", marginBottom: 4, display: "block" }}>City/Region</label>
            <input className="input" placeholder="e.g. Mumbai" value={formData.city} onChange={e => setFormData({ ...formData, city: e.target.value })} />
          </div>
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: "var(--text-muted)", marginBottom: 4, display: "block" }}>Notes/Address</label>
            <textarea className="input" placeholder="Office address, terms of service..." rows={3} value={formData.notes} onChange={e => setFormData({ ...formData, notes: e.target.value })} />
          </div>

          <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
            <button className="btn-primary" onClick={handleSave} style={{ flex: 1, justifyContent: "center" }}>Save Supplier</button>
            <button className="btn-secondary" onClick={onClose} style={{ flex: 1, justifyContent: "center" }}>Cancel</button>
          </div>
        </div>
      </div>
    </>
  );
}

function ActionDrawer({ title, type, onClose }: { title: string, type: string, onClose: () => void }) {
  return (
    <>
      <div className="modal-backdrop" onClick={onClose} />
      <div className="drawer" style={{ display: "flex", flexDirection: "column", width: "100%", maxWidth: 450 }}>
        <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: 17, fontWeight: 700 }}>{title}</div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)" }}><X size={20} /></button>
        </div>
        <div style={{ padding: 24, flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ padding: "12px 14px", background: "#EFF6FF", borderRadius: 8, border: "1px solid #BFDBFE", fontSize: 13, color: "#1D4ED8" }}>
            This {type} will be fully auto-populated with AI recommendations and inventory data when Firebase is connected.
          </div>
          {type === "Purchase Order" && (
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: "var(--text-muted)", marginBottom: 4, display: "block" }}>Select Supplier</label>
              <select className="select" style={{ fontSize: 13 }}>
                {suppliers.map(s => <option key={s.id}>{s.name}</option>)}
              </select>
            </div>
          )}
          {type === "Inter-Hospital Transfer" && (
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: "var(--text-muted)", marginBottom: 4, display: "block" }}>Destination Hospital</label>
              <select className="select" style={{ fontSize: 13 }}>
                <option>District Hospital B (High Demand)</option>
                <option>Community Health Center A</option>
              </select>
            </div>
          )}
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: "var(--text-muted)", marginBottom: 4, display: "block" }}>Select Medicine / Item</label>
            <input className="input" placeholder="Search inventory..." />
          </div>
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: "var(--text-muted)", marginBottom: 4, display: "block" }}>Quantity</label>
            <input className="input" type="number" placeholder="0" />
          </div>
          {type === "Return" && (
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: "var(--text-muted)", marginBottom: 4, display: "block" }}>Reason for Return/Disposal</label>
              <select className="select" style={{ fontSize: 13 }}>
                <option>Expired Stock</option>
                <option>Damaged in Transit</option>
                <option>Recalled Batch</option>
              </select>
            </div>
          )}
          <div style={{ display: "flex", gap: 10, marginTop: "auto" }}>
            <button className="btn-primary" onClick={() => { alert(title + " Submitted."); onClose(); }} style={{ flex: 1, justifyContent: "center" }}>Confirm {title}</button>
            <button className="btn-secondary" onClick={onClose} style={{ flex: 1, justifyContent: "center" }}>Cancel</button>
          </div>
        </div>
      </div>
    </>
  );
}

export default function SupplyChainPage() {
  const [activeTab, setActiveTab] = useState("Suppliers");
  const [showAddSupplier, setShowAddSupplier] = useState(false);
  const [actionDrawer, setActionDrawer] = useState<{title: string, type: string} | null>(null);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ background: "white", borderRadius: 12, border: "1px solid var(--border)", overflow: "hidden" }}>
        <div style={{ display: "flex", borderBottom: "1px solid var(--border)", padding: "0 16px" }}>
          {tabs.map(t => (
            <button key={t} onClick={() => setActiveTab(t)} style={{
              padding: "12px 18px", border: "none", background: "none", cursor: "pointer",
              fontSize: 13, fontWeight: 600, whiteSpace: "nowrap",
              color: activeTab === t ? "var(--accent)" : "var(--text-muted)",
              borderBottom: activeTab === t ? "2px solid var(--accent)" : "2px solid transparent",
              transition: "all 0.15s",
            }}>{t}</button>
          ))}
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", padding: "0 0 0 12px" }}>
            <button className="btn-primary" style={{ fontSize: 13 }} onClick={() => {
              if (activeTab === "Suppliers") setShowAddSupplier(true);
              else if (activeTab === "Purchase Orders") setActionDrawer({ title: "Draft new Purchase Order", type: "Purchase Order" });
              else if (activeTab === "Inter-Hospital Transfers") setActionDrawer({ title: "Initiate Transfer", type: "Inter-Hospital Transfer" });
              else if (activeTab === "Returns & Disposal") setActionDrawer({ title: "Log Return", type: "Return" });
            }}>
              <Plus size={14} /> {activeTab === "Suppliers" ? "Add Supplier" : activeTab === "Purchase Orders" ? "New PO" : activeTab === "Inter-Hospital Transfers" ? "New Transfer" : "New Return"}
            </button>
          </div>
        </div>

        <div style={{ padding: 20 }}>
          {activeTab === "Suppliers" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {suppliers.map(s => (
                <div key={s.id} style={{ padding: "16px 18px", borderRadius: 12, border: "1px solid var(--border)", background: "var(--bg)", display: "flex", alignItems: "center", gap: 16 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 10, background: "var(--accent-light)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>🏭</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 15, fontWeight: 700 }}>{s.name}</div>
                    <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{s.contact} · {s.phone} · {s.city}</div>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 18, fontWeight: 800, color: "#F59E0B" }}>{"★".repeat(Math.round(s.rating))}</div>
                    <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{s.rating}/5</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <span className={`badge ${s.isActive ? "badge-success" : "badge-warning"}`}>{s.isActive ? "Active" : "Inactive"}</span>
                    <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4 }}>Last order: {s.lastOrder}</div>
                  </div>
                  <button onClick={() => alert(`Opening full profile for ${s.name}`)} className="btn-ghost" style={{ fontSize: 13 }}>View</button>
                </div>
              ))}
            </div>
          )}

          {activeTab === "Purchase Orders" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {/* Auto-order info */}
              <div style={{ padding: "10px 14px", background: "#F0FDF4", borderRadius: 8, border: "1px solid #BBF7D0", fontSize: 13, color: "#15803D", display: "flex", gap: 8, alignItems: "center" }}>
                🤖 <b>Smart Auto-Ordering Active</b> — POs are auto-generated when stock hits reorder levels. SMS + Email sent for approval.
              </div>
              <div className="table-container">
                <table>
                  <thead><tr><th>PO Number</th><th>Supplier</th><th>Items</th><th>Amount</th><th>Status</th><th>Type</th><th>Date</th><th></th></tr></thead>
                  <tbody>
                    {purchaseOrders.map(po => {
                      const sc = poStatusConfig[po.status];
                      return (
                        <tr key={po.id}>
                          <td style={{ fontFamily: "JetBrains Mono, monospace", fontWeight: 700 }}>{po.number}</td>
                          <td>{po.supplier}</td>
                          <td>{po.items} items</td>
                          <td style={{ fontFamily: "JetBrains Mono, monospace", fontWeight: 700 }}>{formatCurrency(po.amount)}</td>
                          <td>
                            <span style={{ fontSize: 12, fontWeight: 700, padding: "3px 10px", borderRadius: 999, background: sc.bg, color: sc.color }}>
                              {po.status.toUpperCase()}
                            </span>
                          </td>
                          <td>
                            {po.auto && <span className="badge badge-primary">🤖 Auto</span>}
                            {!po.auto && <span className="badge badge-info">Manual</span>}
                          </td>
                          <td style={{ fontSize: 12, color: "var(--text-muted)" }}>{po.created}</td>
                          <td>
                            {po.status === "pending" && <button onClick={() => alert(`PO ${po.number} for ${formatCurrency(po.amount)} approved. Supplier ${po.supplier} notified.`)} className="btn-primary" style={{ fontSize: 12, padding: "5px 10px" }}>Approve</button>}
                            {po.status !== "pending" && <button onClick={() => alert(`Opening PDF invoice view for PO ${po.number}`)} className="btn-ghost" style={{ fontSize: 12, padding: "5px 10px" }}>View</button>}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "Inter-Hospital Transfers" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ padding: "10px 14px", background: "#EFF6FF", borderRadius: 8, border: "1px solid #BFDBFE", fontSize: 13, color: "#1D4ED8" }}>
                🌐 AI monitors all hospital branches for excess stock and shortages. Transfer suggestions are auto-generated to prevent wastage and shortages simultaneously.
              </div>
              {transfers.map(t => (
                <div key={t.id} style={{
                  padding: "16px 18px", borderRadius: 12,
                  border: t.isAI ? "1px solid var(--accent)" : "1px solid var(--border)",
                  background: t.isAI ? "#F0FDF4" : "var(--bg)",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                    <div style={{ fontWeight: 700, fontSize: 15 }}>{t.medicine}</div>
                    {t.isAI && <span className="badge badge-success">🤖 AI Suggested</span>}
                    <span className={`badge ${t.status === "approved" ? "badge-success" : "badge-warning"}`}>{t.status}</span>
                    <span style={{ marginLeft: "auto", fontFamily: "JetBrains Mono, monospace", fontWeight: 700 }}>{t.qty} units</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 14 }}>
                    <span style={{ fontWeight: 600 }}>{t.from}</span>
                    <ArrowLeftRight size={16} color="var(--accent)" />
                    <span style={{ fontWeight: 600 }}>{t.to}</span>
                  </div>
                  <div style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 6 }}>{t.reason}</div>
                  {t.status === "suggested" && (
                    <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                      <button onClick={() => alert(`Transfer Approved: ${t.qty} units of ${t.medicine} will go to ${t.to}.`)} className="btn-primary" style={{ fontSize: 13 }}>Approve Transfer</button>
                      <button onClick={() => alert('Transfer Rejected.')} className="btn-ghost" style={{ fontSize: 13 }}>Reject</button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {activeTab === "Returns & Disposal" && (
            <div style={{ textAlign: "center", padding: 60, color: "var(--text-muted)" }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>📦</div>
              <div style={{ fontSize: 16, fontWeight: 600 }}>Returns & Disposal Tracking</div>
              <div style={{ fontSize: 13, marginTop: 6 }}>Log expired, damaged or recalled stock returns to suppliers</div>
              <button onClick={() => setActionDrawer({ title: "Log Return", type: "Return" })} className="btn-primary" style={{ marginTop: 20 }}><Plus size={14} /> Log Return</button>
            </div>
          )}
        </div>
      </div>

      {showAddSupplier && <AddSupplierDrawer onClose={() => setShowAddSupplier(false)} />}
      {actionDrawer && <ActionDrawer title={actionDrawer.title} type={actionDrawer.type} onClose={() => setActionDrawer(null)} />}
    </div>
  );
}
