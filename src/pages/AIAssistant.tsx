import React from 'react';
import { Brain } from 'lucide-react';

const AIAssistant: React.FC = () => {
  return (
    <div className="flex-1 bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center space-x-3 mb-8">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">AI Assistant</h1>
            <p className="text-gray-600">Get intelligent insights and recommendations for your LeetCode journey</p>
          </div>
        </div>
        
        <div className="card p-8 text-center">
          <Brain className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">AI Assistant Coming Soon</h2>
          <p className="text-gray-600">This feature is currently under development. Check back soon for AI-powered code analysis and recommendations!</p>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant; 