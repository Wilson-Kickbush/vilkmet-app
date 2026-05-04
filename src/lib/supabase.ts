import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface PortfolioProject {
  id: string;
  title: string;
  location: string;
  description: string;
  type: string;
  image_url: string;
  created_at?: string;
}

export const portfolioApi = {
  createProject: async (project: Omit<PortfolioProject, 'id' | 'created_at'>): Promise<{ data: any; error: any }> => {
    const { data, error } = await supabase
      .from('portfolio_projects')
      .insert([project])
      .select()
      .single();

    return { data, error };
  },

  getProjects: async (): Promise<{ data: PortfolioProject[] | null; error: any }> => {
    const { data, error } = await supabase
      .from('portfolio_projects')
      .select('*')
      .order('created_at', { ascending: false });

    return { data, error };
  },

  deleteProject: async (id: string): Promise<{ data: any; error: any }> => {
    const { data, error } = await supabase
      .from('portfolio_projects')
      .delete()
      .eq('id', id);

    return { data, error };
  }
};
