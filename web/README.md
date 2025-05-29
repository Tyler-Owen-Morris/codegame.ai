# CodeGame.ai Web Portal

A React-based web portal for the CodeGame.ai mobile puzzle game platform.

## Features

### Authentication Flow
- **Unauthenticated users** see the splash page with information about the platform
- **QR Code Authentication** allows users to link their mobile device to the web portal
- **Authenticated users** are redirected to the dashboard to view their stats and progress

### Pages

#### Splash Page (`/`)
- Landing page for unauthenticated users
- Explains the CodeGame.ai concept
- Provides a "Link Mobile Device" button to start authentication

#### QR Login Page (`/qr-login`)
- Generates a QR code for mobile device linking
- Simulates authentication after 10 seconds (for demo purposes)
- Redirects to dashboard upon successful authentication

#### Dashboard Page (`/dashboard`)
- Protected route - requires authentication
- Shows user statistics: Code Points, Puzzles Solved, QR Codes Scanned
- Displays recent activity history
- Provides options to refresh stats or link additional devices

## Development

```bash
npm install
npm run dev
```

## Authentication Logic

The app uses localStorage to persist authentication state:
- User data is stored in `localStorage.getItem('codeGameUser')`
- Authentication state is managed in the main App component
- Route protection is handled through useEffect hooks in individual components
- Unauthenticated users trying to access `/dashboard` are redirected to `/`
- Authenticated users on `/` or `/splash` are redirected to `/dashboard`

## Tech Stack

- React 19
- React Router DOM 7
- Vite
- QRCode library for QR generation
- CSS with responsive design
