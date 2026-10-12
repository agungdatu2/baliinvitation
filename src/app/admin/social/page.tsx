import Link from "next/link";
import { ImageIcon } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { BALI_TZ } from "@/lib/utils/timezone";
import { getSocialPhotos } from "@/lib/social/photos";

export const dynamic = "force-dynamic";

const NEW_WINDOW_DAYS = 14;

export default async function SocialMediaPage() {
  const invitations = await prisma.invitation.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      groomNickname: true,
      brideNickname: true,
      hostName: true,
      galleryImages: true,
      coverImage: true,
      createdAt: true,
    },
  });
  const newSince = Date.now() - NEW_WINDOW_DAYS * 24 * 60 * 60 * 1000;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-lume-ink">Social Media</h1>
        <p className="mt-1 text-sm text-gray-500">
          Pilih client untuk membuat carousel Instagram otomatis dari foto Gallery mereka. Client yang baru masuk
          ({NEW_WINDOW_DAYS} hari terakhir) ditandai &quot;Baru&quot;.
        </p>
      </div>

      {invitations.length === 0 ? (
        <p className="text-sm text-gray-500">Belum ada undangan.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {invitations.map((inv) => {
            const photos = getSocialPhotos(inv.galleryImages, inv.coverImage);
            const isNew = inv.createdAt.getTime() >= newSince;
            const name = inv.hostName || `${inv.groomNickname} & ${inv.brideNickname}`;
            return (
              <Link
                key={inv.id}
                href={`/admin/social/${inv.id}`}
                className="group overflow-hidden rounded-xl border border-lume-line bg-white shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="relative aspect-[4/3] bg-lume-bg">
                  {photos[0] ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={photos[0]} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-gray-300">
                      <ImageIcon size={32} />
                    </div>
                  )}
                  {isNew && (
                    <span className="absolute left-2 top-2 rounded-full bg-lume-gold px-2.5 py-0.5 text-xs font-medium text-white">
                      Baru
                    </span>
                  )}
                </div>
                <div className="p-3">
                  <p className="truncate font-medium text-lume-ink group-hover:underline">{name}</p>
                  <p className="mt-0.5 text-xs text-gray-500">
                    {photos.length} foto ·{" "}
                    {inv.createdAt.toLocaleDateString("id-ID", { timeZone: BALI_TZ, day: "numeric", month: "short", year: "numeric" })}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
