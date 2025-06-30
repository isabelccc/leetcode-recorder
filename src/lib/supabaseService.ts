import { supabase } from './supabase';
import { LeetCodeProblem } from '../types';

// Problem operations
export const problemService = {
  // Get all problems for a user
  async getProblems(userId: string): Promise<LeetCodeProblem[]> {
    const { data, error } = await supabase
      .from('problems')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching problems:', error);
      throw error;
    }

    return data?.map(problem => ({
      id: problem.id,
      title: problem.title,
      difficulty: problem.difficulty,
      category: problem.category,
      status: problem.status,
      notes: problem.notes || '',
      solution: problem.solution || '',
      language: problem.language || '',
      timeComplexity: problem.time_complexity || '',
      spaceComplexity: problem.space_complexity || '',
      tags: problem.tags || [],
      url: problem.url || '',
      attempts: problem.attempts || 0,
      completedAt: problem.completed_at ? new Date(problem.completed_at) : undefined,
      createdAt: new Date(problem.created_at),
      updatedAt: new Date(problem.updated_at),
      isStarred: problem.is_starred || false,
    })) || [];
  },

  // Get a single problem
  async getProblem(id: string, userId: string): Promise<LeetCodeProblem | null> {
    const { data, error } = await supabase
      .from('problems')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error('Error fetching problem:', error);
      return null;
    }

    if (!data) return null;

    return {
      id: data.id,
      title: data.title,
      difficulty: data.difficulty,
      category: data.category,
      status: data.status,
      notes: data.notes || '',
      solution: data.solution || '',
      language: data.language || '',
      timeComplexity: data.time_complexity || '',
      spaceComplexity: data.space_complexity || '',
      tags: data.tags || [],
      url: data.url || '',
      attempts: data.attempts || 0,
      completedAt: data.completed_at ? new Date(data.completed_at) : undefined,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
      isStarred: data.is_starred || false,
    };
  },

  // Create a new problem
  async createProblem(problem: Omit<LeetCodeProblem, 'id' | 'createdAt' | 'updatedAt'>, userId: string): Promise<LeetCodeProblem> {
    const { data, error } = await supabase
      .from('problems')
      .insert({
        title: problem.title,
        difficulty: problem.difficulty,
        category: problem.category,
        status: problem.status,
        notes: problem.notes,
        solution: problem.solution,
        language: problem.language,
        time_complexity: problem.timeComplexity,
        space_complexity: problem.spaceComplexity,
        tags: problem.tags,
        url: problem.url,
        attempts: problem.attempts,
        completed_at: problem.completedAt?.toISOString(),
        user_id: userId,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating problem:', error);
      throw error;
    }

    return {
      id: data.id,
      title: data.title,
      difficulty: data.difficulty,
      category: data.category,
      status: data.status,
      notes: data.notes || '',
      solution: data.solution || '',
      language: data.language || '',
      timeComplexity: data.time_complexity || '',
      spaceComplexity: data.space_complexity || '',
      tags: data.tags || [],
      url: data.url || '',
      attempts: data.attempts || 0,
      completedAt: data.completed_at ? new Date(data.completed_at) : undefined,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
      isStarred: data.is_starred || false,
    };
  },

  // Update a problem
  async updateProblem(id: string, updates: Partial<LeetCodeProblem>, userId: string): Promise<LeetCodeProblem> {
    const updateData: any = {
      updated_at: new Date().toISOString(),
    };

    if (updates.title !== undefined) updateData.title = updates.title;
    if (updates.difficulty !== undefined) updateData.difficulty = updates.difficulty;
    if (updates.category !== undefined) updateData.category = updates.category;
    if (updates.status !== undefined) updateData.status = updates.status;
    if (updates.notes !== undefined) updateData.notes = updates.notes;
    if (updates.solution !== undefined) updateData.solution = updates.solution;
    if (updates.language !== undefined) updateData.language = updates.language;
    if (updates.timeComplexity !== undefined) updateData.time_complexity = updates.timeComplexity;
    if (updates.spaceComplexity !== undefined) updateData.space_complexity = updates.spaceComplexity;
    if (updates.tags !== undefined) updateData.tags = updates.tags;
    if (updates.url !== undefined) updateData.url = updates.url;
    if (updates.attempts !== undefined) updateData.attempts = updates.attempts;
    if (updates.completedAt !== undefined) updateData.completed_at = updates.completedAt?.toISOString();
    if (updates.isStarred !== undefined) updateData.is_starred = updates.isStarred;

    const { data, error } = await supabase
      .from('problems')
      .update(updateData)
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      console.error('Error updating problem:', error);
      throw error;
    }

    return {
      id: data.id,
      title: data.title,
      difficulty: data.difficulty,
      category: data.category,
      status: data.status,
      notes: data.notes || '',
      solution: data.solution || '',
      language: data.language || '',
      timeComplexity: data.time_complexity || '',
      spaceComplexity: data.space_complexity || '',
      tags: data.tags || [],
      url: data.url || '',
      attempts: data.attempts || 0,
      completedAt: data.completed_at ? new Date(data.completed_at) : undefined,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
      isStarred: data.is_starred || false,
    };
  },

  // Delete a problem
  async deleteProblem(id: string, userId: string): Promise<void> {
    const { error } = await supabase
      .from('problems')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) {
      console.error('Error deleting problem:', error);
      throw error;
    }
  },

  // Toggle star status of a problem
  async toggleStar(id: string, userId: string): Promise<boolean> {
    // First get the current star status
    const { data: currentProblem, error: fetchError } = await supabase
      .from('problems')
      .select('is_starred')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (fetchError) {
      console.error('Error fetching problem for star toggle:', fetchError);
      throw fetchError;
    }

    const newStarStatus = !(currentProblem?.is_starred || false);

    // Update the star status
    const { error: updateError } = await supabase
      .from('problems')
      .update({ is_starred: newStarStatus })
      .eq('id', id)
      .eq('user_id', userId);

    if (updateError) {
      console.error('Error updating star status:', updateError);
      throw updateError;
    }

    return newStarStatus;
  },

  // Search problems
  async searchProblems(query: string, userId: string): Promise<LeetCodeProblem[]> {
    const { data, error } = await supabase
      .from('problems')
      .select('*')
      .eq('user_id', userId)
      .or(`title.ilike.%${query}%,category.ilike.%${query}%`)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error searching problems:', error);
      throw error;
    }

    return data?.map(problem => ({
      id: problem.id,
      title: problem.title,
      difficulty: problem.difficulty,
      category: problem.category,
      status: problem.status,
      notes: problem.notes || '',
      solution: problem.solution || '',
      language: problem.language || '',
      timeComplexity: problem.time_complexity || '',
      spaceComplexity: problem.space_complexity || '',
      tags: problem.tags || [],
      url: problem.url || '',
      attempts: problem.attempts || 0,
      completedAt: problem.completed_at ? new Date(problem.completed_at) : undefined,
      createdAt: new Date(problem.created_at),
      updatedAt: new Date(problem.updated_at),
      isStarred: problem.is_starred || false,
    })) || [];
  },
};

// AI Analysis operations
export const aiAnalysisService = {
  // Save AI analysis
  async saveAnalysis(problemId: string, analysis: string, userId: string): Promise<void> {
    const { error } = await supabase
      .from('ai_analyses')
      .insert({
        problem_id: problemId,
        analysis,
        user_id: userId,
      });

    if (error) {
      console.error('Error saving AI analysis:', error);
      throw error;
    }
  },

  // Get AI analyses for a problem
  async getAnalyses(problemId: string, userId: string): Promise<any[]> {
    const { data, error } = await supabase
      .from('ai_analyses')
      .select('*')
      .eq('problem_id', problemId)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching AI analyses:', error);
      throw error;
    }

    return data || [];
  },
};

// User operations
export const userService = {
  // Get current user
  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error) {
      console.error('Error getting current user:', error);
      return null;
    }

    return user;
  },

  // Get user profile
  async getUserProfile(userId: string) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }

    return data;
  },

  // Update user profile
  async updateUserProfile(userId: string, updates: { name?: string; role?: 'user' | 'admin' }) {
    const { data, error } = await supabase
      .from('users')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }

    return data;
  },
}; 