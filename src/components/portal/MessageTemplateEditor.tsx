"use client";

import { useState } from "react";
import { renderMessageTemplate } from "@/lib/utils/whatsapp";

const SAMPLE_VARS = { nama: "Budi Santoso", link: "https://baliinvitation.com/contoh-slug?g=ABCD1234" };

export default function MessageTemplateEditor({
  token,
  initialValue,
  onSaved,
}: {
  token: string;
  initialValue: string; // "" berarti belum ada template custom (pakai default kami)
  onSaved: (value: string) => void;
}) {
  const [value, setValue] = useState(initialValue);
  const [expanded, setExpanded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const trimmed = value.trim();
  const missingName = trimmed && !trimmed.includes("{{nama}}");
  const missingLink = trimmed && !trimmed.includes("{{link}}");
  const preview = trimmed ? renderMessageTemplate(trimmed, SAMPLE_VARS) : null;

  const save = async (next: string) => {
    setSaving(true);
    setSaved(false);
    const res = await fetch(`/api/portal/${token}/message-template`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messageTemplate: next }),
    });
    setSaving(false);
    if (res.ok) {
      setSaved(true);
      onSaved(next.trim());
      setTimeout(() => setSaved(false), 2000);
    }
  };

  return (
    <div className="border rounded-lg bg-white p-4 mb-4">
      <button
        type="button"
        onClick={() => setExpanded((e) => !e)}
        className="flex items-center justify-between w-full text-left"
      >
        <span className="font-medium text-sm">
          Template Pesan WhatsApp {trimmed ? <span className="text-green-700">(custom)</span> : <span className="text-gray-400">(default kami)</span>}
        </span>
        <span className="text-xs text-blue-600">{expanded ? "Tutup" : "Ubah"}</span>
      </button>

      {expanded && (
        <div className="mt-3 space-y-3">
          <textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            rows={8}
            className="input font-mono text-sm"
            placeholder={"Kosongkan untuk pakai template default kami.\n\nContoh:\nKepada Yth. {{nama}},\n\nKami mengundang Anda ke acara kami.\nLink: {{link}}"}
          />
          <p className="text-xs text-gray-500">
            Pakai <code className="bg-gray-100 px-1 rounded">{"{{nama}}"}</code> untuk nama tamu dan{" "}
            <code className="bg-gray-100 px-1 rounded">{"{{link}}"}</code> untuk link undangannya — keduanya otomatis
            diganti sesuai tamu masing-masing waktu tombol &quot;Kirim via WA&quot; ditekan. Kosongkan semua kalau mau
            pakai template standar kami lagi.
          </p>
          {missingName && (
            <p className="text-xs text-amber-600">
              ⚠️ Template belum ada <code>{"{{nama}}"}</code> — nama tamu tidak akan otomatis muncul.
            </p>
          )}
          {missingLink && (
            <p className="text-xs text-red-600">
              ⚠️ Template belum ada <code>{"{{link}}"}</code> — tamu tidak akan menerima link undangan!
            </p>
          )}

          {preview && (
            <div>
              <p className="text-xs font-medium text-gray-600 mb-1">Pratinjau (contoh nama &quot;Budi Santoso&quot;):</p>
              <div className="border rounded p-3 bg-gray-50 text-sm whitespace-pre-wrap">{preview}</div>
            </div>
          )}

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => save(value)}
              disabled={saving}
              className="bg-gray-900 text-white text-sm px-4 py-2 rounded disabled:opacity-50"
            >
              {saving ? "Menyimpan..." : saved ? "Tersimpan ✓" : "Simpan Template"}
            </button>
            {trimmed && (
              <button
                type="button"
                onClick={() => {
                  setValue("");
                  save("");
                }}
                disabled={saving}
                className="text-sm text-gray-500"
              >
                Pakai Template Default
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
