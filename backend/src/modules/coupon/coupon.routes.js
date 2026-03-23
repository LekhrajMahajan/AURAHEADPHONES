import express from 'express';
import { getCoupons, createCoupon, deleteCoupon, validateCoupon } from './coupon.controller.js';
import { protectAdmin } from '../../middleware/verifyAdmin.js';

const router = express.Router();

router.get('/', protectAdmin, getCoupons);
router.post('/', protectAdmin, createCoupon);
router.delete('/:id', protectAdmin, deleteCoupon);
router.post('/validate', validateCoupon); // Public - used at checkout

export default router;
