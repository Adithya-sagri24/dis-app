import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Task } from '../types';
import { Button } from '../components/ui/Button';
import { useAuth } from '../hooks/useAuth';
import { Header } from '../components/ui/Header';
import { IconButton } from '../components/ui/IconButton';

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

// --- Helper Functions for Dates ---
const isOverdue = (dueDate: string, isCompleted: boolean): boolean => {
    if (isCompleted || !dueDate) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Compare date part only

    // Parse 'YYYY-MM-DD' to avoid timezone issues with `new Date(string)`
    const parts = dueDate.split('-').map(p => parseInt(p, 10));
    const due = new Date(parts[0], parts[1] - 1, parts[2]);

    return due < today;
};

const formatDueDate = (dueDate: string): string => {
    const parts = dueDate.split('-').map(p => parseInt(p, 10));
    const date = new Date(parts[0], parts[1] - 1, parts[2]);
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
};


export const TaskManagerPage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newDueDate, setNewDueDate] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    setError(null);
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      setError(error.message);
    } else if (data) {
      setTasks(data);
    }
    setLoading(false);
  }, [isAuthenticated]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newTaskTitle.trim() === '' || !user) return;

    const { data, error } = await supabase
      .from('tasks')
      .insert({ 
          title: newTaskTitle, 
          user_id: user.id,
          due_date: newDueDate || null 
      })
      .select()
      .single();

    if (error) {
      setError(error.message);
    } else if (data) {
      setTasks([data, ...tasks]);
      setNewTaskTitle('');
      setNewDueDate('');
    }
  };
  
  const handleDeleteTask = async (id: number) => {
    const originalTasks = tasks;
    // Optimistically remove from UI
    setTasks(tasks.filter((task) => task.id !== id));

    const { error } = await supabase.from('tasks').delete().eq('id', id);

    if (error) {
      setError(error.message);
      // If error, revert the change
      setTasks(originalTasks);
    }
  };

  const handleToggleTask = async (id: number, is_completed: boolean) => {
    // Optimistically update UI
    setTasks(tasks.map(task => task.id === id ? {...task, is_completed: !is_completed} : task));

    const { error } = await supabase
        .from('tasks')
        .update({ is_completed: !is_completed })
        .eq('id', id);
    
    if (error) {
        setError(error.message);
        // If error, revert by re-fetching
        fetchTasks();
    }
  }

  return (
    <div className="w-full max-w-3xl mx-auto animate-fade-in">
        <Header title="Manage Your Tasks" subtitle="Stay organized and productive." />

        <main>
          <form onSubmit={handleAddTask} className="mb-8 p-4 bg-white dark:bg-gray-800 rounded-2xl shadow-lg flex flex-wrap sm:flex-nowrap gap-3">
            <input
              type="text"
              placeholder="Add a new task..."
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              className="flex-grow px-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-auto"
              aria-label="New task title"
            />
            <input
                type="date"
                value={newDueDate}
                onChange={(e) => setNewDueDate(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-500 dark:text-gray-400"
                aria-label="Due date"
            />
            <Button onClick={handleAddTask} className="w-full sm:w-auto px-6" disabled={!newTaskTitle.trim()}>
                Add
            </Button>
          </form>

          {loading && <p className="text-center text-gray-500 dark:text-gray-400">Loading tasks...</p>}
          {error && <p className="text-center text-red-500">{error}</p>}
          
          <div className="space-y-4">
            {!loading && tasks.length === 0 && (
                <div className="text-center py-10 px-4 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
                    <p className="text-gray-500 dark:text-gray-400">You have no tasks yet. Add one above to get started!</p>
                </div>
            )}
            {tasks.map((task) => (
              <div key={task.id} className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md flex justify-between items-center transition-transform hover:scale-[1.02]">
                <div className="flex items-center flex-grow mr-4">
                    <input
                        type="checkbox"
                        id={`task-${task.id}`}
                        checked={task.is_completed}
                        onChange={() => handleToggleTask(task.id, task.is_completed)}
                        className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-3 cursor-pointer flex-shrink-0"
                    />
                    <label 
                        htmlFor={`task-${task.id}`}
                        className={`flex-grow text-gray-800 dark:text-gray-200 cursor-pointer ${task.is_completed ? 'line-through text-gray-500 dark:text-gray-400' : ''}`}
                    >
                        {task.title}
                    </label>
                </div>
                <div className="flex items-center flex-shrink-0">
                    {task.due_date && (
                        <span className={`text-sm mr-4 flex items-center ${
                            isOverdue(task.due_date, task.is_completed) 
                            ? 'text-red-500 dark:text-red-400 font-semibold' 
                            : 'text-gray-500 dark:text-gray-400'
                        }`}>
                            <CalendarIcon />
                            {formatDueDate(task.due_date)}
                        </span>
                    )}
                    <IconButton onClick={() => handleDeleteTask(task.id)} aria-label="Delete task" className="text-red-500 hover:bg-red-100 dark:hover:bg-red-900/50">
                        <TrashIcon />
                    </IconButton>
                </div>
              </div>
            ))}
          </div>
        </main>
    </div>
  );
};