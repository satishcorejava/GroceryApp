# Cornucopia Mobile App - Publishing Checklist

## Phase 1: Preparation (Weeks 1-2)

### Development Environment
- [ ] Install Node.js v16+
- [ ] Install Capacitor CLI: `npm install -g @capacitor/cli`
- [ ] Install Android Studio
- [ ] Install Xcode (Mac only)
- [ ] Install CocoaPods: `sudo gem install cocoapods` (Mac)

### Project Setup
- [ ] Run `npm install` to install dependencies
- [ ] Create `capacitor.config.ts` (template provided)
- [ ] Update `vite.config.ts` for mobile optimization
- [ ] Configure environment variables
- [ ] Test web version: `npm run dev`
- [ ] Build web version: `npm run build`

### Documentation Review
- [ ] Read MOBILE_APP_PUBLISHING_GUIDE.md
- [ ] Read MOBILE_DEVELOPMENT_GUIDE.md
- [ ] Review API_DOCUMENTATION.md
- [ ] Plan asset creation timeline

---

## Phase 2: Android Setup (Weeks 1-3)

### Account & Licenses
- [ ] Create Google account
- [ ] Go to https://play.google.com/console
- [ ] Accept Terms & Conditions
- [ ] Pay $25 registration fee
- [ ] Wait 24 hours for account activation

### Project Configuration
- [ ] Run: `npm install @capacitor/android`
- [ ] Run: `npx cap add android`
- [ ] Open android project: `npx cap open android`
- [ ] Configure build.gradle
- [ ] Update AndroidManifest.xml
- [ ] Set App ID: `com.cornucopia.grocery`
- [ ] Set App Name: `Cornucopia`

### Keystore Creation
- [ ] Generate keystore file (validity: 10000 days)
  ```bash
  cd android/app
  keytool -genkey -v -keystore release-keystore.jks \
    -keyalg RSA -keysize 2048 -validity 10000 \
    -alias cornucopia-key
  ```
- [ ] Save keystore password securely
- [ ] Save key alias: `cornucopia-key`
- [ ] Back up keystore file to secure location
- [ ] Update build.gradle with signing config

### Plugin Installation
- [ ] Install & sync Camera plugin
- [ ] Install & sync Geolocation plugin
- [ ] Install & sync Local Notifications plugin
- [ ] Install & sync Storage plugin
- [ ] Test all plugins on physical device

### Testing
- [ ] Test on Android 8.0 device
- [ ] Test on Android 10.0 device
- [ ] Test on Android 12.0+ device
- [ ] Enable location permissions
- [ ] Enable camera permissions
- [ ] Test all features work offline
- [ ] Check for crashes (adb logcat)
- [ ] Verify app size < 100MB

---

## Phase 3: iOS Setup (Weeks 1-3) *Mac Only*

### Account & Licenses
- [ ] Create Apple ID (if needed)
- [ ] Go to https://developer.apple.com
- [ ] Enroll in Developer Program ($99/year)
- [ ] Accept agreements
- [ ] Set up payment method
- [ ] Wait for approval (24-48 hours)

### Project Configuration
- [ ] Run: `npm install @capacitor/ios`
- [ ] Run: `npx cap add ios`
- [ ] Open iOS project: `npx cap open ios`
- [ ] In Xcode: Set Team ID
- [ ] Update Bundle ID: `com.cornucopia.grocery`
- [ ] Update App Name: `Cornucopia`
- [ ] Set minimum iOS version to 12.0

### Provisioning & Certificates
- [ ] Create Certificate Signing Request (CSR)
- [ ] Create iOS App ID
- [ ] Create App Store provisioning profile
- [ ] Download and install certificates
- [ ] In Xcode: Add team and signing certificate
- [ ] Create Ad Hoc provisioning profile (testing)

### Permissions & Configuration
- [ ] Update Info.plist with permissions:
  - [ ] NSLocationWhenInUseUsageDescription
  - [ ] NSCameraUsageDescription
  - [ ] NSPhotoLibraryUsageDescription
