# ✅ Pre-Commit Checklist - Public Repository

Before pushing your code to a public Git repository, verify all items on this checklist.

## 🔒 Security

- [x] **No hardcoded API keys** - All Firebase config moved to environment variables
- [x] **`.env` in `.gitignore`** - Environment files will not be committed
- [x] **`.env.example` created** - Template file with placeholder values
- [x] **Firestore rules deployed** - User data is properly isolated
- [x] **No secrets in code** - All sensitive data is in environment variables
- [x] **Firebase emulator data excluded** - `firebase-data/` in `.gitignore`

## 📝 Documentation

- [x] **README.md** - Comprehensive project documentation
- [x] **DEPLOYMENT.md** - Step-by-step deployment guide
- [x] **START.md** - Local development startup guide
- [x] **`.env.example`** - Environment variable template
- [x] **Comments in code** - Key functions are documented

## 🧪 Testing

- [x] **Tests added** - Basic smoke tests in place
- [x] **Build passes** - Run `npm run build` to verify
- [x] **Tests pass** - Run `npm test` to verify

## 🏗️ Build & Deploy

- [ ] **Build locally** - `npm run build` completes without errors
- [ ] **Test locally** - `npm run dev` works as expected
- [ ] **Environment variables set** - `.env` file configured for local dev
- [ ] **Firebase project created** - (if deploying to production)
- [ ] **Firestore rules deployed** - `firebase deploy --only firestore:rules`

## 📦 Repository Hygiene

- [ ] **No `node_modules/`** - Already in `.gitignore`
- [ ] **No `dist/`** - Already in `.gitignore`
- [ ] **No log files** - `*.log` in `.gitignore`
- [ ] **License file** - Add LICENSE file (e.g., MIT)
- [ ] **Meaningful commit messages** - Describe what was changed

## 🚀 Pre-Push Commands

Run these commands before your first push:

```bash
# 1. Ensure .env is not tracked
git rm --cached .env 2>/dev/null || true

# 2. Verify .gitignore is working
git status

# 3. Check for secrets in staged files
git diff --cached

# 4. Build the project
npm run build

# 5. Run tests
npm test

# 6. Check what will be committed
git add .
git status

# 7. Commit and push
git commit -m "Initial commit: BMX Bike Build Configurator"
git push -u origin main
```

## ⚠️ Common Mistakes to Avoid

- ❌ Don't commit `.env` file
- ❌ Don't commit `firebase-data/` directory
- ❌ Don't commit `node_modules/`
- ❌ Don't push without testing first
- ❌ Don't include real Firebase credentials in code

## ✅ You're Ready When...

- [ ] `git status` shows no `.env` file
- [ ] All tests pass: `npm test`
- [ ] Build succeeds: `npm run build`
- [ ] README.md is complete and accurate
- [ ] All checklist items above are checked

---

## 📋 Quick Verification

Run this command to verify no secrets will be committed:

```bash
# Check for potential secrets in git
git grep -iE "(api_key|apikey|api-key|password|secret|token)" -- ':!package-lock.json' ':!*.md'
```

If this returns any matches in source files (not documentation), investigate before pushing!

---

**Once all items are checked, you're ready to push to GitHub! 🎉**
