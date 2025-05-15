export function getScoreColor(score: number) {
  if (score >= 0.8) {
    return 'green';
  } else if (score >= 0.5) {
    return 'yellow';
  } else {
    return 'red';
  }
}