# 🚀 Deployment Guide

This guide walks you through deploying **The Garage** to production using Cloudflare Pages (frontend) and Firebase (backend).

## 📋 Prerequisites

- A Firebase account (free Spark plan works great)
- A Cloudflare account (free plan works great)
- Git repository (GitHub, GitLab, or Bitbucket)
- Firebase CLI installed: `npm install -g firebase-tools`

## 🔥 Part 1: Firebase Setup

### Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"**
3. Enter project name (e.g., `the-garage`)
4. Disable Google Analytics (optional)
5. Click **"Create project"**

### Step 2: Enable Authentication

1. In Firebase Console, go to **Authentication** → **Sign-in method**
2. Enable **Email/Password**:
   - Click "Email/Password"
   - Toggle "Enable"
   - Click "Save"
3. Enable **Google**:
   - Click "Google"
   - Toggle "Enable"
   - Select support email
   - Click "Save"

### Step 3: Create Firestore Database

1. In Firebase Console, go to **Firestore Database**
2. Click **"Create database"**
3. Select **"Start in production mode"**
4. Choose your location (pick closest to your users)
5. Click **"Enable"**

### Step 4: Deploy Security Rules

1. **Login to Firebase CLI**:
   ```bash
   firebase login
   ```

2. **Initialize Firebase in your project** (if not already done):
   ```bash
   firebase init
   ```
   - Select: **Firestore**
   - Use existing project: Select your project
   - Use default file names (firestore.rules, firestore.indexes.json)

3. **Deploy security rules**:
   ```bash
   firebase deploy --only firestore:rules
   ```

   ✅ This ensures only authenticated users can access their own data!

### Step 5: Get Firebase Configuration

1. In Firebase Console, go to **Project Settings** (gear icon)
2. Scroll to **"Your apps"** section
3. Click **"</> Web"** to add a web app
4. Register app name (e.g., "The Garage Web")
5. **Copy the configuration object** - you'll need these values:

```javascript
{
  apiKey: "AIza...",
  authDomain: "the-garage-xxxxx.firebaseapp.com",
  projectId: "the-garage-xxxxx",
  storageBucket: "the-garage-xxxxx.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
}
```

### Step 6: Configure Google Auth Domain

