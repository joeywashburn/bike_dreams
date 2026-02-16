# 🏗️ The Garage - BMX Bike Build Configurator

A visual bike building tool that lets you maintain a library of parts and configure different builds by mixing and matching components. Perfect for BMX enthusiasts planning their dream builds!

![License](https://img.shields.io/badge/license-MIT-blue.svg)

## ✨ Features

- 🗄️ **Parts Cabinet**: Maintain a library of bike components you're considering
- 🏗️ **Build Configurator**: Create multiple bike builds and mix-and-match parts
- 💰 **Live Pricing**: See real-time total costs as you configure builds
- 🔄 **Easy Swapping**: Quickly swap parts to compare different configurations
- 🌙 **Dark Mode**: Built-in dark mode support
- 🔐 **Authentication**: Secure login with email/password or Google OAuth
- 📱 **Responsive**: Works on desktop and mobile devices

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Firebase account (free tier is fine)
- Java 21 (for local development with Firebase emulators)

### Local Development Setup

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd the_garage
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```

   Edit `.env` and add your Firebase configuration (see [Firebase Setup](#firebase-setup) below)

4. **Start Firebase Emulators** (optional, for local dev)
   ```bash
   # Set Java 21 path
   export JAVA_HOME=/opt/homebrew/opt/openjdk@21
   export PATH="$JAVA_HOME/bin:$PATH"

   # Start emulators in background
   firebase emulators:start --export-on-exit ./firebase-data > firebase.log 2>&1 &
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   - App: http://localhost:5173
   - Firebase Emulator UI: http://localhost:4001 (if using emulators)

See [START.md](./START.md) for detailed startup instructions.

## 🔧 Firebase Setup

1. **Create a Firebase project**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Click "Add project"
   - Follow the setup wizard

2. **Enable Authentication**
   - In Firebase Console, go to Authentication → Sign-in method
   - Enable "Email/Password"
   - Enable "Google" and configure OAuth consent screen

3. **Create Firestore Database**
   - In Firebase Console, go to Firestore Database
   - Click "Create database"
   - Start in **production mode**
   - Choose a location

4. **Deploy Security Rules**
   ```bash
   firebase deploy --only firestore:rules
   ```

5. **Get your Firebase config**
   - In Firebase Console, go to Project Settings → General
   - Scroll to "Your apps" → Web app → Config
   - Copy the config values to your `.env` file

## 📦 Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for complete deployment instructions to Cloudflare Pages.

**Quick deploy:**
```bash
# Build the app
npm run build

# Deploy to Cloudflare Pages (via Git push or drag & drop)
# The built files are in the `dist/` directory
```

## 🗂️ Project Structure

```
the_garage/
├── src/
│   ├── components/
│   │   ├── auth/          # Authentication components
│   │   ├── builds/        # Build configurator components
│   │   ├── common/        # Shared components (Header, ThemeToggle)
│   │   ├── compare/       # Build comparison view
│   │   └── parts/         # Parts cabinet components
│   ├── contexts/          # React contexts (Auth)
│   ├── hooks/             # Custom React hooks
│   ├── pages/             # Page components
│   ├── services/          # Firebase configuration
│   ├── types/             # TypeScript type definitions
│   └── main.tsx           # App entry point
├── firestore.rules        # Firestore security rules
├── firebase.json          # Firebase emulator configuration
└── package.json
```

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Build the app (validates TypeScript)
npm run build
```

## 🔒 Security

- All Firestore data is protected by user-specific security rules
- Authentication required for all operations
- Users can only read/write their own data
- Input validation on both client and server (Firestore rules)
- No secrets in codebase - all config via environment variables

## 📝 Environment Variables

Required environment variables (see `.env.example`):

```bash
VITE_FIREBASE_API_KEY=          # Your Firebase API key
VITE_FIREBASE_AUTH_DOMAIN=      # Your Firebase auth domain
VITE_FIREBASE_PROJECT_ID=       # Your Firebase project ID
VITE_FIREBASE_STORAGE_BUCKET=   # Your Firebase storage bucket
VITE_FIREBASE_MESSAGING_SENDER_ID= # Your messaging sender ID
VITE_FIREBASE_APP_ID=           # Your Firebase app ID

# Optional - set to 'true' to use Firebase emulators in development
VITE_USE_EMULATORS=true
```

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Backend**: Firebase (Authentication + Firestore)
- **State Management**: TanStack React Query
- **Routing**: React Router v6
- **Icons**: Heroicons

## 📖 Usage

### Adding Parts to Your Cabinet

1. Navigate to "Parts Cabinet"
2. Click "Add Part"
3. Fill in details (brand, model, price, image URL)
4. Add shop links for price comparison
5. Save to your cabinet

### Creating a Build

1. Navigate to "The Garage"
2. Click "New Build"
3. Enter a name for your build
4. Select parts from your cabinet for each category
5. Watch the total price update in real-time

### Comparing Builds

1. Navigate to "Compare"
2. Select multiple builds
3. View side-by-side comparison of parts and prices

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Built with [Vite](https://vitejs.dev/)
- UI components from [Headless UI](https://headlessui.com/)
- Icons by [Heroicons](https://heroicons.com/)
- Powered by [Firebase](https://firebase.google.com/)
