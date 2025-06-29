import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  BarChart3, 
  List, 
  Code, 
  StickyNote, 
  Plus,
  Settings
} from 'lucide-react';

const Sidebar: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: BarChart3, label: 'Dashboard' },
    { path: '/problems', icon: List, label: 'Problems' },
    { path: '/compiler', icon: Code, label: 'Code Compiler' },
    { path: '/notes', icon: StickyNote, label: 'Notes' },
  ];

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-900">LeetCode Recorder</h1>
        <p className="text-sm text-gray-500 mt-1">Track your progress</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                    isActive(item.path)
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Quick Actions */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Quick Actions
          </h3>
          <button className="w-full flex items-center px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors duration-200">
            <Plus className="w-5 h-5 mr-3" />
            Add Problem
          </button>
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <button className="w-full flex items-center px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors duration-200">
          <Settings className="w-5 h-5 mr-3" />
          Settings
        </button>
      </div>
    </div>
  );
};

export default Sidebar; 