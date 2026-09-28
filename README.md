# Military Asset Management System (MAMS)

[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.4-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-18.3-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4-purple.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4.0-06B6D4.svg)](https://tailwindcss.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-336791.svg)](https://www.postgresql.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

A defense-grade, role-based logistics command and inventory control platform designed to track military assets, acquisitions, inter-base transfers, personnel assignments, operational expenditures, and multi-base balance accounting.

---

## 🌐 Live Cloud Deployment

| Service | Environment | Live URL |
| :--- | :--- | :--- |
| **Frontend Web App** | Render Static Site | [military-asset-management-system-frontend-zlcg.onrender.com](https://military-asset-management-system-frontend-zlcg.onrender.com) |
| **Backend REST API** | Render Web Service (Docker) | [military-asset-management-system-backend-rx1w.onrender.com](https://military-asset-management-system-backend-rx1w.onrender.com) |
| **Health Check (Uptime)** | Public Endpoint | [Backend Health Endpoint](https://military-asset-management-system-backend-rx1w.onrender.com/api/health) |
| **API Specification** | JSON Endpoint | [API Documentation Docs](https://military-asset-management-system-backend-rx1w.onrender.com/api/docs) |
| **Database** | Supabase Cloud | PostgreSQL with IPv4 Session Pooler |

> ⚠️ **Important Cloud Hosting Notice (Render Free Tier Cold-Start)**:  
> The backend service is hosted on Render's free tier. After 15 minutes of inactivity, the instance automatically spins down into a sleep state. The first inbound request (e.g. initial login) may take **1 to 2 minutes** to wake up the server container. Subsequent requests will respond with standard fast latency.

---

## 🌟 Key Features

- **Multi-Base Inventory Management**: Real-time asset tracking across defense commands:
  - *Northern Command Base* (`NC-01`)
  - *Western Air Command* (`WAC-02`)
  - *Eastern Naval Command* (`ENC-03`)
- **Equipment Categorization**: Full coverage across 5 tactical military categories:
  - Tactical Transport Vehicles (`Units`)
  - Standard Assault Rifles (`Units`)
  - 5.56mm Ammunition (`Rounds`)
  - Encrypted VHF Radios (`Sets`)
  - Field Trauma Kits (`Kits`)
- **Opening & Closing Balance Accounting**: Period-based balance calculations with exact inventory equations:
  $$\text{Closing Balance} = \text{Opening Balance} + \text{Purchases} + \text{Transfer In} - \text{Transfer Out} - \text{Expenditures}$$
- **Interactive Net Movement Breakdown**: Modal detailing inflows, outflows, and net delta.
- **Transactional Inter-Base Transfers**: Atomic inter-base transfers (`@Transactional`) guaranteeing stock deduction from source and increment at destination without race conditions.
- **Personnel Asset Assignments**: Deploy assets to military personnel with service IDs, track active assignments, and process returns.
- **Operational Expenditure Tracking**: Record ammo and medical kit consumption during drills/operations with live availability verification.
- **High-Contrast Tactical Light Mode**: Clean, permanent daylight military dashboard theme with dynamic Recharts visual trends.
- **Role-Based Access Control (RBAC)**: Fine-grained security for `ADMIN`, `BASE_COMMANDER`, and `LOGISTICS_OFFICER`.
- **System Audit Logging**: Immutable security audit log tracking user mutations, IP addresses, and timestamps.
- **Keep-Alive Public Health Check**: Dedicated `/api/health` endpoint for 24/7 uptime pinging via UptimeRobot to prevent cold starts.

---

## 🏗️ Architecture

```
                    ┌─────────────────────────────────┐
                    │      React 18 / Vite SPA        │
                    │   Tactical Light UI (Tailwind)  │
                    └────────────────┬────────────────┘
                                     │
                               HTTPS / REST
                                     │
                                     ▼
                    ┌─────────────────────────────────┐
                    │      Spring Boot 3.2 (Java 17)  │
                    │  Controllers | Services | JPA   │
                    │  Spring Security 6 (Stateless)  │
                    │  Docker Container on Render     │
                    └────────────────┬────────────────┘
                                     │
                             JDBC (IPv4 Pooler)
                                     │
                                     ▼
                    ┌─────────────────────────────────┐
                    │     Supabase PostgreSQL DB      │
                    │  Bases, Assets, Purchases,      │
                    │  Transfers, Assignments, Logs   │
                    └─────────────────────────────────┘
```

---

## 🔑 Default Credentials

| Role | Username | Password | Base Access |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin` | `Admin@123` | All Bases (HQ) |
| **Base Commander** | `commander` | `Commander@123` | Northern Command Base (`NC-01`) |
| **Logistics Officer** | `logistics` | `Logistics@123` | Northern Command Base (`NC-01`) |

---

## 📡 REST API Reference

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | **Public** | Instant 200 OK service health monitoring (for UptimeRobot) |
| `POST` | `/api/auth/login` | **Public** | Authenticate user credentials & return JWT bearer token |
| `GET` | `/api/docs` | **Public** | Retrieve system API endpoints specification JSON |
| `GET` | `/api/dashboard` | Authenticated | Calculate balances, KPI cards, and movement trends |
| `GET` | `/api/purchases` | Authenticated | Get purchase acquisition history |
| `POST` | `/api/purchases` | Admin / Logistics / Commander | Record new asset purchase and increment base stock |
| `GET` | `/api/transfers` | Authenticated | Inter-base transfer timeline history |
| `POST` | `/api/transfers` | Admin / Logistics / Commander | Initiate atomic inter-base asset transfer |
| `GET` | `/api/assignments` | Authenticated | Personnel equipment deployment records |
| `POST` | `/api/assignments` | Admin / Commander | Deploy asset to officer with personnel ID |
| `PUT` | `/api/assignments/{id}/return` | Admin / Commander | Return assigned asset back to base available stock |
| `GET` | `/api/expenditures` | Authenticated | Operational asset consumption history |
| `POST` | `/api/expenditures` | Admin / Logistics / Commander | Record operational asset expenditure |
| `GET` | `/api/bases` | Authenticated | List all active military bases |
| `GET` | `/api/equipment-types` | Authenticated | List all tactical equipment categories |
| `GET` | `/api/assets` | Authenticated | Current asset inventory matrix across bases |

---

## 🚀 Running Locally

### Prerequisites
- **Java 17+** & **Apache Maven 3.9+**
- **Node.js 18+** & **npm**

### Step 1: Backend Setup
```bash
cd backend
mvn spring-boot:run
```
*Server starts on `http://localhost:8080`.*

### Step 2: Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
*Web app starts on `http://localhost:5173`.*

---

## 🛠️ Environment Configuration

### Backend (`application.yml` or Cloud Environment Variables)
- `SPRING_DATASOURCE_URL`: PostgreSQL JDBC URL (e.g. `jdbc:postgresql://<host>:5432/<dbname>?sslmode=require`)
- `SPRING_DATASOURCE_USERNAME`: Database username
- `SPRING_DATASOURCE_PASSWORD`: Database password
- `APP_JWT_SECRET`: 256-bit Hex secret key for signing tokens
- `CORS_ALLOWED_ORIGINS`: Comma-separated allowed frontend origins

### Frontend (`.env` or Cloud Environment Variables)
- `VITE_API_BASE_URL`: Full backend API base URL (e.g. `https://military-asset-management-system-backend-rx1w.onrender.com/api`)
