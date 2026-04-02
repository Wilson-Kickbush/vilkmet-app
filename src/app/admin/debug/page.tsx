import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function DebugPage() {
  let leadsCount = 0;
  let paramsCount = 0;
  let error: string | null = null;

  try {
    leadsCount = await prisma.lead.count();
    paramsCount = await prisma.systemParameter.count();
  } catch (err: any) {
    error = err?.message || "Error desconocido de conexión";
  }

  if (error) {
    return (
      <div className="p-20 font-mono">
        <h1 className="text-2xl font-bold text-red-600">❌ FALLO DE CONEXIÓN</h1>
        <div className="mt-4 bg-slate-100 p-6 rounded-xl overflow-auto max-w-full">
          <p className="font-bold text-red-800">Mensaje técnico:</p>
          <pre className="mt-2 text-sm">{error}</pre>
        </div>
        <p className="mt-8 text-xs text-slate-400">
          VILKMET Debug v1.1 - Si ves este error, Vercel no puede comunicarse con la base de datos de Supabase. 
          Verifica las variables DATABASE_URL y DIRECT_URL en el panel de Vercel.
        </p>
      </div>
    );
  }

  return (
    <div className="p-20 font-mono">
      <h1 className="text-2xl font-bold text-green-600">✅ CONEXIÓN EXITOSA</h1>
      <div className="mt-6 space-y-2">
        <p>Prospectos (Leads) activos: <span className="font-bold">{leadsCount}</span></p>
        <p>Parámetros configurados: <span className="font-bold">{paramsCount}</span></p>
      </div>
      <div className="mt-10 p-6 bg-green-50 rounded-2xl border border-green-100">
        <p className="text-sm text-green-800 font-medium">
          El sistema de datos está respondiendo correctamente. 
          Si el Dashboard sigue sin cargar, el problema es puramente visual (un componente o icono).
        </p>
      </div>
      <a href="/admin" className="mt-10 inline-block bg-primary text-white px-8 py-3 rounded-full no-underline">
        Ir al Dashboard
      </a>
    </div>
  );
}
