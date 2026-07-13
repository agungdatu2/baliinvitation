import { Heart } from "lucide-react";

export default function Verse({ quote }: { quote?: string }) {
  if (!quote) return null;
  return (
    <section className="px-6 py-10 max-w-2xl mx-auto text-center">
      <div className="groove-glass rounded-2xl p-8 md:p-10">
        <Heart className="h-8 w-8 text-groove-primary mx-auto mb-4" strokeWidth={1.5} />
        <p className="font-groove-body italic text-lg text-groove-secondary leading-relaxed whitespace-pre-line">
          &ldquo;{quote}&rdquo;
        </p>
      </div>
    </section>
  );
}
