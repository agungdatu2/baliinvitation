import SessionProviderWrapper from "@/components/admin/SessionProviderWrapper";
import AdminShell from "@/components/admin/AdminShell";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProviderWrapper>
      <AdminShell>{children}</AdminShell>
    </SessionProviderWrapper>
  );
}
