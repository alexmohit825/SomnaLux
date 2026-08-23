# SomnaLux: iOS Simulator, GitHub & TestFlight Deployment Guide

This guide walks you through taking the SomnaLux native Swift codebase on your Mac, testing it in the **iOS Simulator**, pushing it to **GitHub**, and distributing it to beta testers via **Apple TestFlight**.

---

## Part 1: Running in the iOS Simulator on Mac

### Step 1: Transfer Code to your Mac
You can either:
- **Clone from GitHub**: `git clone https://github.com/YOUR_USERNAME/somnalux-sleep-app.git`
- **Or Copy the `ios/SomnaLux` Folder**: From this project directory.

### Step 2: Open in Xcode (15+ / 16+)
1. Open **Xcode** on your Mac.
2. Select **File > New > Project...** -> **iOS > App**.
3. Name the product **`SomnaLux`**, set Organization Identifier to **`com.somnalux`** (Bundle ID: `com.somnalux.sleep`), Interface: **SwiftUI**, Language: **Swift**.
4. Drag and drop the `ios/SomnaLux` folders (`Theme`, `Models`, `Services`, `Views`, `Widgets`) into your Xcode project navigator (select *"Copy items if needed"* and *"Create groups"*).

### Step 3: Add Entitlements in Xcode
1. Click the top-level **SomnaLux** project in the navigator.
2. Go to **Signing & Capabilities** -> click **+ Capability**:
   - **HealthKit**: Check *"Background Delivery"* and *"Clinical Health Records"* (if applicable).
   - **Background Modes**: Check *"Audio, AirPlay, and Picture in Picture"* and *"Background fetch"*.

### Step 4: Run in the iOS Simulator
1. In the top toolbar, select an iOS Simulator (e.g. **iPhone 15 Pro** or **iPhone 16 Pro**).
2. Press **`Cmd + R`** (or click the Play button).
3. The app will launch with the **First-Time User Onboarding Guide**, interactive **SWS reservoir**, **Cellular Science Lab**, **Audio Synthesizer**, and **What-If modeler**.

---

## Part 2: Pushing to GitHub

1. In your Mac Terminal, inside the project folder:
   ```bash
   git init
   git add .
   git commit -m "feat: SomnaLux Native iOS 17+ complete SwiftUI rebuild"
   ```
2. Create a repository on [GitHub](https://github.com/new) named `somnalux-ios`.
3. Push your code:
   ```bash
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/somnalux-ios.git
   git push -u origin main
   ```

---

## Part 3: Deploying to Apple TestFlight

### Prerequisites (One-Time Setup):
1. **Apple Developer Program**: Ensure you have an active account at [developer.apple.com](https://developer.apple.com).
2. **App Store Connect**:
   - Log into [appstoreconnect.apple.com](https://appstoreconnect.apple.com).
   - Go to **Apps > + New App**.
   - Select iOS, Name: **SomnaLux**, Bundle ID: **`com.somnalux.sleep`**, SKU: `somnalux-01`.

### Pathway A: Distribute via Xcode (Easiest Manual Method)
1. In Xcode, set the run destination to **`Any iOS Device (arm64)`**.
2. Increment the Build number in your project settings (e.g. Version `1.0.0`, Build `1`).
3. Select **Product > Archive** from the menu bar.
4. When the Organizer window opens, click **Distribute App**.
5. Select **TestFlight & App Store** -> click **Next**.
6. Select **Automatically manage signing** -> click **Upload**.
7. In ~10 minutes, Apple will process the build and it will appear under the **TestFlight** tab in App Store Connect.
8. Add internal or external testers with their email address, and they will receive a TestFlight invite immediately!

### Pathway B: Automated GitHub Actions CI/CD (Zero-Touch)
The `.github/workflows/ios-testflight.yml` workflow automatically builds and pushes new tags:
1. In App Store Connect, go to **Users and Access > Integrations > App Store Connect API**.
2. Generate an API Key with **Admin** or **App Manager** access and download the `.p8` key file.
3. In your GitHub repository, go to **Settings > Secrets and variables > Actions** and add:
   - `APP_STORE_CONNECT_KEY_ID`: Your Key ID (e.g. `2X9R4HXF34`).
   - `APP_STORE_CONNECT_ISSUER_ID`: Your Issuer ID UUID.
   - `APP_STORE_CONNECT_PRIVATE_KEY`: The complete contents of the `.p8` file.
4. To release a new TestFlight build automatically:
   ```bash
   git tag v1.0.1
   git push origin v1.0.1
   ```
   GitHub Actions will spin up a macOS runner, archive the project, and upload it directly to TestFlight!
