import Link from "next/link";
import { LayoutDashboard, Users, Settings } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-primary text-primary-foreground flex flex-col hidden md:flex">
        <div className="h-20 flex items-center px-6 border-b border-white/10">
          <Link href="/" className="flex items-center gap-2">
            <span className="font-heading font-black text-2xl tracking-widest leading-none bg-white text-primary px-2 py-1">V<span className="text-accent">|</span>K</span>
            <span className="text-sm font-bold ml-2">ADMIN</span>
          </Link>
        </div>
        
        <nav className="flex-1 py-6 space-y-2 px-4">
          <Link href="/admin" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-white/10 transition-colors">
            <LayoutDashboard className="w-5 h-5" />
            Dashboard Embudo
          </Link>
          <Link href="/admin/parametros" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-white/10 transition-colors">
            <Settings className="w-5 h-5" />
            Control de Parámetros
          </Link>
        </nav>
      </aside>

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
