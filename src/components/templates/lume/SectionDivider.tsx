export default function SectionDivider() {
  return (
    <div className="flex items-center justify-center gap-3 py-2" aria-hidden="true">
      <span className="h-px w-12 bg-groove-line" />
      <span className="w-1.5 h-1.5 rotate-45 border border-groove-clay" />
      <span className="h-px w-12 bg-groove-line" />
    </div>
  );
}
