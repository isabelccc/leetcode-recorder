import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useProblems } from '../contexts/ProblemContext';
import { LeetCodeProblem } from '../types';

interface AddProblemModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddProblemModal: React.FC<AddProblemModalProps> = ({ isOpen, onClose }) => {
  const { addProblem } = useProblems();
  const [formData, setFormData] = useState({
    title: '',
    difficulty: 'Easy' as 'Easy' | 'Medium' | 'Hard',
    category: '',
    url: '',
    status: 'Not Started' as 'Not Started' | 'In Progress' | 'Completed' | 'Failed',
    tags: '',
    notes: '',
    solution: '',
    language: 'JavaScript',
    timeComplexity: '',
    spaceComplexity: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const problemData: Omit<LeetCodeProblem, 'id' | 'createdAt' | 'updatedAt'> = {
      ...formData,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0),
      attempts: 0,
    };

    addProblem(problemData);
    onClose();
    setFormData({
      title: '',
      difficulty: 'Easy',
      category: '',
      url: '',
      status: 'Not Started',
      tags: '',
      notes: '',
      solution: '',
      language: 'JavaScript',
      timeComplexity: '',
      spaceComplexity: '',
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="card w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Add New Problem</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Problem Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="input"
                placeholder="e.g., Two Sum"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Difficulty *
              </label>
              <select
                name="difficulty"
                value={formData.difficulty}
                onChange={handleChange}
                className="input"
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="input"
                placeholder="e.g., Arrays, Strings, Dynamic Programming"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status *
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="input"
              >
                <option value="Not Started">Not Started</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Failed">Failed</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Programming Language
              </label>
              <select
                name="language"
                value={formData.language}
                onChange={handleChange}
                className="input"
              >
                <option value="JavaScript">JavaScript</option>
                <option value="Python">Python</option>
                <option value="Java">Java</option>
                <option value="C++">C++</option>
                <option value="C#">C#</option>
                <option value="Go">Go</option>
                <option value="Rust">Rust</option>
                <option value="TypeScript">TypeScript</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                LeetCode URL
              </label>
              <input
                type="url"
                name="url"
                value={formData.url}
                onChange={handleChange}
                className="input"
                placeholder="https://leetcode.com/problems/..."
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags (comma-separated)
            </label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              className="input"
              placeholder="e.g., hash table, two pointers, sliding window"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Time Complexity
              </label>
              <input
                type="text"
                name="timeComplexity"
                value={formData.timeComplexity}
                onChange={handleChange}
                className="input"
                placeholder="e.g., O(n), O(n²)"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Space Complexity
              </label>
              <input
                type="text"
                name="spaceComplexity"
                value={formData.spaceComplexity}
                onChange={handleChange}
                className="input"
                placeholder="e.g., O(1), O(n)"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={3}
              className="textarea"
              placeholder="Add your notes about the problem..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Solution
            </label>
            <textarea
              name="solution"
              value={formData.solution}
              onChange={handleChange}
              rows={6}
              className="textarea font-mono text-sm"
              placeholder="Paste your solution here..."
            />
          </div>

          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
            >
              Add Problem
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProblemModal; 