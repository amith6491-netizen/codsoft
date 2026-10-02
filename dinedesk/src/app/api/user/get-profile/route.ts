import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import { User } from '@/lib/models';
import { Types } from 'mongoose';

export async function GET() {
  try {
    await connectDB();

    const session = await getSession();
    const userId = (session?.user as { id?: string } | undefined)?.id;

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let userObjectId: Types.ObjectId;
    try {
      userObjectId = new Types.ObjectId(userId);
    } catch {
      return NextResponse.json({ error: 'Invalid session.' }, { status: 401 });
    }

    const user = await User.findById(userObjectId);

    if (!user) {
      return NextResponse.json({ error: 'User not found.' }, { status: 404 });
    }

    return NextResponse.json({
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        phone: user.phone,
        location: user.location,
        photoUrl: user.photoUrl,
      },
    });
  } catch (error) {
    console.error('Get profile error:', error);
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
  }
}
