export function estimateAudioDuration(buffer) {
    console.log('Est')
    if (!buffer?.length) return 0;

    // MediaRecorder Opus ≈ 48kbps ≈ 6KB/sec
    const BYTES_PER_SECOND = 6000;

    return Math.ceil(buffer.length / BYTES_PER_SECOND);
}