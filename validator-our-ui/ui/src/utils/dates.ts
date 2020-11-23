export function parseDateDiff(ms: number): string {
  if (ms < 60 * 1000) return `${Math.round(ms / 1000)} seconds`;
  if (ms < 60 * 60 * 1000) return `${Math.round(ms / (60 * 1000))} minutes`;
  if (ms < 24 * 60 * 60 * 1000)
    return `${Math.round(ms / (60 * 60 * 1000))} minutes`;
  return `${Math.round(ms / (24 * 60 * 60 * 1000))} days`;
}
