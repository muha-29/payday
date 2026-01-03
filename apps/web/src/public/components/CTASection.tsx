export function CTASection() {
  return (
    <section>
      <div className="max-w-6xl mx-auto px-4 py-20 text-center">
        <h2 className="text-3xl font-bold">
          Start your money journey today
        </h2>

        <p className="mt-4 text-stone-600">
          Free to use. Built for India. Powered by AI.
        </p>

        <a
          href="/login"
          className="mt-8 inline-block px-8 py-4 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-medium"
        >
          Login with Google
        </a>
      </div>
    </section>
  );
}
