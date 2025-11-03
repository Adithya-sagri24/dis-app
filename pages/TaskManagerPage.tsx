import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Task } from '../types';
import { Button } from '../components/ui/Button';
import { useAuth } from '../hooks/useAuth';
import { Header } from '../components/ui/Header';
import { IconButton } from '../components/ui/IconButton';
import { motion, AnimatePresence } from 'framer-motion';

const TrashIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
);

const CalendarIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
);

const PlusIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
    </svg>
);


// --- Helper Functions for Dates ---
const isOverdue = (dueDate: string, isCompleted: boolean): boolean => {
    if (isCompleted || !dueDate) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0); 
    const parts = dueDate.split('-').map(p => parseInt(p, 10));
    const due = new Date(parts[0], parts[1] - 1, parts[2]);
    return due < today;
};

const formatDueDate = (dueDate: string): string => {
    const parts = dueDate.split('-').map(p => parseInt(p, 10));
    const date = new Date(parts[0], parts[1] - 1, parts[2]);
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
};

const TaskFormModal: React.FC<{ onClose: () => void, onTaskAdded: (task: Task) => void }> = ({ onClose, onTaskAdded }) => {
    const { user } = useAuth();
    const [title, setTitle] = useState('');
    const [dueDate, setDueDate] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (title.trim() === '' || !user) return;

        const { data, error } = await supabase
            .from('tasks')
            .insert({ title, user_id: user.id, due_date: dueDate || null })
            .select()
            .single();

        if (data) onTaskAdded(data);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50" onClick={onClose}>
            <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-md p-6 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl"
            >
                <h2 className="text-xl font-bold mb-4">Add New Task</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        placeholder="Task title..."
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full px-4 py-2 border border-white/20 rounded-lg bg-white/10 placeholder-gray-300 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                        autoFocus
                    />
                    <input
                        type="date"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        className="w-full px-4 py-2 border border-white/20 rounded-lg bg-white/10 text-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                    />
                    <div className="flex justify-end gap-4 pt-2">
                        <Button onClick={onClose} className="w-auto px-6 !bg-transparent hover:!bg-white/10 border border-white/20">Cancel</Button>
                        <Button onClick={handleSubmit} className="w-auto px-6" disabled={!title.trim()}>Add Task</Button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export const TaskManagerPage: React.FC = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchTasks = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('is_completed', { ascending: true })
      .order('created_at', { ascending: false });

    if (error) setError(error.message);
    else if (data) setTasks(data);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);
  
  const handleDeleteTask = async (id: number) => {
    const originalTasks = tasks;
    setTasks(tasks.filter((task) => task.id !== id));
    const { error } = await supabase.from('tasks').delete().eq('id', id);
    if (error) {
      setError(error.message);
      setTasks(originalTasks);
    }
  };

  const handleToggleTask = async (id: number, is_completed: boolean) => {
    setTasks(tasks.map(task => task.id === id ? {...task, is_completed: !is_completed} : task));
    const { error } = await supabase
        .from('tasks')
        .update({ is_completed: !is_completed })
        .eq('id', id);
    if (error) {
        setError(error.message);
        fetchTasks();
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto animate-fade-in relative">
        <Header title="Manage Your Tasks" subtitle="Stay organized and productive." />

        <main className="mt-8">
          {loading && <p className="text-center text-gray-300">Loading tasks...</p>}
          {error && <p className="text-center text-red-400">{error}</p>}
          
          <AnimatePresence>
            {!loading && tasks.length === 0 && (
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-10 px-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl"
                >
                    <p className="text-gray-200">You have no tasks yet. Add one to get started!</p>
                </motion.div>
            )}
            <motion.div layout className="space-y-4">
                {tasks.map((task, index) => (
                <motion.div 
                    key={task.id} 
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0, transition: { delay: index * 0.05 } }}
                    exit={{ opacity: 0, x: -50 }}
                    className="bg-white/10 backdrop-blur-xl border border-white/20 p-4 rounded-2xl shadow-lg flex justify-between items-center transition-shadow hover:shadow-cyan-500/10"
                >
                    <div className="flex items-center flex-grow mr-4">
                        <input
                            type="checkbox"
                            id={`task-${task.id}`}
                            checked={task.is_completed}
                            onChange={() => handleToggleTask(task.id, task.is_completed)}
                            className="h-6 w-6 rounded-md border-gray-400 bg-transparent text-cyan-400 focus:ring-cyan-400 focus:ring-offset-0 mr-4 cursor-pointer flex-shrink-0"
                        />
                        <label 
                            htmlFor={`task-${task.id}`}
                            className={`flex-grow text-gray-100 cursor-pointer ${task.is_completed ? 'line-through text-gray-400' : ''}`}
                        >
                            {task.title}
                        </label>
                    </div>
                    <div className="flex items-center flex-shrink-0">
                        {task.due_date && (
                            <span className={`text-sm mr-4 flex items-center ${
                                isOverdue(task.due_date, task.is_completed) 
                                ? 'text-red-400 font-semibold' 
                                : 'text-gray-300'
                            }`}>
                                <CalendarIcon />
                                {formatDueDate(task.due_date)}
                            </span>
                        )}
                        <IconButton onClick={() => handleDeleteTask(task.id)} aria-label="Delete task" className="text-red-400 hover:!bg-red-500/20">
                            <TrashIcon />
                        </IconButton>
                    </div>
                </motion.div>
                ))}
            </motion.div>
          </AnimatePresence>
        </main>

        <motion.div
            className="fixed bottom-8 right-8 z-30"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
        >
            <IconButton onClick={() => setIsModalOpen(true)} aria-label="Add new task" className="!p-4 !rounded-2xl bg-cyan-500 hover:!bg-cyan-600 !text-white !shadow-2xl shadow-cyan-500/50">
                <PlusIcon />
            </IconButton>
        </motion.div>

        <AnimatePresence>
            {isModalOpen && <TaskFormModal onClose={() => setIsModalOpen(false)} onTaskAdded={(task) => setTasks(prev => [task, ...prev])}/>}
        </AnimatePresence>
    </div>
  );
};