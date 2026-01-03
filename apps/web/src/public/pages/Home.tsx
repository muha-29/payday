export default function PublicHome() {
    return (
        <div>
            {/* HERO */}
            <section className="bg-gradient-to-b from-orange-500 to-amber-400 text-white">
                <div className="max-w-6xl mx-auto px-6 py-20">
                    <h1 className="text-4xl md:text-5xl font-extrabold leading-tight max-w-3xl">
                        Your AI-powered money coach<br />
                        built for everyday Indians
                    </h1>

                    <p className="mt-6 text-lg max-w-2xl text-orange-100">
                        Track earnings, save smarter, and talk to PayDay in your language —
                        no spreadsheets, no stress.
                    </p>

                    <div className="mt-8 flex gap-4">
                        <a
                            href="/login"
                            className="bg-white text-orange-600 px-6 py-3 rounded-xl font-semibold shadow"
                        >
                            Get Started
                        </a>
                        <a
                            href="#features"
                            className="border border-white px-6 py-3 rounded-xl font-semibold"
                        >
                            Learn More
                        </a>
                    </div>
                </div>
            </section>

            {/* FEATURES */}
            <section id="features" className="max-w-6xl mx-auto px-6 py-16">
                <h2 className="text-3xl font-bold text-center mb-12">
                    Built for real life, not spreadsheets
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <Feature
                        title="Track Earnings"
                        desc="Daily income tracking for gig workers & freelancers."
                    />
                    <Feature
                        title="Smart Savings"
                        desc="Micro-savings goals that actually work."
                    />
                    <Feature
                        title="Voice AI Coach"
                        desc="Talk to PayDay instead of reading long text."
                    />
                    <Feature
                        title="Gamified Learning"
                        desc="Build money habits through simple challenges."
                    />
                </div>
            </section>

            {/* LANGUAGE */}
            <section className="bg-white py-16 border-t">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <h2 className="text-3xl font-bold">
                        AI that speaks your language
                    </h2>
                    <p className="mt-4 text-stone-600">
                        Ask questions in Hindi, English, or regional languages.
                        Hear answers instead of reading them.
                    </p>
                </div>
            </section>
        </div>
    );
}

function Feature({ title, desc }: { title: string; desc: string }) {
    return (
        <div className="bg-white rounded-2xl p-6 shadow hover:shadow-md transition">
            <h3 className="font-bold text-lg mb-2">{title}</h3>
            <p className="text-stone-600">{desc}</p>
        </div>
    );
}
