import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable');
}

if (!supabaseAnonKey) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable');
}

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Admin client for server-side operations (if needed)
export const supabaseAdmin = createClient(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseAnonKey
);

// Database types (optional but helpful for TypeScript)
export interface FormSubmission {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  city_country: string;
  previous_experience: string;
  hajj_status: string;
  travelling_with: string;
  traveller_count?: number;
  travel_window?: string;
  departure_city?: string;
  budget_comfort?: string;
  rooming_preference?: string;
  guidance_level?: string;
  language_preference?: string[];
  mobility_considerations?: string;
  visa_help?: string;
  call_goals: string;
  hear_about_us?: string;
  hear_about_us_other?: string;
  communication_preference?: string;
  consent: boolean;
  status?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface DailyTip {
  id: string;
  title: string;
  description: string;
  image_url: string;
  category: string;
  tags: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Webinar {
  id: string;
  title: string;
  description: string;
  youtube_id: string;
  youtube_url: string;
  thumbnail_url?: string;
  duration?: string;
  tags: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface PDFGuide {
  id: string;
  title: string;
  description: string;
  pdf_url: string;
  thumbnail_url?: string;
  file_size?: string;
  tags: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Helper functions for common operations
export const uploadFile = async (
  bucket: string, 
  file: File, 
  fileName: string
): Promise<string | null> => {
  try {
    const fileExt = file.name.split('.').pop();
    const finalFileName = `${fileName}.${fileExt}`;
    
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(finalFileName, file);
    
    if (error) throw error;
    
    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(finalFileName);
    
    return publicUrl;
  } catch (error) {
    console.error('File upload error:', error);
    return null;
  }
};

export const getYoutubeThumbnail = (youtubeId: string): string => {
  return `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`;
};

export const extractYoutubeId = (url: string): string | null => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};