const axios = require('axios');

const PRODUCT_SERVICE_URL = process.env.PRODUCT_SERVICE_URL || 'http://localhost:8081';

const productClient = axios.create({
  baseURL: PRODUCT_SERVICE_URL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Get product details by ID from Product Service
 * @param {number} productId - Product ID
 * @returns {Promise<Object>} Product details
 */
const getProductById = async (productId) => {
  try {
    console.log(`Calling Product Service: GET /products/${productId}`);
    const response = await productClient.get(`/products/${productId}`);
    console.log(`Product service returned:`, response.data);
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      throw new Error(`Product with ID ${productId} not found`);
    }
    console.error(`Error calling Product Service:`, error.message);
    throw new Error(`Failed to fetch product details: ${error.message}`);
  }
};

module.exports = {
  getProductById,
  productClient,
};
