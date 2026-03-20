import express from 'express';
import { syncUser } from './auth.controller.js';
import verifyFirebaseToken from '../../middleware/verifyFirebaseToken.js';

const router = express.Router();

router.post('/sync', verifyFirebaseToken, syncUser);

export default router;