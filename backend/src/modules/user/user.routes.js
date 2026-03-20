import express from 'express';
import { getProfile, updateProfile } from './user.controller.js';
import protect from '../../middleware/authMiddleware.js';

const router = express.Router();

router.get('/profile',  protect, getProfile);
router.put('/profile',  protect, updateProfile);

export default router;
