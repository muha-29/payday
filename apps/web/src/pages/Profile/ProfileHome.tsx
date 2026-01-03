import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { NavLink } from 'react-router-dom';
import { useProfile } from '../../hooks/useProfile';
import { updateProfile } from '../../api/profile';

import { usePWAInstall } from '../../hooks/usePWAInstall';


export default function Profile() {
  const { canInstall, install } = usePWAInstall();

  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const profile = useProfile();

  console.log('Profile data:', profile.profile);

  useEffect(() => {
    async function loadUser() {
      const { data, error } = await supabase.auth.getUser();
      if (!error) {
        setUser(data.user);
      }
      setLoading(false);
    }

    loadUser();
  }, []);

  if (loading) {
    return (
      <div className="p-4 text-stone-500">
        Loading profile…
      </div>
    );
  }

  return (
    <div>
      {/* Sticky Header */}
      <div className="sticky top-0 bg-white z-20 border-b px-4 py-3">
        <h1 className="text-xl font-bold">Profile</h1>
      </div>

      <div className="px-4 pt-4 space-y-4">
        {/* User Info */}
        <div className="bg-white rounded-2xl p-4 shadow">
          <p className="text-sm text-stone-500">Email</p>
          <p className="font-medium">
            {user?.email || '—'}
          </p>
        </div>

        {/* AI Chat History */}
        <NavLink
          to="/profile/history"
          className="block bg-white rounded-2xl p-4 shadow hover:bg-orange-50 transition"
        >
          <p className="font-medium">🗣 PayDay Chat History</p>
          <p className="text-sm text-stone-500">
            View your previous voice & AI conversations
          </p>
        </NavLink>

        {/* Language Settings (future-ready) */}
        <div className="bg-white rounded-2xl p-4 shadow">
          <p className="font-medium">Language</p>
          <p className="text-sm text-stone-500">
            Used by PayDay voice assistant
          </p>
          <select
            value={profile.profile?.language}
            onChange={(e) => updateProfile({ language: e.target.value })}
            className="w-full mt-2 p-2 border rounded-xl"
          >
            <option value="en">English</option>
            <option value="hi">Hindi</option>
            <option value="ta">Tamil</option>
            <option value="te">Telugu</option>
          </select>
        </div>

        {
          canInstall && (
            <button
              onClick={install}
              className="w-full py-3 rounded-xl bg-orange-500 text-white"
            >
              Install PayDay App
            </button>
          )
        }

        {/* Logout */}
        <button
          onClick={() => supabase.auth.signOut()}
          className="w-full py-3 rounded-xl border border-red-500 text-red-500 font-medium"
        >
          Logout
        </button>
      </div>
    </div>
  );
}