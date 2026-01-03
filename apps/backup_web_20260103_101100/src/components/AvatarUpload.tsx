import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { updateAvatar } from '../api/profile';

type AvatarUploadProps = {
  avatarPath?: string | null;
  onUpdated?: (path: string) => void;
};

export function AvatarUpload({
  avatarPath,
  onUpdated
}: AvatarUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  /**
   * Generate signed URL whenever avatarPath changes
   */
  useEffect(() => {
    let cancelled = false;

    async function loadAvatar() {
      if (!avatarPath) {
        setAvatarUrl(null);
        return;
      }
      console.log('AVATAR PATH FROM MONGO:', avatarPath);
      console.log('REQUESTING SIGNED URL FOR:', {
        bucket: 'user-uploads',
        path: avatarPath
      });
      const { data, error } = await supabase.storage
        .from('user-uploads')
        .createSignedUrl(avatarPath, 60 * 60); // 1 hour

      if (cancelled) return;

      if (error || !data?.signedUrl) {
        console.error('Signed URL error:', error);
        setAvatarUrl(null);
        return;
      }

      // ✅ IMPORTANT: use ONLY the returned signedUrl
      setAvatarUrl(data.signedUrl);
    }

    loadAvatar();

    return () => {
      cancelled = true;
    };
  }, [avatarPath]);

  /**
   * Handle file upload
   */
  const handleUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    try {
      // Client-side validation
      if (!file.type.startsWith('image/')) {
        throw new Error('Only image files are allowed');
      }

      if (file.size > 5 * 1024 * 1024) {
        throw new Error('Image must be under 5MB');
      }

      const { data: userData, error: userError } =
        await supabase.auth.getUser();

      if (userError || !userData.user) {
        throw new Error('User not authenticated');
      }

      const user = userData.user;
      const safeFileName = file.name
        .toLowerCase()
        .replace(/\s+/g, '-')        // replace spaces
        .replace(/[^a-z0-9.-]/g, ''); // remove unsafe chars

      const path = `${user.id}/${Date.now()}-${safeFileName}`;


      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('user-uploads')
        .upload(path, file, {
          contentType: file.type,
          upsert: false
        });

      if (uploadError) {
        throw uploadError;
      }

      // Save path in MongoDB via backend
      await updateAvatar(path);

      // Trigger parent state update
      onUpdated?.(path);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Upload failed');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  return (
    <div style={{ textAlign: 'center' }}>
      {/* Avatar Preview */}
      {avatarUrl ? (
        <img
          src={avatarUrl}
          alt="Profile avatar"
          style={{
            width: 96,
            height: 96,
            borderRadius: '50%',
            objectFit: 'cover',
            border: '2px solid #f59e0b'
          }}
        />
      ) : (
        <div
          style={{
            width: 96,
            height: 96,
            borderRadius: '50%',
            background: '#fde68a',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 32
          }}
        >
          👤
        </div>
      )}

      {/* Upload Button */}
      <div style={{ marginTop: 12 }}>
        <label
          style={{
            cursor: uploading ? 'not-allowed' : 'pointer',
            color: '#f97316',
            fontWeight: 500
          }}
        >
          <input
            type="file"
            accept="image/*"
            hidden
            disabled={uploading}
            onChange={handleUpload}
          />
          {uploading ? 'Uploading…' : 'Change photo'}
        </label>
      </div>

      {/* Error Message */}
      {error && (
        <div style={{ marginTop: 8, color: '#dc2626' }}>
          {error}
        </div>
      )}
    </div>
  );
}