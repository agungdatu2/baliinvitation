"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { invitationSchema, InvitationFormValues } from "@/lib/validations/invitation.schema";
import { useState } from "react";

// Daftar template aktif — di produksi ambil dari GET /api/templates
const TEMPLATE_OPTIONS = [{ key: "lume", name: "Lume - Elegant Minimalist" }];

const defaultValues: InvitationFormValues = {
  slug: "",
  status: "draft",
  templateKey: "lume",
  clientName: "",
  clientPhone: "",
  clientNotes: "",
  groomNickname: "",
  groomFullName: "",
  groomParents: "",
  groomInstagram: "",
  brideNickname: "",
  brideFullName: "",
  brideParents: "",
  brideInstagram: "",
  coverImage: "",
  quote: "",
  greeting: "",
  musicUrl: "",
  eventDate: "",
  galleryImages: [],
  loveStory: [{ title: "", story: "" }],
  events: [
    { name: "Resepsi", date: "", timeStart: "", timeEnd: "Selesai", timezone: "WITA", location: "", mapsUrl: "" },
  ],
  bankAccounts: [{ bank: "", accountNumber: "", accountName: "" }],
};

export default function InvitationForm() {
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<InvitationFormValues>({
    resolver: zodResolver(invitationSchema),
    defaultValues,
  });

  const loveStory = useFieldArray({ control, name: "loveStory" });
  const events = useFieldArray({ control, name: "events" });
  const bankAccounts = useFieldArray({ control, name: "bankAccounts" });
  const gallery = useFieldArray({ control, name: "galleryImages" as never });

  const onSubmit = async (values: InvitationFormValues) => {
    setSubmitting(true);
    setServerError(null);
    try {
      const res = await fetch("/api/invitations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error?.formErrors?.[0] || err.error || "Gagal menyimpan");
      }
      const created = await res.json();
      window.location.href = `/admin/invitations/${created.id}/edit?created=1`;
    } catch (e: any) {
      setServerError(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-3xl mx-auto space-y-8 p-6">
      <h1 className="text-2xl font-semibold">Buat Undangan Baru</h1>
      {serverError && <p className="text-red-600 text-sm">{serverError}</p>}

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
              {TEMPLATE_OPTIONS.map((t) => (
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
        <Field label="URL Musik Latar (mp3)">
          <input {...register("musicUrl")} className="input" placeholder="https://..." />
        </Field>
        <Field label="Kalimat Pembuka / Greeting (Om Swastiastu, dst.)">
          <textarea {...register("greeting")} className="input" rows={3} />
        </Field>
        <Field label="Quote penutup">
          <textarea {...register("quote")} className="input" rows={2} />
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
        {submitting ? "Menyimpan..." : "Simpan & Buat Undangan"}
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
