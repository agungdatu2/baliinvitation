"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { invitationSchema, InvitationFormValues } from "@/lib/validations/invitation.schema";
import { useEffect, useState } from "react";
import { formatRupiah } from "@/lib/utils/format";
import { HIDEABLE_SECTIONS_BY_TEMPLATE } from "@/lib/hideable-sections";
import { TEMPLATE_CATEGORIES, TEMPLATE_CATEGORY_LABELS, TemplateCategory } from "@/lib/validations/template.schema";

interface TemplateOption {
  key: string;
  name: string;
  isActive: boolean;
  category: TemplateCategory;
}

interface PackageOption {
  id: string;
  name: string;
  price: number;
  isActive: boolean;
}

const defaultValues: InvitationFormValues = {
  slug: "",
  status: "draft",
  language: "id",
  showAsExample: false,
  templateKey: "lume",
  packageId: "",
  neverExpires: false,
  clientName: "",
  clientPhone: "",
  clientNotes: "",
  groomNickname: "",
  groomFullName: "",
  groomParents: "",
  groomInstagram: "",
  groomPhoto: "",
  brideNickname: "",
  brideFullName: "",
  brideParents: "",
  brideInstagram: "",
  bridePhoto: "",
  eventTitle: "",
  hostName: "",
  hostLogo: "",
  hostLogoSize: "medium",
  coverImage: "",
  metaImage: "",
  quote: "",
  greeting: "",
  musicUrl: "",
  livestreamUrl: "",
  livestreamNote: "",
  heroVideoUrl: "",
  reverieGateImage: "",
  reverieSaveTheDateImage: "",
  reverieFooterImage: "",
  backgroundType: "video",
  backgroundImage: "",
  backgroundColor: "",
  backgroundSlideshowImages: [],
  hiddenSections: [],
  eventDate: "",
  galleryImages: [],
  loveStory: [{ title: "", story: "" }],
  events: [
    { name: "Resepsi", date: "", timeStart: "", timeEnd: "Selesai", timezone: "WITA", venueName: "", location: "", mapsUrl: "" },
  ],
  bankAccounts: [{ bank: "", accountNumber: "", accountName: "" }],
  dressCode: [],
};

interface InvitationFormProps {
  invitationId?: string;
  initialValues?: Partial<InvitationFormValues>;
}

