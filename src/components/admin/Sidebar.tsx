"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Settings, Wallet, Image as ImageIcon, FileText } from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();

  // Función para determinar si un enlace está activo
  const isActive = (path: string) => {
    return pathname === path || pathname?.startsWith(path + "/");
  };

  return (
    <aside className="w-64 bg-primary text-primary-foreground flex flex-col hidden md:flex">
      <div className="h-20 flex items-center px-6 border-b border-white/10">
        <Link href="/" className="flex items-center gap-2">
          <span className="font-heading font-black text-2xl tracking-widest leading-none bg-white text-primary px-2 py-1">
            V<span className="text-accent">|</span>K
          </span>
          <span className="text-sm font-bold ml-2">ADMIN</span>
        </Link>
      </div>
      
      <nav className="flex-1 py-6 space-y-2 px-4">
        <Link 
          href="/admin" 
          className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
            isActive("/admin") 
              ? "bg-white/20" 
              : "hover:bg-white/10"
          }`}
        >
          <LayoutDashboard className="w-5 h-5" />
          Dashboard Embudo
        </Link>
        
        <Link
          href="/admin/portfolio"
          className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
            isActive("/admin/portfolio")
              ? "bg-white/20"
              : "hover:bg-white/10"
          }`}
        >
          <ImageIcon className="w-5 h-5" />
          Gestión de Portfolio
        </Link>
        
        <Link
          href="/admin/proforma"
          className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
            isActive("/admin/proforma")
              ? "bg-white/20"
              : "hover:bg-white/10"
          }`}
        >
          <FileText className="w-5 h-5" />
          Generar Proforma
        </Link>
        
        <Link
          href="/admin/parametros"
          className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
            isActive("/admin/parametros")
              ? "bg-white/20"
              : "hover:bg-white/10"
          }`}
        >
          <Settings className="w-5 h-5" />
          Control de Parámetros
        </Link>
        
        <Link 
          href="/admin/finanzas" 
          className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
            isActive("/admin/finanzas") 
              ? "bg-white/20" 
              : "hover:bg-white/10"
          }`}
        >
          <Wallet className="w-5 h-5" />
          Contabilidad
        </Link>
      </nav>
    </aside>
  );
}