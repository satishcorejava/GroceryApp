# Publishing Cornucopia App to Google Play Store & Apple App Store

## Overview
This guide covers converting the React web application to native mobile apps and publishing them to both app stores.

---

## Phase 1: Converting Web App to Mobile App

### Option A: Using Capacitor (Recommended)
Capacitor allows you to use your existing React codebase and compile it to native iOS and Android apps.

#### Installation & Setup

```bash
# Install Capacitor
npm install @capacitor/core @capacitor/cli --save

# Initialize Capacitor project
npx cap init

# When prompted:
# App name: Cornucopia
# App Package ID: com.cornucopia.grocery
# Directory: ./dist
```

#### Install Native Platforms

```bash
# Install Android platform
npm install @capacitor/android
npx cap add android

# Install iOS platform
npm install @capacitor/ios
npx cap add ios
```

#### Install Required Plugins

```bash
# Camera & Photo Library
npm install @capacitor/camera
npm install @capacitor/photo-gallery

# Geolocation
npm install @capacitor/geolocation

# Push Notifications
npm install @capacitor/push-notifications

# Local Notifications
npm install @capacitor/local-notifications

# Storage
npm install @capacitor/preferences

# App
npm install @capacitor/app

# Sync all plugins
npx cap sync
```

#### Update `capacitor.config.ts`

```typescript
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
    contentInset: 'automatic', // Handles notch/Dynamic Island
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
```

#### Build for Production

```bash
# Build React app
npm run build

# Sync to native projects
npx cap sync

# Copy web assets
npx cap copy
```

---

## Phase 2: Android App Development & Publishing

