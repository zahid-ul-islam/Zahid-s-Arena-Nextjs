# Deployment Guide - Zahid's Arena

This guide will help you deploy your football e-commerce platform for **FREE** using Vercel and MongoDB Atlas.

## Prerequisites

- GitHub account
- Vercel account (sign up with GitHub)
- MongoDB Atlas account (free)

---

## Step 1: Prepare Your Code

### 1.1 Create `.env.example`
Create a template for environment variables:

```bash
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key_here
NODE_ENV=production
```

### 1.2 Update `.gitignore`
Ensure `.env` is in your `.gitignore`:

```
.env
.env.local
.env.production
```

### 1.3 Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit - Zahid's Arena"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/football-kits.git
git push -u origin main
```

---

## Step 2: Set Up MongoDB Atlas (Database)

### 2.1 Create Free Cluster

1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up or log in
3. Click **"Build a Database"**
4. Select **"M0 FREE"** tier
5. Choose a cloud provider and region (closest to your users)
6. Click **"Create Cluster"**

### 2.2 Create Database User

1. Go to **Database Access** (left sidebar)
2. Click **"Add New Database User"**
3. Choose **Password** authentication
4. Username: `admin` (or your choice)
5. Password: Generate a strong password (save it!)
6. Database User Privileges: **"Read and write to any database"**
7. Click **"Add User"**

### 2.3 Whitelist IP Addresses

1. Go to **Network Access** (left sidebar)
2. Click **"Add IP Address"**
3. Click **"Allow Access from Anywhere"** (0.0.0.0/0)
4. Click **"Confirm"**

### 2.4 Get Connection String

1. Go to **Database** → **Connect**
2. Choose **"Connect your application"**
3. Copy the connection string
4. Replace `<password>` with your database user password
5. Replace `<dbname>` with `football-kits` (or your preferred name)

Example:
```
mongodb+srv://admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/football-kits?retryWrites=true&w=majority
```

---

## Step 3: Deploy to Vercel

### 3.1 Import Project

1. Go to [vercel.com](https://vercel.com)
2. Sign up/Login with GitHub
3. Click **"Add New"** → **"Project"**
4. Import your `football-kits` repository
5. Click **"Import"**

### 3.2 Configure Project

**Framework Preset**: Next.js (auto-detected)

**Root Directory**: `./` (leave as is)

**Build Command**: `npm run build` (default)

**Output Directory**: `.next` (default)

### 3.3 Add Environment Variables

Click **"Environment Variables"** and add:

| Name | Value |
|------|-------|
| `MONGODB_URI` | Your MongoDB connection string |
| `JWT_SECRET` | A random secret (e.g., `your-super-secret-jwt-key-2024`) |
| `NODE_ENV` | `production` |

> **Generate JWT_SECRET**: Run `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` in terminal

### 3.4 Deploy

1. Click **"Deploy"**
2. Wait 2-3 minutes for build to complete
3. Your site will be live at `https://your-project.vercel.app`

---

## Step 4: Post-Deployment Setup

### 4.1 Add Custom Domain (Optional)

1. Go to your Vercel project → **Settings** → **Domains**
2. Add your custom domain
3. Follow DNS configuration instructions

### 4.2 Create Admin User

Since you don't have a signup page for admins, you need to create one manually:

**Option A: Use MongoDB Atlas UI**
1. Go to MongoDB Atlas → **Browse Collections**
2. Select `football-kits` database → `users` collection
3. Click **"Insert Document"**
4. Add:
```json
{
  "name": "Admin",
  "email": "admin@zahidsarena.com",
  "password": "$2a$10$hashed_password_here",
  "role": "admin"
}
```

**Option B: Use API Route (Temporary)**
Create a temporary signup route or use the existing one to create an admin, then manually update the role in MongoDB Atlas.

### 4.3 Upload Products

1. Log in as admin
2. Go to `/admin/products`
3. Add your products

---

## Step 5: Environment-Specific Configuration

### Development
```env
MONGODB_URI=mongodb://localhost:27017/football-kits
JWT_SECRET=dev-secret-key
NODE_ENV=development
```

### Production (Vercel)
```env
MONGODB_URI=mongodb+srv://...
JWT_SECRET=production-secret-key
NODE_ENV=production
```

---

## Troubleshooting

### Build Fails

**Error**: `Module not found`
- **Fix**: Run `npm install` locally and ensure `package.json` is committed

**Error**: `Environment variable not found`
- **Fix**: Double-check environment variables in Vercel settings

### Database Connection Issues

**Error**: `MongoServerError: bad auth`
- **Fix**: Verify username/password in connection string

**Error**: `Connection timeout`
- **Fix**: Check Network Access whitelist in MongoDB Atlas

### Images Not Loading

**Issue**: Base64 images are large
- **Solution**: Consider using Vercel Blob or Cloudinary for image storage
- **Quick Fix**: Reduce image quality before upload

---

## Automatic Deployments

Every time you push to `main` branch, Vercel will automatically:
1. Build your project
2. Run tests (if configured)
3. Deploy to production

For preview deployments, push to other branches or create pull requests.

---

## Monitoring & Analytics

### Vercel Analytics (Free)
1. Go to your project → **Analytics**
2. Enable Web Analytics
3. View visitor stats, page views, etc.

### MongoDB Atlas Monitoring
1. Go to **Metrics** tab
2. Monitor database performance
3. Set up alerts for high usage

---

## Cost Breakdown

| Service | Free Tier | Limits |
|---------|-----------|--------|
| **Vercel** | Yes | 100GB bandwidth/month |
| **MongoDB Atlas** | Yes | 512MB storage |
| **Total** | **$0/month** | Perfect for starting out |

---

## Scaling Up (When Needed)

When you outgrow free tiers:

1. **Vercel Pro**: $20/month (unlimited bandwidth)
2. **MongoDB Atlas M10**: $57/month (2GB RAM, 10GB storage)
3. **Image CDN**: Cloudinary free tier or upgrade

---

## Security Checklist

- [ ] `.env` file is in `.gitignore`
- [ ] JWT_SECRET is strong and unique
- [ ] MongoDB user has strong password
- [ ] HTTPS is enabled (automatic on Vercel)
- [ ] CORS is configured properly
- [ ] Rate limiting is implemented (consider adding)

---

## Next Steps

1. **Set up monitoring**: Use Vercel Analytics
2. **Add error tracking**: Consider Sentry (free tier available)
3. **Optimize images**: Implement Cloudinary or Vercel Blob
4. **Add caching**: Implement Redis for sessions (Upstash free tier)
5. **SEO**: Add meta tags, sitemap, robots.txt

---

## Support

If you encounter issues:
1. Check Vercel deployment logs
2. Check MongoDB Atlas logs
3. Review this guide
4. Check Next.js documentation

---

**Your site is now live! 🎉**

Share your link: `https://your-project.vercel.app`
