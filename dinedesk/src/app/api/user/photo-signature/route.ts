import { createHash } from 'node:crypto';
import { NextResponse } from 'next/server';
import { Types } from 'mongoose';
import { getSession } from '@/lib/auth';

export const runtime = 'nodejs';

export async function POST() {
  const session = await getSession();
  const userId = (session?.user as { id?: string } | undefined)?.id;

  if (!userId || !Types.ObjectId.isValid(userId)) {
    return NextResponse.json({ error: 'Please log in again.' }, { status: 401 });
  }

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    return NextResponse.json({ error: 'Profile photo storage is not configured.' }, { status: 503 });
  }

  const timestamp = Math.floor(Date.now() / 1000);
  const folder = 'dinedesk/profiles';
  const publicId = userId;
  const signatureInput = `folder=${folder}&overwrite=true&public_id=${publicId}&timestamp=${timestamp}${apiSecret}`;
  const signature = createHash('sha1').update(signatureInput).digest('hex');

  return NextResponse.json({ cloudName, apiKey, timestamp, folder, publicId, signature });
}
