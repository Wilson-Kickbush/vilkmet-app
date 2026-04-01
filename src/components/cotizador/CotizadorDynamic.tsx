"use client";

import { useState } from "react";
import { SimuladorVisual } from "./SimuladorVisual";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight, Send, CheckCircle2, Plus, Trash2, CreditCard, Wallet, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ProjectItem {
  id: string;
  linea: string;
  tipologia: string;
  ancho: number;
  alto: number;
  color: string;
  vidrio: string;
  subtotal: number;
}

export function CotizadorDynamic() {
  const [view, setView] = useState<"builder" | "project" | "checkout">("builder");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  // Project State
  const [projectItems, setProjectItems] = useState<ProjectItem[]>([]);
  const [paymentMode, setPaymentMode] = useState<"contado" | "lista" | "cuotas3" | "cuotas6">("contado");

  // Current Item Form State
  const [formData, setFormData] = useState({
    linea: "Módena",
    tipologia: "corrediza",
    ancho: "1500",
    alto: "1200",
    color: "blanco",
    vidrio: "dvh"
  });

  // Client Data
  const [clientData, setClientData] = useState({
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

  // Cálculo Local Estimado (Para Feedback instantáneo antes de guardar)
  const calculateLocalPrice = () => {
    const a = Number(formData.ancho) / 1000;
    const h = Number(formData.alto) / 1000;
    const mLin = (a + h) * 2;
    const m2 = a * h;
    
    let kgM = 1.8; // Módena default
    if (formData.linea === "Herrero") kgM = 1.2;
    if (formData.linea.includes("A40")) kgM = 2.8;

    const baseCostUSD = (mLin * kgM * 8.5) + (m2 * (formData.vidrio === "dvh" ? 35 : 12));
    const finalARS = baseCostUSD * 1400 * 1.2 * 1.4; // Simulación de márgenes
    return Math.round(finalARS);
  };

  const handleNext = () => setStep(s => Math.min(4, s + 1));
  const handleBack = () => setStep(s => Math.max(1, s - 1));

  const addItemToProject = () => {
    const newItem: ProjectItem = {
      id: Math.random().toString(36).substr(2, 9),
      ...formData,
      ancho: Number(formData.ancho),
      alto: Number(formData.alto),
      subtotal: calculateLocalPrice()
    };
    setProjectItems([...projectItems, newItem]);
    setView("project");
    setStep(1); // Reset builder for next item
  };

  const removeItem = (id: string) => {
    setProjectItems(projectItems.filter(item => item.id !== id));
  };

  const totalProject = projectItems.reduce((acc, item) => acc + item.subtotal, 0);

  const getFinancingLabel = () => {
    switch(paymentMode) {
      case "contado": return { label: "Pago Contado (10% OFF)", total: totalProject * 0.9, color: "text-green-600" };
      case "lista": return { label: "Precio de Lista (1 Pago)", total: totalProject, color: "text-primary" };
      case "cuotas3": return { label: "3 Cuotas Fijas (+15%)", total: totalProject * 1.15, cuota: (totalProject * 1.15) / 3, color: "text-orange-600" };
      case "cuotas6": return { label: "6 Cuotas Fijas (+30%)", total: totalProject * 1.30, cuota: (totalProject * 1.30) / 6, color: "text-orange-700" };
    }
  };

  const handleSubmitFinal = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: projectItems,
          client: clientData,
          paymentMode,
          totalFinanciado: getFinancingLabel().total
        })
      });
      
      if (res.ok) setSuccess(true);
      else alert("Error al procesar el presupuesto");
    } catch (error) {
      alert("Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center py-20 animate-in fade-in zoom-in duration-700 max-w-2xl mx-auto">
        <CheckCircle2 className="h-24 w-24 text-green-500 mx-auto mb-8 animate-bounce" />
        <h3 className="text-4xl font-heading font-bold text-[#1A3A52] mb-6">¡Presupuesto Enviado!</h3>
        <p className="text-xl text-muted-foreground mb-10">
          Hola <span className="font-bold text-primary">{clientData.nombre}</span>, hemos recibido tu proyecto de <span className="font-bold">{projectItems.length} aberturas</span>. 
          Un asesor técnico de <span className="font-bold text-[#E85D04]">VILKMET</span> te contactará por WhatsApp para validar las medidas finales.
        </p>
        <div className="bg-[#1A3A52] text-white p-10 rounded-[2rem] shadow-2xl border border-white/10">
          <span className="block text-xs uppercase tracking-[0.3em] text-white/50 mb-4">Total Presupuestado ({getFinancingLabel().label})</span>
          <span className="text-6xl font-black">
            ${getFinancingLabel().total.toLocaleString("es-AR")}
          </span>
        </div>
        <Button onClick={() => window.location.reload()} variant="link" className="mt-10 text-primary uppercase font-bold tracking-widest">Iniciar nuevo proyecto</Button>
      </div>
    );
  }

  // VISTA: ARMADO DE CADA PIEZA
  if (view === "builder") {
    return (
      <div className="grid lg:grid-cols-2 gap-12 items-start">
        <div className="hidden lg:block sticky top-24">
          <div className="mb-6 flex justify-between items-end">
            <h3 className="text-sm font-black uppercase tracking-widest text-[#E85D04]">Simulador I:I</h3>
            {projectItems.length > 0 && (
              <Button variant="outline" size="sm" onClick={() => setView("project")} className="rounded-full border-[#1A3A52] text-[#1A3A52] font-bold">
                Ver Proyecto ({projectItems.length})
              </Button>
            )}
          </div>
          <SimuladorVisual 
            tipologia={formData.tipologia as any} 
            ancho={Number(formData.ancho)} 
            alto={Number(formData.alto)} 
            colorHex={coloresMap[formData.color]}
          />
          <div className="mt-8 grid grid-cols-2 gap-4">
            <div className="bg-primary/5 p-4 rounded-2xl border border-primary/10">
              <span className="block text-[10px] uppercase font-bold text-primary/50 mb-1">Línea Técnica</span>
              <p className="text-sm font-bold text-primary">{formData.linea}</p>
            </div>
            <div className="bg-primary/5 p-4 rounded-2xl border border-primary/10">
              <span className="block text-[10px] uppercase font-bold text-primary/50 mb-1">Costo Estimado</span>
              <p className="text-sm font-bold text-primary">${calculateLocalPrice().toLocaleString("es-AR")}</p>
            </div>
          </div>
        </div>

        <Card className="border-none shadow-none bg-transparent">
          <CardContent className="p-0">
            <div className="flex justify-between mb-10">
              {[1, 2, 3, 4].map((idx) => (
                <div key={idx} className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black transition-all ${step >= idx ? 'bg-[#1A3A52] text-white' : 'bg-white text-slate-300 border border-slate-100'}`}>
                  {idx}
                </div>
              ))}
            </div>

            <div className="min-h-[400px] flex flex-col justify-between">
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  {step === 1 && (
                    <div className="space-y-6">
                      <h3 className="text-3xl font-heading font-black text-[#1A3A52]">Ingeniería del Perfil</h3>
                      <Select value={formData.linea} onValueChange={(v) => setFormData({...formData, linea: v})}>
                        <SelectTrigger className="h-16 text-lg font-bold rounded-2xl"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Herrero">Línea Herrero (Estándar)</SelectItem>
                          <SelectItem value="Módena">Línea Módena (Alta Gama)</SelectItem>
                          <SelectItem value="A40">A40 Compact (Premium)</SelectItem>
                          <SelectItem value="A40 RPT">A40 RPT (Térmica Extrema)</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-sm text-muted-foreground flex items-center gap-2">
                        <Info className="h-4 w-4 text-[#E85D04]" /> 
                        Perfiles Aluar certificados bajo normas ISO.
                      </p>
                    </div>
                  )}

                  {step === 2 && (
                    <div className="space-y-6">
                      <h3 className="text-3xl font-heading font-black text-[#1A3A52]">Diseño de Apertura</h3>
                      <div className="grid grid-cols-3 gap-4">
                        {["corrediza", "abrir", "fijo"].map(tipo => (
                          <button 
                            key={tipo} 
                            onClick={() => setFormData({...formData, tipologia: tipo})}
                            className={`flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all ${formData.tipologia === tipo ? 'border-[#E85D04] bg-[#E85D04]/5 text-[#E85D04]' : 'border-slate-100 text-slate-400 hover:border-slate-300'}`}
                          >
                            <span className="text-xs font-black uppercase tracking-widest">{tipo}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {step === 3 && (
                    <div className="space-y-6">
                      <h3 className="text-3xl font-heading font-black text-[#1A3A52]">Cotas de Proyecto</h3>
                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <Label className="font-bold text-slate-500 uppercase text-[10px] tracking-widest">Ancho (mm)</Label>
                          <Input type="number" value={formData.ancho} onChange={(e) => setFormData({...formData, ancho: e.target.value})} className="h-16 text-2xl font-black rounded-2xl" />
                        </div>
                        <div className="space-y-3">
                          <Label className="font-bold text-slate-500 uppercase text-[10px] tracking-widest">Alto (mm)</Label>
                          <Input type="number" value={formData.alto} onChange={(e) => setFormData({...formData, alto: e.target.value})} className="h-16 text-2xl font-black rounded-2xl" />
                        </div>
                      </div>
                    </div>
                  )}

                  {step === 4 && (
                    <div className="space-y-6">
                      <h3 className="text-3xl font-heading font-black text-[#1A3A52]">Acabado & Vidrio</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Select value={formData.color} onValueChange={(v) => setFormData({...formData, color: v})}>
                          <SelectTrigger className="h-14 font-bold rounded-xl"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="blanco">Blanco Aluar</SelectItem>
                            <SelectItem value="negro">Microtexturado Negro</SelectItem>
                            <SelectItem value="anodizado">Anodizado Natural</SelectItem>
                            <SelectItem value="bronce">Colonial Bronce</SelectItem>
                          </SelectContent>
                        </Select>
                        <Select value={formData.vidrio} onValueChange={(v) => setFormData({...formData, vidrio: v})}>
                          <SelectTrigger className="h-14 font-bold rounded-xl"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="float">Float 4mm Simple</SelectItem>
                            <SelectItem value="dvh">DVH Termopanel (4+12+4)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              <div className="flex gap-4 mt-12">
                <Button variant="ghost" onClick={handleBack} disabled={step === 1} className="h-14 px-8 font-bold border border-slate-100 rounded-2xl">
                  Atrás
                </Button>
                {step < 4 ? (
                  <Button onClick={handleNext} className="flex-1 h-14 bg-[#1A3A52] hover:bg-[#1A3A52]/90 text-white font-black rounded-2xl uppercase tracking-widest text-xs">
                    Siguiente <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Button onClick={addItemToProject} className="flex-1 h-14 bg-[#E85D04] hover:bg-[#E85D04]/90 text-white font-black rounded-2xl uppercase tracking-widest text-xs shadow-xl shadow-orange-950/20">
                    Smar al Proyecto <Plus className="ml-2 h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // VISTA: RESUMEN DEL PROYECTO (EL CARRITO TÉCNICO)
  if (view === "project") {
    return (
      <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div>
            <h3 className="text-3xl font-heading font-black text-[#1A3A52]">Resumen de Obra</h3>
            <p className="text-slate-500 font-medium">Has configurado {projectItems.length} aberturas para tu presupuesto.</p>
          </div>
          <Button onClick={() => setView("builder")} variant="outline" className="rounded-2xl border-[#1A3A52] text-[#1A3A52] font-black h-14 px-8">
            <Plus className="mr-2 h-5 w-5" /> AGREGAR OTRA
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* LISTA DE ITEMS */}
          <div className="lg:col-span-2 space-y-4">
            {projectItems.map((item) => (
              <div key={item.id} className="bg-white border border-slate-100 p-6 rounded-3xl flex items-center gap-6 group hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300">
                <div className="h-20 w-20 bg-slate-50 rounded-2xl flex items-center justify-center shrink-0">
                  <div className={`border-2 border-slate-200 rounded-sm`} style={{ width: 40, height: 40 * (item.alto/item.ancho) }}></div>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-black text-[#1A3A52] uppercase text-sm tracking-tight">{item.linea} - {item.tipologia}</h4>
                  <p className="text-xs text-slate-400 font-bold mb-2 uppercase">{item.ancho}x{item.alto}mm | {item.vidrio.toUpperCase()} | {item.color}</p>
                  <p className="text-primary font-black text-lg">${item.subtotal.toLocaleString("es-AR")}</p>
                </div>
                <Button variant="ghost" size="icon" onClick={() => removeItem(item.id)} className="text-slate-300 hover:text-red-500 transition-colors h-12 w-12 rounded-xl">
                  <Trash2 className="h-5 w-5" />
                </Button>
              </div>
            ))}
          </div>

          {/* TOTALES Y FINANCIACIÓN */}
          <Card className="rounded-[2.5rem] border-none bg-[#1A3A52] text-white p-2 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#E85D04]/10 rounded-full -translate-y-16 translate-x-16 blur-2xl"></div>
            <CardContent className="p-8 space-y-8">
              <h4 className="text-xs font-black uppercase tracking-[0.3em] text-white/40">Inversión Estimada</h4>
              
              <div className="space-y-4">
                <button 
                  onClick={() => setPaymentMode("contado")}
                  className={`w-full flex items-center justify-between p-5 rounded-2xl border-2 transition-all ${paymentMode === "contado" ? 'border-[#E85D04] bg-[#E85D04]/10 text-[#E85D04]' : 'border-white/10 text-white/60 hover:bg-white/5'}`}
                >
                  <div className="flex items-center gap-3">
                    <Wallet className="h-5 w-5" />
                    <div className="text-left">
                      <p className="text-xs font-black uppercase tracking-widest">Contado</p>
                      <p className="text-[10px] opacity-70">Transferencia o Efectivo</p>
                    </div>
                  </div>
                  <span className="text-xs font-black">-10%</span>
                </button>

                <button 
                  onClick={() => setPaymentMode("cuotas3")}
                  className={`w-full flex items-center justify-between p-5 rounded-2xl border-2 transition-all ${paymentMode === "cuotas3" ? 'border-[#E85D04] bg-[#E85D04]/10 text-[#E85D04]' : 'border-white/10 text-white/60 hover:bg-white/5'}`}
                >
                  <div className="flex items-center gap-3">
                    <CreditCard className="h-5 w-5" />
                    <div className="text-left">
                      <p className="text-xs font-black uppercase tracking-widest">3 Cuotas</p>
                      <p className="text-[10px] opacity-70">Tarjetas Selectas</p>
                    </div>
                  </div>
                  <span className="text-xs font-black">+15%</span>
                </button>

                <button 
                  onClick={() => setPaymentMode("cuotas6")}
                  className={`w-full flex items-center justify-between p-5 rounded-2xl border-2 transition-all ${paymentMode === "cuotas6" ? 'border-[#E85D04] bg-[#E85D04]/10 text-[#E85D04]' : 'border-white/10 text-white/60 hover:bg-white/5'}`}
                >
                  <div className="flex items-center gap-3">
                    <CreditCard className="h-5 w-5" />
                    <div className="text-left">
                      <p className="text-xs font-black uppercase tracking-widest">6 Cuotas</p>
                      <p className="text-[10px] opacity-70">Visa / Master / Cabal</p>
                    </div>
                  </div>
                  <span className="text-xs font-black">+30%</span>
                </button>
              </div>

              <div className="pt-6 border-t border-white/10">
                <div className="flex justify-between items-end mb-4">
                  <span className="text-xs uppercase font-bold text-white/40">Total a Pagar</span>
                  {getFinancingLabel().cuota && (
                    <span className="text-xs font-bold text-[#E85D04]">
                      {projectItems.length > 0 ? paymentMode.replace('cuotas', '') : 0} cuotas de ${getFinancingLabel().cuota?.toLocaleString("es-AR")}
                    </span>
                  )}
                </div>
                <div className="text-4xl font-black">${getFinancingLabel().total.toLocaleString("es-AR")}</div>
              </div>

              <Button 
                disabled={projectItems.length === 0} 
                onClick={() => setView("checkout")}
                className="w-full h-16 bg-[#E85D04] hover:bg-[#E85D04]/90 text-white font-black rounded-2xl uppercase tracking-widest text-xs"
              >
                Continuar al Cierre <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // VISTA: CIERRE Y LEAD
  return (
    <div className="max-w-xl mx-auto py-10 animate-in fade-in slide-in-from-bottom-6">
      <div className="text-center mb-10">
        <h3 className="text-4xl font-heading font-black text-[#1A3A52] mb-4">Finalizar Proyecto</h3>
        <p className="text-slate-500 font-medium">Completa tus datos para enviarte el presupuesto digital detallado.</p>
      </div>

      <Card className="rounded-[3rem] border border-slate-100 shadow-2xl p-2 bg-white">
        <CardContent className="p-10">
          <form onSubmit={handleSubmitFinal} className="space-y-6">
            <div className="space-y-2">
              <Label className="font-bold text-[10px] uppercase tracking-widest text-slate-400 pl-2">Nombre Completo</Label>
              <Input 
                required 
                value={clientData.nombre} 
                onChange={(e) => setClientData({...clientData, nombre: e.target.value})} 
                className="h-14 rounded-2xl border-slate-100 font-bold"
                placeholder="Juan Pérez"
              />
            </div>
            <div className="space-y-2">
              <Label className="font-bold text-[10px] uppercase tracking-widest text-slate-400 pl-2">WhatsApp de Obra</Label>
              <Input 
                required 
                value={clientData.whatsapp} 
                onChange={(e) => setClientData({...clientData, whatsapp: e.target.value})} 
                className="h-14 rounded-2xl border-slate-100 font-bold"
                placeholder="Ej: 11 5555 5555"
              />
            </div>
            <div className="space-y-2">
              <Label className="font-bold text-[10px] uppercase tracking-widest text-slate-400 pl-2">Email (Opcional)</Label>
              <Input 
                type="email" 
                value={clientData.email} 
                onChange={(e) => setClientData({...clientData, email: e.target.value})} 
                className="h-14 rounded-2xl border-slate-100 font-bold"
                placeholder="juan@correo.com"
              />
            </div>

            <div className="bg-slate-50 p-6 rounded-3xl mt-8">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] font-black uppercase text-slate-400">Items en Presupuesto</span>
                <span className="text-sm font-black text-[#1A3A52]">{projectItems.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black uppercase text-slate-400">Total {getFinancingLabel().label}</span>
                <span className="text-lg font-black text-[#E85D04]">${getFinancingLabel().total.toLocaleString("es-AR")}</span>
              </div>
            </div>

            <div className="flex gap-4 pt-6">
              <Button type="button" variant="ghost" onClick={() => setView("project")} className="h-14 px-6 font-bold rounded-2xl">
                Revisar Proyecto
              </Button>
              <Button type="submit" disabled={loading} className="flex-1 h-14 bg-[#1A3A52] hover:bg-[#1A3A52]/90 text-white font-black rounded-2xl uppercase tracking-widest text-xs shadow-xl shadow-slate-900/10">
                {loading ? "Enviando..." : "Confirmar Presupuesto"} <Send className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
