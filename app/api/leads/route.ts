import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    let query = supabaseAdmin
      .from('form_submissions')
      .select('*');
    
    if (status && status !== 'all') {
      query = query.eq('status', status);
    }
    
    query = query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) {
      console.error('Error fetching leads:', error);
      return NextResponse.json({
        success: false,
        error: error.message,
        data: []
      });
    }

    return NextResponse.json({
      success: true,
      data: data || [],
      total: count || 0
    });

  } catch (error) {
    console.error('Leads API error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch leads',
      data: []
    }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status, notes } = body;

    if (!id) {
      return NextResponse.json({
        success: false,
        error: 'Missing lead ID'
      }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from('form_submissions')
      .update({
        status: status || 'new',
        notes: notes || null,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      console.error('Error updating lead:', error);
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
    console.error('Lead update error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}