- [ ] Configure App Capabilities
- [ ] Enable Background Modes (if needed)

### Testing
- [ ] Test on iPhone SE
- [ ] Test on iPhone 13+
- [ ] Test on iPad
- [ ] Verify all features work
- [ ] Check for crashes (console)
- [ ] Verify app size requirements

---

## Phase 4: Asset Creation (Weeks 2-3)

### Graphics & Icons
- [ ] Design app icon (1024×1024px PNG)
- [ ] Generate icon set for all sizes
- [ ] Create feature graphic (1024×500px)
- [ ] Create hero image (1920×1080px)
- [ ] Use consistent branding
- [ ] Export in correct formats

### Screenshots (Android)
- [ ] Capture home screen screenshot
- [ ] Capture product listing screenshot
- [ ] Capture cart & checkout screenshot
- [ ] Capture order tracking screenshot
- [ ] Capture delivery agent dashboard screenshot
- [ ] Minimum 5 screenshots, maximum 8
- [ ] Size: 1080×1920px (9:16 ratio)
- [ ] Include engaging text overlays
- [ ] Highlight key features

### Screenshots (iOS)
- [ ] Capture for 5.5" display (1125×2436px)
- [ ] Capture for iPad (2048×2732px)
- [ ] Minimum 2 screenshots per size
- [ ] Same content as Android (adapted)
- [ ] Consistent visual style

### Store Listing Content
- [ ] Write app title (50 chars max)
- [ ] Write subtitle (30 chars max)
- [ ] Write short description (80 chars)
- [ ] Write full description (4000 chars max)
- [ ] Highlight 5 key features
- [ ] Include supported languages
- [ ] Create privacy policy document
- [ ] Create terms of service document
- [ ] Prepare support email: support@cornucopia.com
- [ ] Prepare website URL

---

## Phase 5: Build & Testing (Week 3)

### Android Build
- [ ] Run: `npm run build`
- [ ] Run: `npx cap sync`
- [ ] Build signed App Bundle: `./gradlew bundleRelease`
- [ ] Verify file size
- [ ] Output: `app-release.aab` ready
- [ ] Test on emulator
- [ ] Internal testing via Play Console

### iOS Build
- [ ] Run: `npm run build`
- [ ] Run: `npx cap sync`
- [ ] In Xcode: Set Build Number
- [ ] Archive: Product → Archive
- [ ] Export: Automatically managed signing
- [ ] Output: `.ipa` file ready
- [ ] Test on physical device
- [ ] Test on test flight

### QA Testing
- [ ] All features function correctly
- [ ] No crashes or ANRs
- [ ] Performance is acceptable
- [ ] Offline mode works
- [ ] Notifications work
- [ ] Payments process correctly
- [ ] Location tracking works
- [ ] Storage is efficient
- [ ] Battery usage reasonable
- [ ] Memory usage acceptable

---

## Phase 6: Google Play Store Submission

### Create App Listing
- [ ] Click "Create app"
- [ ] App name: "Cornucopia"
- [ ] Default language: English
- [ ] Category: Food & Drink
- [ ] Accept declaration

### Fill App Information
**Store listing section:**
- [ ] Short description (80 chars)
- [ ] Full description (4000 chars)
- [ ] Screenshots (2-8, all dimensions)
- [ ] Feature graphic (1024x500)
- [ ] App icon (512x512)
- [ ] Hero image (optional)
- [ ] Video (optional)

**Categorization:**
- [ ] Category: Food & Drink
- [ ] Content rating: Everyone
- [ ] Category details completed

**Contact details:**
- [ ] Email address set
- [ ] Website URL set
- [ ] Support email configured
- [ ] Privacy policy URL linked
- [ ] Terms of service (if applicable)

### Content Rating
- [ ] Complete Play Console questionnaire
- [ ] Verify rating (typically Everyone)
- [ ] Submit for rating (2-4 hours)

