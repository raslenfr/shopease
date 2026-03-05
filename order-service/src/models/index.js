const Order = require('./Order');
const OrderItem = require('./OrderItem');

// Relationships are already defined in OrderItem.js
// No need to define them again here - this causes duplicate association errors

module.exports = {
  Order,
  OrderItem,
};
