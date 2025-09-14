import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    console.log('Setting up database tables...');

    // Create daily_tips table
    const { error: tipsError } = await supabaseAdmin.rpc('create_daily_tips_table');
    if (tipsError && !tipsError.message.includes('already exists')) {
      console.error('Error creating daily_tips table:', tipsError);
    } else {
      console.log('Daily tips table ready');
    }

    // Create webinars table
    const { error: webinarsError } = await supabaseAdmin.rpc('create_webinars_table');
    if (webinarsError && !webinarsError.message.includes('already exists')) {
      console.error('Error creating webinars table:', webinarsError);
    } else {
      console.log('Webinars table ready');
    }

    // Create pdf_guides table
    const { error: pdfsError } = await supabaseAdmin.rpc('create_pdf_guides_table');
    if (pdfsError && !pdfsError.message.includes('already exists')) {
      console.error('Error creating pdf_guides table:', pdfsError);
    } else {
      console.log('PDF guides table ready');
    }

    // Create email_subscribers table if it doesn't exist
    const { error: emailError } = await supabaseAdmin.rpc('create_email_subscribers_table');
    if (emailError && !emailError.message.includes('already exists')) {
      console.error('Error creating email_subscribers table:', emailError);
    } else {
      console.log('Email subscribers table ready');
    }

    return NextResponse.json({
      success: true,
      message: 'Database tables setup completed'
    });

  } catch (error) {
    console.error('Database setup error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// Alternative approach: Direct SQL execution
export async function GET(request: NextRequest) {
  try {
    console.log('Setting up database tables with direct SQL...');

    // Create daily_tips table
    const dailyTipsSQL = `
      CREATE TABLE IF NOT EXISTS daily_tips (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        image_url TEXT NOT NULL,
        category TEXT NOT NULL DEFAULT 'General',
        tags TEXT[] DEFAULT '{}',
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `;

    const webinarsSQL = `
      CREATE TABLE IF NOT EXISTS webinars (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        youtube_id TEXT NOT NULL,
        youtube_url TEXT NOT NULL,
        thumbnail_url TEXT,
        duration TEXT,
        tags TEXT[] DEFAULT '{}',
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `;

    const pdfGuidesSQL = `
      CREATE TABLE IF NOT EXISTS pdf_guides (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        pdf_url TEXT NOT NULL,
        thumbnail_url TEXT,
        file_size TEXT,
        tags TEXT[] DEFAULT '{}',
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `;

    const emailSubscribersSQL = `
      CREATE TABLE IF NOT EXISTS email_subscribers (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        is_active BOOLEAN DEFAULT true,
        subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `;

    // Execute SQL statements
    const { error: tipsError } = await supabaseAdmin.rpc('exec_sql', { sql: dailyTipsSQL });
    const { error: webinarsError } = await supabaseAdmin.rpc('exec_sql', { sql: webinarsSQL });
    const { error: pdfsError } = await supabaseAdmin.rpc('exec_sql', { sql: pdfGuidesSQL });
    const { error: emailError } = await supabaseAdmin.rpc('exec_sql', { sql: emailSubscribersSQL });

    // Try manual insertion if RPC doesn't work
    if (tipsError || webinarsError || pdfsError || emailError) {
      console.log('RPC approach failed, trying direct table creation...');
      
      // Just try to query the tables to see if they exist
      const { data: tipsData, error: tipsQueryError } = await supabaseAdmin
        .from('daily_tips')
        .select('count(*)', { count: 'exact' });
      
      const { data: webinarsData, error: webinarsQueryError } = await supabaseAdmin
        .from('webinars')
        .select('count(*)', { count: 'exact' });
      
      const { data: pdfsData, error: pdfsQueryError } = await supabaseAdmin
        .from('pdf_guides')
        .select('count(*)', { count: 'exact' });

      return NextResponse.json({
        success: true,
        message: 'Database tables checked',
        tableStatus: {
          daily_tips: tipsQueryError ? 'needs creation' : 'exists',
          webinars: webinarsQueryError ? 'needs creation' : 'exists', 
          pdf_guides: pdfsQueryError ? 'needs creation' : 'exists',
          tips_count: (tipsData as any)?.[0]?.count || 0,
          webinars_count: (webinarsData as any)?.[0]?.count || 0,
          pdfs_count: (pdfsData as any)?.[0]?.count || 0
        }
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Database tables setup completed successfully'
    });

  } catch (error) {
    console.error('Database setup error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'You may need to create these tables manually in Supabase'
    }, { status: 500 });
  }
}