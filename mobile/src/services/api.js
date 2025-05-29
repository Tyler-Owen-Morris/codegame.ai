// API Service for CodeGame.ai Mobile App
const API_BASE_URL = 'http://localhost:3001/api';

class ApiService {
    constructor() {
        this.baseURL = API_BASE_URL;
        this.timeout = 10000; // 10 seconds
    }

    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;

        const config = {
            timeout: this.timeout,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
            ...options,
        };

        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), this.timeout);

            const response = await fetch(url, {
                ...config,
                signal: controller.signal,
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('API Request failed:', error);
            throw error;
        }
    }

    // Scan QR Code and generate puzzle
    async scanQRCode(qrData, location = null) {
        try {
            console.log('API: Scanning QR code:', qrData.substring(0, 30) + '...');

            const response = await this.request('/puzzle/generate', {
                method: 'POST',
                body: JSON.stringify({
                    qrData,
                    location: location ? location.address : 'Unknown Location',
                    difficulty: 'medium',
                    latitude: location?.latitude,
                    longitude: location?.longitude,
                }),
            });

            return response;
        } catch (error) {
            console.error('QR scan API error:', error);
            throw new Error('Failed to generate puzzle from QR code');
        }
    }

    // Submit puzzle solution
    async submitSolution(puzzleId, userId, solution, timeToSolve) {
        try {
            const response = await this.request('/puzzle/solve', {
                method: 'POST',
                body: JSON.stringify({
                    puzzleId,
                    userId,
                    solution,
                    timeToSolve,
                }),
            });

            return response;
        } catch (error) {
            console.error('Submit solution API error:', error);
            throw new Error('Failed to submit puzzle solution');
        }
    }

    // Process scan and award points
    async processScan(scanData) {
        try {
            const response = await this.request('/scan', {
                method: 'POST',
                body: JSON.stringify(scanData),
            });

            return response;
        } catch (error) {
            console.error('Process scan API error:', error);
            throw new Error('Failed to process scan');
        }
    }

    // User Authentication
    async register(userData) {
        try {
            const response = await this.request('/auth/register', {
                method: 'POST',
                body: JSON.stringify(userData),
            });

            return response;
        } catch (error) {
            console.error('Register API error:', error);
            throw new Error('Registration failed');
        }
    }

    async login(credentials) {
        try {
            const response = await this.request('/auth/login', {
                method: 'POST',
                body: JSON.stringify(credentials),
            });

            return response;
        } catch (error) {
            console.error('Login API error:', error);
            throw new Error('Login failed');
        }
    }

    async qrLogin(sessionData) {
        try {
            const response = await this.request('/auth/qr-login', {
                method: 'POST',
                body: JSON.stringify(sessionData),
            });

            return response;
        } catch (error) {
            console.error('QR Login API error:', error);
            throw new Error('QR login failed');
        }
    }

    // User data
    async getUserProfile(userId, token) {
        try {
            const response = await this.request(`/user/${userId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            return response;
        } catch (error) {
            console.error('Get user profile API error:', error);
            throw new Error('Failed to load user profile');
        }
    }

    async getScanHistory(userId, options = {}) {
        try {
            const queryParams = new URLSearchParams({
                limit: options.limit || 20,
                offset: options.offset || 0,
            });

            const response = await this.request(`/scan/history/${userId}?${queryParams}`);
            return response;
        } catch (error) {
            console.error('Get scan history API error:', error);
            throw new Error('Failed to load scan history');
        }
    }

    // Health check
    async healthCheck() {
        try {
            const response = await this.request('/health');
            return response;
        } catch (error) {
            console.error('Health check API error:', error);
            throw new Error('Backend service unavailable');
        }
    }
}

// Create and export singleton instance
const apiService = new ApiService();

// Helper functions for common operations
export const scanQRCode = (qrData, location) => {
    return apiService.scanQRCode(qrData, location);
};

export const submitPuzzleSolution = (puzzleId, userId, solution, timeToSolve) => {
    return apiService.submitSolution(puzzleId, userId, solution, timeToSolve);
};

export const processScan = (scanData) => {
    return apiService.processScan(scanData);
};

export const userLogin = (credentials) => {
    return apiService.login(credentials);
};

export const userRegister = (userData) => {
    return apiService.register(userData);
};

export const qrLogin = (sessionData) => {
    return apiService.qrLogin(sessionData);
};

export const getUserProfile = (userId, token) => {
    return apiService.getUserProfile(userId, token);
};

export const getScanHistory = (userId, options) => {
    return apiService.getScanHistory(userId, options);
};

export const checkBackendHealth = () => {
    return apiService.healthCheck();
};

export default apiService; 