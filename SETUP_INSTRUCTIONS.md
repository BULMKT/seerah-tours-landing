# 🕋 Seerah Tours Landing Page - Complete Setup Instructions

## Project Overview
A complete landing page system for Hajj preparation services with:
- ✅ WhatsApp group redirect functionality
- ✅ Custom form with Supabase integration
- ✅ Admin CRM panel for lead management
- ✅ Calendly integration for booking calls
- ✅ Resource management system
- ✅ Email subscription system

## 🔴 Current Issues & Solutions

### 1. Form Submission Error (RLS Policy)
**Problem**: Form submissions fail with "row-level security policy" error

**Solution**: Run this SQL in Supabase:
```sql
-- Quick fix (for testing only)
ALTER TABLE form_submissions DISABLE ROW LEVEL SECURITY;
ALTER TABLE email_subscribers DISABLE ROW LEVEL SECURITY;
```

For production, use the SQL in `fix-rls-policies.sql`

### 2. Calendly Integration
**Problem**: Calendly widget shows placeholder

**Solution**: 
1. Get your Calendly URL from your Calendly account
2. Edit `/app/form/page.tsx` line 187
3. Replace `https://calendly.com/your-calendly-url` with your actual URL

### 3. WhatsApp Link
**Problem**: WhatsApp redirect uses placeholder link

**Solution**:
1. Edit `/app/page.tsx` line 17
2. Replace with your actual WhatsApp group link

## 🚀 Quick Start Guide

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Configure Environment Variables
Create `.env.local` file:
```env
# Supabase (REQUIRED)
NEXT_PUBLIC_SUPABASE_URL=https://rugrophvhntterohblpc.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# ConvertKit (Optional)
CONVERTKIT_API_KEY=your-key
CONVERTKIT_API_SECRET=your-secret
CONVERTKIT_FORM_ID=your-form-id

# Airtable (Optional - backup for forms)
AIRTABLE_PAT=your-pat
AIRTABLE_BASE_ID=your-base-id
AIRTABLE_TABLE_NAME=Form Submissions

# WhatsApp
NEXT_PUBLIC_WHATSAPP_LINK=https://chat.whatsapp.com/YOUR-GROUP-LINK
```

### Step 3: Setup Supabase Database
1. Go to your Supabase project SQL editor
2. Run the SQL from `fix-rls-policies.sql`
3. Verify tables are created in Table Editor

### Step 4: Run Development Server
```bash
npm run dev
```

Visit:
- Landing page: http://localhost:3000
- Form: http://localhost:3000/form
- Admin Panel: http://localhost:3000/admin
- Resources: http://localhost:3000/resources

## 📋 Features Status

### ✅ Working Features
- Landing page with animations
- WhatsApp floating button
- Countdown timer
- Social proof components
- FAQ section
- Testimonials carousel
- Form page structure
- Admin panel UI
- Resource pages

### ⚠️ Needs Configuration
- Form submission to Supabase (RLS policies)
- Calendly widget (needs your URL)
- WhatsApp group link
- Email subscription (ConvertKit)
- File uploads (Supabase storage)

### 🔧 To Implement
- Admin authentication
- Resource upload functionality
- Email automation
- Analytics tracking
- SEO optimisation

## 📁 Project Structure
```
/
├── app/                    # Next.js app directory
│   ├── page.tsx           # Landing page
│   ├── form/              # Form page
│   ├── admin/             # Admin panel
│   ├── resources/         # Resources page
│   └── api/               # API routes
├── components/            # React components
├── lib/                   # Utilities
│   └── supabase.ts       # Supabase client
├── public/               # Static assets
├── .env.local            # Environment variables
└── netlify.toml          # Netlify configuration
```

## 🗄️ Database Schema

### form_submissions
- id (uuid)
- full_name (text)
- email (text)
- phone (text)
- city_country (text)
- previous_experience (text)
- hajj_status (text)
- travelling_with (text)
- call_goals (text)
- status (text)
- created_at (timestamp)

### email_subscribers
- id (uuid)
- email (text)
- source (text)
- status (text)
- subscribed_at (timestamp)

### daily_tips
- id (uuid)
- title (text)
- description (text)
- image_url (text)
- category (text)
- is_active (boolean)

### webinars
- id (uuid)
- title (text)
- description (text)
- youtube_id (text)
- youtube_url (text)
- is_active (boolean)

### pdf_guides
- id (uuid)
- title (text)
- description (text)
- pdf_url (text)
- is_active (boolean)

## 🎨 Customisation

### Colors
Edit `/app/globals.css`:
- Primary: #004d40 (Dark Teal)
- Accent: #ffd700 (Gold)

### Content
- Hero text: `/app/page.tsx` lines 172-183
- Benefits: `/app/page.tsx` lines 19-50
- FAQ: `/components/FAQ.tsx`
- Testimonials: `/components/TestimonialsCarousel.tsx`

### Images
Replace files in `/public/`:
- Logo: `seerah logo.png`
- Hajj images: Various .jpg files
- Videos: .MP4 testimonial files

## 🚀 Deployment to Netlify

### Quick Deploy
1. Push to GitHub
2. Connect repo to Netlify
3. Add environment variables
4. Deploy

See `DEPLOYMENT_GUIDE.md` for detailed instructions.

## 🐛 Troubleshooting

### "Command not found: next"
```bash
npm install
```

### Form submission fails
1. Check browser console for errors
2. Verify Supabase credentials
3. Check RLS policies
4. Test with RLS disabled

### Admin panel empty
1. Check Supabase connection
2. Verify tables exist
3. Add test data via SQL

### Calendly not showing
1. Add your Calendly URL
2. Check for script blockers
3. Verify CORS settings

## 📞 Required Information from You

To complete the setup, please provide:

1. **Calendly URL**: Your scheduling link
2. **WhatsApp Group Link**: Your group invite link  
3. **Supabase Credentials**: If using different project
4. **ConvertKit Details**: For email automation
5. **Custom Domain**: For production deployment

## 🎯 Next Steps

1. **Immediate**:
   - Fix RLS policies in Supabase
   - Add your Calendly URL
   - Update WhatsApp link
   - Test form submission

2. **Before Launch**:
   - Add admin authentication
   - Configure email automation
   - Set up analytics
   - Test on mobile devices
   - Optimise images

3. **Post-Launch**:
   - Monitor form submissions
   - Track conversion rates
   - Gather user feedback
   - Regular content updates

## 💡 Tips

- Test thoroughly in development before deploying
- Keep sensitive data in environment variables
- Regular backups of Supabase data
- Monitor Netlify build minutes
- Use Netlify forms as backup option

## 🆘 Support Resources

- Next.js Docs: https://nextjs.org/docs
- Supabase Docs: https://supabase.com/docs
- Netlify Docs: https://docs.netlify.com
- Tailwind CSS: https://tailwindcss.com/docs

## ✅ Launch Checklist

- [ ] Supabase database configured
- [ ] Environment variables set
- [ ] Calendly URL added
- [ ] WhatsApp link updated
- [ ] Form tested successfully
- [ ] Admin panel accessible
- [ ] Mobile responsive verified
- [ ] Domain configured
- [ ] SSL certificate active
- [ ] Analytics installed