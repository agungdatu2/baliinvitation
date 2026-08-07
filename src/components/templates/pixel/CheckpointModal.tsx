"use client";

import { X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

// Wrapper modal generik dipakai semua checkpoint (Doa, Profile, Venue, Gift,
// DressCode, RSVP, Love Story) — pixel-bordered, background gelap semi-transparan.
export default function CheckpointModal({
  title,
  onClose,
  children,
}: {
  title?: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[60] flex items-center justify-center px-5 bg-black/70"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.15 }}
      >
        <motion.div
          className="relative w-full max-w-sm max-h-[85vh] overflow-y-auto pixel-border-thick bg-pixel-panel p-5"
          onClick={(e) => e.stopPropagation()}
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.92 }}
          transition={{ duration: 0.15 }}
        >
          <button
            onClick={onClose}
            aria-label="Close"
            className="absolute -top-3 -right-3 pixel-border bg-pixel-red text-pixel-ink w-8 h-8 flex items-center justify-center"
          >
            <X className="h-4 w-4" />
          </button>
          {title && (
            <p className="font-pixel-display text-[10px] text-pixel-yellow uppercase tracking-widest mb-4">
              {title}
            </p>
          )}
          {children}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