1. In Firebase Console, go to **Authentication** → **Settings** → **Authorized domains**
2. Add your Cloudflare Pages domain (you'll get this in Part 2):
   - Format: `your-app-name.pages.dev`
   - Example: `the-garage.pages.dev`
3. Click **"Add domain"**

## ☁️ Part 2: Cloudflare Pages Deployment

### Option A: Deploy via Git (Recommended)

1. **Push your code to Git**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. **Connect to Cloudflare Pages**:
   - Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
   - Navigate to **Pages**
   - Click **"Create a project"** → **"Connect to Git"**
   - Authorize GitHub/GitLab/Bitbucket
   - Select your repository

3. **Configure build settings**:
   - **Project name**: `the-garage` (or your choice)
   - **Production branch**: `main`
   - **Build command**: `npm test && npm run build`
   - **Build output directory**: `dist`
   - **Root directory**: `/` (leave blank)

   ℹ️ **Testing Before Deploy**: The build command `npm test && npm run build` will:
   - Run all tests first
   - Only build if tests pass
   - Cancel deployment if tests fail
   - **This is FREE on all Cloudflare plans!**

4. **Add environment variables**:

   Click **"Environment variables"** and add these:

   | Variable Name | Value |
   |--------------|-------|
   | `VITE_FIREBASE_API_KEY` | Your Firebase API key |
   | `VITE_FIREBASE_AUTH_DOMAIN` | Your Firebase auth domain |
   | `VITE_FIREBASE_PROJECT_ID` | Your Firebase project ID |
   | `VITE_FIREBASE_STORAGE_BUCKET` | Your Firebase storage bucket |
   | `VITE_FIREBASE_MESSAGING_SENDER_ID` | Your sender ID |
   | `VITE_FIREBASE_APP_ID` | Your app ID |

   **Note**: Do NOT set `VITE_USE_EMULATORS` in production!

5. **Deploy**:
   - Click **"Save and Deploy"**
   - Wait for build to complete (1-2 minutes)
   - You'll get a URL like: `https://the-garage.pages.dev`

### Option B: Deploy via Direct Upload

1. **Build locally**:
   ```bash
   npm run build
   ```

2. **Upload to Cloudflare**:
   - Go to Cloudflare Pages
   - Click **"Create a project"** → **"Direct Upload"**
   - Drag the `dist` folder or click to browse
   - Click **"Deploy site"**

3. **Set environment variables** (same as Option A, step 4)

### Step 7: Update Firebase Authorized Domains

1. Copy your Cloudflare Pages URL (e.g., `the-garage.pages.dev`)
2. Go back to Firebase Console → **Authentication** → **Settings** → **Authorized domains**
3. Add your domain if not already added

## 🧪 Testing Your Deployment

1. Visit your Cloudflare Pages URL
2. Click **"Sign Up"**
3. Create an account with email/password
4. Or try **"Continue with Google"**
5. Add some parts to your cabinet
6. Create a build
7. Check that data persists after refresh

## 🔄 Updating Your Deployment

### For Git-connected deployments:
```bash
git add .
git commit -m "Your changes"
git push
```
Cloudflare automatically rebuilds and deploys!

### For direct uploads:
```bash
npm run build
# Then drag the new dist/ folder to Cloudflare Pages
```

## 🌐 Custom Domain (Optional)

1. In Cloudflare Pages, go to your project → **Custom domains**
2. Click **"Set up a custom domain"**
3. Enter your domain (e.g., `thegarage.bike`)
4. Follow DNS configuration instructions
5. Update Firebase authorized domains to include your custom domain

## 📊 Monitoring Usage (Free Tier Limits)

### Firebase Spark Plan Limits:
- **Firestore reads**: 50,000/day
- **Firestore writes**: 20,000/day
- **Storage**: 1GB
- **Authentication**: Unlimited users

For 20-30 users, you'll likely use:
- ~500-2,000 reads/day
- ~100-500 writes/day
- ~10-50MB storage

✅ **Well within free limits!**

### Monitoring:
1. Firebase Console → **Usage and billing**
2. Check daily usage
3. Set up budget alerts (optional)

## 🚨 Troubleshooting

### Google Sign-In Not Working
- ✅ Check Firebase authorized domains includes your Cloudflare URL
- ✅ Verify Google sign-in is enabled in Firebase Console

### Build Fails on Cloudflare
- ✅ Check environment variables are set correctly
- ✅ Verify build command is `npm run build`
- ✅ Verify output directory is `dist`

### "Missing environment variables" Error
- ✅ Ensure all `VITE_FIREBASE_*` variables are set in Cloudflare
- ✅ Variable names must match exactly (case-sensitive)
- ✅ Redeploy after adding variables

### Data Not Persisting
- ✅ Check browser console for Firebase errors
- ✅ Verify Firestore rules are deployed: `firebase deploy --only firestore:rules`
- ✅ Check Firebase Console → Firestore Database for data

## 📧 Need Help?

- Firebase Docs: https://firebase.google.com/docs
- Cloudflare Pages Docs: https://developers.cloudflare.com/pages
- Check GitHub Issues for this project

## ✅ Deployment Checklist

- [ ] Firebase project created
- [ ] Authentication enabled (Email + Google)
- [ ] Firestore database created
- [ ] Security rules deployed
- [ ] Firebase config copied
- [ ] Code pushed to Git
- [ ] Cloudflare Pages project created
- [ ] Environment variables added to Cloudflare
- [ ] Build succeeded
- [ ] Cloudflare domain added to Firebase authorized domains
- [ ] Test signup/login works
- [ ] Test creating parts and builds
- [ ] Data persists after refresh

Congratulations! 🎉 Your app is now live!
