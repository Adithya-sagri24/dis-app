import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../hooks/useAuth';
import { Task } from '../types';

export const TaskSummary: React.FC = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('is_completed', { ascending: true })
      .order('created_at', { ascending: false })
      .limit(3);
    
    if (data) setTasks(data);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return (
    <div className="p-6 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl">
      <h3 className="text-xl font-semibold text-gray-100 mb-4">
        Recent Tasks
      </h3>
      {loading && <p className="text-sm text-gray-300">Loading...</p>}
      {!loading && tasks.length === 0 && <p className="text-sm text-gray-300">No tasks yet.</p>}
      
      <div className="space-y-3">
        {tasks.map(task => (
            <div key={task.id} className="bg-white/5 p-3 rounded-lg flex items-center">
                <input 
                  type="checkbox" 
                  checked={task.is_completed} 
                  readOnly 
                  className="h-4 w-4 rounded border-gray-400 bg-transparent text-cyan-400 focus:ring-cyan-400 focus:ring-offset-0 mr-3 cursor-default" 
                />
                <span className={`flex-grow text-gray-200 ${task.is_completed ? 'line-through text-gray-400' : ''}`}>
                    {task.title}
                </span>
            </div>
        ))}
      </div>
      
      <a href="#/tasks" className="block text-center mt-4 text-cyan-400 hover:underline font-medium text-sm">
        View All Tasks &rarr;
      </a>
    </div>
  );
};