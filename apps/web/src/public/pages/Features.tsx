const features = [
    {
        title: 'Track Earnings Daily',
        desc: 'Log daily income from Uber, Zomato, freelancing or cash jobs—without spreadsheets.'
    },
    {
        title: 'Smart Savings Goals',
        desc: 'Create micro-goals like ₹20 or ₹50 daily and see real progress visually.'
    },
    {
        title: 'Voice AI Money Coach',
        desc: 'Talk to PayDay instead of reading long advice. Ask questions and hear answers.'
    },
    {
        title: 'Gamified Learning',
        desc: 'Build better money habits through challenges, streaks, and rewards.'
    },
    {
        title: 'Speaks Your Language',
        desc: 'Use PayDay in English, Hindi, or regional Indian languages.'
    }
];

export default function Features() {
    return (
        <section className="max-w-6xl mx-auto px-4 py-16">
            <h2 className="text-3xl font-bold text-center mb-4">
                Features built for real life
            </h2>
            <p className="text-center text-stone-500 mb-12">
                Everything you need to earn, save, and learn—without complexity
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {features.map((f) => (
                    <div
                        key={f.title}
                        className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition"
                    >
                        <h3 className="text-lg font-semibold mb-2">
                            {f.title}
                        </h3>
                        <p className="text-sm text-stone-500">
                            {f.desc}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    );
}