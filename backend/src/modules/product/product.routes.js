import express from 'express';
import { getProducts, getProductById, seedProducts } from './product.controller.js';

const router = express.Router();

router.get('/',        getProducts);
router.post('/seed',   seedProducts);   // Protected seed — before /:id
router.get('/:id',     getProductById);

export default router;
