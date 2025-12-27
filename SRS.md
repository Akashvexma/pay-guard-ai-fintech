# Software Requirements Specification (SRS)
## PayGuard AI - Intelligent Fraud Detection Platform

**Version:** 2.0  
**Date:** December 28, 2025  
**Project:** Finnothon 2025 - Track 3: Fraud Detection API  
**Team:** Akash Verma, Aditya Geete, Neev Modi

---

## Table of Contents

1. [Introduction](#1-introduction)
2. [Overall Description](#2-overall-description)
3. [System Features](#3-system-features)
4. [External Interface Requirements](#4-external-interface-requirements)
5. [Non-Functional Requirements](#5-non-functional-requirements)
6. [Database Design](#6-database-design)
7. [API Specification](#7-api-specification)
8. [Security Requirements](#8-security-requirements)
9. [Appendices](#9-appendices)

---

## 1. Introduction

### 1.1 Purpose

This Software Requirements Specification (SRS) document provides a comprehensive description of the PayGuard AI fraud detection platform. It details the functional and non-functional requirements, system architecture, and technical specifications for the web application developed for Finnothon 2025 hackathon.

### 1.2 Scope

PayGuard AI is an AI-powered fraud detection system designed to protect merchants from payment fraud in real-time. The system includes:

- Machine Learning-based transaction risk scoring
- Real-time transaction monitoring and alerting
- Admin dashboard for fraud management
- API endpoints for merchant integration
- Multi-track Finnothon features including Whale Watcher, Document Vault, Clarity Guardian, and API Sentinel

### 1.3 Definitions, Acronyms, and Abbreviations

| Term | Definition |
|------|------------|
| ML | Machine Learning |
| API | Application Programming Interface |
| REST | Representational State Transfer |
| JWT | JSON Web Token |
| AES | Advanced Encryption Standard |
| PCA | Principal Component Analysis |
| ROC | Receiver Operating Characteristic |
| AUC | Area Under Curve |
| KYC | Know Your Customer |
| AML | Anti-Money Laundering |
| RLS | Row Level Security |
| TPS | Transactions Per Second |
| PBKDF2 | Password-Based Key Derivation Function 2 |

### 1.4 References

- Kaggle Credit Card Fraud Detection Dataset
- Finnothon 2025 Problem Statements
- Scikit-learn Documentation
- Next.js 16 Documentation
- Supabase Documentation
- Stripe API Documentation

### 1.5 Overview

This document is organized into sections covering the overall system description, detailed feature requirements, interface specifications, and non-functional requirements including performance, security, and scalability considerations.

---

## 2. Overall Description

### 2.1 Product Perspective

PayGuard AI is a standalone web application that integrates with existing payment systems via REST APIs. It serves as a middleware layer between merchants and payment processors, analyzing transactions in real-time to detect and prevent fraud.

#### 2.1.1 System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │
│  │   Next.js   │  │   React     │  │   TailwindCSS + shadcn  │  │
│  │   App Router│  │   Components│  │   UI Components         │  │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                         API LAYER                                │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │
│  │ /api/score  │  │/api/analyze │  │  /api/audit-log         │  │
│  │             │  │   -risk     │  │                         │  │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      ML ENGINE LAYER                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │
│  │  Feature    │  │  Logistic   │  │   Risk Score            │  │
│  │  Extraction │  │  Regression │  │   Calculator            │  │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      DATA LAYER                                  │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │
│  │  Supabase   │  │   Upstash   │  │   In-Memory Store       │  │
│  │  PostgreSQL │  │   Redis     │  │   (Transactions)        │  │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

### 2.2 Product Functions

The primary functions of PayGuard AI include:

1. **Transaction Risk Analysis** - Real-time ML-based fraud scoring
2. **Merchant Dashboard** - Comprehensive fraud management interface
3. **Audit Log** - Review and manage flagged transactions
4. **ML Model Management** - Train, test, and monitor ML models
5. **Whale Watcher** - Cryptocurrency large transaction monitoring
6. **Document Vault** - Zero-knowledge KYC document encryption
7. **Clarity Guardian** - Eye tracking for checkout confusion detection
8. **API Sentinel** - API abuse detection and rate limiting

### 2.3 User Classes and Characteristics

| User Class | Description | Technical Expertise |
|------------|-------------|---------------------|
| Merchant Admin | Business owners managing fraud prevention | Low to Medium |
| Fraud Analyst | Security professionals reviewing flagged transactions | Medium to High |
| Developer | Technical users integrating the API | High |
| System Admin | IT staff managing the platform | High |

### 2.4 Operating Environment

- **Frontend:** Modern web browsers (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)
- **Backend:** Node.js 18+ runtime
- **Database:** PostgreSQL 14+ (Supabase), Redis (Upstash)
- **Hosting:** Vercel Edge Network
- **CDN:** Vercel CDN for static assets

### 2.5 Design and Implementation Constraints

1. Must process transactions within 100ms latency target
2. Must comply with PCI-DSS for payment data handling
3. Must support GDPR data privacy requirements
4. Must use TypeScript for type safety
5. Must be deployable on Vercel platform

### 2.6 Assumptions and Dependencies

**Assumptions:**
- Users have stable internet connectivity
- Merchants have existing payment processing systems
- Transaction data follows standard financial formats

**Dependencies:**
- Supabase for database services
- Upstash for Redis caching
- Stripe for payment integration
- Vercel for hosting and deployment
- CoinGecko/Binance APIs for cryptocurrency data

---

## 3. System Features

### 3.1 Fraud Detection API (Track 3 - Primary)

#### 3.1.1 Description
The core ML-powered API that analyzes transactions and returns fraud probability scores.

#### 3.1.2 Functional Requirements

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-3.1.1 | System shall accept transaction data via POST request | High |
| FR-3.1.2 | System shall return fraud probability (0-1 scale) | High |
| FR-3.1.3 | System shall return risk decision (approve/review/decline) | High |
| FR-3.1.4 | System shall provide feature contributions for explainability | Medium |
| FR-3.1.5 | System shall store analyzed transactions for audit | High |
| FR-3.1.6 | System shall support batch transaction analysis | Medium |
| FR-3.1.7 | System shall track velocity patterns per card/user | High |

#### 3.1.3 API Request Format

```json
{
  "amount": 150.00,
  "currency": "USD",
  "card_number": "4532XXXXXXXX1234",
  "card_country": "US",
  "billing_country": "US",
  "ip_address": "192.168.1.1",
  "email": "customer@example.com",
  "device_fingerprint": "abc123xyz",
  "merchant_id": "merchant_001",
  "timestamp": "2025-12-28T10:30:00Z"
}
```

#### 3.1.4 API Response Format

```json
{
  "transaction_id": "txn_abc123",
  "fraud_probability": 0.15,
  "risk_score": 15,
  "decision": "approve",
  "risk_level": "low",
  "features": {
    "amount_zscore": 0.5,
    "velocity_score": 0.2,
    "geo_risk": 0.1
  },
  "recommendations": ["Transaction appears legitimate"],
  "processing_time_ms": 45
}
```

### 3.2 Admin Audit Log

#### 3.2.1 Description
Dashboard interface for reviewing and managing flagged transactions.

#### 3.2.2 Functional Requirements

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-3.2.1 | System shall display all analyzed transactions | High |
| FR-3.2.2 | System shall filter by risk level (high/medium/low) | High |
| FR-3.2.3 | System shall filter by decision status | High |
| FR-3.2.4 | System shall allow manual review actions (approve/reject/escalate) | High |
| FR-3.2.5 | System shall display feature contributions per transaction | Medium |
| FR-3.2.6 | System shall export transaction data to CSV | Low |
| FR-3.2.7 | System shall show transaction timeline | Medium |

### 3.3 ML Model Center

#### 3.3.1 Description
Interface for monitoring, testing, and retraining the ML fraud detection model.

#### 3.3.2 Functional Requirements

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-3.3.1 | System shall display model performance metrics | High |
| FR-3.3.2 | System shall allow single transaction testing | High |
| FR-3.3.3 | System shall support live simulation mode | Medium |
| FR-3.3.4 | System shall track model version history | Medium |
| FR-3.3.5 | System shall display confusion matrix | Medium |
| FR-3.3.6 | System shall show feature importance rankings | Medium |
| FR-3.3.7 | System shall simulate model retraining | Low |
| FR-3.3.8 | System shall display training code reference | Low |

### 3.4 Whale Watcher (Track 1)

#### 3.4.1 Description
Real-time cryptocurrency large transaction monitoring with TradingView integration.

#### 3.4.2 Functional Requirements

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-3.4.1 | System shall connect to Binance WebSocket for live trades | High |
| FR-3.4.2 | System shall display real-time cryptocurrency prices | High |
| FR-3.4.3 | System shall alert on whale transactions (configurable threshold) | High |
| FR-3.4.4 | System shall embed TradingView advanced charts | Medium |
| FR-3.4.5 | System shall show liquidation heatmap | Medium |
| FR-3.4.6 | System shall display market overview for top coins | Medium |
| FR-3.4.7 | System shall provide buy/sell signal analysis | Low |

### 3.5 Document Vault (Track 4)

#### 3.5.1 Description
Zero-knowledge KYC document encryption system using client-side encryption.

#### 3.5.2 Functional Requirements

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-3.5.1 | System shall encrypt documents using AES-256-GCM | High |
| FR-3.5.2 | System shall derive keys using PBKDF2 (100,000 iterations) | High |
| FR-3.5.3 | System shall generate SHA-256 checksums for integrity | High |
| FR-3.5.4 | System shall support .pgvault export format | Medium |
| FR-3.5.5 | System shall allow import of encrypted backups | Medium |
| FR-3.5.6 | System shall decrypt and download original files | High |
| FR-3.5.7 | System shall validate PIN strength | Medium |

### 3.6 Clarity Guardian (Track 5)

#### 3.6.1 Description
Eye/gaze tracking system to detect user confusion during checkout flows.

#### 3.6.2 Functional Requirements

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-3.6.1 | System shall track mouse position as gaze proxy | High |
| FR-3.6.2 | System shall detect zone dwell times | High |
| FR-3.6.3 | System shall identify confusion patterns | High |
| FR-3.6.4 | System shall activate privacy mode on gaze absence | Medium |
| FR-3.6.5 | System shall provide contextual help on confusion | Medium |
| FR-3.6.6 | System shall generate session analytics | Medium |
| FR-3.6.7 | System shall support webcam face detection | Low |

### 3.7 API Sentinel (Track 6)

#### 3.7.1 Description
API abuse detection and monitoring system with rate limiting.

#### 3.7.2 Functional Requirements

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-3.7.1 | System shall monitor API request patterns | High |
| FR-3.7.2 | System shall detect rate limit violations | High |
| FR-3.7.3 | System shall identify authentication failures | High |
| FR-3.7.4 | System shall alert on anomalous patterns | Medium |
| FR-3.7.5 | System shall allow client blocking/unblocking | Medium |
| FR-3.7.6 | System shall display real-time traffic metrics | Medium |

### 3.8 Dashboard Overview

#### 3.8.1 Description
Main dashboard providing at-a-glance metrics and quick actions.

#### 3.8.2 Functional Requirements

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-3.8.1 | System shall display total transactions processed | High |
| FR-3.8.2 | System shall show fraud detection rate | High |
| FR-3.8.3 | System shall display revenue protected | High |
| FR-3.8.4 | System shall show real-time transaction chart | Medium |
| FR-3.8.5 | System shall display recent transactions list | Medium |
| FR-3.8.6 | System shall show security score | Medium |
| FR-3.8.7 | System shall support USD/INR currency toggle | Low |

### 3.9 AI Assistant

#### 3.9.1 Description
Intelligent assistant for navigation and feature explanation.

#### 3.9.2 Functional Requirements

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-3.9.1 | System shall understand natural language queries | Medium |
| FR-3.9.2 | System shall navigate to requested pages | Medium |
| FR-3.9.3 | System shall explain features and functionality | Medium |
| FR-3.9.4 | System shall support voice input | Low |
| FR-3.9.5 | System shall provide text-to-speech responses | Low |

---

## 4. External Interface Requirements

### 4.1 User Interfaces

#### 4.1.1 Dashboard Layout
- Responsive design supporting 320px to 4K resolutions
- Dark theme with cyan accent colors
- Left sidebar navigation (collapsible on mobile)
- Top header with user profile and notifications

#### 4.1.2 Page Help System
- Floating help button on all dashboard pages
- Interactive feature tours for new users
- Quick action buttons for common tasks
- Pro tips for power users

### 4.2 Hardware Interfaces

No direct hardware interfaces. The system operates entirely through web browsers.

### 4.3 Software Interfaces

| Interface | Description | Protocol |
|-----------|-------------|----------|
| Supabase | PostgreSQL database | HTTPS/WebSocket |
| Upstash | Redis cache | HTTPS |
| Stripe | Payment processing | HTTPS REST API |
| Binance | Cryptocurrency data | WebSocket |
| CoinGecko | Crypto market data | HTTPS REST API |
| TradingView | Chart widgets | JavaScript SDK |

### 4.4 Communication Interfaces

- **HTTPS:** All API communications use TLS 1.3
- **WebSocket:** Real-time data streaming for crypto prices
- **REST:** Standard JSON-based API endpoints

---

## 5. Non-Functional Requirements

### 5.1 Performance Requirements

| Metric | Requirement | Target |
|--------|-------------|--------|
| API Latency | 95th percentile response time | < 100ms |
| Page Load | Time to interactive | < 2 seconds |
| Throughput | Transactions per second | > 1000 TPS |
| Availability | System uptime | 99.9% |
| Concurrent Users | Simultaneous sessions | > 10,000 |

### 5.2 Safety Requirements

- System shall not process or store raw credit card numbers
- System shall mask sensitive data in logs
- System shall implement rate limiting to prevent abuse
- System shall have automatic failover mechanisms

### 5.3 Security Requirements

| ID | Requirement |
|----|-------------|
| SR-1 | All data in transit shall be encrypted using TLS 1.3 |
| SR-2 | All data at rest shall be encrypted using AES-256 |
| SR-3 | Authentication shall use secure session management |
| SR-4 | API endpoints shall require authentication tokens |
| SR-5 | Database shall implement Row Level Security (RLS) |
| SR-6 | System shall log all security-relevant events |
| SR-7 | Passwords shall be hashed using bcrypt |
| SR-8 | Document encryption shall use PBKDF2 key derivation |

### 5.4 Software Quality Attributes

#### 5.4.1 Reliability
- Mean Time Between Failures (MTBF): > 720 hours
- Mean Time To Recovery (MTTR): < 15 minutes
- Error rate: < 0.1% of requests

#### 5.4.2 Maintainability
- Code coverage: > 80%
- TypeScript strict mode enabled
- Modular component architecture
- Comprehensive documentation

#### 5.4.3 Scalability
- Horizontal scaling via Vercel Edge Functions
- Database connection pooling
- Redis caching for frequent queries
- Stateless API design

#### 5.4.4 Usability
- WCAG 2.1 AA accessibility compliance
- Keyboard navigation support
- Screen reader compatibility
- Multi-language support ready

---

## 6. Database Design

### 6.1 Entity Relationship Diagram

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│     users       │     │  transactions   │     │     alerts      │
├─────────────────┤     ├─────────────────┤     ├─────────────────┤
│ id (PK)         │────<│ user_id (FK)    │     │ id (PK)         │
│ email           │     │ id (PK)         │────<│ transaction_id  │
│ password_hash   │     │ amount          │     │ type            │
│ role            │     │ currency        │     │ severity        │
│ created_at      │     │ risk_score      │     │ message         │
│ updated_at      │     │ decision        │     │ created_at      │
└─────────────────┘     │ created_at      │     └─────────────────┘
                        └─────────────────┘
                               │
                               │
┌─────────────────┐     ┌──────┴──────────┐     ┌─────────────────┐
│     rules       │     │  audit_logs     │     │   merchants     │
├─────────────────┤     ├─────────────────┤     ├─────────────────┤
│ id (PK)         │     │ id (PK)         │     │ id (PK)         │
│ name            │     │ transaction_id  │     │ name            │
│ condition       │     │ action          │     │ api_key         │
│ action          │     │ user_id         │     │ webhook_url     │
│ priority        │     │ timestamp       │     │ created_at      │
│ enabled         │     │ details         │     │ settings        │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

### 6.2 Table Specifications

#### 6.2.1 users
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PRIMARY KEY, DEFAULT uuid_generate_v4() |
| email | VARCHAR(255) | UNIQUE, NOT NULL |
| password_hash | VARCHAR(255) | NOT NULL |
| role | VARCHAR(50) | DEFAULT 'user' |
| created_at | TIMESTAMP | DEFAULT NOW() |
| updated_at | TIMESTAMP | DEFAULT NOW() |

#### 6.2.2 transactions
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PRIMARY KEY |
| user_id | UUID | FOREIGN KEY REFERENCES users(id) |
| amount | DECIMAL(12,2) | NOT NULL |
| currency | VARCHAR(3) | DEFAULT 'USD' |
| risk_score | INTEGER | CHECK (0-100) |
| decision | VARCHAR(20) | NOT NULL |
| features | JSONB | |
| created_at | TIMESTAMP | DEFAULT NOW() |

---

## 7. API Specification

### 7.1 Authentication

All API endpoints require authentication via Bearer token:

```
Authorization: Bearer <api_key>
```

### 7.2 Endpoints

#### 7.2.1 POST /api/analyze-risk

Analyze a transaction for fraud risk.

**Request:**
```json
{
  "amount": 150.00,
  "currency": "USD",
  "card_number": "4532XXXXXXXX1234",
  "card_country": "US",
  "billing_country": "US",
  "ip_address": "192.168.1.1",
  "email": "customer@example.com"
}
```

**Response:**
```json
{
  "transaction_id": "txn_abc123",
  "fraud_probability": 0.15,
  "risk_score": 15,
  "decision": "approve",
  "risk_level": "low",
  "processing_time_ms": 45
}
```

#### 7.2.2 GET /api/audit-log

Retrieve audit log entries.

**Query Parameters:**
- `risk_level`: Filter by risk level (high/medium/low)
- `decision`: Filter by decision status
- `limit`: Number of records (default: 50)
- `offset`: Pagination offset

**Response:**
```json
{
  "transactions": [...],
  "total": 1250,
  "page": 1,
  "limit": 50
}
```

#### 7.2.3 POST /api/batch-analyze

Analyze multiple transactions in batch.

**Request:**
```json
{
  "transactions": [
    { "amount": 100, "card_country": "US", ... },
    { "amount": 500, "card_country": "GB", ... }
  ]
}
```

**Response:**
```json
{
  "results": [...],
  "summary": {
    "total": 100,
    "approved": 85,
    "declined": 10,
    "review": 5
  }
}
```

### 7.3 Error Codes

| Code | Description |
|------|-------------|
| 400 | Bad Request - Invalid input data |
| 401 | Unauthorized - Invalid or missing API key |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource does not exist |
| 429 | Too Many Requests - Rate limit exceeded |
| 500 | Internal Server Error |

---

## 8. Security Requirements

### 8.1 Compliance Standards

| Standard | Requirement |
|----------|-------------|
| PCI-DSS | Level 1 compliance for payment data |
| GDPR | Data privacy and right to deletion |
| SOC 2 | Security controls and auditing |
| ISO 27001 | Information security management |

### 8.2 Data Protection

1. **Encryption at Rest:** AES-256 for all stored data
2. **Encryption in Transit:** TLS 1.3 for all communications
3. **Key Management:** Rotating encryption keys every 90 days
4. **Data Retention:** Configurable retention policies (default 90 days)

### 8.3 Access Control

1. **Role-Based Access Control (RBAC)**
   - Admin: Full system access
   - Analyst: View and review transactions
   - Developer: API access only
   - Viewer: Read-only dashboard access

2. **Multi-Factor Authentication (MFA)** - Optional for all accounts

3. **Session Management**
   - Session timeout: 30 minutes of inactivity
   - Secure, HTTP-only cookies
   - CSRF protection enabled

---

## 9. Appendices

### 9.1 ML Model Specifications

**Algorithm:** Logistic Regression with StandardScaler
**Training Dataset:** Kaggle Credit Card Fraud Detection (284,807 transactions)
**Features:** V1-V28 (PCA transformed) + Amount + Time

**Performance Metrics:**
| Metric | Value |
|--------|-------|
| Accuracy | 99.93% |
| Precision | 87.50% |
| Recall | 61.90% |
| F1 Score | 72.50% |
| AUC-ROC | 97.20% |

### 9.2 Technology Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 16, React 19, TypeScript |
| Styling | TailwindCSS 4, shadcn/ui |
| Backend | Next.js API Routes, Node.js |
| Database | PostgreSQL (Supabase) |
| Cache | Redis (Upstash) |
| Payments | Stripe |
| Hosting | Vercel |
| Charts | Recharts, TradingView |

### 9.3 Glossary

| Term | Definition |
|------|------------|
| Fraud Probability | ML model output (0-1) indicating likelihood of fraud |
| Risk Score | Fraud probability scaled to 0-100 |
| Whale Transaction | Cryptocurrency trade exceeding threshold (default $500K) |
| Zero-Knowledge | Encryption where service provider cannot access plaintext |
| Feature Contribution | Amount each ML feature influenced the prediction |

### 9.4 Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-12-25 | Team | Initial draft |
| 2.0 | 2025-12-28 | Team | Added all Finnothon tracks, updated API specs |

---

**Document End**

*PayGuard AI - Protecting Merchants, One Transaction at a Time*

*Finnothon 2025 - Track 3: Fraud Detection API*
