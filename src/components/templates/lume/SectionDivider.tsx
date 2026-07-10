export default function SectionDivider() {
  return (
    <div className="flex items-center justify-center gap-3 py-2" aria-hidden="true">
      <span className="h-px w-12 bg-lume-line" />
      <span className="text-lume-gold text-xs">&#10022;</span>
      <span className="h-px w-12 bg-lume-line" />
    </div>
  );
}
