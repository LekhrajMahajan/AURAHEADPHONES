import express from 'express';
import { getProfile, updateProfile, getAllUsers, toggleBlockUser, getAdminStats } from './user.controller.js';
import protect from '../../middleware/authMiddleware.js';
import { protectAdmin } from '../../middleware/verifyAdmin.js';

const router = express.Router();

router.get('/profile',  protect, getProfile);
router.put('/profile',  protect, updateProfile);

// Admin Routes
router.get('/admin/all', protectAdmin, getAllUsers);
router.put('/admin/:id/block', protectAdmin, toggleBlockUser);
router.get('/admin/stats', protectAdmin, getAdminStats);

export default router;
