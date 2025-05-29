const xaiService = require('../services/xaiService');
const staticPuzzleService = require('../services/staticPuzzleService');
const dynamoService = require('../services/dynamoService');

const puzzleController = {
    // Generate a new puzzle based on QR data
    generatePuzzle: async (req, res) => {
        try {
            const { qrData, location, difficulty = 'medium' } = req.body;
            const startTime = Date.now();

            if (!qrData) {
                return res.status(400).json({
                    error: 'QR data is required',
                });
            }

            let puzzle;
            let generationMethod = 'ai';

            try {
                // Attempt AI puzzle generation with timeout
                const aiGenerationPromise = xaiService.generatePuzzle({
                    qrData,
                    location,
                    difficulty,
                });

                const timeoutPromise = new Promise((_, reject) =>
                    setTimeout(() => reject(new Error('AI generation timeout')), 5000)
                );

                puzzle = await Promise.race([aiGenerationPromise, timeoutPromise]);

            } catch (aiError) {
                console.warn('AI puzzle generation failed, using static fallback:', aiError.message);

                // Fallback to static puzzle
                puzzle = await staticPuzzleService.generatePuzzle({
                    qrData,
                    location,
                    difficulty,
                });
                generationMethod = 'static';
            }

            const generationTime = Date.now() - startTime;

            // Add metadata
            puzzle.id = `puzzle_${Date.now()}_${Math.random().toString(36).substring(7)}`;
            puzzle.generationMethod = generationMethod;
            puzzle.generationTime = generationTime;
            puzzle.createdAt = new Date().toISOString();

            // Save puzzle to database
            await dynamoService.createPuzzle(puzzle);

            res.status(200).json({
                success: true,
                puzzle,
                meta: {
                    generationMethod,
                    generationTime,
                    qrData: qrData.substring(0, 50) + '...', // Truncated for security
                },
            });

        } catch (error) {
            console.error('Puzzle generation error:', error);
            res.status(500).json({
                error: 'Failed to generate puzzle',
                message: error.message,
            });
        }
    },

    // Get a specific puzzle by ID
    getPuzzle: async (req, res) => {
        try {
            const { id } = req.params;

            if (!id) {
                return res.status(400).json({
                    error: 'Puzzle ID is required',
                });
            }

            const puzzle = await dynamoService.getPuzzle(id);

            if (!puzzle) {
                return res.status(404).json({
                    error: 'Puzzle not found',
                    id,
                });
            }

            res.status(200).json({
                success: true,
                puzzle,
            });

        } catch (error) {
            console.error('Get puzzle error:', error);
            res.status(500).json({
                error: 'Failed to retrieve puzzle',
                message: error.message,
            });
        }
    },

    // Submit puzzle solution
    submitSolution: async (req, res) => {
        try {
            const { puzzleId, userId, solution, timeToSolve } = req.body;

            if (!puzzleId || !userId || !solution) {
                return res.status(400).json({
                    error: 'Missing required fields',
                    required: ['puzzleId', 'userId', 'solution'],
                });
            }

            // Get puzzle from database
            const puzzle = await dynamoService.getPuzzle(puzzleId);

            if (!puzzle) {
                return res.status(404).json({
                    error: 'Puzzle not found',
                    puzzleId,
                });
            }

            // Check solution
            const isCorrect = await validateSolution(puzzle, solution);

            // Calculate score based on correctness and time
            let score = 0;
            if (isCorrect) {
                const baseScore = 100;
                const timeBonus = Math.max(0, 50 - Math.floor(timeToSolve / 1000));
                score = baseScore + timeBonus;
            }

            // Save solution attempt
            const solutionRecord = {
                id: `solution_${Date.now()}_${Math.random().toString(36).substring(7)}`,
                puzzleId,
                userId,
                solution,
                isCorrect,
                score,
                timeToSolve,
                submittedAt: new Date().toISOString(),
            };

            await dynamoService.createSolution(solutionRecord);

            // Update puzzle statistics
            await dynamoService.updatePuzzleStats(puzzleId, {
                attemptsCount: 1,
                successCount: isCorrect ? 1 : 0,
                averageTime: timeToSolve,
            });

            res.status(200).json({
                success: true,
                solution: solutionRecord,
                correct: isCorrect,
                score,
                message: isCorrect ?
                    `Congratulations! You earned ${score} points!` :
                    'Incorrect solution. Try again!',
            });

        } catch (error) {
            console.error('Solution submission error:', error);
            res.status(500).json({
                error: 'Failed to submit solution',
                message: error.message,
            });
        }
    },
};

// Helper function to validate puzzle solutions
const validateSolution = async (puzzle, solution) => {
    try {
        // Simple validation for different puzzle types
        switch (puzzle.type) {
            case 'assembly':
                return solution.toLowerCase() === puzzle.solution.toLowerCase();
            case 'pattern':
                return JSON.stringify(solution) === JSON.stringify(puzzle.solution);
            case 'logic':
                return solution === puzzle.solution;
            default:
                return solution === puzzle.solution;
        }
    } catch (error) {
        console.error('Solution validation error:', error);
        return false;
    }
};

module.exports = puzzleController; 