### Pricing & Distribution
- [ ] Set as Free
- [ ] Select distribution countries:
  - [ ] All countries initially
  - [ ] India (primary)
  - [ ] USA
  - [ ] UK
  - [ ] International
- [ ] Accept policies

### Target Audience
- [ ] Age rating: Everyone
- [ ] Target audience: Food lovers, grocery shoppers
- [ ] Designed for tablets: Yes
- [ ] Ad-free version: N/A

### Upload & Review
- [ ] Go to "Release" → "Create new release"
- [ ] Upload app-release.aab file
- [ ] Add release notes
- [ ] Review changes
- [ ] Accept declarations
- [ ] Click "Start rollout to Production"

### Monitor Approval
- [ ] Expected review time: 2-4 hours
- [ ] Check status in Play Console
- [ ] Look for approval/rejection email
- [ ] If rejected, fix issues and resubmit

---

## Phase 7: Apple App Store Submission

### Create App in App Store Connect
- [ ] Sign in to App Store Connect
- [ ] Click "My Apps" → "Create new app"
- [ ] Select iOS

**App Information:**
- [ ] Name: "Cornucopia"
- [ ] Bundle ID: com.cornucopia.grocery
- [ ] SKU: CORNUCOPIA001
- [ ] Primary language: English
- [ ] Category: Food & Drink
- [ ] Subcategory: Grocery

### Fill App Metadata
**App Information:**
- [ ] Subtitle: "Grocery Delivery"
- [ ] Promotional text (optional)
- [ ] Description: Full feature description
- [ ] Keywords (up to 30 chars total):
  - "grocery delivery", "fresh food", etc.
- [ ] Support URL: https://cornucopia.com/support
- [ ] Privacy Policy URL: https://cornucopia.com/privacy
- [ ] Marketing URL: https://cornucopia.com
- [ ] Demo account (if required for login)
- [ ] Notes for Review (explain features)

### Add Screenshots
**For each size class:**
- [ ] iPhone 5.5" (2-5 screenshots, 1125×2436)
- [ ] iPhone 6.5" (2-5 screenshots, 1284×2778)
- [ ] iPad 12.9" (2-5 screenshots, 2048×2732)

**Screenshot checklist:**
- [ ] All required sizes filled
- [ ] No inappropriate content
- [ ] Clear representation of app
- [ ] Text is legible
- [ ] All 4-5 shown
- [ ] Use localization for multiple languages

### Add Preview (Optional)
- [ ] Create app preview video (max 30 seconds)
- [ ] Show key app features
- [ ] mp4 format, 1080×1920 or 1920×1080

### Rating Information
- [ ] Age rating: 4+ (Food & Drink, no violence, etc.)
- [ ] Alcohol use: None
- [ ] Gambling: None
- [ ] Medical info: None
- [ ] Graphic violence: None

### Encryption & Import Information
- [ ] Requires questionnaire
- [ ] Answer questions about encryption
- [ ] Mark as "uses encryption"

### App Review Information
**Contact Information:**
- [ ] Email: support@cornucopia.com
- [ ] Phone: +91-XXX-XXXX-XXXX
- [ ] Address: [Company address]
- [ ] Demo account: [if required]
- [ ] Demo account password: [if required]
- [ ] Notes: Clear instructions on app features

### Upload Build
- [ ] In Xcode: Product → Archive
- [ ] Organizer: Validate App
- [ ] Fix any issues
- [ ] Upload to App Store
- [ ] Wait for processing (5-30 mins)

**OR via Transporter:**
- [ ] Download Transporter app
- [ ] Drag and drop .ipa file
- [ ] Submit to App Store

### Submit for Review
- [ ] Review all information one final time
- [ ] Verify binary is uploaded & processed
- [ ] click "Submit for Review"
- [ ] Select review notes (usually Automatic)
- [ ] Confirm submission

