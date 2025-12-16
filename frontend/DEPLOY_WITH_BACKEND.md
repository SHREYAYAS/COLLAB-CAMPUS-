# Deploy Frontend + Backend Together from Backend Folder

## 📁 Final Structure After Setup
```
backend/
├── dist/                    (Copy your built frontend here)
├── public/
├── routes/
├── models/
├── server.js (or index.js)
├── package.json
└── .env
```

---

## ✨ Why This Approach Is Great

✅ Single deployment (no managing two services)  
✅ No CORS issues (same domain)  
✅ No need for separate frontend hosting  
✅ Cheaper (backend only)  
✅ Easier to manage  
✅ Perfect for small-medium projects  

---

## 🚀 STEP-BY-STEP SETUP

### Step 1: Build Your Frontend

You've already done this! ✅

```bash
cd collabcampus-frontend
npm run build
```

This creates a **`dist`** folder with your production build.

---

### Step 2: Copy Built Frontend to Backend

#### On Windows (PowerShell):
```powershell
# Navigate to frontend
cd D:\29-11-2025\desktop\collabcampus-frontend

# Copy dist folder to backend
Copy-Item -Path ".\dist" -Destination "..\backend\" -Recurse -Force
```

#### On Mac/Linux:
```bash
cd ~/projects/collabcampus-frontend
cp -r dist ../backend/
```

#### Manual Method:
1. Open File Explorer
2. Navigate to `collabcampus-frontend`
3. Right-click `dist` folder → Copy
4. Go to `backend` folder
5. Right-click → Paste

---

### Step 3: Update Backend to Serve Frontend

Edit your **backend `server.js`** (or `app.js`, `index.js`):

```javascript
const express = require('express')
const cors = require('cors')
const path = require('path')
require('dotenv').config()

const app = express()

// Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// CORS (only for API routes if needed)
app.use(cors({
  origin: '*',
  credentials: true,
}))

// ========================
// API Routes (all /api/* routes)
// ========================
app.use('/api', require('./routes/auth'))        // /api/auth/*
app.use('/api', require('./routes/projects'))    // /api/projects/*
app.use('/api', require('./routes/tasks'))       // /api/tasks/*
app.use('/api', require('./routes/resumes'))     // /api/resumes/*
// ... add all your API routes here

// ========================
// SERVE STATIC FRONTEND FILES
// ========================
// Serve dist folder as static files
app.use(express.static(path.join(__dirname, 'dist')))

// Fallback to index.html for React Router (SPA)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'))
})

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ error: 'Internal server error' })
})

// Start server
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
  console.log(`Frontend: http://localhost:${PORT}`)
  console.log(`API: http://localhost:${PORT}/api`)
})
```

**Key Points:**
- `app.use(express.static(...))` serves the `dist` folder
- `app.get('*', ...)` catches all routes and returns `index.html` (for React Router)
- This must come AFTER your API routes!

---

### Step 4: Update Frontend API Client

Since frontend and backend are now on the **same domain**, update your API client.

Edit **`src/api/client.js`**:

```javascript
import axios from 'axios'

// Since frontend is served from same domain as backend,
// just use /api without full URL
const API_BASE_URL = '/api'

const client = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add JWT token to requests
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token') || localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle 401 errors
client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token')
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default client
```

---

### Step 5: Rebuild Frontend with Updated API URL

```bash
cd collabcampus-frontend
npm run build
```

---

### Step 6: Copy New Build to Backend Again

```powershell
# PowerShell
Copy-Item -Path ".\dist" -Destination "..\backend\" -Recurse -Force
```

---

### Step 7: Test Locally

```bash
cd backend
npm install  # Make sure all dependencies installed
npm start    # or node server.js
```

Visit: `http://localhost:5000`

You should see:
- Frontend loads ✅
- Can navigate around ✅
- API calls work ✅
- No CORS errors ✅

---

### Step 8: Deploy Backend to Railway

```bash
cd backend

# Make sure you have .env file with:
# NODE_ENV=production
# MONGODB_URI=your_mongodb_url
# JWT_SECRET=your_secret

# Install Railway CLI
npm install -g railway

# Deploy
railway login
railway link
railway up
```

Your app will be live! 🚀

