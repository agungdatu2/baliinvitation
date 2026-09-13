export interface GoogleReview {
  authorName: string;
  authorPhotoUrl: string | null;
  rating: number;
  text: string;
  relativeTime: string;
}

interface PlaceDetailsResponse {
  status: string;
  result?: {
    rating?: number;
    user_ratings_total?: number;
    reviews?: {
      author_name: string;
      profile_photo_url?: string;
      rating: number;
      text: string;
      relative_time_description: string;
    }[];
  };
}

// Google Place Details API cuma balikin maksimal 5 review "paling relevan"
// menurut algoritma Google — tidak bisa pilih/urutkan sendiri, dan tidak ada
// akses ke semua review historis. Butuh GOOGLE_PLACES_API_KEY + GOOGLE_PLACE_ID
// di .env (lihat .env.example) — tanpa itu function ini return array kosong
// supaya landing page tetap render normal (section testimoni disembunyikan).
export async function getGoogleReviews(): Promise<GoogleReview[]> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID;
  if (!apiKey || !placeId) return [];

  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=reviews&reviews_no_translations=true&language=id&key=${apiKey}`;

  try {
    // Cache 6 jam — review baru tidak perlu tampil real-time, dan ini menghemat
    // kuota/biaya Google Places API dibanding fetch tiap request.
    const res = await fetch(url, { next: { revalidate: 21600 } });
    const data: PlaceDetailsResponse = await res.json();
    if (data.status !== "OK" || !data.result?.reviews) return [];

    return data.result.reviews.map((r) => ({
      authorName: r.author_name,
      authorPhotoUrl: r.profile_photo_url ?? null,
      rating: r.rating,
      text: r.text,
      relativeTime: r.relative_time_description,
    }));
  } catch {
    return [];
  }
}

export function googleReviewsUrl(): string | null {
  const placeId = process.env.GOOGLE_PLACE_ID;
  if (!placeId) return null;
  return `https://www.google.com/maps/place/?q=place_id:${placeId}`;
}
