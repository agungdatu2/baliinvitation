import AdminNav from "@/components/admin/AdminNav";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <p className="font-serif text-lg text-lume-ink">BaliInvitation — Admin</p>
        </div>
      </header>
      <AdminNav />
      <div className="max-w-6xl mx-auto px-6 pb-16">{children}</div>
    </div>
  );
}
