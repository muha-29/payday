const LANGUAGES = [
    { label: 'English', value: 'en-IN' },
    { label: 'हिन्दी', value: 'hi-IN' },
    { label: 'தமிழ்', value: 'ta-IN' },
    { label: 'తెలుగు', value: 'te-IN' }
];

<select
    value={profile.language}
    onChange={(e) =>
        updateProfile({ language: e.target.value })
    }
>
    {LANGUAGES.map(l => (
        <option key={l.value} value={l.value}>
            {l.label}
        </option>
    ))}
</select>
