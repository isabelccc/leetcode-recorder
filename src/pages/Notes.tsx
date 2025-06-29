import React, { useState, useEffect } from 'react';
import { Plus, Search, Tag, Calendar, Edit3, Trash2, Save } from 'lucide-react';
import { Note } from '../types';
import toast from 'react-hot-toast';

const Notes: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState('');
  const [showNewNoteForm, setShowNewNoteForm] = useState(false);
  const [newNoteData, setNewNoteData] = useState({
    title: '',
    content: '',
    tags: '',
    problemId: ''
  });

  // Load notes from localStorage
  useEffect(() => {
    const savedNotes = localStorage.getItem('leetcode-notes');
    if (savedNotes) {
      try {
        const parsedNotes = JSON.parse(savedNotes).map((note: any) => ({
          ...note,
          createdAt: new Date(note.createdAt),
          updatedAt: new Date(note.updatedAt),
        }));
        setNotes(parsedNotes);
      } catch (error) {
        console.error('Error loading notes:', error);
      }
    }
  }, []);

  // Save notes to localStorage
  useEffect(() => {
    localStorage.setItem('leetcode-notes', JSON.stringify(notes));
  }, [notes]);

  const filteredNotes = notes.filter(note =>
    note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const createNote = () => {
    if (!newNoteData.title.trim() || !newNoteData.content.trim()) {
      toast.error('Please fill in both title and content');
      return;
    }

    const newNote: Note = {
      id: crypto.randomUUID(),
      problemId: newNoteData.problemId || '',
      content: newNoteData.content,
      createdAt: new Date(),
      updatedAt: new Date(),
      tags: newNoteData.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0),
    };

    setNotes(prev => [newNote, ...prev]);
    setSelectedNote(newNote);
    setShowNewNoteForm(false);
    setNewNoteData({ title: '', content: '', tags: '', problemId: '' });
    toast.success('Note created successfully!');
  };

  const updateNote = () => {
    if (!selectedNote) return;

    const updatedNote: Note = {
      ...selectedNote,
      content: editContent,
      updatedAt: new Date(),
    };

    setNotes(prev => prev.map(note => 
      note.id === selectedNote.id ? updatedNote : note
    ));
    setSelectedNote(updatedNote);
    setIsEditing(false);
    toast.success('Note updated successfully!');
  };

  const deleteNote = (noteId: string) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      setNotes(prev => prev.filter(note => note.id !== noteId));
      if (selectedNote?.id === noteId) {
        setSelectedNote(null);
      }
      toast.success('Note deleted successfully!');
    }
  };

  const startEditing = () => {
    if (selectedNote) {
      setEditContent(selectedNote.content);
      setIsEditing(true);
    }
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setEditContent('');
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="h-full flex">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Notes</h2>
            <button
              onClick={() => setShowNewNoteForm(true)}
              className="btn btn-primary flex items-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Note
            </button>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search notes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input pl-10"
            />
          </div>
        </div>

        {/* Notes List */}
        <div className="flex-1 overflow-y-auto">
          {showNewNoteForm ? (
            <div className="p-4 border-b border-gray-200">
              <h3 className="font-medium text-gray-900 mb-3">Create New Note</h3>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Note title"
                  value={newNoteData.title}
                  onChange={(e) => setNewNoteData(prev => ({ ...prev, title: e.target.value }))}
                  className="input"
                />
                <textarea
                  placeholder="Note content"
                  value={newNoteData.content}
                  onChange={(e) => setNewNoteData(prev => ({ ...prev, content: e.target.value }))}
                  rows={4}
                  className="textarea"
                />
                <input
                  type="text"
                  placeholder="Tags (comma-separated)"
                  value={newNoteData.tags}
                  onChange={(e) => setNewNoteData(prev => ({ ...prev, tags: e.target.value }))}
                  className="input"
                />
                <div className="flex space-x-2">
                  <button
                    onClick={createNote}
                    className="btn btn-primary flex-1"
                  >
                    Create
                  </button>
                  <button
                    onClick={() => setShowNewNoteForm(false)}
                    className="btn btn-secondary flex-1"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          ) : null}

          <div className="divide-y divide-gray-200">
            {filteredNotes.map((note) => (
              <div
                key={note.id}
                className={`p-4 cursor-pointer hover:bg-gray-50 ${
                  selectedNote?.id === note.id ? 'bg-primary-50 border-r-2 border-primary-500' : ''
                }`}
                onClick={() => setSelectedNote(note)}
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-gray-900 truncate">
                    {note.content.split('\n')[0] || 'Untitled Note'}
                  </h4>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNote(note.id);
                    }}
                    className="text-gray-400 hover:text-error-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                
                <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                  {note.content.split('\n').slice(1).join(' ')}
                </p>
                
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center">
                    <Calendar className="w-3 h-3 mr-1" />
                    {formatDate(note.updatedAt)}
                  </div>
                  {note.tags.length > 0 && (
                    <div className="flex items-center">
                      <Tag className="w-3 h-3 mr-1" />
                      {note.tags.length}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {filteredNotes.length === 0 && !showNewNoteForm && (
            <div className="p-8 text-center">
              <div className="text-gray-400 mb-4">
                <Edit3 className="w-12 h-12 mx-auto" />
              </div>
              <p className="text-gray-500">No notes found</p>
              <p className="text-sm text-gray-400 mt-1">
                {notes.length === 0 ? 'Create your first note to get started' : 'Try adjusting your search'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {selectedNote ? (
          <>
            {/* Note Header */}
            <div className="p-4 border-b border-gray-200 bg-white">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    {selectedNote.content.split('\n')[0] || 'Untitled Note'}
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Last updated: {formatDate(selectedNote.updatedAt)}
                  </p>
                </div>
                
                <div className="flex items-center space-x-2">
                  {isEditing ? (
                    <>
                      <button
                        onClick={updateNote}
                        className="btn btn-primary flex items-center"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        Save
                      </button>
                      <button
                        onClick={cancelEditing}
                        className="btn btn-secondary"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={startEditing}
                      className="btn btn-secondary flex items-center"
                    >
                      <Edit3 className="w-4 h-4 mr-2" />
                      Edit
                    </button>
                  )}
                </div>
              </div>
              
              {selectedNote.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {selectedNote.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Note Content */}
            <div className="flex-1 p-6">
              {isEditing ? (
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full h-full textarea resize-none"
                  placeholder="Write your note here..."
                />
              ) : (
                <div className="prose max-w-none">
                  <pre className="whitespace-pre-wrap font-sans text-gray-900">
                    {selectedNote.content}
                  </pre>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="text-gray-400 mb-4">
                <Edit3 className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No note selected</h3>
              <p className="text-gray-500">Select a note from the sidebar to view or edit it</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notes; 