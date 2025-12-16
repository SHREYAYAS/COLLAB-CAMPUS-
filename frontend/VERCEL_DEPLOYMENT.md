# Vercel Deployment Guide - Frontend & Backend in Separate Folders

## 📁 Your Project Structure
```
your-projects/
├── collabcampus-frontend/    (React App - Deploy to Vercel)
└── backend/                  (Node.js API - Deploy separately)
```

---

## 🚀 STEP-BY-STEP DEPLOYMENT

### PHASE 1: Deploy Backend First (5-10 minutes)

Your backend needs to be deployed first so you have an API URL for the frontend.

#### Option A: Deploy to Railway (Easiest ⭐ Recommended)

1. **Create Railway Account**
   - Go to [railway.app](https://railway.app)
   - Sign up with GitHub

2. **Deploy Backend**
   ```bash
   cd backend
   npm install -g railway
   railway login
   railway link
   railway up
   ```

3. **Copy Your Backend URL**
   - After deployment, you'll see: `https://your-backend-xxx.railway.app`
   - Save this URL - you'll need it for frontend!

4. **Set Environment Variables on Railway**
   - Go to Railway Dashboard
   - Select your project
   - Click "Variables"
   - Add these:
     ```
     NODE_ENV=production
     MONGODB_URI=your_mongodb_url
     JWT_SECRET=your_secret_key
     PORT=5000
     ```

---

#### Option B: Deploy to Render.com (Alternative)

1. **Create account at [render.com](https://render.com)**

2. **Push backend to GitHub:**
   ```bash
   cd backend
   git init
   git add .
   git commit -m "Backend deployment"
   git branch -M main
   git remote add origin https://github.com/yourusername/collabcampus-backend.git
   git push -u origin main
   ```

3. **Deploy on Render:**
   - Click "New +" → "Web Service"
   - Connect your GitHub backend repo
   - Set Runtime: Node
   - Build Command: `npm install`
   - Start Command: `node server.js` (or your main file)
   - Set environment variables
   - Click Deploy
   - Wait for deployment
   - Copy the URL: `https://your-backend-xxx.onrender.com`

---

#### Option C: Deploy to Heroku (Free tier removed, but still works)

```bash
cd backend
heroku login
heroku create collabcampus-backend
git push heroku main
heroku config:set MONGODB_URI=your_mongodb_url
heroku config:set JWT_SECRET=your_secret
# Copy URL: https://collabcampus-backend.herokuapp.com
```

---

### PHASE 2: Configure Frontend for Production

#### Step 1: Update API Client

Edit **`src/api/client.js`**:

```javascript
import axios from 'axios'

// Get API URL from environment
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

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

#### Step 2: Create `.env.production` file

In your **frontend root** (same level as `package.json`):

```env
VITE_API_URL=https://your-backend-xxx.railway.app/api
```

Replace `https://your-backend-xxx.railway.app/api` with your actual backend URL!

#### Step 3: Update `vite.config.js` for Production

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false, // Disable source maps in production
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      }
    }
  }
})
```

#### Step 4: Test Locally Before Deploying

```bash
# Build production version
npm run build

# Preview production build
npm run preview

# Your app should load and connect to API
# Check DevTools → Network to verify API calls
```

---

### PHASE 3: Deploy Frontend to Vercel

#### Step 1: Prepare GitHub Repository

Push your frontend to GitHub:

```bash
cd collabcampus-frontend

# If not already a git repo
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/collabcampus-frontend.git
git push -u origin main
```

**Make sure to add `.env.production` to `.gitignore`!**

Edit **`.gitignore`**:
```
node_modules/
dist/
.env
.env.local
.env.*.local
*.log
.DS_Store
```

#### Step 2: Create Vercel Account

1. Go to [vercel.com](https://vercel.com)
2. Click "Sign Up"
3. Select "Continue with GitHub"
4. Authorize Vercel to access your GitHub

#### Step 3: Deploy to Vercel

**Option A: Via Vercel Dashboard (Easiest)**

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click "Add New..." → "Project"
3. Select your frontend GitHub repository
4. Configure Project:
   - **Framework**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Click "Environment Variables" section
6. Add environment variable:
   - Name: `VITE_API_URL`
   - Value: `https://your-backend-xxx.railway.app/api`
7. Click "Deploy"
8. Wait for deployment to complete
9. Visit your frontend URL!

**Option B: Via CLI (Faster)**

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
cd collabcampus-frontend
vercel --prod

# When prompted:
# Link to existing project? → Create new
# Scope: → Select your account
# Project name: → collabcampus-frontend
# Use settings from detected vercel.json? → No
# Build Command: → npm run build
# Output Directory: → dist
# Override existing output directory? → Yes

# Add environment variable when asked
# VITE_API_URL=https://your-backend-xxx.railway.app/api
```

---

### PHASE 4: Configure Backend CORS

Your backend must allow requests from your Vercel frontend domain.

Edit your **backend** `server.js` or `app.js`:

```javascript
const cors = require('cors')

// Get Vercel frontend URL from environment
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173'

