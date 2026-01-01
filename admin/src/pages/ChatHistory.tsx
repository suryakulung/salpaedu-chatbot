import { useEffect, useState } from 'react';
import axios from 'axios';

const ChatHistory = () => {
    const [sessions, setSessions] = useState<any[]>([]);

    useEffect(() => {
        const fetchHistory = async () => {
            const token = localStorage.getItem('token');
            try {
                const { data } = await axios.get('/chat/history', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setSessions(data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchHistory();
    }, []);

    return (
        <div>
            <h1>Chat History</h1>
            <div style={{ display: 'grid', gap: '1rem', marginTop: '1rem' }}>
                {sessions.map(session => (
                    <div key={session._id} style={{ background: 'white', padding: '1rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', borderBottom: '1px solid #eee', paddingBottom: '0.5rem' }}>
                            <span style={{ fontWeight: 'bold' }}>Session: {session.sessionId}</span>
                            <span style={{ color: '#888' }}>{new Date(session.updatedAt).toLocaleString()}</span>
                        </div>
                        <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                            {session.messages.map((msg: any, idx: number) => (
                                <div key={idx} style={{ marginBottom: '5px', fontSize: '14px' }}>
                                    <strong style={{ color: msg.role === 'assistant' ? '#007bff' : '#333' }}>{msg.role}: </strong>
                                    {msg.content}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ChatHistory;
