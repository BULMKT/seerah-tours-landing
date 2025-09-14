import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const active = searchParams.get('active') !== 'false';

    let query = supabaseAdmin.from('pdf_guides').select('*');
    
    if (active) {
      query = query.eq('is_active', true);
    }
    
    query = query.order('created_at', { ascending: false });

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching PDF guides:', error);
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
    console.error('PDF guides API error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch PDF guides',
      fallback: []
    });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, pdfUrl, thumbnailUrl, fileSize, tags } = body;

    if (!title || !description || !pdfUrl) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields: title, description, or pdfUrl'
      }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from('pdf_guides')
      .insert({
        title,
        description,
        pdf_url: pdfUrl,
        thumbnail_url: thumbnailUrl || null,
        file_size: fileSize || null,
        tags: tags || [],
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select('*')
      .single();

    if (error) {
      console.error('Error creating PDF guide:', error);
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
    console.error('PDF guide creation error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, title, description, pdfUrl, thumbnailUrl, fileSize, tags, isActive } = body;

    if (!id) {
      return NextResponse.json({
        success: false,
        error: 'Missing PDF guide ID'
      }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from('pdf_guides')
      .update({
        title,
        description,
        pdf_url: pdfUrl,
        thumbnail_url: thumbnailUrl,
        file_size: fileSize,
        tags,
        is_active: isActive,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      console.error('Error updating PDF guide:', error);
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
    console.error('PDF guide update error:', error);
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
        error: 'Missing PDF guide ID'
      }, { status: 400 });
    }

    // Soft delete by setting is_active to false
    const { error } = await supabaseAdmin
      .from('pdf_guides')
      .update({ 
        is_active: false,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);

    if (error) {
      console.error('Error deleting PDF guide:', error);
      return NextResponse.json({
        success: false,
        error: error.message
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'PDF guide deleted successfully'
    });

  } catch (error) {
    console.error('PDF guide deletion error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}