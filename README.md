# 🎧 Aura Headphones — Premium E-Commerce Platform

Aura Headphones is a **premium e-commerce platform** designed to offer high-fidelity acoustic gear with an unmatched user experience. Built with a modern technology stack, it provides seamless shopping, personalized product recommendations powered by AI, and a smooth, responsive interface.

> 🔗 **Live Demo:** https://auraheadphones.vercel.app/

---

## 🏗️ Architecture Overview

```
AURAHEADPNOES/
├── backend/        ← Node.js + Express REST API server
├── frontend/       ← React + Vite single-page application
├── vercel.json     ← Deployment configuration
└── README.md       ← Project documentation
```

The project is split into two independent apps that communicate over **HTTP (REST API)**.

```
User Browser
    │
    ▼
React (Vite dev server :5173)
    │  API services call → HTTP request
    ▼
Express Server (Backend)
    │  Firebase / Custom auth checks → Route matches → Module runs
    │  Mongoose query
    ▼
MongoDB Atlas (Cloud)
    │  Returns data
    ▼
Backend Modules → JSON Response → React → Updates UI
```

For **authentication**:
```
User (Frontend) ←→ Firebase Auth (Google OAuth or Email/Password)
          │ (Gets Token)
          ▼
Express Server (Firebase Admin SDK verifies token validity securely)
```

---

## ⚙️ Technologies Used & Why

### 🔵 Backend

| Technology | Why It's Used |
|---|---|
| **Node.js** | JavaScript runtime — write server code in the same language as the frontend |
| **Express.js** | Minimal web framework — handles HTTP routes, middleware, request/response |
| **MongoDB** | NoSQL document database — handles massive un-structured product information effectively |
| **Mongoose** | ODM (Object-Document Mapper) — schema validation + easy DB queries in JS |
| **Firebase Admin** | Verifies tokens on the backend securely from the frontend Firebase Auth |
| **JWT (jsonwebtoken)** | Stateless authentication and verification tokens |
| **bcryptjs** | Password hashing — encrypts standalone user credentials securely before saving |
| **Redis** | In-memory data caching — drastically speeds up read-heavy catalog/product fetches |
| **dotenv** | Loads secrets (DB URI, secret keys) from `.env` so they're never hardcoded |
| **cors** | Allows the React frontend to securely hit backend routes crossing origins |
| **express-rate-limit** | Prevents brute-force server attacks by rate-limiting frequent requests |
| **nodemon** | Dev tool — auto-restarts server on file save (dev only) |

### 🟠 Frontend

| Technology | Why It's Used |
|---|---|
| **React 18** | UI library — builds the entire interface using encapsulated components |
| **Vite** | Build tool & dev server — extremely fast hot-reload during development |
| **React Router DOM v7** | Client-side routing — navigates between pages locally without full page reloads |
| **Tailwind CSS** | Utility-first CSS — fast, strictly consistent styling directly mapped in markup |
| **GSAP** | Advanced animation framework — builds complex, high-performance web animations |
| **Lenis (@studio-freight/lenis)** | Smooth scroll library — provides a buttery-smooth scrolling experience for a premium feel |
| **Firebase Auth** | Quick and extremely secure "Sign in with Google" and user authentication |
| **Lucide React** | Industry standard icon library — consistent, scalable SVG icons |
| **PostCSS + Autoprefixer** | Adds vendor prefixes automatically for broad cross-browser compatibility |
| **ESLint** | Catches bugs and enforces JavaScript React standards |

---

## 📁 File-by-File Breakdown

---

### 🔵 BACKEND

#### `backend/server.js` — Entry Point
The backend orchestration starts here. Connects to the database, configures CORS and Rate Limiting, parses JSON, and mounts the API modules.

#### `backend/.env` — Environment Secrets
Stores database connection URIs, PORTs, and any config keys.

#### `backend/package.json` — Dependency List
Lists all backend requirements like mongoose, redis, and firebase-admin.

---

#### `backend/src/modules/` — Feature Services
Instead of flat controllers, the backend follows a modular feature architecture.

| Directory | Purpose |
|---|---|
| `user/` | Profile manipulation, settings, and user querying logic |
| `product/` | Core catalog logic: filtering, pagination, fetching, creating items |
| `order/` | Order creation, historical lookups, and transaction tracking |
| `auth/` | Custom authentication / bridging Firebase users to MongoDB documents |
| `admin/` | Elevated functionality queries and site overview stats |
| `ai/` | Handles tailored AI audiophile prompt recommendations |
| `coupon/` | Discount and promotional code validation mechanics |

---

#### `backend/src/middleware/` — Request Guards

| File | Purpose |
|---|---|
| `Verifyfirebasetoken.js` | Connects via Firebase Admin to physically confirm the frontend token acts genuinely |
| `authMiddleware.js` | JWT extraction verify block; assigns `req.user` for secured endpoints |
| `verifyAdmin.js` | Additional layer validating requesting party holds administrative system privileges |

---

#### `backend/src/config/` — External Systems Configuration

