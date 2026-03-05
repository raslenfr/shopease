const { placeOrder, getOrdersByCustomerEmail, getOrderCountByProduct } = require('../services/orderService');

/**
 * Create a new order
 * POST /orders
 */
const createOrder = async (req, res) => {
  try {
    console.log('POST /orders - Creating new order');

    // Get customer email from JWT
    const customerEmail = req.user.email;
    if (!customerEmail) {
      return res.status(400).json({ error: 'Customer email not found in token' });
    }

    // Validate request body
    const { orderItems } = req.body;
    if (!orderItems || !Array.isArray(orderItems) || orderItems.length === 0) {
      return res.status(400).json({
        error: 'Invalid request',
        message: 'orderItems must be a non-empty array',
        example: {
          orderItems: [
            { productId: 1, quantity: 5 },
            { productId: 2, quantity: 2 },
          ],
        },
      });
    }

    // Place order
    const order = await placeOrder(req.body, customerEmail);

    res.status(201).json({
      message: 'Order placed successfully',
      order: {
        id: order.id,
        customerEmail: order.customerEmail,
        orderDate: order.orderDate,
        totalAmount: order.totalAmount,
        status: order.status,
        orderItems: order.orderItems.map((item) => ({
          id: item.id,
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
        })),
      },
    });
  } catch (error) {
    console.error('Error creating order:', error.message);
    res.status(400).json({
      error: 'Failed to create order',
      message: error.message,
      timestamp: new Date(),
    });
  }
};

/**
 * Get all orders for the authenticated customer
 * GET /orders/my-orders
 */
const getMyOrders = async (req, res) => {
  try {
    console.log('GET /orders/my-orders - Fetching customer orders');

    // Get customer email from JWT
    const customerEmail = req.user.email;
    if (!customerEmail) {
      return res.status(400).json({ error: 'Customer email not found in token' });
    }

    // Get orders
    const orders = await getOrdersByCustomerEmail(customerEmail);

    res.status(200).json({
      message: 'Orders retrieved successfully',
      count: orders.length,
      orders: orders.map((order) => ({
        id: order.id,
        customerEmail: order.customerEmail,
        orderDate: order.orderDate,
        totalAmount: order.totalAmount,
        status: order.status,
        orderItems: order.orderItems.map((item) => ({
          id: item.id,
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
        })),
      })),
    });
  } catch (error) {
    console.error('Error fetching orders:', error.message);
    res.status(500).json({
      error: 'Failed to retrieve orders',
      message: error.message,
      timestamp: new Date(),
    });
  }
};

/**
 * Health check endpoint
 * GET /orders/health
 */
const healthCheck = (req, res) => {
  res.status(200).json({
    status: 'Order Service is running',
    timestamp: new Date(),
  });
};

/**
 * Get total order items for a product
 * GET /orders/product/:productId/count
 */
const getProductOrderCount = async (req, res) => {
  try {
    const productId = parseInt(req.params.productId, 10);
    if (Number.isNaN(productId)) {
      return res.status(400).json({ error: 'Invalid productId' });
    }

    const count = await getOrderCountByProduct(productId);
    res.status(200).json({ productId, count });
  } catch (error) {
    console.error('Error fetching product order count:', error.message);
    res.status(500).json({
      error: 'Failed to fetch product order count',
      message: error.message,
      timestamp: new Date(),
    });
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  healthCheck,
  getProductOrderCount,
};
