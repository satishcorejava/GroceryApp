#!/bin/bash

# Cornucopia Mobile App Publishing Setup Script
# This script automates the initial setup for converting web app to mobile

set -e

echo "================================"
echo "Cornucopia Mobile App Setup"
echo "================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

echo "✅ Node.js found: $(node --version)"
echo ""

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed."
    exit 1
fi

echo "✅ npm found: $(npm --version)"
echo ""

# Install Capacitor CLI globally
echo "📦 Installing Capacitor CLI..."
npm install -g @capacitor/cli
echo "✅ Capacitor CLI installed"
echo ""

# Install Capacitor packages
echo "📦 Installing Capacitor packages..."
npm install @capacitor/core @capacitor/cli --save
echo "✅ Capacitor packages installed"
echo ""

# Initialize Capacitor project
echo "⚙️  Initializing Capacitor project..."
read -p "Enter app name (default: Cornucopia): " APP_NAME
APP_NAME=${APP_NAME:-Cornucopia}

read -p "Enter package ID (default: com.cornucopia.grocery): " PACKAGE_ID
PACKAGE_ID=${PACKAGE_ID:-com.cornucopia.grocery}

# Create capacitor.config.ts
cat > capacitor.config.ts << 'EOF'
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.cornucopia.grocery',
  appName: 'Cornucopia',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    iosSchemeSuffix: '',
  },
  ios: {
    contentInset: 'automatic',
  },
  android: {
    buildOptions: {
      keystorePath: './android/app/release-keystore.jks',
      keystoreAlias: 'cornucopia-key',
    },
  },
  plugins: {
    PushNotifications: {
      presentationOptions: ['badge', 'sound', 'alert'],
    },
  },
};

export default config;
EOF

echo "✅ capacitor.config.ts created"
echo ""

# Build project
echo "🔨 Building React project..."
npm run build
echo "✅ React project built"
echo ""

# Add Android
echo "📱 Adding Android platform..."
npm install @capacitor/android
npx cap add android
echo "✅ Android platform added"
echo ""

# Add iOS (if on Mac)
if [[ "$OSTYPE" == "darwin"* ]]; then
    echo "🍎 Adding iOS platform..."
    npm install @capacitor/ios
    npx cap add ios
    echo "✅ iOS platform added"
    echo ""
else
    echo "⚠️  iOS platform setup requires a Mac with Xcode"
    echo "   Run on Mac: npm install @capacitor/ios && npx cap add ios"
    echo ""
fi

# Install essential plugins
echo "📦 Installing essential plugins..."
npm install @capacitor/camera
npm install @capacitor/geolocation
npm install @capacitor/local-notifications
npm install @capacitor/preferences
npm install @capacitor/app
npm install @capacitor/status-bar
echo "✅ Essential plugins installed"
echo ""

# Sync platforms
echo "🔄 Syncing platforms..."
npx cap sync
echo "✅ Platforms synced"
echo ""

# Create directories for assets
echo "📁 Creating asset directories..."
mkdir -p assets/screenshots
mkdir -p assets/icons
echo "✅ Asset directories created"
echo ""

echo "================================"
echo "✅ Setup Complete!"
echo "================================"
echo ""
echo "Next Steps:"
echo ""
echo "1. 📦 Android Development:"
echo "   cd android"
echo "   # Open in Android Studio and configure signing"
echo ""
echo "2. 🍎 iOS Development (Mac only):"
echo "   cd ios"
echo "   open App/App.xcworkspace"
echo ""
echo "3. 📸 Add Assets:"
echo "   - App icon (1024x1024): assets/icon.png"
echo "   - Screenshots: assets/screenshots/"
echo "   - Feature graphic: assets/feature_graphic.png"
echo ""
echo "4. 🔑 Generate Android Keystore:"
echo "   cd android/app"
echo "   keytool -genkey -v -keystore release-keystore.jks -keyalg RSA -keysize 2048 -validity 10000 -alias cornucopia-key"
echo ""
echo "5. 📋 Create accounts:"
echo "   - Google Play Developer: https://play.google.com/console ($25)"
echo "   - Apple Developer Program: https://developer.apple.com/account ($99/year)"
echo ""
echo "6. 🚀 Deploy:"
echo "   - Android: Build AAB and upload to Play Console"
echo "   - iOS: Build and upload to App Store Connect"
echo ""
echo "For detailed instructions, see: MOBILE_APP_PUBLISHING_GUIDE.md"
echo ""
