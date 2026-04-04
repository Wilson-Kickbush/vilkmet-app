import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Tipos para TypeScript
export interface PortfolioProject {
  id: string;
  title: string;
  location: string;
  description: string;
  type: string;
  image_url: string;
  created_at?: string;
}

// Funciones específicas para portfolio
export const portfolioApi = {
  // Subir imagen al storage
  uploadImage: async (file: File): Promise<{ data: any; error: any }> => {
    // Sanitizar nombre del archivo con protección contra undefined
    const originalName = file.name || 'image.jpg';
    const sanitizedName = originalName.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9.-]/g, '');
    const fileName = `${Date.now()}-${sanitizedName}`;
    
    const { data, error } = await supabase.storage
      .from('portfolio-images')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });
    
    return { data, error };
  },

  // Obtener URL pública de la imagen
  getImageUrl: (fileName: string): string => {
    const { data } = supabase.storage
      .from('portfolio-images')
      .getPublicUrl(fileName);
    return data.publicUrl;
  },

  // Crear proyecto en la base de datos
  createProject: async (project: Omit<PortfolioProject, 'id' | 'created_at'>): Promise<{ data: any; error: any }> => {
    const { data, error } = await supabase
      .from('portfolio_projects')
      .insert([project])
      .select()
      .single();
    
    return { data, error };
  },

  // Obtener todos los proyectos
  getProjects: async (): Promise<{ data: PortfolioProject[] | null; error: any }> => {
    const { data, error } = await supabase
      .from('portfolio_projects')
      .select('*')
      .order('created_at', { ascending: false });
    
    return { data, error };
  },

  // Eliminar proyecto
  deleteProject: async (id: string, imageUrl: string): Promise<{ data: any; error: any }> => {
    // Extraer nombre del archivo de la URL con protección
    const fileName = imageUrl?.split('/').pop() || '';
    
    // Eliminar de storage solo si hay nombre de archivo
    if (fileName && fileName.length > 0) {
      await supabase.storage
        .from('portfolio-images')
        .remove([fileName]);
    }

    // Eliminar de la base de datos
    const { data, error } = await supabase
      .from('portfolio_projects')
      .delete()
      .eq('id', id);
    
    return { data, error };
  }
};