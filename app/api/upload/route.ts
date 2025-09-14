import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';

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

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create file path based on file type
    const isImage = file.type.startsWith('image/');
    const isPDF = file.type === 'application/pdf';
    
    if (!isImage && !isPDF) {
      return NextResponse.json({
        success: false,
        error: 'Only images (PNG, JPG, JPEG, WebP) and PDFs are allowed'
      }, { status: 400 });
    }

    const folder = isPDF ? 'guides' : 'images';
    const timestamp = Date.now();
    const extension = file.name.split('.').pop();
    const filename = `${timestamp}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    
    // Ensure the public directory structure exists
    const publicDir = join(process.cwd(), 'public');
    const uploadDir = join(publicDir, folder);
    
    try {
      await writeFile(join(uploadDir, filename), buffer);
    } catch (error) {
      // If directory doesn't exist, create it
      const fs = require('fs');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
        await writeFile(join(uploadDir, filename), buffer);
      } else {
        throw error;
      }
    }

    const fileUrl = `/${folder}/${filename}`;
    
    return NextResponse.json({
      success: true,
      fileUrl,
      fileName: filename,
      fileSize: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
      fileType: file.type
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to upload file'
    }, { status: 500 });
  }
}