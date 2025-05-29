const dynamoService = require('../services/dynamoService');

const scanController = {
    // Process QR code scan and award points
    processScan: async (req, res) => {
        try {
            const { userId, qrData, location, timestamp, puzzleSolved } = req.body;

            if (!userId || !qrData) {
                return res.status(400).json({
                    error: 'Missing required fields',
                    required: ['userId', 'qrData'],
                });
            }

            // Calculate points based on puzzle completion
            const basePoints = 100;
            const bonusPoints = puzzleSolved ? 50 : 0;
            const totalPoints = basePoints + bonusPoints;

            // Create scan record
            const scanRecord = {
                id: `scan_${Date.now()}_${Math.random().toString(36).substring(7)}`,
                userId,
                qrData,
                location: location || 'Unknown',
                timestamp: timestamp || new Date().toISOString(),
                pointsEarned: totalPoints,
                puzzleSolved: !!puzzleSolved,
                processed: true,
            };

            // Save scan to database
            await dynamoService.createScan(scanRecord);

            // Update user's total points
            await dynamoService.updateUserPoints(userId, totalPoints);

            res.status(200).json({
                success: true,
                scan: scanRecord,
                pointsEarned: totalPoints,
                message: `Scan processed successfully! You earned ${totalPoints} Code Points.`,
            });

        } catch (error) {
            console.error('Scan processing error:', error);
            res.status(500).json({
                error: 'Failed to process scan',
                message: error.message,
            });
        }
    },

    // Get scan history for a user
    getScanHistory: async (req, res) => {
        try {
            const { userId } = req.params;
            const { limit = 20, offset = 0 } = req.query;

            if (!userId) {
                return res.status(400).json({
                    error: 'User ID is required',
                });
            }

            const scanHistory = await dynamoService.getUserScans(userId, {
                limit: parseInt(limit),
                offset: parseInt(offset),
            });

            res.status(200).json({
                success: true,
                scans: scanHistory,
                count: scanHistory.length,
            });

        } catch (error) {
            console.error('Scan history error:', error);
            res.status(500).json({
                error: 'Failed to retrieve scan history',
                message: error.message,
            });
        }
    },
};

module.exports = scanController; 