export default function InvitationForm({ invitationId, initialValues }: InvitationFormProps) {
  const isEdit = Boolean(invitationId);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [templates, setTemplates] = useState<TemplateOption[]>([]);
  const [packages, setPackages] = useState<PackageOption[]>([]);
  // Jenis Acara — filter tampilan Template supaya admin tidak perlu nyari tema
  // wedding di antara tema melaspas/ulang tahun/potong gigi begitu jumlah tema
  // makin banyak. Defaultnya ikut tema undangan yang sudah ada (mode edit),
  // atau "wedding" untuk undangan baru.
  const [categoryFilter, setCategoryFilter] = useState<TemplateCategory>("wedding");

  useEffect(() => {
    fetch("/api/templates")
      .then((r) => r.json())
      .then((data: TemplateOption[]) => {
        const active = data.filter((t) => t.isActive);
        setTemplates(active);
        const current = active.find((t) => t.key === (initialValues?.templateKey ?? defaultValues.templateKey));
        if (current) setCategoryFilter(current.category);
      });
    fetch("/api/packages")
      .then((r) => r.json())
      .then((data: PackageOption[]) => setPackages(data.filter((p) => p.isActive)));
  }, []);

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<InvitationFormValues>({
    resolver: zodResolver(invitationSchema),
    defaultValues: { ...defaultValues, ...initialValues },
  });

  // Field khusus tema Reverie (foto background gate) cuma relevan kalau
  // template yang dipilih "reverie" — jangan bingungin admin dengan field
  // yang tidak dipakai tema lain.
  const selectedTemplateKey = watch("templateKey");
  const filteredTemplates = templates.filter((t) => t.category === categoryFilter);
  // Field Mempelai (groom/bride) cuma relevan buat tema wedding — tema non-wedding
  // (Grand Opening dkk) pakai field eventTitle/hostName/hostLogo generik sebagai
  // gantinya. Default true (anggap wedding) selama daftar tema belum selesai fetch,
  // supaya tidak ada flash section yang salah pas form pertama kali render.
  const selectedTemplate = templates.find((t) => t.key === selectedTemplateKey);
  const isWedding = selectedTemplate ? selectedTemplate.category === "wedding" : true;
  const handleCategoryChange = (category: TemplateCategory) => {
    setCategoryFilter(category);
    const firstMatch = templates.find((t) => t.category === category);
    if (firstMatch) setValue("templateKey", firstMatch.key, { shouldDirty: true });
    // Love Story & Wedding Gift defaultnya mulai dengan satu baris kosong supaya
    // admin wedding langsung lihat form-nya — tapi baris kosong itu tetap divalidasi
    // (title/bank/dst wajib diisi), jadi bikin submit non-wedding gagal kalau tidak
    // dikosongkan total begini.
    if (category !== "wedding") {
      setValue("loveStory", []);
      setValue("bankAccounts", []);
    }
  };
  const hiddenSections = watch("hiddenSections") ?? [];
  const toggleHiddenSection = (key: string) => {
    setValue(
      "hiddenSections",
      hiddenSections.includes(key) ? hiddenSections.filter((k) => k !== key) : [...hiddenSections, key],
      { shouldDirty: true }
    );
  };

  const loveStory = useFieldArray({ control, name: "loveStory" });
  const events = useFieldArray({ control, name: "events" });
  const bankAccounts = useFieldArray({ control, name: "bankAccounts" });
  const gallery = useFieldArray({ control, name: "galleryImages" as never });
  const backgroundSlideshow = useFieldArray({ control, name: "backgroundSlideshowImages" as never });
  const backgroundType = watch("backgroundType");
  const dressCode = useFieldArray({ control, name: "dressCode" });

  const onSubmit = async (values: InvitationFormValues) => {
    setSubmitting(true);
    setServerError(null);
    setSaved(false);
    try {
      const res = await fetch(isEdit ? `/api/invitations/${invitationId}` : "/api/invitations", {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error?.formErrors?.[0] || err.error || "Gagal menyimpan");
      }
      if (isEdit) {
        setSaved(true);
      } else {
        const created = await res.json();
        window.location.href = `/admin/invitations/${created.id}/edit?created=1`;
      }
    } catch (e: any) {
      setServerError(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-3xl mx-auto space-y-8 p-6">
      <h1 className="text-2xl font-semibold">{isEdit ? "Edit Undangan" : "Buat Undangan Baru"}</h1>
      {serverError && <p className="text-red-600 text-sm">{serverError}</p>}
      {saved && <p className="text-green-600 text-sm">Tersimpan.</p>}

      {/* --- Data Client & Template --- */}
      <section className="space-y-3 border rounded-lg p-4">
        <h2 className="font-medium">1. Data Client & Template</h2>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Nama Client" error={errors.clientName?.message}>
            <input {...register("clientName")} className="input" />
          </Field>
          <Field label="No. HP Client" error={errors.clientPhone?.message}>
            <input {...register("clientPhone")} className="input" />
          </Field>
          <Field label="Slug URL (contoh: michael-sherly)" error={errors.slug?.message}>
            <input {...register("slug")} className="input" placeholder="michael-sherly" />
          </Field>
          <Field label="Jenis Acara">
            <select
              value={categoryFilter}
              onChange={(e) => handleCategoryChange(e.target.value as TemplateCategory)}
              className="input"
            >
              {TEMPLATE_CATEGORIES.map((c) => (
                <option key={c} value={c}>{TEMPLATE_CATEGORY_LABELS[c]}</option>
              ))}
            </select>
          </Field>
          <Field label="Template">
            {filteredTemplates.length > 0 ? (
              <select {...register("templateKey")} className="input">
                {filteredTemplates.map((t) => (
                  <option key={t.key} value={t.key}>{t.name}</option>
                ))}
              </select>
            ) : (
              <p className="input text-gray-400 flex items-center">
                Belum ada tema untuk {TEMPLATE_CATEGORY_LABELS[categoryFilter]} — tambahkan di menu Tema
              </p>
            )}
          </Field>
          <Field label="Status">
            <select {...register("status")} className="input">
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </Field>
          <Field label="Bahasa Undangan">
            <select {...register("language")} className="input">
              <option value="id">Bahasa Indonesia</option>
              <option value="en">English</option>
            </select>
          </Field>
          <Field label="Paket (opsional)">
            <select {...register("packageId")} className="input">
              <option value="">- Tanpa paket -</option>
              {packages.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} — {formatRupiah(p.price)}
                </option>
              ))}
            </select>
          </Field>
        </div>
        <Field label="Catatan internal (opsional)">
          <textarea {...register("clientNotes")} className="input" rows={2} />
        </Field>
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input type="checkbox" {...register("showAsExample")} className="h-4 w-4" />
          Tampilkan sebagai contoh publik di landing page (/contoh-undangan)
        </label>
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input type="checkbox" {...register("neverExpires")} className="h-4 w-4" />
          Link aktif seumur hidup (add-on) — abaikan masa aktif paket untuk undangan ini saja
        </label>
      </section>

      {/* --- Mempelai (tema wedding) --- */}
      {isWedding && (
        <section className="grid grid-cols-2 gap-4">
          <div className="space-y-3 border rounded-lg p-4">
            <h2 className="font-medium">2. Mempelai Pria</h2>
            <Field label="Nama Panggilan" error={errors.groomNickname?.message}>
              <input {...register("groomNickname")} className="input" />
            </Field>
            <Field label="Nama Lengkap" error={errors.groomFullName?.message}>
              <input {...register("groomFullName")} className="input" />
            </Field>
            <Field label="Putra dari (nama orang tua)" error={errors.groomParents?.message}>
              <input {...register("groomParents")} className="input" placeholder="Bapak ... & Ibu ..." />
            </Field>
            <Field label="Instagram (opsional)">
              <input {...register("groomInstagram")} className="input" />
            </Field>
            <Field label="URL Foto (opsional — kosongkan untuk pakai placeholder)">
              <input {...register("groomPhoto")} className="input" placeholder="https://..." />
            </Field>
          </div>

          <div className="space-y-3 border rounded-lg p-4">
            <h2 className="font-medium">3. Mempelai Wanita</h2>
            <Field label="Nama Panggilan" error={errors.brideNickname?.message}>
              <input {...register("brideNickname")} className="input" />
            </Field>
            <Field label="Nama Lengkap" error={errors.brideFullName?.message}>
              <input {...register("brideFullName")} className="input" />
            </Field>
            <Field label="Putri dari (nama orang tua)" error={errors.brideParents?.message}>
              <input {...register("brideParents")} className="input" placeholder="Bapak ... & Ibu ..." />
            </Field>
            <Field label="Instagram (opsional)">
              <input {...register("brideInstagram")} className="input" />
            </Field>
            <Field label="URL Foto (opsional — kosongkan untuk pakai placeholder)">
              <input {...register("bridePhoto")} className="input" placeholder="https://..." />
            </Field>
          </div>
        </section>
      )}

      {/* --- Acara (tema non-wedding: Grand Opening, Ulang Tahun, dll) --- */}
      {!isWedding && (
        <section className="space-y-3 border rounded-lg p-4">
          <h2 className="font-medium">2. Data Acara</h2>
          <Field label="Judul Acara" error={errors.eventTitle?.message}>
            <input {...register("eventTitle")} className="input" placeholder="GRAND OPENING" />
          </Field>
          <Field label="Nama Penyelenggara (bisnis/keluarga)" error={errors.hostName?.message}>
            <input {...register("hostName")} className="input" placeholder="Surya Perkasa Motor" />
          </Field>
          <Field label="URL Logo Brand (opsional)">
            <input {...register("hostLogo")} className="input" placeholder="https://..." />
          </Field>
          <Field label="Ukuran Logo (di gate & hero)">
            <select {...register("hostLogoSize")} className="input">
              <option value="small">Kecil</option>
              <option value="medium">Sedang</option>
              <option value="large">Besar</option>
            </select>
          </Field>
        </section>
      )}

      {/* --- Konten Utama --- */}
      <section className="space-y-3 border rounded-lg p-4">
        <h2 className="font-medium">4. Konten Undangan</h2>
        <Field label="Tanggal Acara Utama (untuk countdown)" error={errors.eventDate?.message}>
          <input type="datetime-local" {...register("eventDate")} className="input" />
        </Field>
        <Field label="URL Cover Image">
          <input {...register("coverImage")} className="input" placeholder="https://..." />
        </Field>
        <Field label="URL Meta Image (gambar preview waktu link di-share ke WhatsApp dkk, opsional — kosongkan untuk otomatis pakai Cover Image/foto lain)">
          <input {...register("metaImage")} className="input" placeholder="https://..." />
        </Field>
        <Field label="URL Video Hero (mp4 atau link YouTube, opsional — kosongkan untuk pakai placeholder)">
          <input {...register("heroVideoUrl")} className="input" placeholder="https://... atau https://youtube.com/watch?v=..." />
        </Field>

        <Field label="Tipe Background (berlaku semua tema)">
          <select {...register("backgroundType")} className="input">
            <option value="video">Video</option>
            <option value="image">Foto Tunggal</option>
            <option value="slideshow">Slideshow Foto</option>
            <option value="color">Warna Solid</option>
          </select>
        </Field>
        {backgroundType === "video" && (
          <p className="text-xs text-gray-500 -mt-1">Pakai URL Video Hero di atas.</p>
        )}
        {backgroundType === "image" && (
          <Field label="URL Foto Background (opsional — kosongkan untuk pakai placeholder)">
            <input {...register("backgroundImage")} className="input" placeholder="https://..." />
          </Field>
        )}
        {backgroundType === "color" && (
          <Field label="Warna Background (dipakai kalau tidak ada video/foto)">
            <input type="color" {...register("backgroundColor")} className="input h-10 w-20 p-1" />
          </Field>
        )}
        {backgroundType === "slideshow" && (
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium">Foto Slideshow Background</label>
              <button type="button" onClick={() => backgroundSlideshow.append("" as never)} className="btn-add">
                + Tambah Foto
              </button>
            </div>
            {backgroundSlideshow.fields.map((f, i) => (
              <div key={f.id} className="flex gap-2">
                <input
                  {...register(`backgroundSlideshowImages.${i}` as const)}
                  className="input flex-1"
                  placeholder="https://..."
                />
                <button type="button" onClick={() => backgroundSlideshow.remove(i)} className="btn-remove">
                  X
                </button>
              </div>
            ))}
            {backgroundSlideshow.fields.length === 0 && (
              <p className="text-xs text-gray-500">Belum ada foto — tambahkan minimal 2 foto.</p>
            )}
          </div>
        )}
        {(selectedTemplateKey === "reverie" || selectedTemplateKey === "muse") && (
          <>
            <Field label="URL Foto Background Gate (khusus tema Reverie/Muse, opsional — kosongkan untuk pakai placeholder)">
              <input {...register("reverieGateImage")} className="input" placeholder="https://..." />
            </Field>
            <Field label="Kutipan / Doa untuk Section Doa (khusus tema Reverie/Muse, opsional — kosongkan untuk pakai kutipan default)">
              <textarea {...register("quote")} className="input" rows={3} placeholder="mis. kutipan ayat, doa, atau kata-kata pernikahan" />
            </Field>
            <Field label="URL Foto Section Save the Date (khusus tema Reverie/Muse, opsional — kosongkan untuk pakai placeholder)">
              <input {...register("reverieSaveTheDateImage")} className="input" placeholder="https://..." />
            </Field>
            <Field label="URL Foto Footer/Penutup (khusus tema Reverie/Muse, opsional — kosongkan untuk pakai placeholder)">
              <input {...register("reverieFooterImage")} className="input" placeholder="https://..." />
            </Field>
          </>
        )}
        <Field label="URL Musik Latar (mp3)">
          <input {...register("musicUrl")} className="input" placeholder="https://..." />
        </Field>
        <Field label="Link Live Streaming (YouTube/Instagram Live, opsional)">
          <input {...register("livestreamUrl")} className="input" placeholder="https://..." />
        </Field>
        <Field label="Catatan Jadwal Live Streaming (opsional)">
          <input {...register("livestreamNote")} className="input" placeholder="11 April 2026, 11:00-13:00 WIB" />
        </Field>
        <Field label="Kalimat Pembuka / Greeting (Om Swastiastu, dst.)">
          <textarea {...register("greeting")} className="input" rows={3} />
        </Field>
      </section>

      {/* --- Love Story (dynamic repeatable) --- */}
      <section className="space-y-3 border rounded-lg p-4">
        <div className="flex justify-between items-center">
          <h2 className="font-medium">5. Love Story</h2>
          <button type="button" onClick={() => loveStory.append({ title: "", story: "" })} className="btn-add">
            + Tambah
          </button>
        </div>
        {loveStory.fields.map((f, i) => (
          <div key={f.id} className="border rounded p-3 space-y-2 relative">
            <Field label={`Judul #${i + 1}`}>
              <input {...register(`loveStory.${i}.title`)} className="input" />
            </Field>
            <Field label="Cerita">
              <textarea {...register(`loveStory.${i}.story`)} className="input" rows={3} />
            </Field>
            {loveStory.fields.length > 1 && (
              <button type="button" onClick={() => loveStory.remove(i)} className="btn-remove">
                Hapus
              </button>
            )}
          </div>
        ))}
      </section>

      {/* --- Events (dynamic repeatable, ex: Resepsi & Memadik/Akad) --- */}
      <section className="space-y-3 border rounded-lg p-4">
        <div className="flex justify-between items-center">
          <h2 className="font-medium">6. Jadwal Acara</h2>
          <button
            type="button"
            onClick={() =>
              events.append({ name: "", date: "", timeStart: "", timeEnd: "Selesai", timezone: "WITA", venueName: "", location: "", mapsUrl: "" })
            }
            className="btn-add"
          >
            + Tambah Acara
          </button>
        </div>
        {events.fields.map((f, i) => (
          <div key={f.id} className="border rounded p-3 grid grid-cols-2 gap-2 relative">
            <Field label="Nama Acara (Resepsi / Memadik / Akad)">
              <input {...register(`events.${i}.name`)} className="input" />
            </Field>
            <Field label="Tanggal">
              <input type="date" {...register(`events.${i}.date`)} className="input" />
            </Field>
            <Field label="Jam Mulai">
              <input {...register(`events.${i}.timeStart`)} className="input" placeholder="15:00" />
            </Field>
            <Field label="Jam Selesai">
              <input {...register(`events.${i}.timeEnd`)} className="input" />
            </Field>
            <Field label="Zona Waktu">
              <input {...register(`events.${i}.timezone`)} className="input" placeholder="WITA" />
            </Field>
            <Field label="Nama Venue (opsional, mis. The Garden Grille)">
              <input {...register(`events.${i}.venueName`)} className="input" />
            </Field>
            <Field label="Lokasi">
              <input {...register(`events.${i}.location`)} className="input" />
            </Field>
            <div className="col-span-2">
              <Field label="Link Google Maps">
                <input {...register(`events.${i}.mapsUrl`)} className="input" />
              </Field>
            </div>
            {events.fields.length > 1 && (
              <button type="button" onClick={() => events.remove(i)} className="btn-remove col-span-2">
                Hapus Acara
              </button>
            )}
          </div>
        ))}
      </section>

      {/* --- Wedding Gift / Rekening --- */}
      <section className="space-y-3 border rounded-lg p-4">
        <div className="flex justify-between items-center">
          <h2 className="font-medium">7. Wedding Gift (Rekening)</h2>
          <button type="button" onClick={() => bankAccounts.append({ bank: "", accountNumber: "", accountName: "" })} className="btn-add">
            + Tambah Rekening
          </button>
        </div>
        {bankAccounts.fields.map((f, i) => (
          <div key={f.id} className="border rounded p-3 grid grid-cols-3 gap-2 relative">
            <Field label="Bank">
              <input {...register(`bankAccounts.${i}.bank`)} className="input" />
            </Field>
            <Field label="No. Rekening">
              <input {...register(`bankAccounts.${i}.accountNumber`)} className="input" />
            </Field>
            <Field label="Atas Nama">
              <input {...register(`bankAccounts.${i}.accountName`)} className="input" />
            </Field>
            {bankAccounts.fields.length > 1 && (
              <button type="button" onClick={() => bankAccounts.remove(i)} className="btn-remove col-span-3">
                Hapus
              </button>
            )}
          </div>
        ))}
      </section>

      {/* --- Dress Code (opsional) --- */}
      <section className="space-y-3 border rounded-lg p-4">
        <div className="flex justify-between items-center">
          <h2 className="font-medium">9. Dress Code (opsional)</h2>
          <button type="button" onClick={() => dressCode.append({ label: "", hex: "#fbf9f5" })} className="btn-add">
            + Tambah Warna
          </button>
        </div>
        {dressCode.fields.map((f, i) => (
          <div key={f.id} className="flex items-center gap-2">
            <input type="color" {...register(`dressCode.${i}.hex`)} className="h-10 w-14 rounded border" />
            <input {...register(`dressCode.${i}.label`)} className="input flex-1" placeholder="Nama warna (mis. Cream)" />
            <button type="button" onClick={() => dressCode.remove(i)} className="btn-remove">
              X
            </button>
          </div>
        ))}
      </section>

      {/* --- Gallery --- */}
      <section className="space-y-3 border rounded-lg p-4">
        <div className="flex justify-between items-center">
          <h2 className="font-medium">8. Galeri Foto (URL, upload asli lihat catatan README)</h2>
          <button type="button" onClick={() => gallery.append("" as never)} className="btn-add">
            + Tambah Foto
          </button>
        </div>
        {gallery.fields.map((f, i) => (
          <div key={f.id} className="flex gap-2">
            <input {...register(`galleryImages.${i}` as const)} className="input flex-1" placeholder="https://..." />
            <button type="button" onClick={() => gallery.remove(i)} className="btn-remove">
              X
            </button>
          </div>
        ))}
      </section>

      {(HIDEABLE_SECTIONS_BY_TEMPLATE[selectedTemplateKey]?.length ?? 0) > 0 && (
        <section className="space-y-3 border rounded-lg p-4">
          <h2 className="font-medium">10. Tampilkan / Sembunyikan Section</h2>
          <p className="text-xs text-gray-500">
            Centang section yang ingin disembunyikan dari undangan publik client. Hero dan footer selalu tampil.
          </p>
          <div className="grid grid-cols-2 gap-2">
            {HIDEABLE_SECTIONS_BY_TEMPLATE[selectedTemplateKey].map((s) => (
              <label key={s.key} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={hiddenSections.includes(s.key)}
                  onChange={() => toggleHiddenSection(s.key)}
                />
                {s.label}
              </label>
            ))}
          </div>
        </section>
      )}

      <button type="submit" disabled={submitting} className="w-full py-3 rounded-lg bg-lume-ink text-white font-medium disabled:opacity-50">
        {submitting ? "Menyimpan..." : isEdit ? "Simpan Perubahan" : "Simpan & Buat Undangan"}
      </button>
    </form>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <label className="block text-sm">
      <span className="text-gray-700">{label}</span>
      {children}
      {error && <span className="text-red-600 text-xs">{error}</span>}
    </label>
  );
}
