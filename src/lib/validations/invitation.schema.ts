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
  location: z.string().min(1, "Lokasi wajib diisi"),
  mapsUrl: z.string().url("URL Google Maps tidak valid").optional().or(z.literal("")),
});

export const bankAccountItemSchema = z.object({
  bank: z.string().min(1),
  accountNumber: z.string().min(1),
  accountName: z.string().min(1),
});

export const invitationSchema = z.object({
  slug: z
    .string()
    .min(3, "Slug minimal 3 karakter")
    .regex(/^[a-z0-9-]+$/, "Slug hanya boleh huruf kecil, angka, dan tanda -"),
  status: z.enum(["draft", "published"]).default("draft"),
  templateKey: z.string().min(1, "Pilih template"),

  clientName: z.string().min(1, "Nama client wajib diisi"),
  clientPhone: z.string().optional(),
  clientNotes: z.string().optional(),

  groomNickname: z.string().min(1),
  groomFullName: z.string().min(1),
  groomParents: z.string().min(1),
  groomInstagram: z.string().optional(),

  brideNickname: z.string().min(1),
  brideFullName: z.string().min(1),
  brideParents: z.string().min(1),
  brideInstagram: z.string().optional(),

  coverImage: z.string().optional(),
  quote: z.string().optional(),
  greeting: z.string().optional(),
  musicUrl: z.string().optional(),

  eventDate: z.string().min(1, "Tanggal acara utama wajib diisi"),

  galleryImages: z.array(z.string()).default([]),
  loveStory: z.array(loveStoryItemSchema).default([]),
  events: z.array(eventItemSchema).default([]),
  bankAccounts: z.array(bankAccountItemSchema).default([]),
});

export type InvitationFormValues = z.infer<typeof invitationSchema>;
