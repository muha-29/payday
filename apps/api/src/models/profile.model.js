import mongoose from 'mongoose';

const ProfileSchema = new mongoose.Schema(
    {
        userId: { type: String, required: true, unique: true }, // Supabase user id
        email: { type: String },
        avatarPath: { type: String },

        onboarding: {
            incomeRange: String,
            completed: { type: Boolean, default: false }
        }
    },
    { timestamps: true }
);

export default mongoose.model('Profile', ProfileSchema);
