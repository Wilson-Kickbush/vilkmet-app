import { FileText } from "lucide-react";
import { ProformaGenerator } from "./ProformaGenerator";

export default function ProformaPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-primary/10 rounded-xl">
          <FileText className="w-8 h-8 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-heading font-black text-primary">Generador de Proformas / Contratos</h1>
          <p className="text-muted-foreground">
            Cree documentos legales para cierre de ventas a partir de leads activos del CRM.
          </p>
        </div>
      </div>

      <ProformaGenerator />
    </div>
  );
}