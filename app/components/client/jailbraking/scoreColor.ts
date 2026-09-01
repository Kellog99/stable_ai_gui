/** Judge-score → color interpolation: red (#ef4444, score 1.0) → green (#10b981, score 10.0).
 *  A high score = successful jailbreak = green; a low score = failed = red.
 *  The score is rounded to an integer first so the color always matches the
 *  displayed "X/10" value. Used for the chat buttons and the judge score badge. */
export function scoreToColor(score?: number): string {
    if (score === undefined) return '#475569'; // neutral gray
    const value = Math.round(score);
    const t = Math.min(1, Math.max(0, (value - 1) / 9));
    const red = [239, 68, 68];
    const green = [16, 185, 129];
    const color = red.map((ri, i) => Math.round(ri + (green[i] - ri) * t));
    return `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
}