import { Link, Outlet, useNavigate } from 'react-router-dom';
import { FaHistory, FaBook, FaUserFriends, FaSignOutAlt } from 'react-icons/fa';

const DashboardLayout = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <div style={{ display: 'flex', height: '100vh' }}>
            {/* Sidebar */}
            <aside style={{ width: '250px', background: '#343a40', color: 'white', padding: '1rem' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Bot Admin</h2>
                <nav style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <Link to="/history" style={linkStyle}><FaHistory /> Chat History</Link>
                    <Link to="/knowledge" style={linkStyle}><FaBook /> Knowledge Base</Link>
                    <Link to="/leads" style={linkStyle}><FaUserFriends /> Leads</Link>
                </nav>
                <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid #495057' }}>
                    <button onClick={handleLogout} style={logoutStyle}><FaSignOutAlt /> Logout</button>
                </div>
            </aside>

            {/* Main Content */}
            <main style={{ flex: 1, padding: '2rem', overflowY: 'auto', background: '#f8f9fa' }}>
                <Outlet />
            </main>
        </div>
    );
};

const linkStyle = {
    color: '#ddd',
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '10px',
    borderRadius: '4px',
    transition: 'background 0.2s'
};

const logoutStyle = {
    background: 'none',
    border: 'none',
    color: '#ff6b6b',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontSize: '1rem',
    width: '100%'
};

export default DashboardLayout;
