import { createProduct, getProducts, updateProduct, deleteProduct } from "../controllers/product.contoller";
import express from 'express'
const router = express.Router();

router.post('/product', createProduct);
router.get('/product', getProducts);
router.put('/product/:id', updateProduct);
router.delete('/product/:id', deleteProduct);

export default router;