### 2.1 Prerequisites
- Android Studio (download from [developer.android.com](https://developer.android.com/studio))
- JDK 11 or later
- Android SDK (API level 28+)
- Google Play Developer Account ($25 one-time fee)

### 2.2 Generate Signed APK/AAB

#### Create Keystore File

```bash
cd android

# Generate keystore (one-time)
keytool -genkey -v -keystore release-keystore.jks \
  -keyalg RSA -keysize 2048 -validity 10000 \
  -alias cornucopia-key

# When prompted, enter:
# Keystore password: [Create strong password - save it!]
# Key password: [Same as keystore password]
# Common Name (CN): Your Name
# Organization: Cornucopia
# City: Your City
# State: Your State
# Country Code: Your Country (2 letters)
```

**Important:** Save the keystore password and key alias securely. You'll need it for future updates.

#### Build Signed Bundle (AAB - Recommended)

```bash
cd android

# Using Gradle
./gradlew bundleRelease

# Output: android/app/build/outputs/bundle/release/app-release.aab
```

Alternatively, in Android Studio:
1. Open `android/` folder in Android Studio
2. Go to: Build → Generate Signed Bundle / APK
3. Select "Android App Bundle (AAB)"
4. Select your keystore file
5. Click Build

### 2.3 App Store Listing Configuration

Create an `app-metadata.json` file for Play Store details:

```json
{
  "packageName": "com.cornucopia.grocery",
  "appName": "Cornucopia - Grocery Delivery",
  "shortDescription": "Fresh groceries delivered to your doorstep in 30 minutes",
  "fullDescription": "Cornucopia is your one-stop grocery delivery app. Order fresh vegetables, fruits, dairy, bakery items, meat, and seafood with real-time tracking and multiple payment options.\n\nFeatures:\n- Wide selection of fresh products\n- Real-time order tracking\n- Multiple payment methods (Card, UPI, Pluxee, Cash)\n- Discounted prices and exclusive offers\n- Quick 30-minute delivery\n- Professional delivery agents\n- Secure transactions\n- 24/7 customer support",
  "heroImage": "./assets/hero.png",
  "featureGraphic": "./assets/feature_graphic.png",
  "screenshots": [
    "./assets/screenshots/screenshot1.png",
    "./assets/screenshots/screenshot2.png",
    "./assets/screenshots/screenshot3.png",
    "./assets/screenshots/screenshot4.png",
    "./assets/screenshots/screenshot5.png"
  ],
  "icon": "./assets/icon.png",
  "privacyPolicy": "https://cornucopia.com/privacy",
  "category": "FOOD_AND_DRINK",
  "rating": "4.5+",
  "contentRating": "Everyone",
  "permissions": [
    "android.permission.INTERNET",
    "android.permission.ACCESS_FINE_LOCATION",
    "android.permission.CAMERA",
    "android.permission.READ_EXTERNAL_STORAGE",
    "android.permission.POST_NOTIFICATIONS"
  ]
}
```

### 2.4 Submit to Google Play Store

1. **Create Google Play Developer Account**
   - Visit: https://play.google.com/console
   - Sign in with Google account
   - Accept terms and pay $25 fee

2. **Create App Listing**
   - Click "Create app"
   - App name: "Cornucopia"
   - Language: English
   - Choose category: "Food & Drink"

3. **Fill App Information**
   - Short description (80 chars)
   - Full description
   - Screenshots (5 required, min 320x1024px)
   - Feature graphic (1024x500px)
   - Icon (512x512px)
   - Privacy policy
   - Contact email

4. **Content Rating**
   - Go to: Content rating → Fill questionnaire
   - Submit for rating

5. **Upload Build**
   - Go to: Release → Production
   - Click "Create new release"
   - Upload app-release.aab file
   - Fill release notes

6. **Review & Submit**
   - Verify all information
   - Click "Review release"
   - Accept new permissions (if any)
   - Click "Start rollout to production"

7. **Monitor Review**
   - Google typically reviews within 2-4 hours
   - Check console for status updates
   - App will go live once approved

---

## Phase 3: iOS App Development & Publishing

### 3.1 Prerequisites
- Mac with macOS 12+
- Xcode (download from App Store)
- Apple Developer Account ($99/year)
- Apple ID
- Valid payment method

### 3.2 Prepare iOS Project

```bash
# Install CocoaPods (if needed)
sudo gem install cocoapods

# Navigate to iOS project
cd ios

# Install dependencies
pod install
pod repo update
```

#### Update Info.plist Configuration

In Xcode, open `ios/App/App/Info.plist` and add:

```xml
<dict>
  <!-- Location Permissions -->
  <key>NSLocationWhenInUseUsageDescription</key>
  <string>We need your location to deliver your order accurately</string>
  <key>NSLocationAlwaysAndWhenInUseUsageDescription</key>
  <string>We need your location to track delivery and provide accurate ETAs</string>
  
  <!-- Camera Permissions -->
  <key>NSCameraUsageDescription</key>
  <string>We need camera access to take photos for support tickets</string>
  
  <!-- Photo Library -->
  <key>NSPhotoLibraryUsageDescription</key>
  <string>We need access to your photos to upload to support tickets</string>
  
  <!-- App Tracking Transparency -->
  <key>NSUserTrackingUsageDescription</key>
  <string>We use tracking to show relevant ads and improve your experience</string>
</dict>
```

### 3.3 Build for Production

#### In Xcode:

1. Select "App" in the Project Navigator
2. Go to Build Settings
3. Search for "Code Signing"
4. Set provisioning profile to your team
5. Build: Product → Build For Archive
6. Archive: Product → Archive

#### Using Command Line:

```bash
# Build archive
xcodebuild -workspace ios/App/App.xcworkspace \
  -scheme App \
  -configuration Release \
  -derivedDataPath build \
  -archivePath build/App.xcarchive \
  archive

# Export IPA
xcodebuild -exportArchive \
  -archivePath build/App.xcarchive \
  -exportOptionsPlist ExportOptions.plist \
  -exportPath build/ipa
```

#### Create ExportOptions.plist

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>method</key>
  <string>app-store</string>
  <key>signingStyle</key>
  <string>automatic</string>
  <key>teamID</key>
  <string>YOUR_TEAM_ID</string>
  <key>stripSwiftSymbols</key>
  <true/>
  <key>thinning</key>
  <string>&lt;none&gt;</string>
</dict>
</plist>
```

### 3.4 App Store Connect Setup

1. **Create Apple Developer Account**
   - Visit: https://developer.apple.com/account
   - Enroll in Apple Developer Program ($99/year)
   - Create Apple ID if needed

2. **Set Up App Store Connect**
   - Go to: https://appstoreconnect.apple.com
   - Click "Apps" → "Create new app"
   - Fill details:
     - Platform: iOS, visionOS
     - Name: Cornucopia
     - Primary language: English
     - Bundle ID: com.cornucopia.grocery
     - SKU: unique identifier (e.g., CORNUCOPIA001)

3. **Configure App Information**
   - Subtitle: "Grocery Delivery"
   - Category: Food & Drink
   - Privacy policy URL: https://cornucopia.com/privacy
   - Support URL: https://cornucopia.com/support
   - Marketing URL: https://cornucopia.com

4. **Add Screenshots & Previews**
   - 5.5" display (iPhone SE): 1125×2436px
   - iPad (12.9"): 2048×2732px
   - Upload 2-5 screenshots for each size class
   - Add preview videos (optional)

5. **Review Information**
   - Copyright: © 2026 Cornucopia
   - Age rating: 4+ (Food & Drink)
   - Encryption: if applicable

6. **Manage Signing Certificates**
   - In Xcode: Preferences → Accounts
   - Download signing certificates
   - Create provisioning profiles

### 3.5 Submit to App Store

1. **Build Version**
   - Version number: 1.0
   - Build number: 1

2. **Upload Build**
   - Open Xcode organizer
   - Right-click app archive → Validate
   - Upload to App Store

   OR via Transporter app:
   ```bash
   # Download Transporter from App Store
   # Drag and drop .ipa file to submit
   ```

3. **Submit for Review**
   - Go to App Store Connect
   - Manage builds
   - Select build version
   - Fill review notes:
     - Demo account (if needed)
     - Sign-in instructions
     - How to access all features

4. **Add Review Details**
   - Contact information
   - Demo account credentials
   - Notes about functionality
   - Any third-party SDKs used

5. **Submit for Review**
   - Click "Submit for Review"
   - Apple reviews within 24-48 hours
   - You'll receive email with status

---

## Phase 4: App Store Requirements & Guidelines

### Google Play Store Requirements

- **Minimum API Level:** 28
- **Target API Level:** 33+
- **Content Rating:** Complete questionnaire
- **Privacy Policy:** Required and publicly accessible
- **Permissions:** Justified use of dangerous permissions
- **Installable Size:** Less than 100MB (initially)
- **Store Listing:** Complete with all assets

### Apple App Store Requirements

- **iOS Version:** 12.0+
- **Privacy Policy:** Required
- **App Review Guidelines:** Follow strictly
- **Screenshots:** Accurate representation
- **Keywords:** Up to 30 characters
- **Demo Account:** If login required
- **3rd Party SDKs:** Disclose usage
- **Data & Privacy:** Fill questionnaire

---

## Phase 5: Pre-Launch Checklist

### Functionality Testing
- [ ] All features tested on physical devices
- [ ] Offline functionality (if applicable)
- [ ] Push notifications working
- [ ] Location services working
- [ ] Payment processing tested
- [ ] Deep linking configured
- [ ] No crashes or ANRs
- [ ] Performance optimized

### Assets Preparation
- [ ] App icon (1024x1024px)
- [ ] Screenshots for all sizes
- [ ] Feature graphic (Google Play)
- [ ] Privacy policy document
- [ ] Terms of service
- [ ] App description finalized
- [ ] Keywords optimized
- [ ] Support contact info

### Legal & Compliance
- [ ] Privacy policy complies with GDPR (if EU users)
- [ ] Terms of service documented
- [ ] Permissions justified
- [ ] Data handling policy clear
- [ ] No prohibited content
- [ ] Copyright attribution included

### App Signing
- [ ] Keystore file backed up (Android)
- [ ] Certificates backed up (iOS)
- [ ] Passwords securely stored
- [ ] Version numbering consistent
- [ ] Release notes prepared

---

## Phase 6: After Publishing

### Monitoring & Analytics

```typescript
// Track app events with Firebase Analytics
import { logEvent } from '@capacitor-community/firebase-analytics';

// Track custom events
logEvent({
  name: 'order_completed',
  params: {
    order_id: '123',
    total_amount: 50.99,
    payment_method: 'card'
  }
});
```

### Update Strategy

```bash
# Semantic Versioning:
# Major.Minor.Patch
# 1.0.0 - Initial release
# 1.1.0 - New features
# 1.0.1 - Bug fixes
# 2.0.0 - Major changes
```

### Release Notes Template

```
Version 1.0.1 - Bug Fixes & Improvements

✨ What's New:
- Improved order tracking accuracy
- Enhanced payment security
- Faster app startup

🐛 Bug Fixes:
- Fixed location permission issue on Android 12+
- Resolved cart calculation bug
- Fixed app crash on low memory devices

📱 Requirements:
- Android 8.0+ / iOS 12.0+
```

---

## Phase 7: Marketing & Promotion

### Pre-Launch
- [ ] Create app landing page
- [ ] Set up social media accounts
- [ ] Create teaser videos
- [ ] Get app review coverage
- [ ] Launch beta testing

### Launch
- [ ] Press release
- [ ] Email announcement
- [ ] Social media campaign
- [ ] Influencer outreach
- [ ] App store optimization (ASO)

### Post-Launch
- [ ] Monitor user reviews
- [ ] Respond to feedback
- [ ] Track download metrics
- [ ] A/B test store listings
- [ ] Regular content updates

---

## Troubleshooting

### Android Issues

**Issue:** App crashes on startup
```bash
# Check logs
adb logcat | grep FATAL

# Solution: Verify Capacitor plugins are compatible
npx cap sync
npm run build
npx cap copy
```

**Issue:** Build fails with Gradle error
```bash
# Clean build
cd android
./gradlew clean
./gradlew bundleRelease
```

### iOS Issues

**Issue:** Provisioning profile mismatch
```
# Solution: In Xcode
# Targets → Signing & Capabilities → Team (select team)
```

**Issue:** Pod installation fails
```bash
# Update CocoaPods
sudo gem install cocoapods
cd ios
pod repo update
pod install
```

---

## Estimated Timeline

- **Preparation:** 2-3 weeks
- **Development/Testing:** 2-4 weeks
- **Google Play Review:** 2-4 hours
- **Apple Review:** 24-48 hours
- **Total Time to Launch:** 4-8 weeks

---

## Cost Breakdown

| Item | Cost | Frequency |
|------|------|-----------|
| Google Play Developer Account | $25 | One-time |
| Apple Developer Program | $99 | Annual |
| Code Signing Certificate | Free++ | Included |
| App Distribution | Free | Ongoing |
| **Total First Year** | **$124** | - |
| **Total Subsequent Years** | **$99** | Annual |

---

## Resources & Documentation

- **Capacitor Docs:** https://capacitorjs.com/docs
- **Android Developers:** https://developer.android.com
- **Apple Developer:** https://developer.apple.com
- **Google Play Console:** https://play.google.com/console
- **App Store Connect:** https://appstoreconnect.apple.com
- **Firebase for App Analytics:** https://firebase.google.com

---

## Security Checklist

- [ ] API endpoints use HTTPS
- [ ] Sensitive data encrypted
- [ ] No hardcoded credentials
- [ ] Secure token storage
- [ ] Certificate pinning (optional)
- [ ] ProGuard/R8 enabled (Android)
- [ ] Bitcode enabled (iOS)
- [ ] Regular security audits

---

## Performance Optimization

```typescript
// Optimize bundle size
import { lazy, Suspense } from 'react';

const DeliveryAgent = lazy(() => import('./pages/DeliveryAgent'));

// Code splitting in vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-router'],
          ui: ['framer-motion', 'lucide-react'],
        },
      },
    },
  },
});
```

---

**Last Updated:** February 10, 2026

For questions or issues, refer to official documentation or contact the respective app store support teams.
