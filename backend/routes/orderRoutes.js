import express from "express"
import asyncHandler from "../middleware/asyncHandler.js";
import {getProductById, getProducts} from "../config/controllers/productController.js";
import {getOrders,addOrderItems, getMyOrders, getOrderById, updateOrderToPaid, updateOrderToDelivered} from "../config/controllers/orderController.js";
import {admin, protect} from "../middleware/authMiddleware.js";



const router = express.Router()

router.route('/').get(protect, admin,getOrders).post(protect, addOrderItems);
router.route('/mine').get(protect, getMyOrders);
router.route('/:id').get(protect, getOrderById);
router.route('/:id/pay').put(protect, updateOrderToPaid);
router.route('/:id/deliver').put(protect,admin, updateOrderToDelivered);






export default router;