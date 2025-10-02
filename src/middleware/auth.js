/**
 * Authentication Middleware
 * Simple API key validation for educational purposes
 *
 * In production, you might use JWT tokens, OAuth, or Supabase Auth
 */

/**
 * Simple API key validation middleware
 * This demonstrates basic authentication concepts for students
 */
const validateApiKey = (req, res, next) => {
    // Get API key from header
    const apiKey = req.headers['x-api-key'] || req.headers['authorization']?.replace('Bearer ', '');

    // For development, allow requests without API key
    if (process.env.NODE_ENV === 'development' && !apiKey) {
        console.log('⚠️  Development mode: Skipping API key validation');
        return next();
    }

    // Check if API key is provided
    if (!apiKey) {
        return res.status(401).json({
            success: false,
            error: {
                message: 'API key required. Include x-api-key header or Authorization: Bearer <key>'
            }
        });
    }

    // Validate API key
    const validApiKeys = process.env.API_KEYS?.split(',') || [];

    if (!validApiKeys.includes(apiKey)) {
        return res.status(401).json({
            success: false,
            error: {
                message: 'Invalid API key'
            }
        });
    }

    // API key is valid, continue to next middleware
    next();
};

/**
 * Role-based access control (for future expansion)
 * This shows how you could implement different permission levels
 */
const requireRole = (role) => {
    return (req, res, next) => {
        // In a real app, you'd extract role from JWT token or database
        // For now, this is just a placeholder for educational purposes
        const userRole = req.headers['x-user-role'] || 'scouter';

        const roleHierarchy = {
            'admin': 3,
            'lead': 2,
            'scouter': 1
        };

        if (!roleHierarchy[userRole] || roleHierarchy[userRole] < roleHierarchy[role]) {
            return res.status(403).json({
                success: false,
                error: {
                    message: `Access denied. Required role: ${role}, your role: ${userRole}`
                }
            });
        }

        next();
    };
};

module.exports = {
    validateApiKey,
    requireRole
};