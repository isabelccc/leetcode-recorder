import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Sidebar from './components/Sidebar';
import Homepage from './pages/Homepage';
import Dashboard from './pages/Dashboard';
import ProblemList from './pages/ProblemList';
import StarredProblems from './pages/StarredProblems';
import ProblemDetail from './pages/ProblemDetail';
import CodeCompiler from './pages/CodeCompiler';
import Notes from './pages/Notes';
import AIAssistant from './pages/AIAssistant';
import AdminPanel from './pages/AdminPanel';
import ProtectedRoute from './components/ProtectedRoute';
import { ProblemProvider } from './contexts/ProblemContext';
import { AuthProvider } from './contexts/AuthContext';
import { AIAssistantProvider } from './contexts/AIAssistantContext';

function App() {
  return (
    <AuthProvider>
      <ProblemProvider>
        <AIAssistantProvider>
          <Router>
            <Routes>
              <Route path="/" element={<Homepage />} />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <div className="flex h-screen bg-gray-50">
                    <Sidebar />
                    <main className="flex-1 overflow-auto">
                      <Dashboard />
                    </main>
                  </div>
                </ProtectedRoute>
              } />
              <Route path="/problems" element={
                <ProtectedRoute>
                  <div className="flex h-screen bg-gray-50">
                    <Sidebar />
                    <main className="flex-1 overflow-auto">
                      <ProblemList />
                    </main>
                  </div>
                </ProtectedRoute>
              } />
              <Route path="/starred" element={
                <ProtectedRoute>
                  <div className="flex h-screen bg-gray-50">
                    <Sidebar />
                    <main className="flex-1 overflow-auto">
                      <StarredProblems />
                    </main>
                  </div>
                </ProtectedRoute>
              } />
              <Route path="/problems/:id" element={
                <ProtectedRoute>
                  <div className="flex h-screen bg-gray-50">
                    <Sidebar />
                    <main className="flex-1 overflow-auto">
                      <ProblemDetail />
                    </main>
                  </div>
                </ProtectedRoute>
              } />
              <Route path="/compiler" element={
                <ProtectedRoute>
                  <div className="flex h-screen bg-gray-50">
                    <Sidebar />
                    <main className="flex-1 overflow-auto">
                      <CodeCompiler />
                    </main>
                  </div>
                </ProtectedRoute>
              } />
              <Route path="/notes" element={
                <ProtectedRoute>
                  <div className="flex h-screen bg-gray-50">
                    <Sidebar />
                    <main className="flex-1 overflow-auto">
                      <Notes />
                    </main>
                  </div>
                </ProtectedRoute>
              } />
              <Route path="/ai-assistant" element={
                <ProtectedRoute>
                  <div className="flex h-screen bg-gray-50">
                    <Sidebar />
                    <main className="flex-1 overflow-auto">
                      <AIAssistant />
                    </main>
                  </div>
                </ProtectedRoute>
              } />
              <Route path="/admin" element={
                <ProtectedRoute requireAdmin>
                  <div className="flex h-screen bg-gray-50">
                    <Sidebar />
                    <main className="flex-1 overflow-auto">
                      <AdminPanel />
                    </main>
                  </div>
                </ProtectedRoute>
              } />
            </Routes>
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#363636',
                  color: '#fff',
                },
              }}
            />
          </Router>
        </AIAssistantProvider>
      </ProblemProvider>
    </AuthProvider>
  );
}

export default App; 