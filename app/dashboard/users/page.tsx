"use client";

import { useState } from "react";
import { User, Lock, Bell, Phone, Mail, Shield, Plus, Edit, Trash2, Check, X } from "lucide-react";
import type { UserRole } from "@/types";

const users = [
  { id: "u1", name: "Dr. Priya Sharma", email: "priya@hospital.com", phone: "+91 98765 43210", role: "admin" as UserRole, status: "active", lastLogin: "Today, 2:30 PM" },
  { id: "u2", name: "Amit Verma", email: "amit@hospital.com", phone: "+91 87654 32109", role: "store_manager" as UserRole, status: "active", lastLogin: "Today, 11:00 AM" },
  { id: "u3", name: "Sunita Devi", email: "sunita@hospital.com", phone: "+91 76543 21098", role: "pharmacist" as UserRole, status: "active", lastLogin: "1 hour ago" },
  { id: "u4", name: "Vikash Singh", email: "vikash@hospital.com", phone: "+91 65432 10987", role: "viewer" as UserRole, status: "inactive", lastLogin: "3 days ago" },
];

const roleConfig: Record<UserRole, { color: string; bg: string; permissions: string[] }> = {
  admin: { color: "#1E3A8A", bg: "#EFF6FF", permissions: ["Full access – all modules"] },
  store_manager: { color: "#0EA5E9", bg: "#F0F9FF", permissions: ["Inventory", "Orders", "Reports", "Transfers"] },
  pharmacist: { color: "#10B981", bg: "#F0FDF4", permissions: ["Dispensing", "Alerts", "Drug lookup"] },
  viewer: { color: "#64748B", bg: "#F8FAFC", permissions: ["Read-only dashboards and reports"] },
};

const notificationSettings = [
  { role: "admin" as UserRole, label: "Admin", sms: true, email: true, alerts: ["All alerts", "Weekly reports"] },
  { role: "store_manager" as UserRole, label: "Store Manager", sms: true, email: true, alerts: ["Low stock", "Fraud", "PO approval"] },
  { role: "pharmacist" as UserRole, label: "Pharmacist", sms: true, email: false, alerts: ["Expiry < 7 days", "Low stock"] },
  { role: "viewer" as UserRole, label: "Viewer", sms: false, email: false, alerts: [] },
];

const tabs = ["User Management", "Roles & Permissions", "Notification Settings"];

function AddEditUserDrawer({ user, onClose }: { user?: any, onClose: () => void }) {
  const isNew = !user || user.isNew;
  const [formData, setFormData] = useState(isNew ? { name: "", email: "", phone: "+91 ", role: "viewer", status: "active" } : { ...user });

  const handleSave = () => {
    onClose();
    alert(`${isNew ? "User Created" : "User Updated"}: ${formData.name}.\n\nA confirmation email and access credentials have been securely queued.`);
  };

  return (
    <>
      <div className="modal-backdrop" onClick={onClose} />
      <div className="drawer" style={{ display: "flex", flexDirection: "column", width: "100%", maxWidth: 450 }}>
        <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: 17, fontWeight: 700 }}>{isNew ? "Add New User" : "Edit User"}</div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)" }}><X size={20} /></button>
        </div>
        
        <div style={{ padding: 24, flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: "var(--text-muted)", marginBottom: 4, display: "block" }}>Full Name</label>
            <input className="input" placeholder="e.g. Rahul Sharma" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
          </div>

          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: "var(--text-muted)", marginBottom: 4, display: "block" }}>Email Address</label>
            <input className="input" type="email" placeholder="e.g. rahul@hospital.com" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
          </div>

          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: "var(--text-muted)", marginBottom: 4, display: "block" }}>Phone Number</label>
            <input className="input" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: "var(--text-muted)", marginBottom: 4, display: "block" }}>Role</label>
              <select className="select" value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })} style={{ fontSize: 13 }}>
                <option value="admin">Admin</option>
                <option value="store_manager">Store Manager</option>
                <option value="pharmacist">Pharmacist</option>
                <option value="viewer">Viewer</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: "var(--text-muted)", marginBottom: 4, display: "block" }}>Status</label>
              <select className="select" value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })} style={{ fontSize: 13 }}>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          {isNew && (
            <div style={{ padding: "12px 14px", background: "#EFF6FF", borderRadius: 8, border: "1px solid #BFDBFE", fontSize: 12, color: "#1E3A8A", marginTop: 8 }}>
              🔑 A temporary password will be auto-generated and sent via email. They will be prompted to change it upon first login.
            </div>
          )}

          <div style={{ display: "flex", gap: 10, marginTop: "auto" }}>
            <button className="btn-primary" onClick={handleSave} style={{ flex: 1, justifyContent: "center" }}>{isNew ? "Create User" : "Save Changes"}</button>
            <button className="btn-secondary" onClick={onClose} style={{ flex: 1, justifyContent: "center" }}>Cancel</button>
          </div>
        </div>
      </div>
    </>
  );
}

