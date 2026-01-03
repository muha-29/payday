const features = [
  {
    title: 'Track Earnings',
    desc: 'Daily income tracking for gig workers & freelancers'
  },
  {
    title: 'Smart Savings',
    desc: 'Micro-savings goals that actually work'
  },
  {
    title: 'Voice AI Coach',
    desc: 'Talk to PayDay instead of reading long text'
  },
  {
    title: 'Gamified Learning',
    desc: 'Learn money habits through simple challenges'
  }
];

export function FeatureGrid() {
  return (
    <section id="features">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center">
          Built for real life, not spreadsheets
        </h2>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {features.map((f) => (
            <div
              key={f.title}
              className="bg-white rounded-2xl p-6 shadow hover:shadow-md transition"
            >
              <h3 className="font-semibold text-lg">{f.title}</h3>
              <p className="mt-2 text-sm text-stone-600">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
