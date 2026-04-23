export const YT_REGEX =
  /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/|youtube\.com\/embed\/)([A-Za-z0-9_-]{11})/;

export function isYoutubeUrl(url: string): boolean {
  return YT_REGEX.test(url);
}

export function extractYoutubeId(url: string): string | null {
  const m = url.match(YT_REGEX);
  return m ? m[1] : null;
}
