// DynamoDB Service - Mock implementation for development
// This will be replaced with actual AWS DynamoDB integration

const dynamoService = {
    // Users
    async createUser(user) {
        console.log('Mock: Creating user', user.email);
        return user;
    },

    async getUser(userId) {
        console.log('Mock: Getting user', userId);
        return {
            id: userId,
            email: 'user@example.com',
            username: 'testuser',
            codePoints: 1250,
            puzzlesSolved: 8,
            createdAt: new Date().toISOString(),
            isActive: true,
        };
    },

    async getUserByEmail(email) {
        console.log('Mock: Getting user by email', email);
        return null; // Return null for now to allow registration
    },

    async updateUser(userId, updates) {
        console.log('Mock: Updating user', userId, updates);
        return { ...updates, id: userId };
    },

    async updateUserPoints(userId, points) {
        console.log('Mock: Adding points to user', userId, points);
        return { userId, pointsAdded: points };
    },

    // Scans
    async createScan(scan) {
        console.log('Mock: Creating scan', scan.id);
        return scan;
    },

    async getUserScans(userId, options = {}) {
        console.log('Mock: Getting user scans', userId, options);
        return [
            {
                id: 'scan_1',
                userId,
                qrData: 'https://example.com/qr/123',
                location: 'Coffee Shop',
                timestamp: new Date().toISOString(),
                pointsEarned: 150,
                puzzleSolved: true,
            },
            {
                id: 'scan_2',
                userId,
                qrData: 'https://example.com/qr/456',
                location: 'Library',
                timestamp: new Date(Date.now() - 86400000).toISOString(),
                pointsEarned: 200,
                puzzleSolved: true,
            },
        ];
    },

    // Puzzles
    async createPuzzle(puzzle) {
        console.log('Mock: Creating puzzle', puzzle.id);
        return puzzle;
    },

    async getPuzzle(puzzleId) {
        console.log('Mock: Getting puzzle', puzzleId);
        return {
            id: puzzleId,
            type: 'assembly',
            title: 'QR Code Puzzle',
            description: 'Assemble the pieces to reveal the pattern',
            solution: 'CODEGAME',
            pieces: [],
            difficulty: 'medium',
            createdAt: new Date().toISOString(),
        };
    },

    async updatePuzzleStats(puzzleId, stats) {
        console.log('Mock: Updating puzzle stats', puzzleId, stats);
        return stats;
    },

    // Solutions
    async createSolution(solution) {
        console.log('Mock: Creating solution', solution.id);
        return solution;
    },

    // QR Sessions
    async createQRSession(session) {
        console.log('Mock: Creating QR session', session.sessionId);
        return session;
    },
};

module.exports = dynamoService; 