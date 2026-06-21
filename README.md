# ERD-7 Environment Recovery Dynamic

Packaged starter for a React web app and Android WebView app.

## Web
```bash
cd web
npm install
npm run dev
npm run build
```

## Android
Open `android/` in Android Studio. The native app loads the deployed ERD-7 web app URL. For local testing, replace `https://your-erd7-web-build.example` in `MainActivity.kt` with your hosted Vite build URL.

## Included functionality
- ERD-7 command buttons and mode switching
- Recovery task engine
- Dynamic timer
- XP/rank/reward loop
- Sellable-item cash estimate stub
- Photo upload for status/preview workflow
- Guild/multi-user roster
- Diplomacy/human-conflict safe script
- Safety lock mode

## Next production steps
- Add server storage and authentication
- Add computer vision item detection
- Add cleaned-room preview generation
- Add local marketplace pricing API
- Replace Android WebView URL with hosted production domain
