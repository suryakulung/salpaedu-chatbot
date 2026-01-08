import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            // Hardcode URL to rule out config issues
            const url = "https://salpaedu-chatbot.onrender.com/api/auth/login";
            console.log('Attemping login to:', url);

            const { data } = await axios.post(url, { password }, {
                timeout: 15000 // 15s timeout
            });

            localStorage.setItem('token', data.token);
            navigate('/');
        } catch (err: any) {
            console.error('Login Error:', err);
            let errorMessage = 'Login Failed.';

            if (err.response) {
                // Server responded with non-2xx code
                errorMessage = err.response.data?.error || `Server Error: ${err.response.status}`;
            } else if (err.request) {
                // Request made but no response (Network Error)
                errorMessage = 'Network Error: No response from server. Check internet or server status.';
            } else {
                // Setup error
                errorMessage = err.message || 'Unknown Error';
            }
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f0f2f5' }}>
            <div style={{ background: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                <h2>Admin Login</h2>
                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '300px' }}>
                    <input
                        type="password"
                        placeholder="Enter Admin Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
                        disabled={loading}
                    />
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            padding: '0.5rem',
                            background: loading ? '#ccc' : '#007bff',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
