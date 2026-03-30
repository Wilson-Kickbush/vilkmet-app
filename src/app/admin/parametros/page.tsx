import { PrismaClient } from "@prisma/client";
import { ParametrosForm } from "./ParametrosForm";

const prisma = new PrismaClient({ accelerateUrl: process.env.DATABASE_URL || "prisma://dummy.com/?api_key=123" } as any);
export const dynamic = "force-dynamic";

export default async function ParametrosPage() {
  const currentParams = await prisma.systemParameter.findMany();

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h2 className="text-3xl font-heading font-bold text-primary">Parámetros del Sistema</h2>
          <p className="text-muted-foreground mt-1">
            Métricas que dictan el algoritmo del cotizador B2C paramétrico. 
            Cualquier cambio aquí se refleja instantáneamente en nuevos presupuestos.
          </p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border">
        <ParametrosForm params={currentParams} />
      </div>
    </div>
  );
}
