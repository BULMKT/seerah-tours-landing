/*
  # Admin Dashboard System

  1. New Tables
    - `form_submissions` - Store Hajj preparation form submissions with all fields
    - `daily_tips` - Store Instagram-style tip images and content  
    - `webinars` - Store YouTube webinar information
    - `pdf_guides` - Store PDF guide information with thumbnails

  2. Security
    - Enable RLS on all tables
    - Add policies for admin access and public read access

  3. Storage Buckets
    - Set up storage for tip images, PDF files, and thumbnails
*/

-- Create form_submissions table with all form fields
CREATE TABLE IF NOT EXISTS form_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  city_country text NOT NULL,
  previous_experience text NOT NULL,
  hajj_status text NOT NULL,
  travelling_with text NOT NULL,
  traveller_count integer,
  travel_window text,
  departure_city text,
  budget_comfort text,
  rooming_preference text,
  guidance_level text,
  language_preference text[],
  mobility_considerations text,
  visa_help text,
  call_goals text NOT NULL,
  hear_about_us text,
  hear_about_us_other text,
  communication_preference text,
  consent boolean NOT NULL DEFAULT true,
  status text DEFAULT 'new',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create daily_tips table for Instagram-style tips
CREATE TABLE IF NOT EXISTS daily_tips (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  image_url text NOT NULL,
  category text NOT NULL,
  tags text[] DEFAULT '{}',
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create webinars table for YouTube videos
CREATE TABLE IF NOT EXISTS webinars (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  youtube_id text NOT NULL,
  thumbnail_url text,
  duration text,
  tags text[] DEFAULT '{}',
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create pdf_guides table for downloadable guides
CREATE TABLE IF NOT EXISTS pdf_guides (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  pdf_url text NOT NULL,
  thumbnail_url text,
  file_size text,
  tags text[] DEFAULT '{}',
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE form_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_tips ENABLE ROW LEVEL SECURITY;
ALTER TABLE webinars ENABLE ROW LEVEL SECURITY;
ALTER TABLE pdf_guides ENABLE ROW LEVEL SECURITY;

-- Policies for form_submissions (admin can view all)
CREATE POLICY "Admin can view all submissions"
  ON form_submissions
  FOR SELECT
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Anyone can insert submissions"
  ON form_submissions
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Policies for daily_tips (public read, admin manage)
CREATE POLICY "Anyone can view active tips"
  ON daily_tips
  FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admin can manage tips"
  ON daily_tips
  FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin');

-- Policies for webinars (public read, admin manage)
CREATE POLICY "Anyone can view active webinars"
  ON webinars
  FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admin can manage webinars"
  ON webinars
  FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin');

-- Policies for pdf_guides (public read, admin manage)
CREATE POLICY "Anyone can view active PDFs"
  ON pdf_guides
  FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admin can manage PDFs"
  ON pdf_guides
  FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin');

-- Insert sample data for testing
INSERT INTO daily_tips (title, description, image_url, category, tags) VALUES
  ('Essential Hajj Packing Checklist', 'Complete list of items you must bring for Hajj', 'https://images.pexels.com/photos/1174952/pexels-photo-1174952.jpeg?auto=compress&cs=tinysrgb&w=1080&h=1350&fit=crop', 'Logistics', '{"Packing", "Preparation", "Checklist"}'),
  ('Duas for Each Hajj Ritual', 'Authentic supplications for every step of your journey', 'https://images.pexels.com/photos/8729093/pexels-photo-8729093.jpeg?auto=compress&cs=tinysrgb&w=1080&h=1350&fit=crop', 'Spiritual', '{"Spiritual", "Duas", "Rituals"}'),
  ('Health Preparation Guide', 'Medical requirements and health tips for pilgrims', 'https://images.pexels.com/photos/4386467/pexels-photo-4386467.jpeg?auto=compress&cs=tinysrgb&w=1080&h=1350&fit=crop', 'Health', '{"Health", "Medical", "Preparation"}');

INSERT INTO webinars (title, description, youtube_id, thumbnail_url, duration, tags) VALUES
  ('Complete Hajj Preparation Workshop', 'Comprehensive 2-hour workshop covering all aspects of Hajj preparation', 'dQw4w9WgXcQ', 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg', '1:45:30', '{"Complete Guide", "Workshop", "Preparation"}'),
  ('Hajj Health & Safety Guidelines', 'Essential health precautions and safety measures for pilgrims', 'dQw4w9WgXcQ', 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg', '32:15', '{"Health", "Safety", "Medical"}');

INSERT INTO pdf_guides (title, description, pdf_url, thumbnail_url, file_size, tags) VALUES
  ('Complete Hajj Preparation Manual', 'Comprehensive 50-page guide covering every aspect of Hajj preparation', '/guides/hajj-preparation-manual.pdf', 'https://images.pexels.com/photos/1174952/pexels-photo-1174952.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&fit=crop', '2.5 MB', '{"Complete Guide", "Manual", "Preparation"}'),
  ('Hajj Packing Checklist', 'Detailed checklist with categories for all items you need to pack', '/guides/hajj-packing-checklist.pdf', 'https://images.pexels.com/photos/1174952/pexels-photo-1174952.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&fit=crop', '1.2 MB', '{"Packing", "Checklist", "Items"}');