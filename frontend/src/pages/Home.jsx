import { useState, useEffect } from 'react';
import { API_ENDPOINTS } from '../config/api';
import * as Icons from 'lucide-react';

const Icon = ({ name, ...props }) => {
  const LucideIcon = Icons?.[name] || Icons.HelpCircle;
  return <LucideIcon {...props} />;
};

export default function Home() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('All');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await fetch(API_ENDPOINTS.GET_TASKS());
      const data = await res.json();
      if (data.success) setTasks(data.data);
      else setError(data.message);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    try {
      const res = await fetch(API_ENDPOINTS.POST_TASKS(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: title.trim(), description: description.trim() }),
      });
      const data = await res.json();
      if (data.success) {
        setTasks(prev => [data.data, ...prev]);
        setTitle('');
        setDescription('');
      } else setError(data.message);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleToggle = async (id) => {
    try {
      const res = await fetch(API_ENDPOINTS.PATCH_TASKS_ID_TOGGLE(id), { method: 'PATCH' });
      const data = await res.json();
      if (data.success) {
        setTasks(prev => prev.map(t => t.id === id ? data.data : t));
      } else setError(data.message);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(API_ENDPOINTS.DELETE_TASKS_ID(id), { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setTasks(prev => prev.filter(t => t.id !== id));
      } else setError(data.message);
    } catch (err) {
      setError(err.message);
    }
  };

  const filteredTasks = tasks.filter(t => {
    if (filter === 'Active') return !t.completed;
    if (filter === 'Completed') return t.completed;
    return true;
  });

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
      <div className="animate-spin w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full" />
    </div>
  );

  if (error) return (
    <div className="text-center py-12 text-red-500">{error}</div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
      <div className="container mx-auto px-4 md:px-6 py-12 md:py-24">
        {/* Hero */}
        <section className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-cyan-500 mb-4">TaskFlow</h1>
          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto">Your minimalist space to focus, create, and complete.</p>
        </section>

        {/* Input Form */}
        <section className="max-w-2xl mx-auto mb-12">
          <form onSubmit={handleCreate} className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 shadow-soft">
            <input
              type="text"
              placeholder="What needs to be done?"
              value={title}
              onChange={e => setTitle(e.target.value.slice(0, 100))}
              className="w-full text-lg md:text-xl font-medium bg-transparent border-b border-slate-200 focus:border-indigo-500 outline-none pb-2 mb-4"
              required
            />
            <textarea
              placeholder="Add a note (optional)"
              value={description}
              onChange={e => setDescription(e.target.value.slice(0, 500))}
              className="w-full text-sm md:text-base bg-transparent border-b border-slate-200 focus:border-indigo-500 outline-none pb-2 mb-4 resize-none h-20"
            />
            <button
              type="submit"
              className="px-6 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 active:scale-95 transition-all duration-300 shadow-soft"
            >
              Add Task
            </button>
          </form>
        </section>

        {/* Filter Buttons */}
        <section className="flex items-center justify-center gap-3 mb-10">
          {['All', 'Active', 'Completed'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                filter === f
                  ? 'bg-indigo-600 text-white shadow-soft'
                  : 'bg-white/60 text-slate-700 hover:bg-white'
              }`}
            >
              {f}
            </button>
          ))}
        </section>

        {/* Task List */}
        <section className="max-w-3xl mx-auto">
          {filteredTasks.length === 0 ? (
            <div className="text-center py-16">
              <img
                src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=300&fit=crop&auto=format"
                alt="Empty state"
                className="w-64 mx-auto mb-6 rounded-2xl shadow-soft"
                onError={e => {
                  e.target.onerror = null;
                  e.target.src = 'https://placehold.co/400x300/1a1a2e/eaeaea?text=No+Tasks';
                }}
              />
              <h3 className="text-xl font-semibold text-slate-800 mb-2">No tasks yet</h3>
              <p className="text-slate-500">Add your first task above to get started.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredTasks.map(task => (
                <div
                  key={task.id}
                  className="bg-white/60 backdrop-blur-xl rounded-2xl p-4 shadow-soft flex items-start gap-4 transition-all duration-300 hover:shadow-lg"
                >
                  <button
                    onClick={() => handleToggle(task.id)}
                    className={`mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                      task.completed
                        ? 'bg-emerald-500 border-emerald-500'
                        : 'border-slate-300 hover:border-indigo-500'
                    }`}
                  >
                    {task.completed && <Icon name="Check" className="w-3 h-3 text-white" />}
                  </button>
                  <div className="flex-1">
                    <h4 className={`font-semibold text-slate-800 ${task.completed ? 'line-through opacity-50' : ''}`}>
                      {task.title}
                    </h4>
                    {task.description && (
                      <p className={`text-sm text-slate-500 mt-1 ${task.completed ? 'line-through opacity-50' : ''}`}>
                        {task.description}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => handleDelete(task.id)}
                    className="text-slate-400 hover:text-red-500 transition-colors duration-300"
                  >
                    <Icon name="Trash2" className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}