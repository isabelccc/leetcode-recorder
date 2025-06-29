import React, { useState } from 'react';
import { 
  Shield, 
  Users, 
  BarChart3, 
  Settings, 
  Database,
  Activity,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';

const AdminPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'system', label: 'System', icon: Settings },
    { id: 'database', label: 'Database', icon: Database },
  ];

  const stats = [
    { label: 'Total Users', value: '1,234', change: '+12%', icon: Users, color: 'blue' },
    { label: 'Active Sessions', value: '89', change: '+5%', icon: Activity, color: 'green' },
    { label: 'Problems Solved', value: '5,678', change: '+23%', icon: CheckCircle, color: 'purple' },
    { label: 'System Uptime', value: '99.9%', change: '+0.1%', icon: Clock, color: 'orange' },
  ];

  const recentActivity = [
    { user: 'john.doe@example.com', action: 'Completed problem', problem: 'Two Sum', time: '2 minutes ago' },
    { user: 'jane.smith@example.com', action: 'Started problem', problem: 'Valid Parentheses', time: '5 minutes ago' },
    { user: 'admin@leetcode.com', action: 'Updated settings', problem: 'System', time: '10 minutes ago' },
    { user: 'bob.wilson@example.com', action: 'Created account', problem: 'Registration', time: '15 minutes ago' },
  ];

  return (
    <div className="flex-1 bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
              <p className="text-gray-600">Manage your LeetCode Recorder application</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'border-purple-500 text-purple-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <div key={index} className="card p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                          <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                          <p className="text-sm text-green-600 mt-1">{stat.change} from last month</p>
                        </div>
                        <div className={`w-12 h-12 bg-${stat.color}-100 rounded-lg flex items-center justify-center`}>
                          <Icon className={`w-6 h-6 text-${stat.color}-600`} />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Recent Activity */}
              <div className="card">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {recentActivity.map((activity, index) => (
                      <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                            <Users className="w-4 h-4 text-gray-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{activity.user}</p>
                            <p className="text-xs text-gray-500">
                              {activity.action}: {activity.problem}
                            </p>
                          </div>
                        </div>
                        <span className="text-xs text-gray-400">{activity.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* System Status */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="card p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">System Status</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Database</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm text-green-600">Online</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">API Services</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm text-green-600">Online</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">File Storage</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm text-green-600">Online</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="card p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                  <div className="space-y-3">
                    <button className="btn w-full text-left p-3 border border-gray-200 hover:border-gray-300 hover:bg-gray-50">
                      <div className="flex items-center space-x-3">
                        <Database className="w-5 h-5 text-blue-600" />
                        <span className="text-sm font-medium text-gray-900">Backup Database</span>
                      </div>
                    </button>
                    <button className="btn w-full text-left p-3 border border-gray-200 hover:border-gray-300 hover:bg-gray-50">
                      <div className="flex items-center space-x-3">
                        <Settings className="w-5 h-5 text-purple-600" />
                        <span className="text-sm font-medium text-gray-900">System Settings</span>
                      </div>
                    </button>
                    <button className="btn w-full text-left p-3 border border-gray-200 hover:border-gray-300 hover:bg-gray-50">
                      <div className="flex items-center space-x-3">
                        <Activity className="w-5 h-5 text-green-600" />
                        <span className="text-sm font-medium text-gray-900">View Logs</span>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="card">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">User Management</h3>
              </div>
              <div className="p-6">
                <p className="text-gray-600">User management features coming soon...</p>
              </div>
            </div>
          )}

          {activeTab === 'system' && (
            <div className="card">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">System Settings</h3>
              </div>
              <div className="p-6">
                <p className="text-gray-600">System settings features coming soon...</p>
              </div>
            </div>
          )}

          {activeTab === 'database' && (
            <div className="card">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Database Management</h3>
              </div>
              <div className="p-6">
                <p className="text-gray-600">Database management features coming soon...</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel; 