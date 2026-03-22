# CuraMatrix Deployment Guide

To make your project fully functional online, follow these steps to configure your Vercel deployment.

## 1. Firebase Admin Credentials
You MUST add the following environment variable to your Vercel Project Settings (Environment Variables):

- **Key**: `FIREBASE_SERVICE_ACCOUNT`
- **Value**: Copy the ENTIRE content of your Service Account JSON file (the one starting with `{ "type": "service_account", ... }`).

## 2. Dynamic Integration Verified
The following modules are now fully dynamic and will update your database in real-time:
- **Inventory**: All Add/Edit/Delete actions are now live.
- **Billing / POS**: Creating a bill now deducts stock from Firestore and creates a dispense log.
- **Dispensing**: Live logs and inventory deduction.
- **Dashboard**: All KPIs and the Category Breakdown chart are now calculated from live data.

## 3. URLs
- **Production URL**: [https://curametrix.vercel.app/](https://curametrix.vercel.app/) (Verify this in your Vercel Dashboard)
- **Firebase Console**: [https://console.firebase.google.com/](https://console.firebase.google.com/)

## 4. Final Steps
1. Push these changes to your GitHub repository:
   ```bash
   git add .
   git commit -m "Finalizing dynamic billing and inventory integration"
   git push origin main
   ```
2. Check the "Deployments" tab in Vercel. Once the build is finished, your site will be live and 100% dynamic!
