const express = require('express');
const router = express.Router();

// Controllers
const scanController = require('../controllers/scanController');
const puzzleController = require('../controllers/puzzleController');
const authController = require('../controllers/authController');

// Middleware
const validateRequest = require('../middleware/validateRequest');

// Scan endpoints
router.post('/scan', validateRequest, scanController.processScan);
router.get('/scan/history/:userId', scanController.getScanHistory);

// Puzzle endpoints
router.get('/puzzle/:id', puzzleController.getPuzzle);
router.post('/puzzle/generate', validateRequest, puzzleController.generatePuzzle);
router.post('/puzzle/solve', validateRequest, puzzleController.submitSolution);

// Auth endpoints
router.post('/auth/login', validateRequest, authController.login);
router.post('/auth/register', validateRequest, authController.register);
router.post('/auth/qr-login', validateRequest, authController.qrLogin);
router.get('/auth/verify', authController.verifyToken);

// User endpoints
router.get('/user/:id', authController.verifyToken, authController.getUserProfile);
router.put('/user/:id', authController.verifyToken, validateRequest, authController.updateUserProfile);

// Health check for API
router.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        service: 'api',
        timestamp: new Date().toISOString(),
    });
});

module.exports = router; 