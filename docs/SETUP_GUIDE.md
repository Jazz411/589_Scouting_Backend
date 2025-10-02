# Complete Setup Guide - Team 589 Scouting Backend

**Welcome to Team 589!** This guide will walk you through setting up your development environment from scratch. By the end, you'll have the scouting backend running on your laptop.

## Table of Contents
1. [Install Required Software](#step-1-install-required-software)
2. [Set Up Visual Studio Code](#step-2-set-up-visual-studio-code)
3. [Clone the Repository](#step-3-clone-the-repository)
4. [Configure the Database Connection](#step-4-configure-the-database-connection)
5. [Install Project Dependencies](#step-5-install-project-dependencies)
6. [Run the Application](#step-6-run-the-application)
7. [Verify Everything Works](#step-7-verify-everything-works)

---

## Step 1: Install Required Software

### 1.1 Install Node.js (v20 or higher)

Node.js is the runtime environment that executes our server code.

**For Windows:**
1. Visit: https://nodejs.org/en/download
2. Download the "LTS" (Long Term Support) version for Windows
3. Run the installer (`.msi` file)
4. Follow the installation wizard (accept defaults)
5. Verify installation:
   - Open Command Prompt (search "cmd" in Start menu)
   - Type: `node --version`
   - You should see something like `v20.x.x` or higher

**For Mac:**
1. Visit: https://nodejs.org/en/download
2. Download the "LTS" version for macOS
3. Run the installer (`.pkg` file)
4. Follow the installation wizard
5. Verify installation:
   - Open Terminal (Cmd+Space, type "Terminal")
   - Type: `node --version`
   - You should see something like `v20.x.x` or higher

**Alternative - Using a Version Manager (Recommended for advanced users):**

<details>
<summary>Click to expand: Installing Node.js with nvm (Node Version Manager)</summary>

**For Mac/Linux:**
```bash
# Install nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Restart your terminal, then install Node.js
nvm install 20
nvm use 20
```

**For Windows:**
1. Download nvm-windows from: https://github.com/coreybutler/nvm-windows/releases
2. Install and then:
```bash
nvm install 20
nvm use 20
```
</details>

### 1.2 Install Git

Git is the version control system we use to manage code.

**For Windows:**
1. Visit: https://git-scm.com/download/win
2. Download and run the installer
3. During installation:
   - Select "Use Visual Studio Code as Git's default editor" (if you've installed VS Code)
   - Keep other defaults
4. Verify installation:
   ```bash
   git --version
   ```

**For Mac:**

Git is usually pre-installed on Mac. Verify by opening Terminal and typing:
```bash
git --version
```

If not installed, you'll be prompted to install Xcode Command Line Tools. Click "Install" and follow the prompts.

---

## Step 2: Set Up Visual Studio Code

### 2.1 Install VS Code

**For Windows:**
1. Visit: https://code.visualstudio.com/download
2. Download the Windows version
3. Run the installer
4. **Important:** Check "Add to PATH" during installation
5. Launch VS Code

**For Mac:**
1. Visit: https://code.visualstudio.com/download
2. Download the Mac version
3. Open the `.zip` file and drag VS Code to Applications folder
4. Launch VS Code from Applications

### 2.2 Install Essential VS Code Extensions

Once VS Code is open:

1. **Open the Extensions view:**
   - Click the Extensions icon in the left sidebar (or press `Ctrl+Shift+X` on Windows, `Cmd+Shift+X` on Mac)

2. **Install these essential extensions** (search for each and click "Install"):

   **Required Extensions:**
   - **Claude Code** - AI-powered coding assistant
     - Search: "Claude Code"
     - Publisher: Anthropic
     - Install link: [Claude Code Extension](https://marketplace.visualstudio.com/items?itemName=anthropic.claude-code)

   - **ESLint** - JavaScript code quality
     - Search: "ESLint"
     - Publisher: Microsoft

   - **Prettier - Code formatter** - Automatic code formatting
     - Search: "Prettier"
     - Publisher: Prettier

   **Highly Recommended Extensions:**
   - **GitLens** - Enhanced Git capabilities
     - Search: "GitLens"
     - Publisher: GitKraken

   - **JavaScript (ES6) code snippets** - Code shortcuts
     - Search: "JavaScript (ES6) code snippets"
     - Publisher: charalampos karypidis

   - **Thunder Client** - API testing (alternative to Postman)
     - Search: "Thunder Client"
     - Publisher: Thunder Client

   - **npm Intellisense** - Autocomplete npm modules
     - Search: "npm Intellisense"
     - Publisher: Christian Kohler

### 2.3 Configure VS Code Settings (Optional but Recommended)

1. Open Settings: `File` > `Preferences` > `Settings` (Windows) or `Code` > `Preferences` > `Settings` (Mac)
2. Search for these settings and enable them:
   - "Format On Save" - Auto-format your code when you save
   - "Auto Save" - Set to "afterDelay" so you don't lose work

---

## Step 3: Clone the Repository

### 3.1 Choose a Location for Your Code

**For Windows:**
```bash
# Open Command Prompt or PowerShell
# Create a folder for your coding projects (if it doesn't exist)
mkdir C:\Users\YourUsername\Projects
cd C:\Users\YourUsername\Projects
```

**For Mac:**
```bash
# Open Terminal
# Create a folder for your coding projects (if it doesn't exist)
mkdir ~/Projects
cd ~/Projects
```

### 3.2 Clone the Repository from GitHub

**Team 589 Scouting Backend Repository:**

```bash
# Clone the repository (replace with the actual repository URL)
git clone https://github.com/589-robotics/589_Scouting_Backend.git

# Navigate into the project folder
cd 589_Scouting_Backend
```

> **Note:** If you don't have the repository URL yet, ask your team lead for access to the GitHub repository.

### 3.3 Open the Project in VS Code

**From Command Line/Terminal:**
```bash
# Make sure you're in the project directory
code .
```

**Or from VS Code:**
1. Open VS Code
2. Click `File` > `Open Folder`
3. Navigate to where you cloned the repository
4. Select the `589_Scouting_Backend` folder and click "Open"

---

## Step 4: Configure the Database Connection

### 4.1 About Supabase

Our project uses **Supabase** as the database backend. Supabase is a cloud-hosted PostgreSQL database that Team 589 has already set up.

**Your Supabase Project Details:**
- **Project ID:** `felzvdhnugvnuvqtzwkt`
- **Project URL:** `https://felzvdhnugvnuvqtzwkt.supabase.co`
- **Dashboard:** https://supabase.com/dashboard/project/felzvdhnugvnuvqtzwkt

### 4.2 Get Your Supabase Service Role Key

You need a **service role key** to connect to the database:

1. **Open the Supabase Dashboard:**
   - Visit: https://supabase.com/dashboard/project/felzvdhnugvnuvqtzwkt/settings/api
   - (You may need to sign in - ask your team lead for credentials if you don't have access)

2. **Find the Service Role Key:**
   - Scroll down to the "Project API keys" section
   - Look for the **service_role** key
   - It's a long string starting with `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
   - Click the "Copy" button to copy it

   ⚠️ **Important:**
   - Use the **service_role** key, NOT the `anon` key
   - The service_role key has full database access - keep it secret!

### 4.3 Create Your Environment Configuration File

The project needs environment variables to connect to Supabase. These are stored in a `.env` file.

1. **In VS Code, open the project folder**
2. **Find the file `.env.example`** in the root directory
3. **Create a copy and rename it to `.env`:**

   **Option A - Using VS Code:**
   - Right-click `.env.example` in the file explorer
   - Select "Copy"
   - Right-click in the file explorer and select "Paste"
   - Rename the copy from `.env.example copy` to `.env`

   **Option B - Using Command Line:**

   **Windows (Command Prompt):**
   ```bash
   copy .env.example .env
   ```

   **Windows (PowerShell):**
   ```powershell
   Copy-Item .env.example .env
   ```

   **Mac:**
   ```bash
   cp .env.example .env
   ```

4. **Open the `.env` file and update it:**

   Find this line:
   ```
   SUPABASE_SECRET_KEY=YOUR_SERVICE_ROLE_KEY_HERE
   ```

   Replace `YOUR_SERVICE_ROLE_KEY_HERE` with the service role key you copied from Supabase.

5. **Your `.env` file should look like this:**

   ```env
   # Supabase Configuration
   SUPABASE_URL=https://felzvdhnugvnuvqtzwkt.supabase.co
   SUPABASE_SECRET_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZlbHp2ZGhudWd2bnV2cXR6d2t0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTYzOTQxMTIwMCwiZXhwIjoxOTU0OTg3MjAwfQ.your_actual_key_here

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

6. **Save the file** (`Ctrl+S` on Windows, `Cmd+S` on Mac)

⚠️ **Security Note:** The `.env` file is already in `.gitignore`, so it won't be committed to GitHub. Never share your service role key publicly!

---

## Step 5: Install Project Dependencies

Now we'll install all the Node.js packages (libraries) that the project needs.

### 5.1 Open the Integrated Terminal in VS Code

1. In VS Code, open the terminal: `Terminal` > `New Terminal` (or press `` Ctrl+` `` on Windows, `` Cmd+` `` on Mac)
2. Make sure you're in the project directory (you should see `589_Scouting_Backend` in the path)

### 5.2 Install Dependencies

Run this command:

```bash
npm install
```

**What's happening?**
- `npm` (Node Package Manager) reads the `package.json` file
- It downloads all required libraries into a `node_modules` folder
- This may take 1-3 minutes depending on your internet speed

**You should see:**
- Progress bars as packages are downloaded
- Eventually: `added XXX packages` (the number varies)
- No major error messages (warnings are usually okay)

**Common Issues:**

<details>
<summary>Error: "npm not found" or "npm is not recognized"</summary>

**Solution:** Node.js wasn't installed correctly or isn't in your PATH.
- Close and reopen your terminal
- Verify Node.js installation: `node --version`
- If still not working, reinstall Node.js from Step 1.1

</details>

<details>
<summary>Error: "permission denied" or "EACCES"</summary>

**Solution (Mac/Linux):** Don't use `sudo`. If you used sudo to install Node.js, you may need to fix permissions:
```bash
sudo chown -R $(whoami) ~/.npm
sudo chown -R $(whoami) /usr/local/lib/node_modules
```

**Solution (Windows):** Run your terminal as Administrator and try again.

</details>

---

## Step 6: Run the Application

### 6.1 Start the Development Server

In the VS Code terminal, run:

```bash
npm run dev
```

**What's happening?**
- The `dev` script (defined in `package.json`) starts the server
- It uses `nodemon` which automatically restarts the server when you change code
- The server runs on port 3000 (http://localhost:3000)

### 6.2 Success! You Should See:

```
🚀 FRC Scouting API running on port 3000
📊 Dashboard available at http://localhost:3000
🔧 Health check at http://localhost:3000/health
📖 API Documentation at http://localhost:3000/api-docs
✅ Database connection successful
```

**If you see errors instead:**

<details>
<summary>Error: "Missing required Supabase environment variables"</summary>

**Solution:**
- Check that your `.env` file exists in the root directory
- Verify that `SUPABASE_SECRET_KEY` is set correctly
- Make sure there are no extra spaces around the key
- Restart the server after updating `.env`

</details>

<details>
<summary>Error: "Port 3000 is already in use"</summary>

**Solution:**
- Another application is using port 3000
- Either stop that application, or change the port in `.env`:
  ```env
  PORT=3001
  ```
- Then restart: `npm run dev`

</details>

<details>
<summary>Error: "Database connection failed"</summary>

**Solution:**
- Verify you're using the **service_role** key, not the `anon` key
- Check that the key is correctly pasted with no extra spaces or line breaks
- Verify your Supabase project is active at: https://supabase.com/dashboard/project/felzvdhnugvnuvqtzwkt
- Check your internet connection

</details>

---

## Step 7: Verify Everything Works

### 7.1 Test the API Endpoints

**Option A - Using Your Web Browser:**

1. Open your browser and visit:
   - **Health Check:** http://localhost:3000/health
   - **Dashboard:** http://localhost:3000
   - **API Documentation:** http://localhost:3000/api-docs

2. You should see JSON responses or the Swagger API documentation

**Option B - Using the Terminal:**

**Windows (PowerShell):**
```powershell
# Test health endpoint
Invoke-WebRequest -Uri http://localhost:3000/health

# Test API with authentication
Invoke-WebRequest -Uri http://localhost:3000/api/teams -Headers @{"x-api-key"="dev-key-123"}
```

**Mac/Linux:**
```bash
# Test health endpoint
curl http://localhost:3000/health

# Test API with authentication
curl -H "x-api-key: dev-key-123" http://localhost:3000/api/teams
```

**Option C - Using Thunder Client (VS Code Extension):**

If you installed the Thunder Client extension:

1. Click the Thunder Client icon in the left sidebar
2. Click "New Request"
3. Set the URL to: `http://localhost:3000/api/teams`
4. Click "Headers" tab
5. Add header: `x-api-key` with value `dev-key-123`
6. Click "Send"
7. You should see a list of teams!

### 7.2 Explore the API Documentation

1. Open your browser to: http://localhost:3000/api-docs
2. This is a **Swagger UI** interface where you can:
   - See all available API endpoints
   - Read documentation for each endpoint
   - Test endpoints directly in the browser
3. Try making a test request:
   - Find the `GET /api/teams` endpoint
   - Click "Try it out"
   - Click "Execute"
   - You should see team data returned

### 7.3 View the Database (Optional)

You can view the actual database tables in Supabase:

1. Visit: https://supabase.com/dashboard/project/felzvdhnugvnuvqtzwkt/editor
2. Click on any table (teams, matches, robot_info, etc.)
3. You'll see the data that the API is reading from

---

## 🎉 Congratulations!

You now have the 589 Scouting Backend running on your laptop! Here's what you accomplished:

✅ Installed Node.js, Git, and VS Code
✅ Set up essential development tools and extensions
✅ Cloned the repository from GitHub
✅ Connected to the Team 589 Supabase database
✅ Installed all project dependencies
✅ Started the development server
✅ Verified the API is working correctly

---

## Next Steps

### Learn the Codebase

1. **Explore the Project Structure:**
   ```
   589_Scouting_Backend/
   ├── src/
   │   ├── server.js           # Main entry point
   │   ├── routes/             # API endpoint handlers
   │   ├── middleware/         # Authentication, validation
   │   ├── config/             # Configuration files
   │   └── scripts/            # Database utilities
   ├── docs/                   # Documentation
   ├── .env                    # Your environment variables (SECRET!)
   └── package.json            # Project dependencies
   ```

2. **Read the Documentation:**
   - **Main README:** `../README.md` - API overview and endpoints
   - **REST API Guide:** `REST_API_EDUCATION.md` - Learn REST principles
   - **Supabase Migration:** `SUPABASE_MIGRATION.md` - Database architecture
   - **Original Context:** `README-original.md` - Full project background

3. **Test the API Endpoints:**
   - Open http://localhost:3000/api-docs
   - Try out different endpoints (teams, matches, robot info, statistics)
   - Use Thunder Client or your browser to make requests

### Make Your First Code Change

1. **Open `src/server.js`** in VS Code
2. **Find the welcome route** (around line 30-40)
3. **Make a small change** - maybe update the welcome message
4. **Save the file** - the server will auto-restart (thanks to nodemon!)
5. **Refresh your browser** at http://localhost:3000 to see the change

### Use Claude Code

1. **Open Claude Code** (click the Claude icon in the left sidebar, or press `Ctrl+L` / `Cmd+L`)
2. **Ask questions** about the codebase:
   - "Explain how the teams API endpoint works"
   - "How does authentication work in this API?"
   - "Show me where match data is validated"
3. **Get help with coding tasks:**
   - "Add a console.log statement to the teams endpoint"
   - "Help me understand the database schema"

### Learn More About the Technologies

- **Node.js Basics:** https://nodejs.org/en/learn/getting-started/introduction-to-nodejs
- **Express.js (our web framework):** https://expressjs.com/en/starter/installing.html
- **Supabase Documentation:** https://supabase.com/docs
- **REST API Concepts:** Read `docs/REST_API_EDUCATION.md`

---

## Common Commands Reference

### Starting and Stopping the Server

```bash
# Start development server (with auto-reload)
npm run dev

# Stop the server
# Press Ctrl+C in the terminal

# Start production server
npm start
```

### Working with Git

```bash
# Check status of your changes
git status

# Save your changes
git add .
git commit -m "Description of what you changed"

# Get latest changes from GitHub
git pull

# Push your changes to GitHub
git push
```

### Project Maintenance

```bash
# Update dependencies
npm update

# Check for outdated packages
npm outdated

# Run tests (when available)
npm test

# Check code for errors
npm run lint

# Format code automatically
npm run format
```

---

## Troubleshooting

### Server Won't Start

1. **Check Node.js version:** `node --version` (must be 20.0.0 or higher)
2. **Reinstall dependencies:** Delete `node_modules` folder and run `npm install` again
3. **Check for port conflicts:** Make sure nothing else is using port 3000
4. **Verify `.env` file:** Make sure all required variables are set

### Database Connection Issues

1. **Check Supabase Dashboard:** Make sure the project is active
2. **Verify service role key:** It should start with `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9`
3. **Check internet connection:** Supabase is cloud-hosted
4. **Look for typos:** Especially in the `.env` file

### Code Changes Not Showing Up

1. **Check if server is running:** You should see "Server running" in terminal
2. **Hard refresh browser:** `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
3. **Check for syntax errors:** Look in the terminal for error messages
4. **Restart the server:** `Ctrl+C` then `npm run dev`

### VS Code Issues

1. **Extensions not working:** Reload VS Code (`Ctrl+Shift+P` > "Reload Window")
2. **Terminal not working:** Try opening a new terminal window
3. **Git integration issues:** Make sure Git is installed and in PATH

---

## Getting Help

### Team Resources

- **Team Lead/Mentor:** Ask questions during team meetings
- **GitHub Issues:** Report bugs or request features on the repository
- **Team Chat:** Use your team's communication platform (Slack, Discord, etc.)

### Documentation

- **This Guide:** You're reading it! Bookmark it for reference
- **Main README:** `../README.md` - Complete API documentation
- **Educational Resources:** Check the other files in the `docs/` folder

### External Resources

- **Stack Overflow:** https://stackoverflow.com - Search for error messages
- **Node.js Docs:** https://nodejs.org/en/docs/
- **Express.js Docs:** https://expressjs.com/
- **Supabase Docs:** https://supabase.com/docs
- **VS Code Tips:** https://code.visualstudio.com/docs

### Using Claude Code for Help

Claude Code is built into VS Code and can help you:
- Understand error messages
- Debug issues
- Learn new concepts
- Write and modify code

Just open Claude Code (`Ctrl+L` / `Cmd+L`) and ask your question!

---

## Important Security Reminders

⚠️ **Never commit these to GitHub:**
- `.env` file (contains secret keys)
- `node_modules` folder (too large, can be regenerated)
- Any file with passwords or API keys

✅ **These are already in `.gitignore`:**
- `.env`
- `node_modules/`
- Log files

🔒 **Keep your service role key secret:**
- Don't share it in chat messages
- Don't post it in screenshots
- Don't commit it to GitHub
- If exposed, regenerate it immediately in Supabase dashboard

---

**Welcome to the team! Happy coding! 🚀**

---

*Last Updated: January 2025*
*Questions or improvements? Open an issue on GitHub or talk to your team lead.*
