import express from 'express';
import { createOrder, getMyOrders, getAllOrders, updateOrderStatus } from './order.controller.js';
import protect from '../../middleware/authMiddleware.js';
import { protectAdmin } from '../../middleware/verifyAdmin.js';

const router = express.Router();

router.post('/', protect, createOrder);
router.get('/myorders', protect, getMyOrders);

// Admin Routes
router.get('/all', protectAdmin, getAllOrders);
router.put('/:id/status', protectAdmin, updateOrderStatus);

export default router;
