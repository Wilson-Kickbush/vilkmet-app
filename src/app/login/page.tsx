"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ShieldCheck, Loader2, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError("Credenciales inválidas. Verifique su acceso.");
      setLoading(false);
    } else {
      router.push("/admin");
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center p-6 relative overflow-hidden text-white font-sans">
      {/* Fondo Arquitectónico */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl relative overflow-hidden">
          {/* Logo VILKMET */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="bg-white text-primary p-2 flex items-center justify-center font-heading font-black text-3xl tracking-tighter shadow-lg">
                V<span className="text-[#E85D04]">|</span>K
              </div>
            </div>
            <h1 className="text-sm font-black uppercase tracking-[0.4em] text-white/60">Console Engineering</h1>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-white/50 mb-2 ml-1">Identidad de Acceso</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-[#E85D04]/50 transition-all placeholder:text-white/20"
                placeholder="usuario@vilkmet.com"
                required
              />
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-white/50 mb-2 ml-1">Clave de Seguridad</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-[#E85D04]/50 transition-all placeholder:text-white/20"
                placeholder="••••••••"
                required
              />
            </div>

            {error && (
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-xs text-red-400 font-bold bg-red-400/10 p-3 rounded-lg border border-red-400/20 text-center uppercase tracking-wider"
              >
                {error}
              </motion.p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#E85D04] hover:bg-[#ff6d00] disabled:bg-slate-700 text-white font-black py-5 rounded-xl uppercase tracking-widest flex items-center justify-center gap-3 transition-all active:scale-[0.98] shadow-lg shadow-[#E85D04]/20"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Entrar a la Consola <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/5 text-center">
            <p className="text-[10px] text-white/30 uppercase tracking-widest font-medium flex items-center justify-center gap-2">
              <ShieldCheck className="w-3 h-3 text-[#E85D04]" /> Acceso Restringido - VILKMET Security Sytem
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
