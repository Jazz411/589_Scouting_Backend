/**
 * 589 FRC Scouting API Server
 * Educational backend for high school robotics team
 *
 * This file demonstrates basic Express.js server setup and REST API concepts
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
require('dotenv').config();

// Import our route modules
const teamsRoutes = require('./routes/teams');
const matchesRoutes = require('./routes/matches');
const robotInfoRoutes = require('./routes/robotInfo');
const dashboardRoutes = require('./routes/dashboard');
const tbaRoutes = require('./routes/tba');
// const { router: statisticsRoutes } = require('./routes/statistics');
// const seasonsRoutes = require('./routes/seasons');

// Import middleware
const { errorHandler, notFound } = require('./middleware/errorHandling');
const { validateApiKey } = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 3000;

// ============================================================================
// MIDDLEWARE SETUP
// ============================================================================

// Security middleware with relaxed CSP for development
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: [
                "'self'",
                "'unsafe-inline'",
                "https://cdn.jsdelivr.net",
                "https://cdnjs.cloudflare.com"
            ],
            scriptSrcAttr: ["'unsafe-inline'"],
            styleSrc: [
                "'self'",
                "'unsafe-inline'",
                "https://cdn.jsdelivr.net",
                "https://cdnjs.cloudflare.com"
            ],
            fontSrc: [
                "'self'",
                "https://cdnjs.cloudflare.com"
            ],
            imgSrc: ["'self'", "data:", "https:"],
            connectSrc: ["'self'"]
        }
    }
}));

// CORS - allow our mobile app and web interface to connect
app.use(cors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000', 'http://localhost:19006'],
    credentials: true
}));

// Logging middleware
app.use(morgan('combined'));

// Parse JSON bodies
app.use(express.json({ limit: '10mb' }));

// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// Serve static files from public directory
app.use(express.static('public'));

// ============================================================================
// ROUTES
// ============================================================================

// Swagger API Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Team 589 Scouting API Docs',
    customfavIcon: '/favicon.ico'
}));

// Swagger JSON endpoint (for external tools)
app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
});

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check endpoint
 *     description: |
 *       **For DevOps/Deployment**: Quick endpoint to verify server is running.
 *       Used by monitoring tools, load balancers, and deployment scripts.
 *     tags: [System]
 *     responses:
 *       200:
 *         description: Server is healthy and running
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: healthy
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                 version:
 *                   type: string
 *                   example: 1.0.0
 */
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
    });
});

/**
 * @swagger
 * /api/info:
 *   get:
 *     summary: API information and available endpoints
 *     description: |
 *       Returns basic information about the API and lists all available endpoints.
 *       Good starting point for discovering the API structure.
 *     tags: [System]
 *     responses:
 *       200:
 *         description: API information
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 team:
 *                   type: string
 *                 version:
 *                   type: string
 *                 endpoints:
 *                   type: object
 *                 documentation:
 *                   type: string
 */
app.get('/api/info', (req, res) => {
    res.json({
        message: 'Team 589 Falkon Robotics - Scouting API',
        team: 'Team 589 Falkon Robotics',
        version: '1.0.0',
        endpoints: {
            teams: '/api/teams',
            matches: '/api/matches',
            robotInfo: '/api/robot-info',
            dashboard: '/api/dashboard',
            tba: '/api/tba'
        },
        documentation: '/api-docs'
    });
});

// API Routes with validation middleware
app.use('/api/teams', validateApiKey, teamsRoutes);
app.use('/api/matches', validateApiKey, matchesRoutes);
app.use('/api/robot-info', validateApiKey, robotInfoRoutes);
app.use('/api/dashboard', validateApiKey, dashboardRoutes);
app.use('/api/tba', validateApiKey, tbaRoutes);
// app.use('/api/statistics', validateApiKey, statisticsRoutes);
// app.use('/api/seasons', validateApiKey, seasonsRoutes);

// ============================================================================
// ERROR HANDLING
// ============================================================================

// 404 handler
app.use(notFound);

// Global error handler
app.use(errorHandler);

// ============================================================================
// SERVER STARTUP
// ============================================================================

app.listen(PORT, () => {
    console.log(`🚀 FRC Scouting API running on port ${PORT}`);
    console.log(`📊 Dashboard available at http://localhost:${PORT}`);
    console.log(`🔧 Health check at http://localhost:${PORT}/health`);
    console.log(`📖 API Documentation at http://localhost:${PORT}/api-docs`);
    console.log(`📄 OpenAPI Spec at http://localhost:${PORT}/api-docs.json`);

    if (process.env.NODE_ENV === 'development') {
        console.log(`\n💡 Frontend students: Share this URL for API docs!`);
    }
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('🛑 SIGTERM received, shutting down gracefully');
    process.exit(0);
});

module.exports = app;