import './dns-fix.js';
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import connectDB from './src/config/db.js';
import rateLimit from 'express-rate-limit';

// Routes
import authRoutes from './src/modules/auth/auth.routes.js';
import userRoutes from './src/modules/user/user.routes.js';
import productRoutes from './src/modules/product/product.routes.js';
import orderRoutes from './src/modules/order/order.routes.js';
import aiRoutes from './src/modules/ai/ai.routes.js';
import adminAuthRoutes from './src/modules/admin/admin.routes.js';
import couponRoutes from './src/modules/coupon/coupon.routes.js';

connectDB();

const app = express();

// ─── Middleware ───────────────────────────────────────────────
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://auraheadphones.vercel.app',
  process.env.CLIENT_URL,
].filter(Boolean);

// Rate Limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: { message: 'Too many requests from this IP, please try again after 15 minutes' },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    // Allow any localhost, any exact match in allowedOrigins, or any Vercel preview URL for the project
    if (
      allowedOrigins.includes(origin) ||
      /^https:\/\/auraheadphones.*\.vercel\.app$/.test(origin)
    ) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
});

import { authAdmin } from './src/modules/admin/admin.controller.js';

// ─── Health Check ─────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'AURA Backend Running' });
});

// ─── API Routes ───────────────────────────────────────────────
app.post('/api/admin/auth/login', apiLimiter, authAdmin);

app.use('/api/admin/auth', apiLimiter, adminAuthRoutes);
app.use('/api/auth', apiLimiter, authRoutes);
app.use('/api/users', apiLimiter, userRoutes);
app.use('/api/products', apiLimiter, productRoutes);
app.use('/api/orders', apiLimiter, orderRoutes);
app.use('/api/ai', apiLimiter, aiRoutes);
app.use('/api/coupons', apiLimiter, couponRoutes);

// ─── 404 Handler ──────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.originalUrl} not found` });
});

// ─── Global Error Handler ─────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('Global Error:', err.message);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
  });
});

// ─── Start Server ─────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});