export function HeroSection() {
  return (
    <section className="bg-gradient-to-b from-orange-50 to-white">
      <div className="max-w-6xl mx-auto px-4 py-24 text-center">
        <h1 className="text-4xl font-bold leading-tight">
          Your AI-powered money coach
          <br />
          <span className="text-orange-500">
            built for everyday Indians
          </span>
        </h1>

        <p className="mt-6 text-lg text-stone-600 max-w-2xl mx-auto">
          Track earnings, save smartly, talk to PayDay in your language,
          and build financial confidence—without spreadsheets.
        </p>

        <div className="mt-8 flex justify-center gap-4">
          <a
            href="/login"
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-medium"
          >
            Get Started
          </a>

          <a
            href="#features"
            className="px-6 py-3 rounded-xl border border-stone-300 text-stone-700"
          >
            Learn More
          </a>
        </div>
      </div>
    </section>
  );
}
