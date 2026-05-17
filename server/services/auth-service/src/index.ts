/**
 * AUTH SERVICE - User Authentication & JWT Generation
 * ============================================================
 * Handles:
 * - User login/signup
 * - JWT token generation and validation
 * - Password reset
 * - Email verification
 */

const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');

const app = express();
app.use(express.json());

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key-change-in-production';
const JWT_EXPIRY = process.env.JWT_EXPIRY || '7d';

// ============================================================
// HEALTH CHECK
// ============================================================

app.get('/health', (req, res) => {
  res.json({
    ok: true,
    service: 'auth-service',
    timestamp: new Date().toISOString(),
  });
});

app.get('/version', (req, res) => {
  res.json({ version: '1.0.0' });
});

// ============================================================
// HELPER FUNCTIONS
// ============================================================

/**
 * Generate JWT token
 */
function generateToken(user, orgId) {
  const payload = {
    userId: user.id,
    email: user.email,
    role: user.role,
    orgId: orgId,
  };

  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRY });
}

/**
 * Hash password using bcrypt
 */
async function hashPassword(password) {
  return bcrypt.hash(password, 10);
}

/**
 * Compare password with hash
 */
async function comparePassword(password, hash) {
  return bcrypt.compare(password, hash);
}

/**
 * Verify JWT token
 */
function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

// ============================================================
// ROUTES
// ============================================================

/**
 * POST /auth/login
 * Login user with email/password
 */
app.post('/auth/login', async (req, res) => {
  try {
    const { email, password, orgSlug } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: 'Email and password required',
        code: 'MISSING_FIELDS',
      });
    }

    // Find organization by slug
    let org;
    if (orgSlug) {
      org = await prisma.organization.findUnique({
        where: { slug: orgSlug },
      });
    } else {
      return res.status(400).json({
        error: 'Organization slug required',
        code: 'MISSING_ORG',
      });
    }

    if (!org) {
      return res.status(404).json({
        error: 'Organization not found',
        code: 'ORG_NOT_FOUND',
      });
    }

    // Find user in this organization
    const user = await prisma.user.findUnique({
      where: { orgId_email: { orgId: org.id, email } },
    });

    if (!user) {
      return res.status(401).json({
        error: 'Invalid credentials',
        code: 'INVALID_CREDENTIALS',
      });
    }

    // Verify password
    const passwordMatch = await comparePassword(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({
        error: 'Invalid credentials',
        code: 'INVALID_CREDENTIALS',
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(403).json({
        error: 'User account is disabled',
        code: 'ACCOUNT_DISABLED',
      });
    }

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    // Generate JWT
    const token = generateToken(user, org.id);

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
      org: {
        id: org.id,
        name: org.name,
        slug: org.slug,
        plan: org.plan,
        primaryColor: org.primaryColor,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      error: 'Internal server error',
      code: 'INTERNAL_ERROR',
    });
  }
});

/**
 * POST /auth/signup
 * Create new admin account for organization
 */
app.post('/auth/signup', async (req, res) => {
  try {
    const { orgName, orgSlug, email, password, firstName, lastName } = req.body;

    if (!orgName || !orgSlug || !email || !password || !firstName) {
      return res.status(400).json({
        error: 'Missing required fields',
        code: 'MISSING_FIELDS',
      });
    }

    const existingOrg = await prisma.organization.findUnique({
      where: { slug: orgSlug },
    });

    if (existingOrg) {
      return res.status(400).json({
        error: 'Organization slug already exists',
        code: 'ORG_EXISTS',
      });
    }

    // Create organization
    const org = await prisma.organization.create({
      data: {
        name: orgName,
        slug: orgSlug,
        email: email,
        structureType: 'school',
        plan: 'demo',
        isPaid: false,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    });

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create admin user
    const user = await prisma.user.create({
      data: {
        orgId: org.id,
        email,
        password: hashedPassword,
        firstName,
        lastName: lastName || '',
        role: 'ORG_ADMIN',
        isActive: true,
        emailVerified: true,
      },
    });

    // Generate JWT
    const token = generateToken(user, org.id);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        role: user.role,
      },
      org: {
        id: org.id,
        name: org.name,
        slug: org.slug,
        expiresAt: org.expiresAt,
      },
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({
      error: 'Internal server error',
      code: 'INTERNAL_ERROR',
    });
  }
});

/**
 * POST /auth/verify-token
 * Verify if JWT is valid
 */
app.post('/auth/verify-token', (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        valid: false,
        error: 'Missing or invalid token',
      });
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);

    if (!decoded) {
      return res.status(401).json({
        valid: false,
        error: 'Token expired or invalid',
      });
    }

    res.json({
      valid: true,
      user: decoded,
    });
  } catch (error) {
    res.status(401).json({
      valid: false,
      error: 'Invalid token',
    });
  }
});

/**
 * POST /auth/logout
 */
app.post('/auth/logout', (req, res) => {
  res.json({
    success: true,
    message: 'Logged out',
  });
});

// ============================================================
// ERROR HANDLING
// ============================================================

app.use((req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.path,
  });
});

// ============================================================
// START SERVER
// ============================================================

const PORT = process.env.PORT || 4101;
app.listen(PORT, () => {
  console.log(`[Auth Service] Running on port ${PORT}`);
});