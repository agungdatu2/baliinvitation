import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import SocialPostBuilder from "@/components/admin/SocialPostBuilder";
import { getSocialPhotos } from "@/lib/social/photos";
import { BALI_TZ } from "@/lib/utils/timezone";

export const dynamic = "force-dynamic";

export default async function SocialPostPage({ params }: { params: { id: string } }) {
  const inv = await prisma.invitation.findUnique({
    where: { id: params.id },
    select: {
      slug: true,
      groomNickname: true,
      brideNickname: true,
      galleryImages: true,
      coverImage: true,
      eventDate: true,
      template: { select: { name: true } },
    },
  });
  if (!inv) return notFound();

  // "Moon Cream - Elegant Minimalist" -> "Moon Cream"
  const themeName = inv.template.name.split(" - ")[0].trim();
  const dateLabel = inv.eventDate.toLocaleDateString("id-ID", {
    timeZone: BALI_TZ,
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div>
      <Link href="/admin/social" className="mb-2 inline-block text-sm text-gray-500">
        &larr; Social Media
      </Link>
      <h1 className="mb-1 text-2xl font-semibold text-lume-ink">
        {inv.groomNickname} &amp; {inv.brideNickname}
      </h1>
      <p className="mb-6 text-sm text-gray-500">Postingan Instagram otomatis dari foto Gallery client (cover + mockup tema).</p>
      <SocialPostBuilder
        slug={inv.slug}
        groom={inv.groomNickname}
        bride={inv.brideNickname}
        themeName={themeName}
        dateLabel={dateLabel}
        photos={getSocialPhotos(inv.galleryImages, inv.coverImage)}
      />
    </div>
  );
}
