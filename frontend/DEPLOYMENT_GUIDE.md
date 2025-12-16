# CollabCampus Deployment Guide

## Project Structure
```
collabcampus-frontend/    (Your current React project)
backend/                  (Your backend in different folder)
```

---

## 📋 Pre-Deployment Checklist

### 1. Backend Deployment First (Recommended)
Deploy your backend first so you have the API URL ready for the frontend.

---

## 🚀 DEPLOYMENT OPTIONS

## OPTION 1: Vercel (Recommended for Frontend)

### Step 1: Prepare Frontend for Production

1. **Update API Base URL for Production**
   
Edit `src/api/client.js`:

```javascript
// src/api/client.js
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://your-backend-api.com/api'

// or use environment-based configuration
const API_BASE_URL = 
  import.meta.env.MODE === 'production' 
    ? import.meta.env.VITE_API_URL 
    : 'http://localhost:3000/api'
```

2. **Create `.env.production` file** in frontend root:

```env
VITE_API_URL=https://your-deployed-backend-url/api
```

3. **Update `vite.config.js`** to handle API calls:

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
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

### Step 2: Deploy to Vercel

1. **Create account at [vercel.com](https://vercel.com)**

2. **Push your frontend to GitHub:**
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/collabcampus-frontend.git
git push -u origin main
```

3. **Deploy on Vercel:**
   - Go to [vercel.com/dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Select your GitHub repository
   - Set environment variables:
     - `VITE_API_URL` = `https://your-backend-url`
   - Click "Deploy"

---

## OPTION 2: Netlify (Alternative Frontend)

1. **Build the project:**
```bash
npm run build
```

2. **Create `netlify.toml` in root:**

```toml
[build]
  command = "npm run build"
  publish = "dist"

[dev]
  command = "npm run dev"
  port = 5173

[[redirects]]
  from = "/api/*"
  to = "https://your-backend-url/api/:splat"
  status = 200

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

3. **Deploy:**
   - Connect GitHub repo at [netlify.com](https://netlify.com)
   - Set `VITE_API_URL` in environment variables
   - Deploy

---

## OPTION 3: Docker (Frontend + Backend Together)

### Step 1: Create Frontend Dockerfile

Create `Dockerfile` in frontend root:

```dockerfile
# Build stage
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM node:18-alpine
WORKDIR /app
RUN npm install -g serve
COPY --from=builder /app/dist ./dist
EXPOSE 3000
CMD ["serve", "-s", "dist", "-l", "3000"]
```

### Step 2: Create Docker Compose

Create `docker-compose.yml` in parent folder:

```yaml
version: '3.8'

services:
  backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - MONGO_URI=your_mongodb_url
      - JWT_SECRET=your_jwt_secret
    networks:
      - app-network

  frontend:
    build: ./collabcampus-frontend
    ports:
      - "3000:3000"
    environment:
      - VITE_API_URL=http://backend:5000/api
    depends_on:
      - backend
    networks:
      - app-network

networks:
  app-network:
    driver: bridge
```

### Step 3: Deploy Docker

**Local:**
```bash
docker-compose up -d
```

**To Cloud (AWS ECS, Google Cloud Run, Azure, etc.):**
```bash
# Build and push to Docker Hub
docker build -t yourusername/collabcampus-frontend .
docker push yourusername/collabcampus-frontend

# Then deploy using cloud provider's container service
```

---

## OPTION 4: AWS Deployment

### Frontend on AWS S3 + CloudFront

1. **Build:**
```bash
npm run build
```

2. **Create S3 bucket:**
```bash
aws s3 mb s3://collabcampus-frontend-prod
aws s3 sync dist/ s3://collabcampus-frontend-prod --delete
```

3. **Set environment in S3:**
   - Upload `dist` folder
   - Enable static website hosting
   - Use CloudFront for CDN

4. **Update API URL** for your backend

---

## OPTION 5: Traditional Server (VPS/Heroku)

### Deploy on Heroku (Easy)

1. **Create `Procfile` in root:**
```
web: npm start
```

2. **Update `package.json`:**
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "start": "serve -s dist -l $PORT",
    "preview": "vite preview"
  }
}
```

3. **Install serve:**
```bash
npm install -D serve
```

4. **Deploy:**
```bash
heroku login
heroku create collabcampus-frontend
git push heroku main
heroku config:set VITE_API_URL=https://your-backend-url
```

---

## 📱 Backend Deployment Options

### Node.js Backend

**Option A: Railway.app**
```bash
railway link                    # Connect to your project
railway up                      # Deploy
```

**Option B: Render.com**
- Connect GitHub repo
- Set environment variables
- Deploy

**Option C: Heroku**
```bash
heroku create collabcampus-backend
git push heroku main
heroku config:set MONGODB_URI=your_mongodb_url
```

**Option D: AWS EC2/EB**
```bash
eb create collabcampus-backend-env
eb deploy
```

**Option E: DigitalOcean App Platform**
- Connect GitHub
- Configure build/run commands
- Deploy

---

## 🔐 Environment Variables Setup

### Frontend `.env.production`
```env
VITE_API_URL=https://api.yourdomain.com
VITE_APP_NAME=CollabCampus
VITE_APP_VERSION=1.0.0
```

### Backend `.env`
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/collabcampus
JWT_SECRET=your_super_secret_key
CORS_ORIGIN=https://yourdomain.com
```

---

## 🔗 Connecting Frontend to Backend

### 1. Update API Client (`src/api/client.js`)

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

// Add token to requests
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default client
```

### 2. Update Backend CORS (`backend/server.js` or `app.js`)

```javascript
const cors = require('cors')

const corsOptions = {
  origin: [
    'http://localhost:5173',                    // Local dev
    'https://yourdomain.com',                  // Production domain
    'https://www.yourdomain.com'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}

app.use(cors(corsOptions))
```

---

## 📊 Recommended Deployment Stack

```
┌─────────────────────────────────────┐
│   Frontend: Vercel or Netlify       │
│   (Auto-deploys from GitHub)        │
└────────────────┬────────────────────┘
                 │
                 ↓ API calls (HTTPS)
┌─────────────────────────────────────┐
│   Backend: Railway/Render/Heroku    │
│   (REST API)                        │
└────────────────┬────────────────────┘
                 │
                 ↓ Query
┌─────────────────────────────────────┐
│   Database: MongoDB Atlas           │
│   (Cloud MongoDB)                   │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│   Storage: AWS S3 / Firebase        │
│   (File uploads)                    │
└─────────────────────────────────────┘
```

---

## 🚢 Quick Deployment Steps (Recommended Path)

### Step 1: Prepare Both Projects
```bash
# Frontend
cd collabcampus-frontend
npm run build

# Backend (in separate folder)
cd ../backend
npm install
# Ensure all env variables are set
```

### Step 2: Deploy Backend First

**Using Railway (Easiest):**
```bash
cd backend
npm install -g railway
railway link
railway up
# Note the deployed URL: https://backend-xxx.railway.app
```

### Step 3: Deploy Frontend

**Using Vercel:**
```bash
cd collabcampus-frontend
npm install -g vercel
vercel --env VITE_API_URL=https://backend-xxx.railway.app
```

### Step 4: Test Connection
```bash
# Visit your frontend URL
# Check Network tab in DevTools
# Verify API calls go to your backend
```

---

## 🔍 Troubleshooting

### CORS Error
```
Access to XMLHttpRequest blocked by CORS policy
```

**Solution:** Update backend CORS with frontend domain

### API Not Found
```
404: Cannot POST /api/login
```

**Solution:** 
1. Check `VITE_API_URL` env variable
2. Verify backend is running
3. Check API routes in backend

### Environment Variables Not Loading
```javascript
// Check if variables loaded
console.log(import.meta.env.VITE_API_URL)
```

**Solution:** Restart dev server after changing `.env` files

---

## 📈 Monitoring & Logs

### Vercel
- Dashboard → Logs → view real-time logs

### Railway
```bash
railway logs -f
```

### Heroku
```bash
heroku logs --tail
```

---

## 💡 Best Practices

✅ Always use HTTPS in production  
✅ Never commit `.env` files  
✅ Use different API URLs for dev/prod  
✅ Set up CI/CD for auto-deployment  
✅ Monitor logs and errors  
✅ Use environment variables for sensitive data  
✅ Enable CORS only for trusted origins  
✅ Implement rate limiting on backend  
✅ Use CDN for static assets  
✅ Enable compression on backend  

---

## 🆘 Need Help?

Contact your hosting provider or check their documentation:
- [Vercel Docs](https://vercel.com/docs)
- [Netlify Docs](https://docs.netlify.com)
- [Railway Docs](https://docs.railway.app)
- [Render Docs](https://render.com/docs)
- [Heroku Docs](https://devcenter.heroku.com)

