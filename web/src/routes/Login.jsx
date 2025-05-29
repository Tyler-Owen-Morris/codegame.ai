import React, { useState } from 'react';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [loading, setLoading] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Mock login process
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Simulate successful login
            console.log('Login attempt:', formData);

            // Redirect to dashboard
            window.location.href = '/dashboard';

        } catch (error) {
            console.error('Login failed:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login">
            <div className="login-container">
                <div className="login-header">
                    <h2>Sign In to Code Portal</h2>
                    <p>Access your puzzle stats and manage your account</p>
                </div>

                <form onSubmit={handleSubmit} className="login-form">
                    <div className="form-group">
                        <label htmlFor="email">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                            placeholder="Enter your email"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            required
                            placeholder="Enter your password"
                        />
                    </div>

                    <button
                        type="submit"
                        className="primary-button"
                        disabled={loading}
                    >
                        {loading ? 'Signing In...' : 'Sign In'}
                    </button>
                </form>

                <div className="login-alternatives">
                    <div className="divider">
                        <span>or</span>
                    </div>

                    <button
                        className="qr-login-button"
                        onClick={() => window.location.href = '/qr-login'}
                    >
                        <span className="qr-icon">📱</span>
                        Link with Mobile App
                    </button>
                </div>

                <div className="login-footer">
                    <p>Don't have an account? Sign up on the mobile app first.</p>
                </div>
            </div>
        </div>
    );
};

export default Login; 