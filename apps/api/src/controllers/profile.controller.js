import { Profile } from '../models/index.js';

/**
 * Get or create user profile
 */
export async function getOrCreateProfile(req, res) {
  const userId = req.user.id;
  const email = req.user.email;

  let profile = await Profile.findOne({ userId });

  if (!profile) {
    profile = await Profile.create({
      userId,
      email,
      onboarding: { completed: false }
    });
  }

  res.json(profile);
}

/**
 * Update onboarding details
 */
export async function updateOnboarding(req, res) {
  const userId = req.user.id;

  const updated = await Profile.findOneAndUpdate(
    { userId },
    { $set: req.body },
    { new: true }
  );

  res.json(updated);
}

/**
 * Update avatar path
 */
export async function updateAvatar(req, res) {
  const userId = req.user.id;
  const { avatarPath } = req.body;

  const updated = await Profile.findOneAndUpdate(
    { userId },
    { avatarPath },
    { new: true }
  );

  res.json(updated);
}
