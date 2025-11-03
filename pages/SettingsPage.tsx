import React from 'react';
import { useAppStore } from '../store/useAppStore';
import { useTimerStore } from '../store/useTimerStore';
import { Header } from '../components/ui/Header';
import { Button } from '../components/ui/Button';

const SettingsCard: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="mt-8 p-6 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl max-w-2xl">
        <h2 className="text-xl font-semibold mb-4 text-gray-100">{title}</h2>
        {children}
    </div>
);

const DurationInput: React.FC<{ label: string; value: number; onChange: (value: number) => void }> = ({ label, value, onChange }) => (
    <div className="flex items-center justify-between p-4 border border-white/10 rounded-lg">
        <label className="font-medium text-gray-200">{label} (minutes)</label>
        <input 
            type="number"
            min="1"
            max="120"
            value={value / 60}
            onChange={(e) => onChange(parseInt(e.target.value) * 60)}
            className="w-20 px-3 py-1 border border-white/20 rounded-lg bg-white/10 placeholder-gray-300 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
        />
    </div>
);

export const SettingsPage: React.FC = () => {
    const { logMoodData, setLogMoodData, spotifyUser, disconnectSpotify } = useAppStore();
    const { durations, setDurations } = useTimerStore();

    return (
        <div className="animate-fade-in">
            <Header title="Settings" subtitle="Manage your account and application settings." />
            
            <SettingsCard title="Pomodoro Timer">
                <div className="space-y-3">
                    <DurationInput label="Focus" value={durations.focus} onChange={val => setDurations({ focus: val })} />
                    <DurationInput label="Short Break" value={durations.shortBreak} onChange={val => setDurations({ shortBreak: val })} />
                    <DurationInput label="Long Break" value={durations.longBreak} onChange={val => setDurations({ longBreak: val })} />
                </div>
            </SettingsCard>

            <SettingsCard title="Privacy Settings">
                <div className="flex items-center justify-between p-4 border border-white/10 rounded-lg">
                    <div>
                        <label htmlFor="mood-logging" className="font-medium text-gray-200">Enable Mood Logging</label>
                        <p className="text-sm text-gray-400">
                            Allow the application to save your mood data for analytics.
                        </p>
                    </div>
                    <label htmlFor="mood-logging" className="relative inline-flex items-center cursor-pointer">
                        <input 
                            type="checkbox" 
                            id="mood-logging" 
                            className="sr-only peer"
                            checked={logMoodData}
                            onChange={(e) => setLogMoodData(e.target.checked)}
                        />
                        <div className="w-11 h-6 bg-gray-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-600 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
                    </label>
                </div>
                <div className="mt-6">
                    <a href="#/privacy" className="text-cyan-400 hover:underline">
                        View our full Privacy Policy
                    </a>
                </div>
            </SettingsCard>

            <SettingsCard title="Connected Services">
                {spotifyUser ? (
                    <div className="flex items-center justify-between p-4 border border-white/10 rounded-lg">
                        <div>
                            <p className="font-medium text-gray-200">Spotify</p>
                            <p className="text-sm text-gray-400">
                                Connected as {spotifyUser.display_name}
                            </p>
                        </div>
                        <Button onClick={disconnectSpotify} className="w-auto px-4 py-2 text-sm !bg-red-600 hover:!bg-red-700 focus:!ring-red-400">
                            Disconnect
                        </Button>
                    </div>
                ) : (
                    <p className="text-gray-300">
                        Spotify is not connected. Connect it from the <a href="#/mood" className="text-cyan-400 hover:underline">Mood</a> page.
                    </p>
                )}
            </SettingsCard>
        </div>
    );
};