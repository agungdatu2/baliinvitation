const VIDEO_EXT_RE = /\.(mp4|webm|mov|m3u8)(\?.*)?$/i;

// Foto untuk postingan: semua foto section Gallery (tanpa video), lalu Cover
// Image sebagai cadangan di urutan terakhir.
export function getSocialPhotos(galleryImages: unknown, coverImage: string | null): string[] {
  const gallery = Array.isArray(galleryImages)
    ? galleryImages.filter((u): u is string => typeof u === "string" && u.trim() !== "" && !VIDEO_EXT_RE.test(u))
    : [];
  const withCover = coverImage && !VIDEO_EXT_RE.test(coverImage) ? [...gallery, coverImage] : gallery;
  return Array.from(new Set(withCover));
}
