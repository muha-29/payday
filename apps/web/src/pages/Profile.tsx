import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export default function Profile() {
  const user = supabase.auth.getUser();

  return (
    <div>
      <div className="sticky top-0 bg-white z-20 border-b px-4 py-3">
        <h1 className="text-xl font-bold">Profile</h1>
      </div>

      <div className="px-4 pt-4 space-y-4">
        <div className="bg-white rounded-2xl p-4 shadow">
          <p className="text-sm text-stone-500">Email</p>
          <p className="font-medium">
            {user?.email}
          </p>
        </div>

        <button
          onClick={() => supabase.auth.signOut()}
          className="w-full py-3 rounded-xl border border-red-500 text-red-500"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
