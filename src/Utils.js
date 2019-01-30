// @flow

export function formatSeconds(seconds: number) : string {
  const minutes = Math.floor(seconds / 60);
  const formattedSeconds = String(seconds % 60).padStart(2, '0');
  return `${minutes}:${formattedSeconds}`
}