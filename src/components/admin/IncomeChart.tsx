"use client";

import { formatRupiah } from "@/lib/utils/format";

interface Point {
  label: string;
  value: number;
}

// Kolom sederhana (satu seri), tanpa legend — judul di atas sudah cukup menjelaskan seri.
export default function IncomeChart({ data }: { data: Point[] }) {
  const max = Math.max(...data.map((d) => d.value), 1);

  return (
    <div className="flex items-end gap-3 h-48 px-2" role="img" aria-label="Grafik income 6 bulan terakhir">
      {data.map((d) => {
        const heightPct = (d.value / max) * 100;
        return (
          <div key={d.label} className="flex-1 flex flex-col items-center h-full justify-end group">
            <span className="text-xs text-lume-ink/80 mb-1 tabular-nums whitespace-nowrap">
              {d.value > 0 ? formatRupiah(d.value).replace("Rp", "").trim() : ""}
            </span>
            <div className="w-full flex justify-center h-full items-end" title={`${d.label}: ${formatRupiah(d.value)}`}>
              <div
                className="w-8 max-w-[24px] rounded-t bg-lume-gold transition-opacity group-hover:opacity-80"
                style={{ height: `${Math.max(heightPct, d.value > 0 ? 2 : 0)}%` }}
              />
            </div>
            <div className="w-full border-t border-lume-line mt-1 pt-1 text-center">
              <span className="text-xs text-lume-ink/60">{d.label}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
