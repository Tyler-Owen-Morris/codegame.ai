import React, { useState, useEffect, useRef } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import QRCode from 'qrcode';

const QRLogin = () => {
    const { setIsAuthenticated, setUser } = useOutletContext();
    const navigate = useNavigate();
    const [qrCodeUrl, setQrCodeUrl] = useState('');
    const [sessionId, setSessionId] = useState('');
    const [isConnected, setIsConnected] = useState(false);
    const [loading, setLoading] = useState(true);
    const canvasRef = useRef(null);

    useEffect(() => {
        generateQRCode();

        // Simulate polling for connection status
        const interval = setInterval(checkConnectionStatus, 2000);

        return () => clearInterval(interval);
    }, []);

    const generateQRCode = async () => {
        try {
            setLoading(true);

            // Generate a unique session ID for this QR login attempt
            const newSessionId = `qr_session_${Date.now()}_${Math.random().toString(36).substring(7)}`;
            setSessionId(newSessionId);

            // Create the QR code payload that the mobile app will scan
            const qrPayload = {
                type: 'account_link',
                sessionId: newSessionId,
                portalUrl: window.location.origin,
                timestamp: Date.now(),
            };

            const qrDataString = JSON.stringify(qrPayload);

            // Generate QR code canvas
            if (canvasRef.current) {
                await QRCode.toCanvas(canvasRef.current, qrDataString, {
                    width: 256,
                    margin: 2,
                    color: {
                        dark: '#000000',
                        light: '#FFFFFF',
                    },
                });
            }

            // Also generate data URL for backup display
            const qrUrl = await QRCode.toDataURL(qrDataString, {
                width: 256,
                margin: 2,
                color: {
                    dark: '#000000',
                    light: '#FFFFFF',
                },
            });

            setQrCodeUrl(qrUrl);
            setLoading(false);

        } catch (error) {
            console.error('Failed to generate QR code:', error);
            setLoading(false);
        }
    };

    const checkConnectionStatus = async () => {
        try {
            // Mock API call to check if mobile device has scanned the QR code
            // In real implementation, this would check the backend for session status

            // Simulate random connection after 10 seconds for demo
            if (sessionId && Date.now() - parseInt(sessionId.split('_')[2]) > 10000) {
                if (Math.random() > 0.7) {
                    setIsConnected(true);

                    // Simulate successful authentication
                    const mockUser = {
                        id: 'user_' + Date.now(),
                        name: 'Mobile User',
                        email: 'user@codegame.ai',
                        connectedAt: new Date().toISOString(),
                    };

                    // Store user data and set authentication
                    localStorage.setItem('codeGameUser', JSON.stringify(mockUser));
                    setUser(mockUser);
                    setIsAuthenticated(true);

                    setTimeout(() => {
                        // Navigate to dashboard after successful connection
                        navigate('/dashboard');
                    }, 2000);
                }
            }
        } catch (error) {
            console.error('Failed to check connection status:', error);
        }
    };

    const handleRefresh = () => {
        setIsConnected(false);
        generateQRCode();
    };

    const handleBackToSplash = () => {
        navigate('/');
    };

    if (loading) {
        return (
            <div className="qr-login-loading">
                <div className="loading-spinner"></div>
                <p>Generating QR code...</p>
            </div>
        );
    }

    if (isConnected) {
        return (
            <div className="qr-login-success">
                <div className="success-icon">✅</div>
                <h2>Device Connected!</h2>
                <p>Your mobile device has been successfully linked to your account.</p>
                <p>Redirecting to dashboard...</p>
            </div>
        );
    }

    return (
        <div className="qr-login">
            <div className="qr-login-header">
                <h2>Link Your Mobile Device</h2>
                <p>Scan this QR code with the CodeGame.ai mobile app to link your account</p>
            </div>

            <div className="qr-code-container">
                <div className="qr-code-wrapper">
                    <canvas
                        ref={canvasRef}
                        className="qr-code-canvas"
                        style={{ display: qrCodeUrl ? 'block' : 'none' }}
                    />
                    {!qrCodeUrl && (
                        <div className="qr-placeholder">
                            <p>Generating QR code...</p>
                        </div>
                    )}
                </div>

                <div className="qr-code-info">
                    <p className="session-id">Session ID: {sessionId.split('_').pop()}</p>
                    <p className="instructions">
                        1. Open the CodeGame.ai mobile app<br />
                        2. Tap "Link Account" or scan icon<br />
                        3. Point your camera at this QR code<br />
                        4. Wait for confirmation
                    </p>
                </div>
            </div>

            <div className="qr-login-actions">
                <button
                    className="secondary-button"
                    onClick={handleRefresh}
                >
                    Generate New Code
                </button>
                <button
                    className="primary-button"
                    onClick={handleBackToSplash}
                >
                    Back to Home
                </button>
            </div>

            <div className="qr-status">
                <div className="status-indicator">
                    <div className="pulse-dot"></div>
                    <span>Waiting for mobile device...</span>
                </div>
            </div>
        </div>
    );
};

export default QRLogin; 