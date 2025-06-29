import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { LeetCodeProblem, ProgressStats } from '../types';
import toast from 'react-hot-toast';

interface ProblemState {
  problems: LeetCodeProblem[];
  stats: ProgressStats;
  loading: boolean;
}

type ProblemAction =
  | { type: 'SET_PROBLEMS'; payload: LeetCodeProblem[] }
  | { type: 'ADD_PROBLEM'; payload: LeetCodeProblem }
  | { type: 'UPDATE_PROBLEM'; payload: LeetCodeProblem }
  | { type: 'DELETE_PROBLEM'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'UPDATE_STATS' };

interface ProblemContextType {
  state: ProblemState;
  addProblem: (problem: Omit<LeetCodeProblem, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateProblem: (id: string, updates: Partial<LeetCodeProblem>) => void;
  deleteProblem: (id: string) => void;
  getProblem: (id: string) => LeetCodeProblem | undefined;
  getProblemsByFilter: (filter: string) => LeetCodeProblem[];
}

const ProblemContext = createContext<ProblemContextType | undefined>(undefined);

const initialState: ProblemState = {
  problems: [],
  stats: {
    total: 0,
    completed: 0,
    inProgress: 0,
    notStarted: 0,
    failed: 0,
    easy: { total: 0, completed: 0 },
    medium: { total: 0, completed: 0 },
    hard: { total: 0, completed: 0 },
    categories: {},
  },
  loading: false,
};

function calculateStats(problems: LeetCodeProblem[]): ProgressStats {
  const stats: ProgressStats = {
    total: problems.length,
    completed: 0,
    inProgress: 0,
    notStarted: 0,
    failed: 0,
    easy: { total: 0, completed: 0 },
    medium: { total: 0, completed: 0 },
    hard: { total: 0, completed: 0 },
    categories: {},
  };

  problems.forEach(problem => {
    // Count by status
    switch (problem.status) {
      case 'Completed':
        stats.completed++;
        break;
      case 'In Progress':
        stats.inProgress++;
        break;
      case 'Not Started':
        stats.notStarted++;
        break;
      case 'Failed':
        stats.failed++;
        break;
    }

    // Count by difficulty
    switch (problem.difficulty) {
      case 'Easy':
        stats.easy.total++;
        if (problem.status === 'Completed') stats.easy.completed++;
        break;
      case 'Medium':
        stats.medium.total++;
        if (problem.status === 'Completed') stats.medium.completed++;
        break;
      case 'Hard':
        stats.hard.total++;
        if (problem.status === 'Completed') stats.hard.completed++;
        break;
    }

    // Count by category
    if (!stats.categories[problem.category]) {
      stats.categories[problem.category] = { total: 0, completed: 0 };
    }
    stats.categories[problem.category].total++;
    if (problem.status === 'Completed') {
      stats.categories[problem.category].completed++;
    }
  });

  return stats;
}

function problemReducer(state: ProblemState, action: ProblemAction): ProblemState {
  switch (action.type) {
    case 'SET_PROBLEMS':
      return {
        ...state,
        problems: action.payload,
        stats: calculateStats(action.payload),
      };
    case 'ADD_PROBLEM':
      const newProblems = [...state.problems, action.payload];
      return {
        ...state,
        problems: newProblems,
        stats: calculateStats(newProblems),
      };
    case 'UPDATE_PROBLEM':
      const updatedProblems = state.problems.map(p =>
        p.id === action.payload.id ? action.payload : p
      );
      return {
        ...state,
        problems: updatedProblems,
        stats: calculateStats(updatedProblems),
      };
    case 'DELETE_PROBLEM':
      const filteredProblems = state.problems.filter(p => p.id !== action.payload);
      return {
        ...state,
        problems: filteredProblems,
        stats: calculateStats(filteredProblems),
      };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'UPDATE_STATS':
      return { ...state, stats: calculateStats(state.problems) };
    default:
      return state;
  }
}

export function ProblemProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(problemReducer, initialState);

  // Load problems from localStorage on mount
  useEffect(() => {
    const savedProblems = localStorage.getItem('leetcode-problems');
    if (savedProblems) {
      try {
        const problems = JSON.parse(savedProblems).map((p: any) => ({
          ...p,
          createdAt: new Date(p.createdAt),
          updatedAt: new Date(p.updatedAt),
          completedAt: p.completedAt ? new Date(p.completedAt) : undefined,
        }));
        dispatch({ type: 'SET_PROBLEMS', payload: problems });
      } catch (error) {
        console.error('Error loading problems from localStorage:', error);
      }
    }
  }, []);

  // Save problems to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('leetcode-problems', JSON.stringify(state.problems));
  }, [state.problems]);

  const addProblem = (problemData: Omit<LeetCodeProblem, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newProblem: LeetCodeProblem = {
      ...problemData,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    dispatch({ type: 'ADD_PROBLEM', payload: newProblem });
    toast.success('Problem added successfully!');
  };

  const updateProblem = (id: string, updates: Partial<LeetCodeProblem>) => {
    const problem = state.problems.find(p => p.id === id);
    if (problem) {
      const updatedProblem = {
        ...problem,
        ...updates,
        updatedAt: new Date(),
      };
      dispatch({ type: 'UPDATE_PROBLEM', payload: updatedProblem });
      toast.success('Problem updated successfully!');
    }
  };

  const deleteProblem = (id: string) => {
    dispatch({ type: 'DELETE_PROBLEM', payload: id });
    toast.success('Problem deleted successfully!');
  };

  const getProblem = (id: string) => {
    return state.problems.find(p => p.id === id);
  };

  const getProblemsByFilter = (filter: string) => {
    if (!filter) return state.problems;
    return state.problems.filter(problem =>
      problem.title.toLowerCase().includes(filter.toLowerCase()) ||
      problem.category.toLowerCase().includes(filter.toLowerCase()) ||
      problem.tags.some(tag => tag.toLowerCase().includes(filter.toLowerCase()))
    );
  };

  const value: ProblemContextType = {
    state,
    addProblem,
    updateProblem,
    deleteProblem,
    getProblem,
    getProblemsByFilter,
  };

  return (
    <ProblemContext.Provider value={value}>
      {children}
    </ProblemContext.Provider>
  );
}

export function useProblems() {
  const context = useContext(ProblemContext);
  if (context === undefined) {
    throw new Error('useProblems must be used within a ProblemProvider');
  }
  return context;
} 