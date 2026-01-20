import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { NavLink } from "react-router-dom";
import toast from "react-hot-toast";
import { useProfile } from "../../hooks/useProfile";
import { useI18n } from "../../hooks/useI18n";
import { apiFetch } from "../../api/api";

/* ---------- Types ---------- */

type AIUsage = {
  limits: {
    sttSeconds: number;
    ttsSeconds: number;
    totalSeconds: number;
  };
  usage: {
    sttSecondsUsed: number;
    ttsSecondsUsed: number;
  };
  percent: {
    stt: number;
    tts: number;
    total: number;
  };
};

export default function ProfileHome() {
  const { profile, loading, updateProfile } = useProfile();
  const { t } = useI18n();

  const [user, setUser] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [aiUsage, setAiUsage] = useState<AIUsage | null>(null);

  /* ---------- Load user ---------- */
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data?.user || null);
    });
  }, []);

  /* ---------- Load AI usage ---------- */
  useEffect(() => {
    apiFetch("/usage")
      .then(setAiUsage)
      .catch(() => { });
  }, []);

  /* ---------- 80% warning (once) ---------- */
  useEffect(() => {
    if (!aiUsage) return;

    const warned = localStorage.getItem("ai-usage-warned");
    const high =
      aiUsage.percent.total >= 80;

    if (high && !warned) {
      toast("⚠️ You are close to your free AI usage limit");
      localStorage.setItem("ai-usage-warned", "1");
    }
  }, [aiUsage]);

  /* ---------- Language change ---------- */
  async function handleLanguageChange(
    e: React.ChangeEvent<HTMLSelectElement>
  ) {
    try {
      setSaving(true);
      await updateProfile({ language: e.target.value });
      toast("⏳ " + t("savingPreference"));
      window.location.replace("/app/home");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="p-4 text-stone-500">
        {t("loadingProfile")}…
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="sticky top-0 bg-white z-20 border-b px-4 py-3">
        <h1 className="text-xl font-bold">{t("profile")}</h1>
      </div>

      <div className="px-4 pt-4 space-y-4">

        {/* User */}
        <div className="bg-white rounded-2xl p-4 shadow">
          <p className="text-sm text-stone-500">{t("email")}</p>
          <p className="font-medium">{user?.email || "—"}</p>
        </div>

        {/* 🤖 AI Usage */}
        {aiUsage && (
          <div className="bg-white rounded-2xl p-4 shadow space-y-3">
            <p className="font-medium">🤖 t{("AI_Usage")}</p>

            <UsageBar
              label="Voice Agent"
              used={aiUsage.percent.total}
              total={7200}
            />

            {/* <UsageBar
              label="Voice Input (STT)"
              used={aiUsage.usage.sttSecondsUsed}
              total={aiUsage.limits.totalSeconds}
            />

            <UsageBar
              label="Voice Output (TTS)"
              used={aiUsage.usage.ttsSecondsUsed}
              total={aiUsage.limits.totalSeconds}
            /> */}

            <p className="text-[11px] text-stone-500">
              t{('AI_USAGE_DES')}
            </p>
          </div>
        )}

        {/* Chat history */}
        <NavLink
          to="/app/profile/history"
          className="block bg-white rounded-2xl p-4 shadow hover:bg-orange-50 transition"
        >
          <p className="font-medium">
            🗣 {t("payDayChatHistory")}
          </p>
          <p className="text-sm text-stone-500">
            {t("viewYourPreviousVoiceAndAIConversations")}
          </p>
        </NavLink>

        {/* Language */}
        <div className="bg-white rounded-2xl p-4 shadow">
          <p className="font-medium">{t("language")}</p>
          <p className="text-sm text-stone-500">
            {t("usedByPayDayVoiceAssistant")}
          </p>

          <select
            value={profile?.language || "en-IN"}
            onChange={handleLanguageChange}
            className="w-full mt-2 rounded-lg border px-3 py-2 text-sm
              focus:ring-2 focus:ring-orange-400"
          >
            <option value="en-IN">English</option>
            <option value="hi-IN">Hindi</option>
            <option value="ta-IN">Tamil</option>
            <option value="te-IN">Telugu</option>
          </select>

          {saving && (
            <p className="text-xs text-orange-500 mt-1">
              {t("savingPreference")}…
            </p>
          )}
        </div>

        {/* Logout */}
        <button
          onClick={() => supabase.auth.signOut()}
          className="w-full py-3 rounded-xl border border-red-500 text-red-500 font-medium"
        >
          {t("logout")}
        </button>
      </div>
    </div>
  );
}

/* ---------- Usage Bar ---------- */

function UsageBar({
  label,
  used,
  total,
}: {
  label: string;
  used: number;
  total: number;
}) {
  const percent = Math.min(
    100,
    Math.round((used / total) * 100)
  );

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span>{label}</span>
        <span>{percent}%</span>
      </div>

      <div className="h-2 bg-stone-200 rounded">
        <div
          className={`h-2 rounded ${percent >= 80 ? "bg-orange-500" : "bg-green-500"
            }`}
          style={{ width: `${percent}%` }}
        />
      </div>

      <div className="text-[11px] text-stone-500">
        {Math.round(used / 60)} min used /{" "}
        {Math.round(total / 60)} min free
      </div>
    </div>
  );
}