import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../hooks/useAuth';
import { Header } from '../components/ui/Header';
import { Button } from '../components/ui/Button';
import { WeeklyMoodSummary, Mood } from '../types';

const BarChart: React.FC<{ data: WeeklyMoodSummary[] }> = ({ data }) => {
    return (
        <div className="h-64 flex justify-around items-end gap-2 p-4">
            {data.map(({ day, avg_valence, avg_energy }) => (
                <div key={day} className="flex-1 flex flex-col items-center gap-1">
                    <div className="flex items-end h-full w-full max-w-[40px] gap-1">
                        <div className="w-1/2 bg-[#7A7FFF] rounded-t" title={`Valence: ${avg_valence.toFixed(2)}`} style={{ height: `${((avg_valence + 1) / 2) * 100}%`, boxShadow: '0 0 8px #7A7FFF' }}></div>
                        <div className="w-1/2 bg-[#00E0FF] rounded-t" title={`Energy: ${avg_energy.toFixed(2)}`} style={{ height: `${((avg_energy + 1) / 2) * 100}%`, boxShadow: '0 0 8px #00E0FF' }}></div>
                    </div>
                    <p className="text-xs text-gray-300">{day.substring(0, 3)}</p>
                </div>
            ))}
        </div>
    );
};

export const AnalyticsPage: React.FC = () => {
    const { user } = useAuth();
    const [summary, setSummary] = useState<WeeklyMoodSummary[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSummary = async () => {
            if (!user) return;
            setLoading(true);
            const { data, error } = await supabase.rpc('get_weekly_mood_summary', { p_user_id: user.id });
            if (data) setSummary(data);
            if (error) console.error(error);
            setLoading(false);
        };
        fetchSummary();
    }, [user]);

    const handleExport = async () => {
        if (!user) return alert("You must be logged in to export data.");
        
        const { data, error } = await supabase
            .from('moods')
            .select('created_at,emotion,valence,energy')
            .order('created_at', { ascending: true });

        if (error) return alert(`Export failed: ${error.message}`);
        
        const headers = "timestamp,emotion,valence,energy";
        const rows = data.map(row => `${row.created_at},${row.emotion},${row.valence},${row.energy}`).join('\n');
        const csvContent = `${headers}\n${rows}`;
        
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `mood_export_${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
    };

    return (
        <div className="animate-fade-in">
            <Header title="Analytics" subtitle="Review your mood patterns and export your data." />

            <div className="mt-8 p-6 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl max-w-4xl">
                <h2 className="text-xl font-semibold mb-4 text-gray-100">Weekly Summary</h2>
                {loading ? <p className="text-gray-300">Loading summary...</p> : <BarChart data={summary} />}
                <div className="flex gap-4 mt-4 text-sm text-gray-200">
                    <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm" style={{backgroundColor: '#7A7FFF'}}></div>Valence</div>
                    <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm" style={{backgroundColor: '#00E0FF'}}></div>Energy</div>
                </div>
            </div>

             <div className="mt-8 p-6 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl max-w-4xl">
                <h2 className="text-xl font-semibold mb-2 text-gray-100">Data Export</h2>
                <p className="mb-4 text-gray-300">Download your entire mood history as a CSV file.</p>
                <Button onClick={handleExport} className="w-auto px-6">
                    Export to CSV
                </Button>
            </div>
        </div>
    );
};