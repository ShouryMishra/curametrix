"use client";

import { useState } from "react";
import { Search, Plus, Filter, Upload, ScanLine, X, ChevronRight, AlertTriangle, Thermometer, Package, Edit, Trash2 } from "lucide-react";
import { mockMedicines } from "@/lib/mockData";
import { getHazardWarning } from "@/lib/utils";
import type { Medicine } from "@/types";

const categoryColors: Record<string, string> = {
  antibiotic: "#0EA5E9", antidiabetic: "#10B981", cardiovascular: "#1E3A8A",
  analgesic: "#F59E0B", hormonal: "#8B5CF6", oncology: "#EF4444",
  vaccine: "#22C55E", cold_chain: "#06B6D4", controlled: "#DC2626",
  general: "#64748B", other: "#94A3B8",
};

function HazardBadge({ level, type, warning }: { level: string; type: string; warning?: string }) {
  if (level === "safe") return <span className="badge badge-hazard-safe">🟢 Safe</span>;
  if (level === "medium") return (
    <span className="badge badge-hazard-medium" title={warning}>🟡 Medium</span>
  );
  return (
    <span className="badge badge-hazard-high" title={warning}>🔴 High Risk</span>
  );
}

function StockBar({ current, max, status }: { current: number; max: number; status: string }) {
  const pct = Math.min((current / max) * 100, 100);
  const color = status === "in_stock" ? "#10B981" : status === "low_stock" ? "#F59E0B" : "#EF4444";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div style={{ flex: 1, height: 6, background: "#F1F5F9", borderRadius: 3, overflow: "hidden" }}>
        <div style={{ width: `${pct}%`, height: "100%", background: color, borderRadius: 3, transition: "width 0.3s" }} />
      </div>
      <span style={{ fontSize: 12, fontWeight: 600, color, minWidth: 30 }}>{current}</span>
    </div>
  );
}

