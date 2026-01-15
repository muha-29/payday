export function assertEnv() {
    const requiredVars = [
        "SARVAM_API_KEY",
        "GROQ_API_KEY"
    ];

    const missing = requiredVars.filter(
        (key) => !process.env[key]
    );

    if (missing.length > 0) {
        console.error("❌ Missing environment variables:");
        missing.forEach((key) => console.error(`   - ${key}`));

        // Stop server immediately
        process.exit(1);
    }
}