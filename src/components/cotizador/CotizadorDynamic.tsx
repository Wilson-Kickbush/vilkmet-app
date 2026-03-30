"use client";

import { useState } from "react";
import { SimuladorVisual } from "./SimuladorVisual";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight, ChevronLeft, Send, CheckCircle2 } from "lucide-react";
import * as motion from "framer-motion/client";

export function CotizadorDynamic() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [precioEstimado, setPrecioEstimado] = useState(0);

  // Form State
  const [formData, setFormData] = useState({
    linea: "Módena",
    tipologia: "corrediza",
    ancho: "1500",
    alto: "1200",
    color: "blanco",
    vidrio: "dvh",
    nombre: "",
    whatsapp: "",
    email: ""
  });

  const coloresMap: Record<string, string> = {
    blanco: "#FFFFFF",
    negro: "#2D2D2D",
    anodizado: "#a3a3a3",
    bronce: "#8B5A2B"
  };

  const handleNext = () => setStep(s => Math.min(5, s + 1));
  const handleBack = () => setStep(s => Math.max(1, s - 1));

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      
      if (res.ok) {
        setPrecioEstimado(data.precioFinal);
        setSuccess(true);
      } else {
        alert("Error: " + data.error);
      }
    } catch (error) {
      alert("Hubo un error de conexión.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center py-16 animate-in fade-in zoom-in duration-500">
        <CheckCircle2 className="h-20 w-20 text-green-500 mx-auto mb-6" />
        <h3 className="text-3xl font-heading font-bold text-primary mb-4">¡Cotización Generada!</h3>
        <p className="text-lg text-muted-foreground mb-8">
          Gracias {formData.nombre}, tu presupuesto preliminar es de:
        </p>
        <div className="bg-secondary p-8 rounded-2xl max-w-md mx-auto mb-8 border border-border">
          <span className="block text-sm text-muted-foreground uppercase tracking-widest mb-2">Total Estimado</span>
          <span className="text-5xl font-bold text-accent">
            ${precioEstimado.toLocaleString("es-AR")} <span className="text-xl">ARS</span>
          </span>
          <p className="text-xs text-muted-foreground mt-4">*Sujeto a verificación técnica en obra.</p>
        </div>
        <Button onClick={() => window.location.reload()} variant="outline">Hacer otra cotización</Button>
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-2 gap-10 items-start">
      
      {/* Visualizer (Left Side) */}
      <div className="hidden lg:flex flex-col sticky top-24">
        <h3 className="text-lg font-heading font-semibold text-primary mb-4">Simulador en Tiempo Real</h3>
        <SimuladorVisual 
          tipologia={formData.tipologia as any} 
          ancho={Number(formData.ancho)} 
          alto={Number(formData.alto)} 
          colorHex={coloresMap[formData.color]}
        />
        <div className="mt-4 flex gap-4 text-xs text-muted-foreground bg-primary/5 p-4 rounded-lg">
          <div><strong className="text-primary">Línea:</strong> {formData.linea}</div>
          <div><strong className="text-primary">Vidrio:</strong> {formData.vidrio.toUpperCase()}</div>
        </div>
      </div>

      {/* Multistep Form (Right Side) */}
      <Card className="border-none shadow-none">
        <CardContent className="p-0">
          {/* Progress Bar */}
          <div className="flex justify-between mb-8 relative">
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-secondary -z-10 -translate-y-1/2 rounded"></div>
            <div className="absolute top-1/2 left-0 h-1 bg-accent -z-10 -translate-y-1/2 rounded transition-all duration-300" style={{ width: `${((step - 1) / 4) * 100}%` }}></div>
            
            {[1, 2, 3, 4, 5].map((idx) => (
              <div key={idx} className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-colors ${step >= idx ? 'bg-accent text-white border-accent' : 'bg-background text-muted-foreground border-border'}`}>
                {idx}
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="min-h-[350px] flex flex-col justify-between">
            {step === 1 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                <h3 className="text-2xl font-heading text-primary">1. Tecnología del Perfil</h3>
                <div className="space-y-4">
                  <Label>Selecciona la Línea de Aluminio</Label>
                  <Select value={formData.linea} onValueChange={(v) => handleChange("linea", v)}>
                    <SelectTrigger className="h-12"><SelectValue placeholder="Línea" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Herrero">Línea Herrero (Económica)</SelectItem>
                      <SelectItem value="Módena">Línea Módena (Standard)</SelectItem>
                      <SelectItem value="A40">A40 Compact (Premium)</SelectItem>
                      <SelectItem value="A40 RPT">A40 con RPT (Aislamiento Máximo)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                <h3 className="text-2xl font-heading text-primary">2. Diseño y Tipología</h3>
                <div className="space-y-4">
                  <Label>Elige cómo se abre tu abertura</Label>
                  <div className="grid grid-cols-3 gap-4">
                    {["corrediza", "abrir", "fijo"].map(tipo => (
                      <div 
                        key={tipo} 
                        onClick={() => handleChange("tipologia", tipo)}
                        className={`cursor-pointer border-2 rounded-xl p-4 text-center transition-all ${formData.tipologia === tipo ? 'border-accent bg-accent/5' : 'border-border hover:border-primary/50'}`}
                      >
                        <div className="h-12 w-full bg-slate-200 mb-2 rounded flex items-center justify-center text-[10px] uppercase text-slate-500">Ico</div>
                        <span className="capitalize text-sm font-medium">{tipo}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                <h3 className="text-2xl font-heading text-primary">3. Medidas Exactas</h3>
                <p className="text-sm text-muted-foreground mb-4">Introduce las medidas en milímetros (mm). Ej: 1500mm = 1,5 metros.</p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Ancho (mm)</Label>
                    <Input type="number" value={formData.ancho} onChange={(e) => handleChange("ancho", e.target.value)} className="h-12 font-mono text-lg" />
                  </div>
                  <div className="space-y-2">
                    <Label>Alto (mm)</Label>
                    <Input type="number" value={formData.alto} onChange={(e) => handleChange("alto", e.target.value)} className="h-12 font-mono text-lg" />
                  </div>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                <h3 className="text-2xl font-heading text-primary">4. Estética de Terminación</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Color del Aluminio</Label>
                    <Select value={formData.color} onValueChange={(v) => handleChange("color", v)}>
                      <SelectTrigger className="h-12"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="blanco">Blanco Aluar</SelectItem>
                        <SelectItem value="negro">Negro Microtexturado</SelectItem>
                        <SelectItem value="anodizado">Anodizado Natural</SelectItem>
                        <SelectItem value="bronce">Bronce Colonial</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Tipo de Vidrio</Label>
                    <Select value={formData.vidrio} onValueChange={(v) => handleChange("vidrio", v)}>
                      <SelectTrigger className="h-12"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="float">Float Simple 4mm</SelectItem>
                        <SelectItem value="dvh">DVH (Doble Vidriado - Aislante)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}

            {step === 5 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-heading text-primary mb-2">5. Resultados Listos</h3>
                  <p className="text-muted-foreground">Ingresa tus datos para ver el valor y guardar tu cotización paramétrica.</p>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Nombre y Apellido</Label>
                    <Input required placeholder="Tu nombre" value={formData.nombre} onChange={(e) => handleChange("nombre", e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>WhatsApp (Para enviarte el PDF)</Label>
                    <Input required type="tel" placeholder="Ej: +54 9 11 0000-0000" value={formData.whatsapp} onChange={(e) => handleChange("whatsapp", e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Correo Electrónico (Opcional)</Label>
                    <Input type="email" placeholder="correo@ejemplo.com" value={formData.email} onChange={(e) => handleChange("email", e.target.value)} />
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-10 border-t pt-6">
              <Button type="button" variant="ghost" onClick={handleBack} disabled={step === 1} className="text-muted-foreground">
                <ChevronLeft className="w-4 h-4 mr-2" /> Atrás
              </Button>
              
              {step < 5 ? (
                <Button type="button" onClick={handleNext} className="bg-primary hover:bg-primary/90 text-white">
                  Siguiente paso <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button type="submit" disabled={loading} className="bg-accent hover:bg-accent/90 text-white animate-pulse">
                  {loading ? "Calculando..." : "Ver Precio Final"} <Send className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
      
      {/* Mobile Visualizer show below */}
      <div className="lg:hidden mt-8">
        <h4 className="text-sm font-semibold text-center mb-2">Previsualización</h4>
        <SimuladorVisual 
          tipologia={formData.tipologia as any} 
          ancho={Number(formData.ancho)} 
          alto={Number(formData.alto)} 
          colorHex={coloresMap[formData.color]}
        />
      </div>
    </div>
  );
}
