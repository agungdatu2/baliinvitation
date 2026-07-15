// Ambil video ID dari berbagai bentuk URL YouTube (watch, youtu.be, shorts, embed)
// supaya admin bisa paste link apa adanya dari browser tanpa perlu diubah manual.
export function getYouTubeVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtube\.com\/embed\/|youtube\.com\/shorts\/|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}
