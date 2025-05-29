# Implementation Plan for Codegame.ai

This plan outlines phases, components, and integrated security controls to build the mobile app, website, and backend for Codegame.ai.

---

## 1. High-Level Architecture

• Mobile App (Expo/React Native)  
• Website (React SPA on S3 + CloudFront)  
• Backend API (Node.js + Express, behind API Gateway)  
• DynamoDB (encrypted at rest)  
• AI Puzzle Service (xAI API + fallback library)  
• Authentication: Native Game-Store on mobile, QR+JWT on web  
• Infrastructure: AWS (IAM, VPC, EC2/Lambda, S3, CloudFront, WAF)

---

## 2. Development Phases

Phase 1: Core MVP
• QR scanning → retrieve URL (strip params) → call `/scan` API → generate puzzle via xAI  
• Basic static puzzle fallback  
• Store scan record (userID, QR data, location, timestamp)  
• Website: QR-based login, display user stats  
• Secure all communications with HTTPS/TLS  

Phase 2: Authentication & Authorization
• Mobile: integrate Apple/Google sign-in  
• Website: issue time-limited JWT on QR scan, secure cookies (HttpOnly, Secure, SameSite)  
• Implement server-side RBAC for admin/marketing roles  

Phase 3: Location & Geofencing
• Collect user consent for GPS, implement geofencing logic in backend  
• Theming puzzles based on location/time buckets  

Phase 4: Peer-to-Peer & Cooperative Modes
• Generate ephemeral QR codes for challenges (signed JWT)  
• WebSocket or polling API for real-time challenge status  

Phase 5: Offline Mode & UI Polish
• Bundle static puzzle library in app, detect offline and serve fallback  
• Implement animated puzzle UI transitions  

Phase 6: Hardening & Compliance
• Rate limiting (API Gateway + Express middleware)  
• SCA + periodic vulnerability scans  
• WAF rules for known OWASP Top 10  
• GDPR data-deletion workflow  
• Logging, monitoring, and alerting (CloudWatch, GuardDuty)

---

## 3. Component Breakdown & Security Controls

### 3.1 Mobile App

• QR Scanner Module  
  – Validate scanned payload: allowlist URL domains, strip query params  
  – Sanitize inputs before forwarding to API  
• Auth Module  
  – Use Apple/Google SDKs; exchange tokens on backend for session JWT  
  – Store tokens in SecureStore or Keychain  
• Location Module  
  – Request runtime permission; encrypt location fields in transit  
  – Implement geofencing triggers client-side, verify server-side  
• Offline Fallback  
  – Preload static puzzles; verify integrity via SHA-256  

### 3.2 Website (React)

• QR-Login Flow  
  – Display time-limited login QR (signed JWT)  
  – On scan, backend issues cookie-based session  
• UI Security  
  – Sanitize all user inputs (profile customization)  
  – Use React’s built-in escaping; only use `dangerouslySetInnerHTML` with sanitized content  
• CORS  
  – Restrict to known origins, allow only needed headers/methods  
• CSRF Protection  
  – Anti-CSRF tokens in forms and AJAX calls  
• Security Headers (via CloudFront Lambda@Edge)  
  – `Strict-Transport-Security`, `Content-Security-Policy`, `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`

### 3.3 Backend API (Node.js + Express)

• Authentication & Session  
  – JWT signed with RS256, stored in HttpOnly Secure cookies  
  – Enforce expiration (`exp`), check `aud` & `iss`  
  – Token revocation list for logout  
• Input Validation  
  – Use Joi/Zod to validate request bodies, params, headers  
  – Reject unexpected fields (strict schema)  
• Rate Limiting & Throttling  
  – API Gateway usage plans + Express rate-limit middleware  
  – Burst control on `/scan`, `/generate-puzzle`  
• Puzzle Generation Endpoint  
  – Circuit breaker for xAI API; fallback to static library  
  – Validate xAI output structure; sanitize before sending to client  
• Data Access  
  – Use AWS SDK v3 with parameterized queries for DynamoDB  
  – Least-privilege IAM role: only `GetItem`, `PutItem`, `Query`  
• Error Handling  
  – Centralized error middleware; no stack traces to clients  
  – Log errors to CloudWatch with redacted PII  

### 3.4 Database (DynamoDB)

• Table Schemas  
  – Scans Table: PK=userID, SK=timestamp, attributes={qrData, lat, lon, puzzleID}  
  – Puzzles Table: PK=puzzleID, SK=version, attributes={payload, source}  
  – Sessions Table (optional): PK=sessionID, TTL enabled  
• Encryption & Access  
  – Enable AWS-managed CMK for at-rest encryption  
  – Encrypt in-transit via TLS; use VPC endpoints  
  – Fine-grained IAM policies per microservice  

### 3.5 Infrastructure & CI/CD

• Infrastructure as Code  
  – Terraform / CloudFormation with secure defaults  
  – Parameterize secrets via AWS Secrets Manager  
• Network Security  
  – VPC private subnets for backend; NAT for outbound  
  – Security groups: restrict ports, only allow from trusted sources  
• CI/CD Pipeline  
  – Codebuild: linting, unit tests, vulnerability scans (Snyk, OWASP Dependency-Check)  
  – Deploy to dev/test, run integration tests, then prod via approvals  
• Monitoring & Alerting  
  – CloudWatch metrics (latency, errors), alarms on thresholds  
  – AWS GuardDuty, AWS Config rules for drift detection  

---

## 4. Compliance & Privacy

• GDPR  
  – Explicit consent UI for location tracking  
  – Data-deletion API for user to purge scans, profile  
  – Privacy policy clearly discloses data retention  
• Logging  
  – Pseudonymize userID in logs  
  – Retention policy aligned with privacy policy

---

## 5. Testing Strategy

• Unit Tests  
  – Aim for >80% coverage on validation logic, auth flows  
• Integration Tests  
  – Simulate full scan → puzzle generation cycle  
• Load Tests  
  – Ensure scan endpoint <2s under peak load  
• Security Tests  
  – SAST (ESLint + security plugins)  
  – DAST on staging (ZAP)  
  – Penetration test prior to launch

---

By following this phased plan, integrating security controls at each layer, and continuously testing, Codegame.ai will achieve fast puzzle loads, robust fallback, and strong defenses against threats while ensuring compliance and a seamless UX.