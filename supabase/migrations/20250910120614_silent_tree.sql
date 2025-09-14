/*
  # Safe Migration - Fix Existing Schema Issues

  This migration safely adds missing components and fixes RLS policies
  without conflicting with existing database objects.

  1. Add missing email_subscribers table if it doesn't exist
  2. Safely recreate RLS policies with proper permissions
  3. Add missing triggers and functions
*/

-- ================================
-- 1. ADD MISSING EMAIL_SUBSCRIBERS TABLE
-- ================================

-- Email subscribers table (only create if it doesn't exist)
CREATE TABLE IF NOT EXISTS email_subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  source text DEFAULT 'website',
  status text DEFAULT 'active',
  subscribed_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS on email_subscribers
ALTER TABLE email_subscribers ENABLE ROW LEVEL SECURITY;

-- ================================
-- 2. FIX RLS POLICIES SAFELY
-- ================================

-- Drop and recreate form_submissions policies with correct permissions
DROP POLICY IF EXISTS "Anyone can submit forms" ON form_submissions;
CREATE POLICY "Anyone can submit forms" 
  ON form_submissions
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Email subscribers policies (safe creation)
DROP POLICY IF EXISTS "Anyone can subscribe to emails" ON email_subscribers;
CREATE POLICY "Anyone can subscribe to emails"
  ON email_subscribers  
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users can view subscribers" ON email_subscribers;
CREATE POLICY "Authenticated users can view subscribers"
  ON email_subscribers
  FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Authenticated users can update subscribers" ON email_subscribers;
CREATE POLICY "Authenticated users can update subscribers"
  ON email_subscribers
  FOR UPDATE
  TO authenticated
  USING (true);

-- ================================
-- 3. ADD MISSING TRIGGERS
-- ================================

-- Create trigger for email_subscribers if it doesn't exist
DROP TRIGGER IF EXISTS update_email_subscribers_updated_at ON email_subscribers;
CREATE TRIGGER update_email_subscribers_updated_at 
  BEFORE UPDATE ON email_subscribers 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ================================
-- 4. ADD SAMPLE EMAIL SUBSCRIBER
-- ================================

-- Insert a test email subscriber (only if table is empty)
INSERT INTO email_subscribers (email, source, status)
SELECT 'test@example.com', 'website_signup', 'active'
WHERE NOT EXISTS (SELECT 1 FROM email_subscribers LIMIT 1);

-- ================================
-- MIGRATION COMPLETE! ✅
-- ================================
-- This migration safely:
-- ✅ Added missing email_subscribers table
-- ✅ Fixed RLS policies with proper anon access
-- ✅ Added required triggers
-- ✅ Added sample data for testing