export default function UsersPage() {
  const [activeTab, setActiveTab] = useState("User Management");
  const [editingUser, setEditingUser] = useState<any>(null);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Tabs */}
      <div style={{ background: "white", borderRadius: 12, border: "1px solid var(--border)", overflow: "hidden" }}>
        <div style={{ display: "flex", borderBottom: "1px solid var(--border)", padding: "0 16px" }}>
          {tabs.map(t => (
            <button key={t} onClick={() => setActiveTab(t)} style={{
              padding: "12px 18px", border: "none", background: "none", cursor: "pointer",
              fontSize: 13, fontWeight: 600, color: activeTab === t ? "var(--accent)" : "var(--text-muted)",
              borderBottom: activeTab === t ? "2px solid var(--accent)" : "2px solid transparent",
              transition: "all 0.15s", whiteSpace: "nowrap",
            }}>{t}</button>
          ))}
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", padding: "0 0 0 12px" }}>
            <button onClick={() => setEditingUser({ isNew: true })} className="btn-primary" style={{ fontSize: 13 }}><Plus size={14} /> Add User</button>
          </div>
        </div>

        <div style={{ padding: 20 }}>
          {activeTab === "User Management" && (
            <div className="table-container">
              <table>
                <thead><tr><th>User</th><th>Role</th><th>Contact</th><th>Status</th><th>Last Login</th><th>Actions</th></tr></thead>
                <tbody>
                  {users.map(u => {
                    const rc = roleConfig[u.role];
                    return (
                      <tr key={u.id}>
                        <td>
                          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <div style={{ width: 36, height: 36, borderRadius: "50%", background: rc.bg, border: `2px solid ${rc.color}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: rc.color }}>
                              {u.name.charAt(0)}
                            </div>
                            <div>
                              <div style={{ fontWeight: 600, fontSize: 14 }}>{u.name}</div>
                              <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{u.email}</div>
                            </div>
                          </div>
                        </td>
                        <td><span style={{ fontSize: 12, fontWeight: 700, padding: "3px 10px", borderRadius: 999, background: rc.bg, color: rc.color }}>{u.role.replace("_", " ")}</span></td>
                        <td>
                          <div style={{ fontSize: 12 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 5 }}><Phone size={11} color="var(--text-muted)" /> {u.phone}</div>
                          </div>
                        </td>
                        <td><span className={`badge ${u.status === "active" ? "badge-success" : "badge-warning"}`}>{u.status}</span></td>
                        <td style={{ fontSize: 12, color: "var(--text-muted)" }}>{u.lastLogin}</td>
                        <td>
                          <div style={{ display: "flex", gap: 6 }}>
                            <button onClick={() => setEditingUser(u)} className="btn-ghost" style={{ padding: "5px 8px" }}><Edit size={13} /></button>
                            <button onClick={() => { if(window.confirm('Are you sure you want to delete this user? This revokes all system access.')) alert('User successfully removed (mock).') }} className="btn-ghost" style={{ color: "#EF4444", padding: "5px 8px" }}><Trash2 size={13} /></button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === "Roles & Permissions" && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 14 }}>
              {Object.entries(roleConfig).map(([role, cfg]) => (
                <div key={role} style={{ padding: "16px 18px", borderRadius: 12, background: cfg.bg, border: `1px solid ${cfg.color}30` }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                    <Shield size={18} color={cfg.color} />
                    <span style={{ fontSize: 15, fontWeight: 700, color: cfg.color, textTransform: "capitalize" }}>{role.replace("_", " ")}</span>
                  </div>
                  {cfg.permissions.map(p => (
                    <div key={p} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, marginBottom: 5 }}>
                      <Check size={12} color={cfg.color} /> {p}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}

          {activeTab === "Notification Settings" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ padding: "10px 14px", background: "#F0FDF4", borderRadius: 8, border: "1px solid #BBF7D0", fontSize: 13, color: "#15803D" }}>
                📱 SMS via Twilio · 📧 Email via Resend — Configure API keys in Settings to activate
              </div>
              <div className="table-container">
                <table>
                  <thead><tr><th>Role</th><th>SMS</th><th>Email</th><th>Alert Types</th></tr></thead>
                  <tbody>
                    {notificationSettings.map(ns => {
                      const rc = roleConfig[ns.role];
                      return (
                        <tr key={ns.role}>
                          <td><span style={{ fontWeight: 700, color: rc.color }}>{ns.label}</span></td>
                          <td>
                            <span style={{ fontSize: 13, fontWeight: 700, color: ns.sms ? "#15803D" : "#DC2626" }}>
                              {ns.sms ? "📱 Active" : "Off"}
                            </span>
                          </td>
                          <td>
                            <span style={{ fontSize: 13, fontWeight: 700, color: ns.email ? "#1D4ED8" : "#DC2626" }}>
                              {ns.email ? "📧 Active" : "Off"}
                            </span>
                          </td>
                          <td>
                            <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                              {ns.alerts.length > 0 ? ns.alerts.map(a => (
                                <span key={a} className="badge badge-info">{a}</span>
                              )) : <span style={{ color: "var(--text-muted)", fontSize: 12 }}>None</span>}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {editingUser && <AddEditUserDrawer user={editingUser} onClose={() => setEditingUser(null)} />}
    </div>
  );
}
