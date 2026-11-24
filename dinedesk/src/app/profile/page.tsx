'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, Mail, Phone, MapPin, Camera, Save, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  location?: string;
  photoUrl?: string;
}

interface CloudinarySignature {
  cloudName: string;
  apiKey: string;
  timestamp: number;
  folder: string;
  publicId: string;
  signature: string;
}

const MAX_PHOTO_SIZE = 5 * 1024 * 1024;
const ALLOWED_PHOTO_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', location: '' });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/user/get-profile');
        if (!response.ok) {
          router.push('/login');
          return;
        }
        const data = await response.json();
        setUser(data.user);
        setFormData({
          name: data.user.name || '',
          email: data.user.email || '',
          phone: data.user.phone || '',
          location: data.user.location || '',
        });
        setPhotoPreview(data.user.photoUrl || null);
      } catch (error) {
        console.error('Failed to fetch user data:', error);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [router]);

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    if (!ALLOWED_PHOTO_TYPES.includes(file.type)) {
      setMessage({ type: 'error', text: 'Choose a JPG, PNG, or WebP image.' });
      return;
    }
    if (file.size > MAX_PHOTO_SIZE) {
      setMessage({ type: 'error', text: 'Profile photos must be 5 MB or smaller.' });
      return;
    }

    setPhotoFile(file);
    setMessage(null);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const uploadPhoto = async (file: File): Promise<{ photoUrl: string; photoPublicId: string }> => {
    const signatureResponse = await fetch('/api/user/photo-signature', { method: 'POST' });
    const signatureData = await signatureResponse.json() as CloudinarySignature & { error?: string };
    if (!signatureResponse.ok) {
      throw new Error(signatureData.error || 'Could not prepare the photo upload.');
    }

    const uploadData = new FormData();
    uploadData.append('file', file);
    uploadData.append('api_key', signatureData.apiKey);
    uploadData.append('timestamp', String(signatureData.timestamp));
    uploadData.append('folder', signatureData.folder);
    uploadData.append('public_id', signatureData.publicId);
    uploadData.append('overwrite', 'true');
    uploadData.append('signature', signatureData.signature);

    const uploadResponse = await fetch(
      `https://api.cloudinary.com/v1_1/${encodeURIComponent(signatureData.cloudName)}/image/upload`,
      { method: 'POST', body: uploadData },
    );
    const uploaded = await uploadResponse.json() as { secure_url?: string; public_id?: string; error?: { message?: string } };
    if (!uploadResponse.ok || !uploaded.secure_url || !uploaded.public_id) {
      throw new Error(uploaded.error?.message || 'Photo upload failed.');
    }

    return { photoUrl: uploaded.secure_url, photoPublicId: uploaded.public_id };
  };

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSaving(true);
    setMessage(null);

    try {
      const uploadedPhoto = photoFile ? await uploadPhoto(photoFile) : undefined;
      const response = await fetch('/api/user/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, ...uploadedPhoto }),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to update profile.');
      }

      if (uploadedPhoto) {
        setPhotoPreview(uploadedPhoto.photoUrl);
        setPhotoFile(null);
        setUser((current) => current ? { ...current, photoUrl: uploadedPhoto.photoUrl } : current);
      }
      setMessage({ type: 'success', text: 'Profile updated successfully.' });
    } catch (error) {
      setMessage({ type: 'error', text: error instanceof Error ? error.message : 'An error occurred. Please try again.' });
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-12">
        <p className="text-center text-foreground/70">Please log in to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl">
      <Link href="/menu" className="inline-flex items-center gap-2 text-foreground/70 hover:text-primary transition-colors mb-8 font-medium">
        <ArrowLeft className="w-4 h-4" /> Back to Menu
      </Link>

      <div className="bg-card border border-border rounded-3xl p-6 md:p-10 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="relative z-10">
          <h1 className="text-4xl font-outfit font-bold mb-2">My Profile</h1>
          <p className="text-foreground/70 mb-10">Update your profile information and photo.</p>

          <form onSubmit={handleSave} className="space-y-8">
            <div className="flex flex-col items-center gap-6 pb-8 border-b border-border">
              <div className="relative w-32 h-32">
                {photoPreview ? (
                  <Image src={photoPreview} alt="Profile photo" fill sizes="128px" className="object-cover rounded-full" unoptimized={photoPreview.startsWith('blob:')} />
                ) : (
                  <div className="w-32 h-32 bg-gradient-to-br from-primary/20 to-primary/5 rounded-full flex items-center justify-center">
                    <User className="w-12 h-12 text-primary/40" />
                  </div>
                )}
              </div>
              <label className="cursor-pointer">
                <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handlePhotoChange} className="hidden" />
                <span className="flex items-center gap-2 px-6 py-3 bg-primary/10 hover:bg-primary/20 text-primary rounded-xl font-semibold transition-colors">
                  <Camera className="w-5 h-5" /> {photoFile ? 'Choose Another Photo' : 'Change Photo'}
                </span>
              </label>
              <p className="text-xs text-foreground/50">JPG, PNG, or WebP. Maximum 5 MB.</p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold mb-3"><User className="w-5 h-5 text-primary" />Full Name</label>
                <input type="text" value={formData.name} onChange={(event) => setFormData({ ...formData, name: event.target.value })} className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition-all text-base" placeholder="Enter your full name" required />
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold mb-3"><Mail className="w-5 h-5 text-primary" />Email Address</label>
                <input type="email" value={formData.email} disabled className="w-full px-4 py-3 border border-border rounded-xl bg-foreground/5 text-foreground/50 cursor-not-allowed text-base" />
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold mb-3"><Phone className="w-5 h-5 text-primary" />Phone Number <span className="text-xs text-foreground/60 font-normal">(Optional)</span></label>
                <input type="tel" value={formData.phone} onChange={(event) => setFormData({ ...formData, phone: event.target.value })} placeholder="10-digit mobile number" pattern="[0-9]{0,10}" title="Phone number must be 10 digits or empty" className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition-all text-base" />
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold mb-3"><MapPin className="w-5 h-5 text-primary" />Location <span className="text-xs text-foreground/60 font-normal">(Optional)</span></label>
                <textarea value={formData.location} onChange={(event) => setFormData({ ...formData, location: event.target.value })} placeholder="Enter your address or location" className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition-all resize-none text-base" rows={3} />
              </div>
            </div>

            {message && (
              <div role="status" className={`p-4 rounded-xl text-sm font-medium ${message.type === 'success' ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800' : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800'}`}>
                {message.text}
              </div>
            )}

            <div className="flex gap-4 pt-4">
              <button type="submit" disabled={isSaving} className="flex-1 flex items-center justify-center gap-2 py-3 px-6 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-60 text-base">
                <Save className="w-5 h-5" />{isSaving ? 'Saving...' : 'Save Changes'}
              </button>
              <Link href="/menu" className="flex-1 flex items-center justify-center py-3 px-6 bg-foreground/5 text-foreground font-semibold rounded-xl hover:bg-foreground/10 transition-colors text-base">Back</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
