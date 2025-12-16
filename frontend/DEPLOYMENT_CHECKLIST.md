# Quick Deployment Checklist for Monorepo

## Before You Deploy

- [ ] **Backend code is ready** (in `backend/` folder)
- [ ] **Frontend code is ready** (in `frontend/` folder)
- [ ] **MongoDB database** is set up (MongoDB Atlas recommended)
- [ ] **Both folders pushed to GitHub** repo `COLLAB-CAMPUS-`

---

## 🎯 Deployment Steps (30 minutes total)

### Step 1: Deploy Backend (15 min)

**Using Railway (Recommended):**

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Go to backend folder
cd backend

# Initialize and deploy
railway init
railway up
```

**Important:** After deployment, **COPY THE BACKEND URL**
Example: `https://collab-campus-backend-production.railway.app`

**Set these environment variables in Railway Dashboard:**
- `NODE_ENV` = `production`
- `MONGODB_URI` = `your_mongodb_connection_string`
- `JWT_SECRET` = `your_secret_key`
- `PORT` = `5000`

---

### Step 2: Deploy Frontend to Vercel (10 min)

**Option A: Vercel Dashboard**

1. Go to [vercel.com](https://vercel.com) → Login with GitHub
2. Click "Add New Project"
3. Select `COLLAB-CAMPUS-` repository
4. **IMPORTANT Settings:**
   - Root Directory: `frontend`
   - Framework: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. **Environment Variables:**
   - Key: `VITE_API_URL`
   - Value: `https://your-backend-url.railway.app` (from Step 1)
6. Click "Deploy"

**Option B: Vercel CLI**

```bash
# Install Vercel CLI
npm install -g vercel

# From the COLLAB-CAMPUS- root directory
vercel --cwd frontend --prod

# When prompted:
# - Root directory: frontend
# - Build settings: default (Vite detected)
```

---

### Step 3: Update Backend CORS (5 min)

After frontend is deployed, update backend CORS:

**Edit `backend/server.js` or `backend/app.js`:**

```javascript
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://your-frontend.vercel.app'  // ← Add your Vercel URL
  ],
  credentials: true
}))
```

**Commit and push:**
```bash
git add .
git commit -m "Update CORS for production"
git push
```

Railway will auto-redeploy.

---

## ✅ Verify Deployment

- [ ] Backend health check: `https://your-backend.railway.app/api/health`
- [ ] Frontend loads: `https://your-frontend.vercel.app`
- [ ] Login works
- [ ] API calls work (check browser console)

---

## 🔑 Environment Variables Summary

### Frontend (Vercel)
```
VITE_API_URL=https://your-backend.railway.app
```

### Backend (Railway)
```
NODE_ENV=production
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/dbname
JWT_SECRET=your-random-secret-key-here
PORT=5000
CORS_ORIGIN=https://your-frontend.vercel.app
```

---

## 🚨 Troubleshooting

**Build fails on Vercel?**
- Check root directory is `frontend`
- Check `package.json` has `build` script

**API calls fail?**
- Check `VITE_API_URL` in Vercel environment variables
- Check CORS settings in backend

**CORS errors?**
- Add Vercel URL to backend CORS whitelist
- Redeploy backend

---

## 🔄 Future Updates

**To update frontend:**
```bash
git add .
git commit -m "Update frontend"
git push
# Vercel auto-deploys
```

**To update backend:**
```bash
git add .
git commit -m "Update backend"
git push
# Railway auto-deploys
```

---

## 📊 Cost

- Railway: Free tier (500 hours/month)
- Vercel: Free tier (unlimited for personal)
- MongoDB Atlas: Free tier (512MB)

**Total: $0/month** 🎉
