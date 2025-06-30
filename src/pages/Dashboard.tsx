import React from 'react';
import { useProblems } from '../contexts/ProblemContext';
import { 
  CheckCircle, 
  Clock, 
  XCircle, 
  PlayCircle,
  TrendingUp,
  Calendar,
  Target
} from 'lucide-react';
import { format } from 'date-fns';
import {
  BarChart,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar,
  ResponsiveContainer,
  LabelList,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';
import { supabase } from '../lib/supabase'; // adjust path as needed
import ReactQuill from 'react-quill';

const Dashboard: React.FC = () => {
  const { state } = useProblems();
  const { stats, problems } = state;

  const recentProblems = problems
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'text-success-600 bg-success-100';
      case 'Medium': return 'text-warning-600 bg-warning-100';
      case 'Hard': return 'text-error-600 bg-error-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Completed': return <CheckCircle className="w-4 h-4 text-success-600" />;
      case 'In Progress': return <PlayCircle className="w-4 h-4 text-warning-600" />;
      case 'Failed': return <XCircle className="w-4 h-4 text-error-600" />;
      default: return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const completionRate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  // Prepare data for category bar chart
  const categoryData = Object.entries(stats.categories).map(([category, catStats]) => ({
    category,
    Completed: catStats.completed,
    Remaining: catStats.total - catStats.completed,
    Total: catStats.total
  }));

  // Color palette for pie chart
  const pieColors = [
    '#34d399', // green
    '#60a5fa', // blue
    '#fbbf24', // yellow
    '#f87171', // red
    '#a78bfa', // purple
    '#f472b6', // pink
    '#38bdf8', // sky
    '#facc15', // amber
    '#4ade80', // emerald
    '#f472b6', // rose
  ];

  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['link', 'image'],
      ['clean']
    ],
    // Custom image handler
    handlers: {
      image: function () {
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
        input.click();
        input.onchange = async () => {
          if (!input.files || input.files.length === 0) return;
          const file = input.files[0];
          if (file) {
            // Upload to Supabase Storage
            const { data, error } = await supabase.storage
              .from('problem-images')
              .upload(`public/${Date.now()}-${file.name}`, file, { upsert: true });
            if (error) {
              alert('Upload failed');
              return;
            }
            // Get public URL
            const { data: urlData } = supabase
              .storage
              .from('problem-images')
              .getPublicUrl(data.path);
            const url = urlData.publicUrl;
            // Insert image into editor
            const quill = (this as any).quill;
            const range = quill.getSelection();
            quill.insertEmbed(range.index, 'image', url);
          }
        };
      }
    }
  };

  // Timeline data: count of problems completed per day
  const completedTimeline: { date: string; count: number }[] = React.useMemo(() => {
    const counts: Record<string, number> = {};
    problems.forEach((p) => {
      if (p.status === 'Completed' && p.completedAt) {
        // Format date as yyyy-MM-dd
        const date = format(new Date(p.completedAt), 'yyyy-MM-dd');
        counts[date] = (counts[date] || 0) + 1;
      }
    });
    // Sort by date ascending
    return Object.entries(counts)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, count]) => ({ date, count }));
  }, [problems]);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Track your LeetCode progress and achievements</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card p-6">
          <div className="flex items-center">
            <div className="p-2 bg-primary-100 rounded-lg">
              <Target className="w-6 h-6 text-primary-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Problems</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center">
            <div className="p-2 bg-success-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-success-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900">{stats.completed}</p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center">
            <div className="p-2 bg-warning-100 rounded-lg">
              <PlayCircle className="w-6 h-6 text-warning-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">In Progress</p>
              <p className="text-2xl font-bold text-gray-900">{stats.inProgress}</p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center">
            <div className="p-2 bg-primary-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-primary-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completion Rate</p>
              <p className="text-2xl font-bold text-gray-900">{completionRate}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Difficulty Progress */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Progress by Difficulty</h3>
          <div className="space-y-4">
            {[
              { difficulty: 'Easy', stats: stats.easy, color: 'bg-success-500' },
              { difficulty: 'Medium', stats: stats.medium, color: 'bg-warning-500' },
              { difficulty: 'Hard', stats: stats.hard, color: 'bg-error-500' },
            ].map(({ difficulty, stats, color }) => (
              <div key={difficulty}>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium text-gray-700">{difficulty}</span>
                  <span className="text-gray-500">
                    {stats.completed}/{stats.total}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${color}`}
                    style={{
                      width: stats.total > 0 ? `${(stats.completed / stats.total) * 100}%` : '0%'
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Category Progress as Pie Chart */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Progress by Category</h3>
          {categoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  dataKey="Completed"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={({ category, Completed }) => `${category}: ${Completed}`}
                >
                  {categoryData.map((entry, idx) => (
                    <Cell key={`cell-${idx}`} fill={pieColors[idx % pieColors.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value, name, props) => [`${value} completed`, '']} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-500 text-sm">No problems added yet</p>
          )}
        </div>
      </div>

      {/* Timeline of Completed Problems */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Problems Completed Per Day</h3>
        {completedTimeline.length > 0 ? (
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={completedTimeline} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
              <Tooltip formatter={(value) => [`${value} problems`, 'Completed']} />
              <Legend />
              <Line type="monotone" dataKey="count" stroke="#34d399" strokeWidth={3} dot={{ r: 4 }} name="Completed" />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-gray-500 text-sm">No problems completed yet</p>
        )}
      </div>

      {/* Recent Activity */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {recentProblems.length > 0 ? (
            recentProblems.map((problem) => (
              <div key={problem.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  {getStatusIcon(problem.status)}
                  <div>
                    <h4 className="font-medium text-gray-900">{problem.title}</h4>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(problem.difficulty)}`}>
                        {problem.difficulty}
                      </span>
                      <span className="text-sm text-gray-500">{problem.category}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">
                    {format(new Date(problem.updatedAt), 'MMM d, yyyy')}
                  </p>
                  <p className="text-xs text-gray-400">
                    {format(new Date(problem.updatedAt), 'h:mm a')}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No recent activity</p>
              <p className="text-sm text-gray-400">Start by adding your first problem</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 