function BatchDrawer({ medicine, onClose }: { medicine: Medicine; onClose: () => void }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ ...medicine });
  const warning = getHazardWarning(medicine.hazardType);

  const handleSave = () => {
    // Fake save to simulate UI before Firebase integration
    setIsEditing(false);
    alert("Saved (Mock): Changes will be permanently saved once Firebase is connected.");
  };

  return (
    <>
      <div className="modal-backdrop" onClick={onClose} />
      <div className="drawer" style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 17, fontWeight: 700 }}>{isEditing ? "Edit Medicine Details" : formData.name}</div>
            {!isEditing && <div style={{ fontSize: 13, color: "var(--text-muted)" }}>{formData.brand} · {formData.formulation} · {formData.strength}</div>}
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)" }}><X size={20} /></button>
        </div>

        <div style={{ padding: 24, flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 16 }}>
          {isEditing ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", marginBottom: 4, display: "block" }}>Medicine Name</label>
                <input className="input" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", marginBottom: 4, display: "block" }}>Brand / Manufacturer</label>
                <input className="input" value={formData.brand} onChange={e => setFormData({ ...formData, brand: e.target.value })} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", marginBottom: 4, display: "block" }}>Total Qty</label>
                  <input type="number" className="input" value={formData.totalQuantity} onChange={e => setFormData({ ...formData, totalQuantity: Number(e.target.value) })} />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", marginBottom: 4, display: "block" }}>Reorder Level</label>
                  <input type="number" className="input" value={formData.reorderLevel} onChange={e => setFormData({ ...formData, reorderLevel: Number(e.target.value) })} />
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", marginBottom: 4, display: "block" }}>Unit Price (₹)</label>
                  <input type="number" step="0.01" className="input" value={formData.unitPrice} onChange={e => setFormData({ ...formData, unitPrice: Number(e.target.value) })} />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", marginBottom: 4, display: "block" }}>MRP (₹)</label>
                  <input type="number" step="0.01" className="input" value={formData.mrp} onChange={e => setFormData({ ...formData, mrp: Number(e.target.value) })} />
                </div>
              </div>
              
              <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
                <button className="btn-primary" onClick={handleSave} style={{ flex: 1, justifyContent: "center" }}>Save Changes</button>
                <button className="btn-secondary" onClick={() => setIsEditing(false)} style={{ flex: 1, justifyContent: "center" }}>Cancel</button>
              </div>
            </div>
          ) : (
            <>
              {/* Hazard Warning */}
              {warning && (
                <div style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "12px 14px",
                  background: formData.hazardLevel === "high" ? "#FEF2F2" : "#FFFBEB",
                  border: `1px solid ${formData.hazardLevel === "high" ? "#FECACA" : "#FCD34D"}`,
                  borderRadius: 10,
                }}>
                  <AlertTriangle size={18} color={formData.hazardLevel === "high" ? "#DC2626" : "#D97706"} />
                  <span style={{ fontSize: 14, fontWeight: 600, color: formData.hazardLevel === "high" ? "#B91C1C" : "#92400E" }}>
                    {warning}
                  </span>
                </div>
              )}

              {/* Info Grid */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                {[
                  { label: "Category", value: formData.category },
                  { label: "Unit", value: formData.unit },
                  { label: "Total Stock", value: `${formData.totalQuantity} ${formData.unit}` },
                  { label: "Reorder Level", value: `${formData.reorderLevel} ${formData.unit}` },
                  { label: "Unit Price", value: `₹${formData.unitPrice}` },
                  { label: "MRP", value: `₹${formData.mrp}` },
                  { label: "Storage", value: formData.storageCondition.replace("_", " ") },
                  { label: "Critical Drug", value: formData.isCritical ? "✅ Yes" : "No" },
                ].map(({ label, value }) => (
                  <div key={label} style={{ padding: "10px 12px", background: "var(--bg)", borderRadius: 8 }}>
                    <div style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>{label}</div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text)", textTransform: "capitalize" }}>{value}</div>
                  </div>
                ))}
              </div>

              {/* Stock Level */}
              <div style={{ padding: 14, background: "var(--bg)", borderRadius: 10 }}>
                <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8 }}>Stock Level</div>
                <StockBar current={formData.totalQuantity} max={formData.maxStockLevel} status={formData.status} />
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--text-muted)", marginTop: 6 }}>
                  <span>0</span><span>Reorder: {formData.reorderLevel}</span><span>Max: {formData.maxStockLevel}</span>
                </div>
              </div>

              {/* Temperature info */}
              {formData.temperatureMin !== undefined && (
                <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", background: "#EFF6FF", borderRadius: 10, border: "1px solid #BFDBFE" }}>
                  <Thermometer size={16} color="#2563EB" />
                  <span style={{ fontSize: 13, fontWeight: 600, color: "#1D4ED8" }}>
                    Storage: {formData.temperatureMin}°C – {formData.temperatureMax}°C
                  </span>
                </div>
              )}

              {/* Action buttons */}
              <div style={{ display: "flex", gap: 10 }}>
                <button className="btn-primary" onClick={() => setIsEditing(true)} style={{ flex: 1, justifyContent: "center" }}><Edit size={14} /> Edit</button>
                <button className="btn-secondary" style={{ flex: 1, justifyContent: "center" }}><Package size={14} /> Add Stock</button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

function AddMedicineDrawer({ onClose }: { onClose: () => void }) {
  const [formData, setFormData] = useState({
    name: "", brand: "", formulation: "", strength: "", category: "general",
    totalQuantity: 0, reorderLevel: 0, unitPrice: 0, mrp: 0
  });

  const handleSave = () => {
    onClose();
    alert("Medicine added (Mock). Changes will permanently save once Firebase is connected.");
  };

  return (
    <>
      <div className="modal-backdrop" onClick={onClose} />
      <div className="drawer" style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: 17, fontWeight: 700 }}>Add New Medicine</div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)" }}><X size={20} /></button>
        </div>
        <div style={{ padding: 24, flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", marginBottom: 4, display: "block" }}>Medicine Name</label>
            <input className="input" placeholder="e.g. Paracetamol" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", marginBottom: 4, display: "block" }}>Brand / Manufacturer</label>
            <input className="input" placeholder="e.g. GSK" value={formData.brand} onChange={e => setFormData({ ...formData, brand: e.target.value })} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", marginBottom: 4, display: "block" }}>Formulation</label>
              <input className="input" placeholder="e.g. Tablet" value={formData.formulation} onChange={e => setFormData({ ...formData, formulation: e.target.value })} />
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", marginBottom: 4, display: "block" }}>Strength</label>
              <input className="input" placeholder="e.g. 500mg" value={formData.strength} onChange={e => setFormData({ ...formData, strength: e.target.value })} />
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", marginBottom: 4, display: "block" }}>Total Qty</label>
              <input type="number" className="input" value={formData.totalQuantity} onChange={e => setFormData({ ...formData, totalQuantity: Number(e.target.value) })} />
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", marginBottom: 4, display: "block" }}>Reorder Level</label>
              <input type="number" className="input" value={formData.reorderLevel} onChange={e => setFormData({ ...formData, reorderLevel: Number(e.target.value) })} />
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", marginBottom: 4, display: "block" }}>Unit Price (₹)</label>
              <input type="number" step="0.01" className="input" value={formData.unitPrice} onChange={e => setFormData({ ...formData, unitPrice: Number(e.target.value) })} />
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", marginBottom: 4, display: "block" }}>MRP (₹)</label>
              <input type="number" step="0.01" className="input" value={formData.mrp} onChange={e => setFormData({ ...formData, mrp: Number(e.target.value) })} />
            </div>
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
            <button className="btn-primary" onClick={handleSave} style={{ flex: 1, justifyContent: "center" }}>Add Medicine</button>
            <button className="btn-secondary" onClick={onClose} style={{ flex: 1, justifyContent: "center" }}>Cancel</button>
          </div>
        </div>
      </div>
    </>
  );
}

