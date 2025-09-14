@@ .. @@
   updated_at timestamptz DEFAULT now()
 );

+-- Email subscribers table  
+CREATE TABLE IF NOT EXISTS email_subscribers (
+  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
+  email text UNIQUE NOT NULL,
+  source text DEFAULT 'website',
+  status text DEFAULT 'active',
+  subscribed_at timestamptz DEFAULT now(),
+  updated_at timestamptz DEFAULT now()
+);
+
 -- ================================
 -- 2. ENABLE ROW LEVEL SECURITY
 -- ================================

 ALTER TABLE form_submissions ENABLE ROW LEVEL SECURITY;
 ALTER TABLE daily_tips ENABLE ROW LEVEL SECURITY;
 ALTER TABLE webinars ENABLE ROW LEVEL SECURITY;
 ALTER TABLE pdf_guides ENABLE ROW LEVEL SECURITY;
+ALTER TABLE email_subscribers ENABLE ROW LEVEL SECURITY;

 -- ================================
 -- 3. CREATE SECURITY POLICIES
 -- ================================

 -- Form submissions - anyone can insert, only authenticated can read
-CREATE POLICY "Anyone can submit forms"
+CREATE POLICY "Anyone can submit forms" 
   ON form_submissions
   FOR INSERT
+  TO anon, authenticated
   WITH CHECK (true);

 CREATE POLICY "Authenticated users can view submissions"
@@ .. @@
   FOR UPDATE
   TO authenticated
   USING (true);

+-- Email subscribers - anyone can subscribe, authenticated can manage
+CREATE POLICY "Anyone can subscribe to emails"
+  ON email_subscribers  
+  FOR INSERT
+  TO anon, authenticated
+  WITH CHECK (true);
+
+CREATE POLICY "Authenticated users can view subscribers"
+  ON email_subscribers
+  FOR SELECT
+  TO authenticated
+  USING (true);
+
+CREATE POLICY "Authenticated users can update subscribers"
+  ON email_subscribers
+  FOR UPDATE
+  TO authenticated
+  USING (true);
+
 -- Daily tips - public read, authenticated write
 CREATE POLICY "Anyone can view active tips"
@@ .. @@
 CREATE TRIGGER update_pdf_guides_updated_at 
   BEFORE UPDATE ON pdf_guides 
   FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

+CREATE TRIGGER update_email_subscribers_updated_at 
+  BEFORE UPDATE ON email_subscribers 
+  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
+
 -- ================================