# Frontend Guideline Document

This document lays out how the frontend of Codegame.ai (the mobile app) and Code Portal (the companion website) are built, styled, organized, and tested. It’s written in everyday language so anyone can understand how our frontend works and why we made these choices.

## 1. Frontend Architecture

### Overview
- **Mobile App:** Built with Expo and React Native. This lets us write JavaScript once and ship to both iOS and Android. Expo simplifies camera and QR scanning access.
- **Website (Code Portal):** Built with React. We keep both codebases in the same mono-repo for consistency, sharing utility functions and types when possible.

### How It Supports Scalability, Maintainability, and Performance
- **Component-Based:** Every piece of UI—buttons, puzzle screens, stats charts—is its own component. This makes it easy to update or reuse bits of the interface without touching unrelated code.
- **Modular File Structure:** We group files by feature (for example, a “Puzzle” folder contains all code—components, styles, tests—related to puzzles). That way, it’s straightforward to find and change code when adding new features or fixing bugs.
- **Code Splitting & Lazy Loading:** On the website, we load heavy parts (like the stats dashboard) only when someone visits that page. On mobile, screens are loaded on demand. This cuts initial load time and keeps the experience snappy.
- **Shared Utility Layer:** Common functions—such as formatting timestamps or decoding QR data—live in a shared folder. This reduces duplication and helps keep behavior consistent between mobile and web.

## 2. Design Principles

We stick to three big ideas throughout the UI:

1. **Usability:** Players should focus on solving puzzles, not learning how the app works. We keep controls simple, labels clear, and flows direct (scan → puzzle → finish).
2. **Accessibility:** Text sizes meet minimum contrast ratios. Buttons and interactive elements are large enough to tap easily. Screen-reader labels are added where needed.
3. **Responsiveness:** On mobile, layouts adapt to different screen sizes and orientations. On the website, the interface works from narrow tablet windows up to large desktop monitors.

In practice, this means:
- Clear, consistent button placement (e.g., “Scan” always bottom center on mobile).
- Headings, instructions, and error messages standardized in size and spacing.
- Keyboard focus styles on the web so users navigating without a mouse know where they are.

## 3. Styling and Theming

### Styling Approach
- We use **CSS Modules** combined with **SASS** for the website and **Styled Components** for the mobile app. Both approaches let us scope styles to a component, avoiding global CSS clashes.
- Naming follows a **BEM-like** convention inside CSS Modules (`.Puzzle__header`, `.Puzzle__button--active`) and styled-components use clear, semantic names (`<PuzzleHeader>`, `<PrimaryButton>`).

### Theming
- A single **theme file** defines colors and spacing units. Components pull values from that theme, ensuring nothing drifts out of sync.
- We export theme tokens like `colors.primary`, `spacing.medium`, `fonts.body` for use everywhere.

### Visual Style
- Overall look: **Flat and modern** with subtle puzzle-piece animations (assembling/disassembling) to delight users without distraction.
- Glassmorphism is avoided—our style is clean and content-focused.

#### Color Palette
- Black: `#000000`
- White: `#FFFFFF`
- Dark Gray: `#333333`
- Medium Gray: `#777777`
- Light Gray: `#DDDDDD`

#### Typography
- Font family: System defaults (`-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif`)
- Heading sizes: 24px, 20px, 16px
- Body text: 14px with line-height 1.5

## 4. Component Structure

- **Feature Folders:** Each major area (e.g., `Scan`, `Puzzle`, `Dashboard`) has its own folder:
  - `components/` for shared UI elements (buttons, modals)
  - `screens/` or `pages/` for top-level views
  - `styles/` for SASS/CSS files (web)
  - `__tests__/` for test files
- **Reusability:** We create small, focused components (e.g., `<PuzzlePiece>`, `<CodePointBadge>`) and assemble them into larger ones. This cuts down on repeat code and makes styling consistent.
- **Separation of Concerns:** Logic lives in hooks (e.g., `usePuzzleData`), while components focus on markup and styling.

## 5. State Management

- **Global State:** We use **Redux Toolkit**. It holds persistent data like user authentication info, Code Points balance, and the static puzzle library for AI fallback.
- **Local Component State:** For UI details (e.g., “is this modal open?”) we use React’s `useState` or Context API when we need to share state within a subtree.
- **Async Data Fetching:** Redux Toolkit Query handles API calls (xAI puzzle requests, stats endpoints), caching results and automatically refreshing when needed.
- **Offline Fallback:** If the xAI API is down, Redux logic pulls a random puzzle from our static library slice.

## 6. Routing and Navigation

### Website (Code Portal)
- **Library:** React Router v6
- **Structure:** Top-level routes for `/dashboard`, `/puzzles`, `/profile`, and `/login`. A catch-all 404 page handles bad URLs.
- **Navigation UI:** A sticky header with navigation links; the active link is visually highlighted.

### Mobile App (Expo/React Native)
- **Library:** React Navigation (Stack Navigator + Bottom Tabs)
- **Flow:**
  1. **Auth Stack:** Apple/Google login
  2. **Main Tabs:**
     - **Scan:** Opens camera to scan QR codes
     - **Puzzles:** Shows history and virtual portal
     - **Profile:** Displays stats and settings
- **Deep Links:** Scanning the QR on the website triggers the app to open at the right puzzle or login screen.

## 7. Performance Optimization

- **Lazy Loading Screens & Routes:** Both web and mobile only load code for a screen when a user navigates to it.
- **Asset Optimization:** We compress images, SVGs, and bundle icons into a sprite or vector format.
- **Hermes Engine:** Enabled for Android builds in Expo to speed up JS execution.
- **Image Caching:** Puzzle illustrations and profile avatars are cached locally on the mobile app for quick reloads.
- **Minification & Tree Shaking:** Web builds strip unused code and shrink bundles.

## 8. Testing and Quality Assurance

- **Unit Tests:** Jest + React Testing Library for both mobile and web components. We test each component’s render logic and edge cases.
- **Integration Tests:** Redux slices and RTK Query endpoints get tested to ensure data flows correctly.
- **End-to-End Tests:**
  - **Website:** Cypress simulates real user flows (login, view stats, solve a virtual QR puzzle).
  - **Mobile:** Detox runs on emulators to cover scanning QR codes and solving puzzles in under 2 seconds.
- **Linting & Formatting:** ESLint (with Airbnb rules) and Prettier keep code style consistent.
- **Continuous Integration:** On every pull request, we run lint, tests, and a basic performance check before merging.

## 9. Conclusion and Overall Frontend Summary

Our frontend setup—React Native for mobile, React for web—is built around a clear, component‐based architecture and a minimal, monochrome style. We focus on:

- **Maintainability:** Modular files, shared utilities, and strict naming make onboarding new developers easy.
- **Scalability:** Lazy loading, Redux Toolkit Query, and AWS hosting scale to 100k+ users.
- **Performance:** Under‐2‐second load times for scanned puzzles, asset optimization, and caching deliver a smooth experience.
- **Quality:** Automated tests and CI/CD guard against regressions.

With this guideline, anyone can understand how we build Codegame.ai’s frontend, add new features, or tweak the design—all while keeping the game fast, accessible, and fun.