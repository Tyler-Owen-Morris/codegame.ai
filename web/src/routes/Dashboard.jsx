import React, { useState, useEffect } from 'react';

const Dashboard = () => {
    const [userStats, setUserStats] = useState({
        codePoints: 0,
        puzzlesSolved: 0,
        scanHistory: [],
        loading: true,
    });

    useEffect(() => {
        // Simulate API call to fetch user stats
        fetchUserStats();
    }, []);

    const fetchUserStats = async () => {
        try {
            setUserStats(prev => ({ ...prev, loading: true }));

            // Mock API call - will be replaced with actual backend call
            await new Promise(resolve => setTimeout(resolve, 1000));

            const mockStats = {
                codePoints: 1250,
                puzzlesSolved: 8,
                scanHistory: [
                    {
                        id: 1,
                        location: 'Coffee Shop',
                        timestamp: new Date().toISOString(),
                        puzzleType: 'Assembly',
                        pointsEarned: 150,
                    },
                    {
                        id: 2,
                        location: 'Library',
                        timestamp: new Date(Date.now() - 86400000).toISOString(),
                        puzzleType: 'Logic',
                        pointsEarned: 200,
                    },
                    {
                        id: 3,
                        location: 'Park Bench',
                        timestamp: new Date(Date.now() - 172800000).toISOString(),
                        puzzleType: 'Pattern',
                        pointsEarned: 175,
                    },
                ],
                loading: false,
            };

            setUserStats(mockStats);
        } catch (error) {
            console.error('Failed to fetch user stats:', error);
            setUserStats(prev => ({ ...prev, loading: false }));
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    if (userStats.loading) {
        return (
            <div className="dashboard-loading">
                <div className="loading-spinner"></div>
                <p>Loading your stats...</p>
            </div>
        );
    }

    return (
        <div className="dashboard">
            <div className="dashboard-header">
                <h2>Your Gaming Dashboard</h2>
                <p>Track your puzzle-solving journey</p>
            </div>

            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon">🏆</div>
                    <div className="stat-content">
                        <h3>{userStats.codePoints.toLocaleString()}</h3>
                        <p>Code Points</p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">🧩</div>
                    <div className="stat-content">
                        <h3>{userStats.puzzlesSolved}</h3>
                        <p>Puzzles Solved</p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">📱</div>
                    <div className="stat-content">
                        <h3>{userStats.scanHistory.length}</h3>
                        <p>QR Codes Scanned</p>
                    </div>
                </div>
            </div>

            <div className="scan-history">
                <h3>Recent Activity</h3>
                {userStats.scanHistory.length > 0 ? (
                    <div className="history-list">
                        {userStats.scanHistory.map((scan) => (
                            <div key={scan.id} className="history-item">
                                <div className="history-info">
                                    <h4>{scan.location}</h4>
                                    <p className="history-date">{formatDate(scan.timestamp)}</p>
                                    <span className="puzzle-type">{scan.puzzleType} Puzzle</span>
                                </div>
                                <div className="points-earned">
                                    +{scan.pointsEarned} pts
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="no-history">
                        <p>No scans yet. Start scanning QR codes to see your activity!</p>
                    </div>
                )}
            </div>

            <div className="actions">
                <button
                    className="primary-button"
                    onClick={() => window.location.href = '/qr-login'}
                >
                    Link Mobile Device
                </button>
                <button
                    className="secondary-button"
                    onClick={fetchUserStats}
                >
                    Refresh Stats
                </button>
            </div>
        </div>
    );
};

export default Dashboard; 