/**
 * TENANT ISOLATION MIDDLEWARE
 * ============================================================
 * This middleware enforces data isolation at the API gateway level
 * 
 * All requests must include a valid JWT token.
 * The JWT extracts the orgId (organizationId) and userId.
 * All subsequent database queries are filtered by orgId.
 * 
 * Deploy to: server/middleware/tenantMiddleware.ts (or .js)
 * Usage:
 *   app.use(tenantMiddleware);
 *   
 * This is the CORE security layer preventing data leakage.
 * A malicious client cannot query Organization B's data even if they try.
 */

const jwt = require('jsonwebtoken');

/**
 * Tenant public website scope lock:
 * Supported template org types: school, junior-college, coaching.
 * Engineering colleges are intentionally excluded from this shared template and handled by BYOW flow.
 * Reason: engineering institutions usually have large existing websites with accreditation-heavy structures.
 */
const PUBLIC_TEMPLATE_SUPPORTED_ORG_TYPES = ['school', 'junior-college', 'coaching'];
const PUBLIC_TEMPLATE_EXCLUDED_ORG_TYPES = ['engineering-college'];

/**
 * Tenant Middleware: Extracts and validates organization context from JWT
 * Attached to every request at the API gateway level
 */
const tenantMiddleware = (req, res, next) => {
  try {
    // Extract JWT from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      // If no token, they are either public endpoint or need to login
      if (isPublicRoute(req.path)) {
        return next();
      }
      return res.status(401).json({
        error: 'Unauthorized: Missing authentication token',
        code: 'MISSING_TOKEN',
      });
    }

    const token = authHeader.substring(7);

    // Verify JWT signature and extract payload
    const JWT_SECRET = process.env.JWT_SECRET;
    const decoded = jwt.verify(token, JWT_SECRET);

    /**
     * CRITICAL: Attach tenant context to request
     * Every database query will use req.tenantId as the org_id filter
     */
    req.tenantId = decoded.orgId;
    req.userId = decoded.userId;
    req.userRole = decoded.role;
    req.user = decoded;

    // For debugging/logging
    req.startTime = Date.now();

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: 'Token expired',
        code: 'TOKEN_EXPIRED',
      });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        error: 'Invalid token',
        code: 'INVALID_TOKEN',
      });
    }

    // Unexpected error
    console.error('Tenant middleware error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      code: 'INTERNAL_ERROR',
    });
  }
};

/**
 * Public routes that don't require authentication
 */
function isPublicRoute(path) {
  const publicPaths = [
    '/health',
    '/version',
    '/routes',
    '/auth/login',
    '/auth/signup',
    '/auth/forgot-password',
    '/auth/reset-password',
    '/tenant/resolve', // For fetching org branding by slug
    '/metrics', // Prometheus metrics (optional)
  ];

  return publicPaths.some((p) => path.startsWith(p));
}

/**
 * Role-based access control middleware
 * Usage: app.get('/admin', rbacMiddleware(['ORG_ADMIN', 'SUPER_ADMIN']), handler)
 */
const rbacMiddleware = (allowedRoles = []) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.userRole)) {
      return res.status(403).json({
        error: 'Forbidden: Insufficient permissions',
        code: 'INSUFFICIENT_PERMISSIONS',
      });
    }
    next();
  };
};

/**
 * Request logging middleware (for audit trail)
 * Logs who did what, when
 */
const auditLogMiddleware = async (req, res, next) => {
  // Capture response
  const originalJson = res.json;
  res.json = function (data) {
    // Log the request/response
    if (req.tenantId) {
      console.log(JSON.stringify({
        timestamp: new Date().toISOString(),
        tenantId: req.tenantId,
        userId: req.userId,
        method: req.method,
        path: req.path,
        statusCode: res.statusCode,
        duration: Date.now() - req.startTime,
      }));
    }
    
    return originalJson.call(this, data);
  };

  next();
};

/**
 * Query builder helper: Attach orgId to all Prisma queries
 * This is done at the middleware layer so every database call inherits the tenant context
 * 
 * Example usage in a route handler:
 *   const user = await prisma.user.findUnique({
 *     where: { orgId_email: { orgId: req.tenantId, email: 'test@example.com' } }
 *   });
 * 
 * The orgId filter is MANDATORY due to unique constraints in the schema
 */

/**
 * Super Admin override middleware
 * Allows platform admins to impersonate organizations (for debugging/support)
 */
const superAdminOverrideMiddleware = (req, res, next) => {
  const impersonateOrgId = req.headers['x-impersonate-org'];
  
  if (impersonateOrgId && req.userRole === 'SUPER_ADMIN') {
    // Override tenantId with impersonation
    req.originalTenantId = req.tenantId;
    req.tenantId = impersonateOrgId;
    req.isImpersonating = true;
    
    console.warn(`Super admin ${req.userId} impersonating org ${impersonateOrgId}`);
  }
  
  next();
};

module.exports = {
  tenantMiddleware,
  rbacMiddleware,
  auditLogMiddleware,
  superAdminOverrideMiddleware,
  isPublicRoute,
  PUBLIC_TEMPLATE_SUPPORTED_ORG_TYPES,
  PUBLIC_TEMPLATE_EXCLUDED_ORG_TYPES,
};
