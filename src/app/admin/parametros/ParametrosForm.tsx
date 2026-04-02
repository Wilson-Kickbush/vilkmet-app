"use client";

import { useState } from "react";
import { upsertParameter } from "../acciones";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Save, CheckCircle2, TrendingDown, DollarSign, Hammer, Percent } from "lucide-react";

type ParamProps = {
  clave: string;
  defaultVal: number;
  descripcion: string;
  initialValue?: number;
  icon: any;
};

export function ParametrosForm({ params }: { params: any[] }) {
  // Configuración Maestra de Parámetros VILKMET
  const defaults: ParamProps[] = [
    { clave: "margen_rentabilidad", defaultVal: 40, descripcion: "Rentabilidad Deseada (%)", icon: DollarSign },
    { clave: "porcentaje_mano_obra", defaultVal: 10, descripcion: "Mano de Obra e Instalación (%)", icon: Hammer },
    { clave: "gastos_administrativos", defaultVal: 5, descripcion: "Gastos de Estructura / Directos (%)", icon: TrendingDown },
    { clave: "costo_kg_aluar", defaultVal: 10, descripcion: "Costo Base Aluminio Aluar (USD / Kg)", icon: LayersIcon },
    { clave: "tipo_cambio_blue", defaultVal: 1425, descripcion: "Tipo de Cambio a Pesos ARS (1 USD = X ARS)", icon: Percent },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {defaults.map(def => {
        const found = params.find(p => p.clave === def.clave);
        const val = found ? found.valor : def.defaultVal;
        return <ParamItem key={def.clave} p={{...def, initialValue: val}} />;
      })}
    </div>
  );
}

// Icono auxiliar para Layers
function LayersIcon({ className }: { className: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polygon points="12 2 2 7 12 12 22 7 12 2" />
      <polyline points="2 17 12 22 22 17" />
      <polyline points="2 12 12 17 22 12" />
    </svg>
  );
}

function ParamItem({ p }: { p: ParamProps }) {
  const [val, setVal] = useState<number>(p.initialValue!);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    setSaved(false);
    const res = await upsertParameter(p.clave, Number(val), p.descripcion);
    setLoading(false);
    if (res.success) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  return (
    <Card className="rounded-[2.5rem] border-none shadow-xl bg-white group hover:shadow-2xl transition-all duration-500">
      <CardHeader className="pb-4 pt-10 px-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-125 transition-transform duration-700">
           <p.icon className="w-16 h-16 text-primary" />
        </div>
        <CardTitle className="text-xl font-heading font-black text-primary uppercase tracking-tight flex items-center gap-3">
          <div className="p-2 bg-[#E85D04]/10 rounded-lg">
             <p.icon className="w-4 h-4 text-[#E85D04]" />
          </div>
          {p.descripcion}
        </CardTitle>
        <div className="mt-2">
           <span className="text-[9px] font-mono font-black uppercase tracking-widest text-[#1A3A52]/30 bg-[#1A3A52]/5 px-3 py-1 rounded-full">
            Key: {p.clave}
           </span>
        </div>
      </CardHeader>
      <CardContent className="px-8 pb-10 flex gap-4 items-end">
        <div className="flex-1 space-y-3">
          <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 pl-2">Valor Estratégico</Label>
          <div className="relative">
             <Input 
              type="number" 
              step="0.01"
              value={val} 
              onChange={(e) => setVal(Number(e.target.value))} 
              className="h-16 rounded-2xl border-2 border-slate-50 bg-slate-50/50 font-heading font-black text-2xl text-primary px-6 shadow-inner focus:border-[#E85D04]/30 focus:bg-white transition-all outline-none"
            />
            {p.clave.includes('porcentaje') || p.clave.includes('margen') || p.clave.includes('gastos') ? (
              <span className="absolute right-6 top-1/2 -translate-y-1/2 text-2xl font-black text-[#1A3A52]/10">%</span>
            ) : null}
          </div>
        </div>
        <Button 
          onClick={handleSave} 
          disabled={loading} 
          className={`h-16 px-8 rounded-2xl font-black uppercase text-xs tracking-widest transition-all shadow-lg active:scale-95 ${saved ? "bg-green-600 hover:bg-green-700" : "bg-[#1A3A52] hover:bg-[#2A4A62]"}`}
        >
          {saved ? <CheckCircle2 className="w-5 h-5 mr-3" /> : <Save className="w-5 h-5 mr-3" />}
          {saved ? "Sincronizado" : "Guardar"}
        </Button>
      </CardContent>
    </Card>
  );
}
