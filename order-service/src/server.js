require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const { sequelize } = require('./config/database');
const { startEurekaClient, stopEurekaClient } = require('./config/eureka');
const { closeRabbit } = require('./messaging/rabbitmq');
// Import models to register them with Sequelize
require('./models/Order');
require('./models/OrderItem');
const orderRoutes = require('./routes/orderRoutes');

const app = express();
const PORT = process.env.PORT || 8082;
let server;

// Middleware
app.use(morgan('combined'));
// Note: CORS is handled by API Gateway, not needed here
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Health check endpoint (before JWT middleware)
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'Service is running', timestamp: new Date() });
});

// API Routes
app.use('/orders', orderRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    status: err.status || 500
  });
});

// Initialize database and start server
const start = async () => {
  try {
    // Sync database models
    await sequelize.sync({ alter: false });
    console.log('Database connected and synchronized');

    // Start server
    server = app.listen(PORT, async () => {
      console.log(`Order Service running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV}`);
      console.log(`Database: ${process.env.DB_NAME}@${process.env.DB_HOST}:${process.env.DB_PORT}`);

      await startEurekaClient();
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

const shutdown = async (signal) => {
  console.log(`${signal} received, shutting down Order Service...`);

  try {
    await stopEurekaClient();
    await closeRabbit();
    await sequelize.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error during shutdown:', error.message || error);
  }

  if (server) {
    server.close(() => {
      console.log('HTTP server closed');
      process.exit(0);
    });
    return;
  }

  process.exit(0);
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

start();

module.exports = app;
