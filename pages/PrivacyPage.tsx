import React from 'react';
import { Header } from '../components/ui/Header';

export const PrivacyPage: React.FC = () => {
    return (
        <div className="animate-fade-in">
            <Header title="Privacy Policy" subtitle="Your privacy is important to us." />
            
            <div className="mt-8 p-8 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl max-w-3xl prose prose-invert prose-p:text-gray-300 prose-headings:text-white prose-strong:text-white prose-a:text-cyan-400 hover:prose-a:text-cyan-300">
                <h2>Our Commitment</h2>
                <p>We are committed to protecting your privacy. This policy explains what data we collect, why we collect it, and how we handle it.</p>

                <h2>Emotion Detection</h2>
                <ul>
                    <li><strong>Local Processing:</strong> All emotion detection, including access to your camera and analysis of facial expressions, happens <strong>entirely within your browser</strong> on your device.</li>
                    <li><strong>No Video/Image Storage:</strong> Your camera feed is processed in real-time and is never stored or sent to our servers. No images or videos of you ever leave your computer.</li>
                </ul>

                <h2>Data We Store</h2>
                <p>When you use this application and are logged in, we store the following information in our secure database (Supabase):</p>
                <ul>
                    <li><strong>Account Information:</strong> Your email and a unique user ID, provided when you sign up.</li>
                    <li><strong>Tasks:</strong> The tasks you create in the task manager.</li>
                    <li><strong>Mood Data (Optional):</strong> If you choose to enable mood logging (in Settings), we store the numerical results of the emotion detection. This includes:
                        <ul>
                            <li>A timestamp of when the data was recorded.</li>
                            <li>The dominant emotion detected (e.g., "happy").</li>
                            <li>A numerical "valence" score (pleasantness).</li>
                            <li>A numerical "energy" score (arousal).</li>
                        </ul>
                    </li>
                </ul>
                 <p>This stored mood data is used solely to provide you with the analytics features within this application, such as your weekly summary chart. It is never shared with third parties.</p>

                <h2>Your Control</h2>
                <p>You have full control over your data. You can:</p>
                <ul>
                    <li><strong>Opt-Out:</strong> Disable mood data logging at any time from the <a href="#/settings">Settings</a> page.</li>
                    <li><strong>Export:</strong> Download all of your stored mood data in a CSV format from the <a href="#/analytics">Analytics</a> page.</li>
                    <li><strong>Delete:</strong> To delete your account and all associated data, please contact support (this is a demo app, so no email is provided).</li>
                </ul>

                 <h2>Changes to This Policy</h2>
                <p>We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page.</p>

            </div>
        </div>
    );
};