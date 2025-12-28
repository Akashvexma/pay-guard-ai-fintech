# PayGuard AI - Comprehensive FinTech Security Platform

<div align="center">

![PayGuard AI](https://img.shields.io/badge/PayGuard-AI-00ffc8?style=for-the-badge&labelColor=0a0e1a)
![Finnothon 2025](https://img.shields.io/badge/Finnothon-2025-ff6b6b?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178c6?style=for-the-badge&logo=typescript&logoColor=white)

**Enterprise-grade fraud detection and financial security for businesses of all sizes.**

[Live Demo](https://v0-fin-tech-hackathon-solution.vercel.app) | [Meet the Team](#team) | [YOUTUBE WALKTHROUGH](https://youtu.be/anrCgi86an8)

</div>

---

## Finnothon 2025 - Multi-Track Implementation

This project implements **multiple problem statements** from Finnothon 2025, with Track 3 (Fraud Detection API) as the primary focus.

| Track | Name | Status | Description |
|-------|------|--------|-------------|
| **Track 3** | Fraud Detection API | ✅ Complete | ML-powered transaction risk scoring |
| Track 1 | Whale Watcher | ✅ Complete | Real-time crypto trade detection |
| Track 4 | Document Vault | ✅ Complete | Zero-knowledge KYC encryption |
| Track 5 | Clarity Guardian | ✅ Complete | Eye tracking confusion detector |
| Track 6 | API Sentinel | ✅ Complete | API abuse detection platform |

---

## Track 3: Fraud Detection API (Primary Focus)

### Problem Statement
Small e-commerce businesses are frequently targeted by "Chargeback Fraud." They need a lightweight solution to flag high-risk transactions before processing.

### Technical Deliverables

#### 1. Trained ML Model
- **Algorithm**: Logistic Regression (Scikit-Learn)
- **Dataset**: Kaggle Credit Card Fraud Detection (284,807 transactions)
- **Metrics**: 99.91% Accuracy, 97.42% AUC-ROC

#### 2. Predictive REST API
```bash
POST /api/analyze-risk
```

**Request:**
```json
{
  "amount": 149.99,
  "customer_email": "customer@example.com",
  "customer_ip": "203.0.113.42"
}
```

**Response:**
```json
{
  "fraud_probability": 0.12,
  "risk_score": 12,
  "decision": "approve",
  "feature_analysis": [...]
}
```

#### 3. Admin Audit Log
Located at `/dashboard/audit-log` - Review flagged transactions with manual override capability.

---

## Track 1: Whale Watcher

Real-time institutional trade detection dashboard featuring:
- **TradingView Integration** - Full charts with indicators (RSI, MACD, Bollinger)
- **Live Whale Alerts** - Trades exceeding $500K threshold
- **Market Heatmap** - CoinGlass-style liquidation visualization
- **15+ Cryptocurrencies** - BTC, ETH, SOL, and more

---

## Track 4: Document Vault

Zero-knowledge KYC encryption system:
- **Client-Side Encryption** - AES-256-GCM via Web Crypto API
- **PBKDF2 Key Derivation** - PIN never leaves the browser
- **Have I Been Pwned** - Password breach checking
- **Encrypted Storage** - Only ciphertext stored on server

---

## Track 5: Clarity Guardian

Payment confusion detector with eye tracking:
- **Webcam Eye Tracking** - Using WebGazer.js patterns
- **Confusion Detection** - Dwell time, revisits, saccade analysis
- **Adaptive UI** - Auto-show tooltips and help when confused
- **Privacy First** - All processing local, no images stored

---

## Track 6: API Sentinel

API abuse detection platform:
- **Traffic Monitoring** - Real-time request visualization
- **Anomaly Detection** - Rate limiting, auth failure tracking
- **Client Management** - Block/unblock suspicious IPs
- **Security Alerts** - Automated threat notifications

---

## WOW Features

Beyond the problem statements, we've added:

- **Voice Commands** - Navigate dashboard hands-free
- **Currency Toggle** - Switch between USD ($) and INR (₹)
- **Real-time Metrics** - Live TPS, latency, fraud blocked
- **AI Insights** - Behavioral biometrics, fraud ring detection
- **ROI Calculator** - Show potential savings
- **Security Score** - Overall posture visualization

---

## Quick Start

```bash
# Clone and install
git clone https://github.com/Akashvexma/payguard-ai.git
cd payguard-ai
pnpm install
pnpm dev
```

### Demo Mode
1. Go to `/auth/login`
2. Click **"Instant Demo Login"**
3. Explore all features with mock data

---

## Environment Variables

```env
# Database (Supabase)
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key

# Cache (Upstash Redis)  
KV_REST_API_URL=your_url
KV_REST_API_TOKEN=your_token

# Payments (Stripe)
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

---

## Team

<table>
<tr>
<td align="center" width="33%">
<h3>Akash Verma</h3>
<b>Full Stack Developer</b><br/>
Core infrastructure, APIs, databases
</td>
<td align="center" width="33%">
<h3>Aditya Geete</h3>
<b>ML & Backend Engineer</b><br/>
Neural risk engine, ML pipelines
</td>
<td align="center" width="33%">
<h3>Neev Modi</h3>
<b>Product & Frontend Lead</b><br/>
UI/UX design, product strategy
</td>
</tr>
</table>

---

## Technology Stack

| Layer | Technologies |
|-------|-------------|
| Frontend | Next.js 15, React 19, TypeScript, Tailwind CSS 4 |
| Backend | Next.js API Routes, Edge Runtime |
| Database | Supabase (PostgreSQL) |
| Cache | Upstash Redis |
| ML | Logistic Regression (Kaggle dataset) |
| Payments | Stripe |
| Deployment | Vercel |

---

## License

MIT License - Built with ❤️ for Finnothon 2025

---

<div align="center">

**PayGuard AI - Protecting merchants, one transaction at a time.**

</div>
