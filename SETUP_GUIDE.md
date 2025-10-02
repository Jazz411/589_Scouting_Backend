# Setup Guide - Connecting to Team 589's Supabase Database

## Your Supabase Project

**Project Details:**
- **Project ID:** `felzvdhnugvnuvqtzwkt`
- **Project URL:** `https://felzvdhnugvnuvqtzwkt.supabase.co`
- **Dashboard:** https://supabase.com/dashboard/project/felzvdhnugvnuvqtzwkt

## Quick Setup Steps

### 1. Install Dependencies

```bash
npm install
```

### 2. Get Your Supabase Service Role Key

The `.env` file is already created with the correct project URL. You just need to add your service role key:

1. **Navigate to API Settings:**
   - Go to: https://supabase.com/dashboard/project/felzvdhnugvnuvqtzwkt/settings/api

2. **Copy the Service Role Key:**
   - Look for the section "Project API keys"
   - Find the **service_role** key (it starts with `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`)
   - **Important:** Do NOT use the `anon` key - you need the `service_role` key!

3. **Update the .env file:**
   - Open `.env` in this directory
   - Find the line: `SUPABASE_SECRET_KEY=YOUR_SERVICE_ROLE_KEY_HERE`
   - Replace `YOUR_SERVICE_ROLE_KEY_HERE` with your actual service role key

### 3. Your .env File Should Look Like This:

```env
# Supabase Configuration
SUPABASE_URL=https://felzvdhnugvnuvqtzwkt.supabase.co
SUPABASE_SECRET_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...  # Paste your actual key here

# Server Configuration
PORT=3000
NODE_ENV=development

# API Security
API_KEYS=dev-key-123,team-589-key

# CORS
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:19006,http://localhost:8081

# The Blue Alliance API (optional)
TBA_API_KEY=your_tba_api_key_here
```

### 4. Start the Development Server

```bash
npm run dev
```

You should see:
```
🚀 FRC Scouting API running on port 3000
📊 Dashboard available at http://localhost:3000
🔧 Health check at http://localhost:3000/health
📖 API Documentation at http://localhost:3000/api-docs
✅ Database connection successful
```

### 5. Test the Connection

Open your browser or use curl to test:

```bash
# Test health endpoint
curl http://localhost:3000/health

# Test API (with API key)
curl -H "x-api-key: dev-key-123" http://localhost:3000/api/teams
```

## Important Security Notes

⚠️ **Keep Your Service Role Key Secret!**
- The service role key has FULL access to your database
- Never commit the `.env` file to git (it's already in `.gitignore`)
- Never share your service role key publicly
- If accidentally exposed, regenerate it in Supabase dashboard

## Troubleshooting

### "Missing required Supabase environment variables"
- Make sure you pasted the service role key into `.env`
- Restart your dev server after updating `.env`

### "Database connection failed"
- Verify you're using the **service_role** key, not the anon key
- Check that the key is correctly pasted with no extra spaces
- Verify your Supabase project is active at the dashboard

### "Unauthorized" or "Invalid API key"
- When testing endpoints, include the header: `-H "x-api-key: dev-key-123"`
- Check that API_KEYS in `.env` matches the key you're using

## Database Information

Your database is already populated with:
- Teams table with FRC team data
- Matches table with competition match data
- Robot info table with pit scouting data
- Statistics tables with calculated team performance

You can view and manage your data at:
- **Table Editor:** https://supabase.com/dashboard/project/felzvdhnugvnuvqtzwkt/editor
- **SQL Editor:** https://supabase.com/dashboard/project/felzvdhnugvnuvqtzwkt/sql

## Next Steps

1. Test the API endpoints using the Swagger docs at http://localhost:3000/api-docs
2. Review the API documentation in `README.md`
3. Explore the code in `src/routes/` to understand the endpoints
4. Check out `REST_API_EDUCATION.md` to learn about REST API design

---

**Need help?** Contact the team or check the main README.md for additional resources.
