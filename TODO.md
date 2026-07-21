# TODO - Music Player Refactoring

## Progress Tracking

- [x] **Step 1**: Copy audio file to `public/assets/audio/Bungong_Jeumpa.mp3`
- [x] **Step 2**: Create `src/hooks/useMusicPlayer.tsx` — Extract all music logic from LandingPage into custom hook with React Context
- [x] **Step 3**: Update `main.tsx` — Wrap App with `<MusicPlayerProvider>` for persistent audio across all pages
- [x] **Step 4**: Update `LandingPage.tsx` — Use `useMusicPlayer()` hook instead of local state; UI remains 100% unchanged
- [x] **Step 5**: Update `WebGISDashboard.tsx` — Add floating music player with play/pause and close button
- [x] **Step 6**: Test build — Build successful with no errors

