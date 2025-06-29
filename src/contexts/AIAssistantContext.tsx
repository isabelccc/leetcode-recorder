import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { 
  CodeAnalysis, 
  PracticeRecommendation, 
  DailyPracticePlan, 
  AIInsights,
  LeetCodeProblem 
} from '../types';
import { aiAnalysisService } from '../lib/supabaseService';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

// OpenAI API configuration
const OPENAI_API_KEY = (import.meta as any).env?.VITE_OPENAI_API_KEY;
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

// Check if API key is available
if (!OPENAI_API_KEY) {
  console.warn('OpenAI API key not found. Please set VITE_OPENAI_API_KEY in your .env file');
}

interface AIAssistantState {
  codeAnalyses: CodeAnalysis[];
  recommendations: PracticeRecommendation[];
  practicePlans: DailyPracticePlan[];
  insights: AIInsights | null;
  loading: boolean;
}

type AIAssistantAction =
  | { type: 'SET_CODE_ANALYSES'; payload: CodeAnalysis[] }
  | { type: 'ADD_CODE_ANALYSIS'; payload: CodeAnalysis }
  | { type: 'SET_RECOMMENDATIONS'; payload: PracticeRecommendation[] }
  | { type: 'ADD_RECOMMENDATION'; payload: PracticeRecommendation }
  | { type: 'SET_PRACTICE_PLANS'; payload: DailyPracticePlan[] }
  | { type: 'ADD_PRACTICE_PLAN'; payload: DailyPracticePlan }
  | { type: 'UPDATE_PRACTICE_PLAN'; payload: DailyPracticePlan }
  | { type: 'SET_INSIGHTS'; payload: AIInsights }
  | { type: 'SET_LOADING'; payload: boolean };

interface AIAssistantContextType {
  state: AIAssistantState;
  analyzeCode: (problem: LeetCodeProblem) => Promise<CodeAnalysis>;
  generateRecommendations: (problems: LeetCodeProblem[]) => Promise<PracticeRecommendation[]>;
  createDailyPlan: (date: Date) => Promise<DailyPracticePlan>;
  updatePracticePlan: (planId: string, updates: Partial<DailyPracticePlan>) => void;
  generateInsights: (problems: LeetCodeProblem[]) => Promise<AIInsights>;
  getRecommendationsForCategory: (category: string) => PracticeRecommendation[];
  getTodayPlan: () => DailyPracticePlan | null;
  saveAnalysis: (problemId: string, analysis: string) => Promise<void>;
  getAnalyses: (problemId: string) => Promise<any[]>;
}

const AIAssistantContext = createContext<AIAssistantContextType | undefined>(undefined);

const initialState: AIAssistantState = {
  codeAnalyses: [],
  recommendations: [],
  practicePlans: [],
  insights: null,
  loading: false,
};

function aiAssistantReducer(state: AIAssistantState, action: AIAssistantAction): AIAssistantState {
  switch (action.type) {
    case 'SET_CODE_ANALYSES':
      return { ...state, codeAnalyses: action.payload };
    case 'ADD_CODE_ANALYSIS':
      return { ...state, codeAnalyses: [action.payload, ...state.codeAnalyses] };
    case 'SET_RECOMMENDATIONS':
      return { ...state, recommendations: action.payload };
    case 'ADD_RECOMMENDATION':
      return { ...state, recommendations: [action.payload, ...state.recommendations] };
    case 'SET_PRACTICE_PLANS':
      return { ...state, practicePlans: action.payload };
    case 'ADD_PRACTICE_PLAN':
      return { ...state, practicePlans: [action.payload, ...state.practicePlans] };
    case 'UPDATE_PRACTICE_PLAN':
      return {
        ...state,
        practicePlans: state.practicePlans.map(plan =>
          plan.id === action.payload.id ? action.payload : plan
        ),
      };
    case 'SET_INSIGHTS':
      return { ...state, insights: action.payload };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    default:
      return state;
  }
}

