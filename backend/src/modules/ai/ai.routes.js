import express from 'express';
import { getAIRecommendation } from './ai.controller.js';
import protect from '../../middleware/authMiddleware.js';

const router = express.Router();

router.post('/recommend', protect, getAIRecommendation);

export default router;