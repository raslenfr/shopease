const express = require('express');
const router = express.Router();
const { createOrder, getMyOrders, healthCheck, getProductOrderCount } = require('../controllers/orderController');
const { authMiddleware } = require('../middleware/authMiddleware');

// Health check (public)
router.get('/health', healthCheck);
// Public: count orders for a product (used by Product Service)
router.get('/product/:productId/count', getProductOrderCount);

// Protected routes (require authentication)
// POST /orders - Create new order
router.post('/', authMiddleware, createOrder);

// GET /orders/my-orders - Get customer's orders
router.get('/my-orders', authMiddleware, getMyOrders);

module.exports = router;
