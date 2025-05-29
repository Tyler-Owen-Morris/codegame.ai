# App Flow Document

## Onboarding and Sign-In/Sign-Up
When a user first discovers the Codegame.ai mobile app, they download it from the Apple App Store or Google Play Store just like any other game. Upon opening the app for the first time, the system automatically checks their identity through the platform’s native game store authentication. There are no extra steps like entering an email or crafting a password. If the user’s store credentials are valid, they are seamlessly signed in and taken directly to the home screen with the camera viewfinder ready. There is no traditional sign-up form or password recovery flow, since account management is delegated to the app store.

On the website side, a user navigates to codegame.ai and clicks on a “Login” button presented in the header. The site displays a dynamic QR code on screen. The mobile app user taps the scanner icon in the app’s interface, points the camera at the website QR code, and the server matches the scanned token to their account. Once the scan is confirmed, the website refreshes and shows the user’s personalized dashboard. A “Logout” link on both mobile and web allows the user to end their session, returning the app to the initial scan invitation or the website to an unauthenticated homepage.

## Main Dashboard or Home Page
After signing in on mobile, the user arrives at the home screen filled by a live camera viewfinder framed with subtle guides that invite them to center a QR code. A semi-transparent prompt at the bottom encourages them to “Scan a QR to begin.” In the top right corner sits a stats icon that, when tapped, transitions to the statistics view. A small menu icon in the top left opens a slide-out panel containing access to settings and a peer QR code generator.

On the website, once logged in, the user sees a clean, monochrome dashboard split into three main sections: a summary of Code Points at the top, a gallery of virtual QR codes in the middle, and a profile customization area at the bottom. Navigation tabs along the header allow the user to jump between Stats, Virtual QR Portal, and Profile without leaving the page.

## Detailed Feature Flows and Page Transitions

### QR Scanning and Puzzle Launch on Mobile
When the user points the camera at any real-world QR code, the app automatically detects and decodes the content. The raw string is trimmed of extra parameters, and the app collects the current GPS coordinates and timestamp. It then sends this data to the backend, where the AI engine generates a puzzle. While the puzzle is being prepared, the camera view gently blurs into the background and puzzle elements animate together on screen as if snapping into place.

### Puzzle Interaction and Reward Flow
Once the puzzle appears, the user tackles it by arranging pattern grids, solving a riddle, or ordering sequence tasks. Correct moves animate with small highlights, and if the user has unlocked hints, they can tap a hint icon to reveal guidance. When the last piece falls into place or the riddle is solved, a trophy icon forms in the center and Code Points increment in real time. If the user scanned in a special geofenced hotspot or within a time-limited event, bonus points apply automatically. A summary overlay shows points earned, and then the screen deconstructs back into the home camera view.

### Viewing Stats and Profile Customization
Tapping the stats icon on mobile or selecting the Stats tab on the website brings up a dashboard of accomplishments. The interface lists total Code Points, counts of each puzzle type solved, logged scan coordinates, and time-based achievements like “Night Owl.” The user can scroll through their history, and any item in the log can be tapped to view details of that puzzle. In the profile customization area, the user can spend Code Points on new themes or puzzle-boost power-ups. Selecting a theme triggers a quick puzzle-style animation as the new style is applied across the app.

### Virtual QR Browsing and Remote Play
On the website’s Virtual QR Portal, the user sees a daily pool of AI-generated virtual QR codes themed to various locations or events. Each code tile displays a brief description and point value. The user opens the mobile scanner, points it at the virtual code on the screen as they would a physical QR, and the backend recognizes it as a virtual scan. A notification informs the user that this puzzle grants fewer points than a real-world scan. The app then follows the same puzzle launch and reward sequence described earlier.

### Peer-to-Peer Challenges and Cooperative Play
From the mobile menu, the user chooses “Show My Peer QR” to generate a dynamic on-screen code. They hand their phone to a friend who scans it in their own app. The server retrieves both players’ scan histories and decides whether to generate a head-to-head challenge or a cooperative split-grid puzzle. In competitive mode, both players receive identical puzzles, and the faster solver gains a speed bonus. The screen shows a live timer countdown. In cooperative mode, each player sees half of a grid and must synchronize moves over a five-minute timer. Successful completion awards Code Shards that can be redeemed for cosmetics.

### AI Fallback and Offline Handling
If the network connection drops or the AI service is temporarily unreachable, the app logs the failure event and switches to a static library of prebuilt puzzles keyed by common QR patterns. The user experiences the same puzzle interface and can play without interruption. Once connectivity returns, the app syncs all pending scan logs, analytics data, and any puzzles generated locally back to the server so that the user’s profile and global statistics remain up to date.

## Settings and Account Management
In the mobile settings panel, the user can toggle location permission, manage notification preferences for special events, and view the app version. A “Sign Out” button revokes the session and returns the app to its initial scan invitation screen. On the website, the user’s profile page includes similar controls for notifications and a “Log Out” link that clears the session cookie and redirects to the public homepage. There is no traditional password or email update flow, as authentication is handled via platform credentials and QR login.

## Error States and Alternate Paths
If the camera fails to detect a QR within a few seconds, a gentle message appears overlaying the viewfinder reading “No QR detected. Please center code within frame.” If the decoded data is invalid or unsupported, the app presents a generic puzzle instead of the location-specific one. When location permission is denied, puzzles still load but without geofenced bonuses. If the AI service returns an error, the fallback puzzles library is used and an alert informs the user that they are in offline mode. All error messages include a single button to retry the action or return to the home camera screen, ensuring the user never gets stuck.

## Conclusion and Overall App Journey
From opening the app and immediately seeing a live camera view to scanning a real-world QR and diving into an AI-generated puzzle, the user experience remains streamlined and immersive. Each puzzle seamlessly transitions back to the home interface with earned Code Points, encouraging continued exploration. Users can check detailed stats, customize their profile, and even take on remote or in-person multiplayer challenges. The companion website complements the mobile journey with a virtual QR portal and secure QR-based login. Throughout the flow, graceful error handling and offline fallbacks keep gameplay uninterrupted. In this way, Codegame.ai delivers an end-to-end puzzle adventure that blends real-world discovery with AI-powered creativity.