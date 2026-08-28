/** Judge-score → color interpolation: green (#10b981, score 1.0) → red (#ef4444, score 10.0).
 *  Used consistently for the score-colored chat buttons and the judge score badge. */
export function scoreToColor(score?: number): string {
    if (score === undefined) return '#475569'; // neutral gray
    const t = Math.min(1, Math.max(0, (score - 1) / 9));
    const green = [16, 185, 129];
    const red = [239, 68, 68];
    const color = green.map((gi, i) => Math.round(gi + (red[i] - gi) * t));
    return `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
}