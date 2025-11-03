import React from 'react';
import { useAppStore } from '../store/useAppStore';
import { Header } from '../components/ui/Header';
import { Button } from '../components/ui/Button';

export const SettingsPage: React.FC = () => {
    const { logMoodData, setLogMoodData, spotifyUser, disconnectSpotify } = useAppStore();

    const handleToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLogMoodData(e.target.checked);
    };

    return (
        <div className="animate-fade-in">
            <Header title="Settings" subtitle="Manage your account and application settings." />
            
            <div className="mt-8 p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg max-w-2xl">
                <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Privacy Settings</h2>
                <div className="flex items-center justify-between p-4 border dark:border-gray-700 rounded-lg">
                    <div>
                        <label htmlFor="mood-logging" className="font-medium text-gray-700 dark:text-gray-300">Enable Mood Logging</label>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Allow the application to save your mood data for analytics.
                        </p>
                    </div>
                    <label htmlFor="mood-logging" className="relative inline-flex items-center cursor-pointer">
                        <input 
                            type="checkbox" 
                            id="mood-logging" 
                            className="sr-only peer"
                            checked={logMoodData}
                            onChange={handleToggle}
                        />
                        <div className="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    </label>
                </div>

                <div className="mt-6">
                    <a href="#/privacy" className="text-blue-600 hover:underline dark:text-blue-400">
                        View our full Privacy Policy
                    </a>
                </div>
            </div>

            <div className="mt-8 p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg max-w-2xl">
                <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Connected Services</h2>
                {spotifyUser ? (
                    <div className="flex items-center justify-between p-4 border dark:border-gray-700 rounded-lg">
                        <div>
                            <p className="font-medium text-gray-700 dark:text-gray-300">Spotify</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Connected as {spotifyUser.display_name}
                            </p>
                        </div>
                        <Button onClick={disconnectSpotify} className="w-auto px-4 py-2 text-sm bg-red-600 hover:bg-red-700 focus:ring-red-300">
                            Disconnect
                        </Button>
                    </div>
                ) : (
                    <p className="text-gray-500 dark:text-gray-400">
                        Spotify is not connected. Connect it from the <a href="#/mood" className="text-blue-600 hover:underline dark:text-blue-400">Mood</a> page.
                    </p>
                )}
            </div>
        </div>
    );
};