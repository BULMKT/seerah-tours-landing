import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const active = searchParams.get('active') !== 'false';

    let query = supabaseAdmin.from('daily_tips').select('*');
    
    if (active) {
      query = query.eq('is_active', true);
    }
    
    query = query.order('created_at', { ascending: false });

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching daily tips:', error);
      return NextResponse.json({
        success: false,
        error: error.message,
        fallback: []
      });
    }

    return NextResponse.json({
      success: true,
      data: data || []
    });

  } catch (error) {
    console.error('Daily tips API error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch daily tips',
      fallback: []
    });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, imageUrl, category, tags } = body;

    if (!title || !description || !imageUrl) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields: title, description, or imageUrl'
      }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from('daily_tips')
      .insert({
        title,
        description,
        image_url: imageUrl,
        category: category || 'General',
        tags: tags || [],
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select('*')
      .single();

    if (error) {
      console.error('Error creating daily tip:', error);
      return NextResponse.json({
        success: false,
        error: error.message
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      data
    });

  } catch (error) {
    console.error('Daily tips creation error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, title, description, imageUrl, category, tags, isActive } = body;

    if (!id) {
      return NextResponse.json({
        success: false,
        error: 'Missing tip ID'
      }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from('daily_tips')
      .update({
        title,
        description,
        image_url: imageUrl,
        category,
        tags,
        is_active: isActive,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      console.error('Error updating daily tip:', error);
      return NextResponse.json({
        success: false,
        error: error.message
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      data
    });

  } catch (error) {
    console.error('Daily tips update error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({
        success: false,
        error: 'Missing tip ID'
      }, { status: 400 });
    }

    // Soft delete by setting is_active to false
    const { error } = await supabaseAdmin
      .from('daily_tips')
      .update({ 
        is_active: false,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);

    if (error) {
      console.error('Error deleting daily tip:', error);
      return NextResponse.json({
        success: false,
        error: error.message
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Daily tip deleted successfully'
    });

  } catch (error) {
    console.error('Daily tips deletion error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}