import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, extractYoutubeId, getYoutubeThumbnail } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const active = searchParams.get('active') !== 'false';

    let query = supabaseAdmin.from('webinars').select('*');
    
    if (active) {
      query = query.eq('is_active', true);
    }
    
    query = query.order('created_at', { ascending: false });

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching webinars:', error);
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
    console.error('Webinars API error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch webinars',
      fallback: []
    });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, youtubeUrl, duration, tags } = body;

    if (!title || !description || !youtubeUrl) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields: title, description, or youtubeUrl'
      }, { status: 400 });
    }

    // Extract YouTube ID and generate thumbnail
    const youtubeId = extractYoutubeId(youtubeUrl);
    if (!youtubeId) {
      return NextResponse.json({
        success: false,
        error: 'Invalid YouTube URL. Please provide a valid YouTube video URL.'
      }, { status: 400 });
    }

    const thumbnailUrl = getYoutubeThumbnail(youtubeId);

    const { data, error } = await supabaseAdmin
      .from('webinars')
      .insert({
        title,
        description,
        youtube_id: youtubeId,
        youtube_url: youtubeUrl,
        thumbnail_url: thumbnailUrl,
        duration: duration || null,
        tags: tags || [],
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select('*')
      .single();

    if (error) {
      console.error('Error creating webinar:', error);
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
    console.error('Webinar creation error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, title, description, youtubeUrl, duration, tags, isActive } = body;

    if (!id) {
      return NextResponse.json({
        success: false,
        error: 'Missing webinar ID'
      }, { status: 400 });
    }

    // If YouTube URL is provided, extract ID and generate thumbnail
    let updateData: any = {
      title,
      description,
      duration,
      tags,
      is_active: isActive,
      updated_at: new Date().toISOString()
    };

    if (youtubeUrl) {
      const youtubeId = extractYoutubeId(youtubeUrl);
      if (!youtubeId) {
        return NextResponse.json({
          success: false,
          error: 'Invalid YouTube URL. Please provide a valid YouTube video URL.'
        }, { status: 400 });
      }

      updateData.youtube_id = youtubeId;
      updateData.youtube_url = youtubeUrl;
      updateData.thumbnail_url = getYoutubeThumbnail(youtubeId);
    }

    const { data, error } = await supabaseAdmin
      .from('webinars')
      .update(updateData)
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      console.error('Error updating webinar:', error);
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
    console.error('Webinar update error:', error);
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
        error: 'Missing webinar ID'
      }, { status: 400 });
    }

    // Soft delete by setting is_active to false
    const { error } = await supabaseAdmin
      .from('webinars')
      .update({ 
        is_active: false,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);

    if (error) {
      console.error('Error deleting webinar:', error);
      return NextResponse.json({
        success: false,
        error: error.message
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Webinar deleted successfully'
    });

  } catch (error) {
    console.error('Webinar deletion error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}