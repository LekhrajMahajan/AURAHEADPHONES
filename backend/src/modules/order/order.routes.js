import express from 'express';
import { createOrder, getMyOrders } from './order.controller.js';
import protect from '../../middleware/authMiddleware.js';

const router = express.Router();

router.post('/',          protect, createOrder);
router.get('/myorders',   protect, getMyOrders);

export default router;
