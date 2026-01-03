import { apiFetch } from './api';

/* ================= TYPES ================= */

export type Profile = {
  _id: string;
  userId: string;
  email: string;
  avatarPath?: string;
  language : string;
  onboarding?: {
    incomeRange?: string;
    completed?: boolean;
  };
};

/* ================= API ================= */

/**
 * Get or create profile
 */
export function fetchProfile(): Promise<Profile> {
  return apiFetch('/profile/me');
}

/**
 * Update onboarding data
 */
export function updateOnboarding(data: {
  incomeRange: string;
  completed: boolean;
}) {
  return apiFetch('/profile/onboarding', {
    method: 'PATCH',
    body: JSON.stringify(data)
  });
}

/**
 * Update avatar path
 */
export function updateAvatar(avatarPath: string) {
  return apiFetch('/profile/avatar', {
    method: 'PATCH',
    body: JSON.stringify({ avatarPath })
  });
}

export type UpdateProfilePayload = {
  language?: string;
  name?: string;
  workType?: string;
};

export function updateProfile(payload: UpdateProfilePayload) {
  return apiFetch('/profile', {
    method: 'PATCH',
    body: JSON.stringify(payload)
  });
}