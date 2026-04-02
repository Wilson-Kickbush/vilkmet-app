import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function DebugPage() {
  try {
    const leadsCount = await prisma.lead.count();
    const paramsCount = await prisma.systemParameter.count();
    
    return (
      <div className="p-20 font-mono">
        <h1 className="text-2xl font-bold text-green-600">✅ CONEXIÓN EXITOSA</h1>
        <p className="mt-4">Leads en base de datos: {leadsCount}</p>
        <p>Parámetros en base de datos: {paramsCount}</p>
        <p className="mt-8 text-xs text-slate-400 italic">VILKMET Debug v1.1 - Si ves esto, el problema no es la base de datos.</p>
        <a href="/admin" className="mt-10 block text-blue-500 underline">Volver al Dashboard</a>
      </div>
    );
  } catch (err: any) {
    return (
      <div className="p-20 font-mono">
        <h1 className="text-2xl font-bold text-red-600">❌ FALLO DE CONEXIÓN</h1>
        <pre className="mt-4 bg-slate-100 p-6 rounded-xl overflow-auto max-w-full">
          {err?.message || "Error desconocido"}
        </pre>
        <p className="mt-8 text-xs text-slate-400">VILKMET Debug v1.1 - Este error confirma que Vercel no está llegando a Supabase.</p>
      </div>
    );
  }
}
