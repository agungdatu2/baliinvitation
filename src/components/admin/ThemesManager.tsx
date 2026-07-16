"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

interface TemplateRow {
  id: string;
  key: string;
  name: string;
  thumbnail: string | null;
  isActive: boolean;
  _count: { invitations: number };
}

export default function ThemesManager({ initialTemplates }: { initialTemplates: TemplateRow[] }) {
  const router = useRouter();
  const [busyId, setBusyId] = useState<string | null>(null);

  const toggleActive = async (t: TemplateRow) => {
    setBusyId(t.id);
    await fetch(`/api/templates/${t.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !t.isActive }),
    });
    setBusyId(null);
    router.refresh();
  };

  return (
    <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
      {initialTemplates.map((t) => (
        <div key={t.id} className="border rounded-lg bg-white p-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-serif text-lg">{t.name}</h3>
              <p className="text-xs text-gray-500 font-mono">{t.key}</p>
            </div>
            <button
              onClick={() => toggleActive(t)}
              disabled={busyId === t.id}
              className={`text-xs px-2 py-1 rounded-full ${
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
          <div className="flex justify-between items-center mt-3">
            <p className="text-xs text-gray-500">{t._count.invitations} undangan pakai tema ini</p>
            <a href={`/theme-preview/${t.key}`} target="_blank" className="text-xs text-blue-600">
              Lihat
            </a>
          </div>
        </div>
      ))}
    </div>
  );
}
