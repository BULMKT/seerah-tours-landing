import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const file: File | null = data.get('file') as unknown as File;

    if (!file) {
      return NextResponse.json({
        success: false,
        error: 'No file uploaded'
      }, { status: 400 });
    }

    // Validate file type
    const isImage = file.type.startsWith('image/');
    const isPDF = file.type === 'application/pdf';
    
    if (!isImage && !isPDF) {
      return NextResponse.json({
        success: false,
        error: 'Only images (PNG, JPG, JPEG, WebP) and PDFs are allowed'
      }, { status: 400 });
    }

    // Prepare file for upload
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Create unique filename
    const timestamp = Date.now();
    const extension = file.name.split('.').pop();
    const filename = `${timestamp}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    
    // Determine bucket and path
    const bucket = isPDF ? 'pdf-guides' : 'images';
    const path = filename;
    
    // Create buckets if they don't exist
    try {
      const { data: buckets } = await supabaseAdmin.storage.listBuckets();
      const bucketExists = buckets?.some(b => b.name === bucket);
      
      if (!bucketExists) {
        const { error: createBucketError } = await supabaseAdmin.storage.createBucket(bucket, {
          public: true,
          fileSizeLimit: 52428800, // 50MB
          allowedMimeTypes: isPDF ? ['application/pdf'] : ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/gif']
        });
        
        if (createBucketError && !createBucketError.message.includes('already exists')) {
          console.error('Error creating bucket:', createBucketError);
        }
      }
    } catch (bucketError) {
      console.log('Bucket check/creation:', bucketError);
    }
    
    // Upload file to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
      .from(bucket)
      .upload(path, buffer, {
        contentType: file.type,
        upsert: true
      });

    if (uploadError) {
      console.error('Supabase upload error:', uploadError);
      return NextResponse.json({
        success: false,
        error: `Upload failed: ${uploadError.message}`
      }, { status: 500 });
    }

    // Get public URL
    const { data: { publicUrl } } = supabaseAdmin.storage
      .from(bucket)
      .getPublicUrl(path);
    
    return NextResponse.json({
      success: true,
      fileUrl: publicUrl,
      fileName: filename,
      fileSize: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
      fileType: file.type
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to upload file'
    }, { status: 500 });
  }
}