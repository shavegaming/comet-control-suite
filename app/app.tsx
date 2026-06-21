'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

export default function Dashboard() {
    const [players, setPlayers] = useState([]);
    const [status, setStatus] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            const [p, s] = await Promise.all([api.get('/players'), api.get('/status')]);
            setPlayers(p); setStatus(s);
        };
        fetchData();
        const interval = setInterval(fetchData, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-cyan-400">Server Control</h2>
            <div className="grid grid-cols-3 gap-4">
                <div className="bg-gray-900 p-4 rounded border border-cyan-900/30">
                    <p className="text-gray-400">Status</p>
                    <p className="text-xl font-bold text-green-400">{status.online ? 'Online' : 'Offline'}</p>
                </div>
                <div className="bg-gray-900 p-4 rounded border border-cyan-900/30">
                    <p className="text-gray-400">Players</p>
                    <p className="text-xl font-bold">{players.length}</p>
                </div>
                <div className="bg-gray-900 p-4 rounded border border-cyan-900/30">
                    <p className="text-gray-400">Queue Size</p>
                    <p className="text-xl font-bold">{status.queueSize || 0}</p>
                </div>
            </div>
            
            <div className="bg-gray-900 p-6 rounded border border-cyan-900/30">
                <h3 className="text-xl mb-4">Live Players</h3>
                <div className="space-y-2">
                    {players.map((p: any) => (
                        <div key={p.id} className="flex justify-between items-center bg-gray-800 p-3 rounded">
                            <span>{p.name} (ID: {p.id})</span>
                            <div className="flex gap-2">
                                <button onClick={() => api.post('/action', {action:'Kick', target:p.id})} className="px-3 py-1 bg-red-600 rounded text-sm">Kick</button>
                                <button onClick={() => api.post('/action', {action:'Ban', target:p.id})} className="px-3 py-1 bg-red-800 rounded text-sm">Ban</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
