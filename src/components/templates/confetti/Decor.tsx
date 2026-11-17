import { CSSProperties } from "react";

const COLORS = ["#f6b5c8", "#a8d5f2", "#ffd978", "#cdb9f0", "#bfe8d3"];

type Shape = "dot" | "star" | "ring" | "tri";

// Posisi konfeti tetap (bukan random per render) supaya SSR dan client sama persis
// dan tidak ada hydration mismatch.
const PIECES: { x: number; y: number; size: number; shape: Shape; delay: number }[] = [
  { x: 6, y: 8, size: 14, shape: "dot", delay: 0 },
  { x: 18, y: 22, size: 18, shape: "star", delay: 1.2 },
  { x: 32, y: 6, size: 10, shape: "ring", delay: 2.4 },
  { x: 47, y: 16, size: 12, shape: "tri", delay: 0.6 },
  { x: 63, y: 5, size: 16, shape: "dot", delay: 3.1 },
  { x: 78, y: 18, size: 20, shape: "star", delay: 1.8 },
  { x: 92, y: 9, size: 12, shape: "ring", delay: 0.3 },
  { x: 4, y: 44, size: 12, shape: "tri", delay: 2.1 },
  { x: 95, y: 40, size: 14, shape: "dot", delay: 1.4 },
  { x: 10, y: 70, size: 18, shape: "ring", delay: 2.8 },
  { x: 88, y: 66, size: 18, shape: "star", delay: 0.9 },
  { x: 24, y: 88, size: 12, shape: "dot", delay: 3.4 },
  { x: 52, y: 92, size: 14, shape: "tri", delay: 1.1 },
  { x: 74, y: 86, size: 10, shape: "dot", delay: 2.2 },
  { x: 40, y: 56, size: 8, shape: "dot", delay: 0.5 },
  { x: 60, y: 48, size: 8, shape: "ring", delay: 1.6 },
];

function Piece({ shape, color, size }: { shape: Shape; color: string; size: number }) {
  if (shape === "dot") return <span className="block rounded-full" style={{ width: size, height: size, background: color }} />;
  if (shape === "ring")
    return <span className="block rounded-full border-[3px]" style={{ width: size, height: size, borderColor: color }} />;
  if (shape === "tri")
    return (
      <svg width={size} height={size} viewBox="0 0 20 20" aria-hidden="true">
        <path d="M10 2 L18 17 L2 17 Z" fill={color} />
      </svg>
    );
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 1l3.1 7.4L23 9.2l-6 5.2 1.8 7.8L12 18l-6.8 4.2L7 14.4 1 9.2l7.9-.8z" fill={color} />
    </svg>
  );
}

// Konfeti pastel yang melayang pelan — dekorasi, tidak bisa diklik.
export function ConfettiField({ className = "" }: { className?: string }) {
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden="true">
      {PIECES.map((p, i) => (
        <span
          key={i}
          className="absolute animate-confetti-float opacity-80 motion-reduce:animate-none"
          style={{ left: `${p.x}%`, top: `${p.y}%`, animationDelay: `${p.delay}s` } as CSSProperties}
        >
          <Piece shape={p.shape} color={COLORS[i % COLORS.length]} size={p.size} />
        </span>
      ))}
    </div>
  );
}

// Pemisah bergelombang antar section. `from` = warna section DI ATAS gelombang,
// `fill` = warna section DI BAWAH gelombang (harus sama dengan background section
// berikutnya, kalau tidak muncul "pulau" warna di tengah).
export function Wave({ from, fill }: { from: string; fill: string }) {
  return (
    <div style={{ background: from }} aria-hidden="true">
      <svg viewBox="0 0 1440 80" preserveAspectRatio="none" className="block h-10 w-full md:h-16">
        <path d="M0 40 C 180 0, 360 80, 540 40 S 900 0, 1080 40 S 1320 70, 1440 30 L1440 82 L0 82 Z" fill={fill} />
      </svg>
    </div>
  );
}

// Angka usia besar bergradien pastel (hero & gate).
export function AgeNumber({ age, className = "" }: { age: number; className?: string }) {
  return (
    <span
      className={`font-confetti-display font-bold leading-none ${className}`}
      style={{
        backgroundImage: "linear-gradient(135deg, #f6b5c8 0%, #cdb9f0 50%, #a8d5f2 100%)",
        WebkitBackgroundClip: "text",
        backgroundClip: "text",
        color: "transparent",
        WebkitTextFillColor: "transparent",
        filter: "drop-shadow(0 6px 0 rgba(75,58,85,0.12))",
      }}
    >
      {age}
    </span>
  );
}
