# QR Game Backend

A FastAPI-based backend for a QR code-based game system that enables players to scan QR codes, participate in hunts, and interact with other players.

## Features

### Authentication
- User registration and login system
- JWT-based authentication
- QR code-based login for mobile devices
- Session management with expiration

### QR Code System
- QR code scanning with location validation
- Different scan types:
  - Standard scans
  - Discovery scans
  - Peer scans
  - Transportation scans
- Cooldown periods between scans
- Location-based validation

### Game Mechanics
- Player progress tracking
- Hunt system with different states (active, completed, abandoned)
- Score and level system
- Scan history tracking
- Different types of rewards and encounters

### Player Features
- Player profiles with statistics
- Scan counts tracking (total, discovery, peer scans)
- Recent scan history
- Score and level progression

## Technical Stack

- FastAPI - Modern web framework for building APIs
- SQLAlchemy - SQL toolkit and ORM
- JWT - JSON Web Tokens for authentication
- WebSocket support for real-time communication
- Async database operations

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Set up environment variables:
   - `JWT_SECRET_KEY` - Secret key for JWT token generation
   - Database configuration variables

4. Run the application:
   ```bash
   uvicorn main:app --reload
   ```

## API Endpoints

### Authentication
- `POST /auth/register` - Register a new player
- `POST /auth/login` - Login with username/password
- `POST /auth/qr-login-init` - Initialize QR code login
- `POST /auth/qr-login-complete` - Complete QR code login
- `GET /auth/me` - Get current user profile

### QR Code
- `POST /qr/scan` - Scan a QR code
- `GET /qr/{code}` - Get QR code metadata

## Security Features

- Password hashing using bcrypt
- JWT token-based authentication
- Session expiration
- Rate limiting on QR login attempts
- Location validation for QR scans

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

[Add your license information here]