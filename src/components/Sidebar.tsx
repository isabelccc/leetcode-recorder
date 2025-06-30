import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  BarChart3, 
  List, 
  Code, 
  StickyNote, 
  Plus,
  Settings,
  LogOut,
  User,
  Shield,
  Brain,
  Star
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useProblems } from '../contexts/ProblemContext';
import toast from 'react-hot-toast';

const Sidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { addProblem } = useProblems();

  const navItems = [
    { path: '/dashboard', icon: BarChart3, label: 'Dashboard' },
    { path: '/problems', icon: List, label: 'Problems' },
    { path: '/starred', icon: Star, label: 'Starred Problems' },
    { path: '/compiler', icon: Code, label: 'Code Compiler' },
    { path: '/notes', icon: StickyNote, label: 'Notes' },
    { path: '/ai-assistant', icon: Brain, label: 'AI Assistant' },
  ];

  // Add admin route if user is admin
  if (user?.role === 'admin') {
    navItems.push({ path: '/admin', icon: Shield, label: 'Admin Panel' });
  }

  const isActive = (path: string) => {
    if (path === '/dashboard') {
      return location.pathname === '/dashboard';
    }
    return location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
            <Code className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-bold text-gray-900">LeetCode Recorder</h1>
        </div>
        <p className="text-sm text-gray-500 mt-1">Track your progress</p>
        
        {/* User Info */}
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user?.username || user?.email?.split('@')[0] || 'User'}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {user?.email}
              </p>
            </div>
          </div>
          {user?.role === 'admin' && (
            <div className="mt-2">
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                <Shield className="w-3 h-3 mr-1" />
                Admin
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        <div className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`btn w-full flex items-center ${
                  isActive(item.path)
                    ? 'btn-primary'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-5 h-5 mr-3" />
                {item.label}
              </button>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="pt-6 border-t border-gray-200">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Quick Actions
          </h3>
          <button 
            onClick={() => {
              // This would open the add problem modal
              toast.success('Add Problem feature coming soon!');
            }}
            className="btn w-full flex items-center text-gray-700 hover:bg-gray-100"
          >
            <Plus className="w-5 h-5 mr-3" />
            Add Problem
          </button>
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 space-y-2">
        <button className="btn w-full flex items-center text-gray-700 hover:bg-gray-100">
          <Settings className="w-5 h-5 mr-3" />
          Settings
        </button>
        <button 
          onClick={handleLogout}
          className="btn w-full flex items-center text-gray-700 hover:bg-gray-100"
        >
          <LogOut className="w-5 h-5 mr-3" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar; 