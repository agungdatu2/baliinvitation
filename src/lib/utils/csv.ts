// CSV kecil untuk export data admin/portal — RFC4180-ish: bungkus nilai yang
// mengandung koma/kutip/baris baru dengan tanda kutip ganda, escape kutip ganda jadi dobel.
function escapeCsvValue(value: unknown): string {
  const str = value === null || value === undefined ? "" : String(value);
  if (/[",\n]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export function toCsv(headers: string[], rows: (string | number)[][]): string {
  const lines = [headers, ...rows].map((row) => row.map(escapeCsvValue).join(","));
  // BOM supaya Excel langsung baca UTF-8 dengan benar (mis. nama dengan karakter non-ASCII)
  return "﻿" + lines.join("\r\n");
}
