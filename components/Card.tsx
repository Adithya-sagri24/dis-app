
import React from 'react';
import { Decision } from '../types';
import { Button } from './Button';

interface CardProps {
  decision: Decision;
  onDecide: (choice: string) => void;
}

export const Card: React.FC<CardProps> = ({ decision, onDecide }) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-2xl w-full max-w-md transition-all duration-300 hover:shadow-purple-500/20">
      <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800 dark:text-gray-200">
        {decision.question}
      </h2>
      <div className="space-y-4">
        <Button onClick={() => onDecide(decision.optionA)}>
          {decision.optionA}
        </Button>
        <div className="flex items-center text-center">
            <hr className="flex-grow border-gray-300 dark:border-gray-600" />
            <span className="px-4 text-gray-500 dark:text-gray-400 font-medium">OR</span>
            <hr className="flex-grow border-gray-300 dark:border-gray-600" />
        </div>
        <Button 
          onClick={() => onDecide(decision.optionB)} 
          className="bg-pink-600 hover:bg-pink-700 focus:ring-pink-300"
        >
          {decision.optionB}
        </Button>
      </div>
    </div>
  );
};
