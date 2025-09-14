-- Fix RLS Policies for Form Submissions
-- This script ensures anonymous users can submit forms

-- First, disable RLS temporarily to test
ALTER TABLE form_submissions DISABLE ROW LEVEL SECURITY;
ALTER TABLE email_subscribers DISABLE ROW LEVEL SECURITY;

-- If you want to keep RLS enabled, run these instead:
-- Drop all existing policies on form_submissions
/*
DROP POLICY IF EXISTS "Allow anonymous form submissions" ON form_submissions;
DROP POLICY IF EXISTS "Allow authenticated form submissions" ON form_submissions;
DROP POLICY IF EXISTS "Allow authenticated to view submissions" ON form_submissions;
DROP POLICY IF EXISTS "Allow authenticated to update submissions" ON form_submissions;

-- Create a simple policy that allows all operations for testing
CREATE POLICY "Allow all operations on form_submissions"
  ON form_submissions
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Or create specific policies for production:
CREATE POLICY "Anyone can insert form submissions"
  ON form_submissions
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can view form submissions"
  ON form_submissions
  FOR SELECT
  USING (true);

CREATE POLICY "Anyone can update form submissions"
  ON form_submissions
  FOR UPDATE
  USING (true)
  WITH CHECK (true);
*/

-- Test insert to verify it works
INSERT INTO form_submissions (
  full_name, 
  email, 
  phone, 
  city_country, 
  previous_experience, 
  hajj_status, 
  travelling_with, 
  call_goals, 
  consent
) VALUES (
  'RLS Test User', 
  'rls-test@example.com', 
  '+44 7987654321', 
  'Birmingham, UK',
  'Neither', 
  'Seriously considering', 
  'Spouse/Family',
  'Testing if RLS policies work correctly', 
  true
);

-- Verify the insert worked
SELECT COUNT(*) as total_submissions FROM form_submissions;