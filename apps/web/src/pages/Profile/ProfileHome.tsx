import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { NavLink } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useProfile } from '../../hooks/useProfile';
import { useI18n } from '../../hooks/useI18n';

export default function Profile() {
  const { profile, loading, updateProfile } = useProfile();
  const { t } = useI18n();

  const [user, setUser] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadUser() {
      const { data } = await supabase.auth.getUser();
      setUser(data?.user || null);
    }
    loadUser();
  }, []);

  async function handleLanguageChange(
    e: React.ChangeEvent<HTMLSelectElement>
  ) {
    const newLang = e.target.value;

    try {
      setSaving(true);
      await updateProfile({ language: newLang });
      toast('🚧 '+t('savingPreference'), {
        icon: '⏳'
      });
      // ✅ Force full reload after save
      window.location.replace('/app/home');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="p-4 text-stone-500">
        {t('loadingProfile')}…
      </div>
    );
  }

  return (
    <div>
      {/* Sticky Header */}
      <div className="sticky top-0 bg-white z-20 border-b px-4 py-3">
        <h1 className="text-xl font-bold">
          {t('profile')}
        </h1>
      </div>

      <div className="px-4 pt-4 space-y-4">
        {/* User Info */}
        <div className="bg-white rounded-2xl p-4 shadow">
          <p className="text-sm text-stone-500">
            {t('email')}
          </p>
          <p className="font-medium">
            {user?.email || '—'}
          </p>
        </div>

        {/* AI Chat History */}
        <NavLink
          to="/profile/history"
          className="block bg-white rounded-2xl p-4 shadow hover:bg-orange-50 transition"
        >
          <p className="font-medium">
            🗣 {t('payDayChatHistory')}
          </p>
          <p className="text-sm text-stone-500">
            {t('viewYourPreviousVoiceAndAIConversations')}
          </p>
        </NavLink>

        {/* Language */}
        <div className="bg-white rounded-2xl p-4 shadow">
          <p className="font-medium">
            {t('language')}
          </p>
          <p className="text-sm text-stone-500">
            {t('usedByPayDayVoiceAssistant')}
          </p>

          <select
            value={profile?.language || 'en'}
            onChange={handleLanguageChange}
            className="
              w-full mt-2 rounded-lg border
              px-3 py-2 text-sm
              focus:outline-none
              focus:ring-2 focus:ring-orange-400
            "
          >
            <option value="en">English</option>
            <option value="hi">Hindi</option>
            <option value="ta">Tamil</option>
            <option value="te">Telugu</option>
          </select>

          {saving && (
            <p className="text-xs text-orange-500 mt-1">
              {t('savingPreference')}…
            </p>
          )}
        </div>

        {/* Logout */}
        <button
          onClick={() => supabase.auth.signOut()}
          className="
            w-full py-3 rounded-xl
            border border-red-500
            text-red-500 font-medium
          "
        >
          {t('logout')}
        </button>
      </div>
    </div>
  );
}