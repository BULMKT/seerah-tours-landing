# Deployment Guide for Seerah Tours Landing Page

## 📝 Prerequisites

1. **Supabase Database Setup**
   - Create a Supabase project at [supabase.com](https://supabase.com)
   - Run the SQL script in `fix-rls-policies.sql` in the Supabase SQL editor
   - Copy your Supabase credentials

2. **Calendly Account**
   - Get your Calendly scheduling link
   - Update the URL in `/app/form/page.tsx` (line 187)

3. **Environment Variables**
   - Copy `.env.example` to `.env.local`
   - Update all values with your actual credentials

## 🚀 Netlify Deployment

### Method 1: Deploy via GitHub (Recommended)

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   ```

2. **Connect to Netlify**
   - Go to [app.netlify.com](https://app.netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Select GitHub and authorize
   - Choose your repository
   - Configure build settings:
     - Build command: `npm run build`
     - Publish directory: `.next`
   - Click "Deploy site"

3. **Add Environment Variables in Netlify**
   - Go to Site settings → Environment variables
   - Add all variables from your `.env` file:
     ```
     NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
     SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
     CONVERTKIT_API_KEY=your-convertkit-key
     CONVERTKIT_API_SECRET=your-convertkit-secret
     CONVERTKIT_FORM_ID=your-form-id
     AIRTABLE_PAT=your-airtable-pat
     AIRTABLE_BASE_ID=your-base-id
     NEXT_PUBLIC_WHATSAPP_LINK=your-whatsapp-link
     ```

### Method 2: Deploy via Netlify CLI

1. **Install Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **Login to Netlify**
   ```bash
   netlify login
   ```

3. **Build the project**
   ```bash
   npm run build
   ```

4. **Deploy to Netlify**
   ```bash
   netlify deploy --prod --dir=.next
   ```

5. **Set environment variables**
   ```bash
   netlify env:set NEXT_PUBLIC_SUPABASE_URL "your-value"
   netlify env:set NEXT_PUBLIC_SUPABASE_ANON_KEY "your-value"
   # ... repeat for all variables
   ```

### Method 3: Manual Deploy via Netlify UI

1. **Build locally**
   ```bash
   npm run build
   ```

2. **Create deployment package**
   ```bash
   zip -r deploy.zip .next package.json netlify.toml public
   ```

3. **Upload to Netlify**
   - Go to [app.netlify.com](https://app.netlify.com)
   - Drag and drop the `deploy.zip` file
   - Configure environment variables in site settings

## 🔧 Post-Deployment Setup

### 1. Update Calendly Integration
- Edit `/app/form/page.tsx`
- Replace `https://calendly.com/your-calendly-url` with your actual Calendly link
- Commit and push changes

### 2. Configure Supabase RLS Policies
Run this SQL in your Supabase SQL editor:
```sql
-- Disable RLS for testing (not recommended for production)
ALTER TABLE form_submissions DISABLE ROW LEVEL SECURITY;
ALTER TABLE email_subscribers DISABLE ROW LEVEL SECURITY;

-- Or configure proper RLS policies (recommended)
-- See fix-rls-policies.sql for production-ready policies
```

### 3. Test Form Submission
1. Visit `/form` on your deployed site
2. Fill out and submit the form
3. Check Supabase dashboard for the submission
4. Visit `/admin` to view submissions

### 4. Update WhatsApp Link
- Update `WHATSAPP_GROUP_LINK` in `/app/page.tsx` (line 17)
- Update environment variable `NEXT_PUBLIC_WHATSAPP_LINK`

## 🐛 Troubleshooting

### Build Fails
- Check Node version (should be 18+)
- Clear cache: `rm -rf .next node_modules`
- Reinstall: `npm install`
- Rebuild: `npm run build`

### Form Submission Fails
- Check Supabase RLS policies
- Verify environment variables are set correctly
- Check browser console for errors
- Review Netlify function logs

### Admin Panel Issues
- Ensure Supabase tables are created
- Check browser console for API errors
- Verify service role key is set

### Calendly Not Loading
- Ensure you've added your Calendly URL
- Check if Calendly scripts are blocked by ad blockers
- Verify the URL format is correct

## 📱 Custom Domain Setup

1. In Netlify, go to Domain settings
2. Add custom domain
3. Follow DNS configuration instructions
4. Enable HTTPS (automatic with Netlify)

## 🔒 Security Checklist

- [ ] Environment variables are set in Netlify (not committed to git)
- [ ] Supabase RLS policies are enabled
- [ ] API keys are kept secret
- [ ] HTTPS is enabled
- [ ] Form has proper validation
- [ ] Admin panel has authentication (to be implemented)

## 📊 Monitoring

- Use Netlify Analytics to track visitors
- Monitor Supabase dashboard for form submissions
- Check Netlify Functions tab for API logs
- Set up error tracking (e.g., Sentry) if needed

## 🚨 Important Notes

1. **Never commit `.env` files** to version control
2. **Always use environment variables** for sensitive data
3. **Test thoroughly** before promoting to production
4. **Keep dependencies updated** for security
5. **Regular backups** of Supabase data

## 📞 Support

For issues with:
- **Netlify**: Check [docs.netlify.com](https://docs.netlify.com)
- **Supabase**: Visit [supabase.com/docs](https://supabase.com/docs)
- **Next.js**: See [nextjs.org/docs](https://nextjs.org/docs)

## 🎉 Success Checklist

- [ ] Site is live on Netlify
- [ ] Custom domain configured
- [ ] Form submissions working
- [ ] Admin panel accessible
- [ ] WhatsApp redirect working
- [ ] Calendly integration functional
- [ ] All environment variables set
- [ ] SSL certificate active
- [ ] Mobile responsive tested
- [ ] Page load speed optimized