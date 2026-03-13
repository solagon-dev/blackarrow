import { put } from '@vercel/blob';
import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';

const MAX_FILE_SIZE = 4 * 1024 * 1024;
const allowedTypes = new Set(['image/jpeg', 'image/png', 'image/webp']);

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = process.env.BLOB_READ_WRITE_TOKEN?.trim();
    if (!token) {
      return NextResponse.json({ error: 'Missing BLOB_READ_WRITE_TOKEN' }, { status: 500 });
    }

    const formData = await request.formData();
    const file = formData.get('file');
    const slugValue = formData.get('slug');
    const slug = typeof slugValue === 'string' ? slugValue.trim() : '';

    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'Image file is required' }, { status: 400 });
    }

    if (!allowedTypes.has(file.type)) {
      return NextResponse.json({ error: 'Only JPG, PNG, and WebP images are supported' }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: 'Image must be 4MB or smaller' }, { status: 400 });
    }

    const safeBaseName = sanitizeFilename(slug || file.name.replace(/\.[^.]+$/, '') || 'post-image');
    const extension = getExtension(file.name, file.type);
    const pathname = `posts/${new Date().toISOString().slice(0, 10)}/${safeBaseName}${extension}`;

    const blob = await put(pathname, file, {
      access: 'public',
      addRandomSuffix: true,
      cacheControlMaxAge: 31536000,
      token,
    });

    return NextResponse.json({ url: blob.url, pathname: blob.pathname }, { status: 201 });
  } catch (error) {
    console.error('Image upload error:', error);
    return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 });
  }
}

function sanitizeFilename(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 80) || 'post-image';
}

function getExtension(fileName: string, mimeType: string) {
  const fromName = fileName.match(/\.[a-z0-9]+$/i)?.[0]?.toLowerCase();
  if (fromName) {
    return fromName;
  }

  if (mimeType === 'image/png') return '.png';
  if (mimeType === 'image/webp') return '.webp';
  return '.jpg';
}
