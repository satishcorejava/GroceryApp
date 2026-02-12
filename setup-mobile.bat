@echo off
REM Cornucopia Mobile App Publishing Setup Script (Windows)
REM This script automates the initial setup for converting web app to mobile

setlocal enabledelayedexpansion

echo.
echo ================================
echo Cornucopia Mobile App Setup
echo ================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    echo Download from: https://nodejs.org/
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo ✅ Node.js found: %NODE_VERSION%
echo.

REM Check if npm is installed
npm --version >nul 2>&1
if errorlevel 1 (
    echo ❌ npm is not installed.
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('npm --version') do set NPM_VERSION=%%i
echo ✅ npm found: %NPM_VERSION%
echo.

REM Install Capacitor CLI globally
echo 📦 Installing Capacitor CLI...
call npm install -g @capacitor/cli
echo ✅ Capacitor CLI installed
echo.

REM Install Capacitor packages
echo 📦 Installing Capacitor packages...
call npm install @capacitor/core @capacitor/cli --save
echo ✅ Capacitor packages installed
echo.

REM Get user input
echo ⚙️  Capacitor Configuration
set /p APP_NAME="Enter app name (default: Cornucopia): "
if "!APP_NAME!"=="" set APP_NAME=Cornucopia

set /p PACKAGE_ID="Enter package ID (default: com.cornucopia.grocery): "
if "!PACKAGE_ID!"=="" set PACKAGE_ID=com.cornucopia.grocery

echo.

REM Create capacitor.config.ts
echo Creating capacitor.config.ts...
(
echo import { CapacitorConfig } from '@capacitor/cli';
echo.
echo const config: CapacitorConfig = {
echo   appId: '!PACKAGE_ID!',
echo   appName: '!APP_NAME!',
echo   webDir: 'dist',
echo   server: {
echo     androidScheme: 'https',
echo     iosSchemeSuffix: '',
echo   },
echo   ios: {
echo     contentInset: 'automatic',
echo   },
echo   android: {
echo     buildOptions: {
echo       keystorePath: './android/app/release-keystore.jks',
echo       keystoreAlias: 'cornucopia-key',
echo     },
echo   },
echo   plugins: {
echo     PushNotifications: {
echo       presentationOptions: ['badge', 'sound', 'alert'],
echo     },
echo   },
echo };
echo.
echo export default config;
) > capacitor.config.ts
echo ✅ capacitor.config.ts created
echo.

REM Build project
echo 🔨 Building React project...
call npm run build
echo ✅ React project built
echo.

REM Add Android
echo 📱 Adding Android platform...
call npm install @capacitor/android
call npx cap add android
echo ✅ Android platform added
echo.

REM Install essential plugins
echo 📦 Installing essential plugins...
call npm install @capacitor/camera
call npm install @capacitor/geolocation
call npm install @capacitor/local-notifications
call npm install @capacitor/preferences
call npm install @capacitor/app
call npm install @capacitor/status-bar
echo ✅ Essential plugins installed
echo.

REM Sync platforms
echo 🔄 Syncing platforms...
call npx cap sync
echo ✅ Platforms synced
echo.

REM Create directories for assets
echo 📁 Creating asset directories...
if not exist "assets" mkdir assets
if not exist "assets\screenshots" mkdir assets\screenshots
if not exist "assets\icons" mkdir assets\icons
echo ✅ Asset directories created
echo.

echo ================================
echo ✅ Setup Complete!
echo ================================
echo.
echo Next Steps:
echo.
echo 1. 📦 Android Development:
echo    - Open 'android' folder in Android Studio
echo    - Configure signing certificate
echo    - Build App Bundle (AAB^)
echo.
echo 2. 🍎 iOS Development (Mac only^):
echo    - iOS setup requires a Mac with Xcode
echo    - Run on Mac: npm install @capacitor/ios ^&^& npx cap add ios
echo.
echo 3. 📸 Add Assets:
echo    - App icon (1024x1024^): assets\icon.png
echo    - Screenshots: assets\screenshots\
echo    - Feature graphic: assets\feature_graphic.png
echo.
echo 4. 🔑 Generate Android Keystore:
echo    cd android\app
echo    keytool -genkey -v -keystore release-keystore.jks ^
echo      -keyalg RSA -keysize 2048 -validity 10000 ^
echo      -alias cornucopia-key
echo.
echo 5. 📋 Create Developer Accounts:
echo    - Google Play Developer: https://play.google.com/console ($25^)
echo    - Apple Developer Program: https://developer.apple.com/account ($99/year^)
echo.
echo 6. 🚀 Deploy:
echo    - Android: Build AAB and upload to Play Console
echo    - iOS: Requires Mac with Xcode
echo.
echo For detailed instructions, see: MOBILE_APP_PUBLISHING_GUIDE.md
echo.
echo Press any key to exit...
pause >nul
