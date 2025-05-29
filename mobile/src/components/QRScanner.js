import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, Dimensions } from 'react-native';
import { CameraView, Camera } from 'expo-camera';

const { width, height } = Dimensions.get('window');

const QRScanner = ({ onScan, onError }) => {
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);

    useEffect(() => {
        const getCameraPermissions = async () => {
            try {
                const { status } = await Camera.requestCameraPermissionsAsync();
                setHasPermission(status === 'granted');
            } catch (error) {
                console.error('Permission request error:', error);
                setHasPermission(false);
                onError && onError(error);
            }
        };

        getCameraPermissions();
    }, []);

    const handleBarCodeScanned = ({ type, data }) => {
        if (scanned) return;

        setScanned(true);

        try {
            console.log('QR Code scanned:', { type, data: data.substring(0, 50) + '...' });

            // Trim URL params from scanned data
            let cleanedData = data;
            if (data.includes('?')) {
                cleanedData = data.split('?')[0];
            }
            if (data.includes('#')) {
                cleanedData = cleanedData.split('#')[0];
            }

            // Reset scanner after a delay to allow new scans
            setTimeout(() => {
                setScanned(false);
            }, 2000);

            onScan && onScan(cleanedData);
        } catch (error) {
            console.error('QR scan processing error:', error);
            setScanned(false);
            onError && onError(error);
        }
    };

    if (hasPermission === null) {
        return (
            <View style={styles.permissionContainer}>
                <Text style={styles.permissionText}>Requesting camera permission...</Text>
            </View>
        );
    }

    if (hasPermission === false) {
        return (
            <View style={styles.permissionContainer}>
                <Text style={styles.permissionText}>Camera access denied</Text>
                <Text style={styles.permissionSubtext}>
                    Please enable camera permissions in your device settings to scan QR codes.
                </Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <CameraView
                style={styles.camera}
                facing="back"
                barcodeScannerSettings={{
                    barcodeTypes: ["qr", "pdf417", "datamatrix", "code128", "code39", "code93", "codabar", "ean13", "ean8", "upc_e", "upc_a"],
                }}
                onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
            />

            {/* Scanner Overlay */}
            <View style={styles.overlay}>
                <View style={styles.scanBox}>
                    <View style={[styles.corner, styles.topLeft]} />
                    <View style={[styles.corner, styles.topRight]} />
                    <View style={[styles.corner, styles.bottomLeft]} />
                    <View style={[styles.corner, styles.bottomRight]} />
                </View>

                <Text style={styles.instructionText}>
                    Point your camera at a QR code
                </Text>

                {scanned && (
                    <View style={styles.scannedOverlay}>
                        <Text style={styles.scannedText}>✓ QR Code Detected!</Text>
                        <Text style={styles.scannedSubtext}>Processing...</Text>
                    </View>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    camera: {
        flex: 1,
    },
    permissionContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        padding: 20,
    },
    permissionText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        textAlign: 'center',
        marginBottom: 10,
    },
    permissionSubtext: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        lineHeight: 20,
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scanBox: {
        width: 250,
        height: 250,
        borderColor: 'transparent',
        borderWidth: 0,
        position: 'relative',
    },
    corner: {
        position: 'absolute',
        width: 30,
        height: 30,
        borderColor: '#fff',
        borderWidth: 3,
    },
    topLeft: {
        top: 0,
        left: 0,
        borderBottomWidth: 0,
        borderRightWidth: 0,
    },
    topRight: {
        top: 0,
        right: 0,
        borderBottomWidth: 0,
        borderLeftWidth: 0,
    },
    bottomLeft: {
        bottom: 0,
        left: 0,
        borderTopWidth: 0,
        borderRightWidth: 0,
    },
    bottomRight: {
        bottom: 0,
        right: 0,
        borderTopWidth: 0,
        borderLeftWidth: 0,
    },
    instructionText: {
        position: 'absolute',
        bottom: 80,
        color: '#fff',
        fontSize: 16,
        fontWeight: '500',
        textAlign: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 20,
    },
    scannedOverlay: {
        position: 'absolute',
        top: '45%',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        paddingHorizontal: 24,
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    scannedText: {
        color: '#4CAF50',
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 4,
    },
    scannedSubtext: {
        color: '#fff',
        fontSize: 14,
        opacity: 0.8,
    },
});

export default QRScanner; 