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

        {/* Category Progress */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Progress by Category</h3>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {Object.entries(stats.categories).map(([category, categoryStats]) => (
              <div key={category} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 truncate flex-1">
                  {category}
                </span>
                <span className="text-sm text-gray-500 ml-2">
                  {categoryStats.completed}/{categoryStats.total}
                </span>
              </div>
            ))}
            {Object.keys(stats.categories).length === 0 && (
              <p className="text-gray-500 text-sm">No problems added yet</p>
            )}
          </div>
        </div>
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