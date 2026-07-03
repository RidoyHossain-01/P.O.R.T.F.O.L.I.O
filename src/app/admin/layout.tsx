export const dynamic = "force-dynamic";

import AdminLayout from "@/components/sections/AdminLayout";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <AdminLayout>{children}</AdminLayout>;
}

