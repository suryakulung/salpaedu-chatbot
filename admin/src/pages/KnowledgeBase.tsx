import React, { useEffect, useState } from 'react';
import axios from 'axios';

const KnowledgeBase = () => {
    const [chunks, setChunks] = useState<any[]>([]);
    const [newText, setNewText] = useState('');
    const [loading, setLoading] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    const token = localStorage.getItem('token');
    // Use default instance which already has baseURL configured in main.tsx
    const api = axios.create({
        headers: { Authorization: `Bearer ${token}` }
    });

    useEffect(() => {
        fetchChunks();
    }, []);

    const fetchChunks = async () => {
        try {
            const { data } = await api.get('/knowledge');
            setChunks(data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newText) return;
        setLoading(true);
        try {
            if (editingId) {
                // Update existing
                await api.put(`/knowledge/${editingId}`, { text: newText });
                alert('Content updated successfully!');
                setEditingId(null);
            } else {
                // Add new
                await api.post('/knowledge', { text: newText, source: 'admin-manual' });
                alert('Content added successfully!');
            }
            setNewText('');
            // Fetch silently so if it fails it doesn't scare the user
            fetchChunks().catch(console.error);
        } catch (err: any) {
            console.error(err);
            const msg = err.response?.data?.error || err.message || 'Failed to add/update content';
            alert(`Error: ${msg}`);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (chunk: any) => {
        setNewText(chunk.content);
        setEditingId(chunk._id);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancelEdit = () => {
        setNewText('');
        setEditingId(null);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure?')) return;
        try {
            await api.delete(`/knowledge/${id}`);
            fetchChunks();
        } catch (err) {
            alert('Failed to delete');
        }
    };

    return (
        <div>
            <h1>Knowledge Base</h1>
            <p>Manage the content your AI chatbot learns from.</p>

            <div style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', marginBottom: '2rem', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                <h3>{editingId ? 'Edit Content' : 'Add New Content'}</h3>
                <form onSubmit={handleAdd}>
                    <textarea
                        value={newText}
                        onChange={(e) => setNewText(e.target.value)}
                        placeholder="Paste text, FAQs, or information here..."
                        style={{ width: '100%', height: '100px', padding: '10px', marginBottom: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
                    />
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button disabled={loading} style={{ background: '#28a745', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '4px', cursor: 'pointer' }}>
                            {loading ? (editingId ? 'Updating...' : 'Training...') : (editingId ? 'Update Content' : 'Add & Train')}
                        </button>
                        {editingId && (
                            <button type="button" onClick={handleCancelEdit} style={{ background: '#6c757d', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '4px', cursor: 'pointer' }}>
                                Cancel
                            </button>
                        )}
                    </div>
                </form>
            </div>

            <div style={{ display: 'grid', gap: '1rem' }}>
                {chunks.map((chunk) => (
                    <div key={chunk._id} style={{ background: 'white', padding: '1rem', borderRadius: '8px', borderLeft: '4px solid #007bff', display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                        <div>
                            <p style={{ margin: '0 0 5px 0', fontSize: '14px', color: '#666' }}>Source: {chunk.metadata?.source || 'Manual'}</p>
                            <p style={{ margin: 0 }}>{chunk.content.substring(0, 200)}...</p>
                        </div>
                        <div style={{ display: 'flex', gap: '5px' }}>
                            <button onClick={() => handleEdit(chunk)} style={{ background: '#ffc107', color: '#000', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}>Edit</button>
                            <button onClick={() => handleDelete(chunk._id)} style={{ background: '#dc3545', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}>Delete</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default KnowledgeBase;
