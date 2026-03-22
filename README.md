<div align="center">

<img src="public/favicon.ico" width="80" alt="Curametrix Logo" />

# 🏥 Curametrix

### AI-Powered Hospital Pharmacy Inventory Management System

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel-black?style=for-the-badge&logo=vercel)](https://curametrix-coral.vercel.app/dashboard)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Firebase](https://img.shields.io/badge/Firebase-Auth%20%26%20Firestore-orange?style=for-the-badge&logo=firebase)](https://firebase.google.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4-38bdf8?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)

**Built for modern hospitals** — Curametrix replaces outdated spreadsheet-based drug tracking with an intelligent, real-time system that prevents stockouts, minimises expiry wastage, and flags fraudulent dispensing activity automatically.

---

## 🚀 Live Demo

> **[https://curametrix-coral.vercel.app/dashboard](https://curametrix-coral.vercel.app/dashboard)**

Use the **Quick Demo Login** buttons on the login screen to explore the system instantly — no signup required.

| Role | Access Level |
|------|-------------|
| 👑 Admin | Full access to all modules including user management and fraud detection |
| 🧑‍💼 Store Manager | Inventory, supply chain, and purchase orders |
| 💊 Pharmacist | Dispensing, FEFO recommendations, and billing |
| 👁️ Viewer | Read-only access to all dashboards |

</div>

---

## ✨ Key Features

### 🤖 AI & Machine Learning
- **Demand Forecasting** — Random Forest model (scikit-learn) trained on real Indian hospital pharmacy datasets with **91%+ accuracy**
- **Smart Reorder Suggestions** — AI auto-calculates optimal purchase quantities based on seasonal trends and historical demand
- **Anomaly Detection** — Identifies unusual dispensing patterns and flags potential fraud

### 💊 Pharmacy Operations
- **FEFO Dispensing** — First Expired, First Out batch selection enforced automatically at point of dispense
- **Multi-Batch Tracking** — Track every batch with expiry dates, batch numbers, and manufacturer details
- **Bulk CSV Upload** — Import entire drug catalogs in seconds via drag-and-drop
- **Real-time Stock Monitoring** — Live inventory levels with configurable low-stock thresholds

### 🚨 Alerts & Compliance
- **Critical Alert Dashboard** — Color-coded severity system (Critical / Warning / Info)
- **SMS Notifications** via Twilio — Instant pharmacist alerts for stockouts and temperature breaches
- **Email Notifications** via Resend — Automated digest reports and emergency broadcasts
- **Immutable Audit Trail** — Every drug dispensed, every user action is logged permanently for HIPAA compliance

### 💳 Billing & POS
- **Point-of-Sale Interface** — Full cart system with medicine search, quantity management, and receipt generation
- **GST-compliant Billing** — Automatic tax calculation per medicine category
- **Payment Processing** — Cash, card, and insurance payment modes

### 🌡️ Cold Chain Management
- **IoT Temperature Monitoring** — Real-time sensor readings for refrigeration zones
- **Breach Detection** — Instant alert if fridge temperature exceeds safe thresholds (2–8°C)
- **Historical Log** — Full temperature audit history per monitoring zone

### 🔐 Security & Fraud Detection
- **Firebase JWT Authentication** — Every API call is verified server-side via Admin SDK
- **Role-Based Access Control** — 4 distinct roles with granular permissions
- **Fraud Intelligence Module** — Detects opioid over-dispensing, ghost patient entries, and duplicate billing patterns

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 16 (App Router), React 19, TypeScript 5 |
| **Styling** | Tailwind CSS 4, Custom CSS Variables |
| **Charts** | Recharts 3 |
| **State** | Zustand 5 |
| **Icons** | Lucide React |
| **Authentication** | Firebase Auth (JWT) |
| **Database** | Cloud Firestore (NoSQL) |
| **Storage** | Firebase Storage |
| **Backend API** | Next.js Route Handlers (11 endpoints) |
| **ML Engine** | Python 3, scikit-learn, pandas, joblib |
| **SMS** | Twilio API |
| **Email** | Resend API |
| **Deployment** | Vercel |
| **CSV Parsing** | PapaParse |

---

## 📐 System Architecture

```
┌─────────────────────────────────────────────────────┐
│                    Browser / User                    │
└──────────────────────┬──────────────────────────────┘
                       │ HTTPS
┌──────────────────────▼──────────────────────────────┐
│         Next.js 16 App (Vercel Serverless)           │
│  ┌─────────────────┐   ┌──────────────────────────┐ │
│  │  Pages (React)  │   │  API Routes (/app/api/*)  │ │
│  │  14 Dashboards  │   │  11 Protected Endpoints   │ │
│  └────────┬────────┘   └────────────┬─────────────┘ │
└───────────┼──────────────────────── ┼───────────────┘
            │                         │ Bearer JWT
┌───────────▼──────────┐  ┌───────────▼──────────────┐
│   Firebase Auth      │  │   Cloud Firestore        │
│   (ID Tokens)        │  │   (Real-time Database)   │
└──────────────────────┘  └──────────────────────────┘
                                       │
                          ┌────────────▼─────────────┐
                          │   Python ML Model         │
                          │   (Random Forest)         │
                          │   /api/ai/generate-orders │
                          └──────────────────────────┘
```

---

## 📦 Dashboard Modules

| Module | Route | Description |
|--------|-------|-------------|
| 🏠 Overview | `/dashboard` | KPI cards, charts, AI reorder alerts |
| 💊 Inventory | `/dashboard/inventory` | Full drug catalog + bulk upload |
| ⏰ Expiry Tracker | `/dashboard/expiry` | FEFO tool, expiry timeline |
| 🚨 Alerts | `/dashboard/alerts` | Notification center |
| 📋 Dispensing | `/dashboard/dispensing` | Dispense logs + new dispense drawer |
| 📊 Analytics | `/dashboard/analytics` | Revenue, wastage, demand charts |
| 🚚 Supply Chain | `/dashboard/supply-chain` | Purchase orders, transfers |
| 💳 Billing / POS | `/dashboard/billing` | Point-of-sale cart |
| 🤖 AI Insights | `/dashboard/ai-insights` | ML demand forecasts |
| 📜 Audit Log | `/dashboard/audit` | Immutable compliance trail |
| 🕵️ Fraud Detection | `/dashboard/fraud` | Anomaly investigation |
| 👥 User Management | `/dashboard/users` | Staff roles & permissions |
| 🌡️ Cold Chain | `/dashboard/cold-chain` | IoT temperature monitoring |
| ⚙️ Settings | `/dashboard/settings` | Twilio, Resend, Firebase config |

---

## 🏁 Getting Started (Local Development)

### Prerequisites
- Node.js ≥ 18
- npm ≥ 9
- A Firebase project (with Auth + Firestore enabled)

### 1. Clone the repository
```bash
git clone https://github.com/ShouryMishra/curametrix.git
cd curametrix
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables
Create a `.env.local` file in the root directory:
```env
# Firebase Client SDK
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Firebase Admin SDK (for server-side API routes)
FIREBASE_ADMIN_PROJECT_ID=your_project_id
FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk@your_project.iam.gserviceaccount.com
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# Optional - SMS & Email
TWILIO_ACCOUNT_SID=ACxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE=+1415xxxxxxx
RESEND_API_KEY=re_xxxxxxxxxxxx
```

> 💡 **Don't have Firebase?** The app works fully without it using built-in high-fidelity mock data. Just skip this step and run the dev server.

### 4. Start the development server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🤖 ML Model Training (Optional)

The AI demand forecasting runs off a pre-trained scikit-learn model. To retrain on your own data:

```bash
cd ml
pip install pandas scikit-learn joblib openpyxl
python train_model_real.py
```

This will generate `trained_prediction_model.joblib` which the `/api/ai/generate-orders` endpoint loads automatically.

---

## 📁 Project Structure

```
curametrix/
├── app/
│   ├── (auth)/login/         # Login page
│   ├── api/                  # 11 REST API endpoints
│   │   ├── medicines/
│   │   ├── batches/
│   │   ├── dispense/
│   │   ├── alerts/
│   │   ├── billing/
│   │   ├── audit/
│   │   ├── temperature/
│   │   ├── dashboard/kpis/
│   │   └── ai/generate-orders/
│   └── dashboard/            # 14 dashboard modules
├── components/
│   └── layout/               # Header, Sidebar, Shell
├── lib/
│   ├── firebase.ts           # Firebase client config
│   ├── firebaseAdmin.ts      # Firebase Admin SDK
│   ├── auth.ts               # JWT verification middleware
│   ├── api.ts                # Authenticated fetch wrapper
│   ├── mockData.ts           # Fallback demo data
│   └── services/             # 7 Firestore service modules
├── ml/                       # Python ML training scripts
├── types/                    # TypeScript type definitions
└── public/                   # Static assets
```

---

## 🙏 Credits

Built with ❤️ for the healthcare industry.

- **Frontend & Backend:** [ShouryMishra](https://github.com/ShouryMishra)
- **ML Model & Datasets:** [krissp-momo](https://github.com/krissp-momo)
- **Framework:** [Next.js](https://nextjs.org/) by Vercel
- **Database & Auth:** [Firebase](https://firebase.google.com/) by Google

---

<div align="center">

**[🔗 View Live Demo →](https://curametrix-coral.vercel.app/dashboard)**

*Curametrix — Smarter Hospital Pharmacy Management*

</div>
