import AdminNav from "@/components/admin/AdminNav";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 md:flex">
      <AdminNav />
      <div className="flex-1 min-w-0 px-4 py-6 md:px-10 md:py-8">{children}</div>
    </div>
  );
}
