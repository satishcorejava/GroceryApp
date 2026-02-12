# Mobile App Building Guide

## Quick Start Commands

### For Windows Users

```bash
# Make setup script executable (in PowerShell)
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Run setup script
.\setup-mobile.bat
```

### For Mac/Linux Users

```bash
# Make setup script executable
chmod +x setup-mobile.sh

# Run setup script
./setup-mobile.sh
```

---

## Essential Commands

### Build & Develop

```bash
# Build for web (required before syncing to mobile)
npm run build

# Sync changes to native projects
npx cap sync

# Copy web assets to native projects
npx cap copy

# Live development (opens in browser)
npm run dev
```

### Android Development

```bash
# Open Android project in Android Studio
npx cap open android

# Run on Android device
npx cap run android

# Build unsigned APK
cd android && ./gradlew assembleDebug

# Build signed App Bundle (AAB) - RECOMMENDED FOR PLAY STORE
cd android && ./gradlew bundleRelease

# Clean Android build
cd android && ./gradlew clean

# Check Android logs
adb logcat
```

### iOS Development (Mac Only)

```bash
# Open iOS project in Xcode
npx cap open ios

# Run on iOS device
npx cap run ios

# Archive for App Store
xcodebuild -workspace ios/App/App.xcworkspace \
  -scheme App \
  -configuration Release \
  archive \
  -archivePath build/App.xcarchive

# Export to IPA
xcodebuild -exportArchive \
  -archivePath build/App.xcarchive \
  -exportOptionsPlist ExportOptions.plist \
  -exportPath build/ipa
```

---

## Add to package.json

Add these scripts to your `package.json`:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "mobile:build": "npm run build && npx cap sync",
    "mobile:open:android": "npx cap open android",
    "mobile:open:ios": "npx cap open ios",
    "mobile:run:android": "npx cap run android",
    "mobile:run:ios": "npx cap run ios",
    "mobile:android:aab": "cd android && ./gradlew bundleRelease",
    "mobile:android:apk": "cd android && ./gradlew assembleDebug",
    "mobile:android:clean": "cd android && ./gradlew clean",
    "mobile:ios:archive": "xcodebuild -workspace ios/App/App.xcworkspace -scheme App -configuration Release archive -archivePath build/App.xcarchive"
  }
}
```

Then use:
```bash
npm run mobile:build           # Build and sync
npm run mobile:android:aab     # Build Android App Bundle
npm run mobile:open:android    # Open Android Studio
npm run mobile:run:android     # Run on Android device
```

---

## File Structure After Setup

```
GroceryApp/
├── src/
│   ├── app/
│   ├── main.tsx
│   └── ...
├── android/                    # Android native code
│   ├── app/
│   │   ├── build.gradle
│   │   ├── src/
│   │   └── release-keystore.jks
│   ├── gradle/
│   └── gradlew
├── ios/                        # iOS native code
│   ├── App/
│   │   ├── App.xcworkspace
│   │   ├── App/
│   │   │   └── Info.plist
│   │   └── Podfile
│   └── Pods/
├── capacitor.config.ts
├── dist/                       # Built web assets
├── assets/                     # App store assets
│   ├── icon.png
│   ├── feature_graphic.png
│   └── screenshots/
├── setup-mobile.bat            # Windows setup script
└── setup-mobile.sh             # Mac/Linux setup script
```

---

## Asset Requirements

### Android (Google Play)

| Asset | Dimensions | Format | Notes |
|-------|-----------|--------|-------|
| App Icon | 512x512 | PNG | No border or padding |
| Feature Graphic | 1024x500 | PNG/JPG | Required |
| Screenshots | 1080x1920 | PNG/JPG | 2-8 required |
| Hero Image | 1920x1080 | PNG/JPG | Optional |

### iOS (App Store)

| Asset | Dimensions | Format | Notes |
|-------|-----------|--------|-------|
| App Icon | 1024x1024 | PNG | No transparency |
| Screenshots | 1125x2436 | PNG/JPG | iPhone 12 Pro |
| Screenshots | 2048x2732 | PNG/JPG | iPad Pro 12.9" |

---

## Creating Keystore for Android

### Windows (PowerShell):

```powershell
# Navigate to android/app directory
cd android/app

# Generate keystore
keytool -genkey -v -keystore release-keystore.jks `
  -keyalg RSA -keysize 2048 -validity 10000 `
  -alias cornucopia-key

