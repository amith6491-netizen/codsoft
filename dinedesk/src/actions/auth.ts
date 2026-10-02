'use server';

import bcrypt from 'bcryptjs';
import { encrypt } from '@/lib/auth';
import { cookies } from 'next/headers';
import { connectDB } from '@/lib/mongodb';
import { User } from '@/lib/models';

export async function registerAction(formData: FormData) {
  try {
    await connectDB();

    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    if (!email || !password || !name) {
      return { error: 'All fields are required.' };
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return { error: 'User already exists.' };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    const session = await encrypt({ 
      user: { 
        id: user._id.toString(), 
        email: user.email, 
        name: user.name, 
        role: user.role 
      } 
    });
    
    const cookieStore = await cookies();
    cookieStore.set('session', session, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24,
    });

    return { success: true, redirectTo: '/' };
  } catch (error) {
    console.error('Register error:', error);
    return { error: 'Registration failed. Please try again.' };
  }
}

export async function loginAction(formData: FormData) {
  try {
    await connectDB();

    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    if (!email || !password) {
      return { error: 'Email and password are required.' };
    }

    const user = await User.findOne({ email });
    if (!user || !user.password) {
      return { error: 'Invalid email or password.' };
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return { error: 'Invalid email or password.' };
    }

    const session = await encrypt({ 
      user: { 
        id: user._id.toString(), 
        email: user.email, 
        name: user.name, 
        role: user.role 
      } 
    });
    
    const cookieStore = await cookies();
    cookieStore.set('session', session, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24,
    });

    return { success: true, redirectTo: '/' };
  } catch (error) {
    console.error('Login error:', error);
    return { error: 'Login failed. Please try again.' };
  }
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete('session');
  return { success: true, redirectTo: '/' };
}
