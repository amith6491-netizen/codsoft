import { NextResponse } from 'next/server';
import { Types } from 'mongoose';
import { getSession } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import { User } from '@/lib/models';

export async function POST(request: Request) {
  try {
    await connectDB();

    const session = await getSession();
    const userId = (session?.user as { id?: string } | undefined)?.id;

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Validate and convert userId to ObjectId
    let userObjectId: Types.ObjectId;
    try {
      userObjectId = new Types.ObjectId(userId);
    } catch {
      console.error('Invalid userId format:', userId);
      return NextResponse.json({ error: 'Invalid session.' }, { status: 401 });
    }

    const { name, phone, location, photoUrl, photoPublicId } = await request.json();

    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return NextResponse.json({ error: 'Name must be at least 2 characters' }, { status: 400 });
    }

    if (phone && (typeof phone !== 'string' || !/^[0-9]{10}$/.test(phone))) {
      return NextResponse.json({ error: 'Phone number must be 10 digits or empty' }, { status: 400 });
    }

    const updates: Record<string, string | null> = {
      name: name.trim(),
      phone: phone?.trim() || null,
      location: typeof location === 'string' ? location.trim() || null : null,
    };

    if (photoUrl !== undefined || photoPublicId !== undefined) {
      if (
        typeof photoUrl !== 'string' ||
        typeof photoPublicId !== 'string' ||
        !/^https:\/\/res\.cloudinary\.com\/[^/]+\/image\/upload\//.test(photoUrl) ||
        photoPublicId !== `dinedesk/profiles/${userId}`
      ) {
        return NextResponse.json({ error: 'Invalid hosted profile photo.' }, { status: 400 });
      }
      updates.photoUrl = photoUrl;
      updates.photoPublicId = photoPublicId;
    }

    await User.findByIdAndUpdate(userObjectId, updates, { runValidators: true });

    return NextResponse.json({ 
      success: true, 
      message: 'Profile updated successfully' 
    });
  } catch (error) {
    console.error('User update error:', error);
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}
