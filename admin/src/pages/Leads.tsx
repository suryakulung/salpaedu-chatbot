import { useEffect, useState } from 'react';
import axios from 'axios';

const Leads = () => {
    const [leads, setLeads] = useState<any[]>([]);

    useEffect(() => {
        const fetchLeads = async () => {
            const token = localStorage.getItem('token');
            try {
                const { data } = await axios.get('/api/leads', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setLeads(data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchLeads();
    }, []);

    const downloadCSV = () => {
        const headers = ["Name", "Email", "Phone", "Interest", "Date"];
        const rows = leads.map(l => [l.name, l.email, l.phone, l.subjectInterest, new Date(l.createdAt).toLocaleDateString()]);

        const csvContent = "data:text/csv;charset=utf-8,"
            + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "leads.csv");
        document.body.appendChild(link);
        link.click();
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1>Leads</h1>
                <button onClick={downloadCSV} style={{ background: '#007bff', color: 'white', border: 'none', padding: '10px', borderRadius: '4px', cursor: 'pointer' }}>Export CSV</button>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem', background: 'white' }}>
                <thead>
                    <tr style={{ background: '#eee', textAlign: 'left' }}>
                        <th style={thStyle}>Name</th>
                        <th style={thStyle}>Email</th>
                        <th style={thStyle}>Phone</th>
                        <th style={thStyle}>Interest</th>
                        <th style={thStyle}>Date</th>
                    </tr>
                </thead>
                <tbody>
                    {leads.map(lead => (
                        <tr key={lead._id} style={{ borderBottom: '1px solid #ddd' }}>
                            <td style={tdStyle}>{lead.name || '-'}</td>
                            <td style={tdStyle}>{lead.email || '-'}</td>
                            <td style={tdStyle}>{lead.phone || '-'}</td>
                            <td style={tdStyle}>{lead.subjectInterest || '-'}</td>
                            <td style={tdStyle}>{new Date(lead.createdAt).toLocaleDateString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

const thStyle = { padding: '12px', borderBottom: '2px solid #ddd' };
const tdStyle = { padding: '12px' };

export default Leads;
