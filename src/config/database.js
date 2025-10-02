/**
 * Database Configuration
 * Supabase client setup with modern secret key approach
 */

const { createClient } = require('@supabase/supabase-js');

// Validate environment variables
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY;

if (!supabaseUrl || !supabaseSecretKey) {
    throw new Error('Missing required Supabase environment variables. Please check your .env file.');
}

// Create Supabase client with secret key for backend operations
// Secret keys provide elevated privileges and bypass Row Level Security
const supabase = createClient(supabaseUrl, supabaseSecretKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    },
    global: {
        headers: {
            'User-Agent': '589-FRC-Scouting-Backend/1.0.0'
        }
    }
});

/**
 * Test database connection
 * Useful for startup health checks
 */
async function testConnection() {
    try {
        const { data, error } = await supabase
            .from('teams')
            .select('count')
            .limit(1);

        if (error) throw error;
        console.log('✅ Database connection successful');
        return true;
    } catch (error) {
        console.error('❌ Database connection failed:', error.message);
        return false;
    }
}

module.exports = {
    supabase,
    testConnection
};