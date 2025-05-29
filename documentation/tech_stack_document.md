# Tech Stack Document for Codegame.ai
This document explains, in everyday language, the technology choices behind Codegame.ai. It shows what each part does and why we picked it, without diving into technical jargon.

## 1. Frontend Technologies
These are the tools and libraries that make up the parts of the game you see and interact with.

### Mobile App (Expo / React Native)
• **Expo & React Native**: We build the mobile game once in JavaScript and deploy it to both iOS and Android. Expo simplifies camera access, location tracking, and over-the-air updates.
• **expo-camera & expo-barcode-scanner**: Let the app scan any real-world QR code quickly and reliably.
• **React Native Animated API**: Powers the “assemble/disassemble” puzzle animations you see when starting or finishing a puzzle.
• **Built-in Stylesheets**: We use simple black, white, and gray styling directly in React Native, keeping the look clean and focused on content.

### Website (React)
• **React**: A popular JavaScript library for building fast, interactive web pages. It drives the Code Portal’s dashboards and virtual QR screens.
• **CSS Modules / Plain CSS**: Manage the minimalist, grayscale look without introducing complex styling systems.
• **Framer Motion**: Handles smooth transitions and puzzle-style animations on the website (for example, when the login QR appears or stats panels unfold).
• **QR Code Generator (e.g., react-qr-code)**: Displays dynamic login and peer-to-peer QR codes in the browser.

These choices ensure:
- A unified codebase in JavaScript for both mobile and web.
- Fast, native-like performance on phones and slick interactions on the website.
- A clean black-white look with engaging puzzle animations.

## 2. Backend Technologies
These are the systems that power game logic, store data, and talk to the AI service.

• **Node.js & Express.js**: A flexible JavaScript server framework. It receives scan data (QR string, time, location), talks to the AI, and sends puzzles back to the app or site.
• **AWS DynamoDB**: A fast, managed NoSQL database for storing:
  - Raw QR code identifiers (with stripped URL parameters)
  - User scan history (timestamp, latitude/longitude, user ID)
  - Mappings from each QR string to its generated puzzle (so everyone sees the same puzzle for the same code)
• **AWS Lambda** (optional): Runs small “fallback” functions when the main AI service isn’t available, pulling puzzles from a static library.
• **xAI API**: Our chosen AI service that creates custom puzzles based on QR data, location, and time. Unlimited usage is assumed for now, with built-in fallbacks.
• **Static Puzzle Library**: A local JSON collection of pre-built puzzles to keep the game running if the AI service goes offline.

Together, these pieces:
- Quickly generate and retrieve puzzles.
- Keep track of every scan and user reward.
- Provide instant AI-generated content with resilient offline options.

## 3. Infrastructure and Deployment
How we host, update, and manage the live application and website.

• **Version Control: Git & GitHub**
  - All code lives in GitHub repositories, enabling teamwork, code reviews, and historical tracking.
• **CI/CD with GitHub Actions**
  - Automated testing and deployment pipelines ensure that changes pass checks before going live.
• **AWS Hosting**
  - **EC2 Instances**: Run the Express.js API.
  - **S3 Buckets & CloudFront**: Serve the React website’s static files with a global content delivery network.
  - **Lambda Functions**: Handle fallback puzzle logic without running a full server.
• **Mobile App Distribution**
  - **Expo’s Build Service**: Creates standalone iOS and Android apps.
  - **Apple App Store & Google Play Store**: Official distribution channels for players to download the game.

These choices deliver:
- Reliable, scalable hosting on AWS.
- Automated, safe deployments whenever we push code.
- Easy app updates and broad device support.

## 4. Third-Party Integrations
External services that boost functionality without building everything ourselves.

• **xAI API** (primary): Generates all puzzle content dynamically.
• **React-QR-Code** or similar: Renders dynamic QR codes in the web portal for login and peer scanning.

*(Developer Tools – internal use)*
• **Cursor**, **Replit**, **Claude 3.7 Sonnet**, **Grok 3**: AI-powered coding assistants and online IDEs help speed up development, provide real-time suggestions, and maintain code quality.

These integrations let us:
- Deliver rich, AI-driven puzzles on demand.
- Provide seamless QR-based authentication.
- Accelerate development with smart tools.

## 5. Security and Performance Considerations
Measures to keep user data safe and the game running smoothly.

### Security
• **Native Store Authentication**: Players sign in via their Apple or Google accounts—no extra passwords required.
• **QR-Based Login**: Uses time-limited tokens to secure the website session.
• **HTTPS Everywhere**: All data in transit is encrypted.
• **DynamoDB Encryption at Rest**: Protects stored scan logs and user data.
• **Input Validation & Rate Limiting**: Prevents abuse of the scan API and AI endpoints.

### Performance
• **CDN for Static Assets**: Fast website load times worldwide via CloudFront.
• **Lazy Loading**: Only download code and assets when needed (e.g., puzzle screens).
• **Offline Fallbacks**: Static puzzles keep the game playable if the AI is unreachable or the network is poor.
• **Caching**: Frequently requested puzzles and user stats can be cached temporarily to reduce repeated database or AI calls.

These steps ensure both safety and a fluid user experience.

## 6. Conclusion and Overall Tech Stack Summary
In Codegame.ai, we chose a fully JavaScript-based stack to simplify development and maintenance:

• Frontend: React Native (Expo) for mobile, React for web
• Backend: Node.js with Express.js
• Database: AWS DynamoDB
• Hosting: AWS EC2, S3, Lambda, CloudFront
• AI Service: xAI API (with static puzzle fallback)
• Dev Tools: Git/GitHub, GitHub Actions, Cursor, Replit, Claude 3.7, Grok 3

Why this stack works for us:
- **Consistency**: One language (JavaScript) across mobile, web, and server.
- **Scalability**: AWS services grow with our user base.
- **Flexibility**: AI-driven puzzles adapt to real-world scans.
- **Reliability**: Offline options and automated deployments keep the game live.

This combination of technologies aligns with our goal: a sleek, geo-aware puzzle game that runs everywhere, stays up to date, and delights players with fresh, AI-powered challenges.