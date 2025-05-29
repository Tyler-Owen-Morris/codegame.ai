import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import theme from '../theme';

const HomeScreen = () => {
    const navigation = useNavigation();
    const [userStats, setUserStats] = useState({
        codePoints: 0,
        puzzlesSolved: 0,
        scanCount: 0,
        loading: true,
    });

    useEffect(() => {
        loadUserStats();
    }, []);

    const loadUserStats = async () => {
        try {
            // Simulate API call to load user stats
            await new Promise(resolve => setTimeout(resolve, 1000));

            setUserStats({
                codePoints: 1250,
                puzzlesSolved: 8,
                scanCount: 12,
                loading: false,
            });
        } catch (error) {
            console.error('Failed to load user stats:', error);
            setUserStats(prev => ({ ...prev, loading: false }));
        }
    };

    const handleStartScanning = () => {
        navigation.navigate('Scan');
    };

    const handleViewProfile = () => {
        // Navigate to profile/settings screen (to be implemented)
        console.log('Navigate to profile');
    };

    if (userStats.loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
                <Text style={styles.loadingText}>Loading your stats...</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.welcomeText}>Welcome to</Text>
                <Text style={styles.appTitle}>CodeGame.ai</Text>
                <Text style={styles.tagline}>Turn any QR code into a puzzle challenge</Text>
            </View>

            {/* Stats Cards */}
            <View style={styles.statsContainer}>
                <View style={styles.statsGrid}>
                    <View style={styles.statCard}>
                        <Text style={styles.statNumber}>{userStats.codePoints.toLocaleString()}</Text>
                        <Text style={styles.statLabel}>Code Points</Text>
                    </View>

                    <View style={styles.statCard}>
                        <Text style={styles.statNumber}>{userStats.puzzlesSolved}</Text>
                        <Text style={styles.statLabel}>Puzzles Solved</Text>
                    </View>

                    <View style={styles.statCard}>
                        <Text style={styles.statNumber}>{userStats.scanCount}</Text>
                        <Text style={styles.statLabel}>QR Codes Scanned</Text>
                    </View>
                </View>
            </View>

            {/* Main Action Button */}
            <View style={styles.actionContainer}>
                <TouchableOpacity style={styles.scanButton} onPress={handleStartScanning}>
                    <Text style={styles.scanButtonIcon}>📱</Text>
                    <Text style={styles.scanButtonText}>Start Scanning</Text>
                    <Text style={styles.scanButtonSubtext}>Point camera at any QR code</Text>
                </TouchableOpacity>
            </View>

            {/* How It Works */}
            <View style={styles.howItWorksContainer}>
                <Text style={styles.sectionTitle}>How It Works</Text>

                <View style={styles.stepContainer}>
                    <View style={styles.step}>
                        <View style={styles.stepNumber}>
                            <Text style={styles.stepNumberText}>1</Text>
                        </View>
                        <View style={styles.stepContent}>
                            <Text style={styles.stepTitle}>Scan Any QR Code</Text>
                            <Text style={styles.stepDescription}>
                                Point your camera at restaurant menus, product codes, or any QR code you find
                            </Text>
                        </View>
                    </View>

                    <View style={styles.step}>
                        <View style={styles.stepNumber}>
                            <Text style={styles.stepNumberText}>2</Text>
                        </View>
                        <View style={styles.stepContent}>
                            <Text style={styles.stepTitle}>AI Generates Puzzle</Text>
                            <Text style={styles.stepDescription}>
                                Our AI creates a unique puzzle based on the QR code data and your location
                            </Text>
                        </View>
                    </View>

                    <View style={styles.step}>
                        <View style={styles.stepNumber}>
                            <Text style={styles.stepNumberText}>3</Text>
                        </View>
                        <View style={styles.stepContent}>
                            <Text style={styles.stepTitle}>Solve & Earn Points</Text>
                            <Text style={styles.stepDescription}>
                                Complete puzzles to earn Code Points and climb the leaderboards
                            </Text>
                        </View>
                    </View>
                </View>
            </View>

            {/* Secondary Actions */}
            <View style={styles.secondaryActions}>
                <TouchableOpacity style={styles.secondaryButton} onPress={handleViewProfile}>
                    <Text style={styles.secondaryButtonText}>View Profile</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    contentContainer: {
        paddingBottom: theme.spacing['2xl'],
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.colors.background,
    },
    loadingText: {
        marginTop: theme.spacing.md,
        fontSize: theme.typography.fontSize.lg,
        color: theme.colors.textSecondary,
    },
    header: {
        alignItems: 'center',
        padding: theme.spacing.xl,
        backgroundColor: theme.colors.surface,
    },
    welcomeText: {
        fontSize: theme.typography.fontSize.lg,
        color: theme.colors.textSecondary,
        marginBottom: theme.spacing.xs,
    },
    appTitle: {
        fontSize: theme.typography.fontSize['4xl'],
        fontWeight: theme.typography.fontWeight.bold,
        color: theme.colors.textPrimary,
        marginBottom: theme.spacing.sm,
    },
    tagline: {
        fontSize: theme.typography.fontSize.base,
        color: theme.colors.textSecondary,
        textAlign: 'center',
        lineHeight: theme.typography.lineHeight.normal,
    },
    statsContainer: {
        padding: theme.spacing.lg,
    },
    statsGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: theme.spacing.sm,
    },
    statCard: {
        flex: 1,
        backgroundColor: theme.colors.surface,
        padding: theme.spacing.lg,
        borderRadius: theme.borderRadius.md,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    statNumber: {
        fontSize: theme.typography.fontSize['2xl'],
        fontWeight: theme.typography.fontWeight.bold,
        color: theme.colors.textPrimary,
        marginBottom: theme.spacing.xs,
    },
    statLabel: {
        fontSize: theme.typography.fontSize.sm,
        color: theme.colors.textSecondary,
        textAlign: 'center',
    },
    actionContainer: {
        padding: theme.spacing.lg,
    },
    scanButton: {
        backgroundColor: theme.colors.primary,
        padding: theme.spacing.xl,
        borderRadius: theme.borderRadius.lg,
        alignItems: 'center',
        ...theme.shadows.md,
    },
    scanButtonIcon: {
        fontSize: 48,
        marginBottom: theme.spacing.md,
    },
    scanButtonText: {
        color: theme.colors.textInverse,
        fontSize: theme.typography.fontSize.xl,
        fontWeight: theme.typography.fontWeight.bold,
        marginBottom: theme.spacing.xs,
    },
    scanButtonSubtext: {
        color: theme.colors.textInverse,
        fontSize: theme.typography.fontSize.sm,
        opacity: 0.8,
    },
    howItWorksContainer: {
        padding: theme.spacing.lg,
    },
    sectionTitle: {
        fontSize: theme.typography.fontSize.xl,
        fontWeight: theme.typography.fontWeight.bold,
        color: theme.colors.textPrimary,
        marginBottom: theme.spacing.lg,
        textAlign: 'center',
    },
    stepContainer: {
        gap: theme.spacing.lg,
    },
    step: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: theme.spacing.md,
    },
    stepNumber: {
        width: 32,
        height: 32,
        backgroundColor: theme.colors.primary,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    stepNumberText: {
        color: theme.colors.textInverse,
        fontSize: theme.typography.fontSize.sm,
        fontWeight: theme.typography.fontWeight.bold,
    },
    stepContent: {
        flex: 1,
    },
    stepTitle: {
        fontSize: theme.typography.fontSize.lg,
        fontWeight: theme.typography.fontWeight.semibold,
        color: theme.colors.textPrimary,
        marginBottom: theme.spacing.xs,
    },
    stepDescription: {
        fontSize: theme.typography.fontSize.sm,
        color: theme.colors.textSecondary,
        lineHeight: theme.typography.lineHeight.normal,
    },
    secondaryActions: {
        padding: theme.spacing.lg,
        alignItems: 'center',
    },
    secondaryButton: {
        borderWidth: 2,
        borderColor: theme.colors.primary,
        paddingHorizontal: theme.spacing.xl,
        paddingVertical: theme.spacing.md,
        borderRadius: theme.borderRadius.lg,
    },
    secondaryButtonText: {
        color: theme.colors.primary,
        fontSize: theme.typography.fontSize.base,
        fontWeight: theme.typography.fontWeight.medium,
    },
});

export default HomeScreen; 