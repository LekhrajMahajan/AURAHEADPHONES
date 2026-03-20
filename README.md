# Aura Headphones

Aura Headphones is a premium e-commerce platform designed to offer high-fidelity acoustic gear with an unmatched user experience. Built with a modern technology stack, it provides seamless shopping, personalized product recommendations powered by AI, and a smooth, responsive interface.

## 🚀 Features

*   **Premium E-Commerce Experience:** A sleek, modern UI with smooth scrolling and micro-animations designed to reflect the high-quality nature of the products.
*   **AI Audiophile Concierge:** An integrated AI assistant that analyzes user listening habits and preferences to recommend the perfect headphone match.
*   **Secure Authentication:** User login and registration powered by **Firebase Authentication** (Supports Email/Password verification and Google OAuth).
*   **Dynamic Cart & Checkout:** Real-time shopping cart management and seamless checkout flow.
*   **Responsive Design:** Fully optimized for mobile, tablet, and desktop viewing.
*   **High Performance:** Intelligent image preloading, lazy-loaded route components, and non-render-blocking font strategies to ensure lightning-fast performance and zero layout shifts.

## 🛠️ Technology Stack

*   **Frontend:** React (Vite), Tailwind CSS, React Router DOM, Lucide React (Icons).
*   **State Management:** React Hooks (`useState`, `useEffect`) and Context API.
*   **Authentication:** Firebase Auth.
*   **Backend / API:** Node.js, Express (handles product fetching and AI recommendations).
*   **Database:** MongoDB / Backend sync logic integration.

## 📂 Project Structure

The repository is divided into two primary directories:

*   `/frontend` - Contains the React Vite application.
    *   `/src/pages/` - Core views like `HomePage`, `ShopPage`, `ProductDetailsPage`, `CartPage`, `CheckoutPage`, `LoginPage`.
    *   `/src/components/` - Reusable UI components like `Navbar`, `Footer`, and `ToastNotification`.
    *   `/src/config/` - Firebase configurations.
    *   `/src/services/` - API integrations to communicate with the backend.
*   `/backend` - Contains the server logic, database models, and API endpoints (including AI logic).

## 🏃‍♂️ Running Locally

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd AURAHEADPNOES
   ```

2. **Start the Backend:**
   Navigate into the backend directory, install dependencies, and start the development server.
   ```bash
   cd backend
   npm install
   npm run dev
   ```

3. **Start the Frontend:**
   Open a new terminal, navigate to the frontend directory, install dependencies, and run Vite.
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

4. **Access the Application:**
   Open your browser and navigate to `http://localhost:5173` (or the port specified by Vite).

## 💡 Recent Optimizations

*   **Code Splitting:** Applied `React.lazy` and `Suspense` for asynchronous route loading to significantly reduce initial bundle size.
*   **Immediate Image Delivery:** Implemented programmatic global image preloading in global state to ensure images on the Shop and Home pages render instantaneously without lazy-loading pop-ins.
*   **Accessibility (A11y):** Full WCAG-compliance achieved with stringent color contrast ratios, proper heading hierarchies (`h1`, `h2`, `h3`), and comprehensive `aria-labels` on interactive elements.

## 📜 License

© 2026 Aura Headphones. All rights reserved. Designed and developed by Lekhraj Mahajan.
