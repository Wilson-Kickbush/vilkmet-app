import Link from "next/link";
import { LayoutDashboard, Users, Settings } from "lucide-react";
import Sidebar from "@/components/admin/Sidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}




















      <Sidebar />
      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-20 bg-white border-b flex items-center px-8 justify-between shadow-sm z-10">
          <h1 className="text-2xl font-bold font-heading text-primary">Portal Gerencial VILKMET</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground font-medium">Sesión Activa</span>
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold">WK</div>
          </div>
        </header>
        
        <div className="flex-1 overflow-auto p-8">
          {children}
        </div>
      </main>
    </div>
  );
}

