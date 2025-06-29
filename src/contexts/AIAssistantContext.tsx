import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { 
  CodeAnalysis, 
  PracticeRecommendation, 
  DailyPracticePlan, 
  AIInsights,
  LeetCodeProblem 
} from '../types';
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
        model: 'gpt-4.1',
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

  // Load data from localStorage
  useEffect(() => {
    const loadData = () => {
      try {
        const savedAnalyses = localStorage.getItem('leetcode-ai-analyses');
        const savedRecommendations = localStorage.getItem('leetcode-ai-recommendations');
        const savedPlans = localStorage.getItem('leetcode-ai-plans');
        const savedInsights = localStorage.getItem('leetcode-ai-insights');

        if (savedAnalyses) {
          const analyses = JSON.parse(savedAnalyses).map((a: any) => ({
            ...a,
            createdAt: new Date(a.createdAt),
          }));
          dispatch({ type: 'SET_CODE_ANALYSES', payload: analyses });
        }

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

  // Save data to localStorage
  useEffect(() => {
    localStorage.setItem('leetcode-ai-analyses', JSON.stringify(state.codeAnalyses));
    localStorage.setItem('leetcode-ai-recommendations', JSON.stringify(state.recommendations));
    localStorage.setItem('leetcode-ai-plans', JSON.stringify(state.practicePlans));
    if (state.insights) {
      localStorage.setItem('leetcode-ai-insights', JSON.stringify(state.insights));
    }
  }, [state.codeAnalyses, state.recommendations, state.practicePlans, state.insights]);

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

Please provide a detailed analysis including:
1. Code quality assessment (Excellent/Good/Fair/Poor)
2. Time complexity analysis
3. Space complexity analysis
4. Strengths of the solution
5. Areas for improvement
6. Optimization suggestions
7. Alternative approaches

Respond in JSON format with this structure:
{
  "timeComplexity": "O(n)",
  "spaceComplexity": "O(1)",
  "codeQuality": "Good",
  "strengths": ["Clear variable names", "Efficient algorithm"],
  "weaknesses": ["Could use better error handling"],
  "optimizationSuggestions": ["Use a more efficient data structure"],
  "bestPractices": ["Add input validation", "Use meaningful variable names"],
  "alternativeApproaches": ["Dynamic programming approach"],
  "performanceScore": 85,
  "readabilityScore": 90,
  "maintainabilityScore": 80
}
      `;

      const response = await callOpenAI(prompt);
      let analysis;
      try {
        analysis = JSON.parse(response);
      } catch (parseError) {
        console.error('Failed to parse AI response as JSON:', response);
        throw new Error('AI response was not in valid JSON format. Please try again.');
      }
      
      const aiAnalysis: CodeAnalysis = {
        problemId: problem.id,
        analysis: {
          timeComplexity: analysis.timeComplexity,
          spaceComplexity: analysis.spaceComplexity,
          codeQuality: analysis.codeQuality,
          strengths: analysis.strengths,
          weaknesses: analysis.weaknesses,
          optimizationSuggestions: analysis.optimizationSuggestions,
          bestPractices: analysis.bestPractices,
          alternativeApproaches: analysis.alternativeApproaches,
          performanceScore: analysis.performanceScore,
          readabilityScore: analysis.readabilityScore,
          maintainabilityScore: analysis.maintainabilityScore,
        },
        createdAt: new Date(),
      };

      dispatch({ type: 'ADD_CODE_ANALYSIS', payload: aiAnalysis });
      toast.success('Code analysis completed!');
      return aiAnalysis;
    } catch (error) {
      console.error('Code analysis failed:', error);
      toast.error('Failed to analyze code. Please try again.');
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
      
      const prompt = `
Based on the user's LeetCode progress, generate personalized practice recommendations.

Completed Problems: ${completedProblems.length}
In Progress Problems: ${inProgressProblems.length}
Total Problems: ${problems.length}

Completed problem categories: ${[...new Set(completedProblems.map(p => p.category))].join(', ')}
Completed problem difficulties: ${[...new Set(completedProblems.map(p => p.difficulty))].join(', ')}

Please generate 5 personalized practice recommendations. Consider:
1. Weak areas based on completed problems
2. Difficulty progression
3. Category balance
4. Common interview topics

Respond in JSON format with this structure:
{
  "recommendations": [
    {
      "id": "rec1",
      "category": "Arrays",
      "difficulty": "Medium",
      "reason": "You've completed many easy array problems, time to challenge yourself",
      "priority": "High",
      "estimatedTime": 30
    }
  ]
}
      `;

      const response = await callOpenAI(prompt);
      let data;
      try {
        data = JSON.parse(response);
      } catch (parseError) {
        console.error('Failed to parse AI response as JSON:', response);
        throw new Error('AI response was not in valid JSON format. Please try again.');
      }
      
      const recommendations: PracticeRecommendation[] = data.recommendations.map((rec: any) => ({
        ...rec,
        createdAt: new Date(),
      }));

      dispatch({ type: 'SET_RECOMMENDATIONS', payload: recommendations });
      toast.success('Recommendations generated!');
      return recommendations;
    } catch (error) {
      console.error('Recommendation generation failed:', error);
      toast.error('Failed to generate recommendations. Please try again.');
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
1. 3-5 problems of varying difficulty
2. Focus on different categories
3. Estimated time for each problem
4. Learning objectives

Date: ${date.toDateString()}

Respond in JSON format with this structure:
{
  "plan": {
    "id": "plan1",
    "date": "${date.toISOString()}",
    "status": "Pending",
    "estimatedTotalTime": 120,
    "difficultyDistribution": {
      "easy": 1,
      "medium": 2,
      "hard": 1
    },
    "focusAreas": ["Arrays", "Strings", "Dynamic Programming"],
    "problems": [
      {
        "id": "prob1",
        "category": "Arrays",
        "difficulty": "Medium",
        "reason": "Practice two-pointer technique",
        "estimatedTime": 30
      }
    ]
  }
}
      `;

      const response = await callOpenAI(prompt);
      let data;
      try {
        data = JSON.parse(response);
      } catch (parseError) {
        console.error('Failed to parse AI response as JSON:', response);
        throw new Error('AI response was not in valid JSON format. Please try again.');
      }
      
      const practicePlan: DailyPracticePlan = {
        ...data.plan,
        createdAt: new Date(),
      };

      dispatch({ type: 'ADD_PRACTICE_PLAN', payload: practicePlan });
      toast.success('Daily practice plan created!');
      return practicePlan;
    } catch (error) {
      console.error('Daily plan creation failed:', error);
      toast.error('Failed to create daily plan. Please try again.');
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
      toast.success('Practice plan updated!');
    }
  };

  const generateInsights = async (problems: LeetCodeProblem[]): Promise<AIInsights> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const completedProblems = problems.filter(p => p.status === 'Completed');
      const categories = [...new Set(problems.map(p => p.category))];
      const difficulties = [...new Set(problems.map(p => p.difficulty))];
      
      const prompt = `
Analyze the user's LeetCode progress and provide insights.

Total Problems: ${problems.length}
Completed: ${completedProblems.length}
In Progress: ${problems.filter(p => p.status === 'In Progress').length}
Failed: ${problems.filter(p => p.status === 'Failed').length}

Categories: ${categories.join(', ')}
Difficulties: ${difficulties.join(', ')}

Please provide insights in JSON format:
{
  "overallProgress": {
    "completionRate": 75.5,
    "averageAttempts": 2.3,
    "strongestCategory": "Arrays",
    "weakestCategory": "Dynamic Programming",
    "improvementTrend": "Improving"
  },
  "studyPlan": {
    "dailyGoal": 3,
    "weeklyGoal": 15,
    "focusAreas": ["Dynamic Programming", "Graphs"],
    "recommendedDifficulty": "Medium"
  }
}
      `;

      const response = await callOpenAI(prompt);
      let insights: AIInsights;
      try {
        insights = JSON.parse(response);
      } catch (parseError) {
        console.error('Failed to parse AI response as JSON:', response);
        throw new Error('AI response was not in valid JSON format. Please try again.');
      }
      
      dispatch({ type: 'SET_INSIGHTS', payload: insights });
      toast.success('AI insights generated!');
      return insights;
    } catch (error) {
      console.error('Insights generation failed:', error);
      toast.error('Failed to generate insights. Please try again.');
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const getRecommendationsForCategory = (category: string): PracticeRecommendation[] => {
    return state.recommendations.filter(rec => rec.category === category);
  };

  const getTodayPlan = (): DailyPracticePlan | null => {
    const today = new Date().toDateString();
    return state.practicePlans.find(plan => 
      new Date(plan.date).toDateString() === today
    ) || null;
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