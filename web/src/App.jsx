import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check authentication status on app load
    const userData = localStorage.getItem('codeGameUser');
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setIsAuthenticated(true);

        // If user is authenticated and on splash page, redirect to dashboard
        if (location.pathname === '/' || location.pathname === '/splash') {
          navigate('/dashboard', { replace: true });
        }
      } catch (error) {
        console.error('Failed to parse user data:', error);
        localStorage.removeItem('codeGameUser');
      }
    } else {
      // If user is not authenticated and trying to access protected routes, redirect to splash
      if (location.pathname === '/dashboard') {
        navigate('/', { replace: true });
      }
    }
    setLoading(false);
  }, [navigate, location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem('codeGameUser');
    setUser(null);
    setIsAuthenticated(false);
    navigate('/', { replace: true });
  };

  const showNavigation = isAuthenticated && location.pathname !== '/qr-login';

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="App">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <header className="App-header">
        <div className="header-content">
          <h1 className="brand-title">
            <span onClick={() => navigate(isAuthenticated ? '/dashboard' : '/')} style={{ cursor: 'pointer' }}>
              CodeGame.ai
            </span>
          </h1>
          <button
            className={`nav-link ${location.pathname === '/qr-login' ? 'active' : ''}`}
            onClick={() => navigate('/qr-login')}
          >
            QR Login
          </button>

          {showNavigation && (
            <nav className="main-nav">
              <button
                className={`nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`}
                onClick={() => navigate('/dashboard')}
              >
                Dashboard
              </button>

              <div className="user-menu">
                <span className="user-name">
                  {user?.name || user?.email || 'User'}
                </span>
                <button className="logout-button" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            </nav>
          )}
        </div>
      </header>

      <main className={`main-content ${location.pathname === '/qr-login' ? 'qr-login-page' : ''}`}>
        <Outlet context={{ setIsAuthenticated, setUser, isAuthenticated }} />
      </main>
    </div>
  );
}

export default App;
