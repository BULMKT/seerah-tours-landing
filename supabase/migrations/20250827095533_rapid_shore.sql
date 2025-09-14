-- Seerah Tours Database Setup
-- Copy and paste this entire SQL into Supabase SQL Editor and run it

-- ================================
-- 1. CREATE TABLES
-- ================================

-- Form submissions table with ALL form fields
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
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Daily tips table
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

-- Webinars table
CREATE TABLE IF NOT EXISTS webinars (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  youtube_id text NOT NULL,
  youtube_url text NOT NULL,
  thumbnail_url text,
  duration text,
  tags text[] DEFAULT '{}',
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- PDF guides table
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

-- ================================
-- 2. ENABLE ROW LEVEL SECURITY
-- ================================

ALTER TABLE form_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_tips ENABLE ROW LEVEL SECURITY;
ALTER TABLE webinars ENABLE ROW LEVEL SECURITY;
ALTER TABLE pdf_guides ENABLE ROW LEVEL SECURITY;

-- ================================
-- 3. CREATE SECURITY POLICIES
-- ================================

-- Form submissions - anyone can insert, only authenticated can read
CREATE POLICY "Anyone can submit forms"
  ON form_submissions
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view submissions"
  ON form_submissions
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can update submissions"
  ON form_submissions
  FOR UPDATE
  TO authenticated
  USING (true);

-- Daily tips - public read, authenticated write
CREATE POLICY "Anyone can view active tips"
  ON daily_tips
  FOR SELECT
  USING (is_active = true);

CREATE POLICY "Authenticated users can manage tips"
  ON daily_tips
  FOR ALL
  TO authenticated
  USING (true);

-- Webinars - public read, authenticated write
CREATE POLICY "Anyone can view active webinars"
  ON webinars
  FOR SELECT
  USING (is_active = true);

CREATE POLICY "Authenticated users can manage webinars"
  ON webinars
  FOR ALL
  TO authenticated
  USING (true);

-- PDF guides - public read, authenticated write
CREATE POLICY "Anyone can view active PDFs"
  ON pdf_guides
  FOR SELECT
  USING (is_active = true);

CREATE POLICY "Authenticated users can manage PDFs"
  ON pdf_guides
  FOR ALL
  TO authenticated
  USING (true);

-- ================================
-- 4. CREATE STORAGE BUCKETS
-- ================================

-- Create storage buckets for file uploads
INSERT INTO storage.buckets (id, name, public, allowed_mime_types, file_size_limit)
VALUES 
  ('daily-tips', 'daily-tips', true, ARRAY['image/jpeg', 'image/png', 'image/webp'], 10485760),
  ('pdf-guides', 'pdf-guides', true, ARRAY['application/pdf'], 52428800),
  ('thumbnails', 'thumbnails', true, ARRAY['image/jpeg', 'image/png', 'image/webp'], 5242880)
ON CONFLICT (id) DO NOTHING;

-- ================================
-- 5. STORAGE POLICIES
-- ================================

-- Daily tips bucket policies
CREATE POLICY "Anyone can view tip images"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'daily-tips');

CREATE POLICY "Authenticated users can upload tip images"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'daily-tips');

CREATE POLICY "Authenticated users can update tip images"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'daily-tips');

-- PDF guides bucket policies
CREATE POLICY "Anyone can view PDFs"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'pdf-guides');

CREATE POLICY "Authenticated users can upload PDFs"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'pdf-guides');

-- Thumbnails bucket policies
CREATE POLICY "Anyone can view thumbnails"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'thumbnails');

CREATE POLICY "Authenticated users can upload thumbnails"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'thumbnails');

-- ================================
-- 6. SAMPLE DATA FOR TESTING
-- ================================

-- Insert sample daily tips
INSERT INTO daily_tips (title, description, image_url, category, tags) VALUES
  ('Essential Hajj Packing Checklist', 'Complete list of items you must bring for Hajj', 'https://images.pexels.com/photos/1174952/pexels-photo-1174952.jpeg?auto=compress&cs=tinysrgb&w=1080&h=1350&fit=crop', 'Logistics', '{"Packing", "Preparation", "Checklist"}'),
  ('Duas for Each Hajj Ritual', 'Authentic supplications for every step of your journey', 'https://images.pexels.com/photos/8729093/pexels-photo-8729093.jpeg?auto=compress&cs=tinysrgb&w=1080&h=1350&fit=crop', 'Spiritual', '{"Spiritual", "Duas", "Rituals"}'),
  ('Health Preparation Guide', 'Medical requirements and health tips for pilgrims', 'https://images.pexels.com/photos/4386467/pexels-photo-4386467.jpeg?auto=compress&cs=tinysrgb&w=1080&h=1350&fit=crop', 'Health', '{"Health", "Medical", "Preparation"}'),
  ('Understanding the Hajj Journey', 'Step-by-step overview of the Hajj pilgrimage', 'https://images.pexels.com/photos/8729088/pexels-photo-8729088.jpeg?auto=compress&cs=tinysrgb&w=1715&h=1080&fit=crop', 'Education', '{"Journey", "Overview", "Steps"}'),
  ('Financial Planning for Hajj', 'Budgeting tips and cost considerations', 'https://images.pexels.com/photos/6863183/pexels-photo-6863183.jpeg?auto=compress&cs=tinysrgb&w=1080&h=1350&fit=crop', 'Planning', '{"Budget", "Financial", "Planning"}'),
  ('Spiritual Preparation Checklist', 'Preparing your heart and soul for the sacred journey', 'https://images.pexels.com/photos/8112093/pexels-photo-8112093.jpeg?auto=compress&cs=tinysrgb&w=1715&h=1080&fit=crop', 'Spiritual', '{"Spiritual", "Heart", "Soul", "Preparation"}');

