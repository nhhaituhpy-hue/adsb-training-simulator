import type { Metadata } from "next";
import { AdminDashboard } from "@/components/admin/admin-dashboard";

export const metadata: Metadata = {
  title: "Quản lý kịch bản",
};

export default function AdminPage() {
  return <AdminDashboard />;
}
