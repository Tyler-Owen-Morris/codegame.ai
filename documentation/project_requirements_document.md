# Project Requirements Document (PRD) for Codegame.ai

## 1. Project Overview

Codegame.ai is a mobile puzzle game and companion website built entirely in JavaScript. On the mobile side (Expo / React Native), players scan real-world QR codes with their camera to unlock short, AI-generated puzzles. Each puzzle is themed by the scanned code’s data, the player’s GPS location, and the current time. On the web side (React), users view stats, solve “virtual” QR puzzles remotely, and link their mobile account by scanning a dynamic login QR code.

We’re building Codegame.ai to create a self-extending, location-based puzzle experience without manually authoring thousands of puzzles or relying on map interfaces. The core objectives for the first version are:  
1. Seamless QR scanning → puzzle flow in under 2 seconds  
2. AI-driven puzzle variety (pattern, riddle, sequence) with contextual theming  
3. A simple, monochrome UI that feels like puzzle pieces assembling  
4. A stats portal with a daily pool of virtual QRs  
5. Peer-to-peer scan challenges and co-op puzzles  

Success is measured by reliable scanning, engaging AI puzzles, clear stats visualization, and a robust fallback when the AI service is offline.

---

## 2. In-Scope vs. Out-of-Scope

### In-Scope (MVP Features)
- Mobile app in Expo / React Native  
  - Game-store authentication (Apple/Google)  
  - Camera viewfinder with auto QR decoding and URL-param trimming  
  - AI puzzle generation (pattern, riddle, sequence) via xAI API  
  - Animated puzzle assembly/disassembly UI  
  - Code Points rewards, geofence/time bonuses  
  - Fallback to static puzzle library if AI is unreachable  
- Website in React  
  - QR-based login (dynamic code on screen → scan on mobile)  
  - Stats dashboard: Code Points, puzzle counts, scan history (coords + timestamps), achievements  
  - Daily virtual QR portal (5–10 codes, lower rewards)  
  - Profile customization (themes, puzzle boosts)  
- Peer-to-Peer Interactions  
  - Competitive puzzles with speed bonus  
  - Cooperative half-grid puzzles with shared rewards  
  - Boost trading in person or remotely (reduced value)  
- Backend in Node.js / Express.js  
  - Database of QR data → puzzle mappings  
  - Scan logging (raw code, location, time, user ID)  
  - AI fallback logic  

### Out-of-Scope (Planned for Later)
- In-app purchases or user-facing monetization  
- Map display or interactive mapping UI  
- Marketing portal for external content creators  
- Leaderboards, social feeds, or public puzzle sharing  
- Custom QR generation for real-world placement (beyond login/P2P)  
- Detailed push-notification system  

---

## 3. User Flow

When a new player launches the mobile app for the first time, the app immediately authenticates via the device’s game store (App Store or Play Store). Once signed in, the home screen opens with a full-screen camera viewfinder and a “Scan a QR” prompt. The player simply points the camera at any QR code; the app auto-detects and decodes it, trims URL parameters if needed, then sends the raw code, GPS coordinates, and timestamp to the backend. In under two seconds, an AI-generated puzzle screen assembles itself like interlocking pieces. The player solves a pattern grid, a riddle, or a sequence task, earning Code Points and any geofenced/time bonuses. Upon completion, the puzzle disassembles and the home view returns with a summary of rewards.

On the Code Portal website, users click “Login” to display a dynamic QR code. Scanning it with their mobile app instantly links accounts and populates the web dashboard. The portal shows total Code Points, puzzles solved by type, recent scan coordinates (as a list), and achievements like “Night Owl.” A “Virtual QRs” section offers daily AI-generated remote puzzles. When the player scans a virtual QR on their phone, the same puzzle flow applies but with lower rewards. The website also lets players spend Code Points on UI themes or puzzle boosts, each animated as puzzle pieces clicking into place.

---

## 4. Core Features

- **Authentication**  
  – Native game-store sign-in on mobile  
  – QR login on web (dynamic codes)  
