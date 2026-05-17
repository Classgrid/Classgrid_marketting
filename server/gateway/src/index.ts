/**
 * API GATEWAY - Main entry point for all microservices
 * Routes incoming requests to the correct microservice
 * Enforces tenant isolation via JWT verification
 */

const express = require('express');
const { createProxyMiddleware } = require('express-http-proxy');
const { tenantMiddleware, auditLogMiddleware } = require('../../middleware/tenantMiddleware');

const app = express();

// ============================================================
// MIDDLEWARE
// ============================================================

// Parse JSON
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));

// Request logging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// ============================================================
// SERVICE REGISTRY
// ============================================================

const serviceRegistry = {
  auth: process.env.AUTH_SERVICE_URL || 'http://localhost:4101',
  tenant: process.env.TENANT_SERVICE_URL || 'http://localhost:4102',
  payment: process.env.PAYMENT_SERVICE_URL || 'http://localhost:4103',
  chat: process.env.CHAT_SERVICE_URL || 'http://localhost:4104',
  notes: process.env.NOTES_SERVICE_URL || 'http://localhost:4105',
  notification: process.env.NOTIFICATION_SERVICE_URL || 'http://localhost:4106',
};

// ============================================================
// PUBLIC ROUTES (No auth required)
// ============================================================

app.get('/health', (req, res) => {
  res.json({
    ok: true,
    service: 'gateway',
    timestamp: new Date().toISOString(),
  });
});

app.get('/version', (req, res) => {
  res.json({
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
  });
});

app.get('/routes', (req, res) => {
  res.json({
    gateway: ['/health', '/version', '/routes', '/api/:service/*'],
    services: Object.keys(serviceRegistry),
    serviceUrls: serviceRegistry,
  });
});

// ============================================================
// PROTECTED ROUTES (Tenant middleware + proxying)
// ============================================================

// Apply tenant middleware to all /api/* routes
app.use('/api', tenantMiddleware);

// Optional: Apply audit logging
app.use('/api', auditLogMiddleware);

// ============================================================
// SERVICE ROUTING WITH PROXYING
// ============================================================

// Proxy each service
Object.entries(serviceRegistry).forEach(([serviceName, serviceUrl]) => {
  app.use(
    `/api/${serviceName}`,
    createProxyMiddleware({
      target: serviceUrl,
      changeOrigin: true,
      pathRewrite: {
        [`^/api/${serviceName}`]: '', // Remove /api/service prefix before forwarding
      },
      onProxyReq(proxyReq, req, res) {
        // Attach tenant context to upstream service
        proxyReq.setHeader('X-Tenant-ID', req.tenantId || '');
        proxyReq.setHeader('X-User-ID', req.userId || '');
        proxyReq.setHeader('X-User-Role', req.userRole || '');
        proxyReq.setHeader('X-Forwarded-For', req.ip);
        
        // Pass JWT to upstream services
        const authHeader = req.headers.authorization;
        if (authHeader) {
          proxyReq.setHeader('Authorization', authHeader);
        }
      },
      onError(err, req, res) {
        console.error(`Proxy error for ${serviceName}:`, err.message);
        res.status(503).json({
          error: `Service ${serviceName} is unavailable`,
          code: 'SERVICE_UNAVAILABLE',
          message: err.message,
        });
      },
    })
  );
});

// ============================================================
// ERROR HANDLING
// ============================================================

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.path,
    method: req.method,
    code: 'NOT_FOUND',
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Gateway error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    code: 'INTERNAL_ERROR',
  });
});

// ============================================================
// START SERVER
// ============================================================

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`[Gateway] Running on port ${PORT}`);
  console.log(`[Gateway] Services:`, Object.keys(serviceRegistry));
});