const corsOptions = {
  origin: [
    'http://localhost:5173',           // Local development
    'http://localhost:3000',           // Local preview
    FRONTEND_URL,                      // Vercel production
    'https://yourdomain.com',          // If you have custom domain
    'https://www.yourdomain.com',
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}

app.use(cors(corsOptions))
```

Set this on your backend hosting:
```
FRONTEND_URL=https://your-frontend-xxx.vercel.app
```

---

## ✅ Complete Deployment Checklist

- [ ] Backend deployed and running (Railway/Render/Heroku)
- [ ] Backend URL copied: `https://_____.railway.app`
- [ ] `.env.production` created with `VITE_API_URL`
- [ ] `src/api/client.js` updated with env variable
- [ ] Backend CORS configured with frontend URL
- [ ] Frontend pushed to GitHub
- [ ] `.env.production` added to `.gitignore`
- [ ] Vercel account created
- [ ] Project deployed on Vercel
- [ ] Environment variables set on Vercel
- [ ] Tested: Can login and use API

---

## 🧪 Testing Your Deployment

### Test 1: Check Frontend Loads
```bash
# Visit your Vercel URL
# https://collabcampus-frontend-xxx.vercel.app
# Should load without errors
```

### Test 2: Check API Connection
1. Open DevTools (F12)
2. Go to "Network" tab
3. Perform an action (login, fetch projects, etc.)
4. Look for API calls starting with `https://your-backend-xxx.railway.app/api`
5. Check response status (should be 200, not 404 or CORS error)

### Test 3: Check Environment Variables
In browser console:
```javascript
// This should show your backend URL
console.log(import.meta.env.VITE_API_URL)
```

---

## 🐛 Troubleshooting

### Issue: CORS Error
```
Access to XMLHttpRequest at 'https://backend...' blocked by CORS
```

**Solution:**
1. Go to backend hosting dashboard
2. Add `FRONTEND_URL` environment variable
3. Restart backend
4. Make sure backend CORS includes your Vercel URL

### Issue: API Returns 404
```
404: Cannot POST /api/login
```

**Solution:**
1. Check `VITE_API_URL` on Vercel dashboard
2. Verify it ends with `/api`
3. Make sure backend is running
4. Check backend API routes exist

### Issue: 502 Bad Gateway
```
502 Bad Gateway
```

**Solution:**
1. Check if backend is running
2. Check backend logs (Railway/Render dashboard)
3. Verify database connection string is correct
4. Restart backend service

### Issue: Empty Page / Build Error
```
Error: Missing environment variable VITE_API_URL
```

**Solution:**
1. Go to Vercel dashboard
2. Project → Settings → Environment Variables
3. Add `VITE_API_URL`
4. Redeploy project

---

## 🔄 How to Update Your Project

### Update Frontend:
```bash
cd collabcampus-frontend
git add .
git commit -m "Update features"
git push origin main
# Vercel auto-deploys!
```

### Update Backend:
```bash
cd backend
git add .
git commit -m "Update API"
git push origin main
# Railway/Render auto-deploys!
```

---

## 📊 Your Final Architecture

```
┌──────────────────────────────────────┐
│    Users Access Frontend             │
│ https://your-app.vercel.app          │
└──────────────────┬───────────────────┘
                   │
                   │ HTTPS API Calls
                   │
┌──────────────────▼───────────────────┐
│    Backend API Running               │
│ https://your-backend.railway.app     │
└──────────────────┬───────────────────┘
                   │
                   │ Database Queries
                   │
┌──────────────────▼───────────────────┐
│    MongoDB Atlas                     │
│ (Cloud Database)                     │
└──────────────────────────────────────┘
```

---

## 💰 Pricing

| Service | Free Tier | Cost |
|---------|-----------|------|
| **Vercel (Frontend)** | 100GB bandwidth/month | Free |
| **Railway (Backend)** | $5 credit/month | $0-50/month |
| **MongoDB Atlas** | 512MB storage | Free |
| **Total** | | ~$10-20/month or Free |

---

## 🎯 Quick Reference

**Backend URL Format:**
```
https://your-backend-xxx.railway.app
```

**Frontend `.env.production`:**
```env
VITE_API_URL=https://your-backend-xxx.railway.app/api
```

**Vercel Environment Variable:**
```
VITE_API_URL = https://your-backend-xxx.railway.app/api
```

**Backend CORS:**
```javascript
origin: ['https://your-frontend.vercel.app']
```

---

## 📞 Need Help?

- **Vercel Issues**: [vercel.com/support](https://vercel.com/support)
- **Railway Issues**: [railway.app/docs](https://docs.railway.app)
- **CORS Errors**: Check backend CORS configuration
- **API Errors**: Check backend logs on hosting dashboard

---

## ✨ Next Steps

1. ✅ Deploy backend to Railway/Render
2. ✅ Get backend URL
3. ✅ Update `.env.production` in frontend
4. ✅ Update backend CORS settings
5. ✅ Deploy frontend to Vercel
6. ✅ Test everything works
7. ✅ Share your app link!

**Your app will be live on the internet! 🚀**
