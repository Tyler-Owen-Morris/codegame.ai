# Implementation plan

## Phase 1: Environment Setup

1. **Prevalidation:** In your project root, run `git status` and verify there is no existing `/mobile` or `/web` directory. If present, skip initialization. (**Project Overview**)
2. **Install Node.js:** Ensure Node.js v20.2.1 is installed. If not, install via https://nodejs.org/dist/v20.2.1/. (**Tech Stack**)
3. **Install Git:** Verify `git --version`. If missing, install Git from https://git-scm.com/downloads. (**Tech Stack**)
4. **Initialize Git repository:** If `git status` failed above, run `git init` in project root. (**Tech Stack**)
5. **Create directory structure:** In root, create `/mobile`, `/web`, `/backend`, `/infrastructure`. (`mkdir mobile web backend infrastructure`) (**Project Overview**)
6. **Set up GitHub repo:** On GitHub, create `codegame-ai` repo, then run `git remote add origin git@github.com:<your-org>/codegame-ai.git`. (**Version Control**)
7. **Configure Cursor:** Create `cursor_metrics.md` in project root and reference `cursor_project_rules.mdc` for metrics guidelines. (**Tools**)
8. **Configure Replit:** In Replit, import the GitHub repo and confirm project directory sync. (**Tools**)
9. **Install AWS CLI:** Run `pip install awscli` (or OS equivalent) and `aws configure`, supplying your AWS access key, secret, and `us-east-1` region. (**Tech Stack**)
10. **Validate AWS CLI:** Run `aws sts get-caller-identity` and confirm your AWS account ID and region. (**Tech Stack**)

## Phase 2: Frontend Development

### Mobile App (Expo/React Native)
11. **Create Expo project:** In `/mobile`, run `npx expo-cli init codegame-mobile --template blank --npm`. (**Tech Stack**)
12. **Install device integrations:** Run `npm install expo-barcode-scanner expo-location expo-apple-authentication expo-google-sign-in`. (**Key Features**)
13. **Add QR scanner component:** Create `/mobile/src/components/QRScanner.js` implementing `BarCodeScanner` and trimming URL params from scanned data. (**Key Features**)
14. **Add puzzle screen:** Create `/mobile/src/screens/PuzzleScreen.js` to display AI-generated puzzles and animate piece assembly/disassembly using React Native `Animated`. (**UI/UX**)
15. **Apply monochrome theme:** In `/mobile/src/theme.js`, define black/white/grayscale palette and import into all screens. (**UI/UX**)
16. **Integrate game-store auth:** In `/mobile/src/services/auth.js`, configure `expo-apple-authentication` and `expo-google-sign-in` per platform docs. (**Important Details and Requirements**)
17. **API service module:** Create `/mobile/src/services/api.js` exporting `scanQRCode(data, location)` that posts to `https://<API_ENDPOINT>/api/puzzles/scan`. (**Data Storage**)
18. **Validate mobile build:** Run `expo start` and test a QR scan → PuzzleScreen load time <2 s on physical device. (**Performance**)

### Website (React)
19. **Create React app:** In `/web`, run `npx create-react-app code-portal`. (**Tech Stack**)
20. **Install dependencies:** Run `npm install react-qr-reader react-router-dom axios`. (**Key Features**)
21. **QR login page:** Create `/web/src/pages/Login.js` using `react-qr-reader` to read string and POST to `/api/auth/login`. (**Important Details and Requirements**)
22. **Stats dashboard:** Create `/web/src/pages/Dashboard.js` that GETs `/api/users/:userId/stats` and displays Code Points, puzzles solved, scan history. (**Key Features**)
23. **Virtual QR list:** Create `/web/src/components/VirtualQRList.js` fetching daily pool via GET `/api/puzzles/virtual` and rendering QR codes. (**Key Features**)
24. **Validate web build:** Run `npm start` and verify login → dashboard flows work and responses <1 s. (**Performance**)

## Phase 3: Backend Development