---

## 📝 Backend package.json Update

Make sure your `package.json` has proper start script:

```json
{
  "name": "collabcampus-backend",
  "version": "1.0.0",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "build": "echo 'No build needed for backend'"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "dotenv": "^16.0.3",
    "mongoose": "^7.0.0",
    "jsonwebtoken": "^9.0.0"
  }
}
```

---

## 🔄 Workflow: Making Updates

### Update Frontend:
```bash
cd collabcampus-frontend
# Make your changes
npm run build
Copy-Item -Path ".\dist" -Destination "..\backend\" -Recurse -Force
cd ../backend
git add dist/
git commit -m "Update frontend"
git push origin main
# Railway auto-deploys!
```

### Update Backend:
```bash
cd backend
# Make your changes
git add .
git commit -m "Update API"
git push origin main
# Railway auto-deploys!
```

---

## ✅ Checklist Before Deployment

- [ ] Frontend built: `npm run build` ✅
- [ ] `dist` folder copied to backend
- [ ] `server.js` updated with static file serving
- [ ] API routes come BEFORE static file serving
- [ ] `src/api/client.js` uses `/api` (not full URL)
- [ ] `.env` file in backend with all variables
- [ ] Backend works locally: `npm start`
- [ ] Can access frontend at `http://localhost:5000`
- [ ] Can login and use features
- [ ] Backend pushed to GitHub
- [ ] Deployed to Railway/Vercel

---

## 🧪 Testing Before Deploying

### Local Test:
```bash
cd backend
npm start

# Open browser
# http://localhost:5000 should load frontend
# Try login - API should work
# Check Network tab - no CORS errors
```

### Production Test:
```bash
# After Railway deployment
# Visit: https://your-backend-xxx.railway.app
# Should see your app
# Try all features
# Check browser console for errors
```

---

## 📊 Your Final Architecture (Much Simpler!)

```
┌─────────────────────────────────────┐
│    User Browser                     │
│    https://app-xxx.railway.app      │
└──────────────────┬──────────────────┘
                   │
                   │
┌──────────────────▼──────────────────┐
│    Backend + Frontend                │
│    - Serves static frontend files    │
│    - API endpoints at /api/*         │
│    https://app-xxx.railway.app       │
└──────────────────┬──────────────────┘
                   │
                   │
┌──────────────────▼──────────────────┐
│    MongoDB Atlas                     │
│    (Database)                        │
└─────────────────────────────────────┘
```

---

## 💡 Example: Complete server.js

```javascript
const express = require('express')
const cors = require('cors')
const path = require('path')
const mongoose = require('mongoose')
require('dotenv').config()

const app = express()

// Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

// API Routes
app.use('/api/auth', require('./routes/auth'))
app.use('/api/projects', require('./routes/projects'))
app.use('/api/tasks', require('./routes/tasks'))
app.use('/api/resumes', require('./routes/resumes'))

// Serve static frontend
app.use(express.static(path.join(__dirname, 'dist')))

// SPA fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'))
})

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ error: 'Server error' })
})

// Start server
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`🚀 App running on http://localhost:${PORT}`)
})
```

---

## 🎯 You're Done!

Your app is now:
- ✅ Built and optimized
- ✅ Single deployment
- ✅ No CORS issues
- ✅ Production ready
- ✅ Easy to manage

**All from one simple command: `npm start` in backend folder!** 🎉

---

## ❓ FAQ

**Q: Do I need to update `.env.production`?**
A: No! Since API is on same domain, use `/api`

**Q: Do I need Vercel for frontend?**
A: No! Backend serves it all

**Q: What if I update frontend?**
A: Rebuild + copy dist folder + redeploy backend

**Q: What about CORS?**
A: No CORS issues since same domain!

---

## 🆘 Troubleshooting

**Frontend not loading:**
```
→ Check dist folder copied to backend
→ Check express.static path is correct
→ Check dist/index.html exists
```

**API calls failing:**
```
→ Check API routes come BEFORE static serving
→ Check API client uses /api not full URL
→ Check backend running properly
```

**502 Error on Railway:**
```
→ Check dist folder size < 500MB
→ Check .env variables set
→ Check backend starts without errors locally
```