### Monitor Review Process
- [ ] Expected review time: 24-48 hours
- [ ] Check status in App Store Connect
- [ ] You'll receive email with result
- [ ] If approved, select "Release this version"

---

## Phase 8: Post-Launch (After Release)

### Day 1 - Launch
- [ ] Verify app appears in both stores
- [ ] Download and test on real device
- [ ] Share app links on social media
- [ ] Send press release
- [ ] Email existing customers
- [ ] Announce to team

### Week 1 - Monitoring
- [ ] Monitor download numbers
- [ ] Check user reviews daily
- [ ] Respond to reviews promptly
- [ ] Fix any critical bugs
- [ ] Monitor crash reports
- [ ] Check app performance metrics

### Month 1 - Optimization
- [ ] Analyze user feedback
- [ ] A/B test store listings
- [ ] Update screenshots if needed
- [ ] Prepare v1.1 with improvements
- [ ] Monitor user retention
- [ ] Analyze feature usage

### Ongoing
- [ ] Regular feature updates (every 2-4 weeks)
- [ ] Security patches when needed
- [ ] Monitor app store changes/policies
- [ ] Maintain 4.5+ star rating goal
- [ ] Respond to all reviews
- [ ] Track competitor apps
- [ ] Implement user suggestions

---

## Critical Passwords & Keys to Save Securely

- [ ] Google account credentials
- [ ] Apple ID password
- [ ] Keystore password (Android)
- [ ] Keystore key password (Android)
- [ ] API keys (backend services)
- [ ] Certificate passwords (iOS)
- [ ] Database credentials
- [ ] Third-party service keys

**Storage Method:**
- [ ] Use password manager (1Password, Bitwarden)
- [ ] Back up to secure cloud
- [ ] Share securely with team
- [ ] DO NOT commit to git

---

## Common Issues & Solutions

### Android Issues
- **AAB doesn't build:** Clean gradle, update SDK
- **Icon too small:** Must be 512×512 minimum
- **App crashes on launch:** Check Capacitor plugins
- **Play Store rejects APK:** Use AAB format instead

### iOS Issues
- **Signing fails:** Verify team ID and certificates
- **Build archive fails:** Check Xcode version
- **App review rejected:** Fix listed issues, resubmit
- **Screenshots rejected:** Ensure accurate representation

---

## Success Criteria

- [ ] App downloads > 1000 (first month)
- [ ] Average rating > 4.0 stars
- [ ] Crash rate < 1%
- [ ] Active daily users growing
- [ ] User retention > 30%
- [ ] No critical bugs reported
- [ ] Positive user feedback
- [ ] Media coverage secured

---

## Timeline Summary

| Phase | Duration | Deliverable |
|-------|----------|-------------|
| Preparation | 2 weeks | Configured dev environment |
| Android/iOS Setup | 3 weeks | Ready-to-build native projects |
| Asset Creation | 2 weeks | All store graphics ready |
| Build & Testing | 1 week | Tested AAB & IPA files |
| Play Store Submit | 1 day | App submitted to Google |
| App Store Submit | 1 day | App submitted to Apple |
| Review & Approval | 2-4 days | Apps approved by stores |
| Launch | 1 day | Apps live in both stores |
| **Total Timeline** | **4-8 weeks** | **Live in both stores** |

---

## Notes & Progress Tracker

```
Date Started: _______________
Target Launch Date: _______________
Actual Launch Date: _______________

Android Status: _______________
iOS Status: _______________
Play Store URL: _______________
App Store URL: _______________

First Download Count: _______________
First Month Downloads: _______________
Average Rating: _______________

Notes:
_____________________________________________________
_____________________________________________________
_____________________________________________________
```

---

**Version:** 1.0
**Last Updated:** February 10, 2026
**Next Review:** Before each release

---

For questions or help, refer to the official documentation:
- Google Play: https://support.google.com/googleplay/android-developer
- Apple App Store: https://appstoreconnect.apple.com/help
- Capacitor: https://capacitorjs.com/docs
