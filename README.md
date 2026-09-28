# Military Asset Management System

[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.4-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-18.3-blue.svg)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4.0-06B6D4.svg)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

A secure, role-based logistics management platform designed to track military assets, purchases, transfers, personnel assignments, operational expenditures, and multi-base closing balances.

---

## 🌟 Key Features

- **Multi-Base Inventory Management**: Track active, available, assigned, and expended stock across bases (Base Alpha, Base Bravo, Base Charlie).
- **Opening & Closing Balance Accounting**: Period-based balance calculations with exact inventory equations:
  $$\text{Closing Balance} = \text{Opening Balance} + \text{Purchases} + \text{Transfer In} - \text{Transfer Out} - \text{Expenditures}$$
- **Interactive Net Movement Breakdown**: Clickable Net Movement modal detailing inflows and outflows.
- **Transactional Inter-Base Transfers**: Atomic transfers (`@Transactional`) guaranteeing stock is deducted from source and added to destination without partial failures.
- **Personnel Asset Assignments**: Assign equipment to officers with personnel IDs, track active assignments, and process returns.
- **Expenditure Tracking**: Record operational consumption with real-time stock availability verification feedback.
- **Role-Based Access Control (RBAC)**: Fine-grained security for `ADMIN`, `BASE_COMMANDER`, and `LOGISTICS_OFFICER`.
- **System Audit Logging**: Immutable security audit log tracking user actions, entity mutations, IP addresses, and timestamps.
- **Swagger / OpenAPI 3.0 Documentation**: Interactive REST API sandbox.
- **Tactical Dark Mode Dashboard**: Responsive UI with Recharts movement trends and stock distribution graphs.

---

## 🏗️ Architecture

```
                    ┌──────────────────────┐
                    │       Browser        │
                    │   React Web App      │
                    └──────────┬───────────┘
                               │
                         HTTPS / REST
                               │
                               ▼
                    ┌──────────────────────┐
                    │      Spring Boot     │
                    │       Backend        │
                    │                      │
                    │  Controllers         │
                    │  Services            │
                    │  Security / JWT      │
                    │  Repositories        │
                    └──────────┬───────────┘
                               │
                         JPA / Hibernate
                               │
                               ▼
                    ┌──────────────────────┐
                    │      PostgreSQL      │
                    │       Database       │
                    └──────────┬───────────┘
```

---

## 🔑 Demo Test Credentials

| Role | Username | Password | Base Access |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin` | `Admin@123` | All Bases (HQ) |
| **Base Commander** | `commander_alpha` | `Commander@123` | Base Alpha |
| **Logistics Officer** | `logistics` | `Logistics@123` | Base Alpha |

> *Note: On the login screen, you can click any of the preset account cards to auto-fill credentials!*

---

## 🚀 Quick Start (Running Locally)

### Prerequisites
- **Java 17** & **Apache Maven 3.9+**
- **Node.js 18+** & **npm**

### Step 1: Start Backend API
```bash
cd backend
mvn spring-boot:run
```
*The Spring Boot server starts at `http://localhost:8080`. Seed data is auto-populated.*

### Step 2: Start React Frontend
```bash
cd frontend
npm install
npm run dev
```
*Open `http://localhost:5173` in your browser.*

---

## 📁 Repository Structure

```
military-asset-management-system/
│
├── backend/                  # Spring Boot 3 Java 17 Project
│   ├── src/main/java/com/military/assetmanagement/
│   │   ├── config/           # Security, OpenAPI, DataSeeder
│   │   ├── controller/       # REST API Controllers
│   │   ├── dto/              # Request / Response DTOs
│   │   ├── entity/           # JPA Entities
│   │   ├── exception/        # Global Exception Handler
│   │   ├── repository/       # Data JPA Repositories
│   │   ├── security/         # JWT Filters & UserDetailsService
│   │   └── service/          # Core Business Services
│   └── pom.xml
│
├── frontend/                 # Vite + React + Tailwind CSS Web App
│   ├── src/
│   │   ├── components/       # Reusable UI Components & Modals
│   │   ├── context/          # Auth Context & Theme Context
│   │   ├── pages/            # Dashboard, Purchases, Transfers, Assignments & Expenditures, Docs, Login
│   │   ├── services/         # Axios API Services
│   │   └── utils/            # RBAC Helpers
│   └── vite.config.js
│
└── README.md
```

---

## 🎥 Suggested 3-5 Minute Video Walkthrough Script

1. **0:00–0:30 (Problem & Overview)**: Explain the military asset management system goals across multiple bases.
2. **0:30–1:00 (Architecture & Security)**: Highlight 3-tier architecture (React → Spring Boot → PostgreSQL), JWT auth, and RBAC.
3. **1:00–1:40 (Dashboard & Net Movement)**: Demo login as Admin, filter controls, KPI cards, and click the **Net Movement Modal** breakdown.
4. **1:40–2:20 (Purchase Transaction)**: Record a new purchase and show automatic stock level increment.
5. **2:20–3:00 (Inter-Base Transfer)**: Execute transfer from Base Alpha to Base Bravo. Show visual flow card update.
6. **3:00–3:30 (Assignments & Expenditures)**: Assign asset to personnel, demonstrate return asset flow, and record expenditure with stock validation check.
7. **3:30–4:00 (Audit Logs & Swagger)**: Show immutable audit trail table and Swagger UI at `/swagger-ui.html`.
