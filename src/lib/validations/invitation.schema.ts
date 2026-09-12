import { z } from "zod";

export const loveStoryItemSchema = z.object({
  title: z.string().min(1, "Judul wajib diisi"),
  story: z.string().min(1, "Cerita wajib diisi"),
});

export const eventItemSchema = z.object({
  name: z.string().min(1, "Nama acara wajib diisi"),
  date: z.string().min(1, "Tanggal wajib diisi"),
  timeStart: z.string().min(1, "Jam mulai wajib diisi"),
  timeEnd: z.string().optional(),
  timezone: z.string().optional(),
  venueName: z.string().optional(),
  location: z.string().min(1, "Lokasi wajib diisi"),
  mapsUrl: z.string().url("URL Google Maps tidak valid").optional().or(z.literal("")),
});

export const bankAccountItemSchema = z.object({
  bank: z.string().min(1),
  accountNumber: z.string().min(1),
  accountName: z.string().min(1),
});

export const dressCodeItemSchema = z.object({
  label: z.string().min(1),
  hex: z
    .string()
    .regex(/^#[0-9a-fA-F]{6}$/, "Format warna harus #RRGGBB"),
});

export const invitationSchema = z.object({
  slug: z
    .string()
    .min(3, "Slug minimal 3 karakter")
    .regex(/^[a-z0-9-]+$/, "Slug hanya boleh huruf kecil, angka, dan tanda -"),
  status: z.enum(["draft", "published"]).default("draft"),
  language: z.enum(["id", "en"]).default("id"),
  showAsExample: z.boolean().default(false),
  templateKey: z.string().min(1, "Pilih template"),
  packageId: z.string().optional().or(z.literal("")),
  // Add-on "Link aktif seumur hidup" — override activeMonths dari Package untuk
  // invitation ini saja, lihat komentar Invitation.neverExpires di schema.prisma
  neverExpires: z.boolean().default(false),

  clientName: z.string().min(1, "Nama client wajib diisi"),
  clientPhone: z.string().optional(),
  clientNotes: z.string().optional(),

  // Optional (bukan .min(1)) — undangan non-wedding (Grand Opening dkk) tidak
  // mengisi field ini sama sekali, lihat eventTitle/hostName/hostLogo di bawah.
  groomNickname: z.string().default(""),
  groomFullName: z.string().default(""),
  groomParents: z.string().default(""),
  groomInstagram: z.string().optional(),
  groomPhoto: z.string().optional(),

  brideNickname: z.string().default(""),
  brideFullName: z.string().default(""),
  brideParents: z.string().default(""),
  brideInstagram: z.string().optional(),
  bridePhoto: z.string().optional(),

  // Data acara non-wedding — lihat komentar Invitation.eventTitle di schema.prisma
  eventTitle: z.string().optional(),
  hostName: z.string().optional(),
  hostLogo: z.string().optional(),
  hostLogoSize: z.enum(["small", "medium", "large"]).default("medium"),

  coverImage: z.string().optional(),
  // og:image eksplisit — lihat komentar Invitation.metaImage di schema.prisma
  metaImage: z.string().optional(),
  quote: z.string().optional(),
  greeting: z.string().optional(),
  musicUrl: z.string().optional(),
  livestreamUrl: z.string().optional(),
  livestreamNote: z.string().optional(),
  heroVideoUrl: z.string().optional(),
  reverieGateImage: z.string().optional(),
  reverieSaveTheDateImage: z.string().optional(),
  reverieFooterImage: z.string().optional(),
  backgroundType: z.enum(["video", "image", "slideshow", "color"]).default("video"),
  backgroundImage: z.string().optional(),
  backgroundColor: z.string().optional(),
  backgroundSlideshowImages: z.array(z.string()).default([]),
  hiddenSections: z.array(z.string()).default([]),

  eventDate: z.string().min(1, "Tanggal acara utama wajib diisi"),

  galleryImages: z.array(z.string()).default([]),
  loveStory: z.array(loveStoryItemSchema).default([]),
  events: z.array(eventItemSchema).default([]),
  bankAccounts: z.array(bankAccountItemSchema).default([]),
  dressCode: z.array(dressCodeItemSchema).default([]),
});

export type InvitationFormValues = z.infer<typeof invitationSchema>;
