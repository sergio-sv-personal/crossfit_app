# CrossFit Skill Tree

A mobile-first Progressive Web App for tracking CrossFit skill progressions across jump rope, gymnastics, and weightlifting.

## Deploy to Vercel

### Option A: Drag and Drop (quickest)

1. Go to [vercel.com](https://vercel.com) and sign up (free) with your GitHub account
2. From the dashboard, click **Add New > Project**
3. Choose **Import Third-Party Git Repository** or simply drag and drop this entire folder
4. Vercel auto-detects Vite. No config needed. Click **Deploy**.
5. Your app will be live at `https://your-project-name.vercel.app`

### Option B: Via GitHub (auto-deploys on push)

1. Push this folder to a new GitHub repo
2. Go to [vercel.com](https://vercel.com) > Add New > Project
3. Import the repo
4. Deploy

Every push to main will automatically redeploy.

## Add to Phone Home Screen

Once deployed:

**iPhone (Safari)**
1. Open your Vercel URL in Safari
2. Tap the Share button (square with arrow)
3. Scroll down and tap "Add to Home Screen"
4. Tap "Add"

**Android (Chrome)**
1. Open your Vercel URL in Chrome
2. Tap the three-dot menu
3. Tap "Add to Home Screen" or "Install app"
4. Confirm

The app works offline after first load. Progress is saved locally on your device.

## Local Development

```bash
npm install
npm run dev
```

Open `http://localhost:5173` on your phone (same Wi-Fi network) using your computer's local IP.

## Tech Stack

- Vite + React 18
- PWA via vite-plugin-pwa (Workbox)
- localStorage for progress persistence
- Zero external runtime dependencies beyond React
