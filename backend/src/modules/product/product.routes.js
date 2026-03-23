import express from 'express';
import { getProducts, getProductById, createProduct, updateProduct, deleteProduct } from './product.controller.js';
import { protectAdmin } from '../../middleware/verifyAdmin.js';

const router = express.Router();

router.get('/',    getProducts);
router.get('/:id', getProductById);

router.post('/', protectAdmin, createProduct);
router.put('/:id', protectAdmin, updateProduct);
router.delete('/:id', protectAdmin, deleteProduct);

export default router;
