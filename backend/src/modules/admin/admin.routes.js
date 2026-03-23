import express from 'express';
import { authAdmin, updateAdminCredentials } from './admin.controller.js';
import { protectAdmin } from '../../middleware/verifyAdmin.js';

const router = express.Router();

router.post('/login', authAdmin);
router.put('/update', protectAdmin, updateAdminCredentials);

export default router;