25. **Initialize Express project:** In `/backend`, run `npm init --yes`, set `"engines": {"node": "20.2.1"}` in `package.json`. (**Tech Stack**)
26. **Install dependencies:** Run `npm install express aws-sdk cors jsonwebtoken axios`. (**Tech Stack**)
27. **Bootstrap server:** Create `/backend/index.js` importing Express, apply CORS, and listen on port 3001. (**Tech Stack**)
28. **Configure CORS:** In `/backend/index.js`, allow origins `http://localhost:19006` and `http://localhost:3000`. (**App Flow**)
29. **Design DynamoDB schema:**
    - **Users**: `userId` (PK), `createdAt`
    - **Scans**: `scanId` (PK), `userId` (GSI), `codeData`, `lat`, `lng`, `timestamp`
    - **Puzzles**: `puzzleId` (PK), `codeData`, `generatedAt`, `payload`
    - **Stats**: `userId` (PK), `puzzlesSolved`, `codePoints`
   Create tables via CLI: e.g. `aws dynamodb create-table --table-name Users --attribute-definitions AttributeName=userId,AttributeType=S --key-schema AttributeName=userId,KeyType=HASH --billing-mode PAY_PER_REQUEST`. (**Database**)
30. **Validate tables:** Run `aws dynamodb list-tables` and confirm all four tables exist. (**Database**)
31. **Implement scan endpoint:** In `/backend/routes/scan.js`, create `POST /api/puzzles/scan` that:
    a. Validates `codeData`, `lat`, `lng`, `timestamp`, `userId` from body
    b. Queries `Puzzles` table for existing puzzle
    c. If missing, calls xAI API (`axios.post('https://api.xai.ai/puzzles', {...})`)
    d. On API failure, picks random entry from `/backend/data/staticPuzzles.json`
    e. Stores new puzzle in `Puzzles` table and returns it
   (**Key Features**)
32. **Implement login endpoint:** In `/backend/routes/auth.js`, create `POST /api/auth/login` that decodes QR string, looks up `Users` table or creates new `userId`, issues JWT signed with HS256. (**Important Details and Requirements**)
33. **User stats endpoint:** In `/backend/routes/users.js`, create `GET /api/users/:userId/stats` aggregating `Scans` and `Puzzles` counts, returning `Code Points` and achievements. (**Key Features**)
34. **Error handling middleware:** Create `/backend/middleware/errorHandler.js` to catch exceptions and respond with `{ error: message }` and appropriate HTTP code. Import into `index.js`. (**Important Details and Requirements**)
35. **Validate backend:** In `/backend/tests`, write tests for all endpoints; run `npm test` and assert <1 s average response time. (**Performance**)

## Phase 4: Integration

36. **Configure mobile API URL:** In `/mobile/app.json`, set `extra.API_URL` to `https://<production>/api`. (**Integration**)
37. **Configure web environment:** In `/web/.env`, add `REACT_APP_API_URL=https://<production>/api`. (**Integration**)
38. **End-to-end test:** Use physical device to scan a real-world barcode → mobile calls backend → puzzle displays; measure total time <2 s. (**Performance**)
39. **Peer-to-peer test:** Two devices scan each other’s generated QR → verify competitive puzzles (speed bonus) and cooperative puzzles (split grid) are created. (**Peer-to-Peer Interactions**)

## Phase 5: Deployment

40. **Create S3 bucket:** In AWS Console, create `codegame-web-assets` in `us-east-1`, enable static website hosting for the Code Portal. (**Hosting**)
41. **Serverless deployment:** In `/infrastructure/serverless.yaml`, define service `codegame-backend`, provider AWS region `us-east-1`, runtime `nodejs20.x`, and functions for each Express route via `serverless-http`. (**Hosting**)
42. **CI/CD with GitHub Actions:** Create `.github/workflows/ci-cd.yml` that:
    - Checks out code
    - Installs Node.js v20.2.1
    - Runs tests for `/mobile`, `/web`, `/backend`
    - Builds and deploys `/web` to S3
    - Deploys `/backend` via `serverless deploy`
    - Publishes mobile via `eas build --platform all` and `eas submit` (**CI/CD**)
43. **Validate deployment:** Run `npx serverless info` to get endpoints; visit Code Portal URL to confirm dashboard loads. (**Deployment**)
44. **Publish mobile apps:** Via Expo EAS, submit `/mobile` builds to Apple App Store and Google Play Store using your developer credentials. (**App Distribution**)
45. **Monitoring and alerts:** In AWS CloudWatch, create alarms for API latency >1 s and error rates >1% and configure SNS notifications. (**Performance**, **Security**)