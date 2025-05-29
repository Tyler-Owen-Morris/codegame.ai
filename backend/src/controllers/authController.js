const dynamoService = require('../services/dynamoService');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const JWT_SECRET = process.env.JWT_SECRET || 'codegame-ai-secret-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

const authController = {
    // User registration
    register: async (req, res) => {
        try {
            const { email, password, username } = req.body;

            if (!email || !password || !username) {
                return res.status(400).json({
                    error: 'Missing required fields',
                    required: ['email', 'password', 'username'],
                });
            }

            // Check if user already exists
            const existingUser = await dynamoService.getUserByEmail(email);
            if (existingUser) {
                return res.status(409).json({
                    error: 'User already exists',
                    message: 'An account with this email already exists',
                });
            }

            // Hash password
            const saltRounds = 12;
            const hashedPassword = await bcrypt.hash(password, saltRounds);

            // Create user
            const user = {
                id: `user_${Date.now()}_${Math.random().toString(36).substring(7)}`,
                email,
                username,
                password: hashedPassword,
                codePoints: 0,
                puzzlesSolved: 0,
                createdAt: new Date().toISOString(),
                isActive: true,
            };

            await dynamoService.createUser(user);

            // Generate JWT token
            const token = jwt.sign(
                { userId: user.id, email: user.email },
                JWT_SECRET,
                { expiresIn: JWT_EXPIRES_IN }
            );

            // Remove password from response
            const { password: _, ...userResponse } = user;

            res.status(201).json({
                success: true,
                user: userResponse,
                token,
                message: 'User registered successfully',
            });

        } catch (error) {
            console.error('Registration error:', error);
            res.status(500).json({
                error: 'Registration failed',
                message: error.message,
            });
        }
    },

    // User login
    login: async (req, res) => {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({
                    error: 'Email and password are required',
                });
            }

            // Get user by email
            const user = await dynamoService.getUserByEmail(email);
            if (!user) {
                return res.status(401).json({
                    error: 'Invalid credentials',
                    message: 'Email or password is incorrect',
                });
            }

            // Verify password
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return res.status(401).json({
                    error: 'Invalid credentials',
                    message: 'Email or password is incorrect',
                });
            }

            // Generate JWT token
            const token = jwt.sign(
                { userId: user.id, email: user.email },
                JWT_SECRET,
                { expiresIn: JWT_EXPIRES_IN }
            );

            // Update last login
            await dynamoService.updateUser(user.id, {
                lastLoginAt: new Date().toISOString(),
            });

            // Remove password from response
            const { password: _, ...userResponse } = user;

            res.status(200).json({
                success: true,
                user: userResponse,
                token,
                message: 'Login successful',
            });

        } catch (error) {
            console.error('Login error:', error);
            res.status(500).json({
                error: 'Login failed',
                message: error.message,
            });
        }
    },

    // QR-based login
    qrLogin: async (req, res) => {
        try {
            const { sessionId, userId } = req.body;

            if (!sessionId || !userId) {
                return res.status(400).json({
                    error: 'Session ID and User ID are required',
                });
            }

            // Get user
            const user = await dynamoService.getUser(userId);
            if (!user) {
                return res.status(404).json({
                    error: 'User not found',
                });
            }

            // Generate JWT token
            const token = jwt.sign(
                { userId: user.id, email: user.email },
                JWT_SECRET,
                { expiresIn: JWT_EXPIRES_IN }
            );

            // Save QR login session
            const qrSession = {
                sessionId,
                userId,
                token,
                createdAt: new Date().toISOString(),
                expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
                isActive: true,
            };

            await dynamoService.createQRSession(qrSession);

            // Update last login
            await dynamoService.updateUser(user.id, {
                lastLoginAt: new Date().toISOString(),
            });

            // Remove password from response
            const { password: _, ...userResponse } = user;

            res.status(200).json({
                success: true,
                user: userResponse,
                token,
                sessionId,
                message: 'QR login successful',
            });

        } catch (error) {
            console.error('QR login error:', error);
            res.status(500).json({
                error: 'QR login failed',
                message: error.message,
            });
        }
    },

    // Verify JWT token (middleware)
    verifyToken: async (req, res, next) => {
        try {
            const authHeader = req.headers.authorization;

            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                return res.status(401).json({
                    error: 'No token provided',
                    message: 'Authorization header with Bearer token is required',
                });
            }

            const token = authHeader.substring(7);

            const decoded = jwt.verify(token, JWT_SECRET);

            // Get user from database
            const user = await dynamoService.getUser(decoded.userId);
            if (!user || !user.isActive) {
                return res.status(401).json({
                    error: 'Invalid token',
                    message: 'User not found or inactive',
                });
            }

            // Add user to request object
            req.user = user;

            if (next) {
                next();
            } else {
                // If called directly (not as middleware)
                res.status(200).json({
                    success: true,
                    valid: true,
                    user: {
                        id: user.id,
                        email: user.email,
                        username: user.username,
                    },
                });
            }

        } catch (error) {
            console.error('Token verification error:', error);
            res.status(401).json({
                error: 'Invalid token',
                message: error.message,
            });
        }
    },

    // Get user profile
    getUserProfile: async (req, res) => {
        try {
            const { id } = req.params;

            // Check if user is requesting their own profile or has admin access
            if (req.user.id !== id) {
                return res.status(403).json({
                    error: 'Access denied',
                    message: 'You can only access your own profile',
                });
            }

            const user = await dynamoService.getUser(id);
            if (!user) {
                return res.status(404).json({
                    error: 'User not found',
                });
            }

            // Remove sensitive information
            const { password: _, ...userProfile } = user;

            res.status(200).json({
                success: true,
                user: userProfile,
            });

        } catch (error) {
            console.error('Get user profile error:', error);
            res.status(500).json({
                error: 'Failed to get user profile',
                message: error.message,
            });
        }
    },

    // Update user profile
    updateUserProfile: async (req, res) => {
        try {
            const { id } = req.params;
            const updates = req.body;

            // Check if user is updating their own profile
            if (req.user.id !== id) {
                return res.status(403).json({
                    error: 'Access denied',
                    message: 'You can only update your own profile',
                });
            }

            // Remove sensitive fields from updates
            delete updates.password;
            delete updates.id;
            delete updates.createdAt;
            delete updates.codePoints; // Points can only be updated through game mechanics

            updates.updatedAt = new Date().toISOString();

            await dynamoService.updateUser(id, updates);

            const updatedUser = await dynamoService.getUser(id);
            const { password: _, ...userResponse } = updatedUser;

            res.status(200).json({
                success: true,
                user: userResponse,
                message: 'Profile updated successfully',
            });

        } catch (error) {
            console.error('Update user profile error:', error);
            res.status(500).json({
                error: 'Failed to update user profile',
                message: error.message,
            });
        }
    },
};

module.exports = authController; 