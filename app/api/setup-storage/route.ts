import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    console.log('Setting up Supabase storage buckets...');

    const bucketsToCreate = [
      {
        name: 'images',
        options: {
          public: true,
          fileSizeLimit: 52428800, // 50MB
          allowedMimeTypes: ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/gif']
        }
      },
      {
        name: 'pdf-guides',
        options: {
          public: true,
          fileSizeLimit: 104857600, // 100MB for PDFs
          allowedMimeTypes: ['application/pdf']
        }
      }
    ];

    const results = [];

    for (const bucket of bucketsToCreate) {
      try {
        // Check if bucket exists
        const { data: buckets } = await supabaseAdmin.storage.listBuckets();
        const exists = buckets?.some(b => b.name === bucket.name);

        if (!exists) {
          // Create bucket
          const { data, error } = await supabaseAdmin.storage.createBucket(
            bucket.name,
            bucket.options
          );

          if (error) {
            if (error.message.includes('already exists')) {
              results.push({ bucket: bucket.name, status: 'already exists' });
            } else {
              results.push({ bucket: bucket.name, status: 'error', error: error.message });
            }
          } else {
            results.push({ bucket: bucket.name, status: 'created' });
          }
        } else {
          results.push({ bucket: bucket.name, status: 'already exists' });
        }

        // Update bucket to ensure it's public if it already exists
        if (exists) {
          const { error: updateError } = await supabaseAdmin.storage.updateBucket(
            bucket.name,
            { public: true }
          );
          
          if (updateError) {
            console.log(`Could not update bucket ${bucket.name}:`, updateError);
          }
        }
      } catch (error) {
        results.push({ 
          bucket: bucket.name, 
          status: 'error', 
          error: error instanceof Error ? error.message : 'Unknown error' 
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Storage buckets setup completed',
      results
    });

  } catch (error) {
    console.error('Storage setup error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'Failed to setup storage buckets'
    }, { status: 500 });
  }
}