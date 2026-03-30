"use client";

import { useState } from "react";
import { upsertParameter } from "../acciones";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Save, CheckCircle2 } from "lucide-react";

type ParamProps = {
  clave: string;
  defaultVal: number;
  descripcion: string;
  initialValue?: number;
};

export function ParametrosForm({ params }: { params: any[] }) {
  // Configuración de los parámetros requeridos por la plataforma
  const defaults: ParamProps[] = [
    { clave: "margen_rentabilidad", defaultVal: 40, descripcion: "Rentabilidad Deseada (%)" },
    { clave: "porcentaje_mano_obra", defaultVal: 20, descripcion: "Mano de Obra e Instalación (%)" },
    { clave: "costo_kg_aluar", defaultVal: 8.5, descripcion: "Costo Base Aluminio Aluar (USD / Kg)" },
    { clave: "tipo_cambio_blue", defaultVal: 1000, descripcion: "Tipo de Cambio a Pesos ARS (1 USD = X ARS)" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {defaults.map(def => {
        const found = params.find(p => p.clave === def.clave);
        const val = found ? found.valor : def.defaultVal;
        return <ParamItem key={def.clave} p={{...def, initialValue: val}} />;
      })}
    </div>
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
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg text-primary">{p.descripcion}</CardTitle>
        <span className="text-xs font-mono text-muted-foreground bg-primary/5 w-fit px-1 rounded">{p.clave}</span>
      </CardHeader>
      <CardContent className="flex gap-4 items-end">
        <div className="flex-1 space-y-2">
          <Label>Valor configurado</Label>
          <Input 
            type="number" 
            step="0.1"
            value={val} 
            onChange={(e) => setVal(Number(e.target.value))} 
            className="font-mono text-lg"
          />
        </div>
        <Button onClick={handleSave} disabled={loading} className={saved ? "bg-green-600 hover:bg-green-700" : "bg-primary"}>
          {saved ? <CheckCircle2 className="w-5 h-5 mr-2" /> : <Save className="w-4 h-4 mr-2" />}
          {saved ? "Guardado" : "Guardar"}
        </Button>
      </CardContent>
    </Card>
  );
}