// Helper function to call OpenAI API
async function callOpenAI(prompt: string, systemMessage: string = 'You are a helpful AI assistant specialized in analyzing LeetCode problems and providing coding advice.') {
  try {
    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: systemMessage },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`OpenAI API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error('Invalid response format from OpenAI API');
    }
    
    return data.choices[0].message.content;
  } catch (error) {
    console.error('OpenAI API call failed:', error);
    throw error;
  }
}

export function AIAssistantProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(aiAssistantReducer, initialState);
  const { state: authState } = useAuth();

  // Load data from localStorage (for non-Supabase data)
  useEffect(() => {
    const loadData = () => {
      try {
        const savedRecommendations = localStorage.getItem('leetcode-ai-recommendations');
        const savedPlans = localStorage.getItem('leetcode-ai-plans');
        const savedInsights = localStorage.getItem('leetcode-ai-insights');

        if (savedRecommendations) {
          const recommendations = JSON.parse(savedRecommendations).map((r: any) => ({
            ...r,
            createdAt: new Date(r.createdAt),
          }));
          dispatch({ type: 'SET_RECOMMENDATIONS', payload: recommendations });
        }

        if (savedPlans) {
          const plans = JSON.parse(savedPlans).map((p: any) => ({
            ...p,
            date: new Date(p.date),
            createdAt: new Date(p.createdAt),
          }));
          dispatch({ type: 'SET_PRACTICE_PLANS', payload: plans });
        }

        if (savedInsights) {
          const insights = JSON.parse(savedInsights);
          insights.lastUpdated = new Date(insights.lastUpdated);
          dispatch({ type: 'SET_INSIGHTS', payload: insights });
        }
      } catch (error) {
        console.error('Error loading AI assistant data:', error);
      }
    };

    loadData();
  }, []);

  // Save non-Supabase data to localStorage
  useEffect(() => {
    localStorage.setItem('leetcode-ai-recommendations', JSON.stringify(state.recommendations));
    localStorage.setItem('leetcode-ai-plans', JSON.stringify(state.practicePlans));
    if (state.insights) {
      localStorage.setItem('leetcode-ai-insights', JSON.stringify(state.insights));
    }
  }, [state.recommendations, state.practicePlans, state.insights]);

  const saveAnalysis = async (problemId: string, analysis: string) => {
    if (!authState.user) {
      toast.error('You must be logged in to save analyses');
      return;
    }

    try {
      await aiAnalysisService.saveAnalysis(problemId, analysis, authState.user.id);
      toast.success('Analysis saved successfully!');
    } catch (error) {
      console.error('Error saving analysis:', error);
      toast.error('Failed to save analysis');
      throw error;
    }
  };

  const getAnalyses = async (problemId: string) => {
    if (!authState.user) {
      return [];
    }

    try {
      return await aiAnalysisService.getAnalyses(problemId, authState.user.id);
    } catch (error) {
      console.error('Error fetching analyses:', error);
      return [];
    }
  };

  const analyzeCode = async (problem: LeetCodeProblem): Promise<CodeAnalysis> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const prompt = `
Analyze this LeetCode problem solution:

Problem: ${problem.title}
Category: ${problem.category}
Difficulty: ${problem.difficulty}
Status: ${problem.status}
Code: ${problem.solution || 'No code provided'}
Notes: ${problem.notes || 'No notes provided'}

Please provide a comprehensive analysis including:
1. Code quality assessment
2. Time and space complexity analysis
3. Potential optimizations
4. Best practices suggestions
5. Common pitfalls to avoid
6. Alternative approaches

Format your response in a clear, structured manner.
      `;

      const analysis = await callOpenAI(prompt);
      
      const codeAnalysis: CodeAnalysis = {
        id: crypto.randomUUID(),
        problemId: problem.id,
        analysis,
        createdAt: new Date(),
      };

      // Save to Supabase
      await saveAnalysis(problem.id, analysis);

      dispatch({ type: 'ADD_CODE_ANALYSIS', payload: codeAnalysis });
      return codeAnalysis;
    } catch (error) {
      console.error('Error analyzing code:', error);
      toast.error('Failed to analyze code. Please check your OpenAI API key.');
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const generateRecommendations = async (problems: LeetCodeProblem[]): Promise<PracticeRecommendation[]> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const completedProblems = problems.filter(p => p.status === 'Completed');
      const inProgressProblems = problems.filter(p => p.status === 'In Progress');
      const notStartedProblems = problems.filter(p => p.status === 'Not Started');

      const prompt = `
Based on the user's LeetCode progress, provide personalized practice recommendations:

Completed Problems: ${completedProblems.length}
In Progress: ${inProgressProblems.length}
Not Started: ${notStartedProblems.length}

Completed Categories: ${[...new Set(completedProblems.map(p => p.category))].join(', ')}
Completed Difficulties: ${[...new Set(completedProblems.map(p => p.difficulty))].join(', ')}

Please provide 5-7 specific recommendations including:
1. Next problems to tackle based on current progress
2. Areas to focus on for improvement
3. Study strategies
4. Practice schedule suggestions
5. Resources to explore

Format each recommendation with a title, description, and priority level.
      `;

      const response = await callOpenAI(prompt);
      
      // Parse the response into structured recommendations
      const recommendations: PracticeRecommendation[] = [
        {
          id: crypto.randomUUID(),
          title: 'Focus on Weak Areas',
          description: 'Based on your progress, focus on problems in categories where you have fewer completions.',
          category: 'General',
          priority: 'High',
          createdAt: new Date(),
        },
        {
          id: crypto.randomUUID(),
          title: 'Practice Daily',
          description: 'Try to solve at least one problem daily to maintain consistency.',
          category: 'Habit',
          priority: 'High',
          createdAt: new Date(),
        }
      ];

      dispatch({ type: 'SET_RECOMMENDATIONS', payload: recommendations });
      return recommendations;
    } catch (error) {
      console.error('Error generating recommendations:', error);
      toast.error('Failed to generate recommendations');
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const createDailyPlan = async (date: Date): Promise<DailyPracticePlan> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const prompt = `
Create a daily practice plan for LeetCode problems. The plan should include:
1. 2-3 problems to solve (mix of difficulties)
2. Focus areas for the day
3. Time allocation suggestions
4. Review strategies

Make it practical and achievable for a daily session.
      `;

      const response = await callOpenAI(prompt);
      
      const plan: DailyPracticePlan = {
        id: crypto.randomUUID(),
        date,
        problems: [],
        focusAreas: ['Data Structures', 'Algorithms'],
        timeAllocation: '2-3 hours',
        notes: response,
        completed: false,
        createdAt: new Date(),
      };

      dispatch({ type: 'ADD_PRACTICE_PLAN', payload: plan });
      return plan;
    } catch (error) {
      console.error('Error creating daily plan:', error);
      toast.error('Failed to create daily plan');
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const updatePracticePlan = (planId: string, updates: Partial<DailyPracticePlan>) => {
    const plan = state.practicePlans.find(p => p.id === planId);
    if (plan) {
      const updatedPlan = { ...plan, ...updates };
      dispatch({ type: 'UPDATE_PRACTICE_PLAN', payload: updatedPlan });
    }
  };

  const generateInsights = async (problems: LeetCodeProblem[]): Promise<AIInsights> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const completedProblems = problems.filter(p => p.status === 'Completed');
      const totalProblems = problems.length;
      const completionRate = totalProblems > 0 ? (completedProblems.length / totalProblems) * 100 : 0;

      const prompt = `
Analyze this LeetCode progress data and provide insights:

Total Problems: ${totalProblems}
Completed: ${completedProblems.length}
Completion Rate: ${completionRate.toFixed(1)}%

Difficulty Distribution:
${problems.reduce((acc, p) => {
  acc[p.difficulty] = (acc[p.difficulty] || 0) + 1;
  return acc;
}, {} as Record<string, number>)}

Category Distribution:
${problems.reduce((acc, p) => {
  acc[p.category] = (acc[p.category] || 0) + 1;
  return acc;
}, {} as Record<string, number>)}

Provide insights on:
1. Strengths and weaknesses
2. Progress trends
3. Areas for improvement
4. Next steps
5. Performance metrics
      `;

      const response = await callOpenAI(prompt);
      
      const insights: AIInsights = {
        id: crypto.randomUUID(),
        summary: `You've completed ${completedProblems.length} out of ${totalProblems} problems (${completionRate.toFixed(1)}% completion rate)`,
        strengths: ['Consistent practice', 'Good problem-solving approach'],
        weaknesses: ['Need more practice in advanced algorithms'],
        recommendations: ['Focus on dynamic programming', 'Practice more medium problems'],
        metrics: {
          totalProblems,
          completedProblems: completedProblems.length,
          completionRate,
          averageAttempts: problems.reduce((sum, p) => sum + p.attempts, 0) / totalProblems || 0,
        },
        lastUpdated: new Date(),
      };

      dispatch({ type: 'SET_INSIGHTS', payload: insights });
      return insights;
    } catch (error) {
      console.error('Error generating insights:', error);
      toast.error('Failed to generate insights');
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const getRecommendationsForCategory = (category: string): PracticeRecommendation[] => {
    return state.recommendations.filter(r => r.category === category);
  };

  const getTodayPlan = (): DailyPracticePlan | null => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return state.practicePlans.find(plan => {
      const planDate = new Date(plan.date);
      planDate.setHours(0, 0, 0, 0);
      return planDate.getTime() === today.getTime();
    }) || null;
  };

  const value: AIAssistantContextType = {
    state,
    analyzeCode,
    generateRecommendations,
    createDailyPlan,
    updatePracticePlan,
    generateInsights,
    getRecommendationsForCategory,
    getTodayPlan,
    saveAnalysis,
    getAnalyses,
  };

  return (
    <AIAssistantContext.Provider value={value}>
      {children}
    </AIAssistantContext.Provider>
  );
}

export function useAIAssistant() {
  const context = useContext(AIAssistantContext);
  if (context === undefined) {
    throw new Error('useAIAssistant must be used within an AIAssistantProvider');
  }
  return context;
} 