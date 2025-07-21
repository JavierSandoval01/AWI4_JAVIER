import express from "express";
import { createOrder, updateOrderToPaid, cancelOrder, getOrder } from "../controllers/order.contoller";

const router = express.Router();

router.get('/order', getOrder);
router.post('/order', createOrder);
router.put('/order/:id', updateOrderToPaid);
router.delete('/order/:id', cancelOrder);

export default router;