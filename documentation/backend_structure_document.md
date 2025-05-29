# Backend Structure Document

## 1. Backend Architecture

Our backend is built as a stateless, HTTP-based service using Node.js and Express.js. We follow a simple service-repository pattern that organizes code into three layers:

- **Controllers** handle incoming requests, perform input validation, and call the right service.  
- **Services** contain business logic (e.g., puzzle generation, scan processing, user stats).  
- **Repositories** interact with the database, abstracting away DynamoDB calls.

Key design decisions for scalability, maintainability, and performance:

- **Stateless Services**  
  Each Express instance does not store user session data in memory. We issue JSON Web Tokens (JWTs) for authentication and keep all data in DynamoDB.  
- **Horizontal Scaling**  
  By keeping services stateless, we can spin up multiple EC2 instances or Lambda functions behind a load balancer.  
- **Asynchronous Operations**  
  Calls to the AI service (xAI API) and to DynamoDB are non-blocking. We use async/await and Promises to ensure fast response handling.  
- **Graceful Fallback**  
  If xAI API calls fail or exceed latency limits, we automatically pull puzzles from our on-device static library.

## 2. Database Management

We use AWS DynamoDB as our primary data store to meet our requirement for fast reads/writes at scale. Key points:

- **NoSQL Model**  
  DynamoDB’s flexible schema lets us store different attributes per item. We avoid costly schema migrations.  
- **High Throughput**  
  We provision read/write capacity with auto-scaling so we can handle traffic spikes (e.g., popular QR locations).  
- **Global Secondary Indexes (GSIs)**  
  We define GSIs for common access patterns, such as retrieving all scans for a user or looking up puzzles by type.  
- **Time-to-Live (TTL)**  
  We enable TTL on the scan logs table to automatically purge old scan records after a set period (e.g., 90 days), keeping storage costs down.  
- **Encryption at Rest**  
  DynamoDB encryption is turned on to protect user data.  
- **Backup & Recovery**  
  We use point-in-time recovery (PITR) for critical tables and on-demand backups before each major release.

## 3. Database Schema

Below is a human-readable overview of our DynamoDB tables and key attributes:

Users Table
• Primary Key: userId (string)  
• Attributes: email, displayName, codePoints (number), achievements (list), preferredTheme, createdAt, updatedAt  

ScanLogs Table
• Primary Key: userId (string)  
• Sort Key: scanTimestamp (ISO timestamp)  
• Attributes: qrContent, latitude, longitude, puzzleId, status (success/fallback), deviceInfo  
• TTL Attribute: expireAt  

Puzzles Table
• Primary Key: puzzleId (string)  
• Attributes: type (pattern/riddle/sequence), questionText, answerData, source (AI/static), createdAt  
• Global Secondary Index: type + source  

QRMapping Table
• Primary Key: qrContent (string)  
• Attributes: puzzleId, generatedAt  

VirtualDailyPuzzles Table
• Primary Key: date (YYYY-MM-DD)  
• Attributes: puzzleIdList (list of strings)  

ProfileCustomizations Table
• Primary Key: userId (string)  
• Attributes: selectedTheme, activeBoosts (list), updatedAt  

## 4. API Design and Endpoints

We expose a RESTful API over HTTPS. Major endpoints include:

### Authentication
- **POST /auth/login/mobile**  
  Receives token from Apple/Google SDK, verifies it, and returns a JWT.  
- **POST /auth/login/website**  
  Accepts one-time QR code payload, links session to user, issues JWT for web.  

### Scan & Puzzle Flow
- **POST /scan**  
  Body: `{ qrContent, latitude, longitude }`  
  Returns: Puzzle data (AI-generated or fallback).  
- **GET /puzzle/{puzzleId}**  
  Returns stored puzzle question and metadata.  

### User Stats & Profile
- **GET /stats**  
  Authenticated. Returns codePoints, totalScans, achievements, daily activity.  
- **PUT /profile**  
  Body: `{ preferredTheme, selectedBoosts }` to customize UI and gameplay boosts.  

### Virtual & Peer Interactions
- **GET /virtual-daily**  
  Returns today’s set of virtual QR puzzles.  
- **POST /peer/compete**  
  Initiates a real-time competitive puzzle session between two users.  
- **POST /peer/cooperate**  
  Starts or joins a cooperative puzzle session.  

All endpoints require the JWT in the `Authorization` header except for token exchange endpoints.

## 5. Hosting Solutions

