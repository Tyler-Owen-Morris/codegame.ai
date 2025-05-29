import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import QRScanner from '../components/QRScanner';
import theme from '../theme';

const ScanScreen = () => {
    const navigation = useNavigation();
    const [isScanning, setIsScanning] = useState(true);
    const [loading, setLoading] = useState(false);

    const handleScan = async (qrData) => {
        try {
            setLoading(true);
            setIsScanning(false);

            console.log('QR Code scanned:', qrData);

            // Simulate location data (in real app, use expo-location)
            const mockLocation = {
                latitude: 37.7749,
                longitude: -122.4194,
                address: 'Current Location',
            };

            // Navigate to PuzzleScreen with scan data
            navigation.navigate('Puzzle', {
                qrData,
                location: mockLocation,
                timestamp: new Date().toISOString(),
            });

        } catch (error) {
            console.error('Scan processing error:', error);
            Alert.alert(
                'Scan Error',
                'Failed to process QR code. Please try again.',
                [
                    {
                        text: 'Retry',
                        onPress: () => {
                            setIsScanning(true);
                            setLoading(false);
                        },
                    },
                ]
            );
        }
    };

    const handleError = (error) => {
        console.error('QR Scanner error:', error);
        Alert.alert(
            'Camera Error',
            'Unable to access camera. Please check permissions.',
            [
                {
                    text: 'Retry',
                    onPress: () => setIsScanning(true),
                },
            ]
        );
    };

    const resetScanner = () => {
        setIsScanning(true);
        setLoading(false);
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
                <Text style={styles.loadingText}>Processing QR code...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Scan QR Code</Text>
                <Text style={styles.subtitle}>
                    Point your camera at any QR code to generate a puzzle
                </Text>
            </View>

            <View style={styles.scannerContainer}>
                {isScanning ? (
                    <QRScanner onScan={handleScan} onError={handleError} />
                ) : (
                    <View style={styles.scannedContainer}>
                        <Text style={styles.scannedText}>QR Code Detected!</Text>
                        <TouchableOpacity style={styles.resetButton} onPress={resetScanner}>
                            <Text style={styles.resetButtonText}>Scan Another</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>

            <View style={styles.instructions}>
                <Text style={styles.instructionText}>
                    💡 Tip: Any QR code works! Try scanning:
                </Text>
                <Text style={styles.instructionItem}>• Restaurant menus</Text>
                <Text style={styles.instructionItem}>• Product barcodes</Text>
                <Text style={styles.instructionItem}>• Website links</Text>
                <Text style={styles.instructionItem}>• Social media profiles</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    header: {
        padding: theme.spacing.lg,
        alignItems: 'center',
        backgroundColor: theme.colors.surface,
    },
    title: {
        fontSize: theme.typography.fontSize['2xl'],
        fontWeight: theme.typography.fontWeight.bold,
        color: theme.colors.textPrimary,
        marginBottom: theme.spacing.sm,
    },
    subtitle: {
        fontSize: theme.typography.fontSize.base,
        color: theme.colors.textSecondary,
        textAlign: 'center',
        lineHeight: theme.typography.lineHeight.normal,
    },
    scannerContainer: {
        flex: 1,
        margin: theme.spacing.md,
        borderRadius: theme.borderRadius.lg,
        overflow: 'hidden',
        backgroundColor: theme.colors.gray900,
    },
    scannedContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.colors.surface,
    },
    scannedText: {
        fontSize: theme.typography.fontSize.xl,
        fontWeight: theme.typography.fontWeight.semibold,
        color: theme.colors.textPrimary,
        marginBottom: theme.spacing.lg,
    },
    resetButton: {
        backgroundColor: theme.colors.primary,
        paddingHorizontal: theme.spacing.xl,
        paddingVertical: theme.spacing.md,
        borderRadius: theme.borderRadius.lg,
    },
    resetButtonText: {
        color: theme.colors.textInverse,
        fontSize: theme.typography.fontSize.lg,
        fontWeight: theme.typography.fontWeight.medium,
    },
    instructions: {
        padding: theme.spacing.lg,
        backgroundColor: theme.colors.surface,
    },
    instructionText: {
        fontSize: theme.typography.fontSize.base,
        color: theme.colors.textPrimary,
        fontWeight: theme.typography.fontWeight.medium,
        marginBottom: theme.spacing.sm,
    },
    instructionItem: {
        fontSize: theme.typography.fontSize.sm,
        color: theme.colors.textSecondary,
        marginLeft: theme.spacing.md,
        marginBottom: theme.spacing.xs,
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
});

export default ScanScreen; 