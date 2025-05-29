// xAI Service - Mock implementation for development
// This will be replaced with actual xAI API integration

const xaiService = {
    async generatePuzzle({ qrData, location, difficulty }) {
        console.log('Mock xAI: Generating puzzle for', qrData.substring(0, 30) + '...');

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Mock puzzle generation based on QR data
        const puzzleTypes = ['assembly', 'pattern', 'logic'];
        const randomType = puzzleTypes[Math.floor(Math.random() * puzzleTypes.length)];

        const puzzle = {
            type: randomType,
            title: `AI-Generated ${randomType.charAt(0).toUpperCase() + randomType.slice(1)} Puzzle`,
            description: `Solve this ${difficulty} ${randomType} puzzle based on the QR code data`,
            difficulty,
            solution: generateMockSolution(randomType),
            pieces: generateMockPieces(randomType),
            hints: generateMockHints(randomType),
            metadata: {
                sourceQR: qrData.substring(0, 50),
                location,
                aiGenerated: true,
            },
        };

        return puzzle;
    },
};

const generateMockSolution = (type) => {
    switch (type) {
        case 'assembly':
            return 'CODEGAME';
        case 'pattern':
            return [1, 2, 3, 4, 5, 6, 7, 8, 9];
        case 'logic':
            return '42';
        default:
            return 'SOLUTION';
    }
};

const generateMockPieces = (type) => {
    switch (type) {
        case 'assembly':
            return [
                { id: 0, shape: 'square', color: '#000000' },
                { id: 1, shape: 'triangle', color: '#333333' },
                { id: 2, shape: 'circle', color: '#666666' },
                { id: 3, shape: 'hexagon', color: '#999999' },
            ];
        case 'pattern':
            return Array.from({ length: 9 }, (_, i) => ({
                id: i,
                value: Math.floor(Math.random() * 9) + 1,
                position: i,
            }));
        case 'logic':
            return [
                { question: 'What is 6 × 7?', answer: '42' },
                { question: 'The meaning of life?', answer: '42' },
            ];
        default:
            return [];
    }
};

const generateMockHints = (type) => {
    const hints = {
        assembly: [
            'Start with the corner pieces',
            'Look for matching colors',
            'The final word has 8 letters',
        ],
        pattern: [
            'Numbers should be in ascending order',
            'Each row sums to 15',
            'Look for the missing number',
        ],
        logic: [
            'Think about famous numbers in science fiction',
            'The answer to the ultimate question',
            'Douglas Adams had the answer',
        ],
    };

    return hints[type] || ['Look carefully at the patterns'];
};

module.exports = xaiService; 