We host entirely on AWS to leverage its global infrastructure and managed services:

- **Compute**  
  - Express.js servers run on an EC2 Auto Scaling Group behind an Application Load Balancer (ALB).  
  - Lightweight puzzle-generation tasks (fallback static library) live in AWS Lambda for event-driven bursts.  
- **Static Assets**  
  We host our companion website and static puzzle library (fallback JSON) in S3 and serve it via CloudFront CDN.  
- **Database**  
  DynamoDB handles storage, with global tables if we expand internationally.  
- **AI Integration**  
  Outbound calls to xAI API are made from within our VPC, routed through NAT Gateway.

Benefits:
- High availability with multi-AZ deployment  
- Near–infinite horizontal scalability  
- Pay-as-you-go pricing keeps costs aligned with usage  

## 6. Infrastructure Components

We use several AWS services working in concert:

- **Application Load Balancer (ALB)** directs user traffic to healthy EC2 instances.  
- **Auto Scaling Group** adjusts server count based on CPU usage and request latency.  
- **AWS Lambda** for on-demand puzzle fallback and light background jobs (e.g., generating daily puzzles).  
- **Amazon ElastiCache (Redis)** caches the most popular puzzles and user profiles to reduce DynamoDB read load.  
- **Amazon CloudFront** distributes static website files and static puzzle library globally with low latency.  
- **Amazon S3** stores static assets, website, and versioned fallback puzzle files.  
- **Amazon API Gateway** (optional) can front certain Lambda functions if we split off micro-services.  
- **VPC, Subnets, Security Groups** enforce network isolation and secure communication between components.  

## 7. Security Measures

- **Encryption in Transit**  
  All traffic uses HTTPS/TLS. We provision SSL certificates via AWS Certificate Manager.  
- **Encryption at Rest**  
  DynamoDB tables and S3 buckets are encrypted.  
- **Authentication & Authorization**  
  - Mobile apps authenticate via Apple/Google SDKs and receive a JWT from `/auth`.  
  - Website logins use a QR exchange flow, then also rely on JWTs.  
  - Each request validates the JWT and checks user permissions.  
- **Input Validation & Sanitization**  
  We validate all incoming data in Express middleware to avoid injection attacks.  
- **Web Application Firewall (WAF)**  
  We use AWS WAF to block common exploits (SQLi, XSS) and to rate-limit abusive traffic.  
- **IAM Roles & Least Privilege**  
  Each component (EC2, Lambda) assumes a role granting only needed permissions (no overly broad rights).  
- **Audit & Compliance**  
  AWS CloudTrail records API calls for auditing.  

## 8. Monitoring and Maintenance

- **Amazon CloudWatch** collects logs and metrics (CPU, latency, request count).  
- **Alarms & Notifications**  
  CloudWatch Alarms notify the team via SNS when error rates spike or EC2 CPU remains high.  
- **AWS X-Ray** (optional) for tracing and pinpointing performance bottlenecks.  
- **Automated Backups**  
  DynamoDB PITR and on-demand snapshots for critical tables.  
- **CI/CD Pipeline**  
  Git commits trigger AWS CodePipeline → CodeBuild → automated tests → deploy to staging/production.  
- **Dependency Management**  
  We run periodic vulnerability scans on npm packages and apply patching regularly.  

## 9. Conclusion and Overall Backend Summary

Our backend combines a simple, stateless Node.js/Express setup with AWS’s managed services to deliver a fast, reliable, and secure platform for Codegame.ai. It supports the core requirements:

- **Fast puzzle generation** (<1 s AI call + <2 s overall scan flow)  
- **High scalability** (100k+ monthly active users) with Auto Scaling and DynamoDB on-demand capacity  
- **99.9% uptime** via multi-AZ deployment, health checks, and automated failover  
- **Security** through HTTPS, JWTs, WAF, encryption, and least-privilege IAM roles  

Unique aspects:

- **Real-world QR integration**: We never generate public QR codes for puzzles, relying on existing barcodes.  
- **Dynamic AI + static fallback**: Seamless puzzle delivery even when external AI is slow or unavailable.  
- **Geofenced & time-based bonuses**: Built-in logic for location and time-sensitive rewards.  
- **Peer-to-peer puzzles**: Competitive and cooperative gameplay flows powered by our API.

This backend structure is clear, extensible, and cost-effective. It aligns well with the project goals and ensures a smooth user experience on both mobile and web.