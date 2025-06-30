import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProblems } from '../contexts/ProblemContext';
import { 
  ArrowLeft, 
  Edit3, 
  Save, 
  X, 
  ExternalLink,
  CheckCircle,
  Clock,
  XCircle,
  PlayCircle,
  Tag,
  Target,
  Code
} from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const ProblemDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getProblem, updateProblem } = useProblems();
  const problem = id ? getProblem(id) : null;

  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    title: '',
    difficulty: 'Easy' as 'Easy' | 'Medium' | 'Hard',
    category: '',
    status: 'Not Started' as 'Not Started' | 'In Progress' | 'Completed' | 'Failed',
    notes: '',
    solution: '',
    language: '',
    timeComplexity: '',
    spaceComplexity: '',
    tags: '',
    url: '',
    description: '',
  });

  const [isEditingDesc, setIsEditingDesc] = useState(false);
  const [descValue, setDescValue] = useState(problem?.description || '');

  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['link', 'image'],
      ['clean']
    ]
  };

  React.useEffect(() => {
    if (problem) {
      setEditData({
        title: problem.title,
        difficulty: problem.difficulty,
        category: problem.category,
        status: problem.status,
        notes: problem.notes,
        solution: problem.solution,
        language: problem.language,
        timeComplexity: problem.timeComplexity || '',
        spaceComplexity: problem.spaceComplexity || '',
        tags: problem.tags.join(', '),
        url: problem.url,
        description: problem.description || '',
      });
    }
  }, [problem]);

  if (!problem) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Target className="w-16 h-16 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Problem not found</h3>
          <p className="text-gray-500">The problem you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/problems')}
            className="btn btn-primary mt-4"
          >
            Back to Problems
          </button>
        </div>
      </div>
    );
  }

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
      case 'Completed': return <CheckCircle className="w-5 h-5 text-success-600" />;
      case 'In Progress': return <PlayCircle className="w-5 h-5 text-warning-600" />;
      case 'Failed': return <XCircle className="w-5 h-5 text-error-600" />;
      default: return <Clock className="w-5 h-5 text-gray-600" />;
    }
  };

  const handleSave = () => {
    if (!editData.title.trim() || !editData.category.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    updateProblem(problem.id, {
      ...editData,
      tags: editData.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0),
      completedAt: editData.status === 'Completed' ? new Date() : undefined,
    });

    setIsEditing(false);
    toast.success('Problem updated successfully!');
  };

  const handleStatusChange = (newStatus: string) => {
    const updatedData = { ...editData, status: newStatus as any };
    setEditData(updatedData);
    
    if (newStatus === 'Completed') {
      updateProblem(problem.id, {
        status: newStatus as any,
        completedAt: new Date(),
        attempts: problem.attempts + 1,
      });
      toast.success('Problem marked as completed!');
    } else {
      updateProblem(problem.id, {
        status: newStatus as any,
        attempts: problem.attempts + 1,
      });
      toast.success('Problem status updated!');
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/problems')}
            className="btn btn-secondary flex items-center"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {isEditing ? (
                <input
                  type="text"
                  value={editData.title}
                  onChange={(e) => setEditData(prev => ({ ...prev, title: e.target.value }))}
                  className="input text-3xl font-bold p-0 border-0 bg-transparent"
                />
              ) : (
                problem.title
              )}
            </h1>
            <div className="flex items-center space-x-4 mt-2">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(problem.difficulty)}`}>
                {isEditing ? (
                  <select
                    value={editData.difficulty}
                    onChange={(e) => setEditData(prev => ({ ...prev, difficulty: e.target.value as any }))}
                    className="bg-transparent border-0 p-0"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                ) : (
                  problem.difficulty
                )}
              </span>
              <span className="text-gray-500">
                {isEditing ? (
                  <input
                    type="text"
                    value={editData.category}
                    onChange={(e) => setEditData(prev => ({ ...prev, category: e.target.value }))}
                    className="input text-gray-500 p-0 border-0 bg-transparent"
                  />
                ) : (
                  problem.category
                )}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {problem.url && (
            <a
              href={problem.url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary flex items-center"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              View on LeetCode
            </a>
          )}
          
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                className="btn btn-primary flex items-center"
              >
                <Save className="w-4 h-4 mr-2" />
                Save
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="btn btn-secondary flex items-center"
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="btn btn-secondary flex items-center"
            >
              <Edit3 className="w-4 h-4 mr-2" />
              Edit
            </button>
          )}
        </div>
      </div>

      {/* Description Section */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Description</h2>
        {isEditing ? (
          <ReactQuill
            value={editData.description || ''}
            onChange={val => setEditData(prev => ({ ...prev, description: val }))}
            className="mb-2 bg-white"
            theme="snow"
            modules={quillModules}
          />
        ) : (
          <div
            className="prose max-w-none text-base"
            dangerouslySetInnerHTML={{ __html: problem.description || '<em>No description provided.</em>' }}
            style={{ wordBreak: 'break-word' }}
          />
        )}
        <style>{`.prose img { max-width: 100%; height: auto; border-radius: 0.5rem; margin-top: 1rem; margin-bottom: 1rem; }`}</style>
      </div>

      {/* Status and Progress */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Status</h3>
            {getStatusIcon(problem.status)}
          </div>
          
          {isEditing ? (
            <select
              value={editData.status}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="input"
            >
              <option value="Not Started">Not Started</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Failed">Failed</option>
            </select>
          ) : (
            <div className="space-y-2">
              <p className="text-2xl font-bold text-gray-900">{problem.status}</p>
              <p className="text-sm text-gray-500">
                {problem.completedAt && `Completed on ${format(new Date(problem.completedAt), 'MMM d, yyyy')}`}
              </p>
            </div>
          )}
        </div>

        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Attempts</h3>
          <p className="text-2xl font-bold text-gray-900">{problem.attempts}</p>
          <p className="text-sm text-gray-500">Total attempts</p>
        </div>

        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Language</h3>
          <p className="text-2xl font-bold text-gray-900">
            {isEditing ? (
              <select
                value={editData.language}
                onChange={(e) => setEditData(prev => ({ ...prev, language: e.target.value }))}
                className="input text-2xl font-bold p-0 border-0 bg-transparent"
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
            ) : (
              problem.language
            )}
          </p>
        </div>
      </div>

      {/* Tags */}
      {problem.tags.length > 0 && (
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Tag className="w-5 h-5 mr-2" />
            Tags
          </h3>
          <div className="flex flex-wrap gap-2">
            {isEditing ? (
              <input
                type="text"
                value={editData.tags}
                onChange={(e) => setEditData(prev => ({ ...prev, tags: e.target.value }))}
                className="input"
                placeholder="Enter tags separated by commas"
              />
            ) : (
              problem.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                >
                  {tag}
                </span>
              ))
            )}
          </div>
        </div>
      )}

      {/* Complexity */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Time Complexity</h3>
          {isEditing ? (
            <input
              type="text"
              value={editData.timeComplexity}
              onChange={(e) => setEditData(prev => ({ ...prev, timeComplexity: e.target.value }))}
              className="input"
              placeholder="e.g., O(n), O(n²)"
            />
          ) : (
            <p className="text-xl font-mono text-gray-900">
              {problem.timeComplexity || 'Not specified'}
            </p>
          )}
        </div>

        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Space Complexity</h3>
          {isEditing ? (
            <input
              type="text"
              value={editData.spaceComplexity}
              onChange={(e) => setEditData(prev => ({ ...prev, spaceComplexity: e.target.value }))}
              className="input"
              placeholder="e.g., O(1), O(n)"
            />
          ) : (
            <p className="text-xl font-mono text-gray-900">
              {problem.spaceComplexity || 'Not specified'}
            </p>
          )}
        </div>
      </div>

      {/* Notes */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Notes</h3>
        {isEditing ? (
          <textarea
            value={editData.notes}
            onChange={(e) => setEditData(prev => ({ ...prev, notes: e.target.value }))}
            rows={4}
            className="textarea"
            placeholder="Add your notes about the problem..."
          />
        ) : (
          <div className="prose max-w-none">
            <pre className="whitespace-pre-wrap font-sans text-gray-900">
              {problem.notes || 'No notes added yet.'}
            </pre>
          </div>
        )}
      </div>

      {/* Solution */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Code className="w-5 h-5 mr-2" />
            Solution
          </h3>
        </div>
        
        {isEditing ? (
          <textarea
            value={editData.solution}
            onChange={(e) => setEditData(prev => ({ ...prev, solution: e.target.value }))}
            rows={12}
            className="textarea font-mono text-sm"
            placeholder="Paste your solution here..."
          />
        ) : (
          <div className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-auto">
            <pre className="font-mono text-sm">
              {problem.solution || 'No solution added yet.'}
            </pre>
          </div>
        )}
      </div>

      {/* Metadata */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Metadata</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Created:</span>
            <span className="ml-2 text-gray-900">
              {format(new Date(problem.createdAt), 'MMM d, yyyy h:mm a')}
            </span>
          </div>
          <div>
            <span className="text-gray-500">Last Updated:</span>
            <span className="ml-2 text-gray-900">
              {format(new Date(problem.updatedAt), 'MMM d, yyyy h:mm a')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProblemDetail; 