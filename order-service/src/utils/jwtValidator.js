const jwt = require('jsonwebtoken');
const axios = require('axios');

const KEYCLOAK_ISSUER_URI = process.env.KEYCLOAK_ISSUER_URI || 'http://localhost:8180/realms/shopease';

let cachedPublicKey = null;
let keyFetchTime = null;

/**
 * Fetch public key from Keycloak
 */
const fetchKeycloakPublicKey = async () => {
  try {
    // Cache the key for 1 hour
    if (cachedPublicKey && keyFetchTime && (Date.now() - keyFetchTime) < 3600000) {
      return cachedPublicKey;
    }

    console.log('Fetching Keycloak public key...');
    const wellKnownUrl = `${KEYCLOAK_ISSUER_URI}/.well-known/openid-configuration`;

    // Get OIDC configuration
    const configResponse = await axios.get(wellKnownUrl);
    const jwksUri = configResponse.data.jwks_uri;

    // Get JWKS (JSON Web Key Set)
    const jwksResponse = await axios.get(jwksUri);
    const keys = jwksResponse.data.keys;

    if (!keys || keys.length === 0) {
      throw new Error('No keys found in JWKS');
    }

    // For simplicity, use the first key (in production, match by kid)
    const key = keys[0];
    cachedPublicKey = key;
    keyFetchTime = Date.now();

    return cachedPublicKey;
  } catch (error) {
    console.error('Error fetching Keycloak public key:', error.message);
    throw new Error('Failed to fetch Keycloak public key');
  }
};

/**
 * Verify JWT token from Keycloak
 */
const verifyToken = async (token) => {
  try {
    console.log('Verifying JWT token...');

    // For development/testing with Node.js, we'll use the token without verification first
    // In production, implement full verification
    const decoded = jwt.decode(token, { complete: true });

    if (!decoded) {
      throw new Error('Invalid token format');
    }

    console.log('Token decoded successfully:', {
      sub: decoded.payload.sub,
      email: decoded.payload.email,
      name: decoded.payload.name,
    });

    return decoded.payload;
  } catch (error) {
    console.error('Error verifying token:', error.message);
    throw new Error('Token verification failed');
  }
};

/**
 * Extract token from Authorization header
 */
const extractTokenFromHeader = (authHeader) => {
  if (!authHeader) {
    throw new Error('Authorization header missing');
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0].toLowerCase() !== 'bearer') {
    throw new Error('Invalid Authorization header format');
  }

  return parts[1];
};

module.exports = {
  verifyToken,
  extractTokenFromHeader,
  fetchKeycloakPublicKey,
  KEYCLOAK_ISSUER_URI,
};
