"use client";

import { useEffect, useRef, useState } from "react";

const SPEED = 0.6; // px per frame, auto-scroll ke kiri
const FRICTION = 0.95; // decay momentum setelah drag dilepas

export default function ThemeMarquee({ items }: { items: { key: string; content: React.ReactNode }[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef(0);
  const velocityRef = useRef(0);
  const draggingRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragStartOffsetRef = useRef(0);
  const lastXRef = useRef(0);
  const lastTRef = useRef(0);
  const [isDragging, setIsDragging] = useState(false);

  // Digandakan sekali supaya loop mulus (begitu separuh pertama habis discroll,
  // separuh kedua identik langsung nyambung tanpa "patahan").
  const doubled = [...items, ...items];

  useEffect(() => {
    let raf: number;
    const frame = () => {
      const track = trackRef.current;
      if (track) {
        const halfWidth = track.scrollWidth / 2;
        if (!draggingRef.current) {
          if (Math.abs(velocityRef.current) > 0.1) {
            offsetRef.current += velocityRef.current;
            velocityRef.current *= FRICTION;
          } else {
            velocityRef.current = 0;
            offsetRef.current -= SPEED;
          }
        }
        if (halfWidth > 0) {
          if (offsetRef.current <= -halfWidth) offsetRef.current += halfWidth;
          if (offsetRef.current > 0) offsetRef.current -= halfWidth;
        }
        track.style.transform = `translate3d(${offsetRef.current}px, 0, 0)`;
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, []);

  const onPointerDown = (e: React.PointerEvent) => {
    draggingRef.current = true;
    setIsDragging(true);
    velocityRef.current = 0;
    dragStartXRef.current = e.clientX;
    dragStartOffsetRef.current = offsetRef.current;
    lastXRef.current = e.clientX;
    lastTRef.current = performance.now();
    (e.currentTarget as Element).setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!draggingRef.current) return;
    const now = performance.now();
    const dt = now - lastTRef.current || 16;
    const dx = e.clientX - lastXRef.current;
    velocityRef.current = (dx / dt) * 16;
    offsetRef.current = dragStartOffsetRef.current + (e.clientX - dragStartXRef.current);
    lastXRef.current = e.clientX;
    lastTRef.current = now;
  };

  const endDrag = () => {
    draggingRef.current = false;
    setIsDragging(false);
  };

  return (
    <div
      className={`overflow-hidden select-none touch-pan-y ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
    >
      <div ref={trackRef} className="flex w-max gap-8 py-4" style={{ willChange: "transform" }}>
        {doubled.map((item, i) => (
          <div key={`${item.key}-${i}`} className="flex-shrink-0">
            {item.content}
          </div>
        ))}
      </div>
    </div>
  );
}