export default function InventoryPage() {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [hazardFilter, setHazardFilter] = useState("all");
  const [selected, setSelected] = useState<Medicine | null>(null);
  const [showAdd, setShowAdd] = useState(false);

  const filtered = mockMedicines.filter(m => {
    const matchSearch = m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.genericName.toLowerCase().includes(search.toLowerCase()) ||
      m.brand.toLowerCase().includes(search.toLowerCase());
    const matchCat = categoryFilter === "all" || m.category === categoryFilter;
    const matchStatus = statusFilter === "all" || m.status === statusFilter;
    const matchHazard = hazardFilter === "all" || m.hazardLevel === hazardFilter;
    return matchSearch && matchCat && matchStatus && matchHazard;
  });

  const stats = {
    total: mockMedicines.length,
    inStock: mockMedicines.filter(m => m.status === "in_stock").length,
    low: mockMedicines.filter(m => m.status === "low_stock").length,
    critical: mockMedicines.filter(m => m.status === "critical" || m.status === "out_of_stock").length,
    hazardous: mockMedicines.filter(m => m.hazardLevel === "high").length,
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

      {/* Summary Cards */}
      <div style={{ display: "flex", gap: 12 }}>
        {[
          { label: "Total Medicines", value: stats.total, color: "var(--primary)", bg: "#EFF6FF" },
          { label: "In Stock", value: stats.inStock, color: "#15803D", bg: "#F0FDF4" },
          { label: "Low Stock", value: stats.low, color: "#D97706", bg: "#FFFBEB" },
          { label: "Critical / OOS", value: stats.critical, color: "#DC2626", bg: "#FEF2F2" },
          { label: "High Hazard", value: stats.hazardous, color: "#7C3AED", bg: "#F5F3FF" },
        ].map(s => (
          <div key={s.label} style={{ flex: 1, background: s.bg, borderRadius: 10, padding: "12px 16px", border: `1px solid ${s.color}20` }}>
            <div style={{ fontSize: 24, fontWeight: 800, color: s.color, fontFamily: "JetBrains Mono, monospace" }}>{s.value}</div>
            <div style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 500, marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div style={{ background: "white", borderRadius: 12, padding: "14px 16px", border: "1px solid var(--border)", display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
        <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
          <Search size={14} style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
          <input className="input" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by name, brand, generic…" style={{ paddingLeft: 34, fontSize: 13 }} />
        </div>
        <select className="select" value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} style={{ fontSize: 13 }}>
          <option value="all">All Categories</option>
          {["antibiotic","antidiabetic","cardiovascular","analgesic","hormonal","oncology","vaccine","cold_chain","controlled","general"].map(c => (
            <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
          ))}
        </select>
        <select className="select" value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ fontSize: 13 }}>
          <option value="all">All Status</option>
          <option value="in_stock">In Stock</option>
          <option value="low_stock">Low Stock</option>
          <option value="critical">Critical</option>
          <option value="out_of_stock">Out of Stock</option>
        </select>
        <select className="select" value={hazardFilter} onChange={e => setHazardFilter(e.target.value)} style={{ fontSize: 13 }}>
          <option value="all">All Risk Levels</option>
          <option value="high">🔴 High Risk</option>
          <option value="medium">🟡 Medium Risk</option>
          <option value="safe">🟢 Safe</option>
        </select>
        <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
          <button className="btn-ghost" style={{ fontSize: 13, gap: 6 }}><ScanLine size={14} /> Scanner</button>
          <button className="btn-ghost" style={{ fontSize: 13, gap: 6 }} onClick={() => {
            const input = document.createElement("input");
            input.type = "file";
            input.accept = ".csv,.xlsx";
            input.onchange = (e) => {
              const file = (e.target as HTMLInputElement).files?.[0];
              if (file) alert(`File selected: ${file.name}. Actual CSV parsing and bulk upload will occur once Firebase is connected.`);
            };
            input.click();
          }}>
            <Upload size={14} /> Bulk Upload
          </button>
          <button className="btn-primary" onClick={() => setShowAdd(true)} style={{ fontSize: 13 }}><Plus size={14} /> Add Medicine</button>
        </div>
      </div>

      {/* Table */}
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Medicine</th>
              <th>Category</th>
              <th>Formulation</th>
              <th>Hazard</th>
              <th>Stock Level</th>
              <th>Status</th>
              <th>Price</th>
              <th>Storage</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(med => (
              <tr key={med.id} onClick={() => setSelected(med)}>
                <td>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{med.name}</div>
                  <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{med.genericName} · {med.brand}</div>
                  {med.isCritical && <span style={{ fontSize: 10, background: "#FEE2E2", color: "#DC2626", padding: "1px 6px", borderRadius: 4, fontWeight: 700, marginTop: 2, display: "inline-block" }}>CRITICAL</span>}
                </td>
                <td>
                  <span style={{
                    fontSize: 12, fontWeight: 600, padding: "3px 8px", borderRadius: 6,
                    background: `${categoryColors[med.category]}18`,
                    color: categoryColors[med.category],
                  }}>{med.category}</span>
                </td>
                <td><span style={{ color: "var(--text-muted)", fontSize: 13 }}>{med.formulation} {med.strength}</span></td>
                <td>
                  <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    <HazardBadge level={med.hazardLevel} type={med.hazardType} warning={med.hazardWarning} />
                    {med.hazardWarning && (
                      <span style={{ fontSize: 10, color: "var(--text-muted)", maxWidth: 140, lineHeight: 1.3 }}>{med.hazardWarning}</span>
                    )}
                  </div>
                </td>
                <td style={{ minWidth: 140 }}>
                  <StockBar current={med.totalQuantity} max={med.maxStockLevel} status={med.status} />
                  <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>
                    Reorder at {med.reorderLevel} {med.unit}
                  </div>
                </td>
                <td>
                  <span className={`badge ${
                    med.status === "in_stock" ? "badge-success" :
                    med.status === "low_stock" ? "badge-warning" : "badge-danger"
                  }`}>
                    {med.status.replace("_", " ")}
                  </span>
                </td>
                <td>
                  <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 13, fontWeight: 600 }}>₹{med.unitPrice}</span>
                  <div style={{ fontSize: 11, color: "var(--text-muted)" }}>MRP ₹{med.mrp}</div>
                </td>
                <td>
                  {med.storageCondition !== "room_temp" && (
                    <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12 }}>
                      <Thermometer size={13} color="#2563EB" />
                      <span style={{ color: "#2563EB", fontWeight: 600 }}>
                        {med.temperatureMin}–{med.temperatureMax}°C
                      </span>
                    </div>
                  )}
                  {med.storageCondition === "room_temp" && (
                    <span style={{ color: "var(--text-muted)", fontSize: 12 }}>Room Temp</span>
                  )}
                </td>
                <td>
                  <button className="btn-ghost" style={{ padding: "5px 8px" }}>
                    <ChevronRight size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "40px", color: "var(--text-muted)" }}>
            No medicines match your filters
          </div>
        )}
      </div>

      {/* Batch Drawer */}
      {selected && <BatchDrawer medicine={selected} onClose={() => setSelected(null)} />}

      {/* Add Medicine Drawer */}
      {showAdd && <AddMedicineDrawer onClose={() => setShowAdd(false)} />}
    </div>
  );
}
