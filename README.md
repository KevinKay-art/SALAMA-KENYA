# Usalama Kenya (Salama Kenya) • National GBV Support & Safety Platform

<p align="center">
  <img src="https://img.shields.io/badge/Kenya%20Data%20Protection%20Act-Compliant%20(2019)-059669?style=flat-square&logo=shield" alt="Data Protection Act Compliant" />
  <img src="https://img.shields.io/badge/Toll--Free%20Helpline-1195-10B981?style=flat-square&logo=phone" alt="HAK 1195 Toll Free" />
  <img src="https://img.shields.io/badge/Architecture-Full--Stack%20(React%20%2B%20Express)-3B82F6?style=flat-square&logo=typescript" alt="Full Stack" />
  <img src="https://img.shields.io/badge/USSD%20Fallback-*483*1195%23-F59E0B?style=flat-square" alt="USSD Fallback" />
</p>

**Usalama Kenya** is a high-security, low-data, and offline-resilient web platform designed to provide Gender-Based Violence (GBV) survivors, advocates, and responders in Kenya with immediate, anonymous access to emergency hotlines, verified safe shelters, legal aid, and confidential incident triage.

---

## 🛡️ Key Safety & Civic Tech Features

- **⚡ Quick Safe-Exit (`ESC` or Header Button)**: Instantly replaces the page location with a standard Nairobi weather search (`google.com/search?q=nairobi+weather+today`) to prevent discovery by an abusive partner or bystander.
- **🌤️ Disguised Screen Mode ("Weather / Notes App")**: Allows survivors to switch the interface into a harmless 5-day Nairobi weather forecast. Can be unlocked back to Usalama Kenya by entering the secret PIN (`1195` – the National GBV Helpline number) or `0000`.
- **🔒 100% Anonymous Incident Reporting**: Compliant with **Section 5 and 41 of the Kenya Data Protection Act (2019)**. Generates an alphanumeric tracking code (e.g., `SAL-8419`) for survivors to check status and receive support without providing identifying personal data.
- **🗺️ Verified Help Points Map & Fast-List Directory**: Lists verified hospitals, Gender Violence Recovery Centres (GVRCs), Police Gender Desks, safe houses, and CREAW legal aid centers across Nairobi, Mombasa, Kisumu, Nakuru, Uasin Gishu, Kilifi, and 40+ counties.
- **📱 Low-Data Mode & Africa's Talking SMS / USSD Fallback**: Supports feature phones and low-3G environments via USSD shortcode `*483*1195#` and SMS alert dispatch.
- **📋 Local-Only Safety Planner**: Interactive checklist (packing emergency documents, memorizing code words, neighbor contacts) stored strictly in `localStorage`—never transmitted to any server.
- **👩‍⚕️ Secure Counselor & Admin Portal**: Role-gated triage dashboard for verified responders to manage incident status, verify help facilities, and analyze anonymized county-level GBV statistics.

---

## 🏗️ Technical Architecture

- **Frontend**: React 18, TypeScript, Tailwind CSS, Lucide Icons, Vite
- **Backend**: Node.js, Express 4, RESTful API endpoints (`/api/reports`, `/api/resources`, `/api/contacts`, `/api/analytics`, `/api/auth/login`)
- **Storage & Database**: Production-ready SQL/in-memory adapter with seeded Kenya GBV centers and mock counselor credentials. Easily extensible to PostgreSQL / Cloud SQL / Supabase.

---

## 🚀 Getting Started Locally

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- `npm` or `pnpm` / `bun`

### 2. Installation & Setup

```bash
# Clone your repository
git clone https://github.com/YOUR_USERNAME/YOUR_REPOSITORY_NAME.git
cd YOUR_REPOSITORY_NAME

# Install project dependencies
npm install
```

### 3. Environment Configuration

Copy the sample environment file if you wish to configure custom database or API keys:

```bash
cp .env.example .env
```

### 4. Run Development Server

```bash
npm run dev
```

The server will boot concurrently with Express and Vite HMR on `http://localhost:3000`.

---

## 🔐 Admin Portal Demo Credentials

To test the role-gated **Counselor & Admin Portal** in development:
- **Email**: `admin@usalamakenya.org`
- **Password**: `counselor123`

---

## 📦 Production Build & Deployment

### 1. Build for Production

```bash
npm run build
```

This compiles the React frontend into static assets in `/dist` and bundles the Express server into a standalone container-ready CommonJS file (`dist/server.cjs`).

### 2. Test Production Bundle Locally

```bash
npm start
```

---

## 🌐 Deployment Guide (Cloud Run, Render, Railway, or Vercel)

### Option A: Render / Railway / Fly.io (Recommended for Full-Stack)
1. Push your code to your GitHub repository.
2. In your cloud provider dashboard (e.g., [Render.com](https://render.com) or [Railway.app](https://railway.app)):
   - **Create a new Web Service** and connect your GitHub repository.
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Environment Variables**:
     - `NODE_ENV=production`
     - `PORT=3000` (or default port assigned by provider)

### Option B: Google Cloud Run (Docker / Buildpacks)
1. Connect your GitHub repository to **Google Cloud Build** or deploy directly via gcloud:
   ```bash
   gcloud run deploy usalama-kenya --source . --region europe-west1 --allow-unauthenticated
   ```
2. The service automatically detects `package.json` and executes `npm start`.

---

## 🤝 Contributing & Privacy Pledge

1. **No Identifiable Telemetry**: Never add tracking scripts, advertising tags, or third-party cookies.
2. **Data Minimization**: Always ensure new features work offline or with zero personal data collection.
3. **Emergency Numbers**: Any additions to hotlines must be verified with the **Healthcare Assistance Kenya (HAK 1195)** or the Ministry of Public Service & Gender.

---

## 📞 Emergency Contacts (Kenya 24/7 Toll-Free)
- **National GBV Helpline**: `1195`
- **Child Helpline**: `116`
- **Police Emergency**: `999` / `112`
- **CREAW Legal & Shelter Aid**: `0800-720-186`
