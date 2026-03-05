const { verifyToken, extractTokenFromHeader } = require('../utils/jwtValidator');

/**
 * Authentication middleware to verify JWT tokens
 */
const authMiddleware = async (req, res, next) => {
  try {
    // Extract token from Authorization header
    const authHeader = req.headers.authorization;
    const token = extractTokenFromHeader(authHeader);

    // Verify token
    const decoded = await verifyToken(token);

    // Attach user info to request
    req.user = {
      sub: decoded.sub,
      email: decoded.email,
      name: decoded.name,
      roles: decoded.realm_access?.roles || [],
      realmAccess: decoded.realm_access,
    };

    console.log(`Authenticated user: ${req.user.email}`);
    next();
  } catch (error) {
    console.error('Authentication failed:', error.message);
    res.status(401).json({
      error: 'Unauthorized',
      message: error.message,
      timestamp: new Date(),
    });
  }
};

/**
 * Optional authentication middleware for public endpoints
 */
const optionalAuthMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      req.user = null;
      return next();
    }

    const token = extractTokenFromHeader(authHeader);
    const decoded = await verifyToken(token);

    req.user = {
      sub: decoded.sub,
      email: decoded.email,
      name: decoded.name,
      roles: decoded.realm_access?.roles || [],
    };

    next();
  } catch (error) {
    // If token is invalid, continue without user context
    req.user = null;
    next();
  }
};

/**
 * Role-based access control middleware
 */
const requireRole = (requiredRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Authentication required',
      });
    }

    const userRoles = req.user.roles || [];
    const hasRequiredRole = requiredRoles.some((role) =>
      userRoles.includes(role) || userRoles.includes(`ROLE_${role}`)
    );

    if (!hasRequiredRole) {
      return res.status(403).json({
        error: 'Forbidden',
        message: `Required roles: ${requiredRoles.join(', ')}`,
        userRoles,
      });
    }

    next();
  };
};

module.exports = {
  authMiddleware,
  optionalAuthMiddleware,
  requireRole,
};
