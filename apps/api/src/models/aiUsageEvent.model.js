const AiUsageEventSchema = new mongoose.Schema({
    userId: String,
    type: { type: String, enum: ["stt", "tts"] },
    seconds: Number,
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("AiUsageEvent", AiUsageEventSchema);