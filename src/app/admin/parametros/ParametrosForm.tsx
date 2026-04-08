"use client";

import { useState } from "react";
import { upsertParameter } from "../acciones";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Save, CheckCircle2, TrendingDown, DollarSign, Hammer, Percent, Loader2, Info } from "lucide-react";

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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
  const [error, setError] = useState('');

  const tooltips = {
    margen_rentabilidad: "Porcentaje de ganancia que se agrega al costo total del proyecto.",
    porcentaje_mano_obra: "Porcentaje que representa la mano de obra e instalación dentro del costo total.",
    gastos_administrativos: "Porcentaje que cubre gastos de estructura, administrativos y directos.",
    costo_kg_aluar: "Costo por kilogramo del aluminio Aluar en dólares estadounidenses (USD).",
    tipo_cambio_blue: "Tipo de cambio blue usado para convertir USD a pesos argentinos (ARS).",
  };
  const tooltip = tooltips[p.clave as keyof typeof tooltips] || "";

  const validate = (value: number): string => {
    if (isNaN(value)) return "Valor inválido";
    if (p.clave.includes('margen') || p.clave.includes('porcentaje') || p.clave.includes('gastos')) {
      if (value < 0) return "No puede ser negativo";
      if (value > 500) return "No puede superar el 500%";
    }
    if (p.clave.includes('costo_kg_aluar')) {
      if (value <= 0) return "Debe ser mayor a 0";
      if (value > 1000) return "Costo improbable ( >1000 USD/kg)";
    }
    if (p.clave.includes('tipo_cambio_blue')) {
      if (value <= 0) return "Debe ser mayor a 0";
      if (value > 10000) return "Tipo de cambio improbable ( >10000 ARS)";
    }
    return "";
  };

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
    <Card className="rounded-2xl border border-slate-200 shadow-sm bg-white group hover:shadow-md transition-all duration-300">
      <CardHeader className="pb-3 pt-6 px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-125 transition-transform duration-700">
           <p.icon className="w-16 h-16 text-primary" />
        </div>
        <CardTitle className="text-lg font-heading font-semibold text-primary tracking-tight flex items-center gap-3">
          <div className="p-2 bg-slate-100 rounded-lg">
             <p.icon className="w-4 h-4 text-slate-600" />
          </div>
          {p.descripcion}
          <span title={tooltip} className="inline-flex ml-2">
            <Info className="w-4 h-4 text-slate-400 cursor-help" />
          </span>
        </CardTitle>
        <div className="mt-2">
           <span className="text-[10px] font-mono font-medium tracking-wide text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
            Key: {p.clave}
           </span>
        </div>
      </CardHeader>
      <CardContent className="px-6 pb-6 flex gap-3 items-end">
        <div className="flex-1 space-y-3">
          <Label className="text-xs font-medium text-slate-500 pl-2">Valor</Label>
          <div className="relative">
             <Input 
              type="number" 
              step="0.01"
              value={val} 
              onChange={(e) => { const newVal = Number(e.target.value); setVal(newVal); setError(validate(newVal)); }}
              className="h-12 rounded-xl border border-slate-300 bg-white font-medium text-lg text-primary px-4 shadow-sm focus:border-orange-400 focus:ring-2 focus:ring-orange-200 transition outline-none"
            />
            {p.clave.includes('porcentaje') || p.clave.includes('margen') || p.clave.includes('gastos') ? (
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-500">%</span>
            ) : p.clave.includes('costo_kg_aluar') ? (
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-500">USD</span>
            ) : p.clave.includes('tipo_cambio_blue') ? (
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-500">ARS</span>
            ) : null}
            {error && (
              <div className="mt-2 text-xs text-red-600 font-medium">{error}</div>
            )}
          </div>
        </div>
        <Button
          onClick={handleSave}
          disabled={loading}
          className={`h-12 px-6 rounded-xl font-semibold text-sm transition-all shadow-sm active:scale-[0.98] ${loading ? "bg-blue-400 cursor-not-allowed" : saved ? "bg-green-600 hover:bg-green-700" : "bg-blue-600 hover:bg-blue-700"} text-white`}
        >
          {loading ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : saved ? (
            <CheckCircle2 className="w-4 h-4 mr-2" />
          ) : (
            <Save className="w-4 h-4 mr-2" />
          )}
          {loading ? "Guardando..." : saved ? "Sincronizado" : "Guardar"}
        </Button>
      </CardContent>
    </Card>
  );
}
