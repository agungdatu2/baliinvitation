"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { invitationSchema, InvitationFormValues } from "@/lib/validations/invitation.schema";
import { useEffect, useState } from "react";
import { formatRupiah } from "@/lib/utils/format";

interface TemplateOption {
  key: string;
  name: string;
  isActive: boolean;
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
  templateKey: "lume",
  packageId: "",
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
  coverImage: "",
  greeting: "",
  musicUrl: "",
  livestreamUrl: "",
  livestreamNote: "",
  heroVideoUrl: "",
  reverieGateImage: "",
  eventDate: "",
  galleryImages: [],
  loveStory: [{ title: "", story: "" }],
  events: [
    { name: "Resepsi", date: "", timeStart: "", timeEnd: "Selesai", timezone: "WITA", location: "", mapsUrl: "" },
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

  useEffect(() => {
    fetch("/api/templates")
      .then((r) => r.json())
      .then((data: TemplateOption[]) => setTemplates(data.filter((t) => t.isActive)));
    fetch("/api/packages")
      .then((r) => r.json())
      .then((data: PackageOption[]) => setPackages(data.filter((p) => p.isActive)));
  }, []);

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<InvitationFormValues>({
    resolver: zodResolver(invitationSchema),
    defaultValues: { ...defaultValues, ...initialValues },
  });

  // Field khusus tema Reverie (foto background gate) cuma relevan kalau
  // template yang dipilih "reverie" — jangan bingungin admin dengan field
  // yang tidak dipakai tema lain.
  const selectedTemplateKey = watch("templateKey");

  const loveStory = useFieldArray({ control, name: "loveStory" });
  const events = useFieldArray({ control, name: "events" });
  const bankAccounts = useFieldArray({ control, name: "bankAccounts" });
  const gallery = useFieldArray({ control, name: "galleryImages" as never });
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
          <Field label="Template">
            <select {...register("templateKey")} className="input">
              {templates.map((t) => (
                <option key={t.key} value={t.key}>{t.name}</option>
              ))}
            </select>
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
      </section>

      {/* --- Mempelai --- */}
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

      {/* --- Konten Utama --- */}
      <section className="space-y-3 border rounded-lg p-4">
        <h2 className="font-medium">4. Konten Undangan</h2>
        <Field label="Tanggal Acara Utama (untuk countdown)" error={errors.eventDate?.message}>
          <input type="datetime-local" {...register("eventDate")} className="input" />
        </Field>
        <Field label="URL Cover Image">
          <input {...register("coverImage")} className="input" placeholder="https://..." />
        </Field>
        <Field label="URL Video Hero (mp4 atau link YouTube, opsional — kosongkan untuk pakai placeholder)">
          <input {...register("heroVideoUrl")} className="input" placeholder="https://... atau https://youtube.com/watch?v=..." />
        </Field>
        {selectedTemplateKey === "reverie" && (
          <Field label="URL Foto Background Gate (khusus tema Reverie, opsional — kosongkan untuk pakai placeholder)">
            <input {...register("reverieGateImage")} className="input" placeholder="https://..." />
          </Field>
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
              events.append({ name: "", date: "", timeStart: "", timeEnd: "Selesai", timezone: "WITA", location: "", mapsUrl: "" })
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
