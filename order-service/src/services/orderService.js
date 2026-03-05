const { Order, OrderItem } = require('../models');
const { getProductById } = require('./productClient');
const { publishOrderPlacedEvent } = require('../messaging/rabbitmq');

/**
 * Place a new order
 * @param {Object} orderRequest - Order request data
 * @param {string} customerEmail - Customer email from JWT
 * @returns {Promise<Object>} Created order with order items
 */
const placeOrder = async (orderRequest, customerEmail) => {
  try {
    console.log(`Placing order for customer: ${customerEmail}`);

    // Validate request
    if (!orderRequest.orderItems || orderRequest.orderItems.length === 0) {
      throw new Error('Order must contain at least one item');
    }

    // Process each order item
    const orderItemsData = [];
    let totalAmount = 0;

    for (const itemDto of orderRequest.orderItems) {
      console.log(`Processing item - Product ID: ${itemDto.productId}, Quantity: ${itemDto.quantity}`);

      // Fetch product details from Product Service
      const product = await getProductById(itemDto.productId);

      // Validate stock
      if (product.stock < itemDto.quantity) {
        throw new Error(
          `Insufficient stock for product ${product.name}. Available: ${product.stock}, Requested: ${itemDto.quantity}`
        );
      }

      // Calculate item total
      const itemTotal = product.price * itemDto.quantity;
      totalAmount += itemTotal;

      // Prepare order item
      orderItemsData.push({
        productId: itemDto.productId,
        quantity: itemDto.quantity,
        price: product.price,
      });
    }

    // Create order in database
    const order = await Order.create(
      {
        customerEmail,
        orderDate: new Date(),
        totalAmount,
        status: 'PLACED',
        orderItems: orderItemsData,
      },
      { include: ['orderItems'] }
    );

    console.log(`Order created successfully with ID: ${order.id}`);

    try {
      await Promise.all(
        orderItemsData.map((item) =>
          publishOrderPlacedEvent({
            orderId: order.id,
            productId: item.productId,
            quantity: item.quantity,
          })
        )
      );
      console.log(`Published ${orderItemsData.length} order placed event(s) for order ${order.id}`);
    } catch (eventError) {
      console.error('Failed to publish order placed event(s):', eventError.message || eventError);
    }

    return order;
  } catch (error) {
    console.error('Error placing order:', error.message);
    throw error;
  }
};

/**
 * Get all orders for a customer
 * @param {string} customerEmail - Customer email from JWT
 * @returns {Promise<Array>} List of orders with items
 */
const getOrdersByCustomerEmail = async (customerEmail) => {
  try {
    console.log(`Fetching orders for customer: ${customerEmail}`);

    const orders = await Order.findAll({
      where: { customerEmail },
      include: [
        {
          association: 'orderItems',
          attributes: ['id', 'productId', 'quantity', 'price'],
        },
      ],
      order: [['orderDate', 'DESC']],
    });

    console.log(`Found ${orders.length} orders for customer`);
    return orders;
  } catch (error) {
    console.error('Error fetching orders:', error.message);
    throw error;
  }
};

/**
 * Count order items for a given product
 * @param {number} productId
 * @returns {Promise<number>}
 */
const getOrderCountByProduct = async (productId) => {
  try {
    const count = await OrderItem.count({
      where: { productId },
    });
    return count;
  } catch (error) {
    console.error('Error counting orders for product:', error.message);
    throw error;
  }
};

module.exports = {
  placeOrder,
  getOrdersByCustomerEmail,
  getOrderCountByProduct,
};