# Keep these details secure:
# - Keystore Password
# - Key Alias: cornucopia-key
# - Key Password: (same as keystore)
```

### Mac/Linux:

```bash
cd android/app

keytool -genkey -v -keystore release-keystore.jks \
  -keyalg RSA -keysize 2048 -validity 10000 \
  -alias cornucopia-key
```

**Important Details to Enter:**
- First and Last Name: Your Name
- Organizational Unit: Mobile Development
- Organization: Cornucopia
- City: Your City
- State: Your State
- Country Code: IN (2-letter code)

---

## Signing Configuration (build.gradle)

In `android/app/build.gradle`, add:

```gradle
android {
    signingConfigs {
        release {
            keyAlias = 'cornucopia-key'
            keyPassword = 'your_key_password'
            storeFile = file('release-keystore.jks')
            storePassword = 'your_keystore_password'
        }
    }

    buildTypes {
        release {
            signingConfig = signingConfigs.release
            minifyEnabled = true
            shrinkResources = true
            proguardFiles(
                getDefaultProguardFile('proguard-android-optimize.txt'),
                'proguard-rules.pro'
            )
        }
    }
}
```

---

## Testing on Real Devices

### Android

```bash
# List connected devices
adb devices

# Run on specific device
npx cap run android --device-id=<device_id>

# View live logs
adb logcat | grep cornucopia

# Install APK manually
adb install app-debug.apk

# Grant permissions
adb shell pm grant com.cornucopia.grocery android.permission.ACCESS_FINE_LOCATION
```

### iOS

```bash
# List connected devices
xcrun xcode-select -p

# Run on specific device (requires Xcode)
# Use Xcode's device selector or:
xcodebuild -scheme App -configuration Debug -destination 'generic/platform=iOS' test
```

---

## Troubleshooting

### APK/AAB Build Issues

**Issue:** Gradle sync fails
```bash
cd android
./gradlew clean
./gradlew bundleRelease
```

**Issue:** Memory errors during build
```bash
# Increase Gradle heap size
# Edit gradle.properties:
org.gradle.jvmargs=-Xmx4096m
```

### iOS Build Issues

**Issue:** Pod dependency conflicts
```bash
cd ios
pod deintegrate
pod install
```

**Issue:** Code signing error
- Open ios/App/App.xcworkspace in Xcode
- Select App target
- Go to Signing & Capabilities
- Select your team from dropdown

---

## Deployment Checklist

### Before Building

- [ ] All code committed and pushed
- [ ] npm run build succeeds
- [ ] No console errors
- [ ] Assets prepared (screenshots, icons)
- [ ] Version updated (1.0.0)
- [ ] Build number incremented
- [ ] App ID and package name correct

### Android Deployment

- [ ] Signed keystore created
- [ ] build.gradle configured
- [ ] AAB built successfully
- [ ] Size < 150MB
- [ ] All permissions justified
- [ ] Privacy policy linked
- [ ] Support email configured
- [ ] Screenshots uploaded
- [ ] App content rating submitted

### iOS Deployment

- [ ] Certificates + profiles valid
- [ ] Bundle ID matches
- [ ] Version + build number updated
- [ ] Screenshots for all sizes
- [ ] Privacy policy included
- [ ] Demo account credentials ready
- [ ] Review notes prepared

---

## Monitoring After Launch

```typescript
// Add analytics to track performance
import { logEvent } from 'capacitor-community/firebase-analytics';

// Track important events
logEvent({
  name: 'app_opened',
  params: {
    app_version: '1.0.0',
    platform: 'android'
  }
});
```

---

## Release Notes Template

```
Version X.Y.Z - YYYY-MM-DD

🎉 Ready for Store!
✨ Features
- Feature 1
- Feature 2

🐛 Bug Fixes
- Bug fix 1
- Bug fix 2

📈 Improvements
- Improvement 1
- Improvement 2

🔧 Technical
- Updated dependencies
- Performance improvements
```

---

## Resources

- **Capacitor Docs:** https://capacitorjs.com
- **Android Developers:** https://developer.android.com
- **Apple Developer:** https://developer.apple.com
- **Google Play Console:** https://play.google.com/console
- **App Store Connect:** https://appstoreconnect.apple.com

---

**For detailed instructions, see:** `MOBILE_APP_PUBLISHING_GUIDE.md`