-- Insert sample webinars
INSERT INTO webinars (title, description, youtube_id, youtube_url, thumbnail_url, duration, tags) VALUES
  ('Complete Hajj Preparation Workshop', 'Comprehensive 2-hour workshop covering all aspects of Hajj preparation', 'dQw4w9WgXcQ', 'https://youtube.com/watch?v=dQw4w9WgXcQ', 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg', '1:45:30', '{"Complete Guide", "Workshop", "Preparation"}'),
  ('Hajj Health & Safety Guidelines', 'Essential health precautions and safety measures for pilgrims', 'dQw4w9WgXcQ', 'https://youtube.com/watch?v=dQw4w9WgXcQ', 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg', '32:15', '{"Health", "Safety", "Medical"}'),
  ('Spiritual Preparation for Hajj', 'Preparing your heart and mind for this sacred journey', 'dQw4w9WgXcQ', 'https://youtube.com/watch?v=dQw4w9WgXcQ', 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg', '58:45', '{"Spiritual", "Heart", "Preparation"}');

-- Insert sample PDF guides
INSERT INTO pdf_guides (title, description, pdf_url, thumbnail_url, file_size, tags) VALUES
  ('Complete Hajj Preparation Manual', 'Comprehensive 50-page guide covering every aspect of Hajj preparation', '/guides/hajj-preparation-manual.pdf', 'https://images.pexels.com/photos/1174952/pexels-photo-1174952.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&fit=crop', '2.5 MB', '{"Complete Guide", "Manual", "Preparation"}'),
  ('Hajj Packing Checklist', 'Detailed checklist with categories for all items you need to pack', '/guides/hajj-packing-checklist.pdf', 'https://images.pexels.com/photos/1174952/pexels-photo-1174952.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&fit=crop', '1.2 MB', '{"Packing", "Checklist", "Items"}'),
  ('Hajj Duas & Supplications', 'Collection of authentic duas for every step of your Hajj journey', '/guides/hajj-duas.pdf', 'https://images.pexels.com/photos/8729093/pexels-photo-8729093.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&fit=crop', '1.8 MB', '{"Duas", "Spiritual", "Supplications"}');

-- Insert sample form submission for testing
INSERT INTO form_submissions (
  full_name, email, phone, city_country, previous_experience, hajj_status, 
  travelling_with, traveller_count, travel_window, departure_city, budget_comfort,
  rooming_preference, guidance_level, language_preference, mobility_considerations,
  visa_help, call_goals, hear_about_us, communication_preference
) VALUES (
  'Ahmed Hassan', 'ahmed.hassan@email.com', '+44 7123 456789', 'Birmingham, UK',
  'Umrah', 'Seriously considering', 'Spouse/Family', 4, 'June 2026', 
  'Birmingham Airport', 'Standard', 'Double/Twin', 'Full guided program',
  '{"English", "Urdu"}', 'Elderly parents need wheelchair access',
  'Yes', 'Want to understand the different packages and what preparation is needed for my family of 4. Especially concerned about health requirements for elderly parents.',
  'Friend/Family', 'WhatsApp'
);

-- ================================
-- 7. CREATE UPDATED_AT TRIGGER FUNCTION
-- ================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers to update updated_at automatically
CREATE TRIGGER update_form_submissions_updated_at 
  BEFORE UPDATE ON form_submissions 
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_daily_tips_updated_at 
  BEFORE UPDATE ON daily_tips 
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_webinars_updated_at 
  BEFORE UPDATE ON webinars 
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_pdf_guides_updated_at 
  BEFORE UPDATE ON pdf_guides 
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- ================================
-- SETUP COMPLETE! 🎉
-- ================================
-- Your database is ready with:
-- ✅ All tables created
-- ✅ Security policies configured  
-- ✅ Storage buckets for file uploads
-- ✅ Sample data for testing
-- ✅ Automatic timestamp updates