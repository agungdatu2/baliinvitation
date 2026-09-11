"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

interface TemplateRow {
  id: string;
  key: string;
  name: string;
  thumbnail: string | null;
  isActive: boolean;
  tagline: string | null;
  description: string | null;
  features: string[];
  isMostPopular: boolean;
  _count: { invitations: number };
}

export default function ThemesManager({ initialTemplates }: { initialTemplates: TemplateRow[] }) {
  const router = useRouter();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  const patch = async (id: string, data: Record<string, unknown>) => {
    setBusyId(id);
    await fetch(`/api/templates/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    setBusyId(null);
    router.refresh();
  };

  return (
    <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
      {initialTemplates.map((t) => (
        <div key={t.id} className="border rounded-lg bg-white p-4">
          <div className="flex justify-between items-start gap-2">
            <div>
              <h3 className="font-serif text-lg">{t.name}</h3>
              <p className="text-xs text-gray-500 font-mono">{t.key}</p>
            </div>
            <button
              onClick={() => patch(t.id, { isActive: !t.isActive })}
              disabled={busyId === t.id}
              className={`text-xs px-2 py-1 rounded-full whitespace-nowrap ${
                t.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
              }`}
            >
              {t.isActive ? "Aktif" : "Nonaktif"}
            </button>
          </div>
          {t.thumbnail && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={t.thumbnail} alt={t.name} className="mt-3 rounded-md w-full h-32 object-cover" />
          )}

          <label className="flex items-center gap-2 mt-3 text-xs text-gray-700">
            <input
              type="checkbox"
              checked={t.isMostPopular}
              disabled={busyId === t.id}
              onChange={(e) => patch(t.id, { isMostPopular: e.target.checked })}
            />
            Most Popular (tampilkan badge di landing page)
          </label>

          <div className="flex justify-between items-center mt-3">
            <p className="text-xs text-gray-500">{t._count.invitations} undangan pakai tema ini</p>
            <div className="flex gap-3">
              <button
                onClick={() => setEditingId(editingId === t.id ? null : t.id)}
                className="text-xs text-blue-600"
              >
                {editingId === t.id ? "Tutup" : "Edit konten landing"}
              </button>
              <a href={`/theme-preview/${t.key}`} target="_blank" className="text-xs text-blue-600">
                Lihat
              </a>
            </div>
          </div>

          {editingId === t.id && (
            <TemplateContentForm
              template={t}
              busy={busyId === t.id}
              onSave={(data) => {
                patch(t.id, data);
                setEditingId(null);
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
}

function TemplateContentForm({
  template,
  busy,
  onSave,
}: {
  template: TemplateRow;
  busy: boolean;
  onSave: (data: { tagline: string; description: string; features: string[] }) => void;
}) {
  const [tagline, setTagline] = useState(template.tagline ?? "");
  const [description, setDescription] = useState(template.description ?? "");
  const [featuresText, setFeaturesText] = useState((template.features ?? []).join("\n"));

  return (
    <div className="mt-4 pt-4 border-t space-y-3">
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Tagline</label>
        <input
          value={tagline}
          onChange={(e) => setTagline(e.target.value)}
          placeholder="Elegant Minimalist"
          className="w-full border rounded px-2 py-1.5 text-sm"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Deskripsi singkat</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={2}
          placeholder="Kertas hangat & emas pudar — clean, timeless..."
          className="w-full border rounded px-2 py-1.5 text-sm"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">
          Checklist fitur (satu baris = satu poin)
        </label>
        <textarea
          value={featuresText}
          onChange={(e) => setFeaturesText(e.target.value)}
          rows={3}
          placeholder={"Font Cormorant + Hanken Grotesk\nBackground bertekstur kertas hangat"}
          className="w-full border rounded px-2 py-1.5 text-sm"
        />
      </div>
      <button
        onClick={() =>
          onSave({
            tagline,
            description,
            features: featuresText
              .split("\n")
              .map((f) => f.trim())
              .filter(Boolean),
          })
        }
        disabled={busy}
        className="w-full bg-gray-900 text-white text-sm rounded px-3 py-1.5 disabled:opacity-50"
      >
        Simpan
      </button>
    </div>
  );
}
