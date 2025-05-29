// Static Puzzle Service - Fallback for when xAI API is unavailable
// Provides 99.9% uptime guarantee with pre-generated puzzles

const staticPuzzles = [
    {
        type: 'assembly',
        title: 'Word Assembly Challenge',
        description: 'Arrange the letters to form a word related to coding',
        difficulty: 'easy',
        solution: 'JAVASCRIPT',
        pieces: [
            { id: 0, letter: 'J', position: 0 },
            { id: 1, letter: 'A', position: 1 },
            { id: 2, letter: 'V', position: 2 },
            { id: 3, letter: 'A', position: 3 },
            { id: 4, letter: 'S', position: 4 },
            { id: 5, letter: 'C', position: 5 },
            { id: 6, letter: 'R', position: 6 },
            { id: 7, letter: 'I', position: 7 },
            { id: 8, letter: 'P', position: 8 },
            { id: 9, letter: 'T', position: 9 },
        ],
        hints: ['Popular programming language', 'Runs in browsers', 'ES6 features'],
    },
    {
        type: 'pattern',
        title: 'Number Sequence',
        description: 'Find the missing number in the sequence',
        difficulty: 'medium',
        solution: 8,
        pieces: [2, 4, 6, null, 10, 12],
        hints: ['Even numbers', 'Arithmetic sequence', 'Add 2 each time'],
    },
    {
        type: 'logic',
        title: 'Code Logic Puzzle',
        description: 'What does this function return for input 5?',
        difficulty: 'hard',
        solution: 120,
        pieces: [
            { code: 'function factorial(n) {', line: 1 },
            { code: '  if (n <= 1) return 1;', line: 2 },
            { code: '  return n * factorial(n - 1);', line: 3 },
            { code: '}', line: 4 },
        ],
        hints: ['Recursive function', 'Mathematical operation', '5! = 5 × 4 × 3 × 2 × 1'],
    },
    {
        type: 'assembly',
        title: 'Tech Stack Puzzle',
        description: 'Arrange these technologies in typical web stack order',
        difficulty: 'medium',
        solution: ['HTML', 'CSS', 'JavaScript', 'React', 'Node.js'],
        pieces: [
            { id: 0, tech: 'React', layer: 'Frontend Framework' },
            { id: 1, tech: 'HTML', layer: 'Markup' },
            { id: 2, tech: 'CSS', layer: 'Styling' },
            { id: 3, tech: 'JavaScript', layer: 'Programming' },
            { id: 4, tech: 'Node.js', layer: 'Backend Runtime' },
        ],
        hints: ['Start with markup', 'Add styling next', 'Programming language comes third'],
    },
];

const staticPuzzleService = {
    async generatePuzzle({ qrData, location, difficulty }) {
        console.log('Static: Generating fallback puzzle for', qrData.substring(0, 30) + '...');

        // Simulate small delay for consistency
        await new Promise(resolve => setTimeout(resolve, 200));

        // Filter puzzles by difficulty or pick random
        let availablePuzzles = staticPuzzles.filter(p => p.difficulty === difficulty);
        if (availablePuzzles.length === 0) {
            availablePuzzles = staticPuzzles;
        }

        // Select puzzle based on QR data hash for consistency
        const hash = simpleHash(qrData);
        const selectedPuzzle = availablePuzzles[hash % availablePuzzles.length];

        // Customize puzzle based on location if provided
        const customizedPuzzle = {
            ...selectedPuzzle,
            description: location ?
                `${selectedPuzzle.description} (Found at: ${location})` :
                selectedPuzzle.description,
            metadata: {
                sourceQR: qrData.substring(0, 50),
                location,
                fallback: true,
                staticPuzzle: true,
            },
        };

        return customizedPuzzle;
    },

    getPuzzleCount() {
        return staticPuzzles.length;
    },

    getPuzzlesByDifficulty(difficulty) {
        return staticPuzzles.filter(p => p.difficulty === difficulty);
    },
};

// Simple hash function for consistent puzzle selection
const simpleHash = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
};

module.exports = staticPuzzleService; 