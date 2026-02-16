# How to Start The Garage

## Prerequisites

- Node.js 18+ and npm
- Java 21 via Homebrew (`openjdk@21`)
- Firebase CLI (`npm install -g firebase-tools`)

## First Time Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```

   Edit `.env` and add your Firebase configuration. For local development with emulators, you can use dummy values:
   ```
   VITE_FIREBASE_API_KEY=demo-key
   VITE_FIREBASE_AUTH_DOMAIN=demo-project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=demo-project
   VITE_FIREBASE_STORAGE_BUCKET=demo-project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
   VITE_FIREBASE_APP_ID=demo-app-id
   VITE_USE_EMULATORS=true
   ```

---

## Daily Startup

## Starting the Application

### 1. Set up Java environment (if not in .zshrc)

```bash
export JAVA_HOME=/opt/homebrew/opt/openjdk@21
export PATH="$JAVA_HOME/bin:$PATH"
```

### 2. Start Firebase Emulators (in background)

**First time / No existing data:**
```bash
firebase emulators:start --export-on-exit ./firebase-data > firebase.log 2>&1 &
```

**Subsequent runs (with existing data):**
```bash
firebase emulators:start --export-on-exit ./firebase-data --import ./firebase-data > firebase.log 2>&1 &
```

This will:
- Import any existing data from `./firebase-data` (if using --import)
- Export data when stopped (to preserve data between sessions)
- Run in the background (detached mode)
- Log output to `firebase.log`

To check if emulators are running:
```bash
tail -f firebase.log
```

To stop the emulators:
```bash
pkill -f "firebase emulators"
```

### 3. Start the Vite Dev Server

**Run in background (detached mode):**
```bash
npm run dev > vite.log 2>&1 &
```

**View the dev server URL:**
```bash
tail vite.log
```

**Stop the dev server:**
```bash
pkill -f "vite"
```

## Access Points

- **App**: http://localhost:5173 (or port shown by Vite)
- **Firebase Emulator UI**: http://localhost:4001
- **Firestore Emulator**: localhost:8081
- **Auth Emulator**: localhost:9098

## Testing

Before committing or deploying, run tests to ensure nothing is broken:

```bash
# Run all tests once
npm test

# Run tests in watch mode (for development)
npm run test:watch

# Build the project (validates TypeScript)
npm run build

# Test + Build (what Cloudflare Pages runs)
npm test && npm run build
```

**Automated Testing:**
- GitHub Actions runs tests on every push (see `.github/workflows/test.yml`)
- Cloudflare Pages runs tests before deployment (build command: `npm test && npm run build`)
- Deployment will be cancelled if tests fail

## Important Notes

- **Java 21 is required** - Java 17 does not work with Firebase emulators for this project
- Data is preserved between runs in the `./firebase-data` directory
- Check `firebase.log` if emulators fail to start
- Always run `npm test` before pushing to ensure nothing broke
