# Monorepo Deployment Guide

## 📁 Your Monorepo Structure
```
COLLAB-CAMPUS-/
├── backend/         # Node.js/Express API
├── frontend/        # React + Vite app
└── README.md
```

---

## 🚀 Deployment Strategy for Monorepo

### Option 1: Deploy Frontend & Backend Separately (Recommended ⭐)

This is the **best approach** for monorepos with different tech stacks.

#### **Frontend → Vercel**
- Host: Static frontend on Vercel
- Cost: Free tier available
- Performance: CDN, automatic deployments

#### **Backend → Railway/Render**
- Host: Node.js API separately
- Cost: Free/cheap tiers available
- Easier to scale independently

---

## 📋 Step-by-Step Deployment

### STEP 1: Deploy Backend First

#### Option A: Railway (Easiest)

1. **Install Railway CLI:**
   ```bash
   npm install -g @railway/cli
   ```

2. **Deploy Backend:**
   ```bash
   cd backend
   railway login
   railway init
   railway up
   ```

3. **Set Environment Variables:**
   - Go to Railway dashboard
   - Add variables:
     ```
     NODE_ENV=production
     MONGODB_URI=your_mongodb_connection_string
     JWT_SECRET=your_secret_key
     PORT=5000
     CORS_ORIGIN=https://your-frontend-url.vercel.app
     ```

4. **Copy Backend URL:**
   - You'll get something like: `https://your-backend.railway.app`
   - **SAVE THIS URL** - you need it for frontend!

---

#### Option B: Render.com

1. **Create account at [render.com](https://render.com)**

2. **Connect GitHub Repo:**
   - Click "New +" → "Web Service"
   - Connect `COLLAB-CAMPUS-` repo
   - **Root Directory:** `backend`
   - Runtime: Node
   - Build Command: `npm install`
   - Start Command: `npm start` or `node server.js`

3. **Environment Variables:**
   - Add all required env vars in Render dashboard

4. **Deploy & Copy URL**

---

### STEP 2: Configure Frontend for Production

1. **Update Frontend `.env`:**
   ```bash
   cd frontend
   ```

   Create `.env.production`:
   ```env
   VITE_API_URL=https://your-backend.railway.app
   ```

2. **Test Build Locally:**
   ```bash
   npm run build
   npm run preview
   ```

---

### STEP 3: Deploy Frontend to Vercel

#### Method A: Vercel Dashboard (Easiest)

1. **Go to [vercel.com](https://vercel.com)**
2. **Import Git Repository:**
   - Click "Add New" → "Project"
   - Select `COLLAB-CAMPUS-` repo
   
3. **Configure Project:**
   - **Framework Preset:** Vite
   - **Root Directory:** `frontend` ← **IMPORTANT!**
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`

4. **Add Environment Variables:**
   - Click "Environment Variables"
   - Add:
     ```
     VITE_API_URL=https://your-backend.railway.app
     ```

5. **Deploy!**
   - Click "Deploy"
   - Wait 2-3 minutes
   - Copy your frontend URL: `https://your-app.vercel.app`

---

#### Method B: Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# From repository root
cd COLLAB-CAMPUS-

# Deploy frontend
vercel --cwd frontend

# Follow prompts:
# - Set root directory: frontend
# - Override settings: Yes
# - Build Command: npm run build
# - Output Directory: dist
```

---

### STEP 4: Update Backend CORS

After deploying frontend, update backend to allow your Vercel URL:

**In `backend/server.js` or wherever CORS is configured:**

```javascript
const cors = require('cors')

app.use(cors({
  origin: [
    'http://localhost:5173',  // Local dev
    'https://your-app.vercel.app',  // Production frontend
  ],
  credentials: true,
}))
```

Redeploy backend after this change.

---

## 🔄 Automatic Deployments (CI/CD)

Once connected to GitHub:

- **Push to `main` branch** → Auto-deploys both services
- **Vercel:** Automatically rebuilds frontend on push
- **Railway/Render:** Automatically rebuilds backend on push

---

## ⚙️ Environment Variables Checklist

### Frontend (.env.production)
```env
VITE_API_URL=https://your-backend.railway.app
```

### Backend (Railway/Render Dashboard)
```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-secret-key-here
PORT=5000
CORS_ORIGIN=https://your-app.vercel.app
```

---

## 🧪 Testing Your Deployment

1. **Test Backend:**
   ```bash
   curl https://your-backend.railway.app/api/health
   ```

2. **Test Frontend:**
   - Open `https://your-app.vercel.app`
   - Check browser console for errors
   - Test API calls (login, projects, etc.)

3. **Check CORS:**
   - If you see CORS errors, update backend CORS settings

---

## 📱 Alternative: Deploy Both to Vercel (Serverless)

If your backend is simple, you can deploy both to Vercel:

### Create `vercel.json` at repository root:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "frontend/package.json",
      "use": "@vercel/static-build",
      "config": { "distDir": "dist" }
    },
    {
      "src": "backend/server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "backend/server.js"
    },
    {
      "src": "/(.*)",
      "dest": "frontend/$1"
    }
  ]
}
```

**Note:** This requires refactoring backend to serverless functions. Not recommended for complex backends.

---

## 🎯 Recommended Setup (Summary)

1. ✅ **Backend** → Railway.app (free tier)
2. ✅ **Frontend** → Vercel (free tier)
3. ✅ **Database** → MongoDB Atlas (free tier)
4. ✅ **Total Cost** → $0/month for small projects

---

## 🐛 Common Issues

### Issue: "API calls failing"
**Solution:** Check VITE_API_URL in Vercel environment variables

### Issue: "CORS errors"
**Solution:** Update backend CORS to include Vercel URL

### Issue: "Build fails on Vercel"
**Solution:** Ensure root directory is set to `frontend`

### Issue: "Environment variables not working"
**Solution:** 
- Use `VITE_` prefix for Vite apps
- Rebuild after adding env vars

---

## 📞 Need Help?

1. Check Vercel deployment logs
2. Check Railway/Render logs
3. Test API endpoints with Postman
4. Check browser console for frontend errors

---

**Ready to deploy?** Start with backend (Railway), then deploy frontend (Vercel)! 🚀
