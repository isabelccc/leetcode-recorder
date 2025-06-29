import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import ProblemList from './pages/ProblemList';
import ProblemDetail from './pages/ProblemDetail';
import CodeCompiler from './pages/CodeCompiler';
import Notes from './pages/Notes';
import { ProblemProvider } from './contexts/ProblemContext';

function App() {
  return (
    <ProblemProvider>
      <Router>
        <div className="flex h-screen bg-gray-50">
          <Sidebar />
          <main className="flex-1 overflow-auto">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/problems" element={<ProblemList />} />
              <Route path="/problems/:id" element={<ProblemDetail />} />
              <Route path="/compiler" element={<CodeCompiler />} />
              <Route path="/notes" element={<Notes />} />
            </Routes>
          </main>
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
        </div>
      </Router>
    </ProblemProvider>
  );
}

export default App; 