| File | Purpose |
|---|---|
| `db.js` | Script defining the connection string loop to MongoDB Atlas |
| `firebase.js` | Initializes standard Firebase Admin using `serviceAccountKey.json` |

#### `backend/seed.js` — Database Seeder
A one-time script utility populated with early sample headphone datasets to prime a fresh DB.

---

### 🟠 FRONTEND

#### `frontend/index.html` — HTML Shell
The single HTML file where Vite injects the main app via `<div id="root">`.

#### `frontend/vite.config.js` — Vite Build Config
Sets up development port routing and optimized bundle mechanics for the `dist/` rollout.

#### `frontend/tailwind.config.js` — Tailwind Config
Custom brand settings for Aura Headphones including customized hex codes, fonts, and box shadows. 

---

#### `frontend/src/main.jsx` — React Entry Point
Harnesses `<App>` and strict mode to insert React natively into the browser. 

#### `frontend/src/App.jsx` — The Router
Constructs the actual flow tying URL pathnames strictly to Pages components via React Router DOM.

#### `frontend/src/index.css` — Global Styles
Handles base Tailwind imports combined with native custom scrollbar masking or font-family bindings.

---

#### `frontend/src/pages/` — Page Components
Each acts as a primary viewport route handler.

| File | What It Shows |
|---|---|
| `HomePage.jsx` | Full-screen hero experiences, animated blocks, and flagship product teases |
| `ShopPage.jsx` | Accessible product catalog designed for filtering and viewing headsets |
| `ProductDetailsPage.jsx` | Dedicated micro-focus viewing product galleries and pricing parameters |
| `CartPage.jsx` | Shopping bag viewer with checkout staging |
| `CheckoutPage.jsx` | Forms to receive delivery parameters ahead of finalizing purchases |
| `OrderPage.jsx` | Timeline and history layout checking out purchased goods |
| `ProfilePage.jsx` | Allows dynamic edits mapping strictly to the logged-in user |
| `LoginPage.jsx` / `SignupPage.jsx` | Auth panels dealing directly with Firebase Auth elements |
| `admin/` | Protected folder space for Dashboard controls limited to high-level privileges |

---

#### `frontend/src/components/` — Reusable UI Components

| File | Purpose |
|---|---|
| `Navbar.jsx` | Absolute/Sticky navigation map tracking links and active cart totals |
| `Footer.jsx` | Site anchor mapping social branding and disclaimers |
| `AnimatedEqualizer.jsx` | Specialized audio-themed visualizer pushing the premium audiophile vibe |
| `FeatureAccordion.jsx` | Collapsible data lists designed to clean up walls of technical text |
| `ToastNotification.jsx` | System alert overlay broadcasting errors, successes, or items added to cart |

---

#### `frontend/src/context/` (or via external state limits)
*(Conceptual state managers for Authentication and Cart persistence).*

#### `frontend/src/services/` — API Handlers
Dedicated functions mapped strictly out of React components firing Axios/Fetch HTTP calls gracefully to avoid cluttering views.

#### `frontend/src/config/`
Hooks up the localized Firebase app linking directly to the platform API Keys safely.

#### `frontend/public/`
Host directory for untouched raw assets like vectors and SVGs skipping the Vite bundle loop.

---

## 🚀 Root-Level Files

| File | Purpose |
|---|---|
| `README.md` | Primary instructional markdown covering features and stack specifics |
| `vercel.json` | Explicit directives for URL rewriting matching SPAs upon deploy |
| `.gitignore` | Prohibits git branches from absorbing heavy local dependencies or secrets |

---

## 🎯 Why This Stack?

| Choice | Reason |
|---|---|
| **React + Vite** | Provides lightning-fast compilation, optimizing developer productivity |
| **Node.js Modules Architecture** | Keeps massive backend APIs exceptionally clean and isolated by function (AI, User, Product, Order) |
| **GSAP & Lenis combination** | Essential block for executing a true luxury feeling; smooth scrolling breaks the rigidity typical of SPAs |
| **Firebase Authentication** | Completely removes the nightmare of handling manual OAuth flow risks handling massive scale natively out of the box |
| **TailwindCSS** | Rapid scale iteration enforcing strict brand-wide margins without needing external, disjointed `.css` tracking |
| **Redis Caching** | Prevents DB hammering by snapping quick reads for catalog items handling heavy e-commerce traffic with low latency |

---

## 🛠️ Running Locally

### Prerequisites
- Node.js 18+
- MongoDB instance (Atlas or local) / Firebase Project

### Backend
```bash
cd backend
npm install
# Configure your .env via required service connections (MONGO, PORT, etc.)
npm run dev     
```

### Frontend
```bash
cd frontend
npm install
npm run dev     # App starts natively on HTTP :5173
```

---

## 👤 User Roles

| Role | Capabilities |
|---|---|
| **Buyer** | View shop pages, consult AI recommender, edit personal profiles, track and place orders securely |
| **Admin** | Possesses elevated privileges across endpoints dictating platform item availability and system overview metrics |

---

## 📄 License

© 2026 Aura Headphones. All rights reserved. Designed and developed by Lekhraj Mahajan.
