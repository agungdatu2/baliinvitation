// Efek suara 8-bit disintesis langsung via Web Audio API (oscillator
// square-wave) — bukan file audio statis, supaya tidak perlu unduh/sumber
// file berlisensi. `ctx` & `muted` sengaja singleton module-level (bukan
// React state) karena dipanggil dari banyak komponen tanpa perlu prop-drilling.
let ctx: AudioContext | null = null;
let muted = false;

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const Ctor = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return null;
    ctx = new Ctor();
  }
  // Browser suspend AudioContext sampai ada user gesture — resume defensif
  // tiap play, no-op murah kalau memang sudah running.
  if (ctx.state === "suspended") ctx.resume().catch(() => {});
  return ctx;
}

function tone(freq: number, startOffset: number, duration: number, volume = 0.15) {
  const audioCtx = getCtx();
  if (!audioCtx || muted) return;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = "square";
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(volume, audioCtx.currentTime + startOffset);
  gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + startOffset + duration);
  osc.connect(gain).connect(audioCtx.destination);
  osc.start(audioCtx.currentTime + startOffset);
  osc.stop(audioCtx.currentTime + startOffset + duration);
}

export function setSfxMuted(value: boolean) {
  muted = value;
}
export function isSfxMuted() {
  return muted;
}

// Blip pendek — navigasi menu / tap D-pad.
export function playBlip() {
  tone(660, 0, 0.06, 0.12);
}

// Nada turun singkat — buka panel / pilih opsi.
export function playSelect() {
  tone(880, 0, 0.05, 0.14);
  tone(587, 0.05, 0.08, 0.12);
}

// Arpeggio naik 3 nada — RSVP sukses / achievement unlocked.
export function playSuccess() {
  tone(523.25, 0, 0.09, 0.15);
  tone(659.25, 0.09, 0.09, 0.15);
  tone(783.99, 0.18, 0.16, 0.16);
}
