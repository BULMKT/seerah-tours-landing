# Manual Supabase Setup Guide

## 🚀 Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click **"Start your project"** and sign up/login
3. Click **"New project"**
4. Choose your organisation
5. Set project name: `seerah-tours-hajj`
6. Set database password (save this!)
7. Choose region closest to UK
8. Click **"Create new project"**
9. Wait 2-3 minutes for setup to complete

---

## 🔑 Step 2: Get Your API Keys

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy these values:
   - **Project URL** (looks like: `https://xyz.supabase.co`)
   - **Project API Key** - anon/public key
   - **Service Role Key** (secret key)

---

## 📝 Step 3: Create Environment Variables

Create a `.env.local` file in your project root:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

⚠️ **Replace the values** with your actual keys from Step 2!

---

## 🗃️ Step 4: Set Up Database Tables

1. In Supabase dashboard, go to **SQL Editor**
2. Click **"New query"**
3. Copy and paste the SQL from `database-setup.sql` (created below)
4. Click **"Run"** to execute
5. Verify tables were created in **Table Editor**

---

## 🔧 Step 5: Configure Authentication (Optional)

1. Go to **Authentication** → **Settings**
2. Under **Site URL**, add your domain
3. Under **Redirect URLs**, add your domain
4. For development, add: `http://localhost:3000`

---

## ✅ Step 6: Test Connection

1. Restart your Next.js development server: `npm run dev`
2. Go to `/admin` in your browser
3. Check browser console for any errors
4. You should see sample data loading

---

## 🎯 Next Steps

Once setup is complete:
- Visit `/admin` to manage content
- Add your first daily tip with file upload
- Test form submissions
- Upload PDFs and manage webinars

---

## 🆘 Troubleshooting

**Common Issues:**
1. **Connection refused**: Check your environment variables
2. **RLS errors**: Make sure the SQL ran completely
3. **No data**: Check if sample data was inserted
4. **File upload fails**: Check bucket permissions (covered in SQL)

**Need Help?**
- Check Supabase logs in dashboard
- Verify all environment variables are correct
- Make sure `.env.local` is in project root