- **QR Scanning & Parsing**  
  – Live camera feed, auto-detect/trim QR data  
  – Store raw string, latitude, longitude, timestamp  
- **AI Puzzle Generation**  
  – Pattern puzzles (grid arrangement)  
  – Text riddles (location/time themes)  
  – Sequence tasks (ordered steps)  
  – Bonus logic for geofenced hotspots and time-limited events  
- **Puzzle UI & Animations**  
  – Assemble/disassemble transitions  
  – Hint boosts and progress feedback  
- **Rewards & Progress Tracking**  
  – Code Points, Code Shards for cosmetics  
  – Ephemeral puzzles vs. saved history  
- **Website Code Portal**  
  – Stats dashboard (points, solved counts, scan logs)  
  – Virtual QR pool (daily rotation)  
  – Profile customization store  
- **Peer-to-Peer Modes**  
  – Competitive challenges with speed bonus  
  – Cooperative puzzles (split grids)  
  – Boost swapping  
- **Fallback System**  
  – Static puzzle library when AI service is offline  
  – Deferred analytics sync  

---

## 5. Tech Stack & Tools

- **Mobile Frontend**: Expo, React Native  
- **Web Frontend**: React  
- **Backend**: Node.js, Express.js  
- **Database**: AWS DynamoDB (or alternative NoSQL/relational)  
- **Hosting**: AWS EC2, Lambda, S3  
- **AI Service**: xAI API (primary)  
- **Fallback**: On-device static puzzle library  
- **AI-Dev Assist**: Claude 3.7 Sonnet, Grok 3  
- **IDE & Plugins**: Cursor (real-time code suggestions), Replit  
- **Auth**: Platform SDKs for game-store login, custom JWT for web sessions  

---

## 6. Non-Functional Requirements

- **Performance**:  
  – QR scan → puzzle load < 2 seconds  
  – Backend puzzle-generation API < 1 second response  
- **Scalability**: Handle 100k+ monthly active users  
- **Reliability**: 99.9% uptime; auto-fallback to static puzzles  
- **Security & Privacy**:  
  – HTTPS everywhere, input validation, stored data encryption  
  – GDPR-compliant handling of location and timestamp data  
- **Usability**:  
  – Clean black/white/grayscale UI  
  – Intuitive camera-first flow  
  – Subtle animations reinforce puzzle theme  
- **Maintainability**:  
  – Single-language stack (JavaScript/TypeScript)  
  – Modular code structure for easy extension  

---

## 7. Constraints & Assumptions

- **AI Availability**: Unlimited xAI usage assumed; fallback library prepared for outages.  
- **Map Services**: No map SDK or visual mapping needed—only raw GPS.  
- **Authentication**: Unique user IDs from device stores; no email/password.  
- **Data Retention**: Scan history stored indefinitely unless user deletes account.  
- **Hosting**: AWS chosen; cost and scaling managed via serverless functions and DynamoDB.  
- **Monetization**: No pay-to-win; future brand-partnership module to be added later.  

---

## 8. Known Issues & Potential Pitfalls

- **QR Format Diversity**: Real-world codes vary in size, contrast, and error-correction—use a robust decoder library (e.g., ZXing).  
- **API Rate Limits / Latency**: High AI traffic could spike latency—implement caching of recent puzzles and exponential backoff retries.  
- **GPS Inaccuracy**: Urban canyons may misplace geofences—allow a small geo-fence radius buffer and fallback generic puzzle.  
- **Offline Scenarios**: Ensure static library covers core puzzle types; queue analytics for later sync.  
- **Privacy Concerns**: Clearly inform users about location logging; allow opt-out of geofenced bonuses.  
- **Cross-Platform Differences**: Camera and permission flows vary on iOS vs. Android—test on multiple devices early.  

With this PRD, the AI and development teams have a clear, unambiguous reference for Codegame.ai’s first release. Subsequent documents (Tech Stack, Frontend Guidelines, Backend Structure, etc.) can be built directly from these specifications.