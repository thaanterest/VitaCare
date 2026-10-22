import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session || session.user?.role !== "ADMIN") {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar (fixed) */}
      <AdminSidebar />
      
      {/* Main content with left padding to offset the fixed sidebar */}
      <div className="flex-1 ml-64 p-8">
        {children}
      </div>
    </div>
  );
}
