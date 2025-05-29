import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Animated,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
    Dimensions,
} from 'react-native';

const { width, height } = Dimensions.get('window');

const PuzzleScreen = ({ route, navigation }) => {
    const { qrData, location, timestamp } = route.params || {};
    const [puzzle, setPuzzle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [pieces, setPieces] = useState([]);
    const [solved, setSolved] = useState(false);

    // Animation values
    const assemblyAnimation = useRef(new Animated.Value(0)).current;
    const fadeAnimation = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        loadPuzzle();
    }, []);

    const loadPuzzle = async () => {
        try {
            setLoading(true);

            // Simulate puzzle loading (will be replaced with actual API call)
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Mock puzzle data
            const mockPuzzle = {
                id: `puzzle_${Date.now()}`,
                title: 'QR Code Puzzle',
                description: 'Assemble the pieces to reveal the hidden pattern',
                pieces: generatePuzzlePieces(),
                solution: 'CODEGAME',
            };

            setPuzzle(mockPuzzle);
            setPieces(shufflePieces(mockPuzzle.pieces));

            // Start entrance animation
            Animated.parallel([
                Animated.timing(fadeAnimation, {
                    toValue: 1,
                    duration: 500,
                    useNativeDriver: true,
                }),
                Animated.spring(assemblyAnimation, {
                    toValue: 1,
                    tension: 50,
                    friction: 7,
                    useNativeDriver: true,
                }),
            ]).start();

        } catch (error) {
            Alert.alert('Error', 'Failed to load puzzle. Please try again.');
            console.error('Puzzle loading error:', error);
        } finally {
            setLoading(false);
        }
    };

    const generatePuzzlePieces = () => {
        // Generate 9 puzzle pieces (3x3 grid)
        const pieces = [];
        for (let i = 0; i < 9; i++) {
            pieces.push({
                id: i,
                position: i,
                color: `hsl(${i * 40}, 70%, 60%)`,
                solved: false,
            });
        }
        return pieces;
    };

    const shufflePieces = (pieces) => {
        return [...pieces].sort(() => Math.random() - 0.5);
    };

    const handlePiecePress = (pieceId) => {
        if (solved) return;

        // Animate piece selection
        Animated.sequence([
            Animated.timing(assemblyAnimation, {
                toValue: 0.9,
                duration: 100,
                useNativeDriver: true,
            }),
            Animated.timing(assemblyAnimation, {
                toValue: 1,
                duration: 100,
                useNativeDriver: true,
            }),
        ]).start();

        // Check if piece is in correct position
        const updatedPieces = pieces.map(piece => {
            if (piece.id === pieceId) {
                return { ...piece, solved: piece.id === piece.position };
            }
            return piece;
        });

        setPieces(updatedPieces);

        // Check if puzzle is solved
        const allSolved = updatedPieces.every(piece => piece.solved);
        if (allSolved) {
            setSolved(true);
            animateCompletion();
        }
    };

    const animateCompletion = () => {
        Animated.sequence([
            Animated.timing(assemblyAnimation, {
                toValue: 1.1,
                duration: 200,
                useNativeDriver: true,
            }),
            Animated.timing(assemblyAnimation, {
                toValue: 1,
                duration: 200,
                useNativeDriver: true,
            }),
        ]).start(() => {
            Alert.alert(
                'Puzzle Solved!',
                'Congratulations! You earned Code Points.',
                [
                    {
                        text: 'Continue',
                        onPress: () => navigation.goBack(),
                    },
                ]
            );
        });
    };

    const resetPuzzle = () => {
        setSolved(false);
        setPieces(shufflePieces(puzzle.pieces));

        // Reset animation
        assemblyAnimation.setValue(0);
        Animated.spring(assemblyAnimation, {
            toValue: 1,
            tension: 50,
            friction: 7,
            useNativeDriver: true,
        }).start();
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#000" />
                <Text style={styles.loadingText}>Generating puzzle...</Text>
            </View>
        );
    }

    return (
        <Animated.View
            style={[
                styles.container,
                {
                    opacity: fadeAnimation,
                    transform: [{
                        scale: assemblyAnimation,
                    }],
                },
            ]}
        >
            <View style={styles.header}>
                <Text style={styles.title}>{puzzle?.title}</Text>
                <Text style={styles.description}>{puzzle?.description}</Text>
            </View>

            <View style={styles.puzzleGrid}>
                {pieces.map((piece, index) => (
                    <TouchableOpacity
                        key={piece.id}
                        style={[
                            styles.puzzlePiece,
                            {
                                backgroundColor: piece.color,
                                opacity: piece.solved ? 1 : 0.7,
                                borderWidth: piece.solved ? 3 : 1,
                                borderColor: piece.solved ? '#00ff00' : '#000',
                            },
                        ]}
                        onPress={() => handlePiecePress(piece.id)}
                        disabled={solved}
                    >
                        <Text style={styles.pieceText}>{piece.id + 1}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            <View style={styles.controls}>
                <TouchableOpacity style={styles.resetButton} onPress={resetPuzzle}>
                    <Text style={styles.resetButtonText}>Reset</Text>
                </TouchableOpacity>
            </View>

            {solved && (
                <View style={styles.completionOverlay}>
                    <Text style={styles.completionText}>🎉 Puzzle Solved! 🎉</Text>
                </View>
            )}
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#666',
    },
    header: {
        alignItems: 'center',
        marginBottom: 30,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 10,
    },
    description: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
    },
    puzzleGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
        width: 300,
        height: 300,
        alignSelf: 'center',
        marginBottom: 30,
    },
    puzzlePiece: {
        width: 90,
        height: 90,
        margin: 5,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
    },
    pieceText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
    },
    controls: {
        alignItems: 'center',
    },
    resetButton: {
        backgroundColor: '#000',
        paddingHorizontal: 30,
        paddingVertical: 15,
        borderRadius: 25,
    },
    resetButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    completionOverlay: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: [{ translateX: -100 }, { translateY: -50 }],
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 20,
        borderRadius: 15,
    },
    completionText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default PuzzleScreen; 