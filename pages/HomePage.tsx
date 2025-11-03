import React, { useState } from 'react';
import { Card } from '../components/Card';
import { Decision } from '../types';
import { Header } from '../components/ui/Header';
import { motion, AnimatePresence } from 'framer-motion';

// Mock decision data, as the original source isn't specified.
const initialDecision: Decision = {
  question: 'What should you focus on this afternoon?',
  optionA: 'Finish the project report',
  optionB: 'Organize your email inbox',
};

export const HomePage: React.FC = () => {
  const [decision, setDecision] = useState<Decision>(initialDecision);
  const [choice, setChoice] = useState<string | null>(null);

  const handleDecide = (selectedOption: string) => {
    setChoice(selectedOption);
  };
  
  const handleReset = () => {
    setChoice(null);
  }

  return (
    <div className="w-full h-full flex flex-col items-center justify-center animate-fade-in text-center p-4">
        <Header title="You Decide" subtitle="Make a choice and move forward." />
        
        <div className="mt-10 flex items-center justify-center w-full">
            <AnimatePresence mode="wait">
            {!choice ? (
                <motion.div
                    key="card"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                >
                    <Card decision={decision} onDecide={handleDecide} />
                </motion.div>
            ) : (
                <motion.div
                    key="result"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    className="bg-slate-800 p-8 rounded-xl shadow-2xl w-full max-w-md"
                >
                    <h2 className="text-xl font-semibold text-gray-300 mb-4">You decided to:</h2>
                    <p className="text-3xl font-bold text-white bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-pink-500">
                        {choice}
                    </p>
                    <button 
                        onClick={handleReset}
                        className="mt-8 w-full text-white font-bold py-3 px-4 rounded-lg shadow-md transition-transform transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-opacity-50 bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-300"
                    >
                        Make Another Decision
                    </button>
                </motion.div>
            )}
            </AnimatePresence>
        </div>
    </div>
  );
};