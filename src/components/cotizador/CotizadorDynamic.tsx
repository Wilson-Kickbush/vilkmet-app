"use client";

import { useState } from "react";
import { SimuladorVisual } from "./SimuladorVisual";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { 
  ChevronRight, 
  Send, 
  CheckCircle2, 
  Plus, 
  Trash2, 
  CreditCard, 
  Wallet, 
  Info,
  Maximize2,
  Settings2,
  Layout,
  Layers,
  ArrowRight
} from "lucide-react";
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

  // Cálculo Local Estimado
  const calculateLocalPrice = () => {
    const a = Number(formData.ancho) / 1000;
    const h = Number(formData.alto) / 1000;
    const mLin = (a + h) * 2;
    const m2 = a * h;
    
    let kgM = 1.8;
    if (formData.linea === "Herrero") kgM = 1.2;
    if (formData.linea.includes("A40")) kgM = 2.8;

    const baseCostUSD = (mLin * kgM * 8.5) + (m2 * (formData.vidrio === "dvh" ? 35 : 12));
    const finalARS = baseCostUSD * 1400 * 1.2 * 1.4;
    return Math.round(finalARS);
  };

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
    setStep(1);
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
        <h3 className="text-4xl font-heading font-black text-[#1A3A52] mb-6">¡PROYECTO ENVIADO!</h3>
        <p className="text-xl text-muted-foreground mb-10 font-medium">
          Hola <span className="text-primary">{clientData.nombre}</span>, tu solicitud de <span className="font-bold underline decoration-[#E85D04]">{projectItems.length} aberturas</span> ha sido recibida. 
          Un asesor técnico de <span className="font-bold text-[#1A3A52]">VILKMET</span> te enviará el cronograma de medición por WhatsApp.
        </p>
        <div className="bg-[#1A3A52] text-white p-12 rounded-[3rem] shadow-[0_35px_60px_-15px_rgba(26,58,82,0.3)] border border-white/10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-[#E85D04]/20 rounded-full blur-3xl -translate-y-20 translate-x-10"></div>
          <span className="block text-xs uppercase tracking-[0.4em] text-white/40 mb-4 font-black">Inversión Final Proyecto ({getFinancingLabel().label})</span>
          <span className="text-7xl font-black tracking-tighter">
            ${getFinancingLabel().total.toLocaleString("es-AR")}
          </span>
        </div>
        <Button onClick={() => window.location.reload()} variant="link" className="mt-12 text-primary uppercase font-black tracking-[0.2em] text-xs hover:text-[#E85D04] transition-colors">Volver al inicio</Button>
      </div>
    );
  }

  // VISTA: ARMADO DE CADA PIEZA
  if (view === "builder") {
    return (
      <div className="relative group/console">
        {/* CONSOLA MAESTRA UNIFICADA */}
        <div className="bg-white/80 backdrop-blur-xl rounded-[3rem] border border-slate-200/60 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.08)] overflow-visible p-2 md:p-4">
          <div className="grid lg:grid-cols-12 gap-0 overflow-visible">
            
            {/* LADO IZQUIERDO: VISUALIZACIÓN TÉCNICA */}
            <div className="lg:col-span-12 xl:col-span-5 p-8 lg:p-12 bg-slate-50/50 rounded-[2.5rem] relative overflow-hidden border border-slate-100">
              <div className="absolute top-8 left-8 flex items-center gap-3 z-10">
                <div className="h-2 w-2 bg-[#E85D04] rounded-full animate-pulse"></div>
                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Render en Tiempo Real</h3>
              </div>
              
              <div className="h-full flex flex-col justify-center py-10">
                <div className="relative group/sim">
                   <div className="absolute inset-0 bg-[#1A3A52]/5 rounded-3xl blur-3xl scale-90 group-hover/sim:scale-110 transition-transform duration-700"></div>
                   <SimuladorVisual 
                    tipologia={formData.tipologia as "corrediza" | "abrir" | "fijo"} 
                    ancho={Number(formData.ancho)} 
                    alto={Number(formData.alto)} 
                    colorHex={coloresMap[formData.color]}
                  />
                </div>
                
                {/* HUD DE DATOS */}
                <div className="mt-12 grid grid-cols-2 gap-4">
                  <div className="bg-white/60 backdrop-blur-sm p-5 rounded-2xl border border-white shadow-sm group hover:border-[#1A3A52]/20 transition-all">
                    <div className="flex items-center gap-2 mb-2">
                       <Layers className="h-3 w-3 text-[#E85D04]" />
                       <span className="text-[9px] uppercase font-black text-slate-400 tracking-widest">Perfilaría</span>
                    </div>
                    <p className="text-sm font-black text-[#1A3A52]">{formData.linea}</p>
                  </div>
                  <div className="bg-[#1A3A52] p-5 rounded-2xl border border-white/10 shadow-xl group hover:bg-[#1A3A52]/90 transition-all">
                    <div className="flex items-center gap-2 mb-2">
                       <Wallet className="h-3 w-3 text-[#E85D04]" />
                       <span className="text-[9px] uppercase font-black text-white/30 tracking-widest">Estimado</span>
                    </div>
                    <p className="text-sm font-black text-white">${calculateLocalPrice().toLocaleString("es-AR")}</p>
                  </div>
                </div>
              </div>

              {projectItems.length > 0 && (
                <button 
                  onClick={() => setView("project")}
                  className="absolute bottom-8 right-8 bg-[#1A3A52] text-white px-6 h-12 rounded-full text-[10px] font-black tracking-widest uppercase flex items-center gap-3 hover:bg-[#E85D04] hover:scale-105 transition-all shadow-xl"
                >
                  Ver Proyecto ({projectItems.length}) <ChevronRight className="h-3 w-3" />
                </button>
              )}
            </div>

            {/* LADO DERECHO: PANEL DE CONTROL ARQUITECTÓNICO */}
            <div className="lg:col-span-12 xl:col-span-7 p-8 lg:p-12 overflow-visible">
              <div className="max-w-2xl mx-auto h-full flex flex-col overflow-visible">
                
                {/* STEPPER ELITE */}
                <nav className="flex justify-between items-center mb-16 relative">
                   <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-slate-100 -z-10"></div>
                   {[
                    { id: 1, label: "Línea", icon: Layers },
                    { id: 2, label: "Apertura", icon: Layout },
                    { id: 3, label: "Cotas", icon: Maximize2 },
                    { id: 4, label: "Detalle", icon: Settings2 }
                   ].map((s) => (
                    <div key={s.id} className="relative flex flex-col items-center">
                      <button 
                        onClick={() => s.id < step && setStep(s.id)}
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 border ${step >= s.id ? 'bg-[#1A3A52] text-white border-[#1A3A52] shadow-lg shadow-[#1A3A52]/20' : 'bg-white text-slate-300 border-slate-100 hover:border-slate-300'}`}
                      >
                        <s.icon className={`h-5 w-5 ${step === s.id ? 'animate-pulse' : ''}`} />
                      </button>
                      <span className={`absolute -bottom-7 text-[9px] font-black uppercase tracking-widest transition-colors ${step === s.id ? 'text-[#1A3A52]' : 'text-slate-300'}`}>{s.label}</span>
                    </div>
                  ))}
                </nav>

                {/* CONTENIDO DE PASOS CON OVERFLOW VISIBLE */}
                <div className="flex-1 overflow-visible min-h-[380px]">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={step}
                      initial={{ opacity: 0, scale: 0.98, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.98, y: -10 }}
                      className="space-y-10 overflow-visible"
                    >
                      {step === 1 && (
                        <div className="space-y-8 overflow-visible">
                          <div>
                            <h3 className="text-4xl font-heading font-black text-[#1A3A52] tracking-tight leading-tight">Ingeniería del <br/><span className="text-[#E85D04]">Perfil de Aluminio</span></h3>
                            <p className="text-slate-400 font-medium mt-4">Selecciona el sistema que definirá la durabilidad de tu obra.</p>
                          </div>
                          
                          <div className="relative z-[50] overflow-visible">
                            <Select value={formData.linea} onValueChange={(v) => setFormData({...formData, linea: v})}>
                              <SelectTrigger className="h-20 text-lg font-bold rounded-[1.5rem] border-2 border-slate-100 bg-white hover:border-[#1A3A52] transition-colors focus:ring-0 px-8">
                                <SelectValue />
                              </SelectTrigger>
                              {/* PORTAL FORCE FIX - Removed invalid position prop */}
                              <SelectContent sideOffset={8} className="rounded-2xl border-slate-200 shadow-2xl p-2 min-w-[300px]">
                                <SelectItem value="Herrero" className="h-14 font-bold rounded-xl focus:bg-slate-50 cursor-pointer">Línea Herrero - Perfil Liviano</SelectItem>
                                <SelectItem value="Módena" className="h-14 font-bold rounded-xl focus:bg-slate-50 cursor-pointer">Línea Módena - Tecnología Media</SelectItem>
                                <SelectItem value="A40" className="h-14 font-bold rounded-xl focus:bg-slate-50 cursor-pointer">Línea A40 - Premium Hermética</SelectItem>
                                <SelectItem value="A40 RPT" className="h-14 font-bold rounded-xl focus:bg-slate-50 cursor-pointer">Línea A40 RPT - Rotura Térmica</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div className="bg-[#E85D04]/5 p-6 rounded-3xl border border-[#E85D04]/20 flex items-start gap-4">
                            <Info className="h-6 w-6 text-[#E85D04] shrink-0" />
                            <p className="text-xs text-[#E85D04]/80 font-bold leading-relaxed">
                              Utilizamos exclusivamente perfiles extrudados por <strong>ALUAR</strong>, garantizando aleaciones certificadas 6063 T6.
                            </p>
                          </div>
                        </div>
                      )}

                      {step === 2 && (
                        <div className="space-y-8">
                          <div>
                            <h3 className="text-4xl font-heading font-black text-[#1A3A52] tracking-tight">Arquitectura de <br/><span className="text-[#E85D04]">Movimiento</span></h3>
                            <p className="text-slate-400 font-medium mt-2">¿Cómo deseas que interactúe tu abertura con el espacio?</p>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {[
                                { id: "corrediza", label: "Corrediza", desc: "Deslizamiento Dual", icon: Layers },
                                { id: "abrir", label: "De Abrir", desc: "Apertura 180º", icon: Layout },
                                { id: "fijo", label: "Paño Fijo", desc: "Vistas Únicas", icon: Maximize2 }
                            ].map((tipo) => (
                              <button 
                                key={tipo.id} 
                                onClick={() => setFormData({...formData, tipologia: tipo.id})}
                                className={`group/card flex flex-col items-center justify-center p-8 rounded-[2rem] border-2 transition-all duration-500 relative overflow-hidden ${formData.tipologia === tipo.id ? 'border-[#E85D04] bg-[#E85D04]/5 shadow-xl shadow-orange-500/10' : 'border-slate-50 bg-slate-50/50 text-slate-400 hover:border-slate-200 hover:bg-white'}`}
                              >
                                {formData.tipologia === tipo.id && (
                                   <div className="absolute top-4 right-4 h-2 w-2 bg-[#E85D04] rounded-full"></div>
                                )}
                                <tipo.icon className={`h-10 w-10 mb-4 transition-transform duration-500 group-hover/card:scale-110 ${formData.tipologia === tipo.id ? 'text-[#E85D04]' : 'text-slate-300'}`} />
                                <span className={`text-sm font-black uppercase tracking-widest ${formData.tipologia === tipo.id ? 'text-[#1A3A52]' : ''}`}>{tipo.label}</span>
                                <span className="text-[10px] font-bold opacity-50 mt-1 uppercase tracking-tight">{tipo.desc}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {step === 3 && (
                        <div className="space-y-10">
                          <div>
                            <h3 className="text-4xl font-heading font-black text-[#1A3A52] tracking-tight">Dimensiones de <br/><span className="text-[#E85D04]">Ingeniería</span></h3>
                            <p className="text-slate-400 font-medium mt-2">Introduce las cotas de tu vano en milímetros.</p>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                              <div className="flex justify-between items-center px-1">
                                <Label className="font-black text-slate-400 uppercase text-[10px] tracking-[0.3em]">Ancho (MM)</Label>
                                <span className="text-[10px] font-black text-primary font-mono">{formData.ancho}mm</span>
                              </div>
                              <Input 
                                type="number" 
                                value={formData.ancho} 
                                onChange={(e) => setFormData({...formData, ancho: e.target.value})} 
                                className="h-20 text-3xl font-black rounded-[1.5rem] border-2 border-slate-100 focus:border-[#E85D04] transition-all px-8 bg-white" 
                              />
                            </div>
                            <div className="space-y-4">
                              <div className="flex justify-between items-center px-1">
                                <Label className="font-black text-slate-400 uppercase text-[10px] tracking-[0.3em]">Alto (MM)</Label>
                                <span className="text-[10px] font-black text-primary font-mono">{formData.alto}mm</span>
                              </div>
                              <Input 
                                type="number" 
                                value={formData.alto} 
                                onChange={(e) => setFormData({...formData, alto: e.target.value})} 
                                className="h-20 text-3xl font-black rounded-[1.5rem] border-2 border-slate-100 focus:border-[#E85D04] transition-all px-8 bg-white" 
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {step === 4 && (
                        <div className="space-y-10">
                          <div>
                            <h3 className="text-4xl font-heading font-black text-[#1A3A52] tracking-tight">Estoma de <br/><span className="text-[#E85D04]">Autor</span></h3>
                            <p className="text-slate-400 font-medium mt-2">Detalles que marcan la diferencia en el acabado.</p>
                          </div>
                          
                          <div className="grid grid-cols-1 gap-6">
                            <div className="space-y-4">
                               <Label className="font-black text-slate-400 uppercase text-[10px] tracking-[0.3em] pl-1">Acabado del Aluminio</Label>
                               <div className="flex flex-wrap gap-3">
                                  {["blanco", "negro", "anodizado", "bronce"].map((c) => (
                                    <button 
                                      key={c}
                                      onClick={() => setFormData({...formData, color: c})}
                                      className={`px-6 h-12 rounded-full border-2 text-[10px] font-black uppercase tracking-widest transition-all ${formData.color === c ? 'bg-[#1A3A52] border-[#1A3A52] text-white' : 'bg-white border-slate-100 text-slate-400'}`}
                                    >
                                      {c}
                                    </button>
                                  ))}
                               </div>
                            </div>
                            
                            <div className="space-y-4">
                               <Label className="font-black text-slate-400 uppercase text-[10px] tracking-[0.3em] pl-1">Sistema de Acristalamiento</Label>
                               <div className="grid md:grid-cols-2 gap-4">
                                  <button 
                                    onClick={() => setFormData({...formData, vidrio: "float"})}
                                    className={`p-6 rounded-2xl border-2 text-left transition-all ${formData.vidrio === "float" ? 'border-[#E85D04] bg-[#E85D04]/5' : 'border-slate-50 bg-white'}`}
                                  >
                                    <p className="font-black text-sm text-[#1A3A52] uppercase">Float Simple</p>
                                    <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase">Cristal 4mm / 6mm</p>
                                  </button>
                                  <button 
                                    onClick={() => setFormData({...formData, vidrio: "dvh"})}
                                    className={`p-6 rounded-2xl border-2 text-left transition-all ${formData.vidrio === "dvh" ? 'border-[#E85D04] bg-[#E85D04]/5' : 'border-slate-50 bg-white'}`}
                                  >
                                    <p className="font-black text-sm text-[#1A3A52] uppercase text-sky-800">DVH Elite</p>
                                    <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-tighter">Aislamiento Térmico 4+12+4</p>
                                  </button>
                               </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* BOTONES DE ACCIÓN CTA */}
                <div className="pt-10 flex flex-col md:flex-row gap-4">
                  <Button 
                    variant="ghost" 
                    onClick={() => setStep(Math.max(1, step - 1))} 
                    disabled={step === 1} 
                    className="h-16 px-10 font-black text-[10px] uppercase tracking-[0.2em] rounded-[1.5rem] hover:bg-slate-50"
                  >
                    Retroceder
                  </Button>
                  
                  {step < 4 ? (
                    <Button 
                      onClick={() => setStep(step + 1)} 
                      className="flex-1 h-16 bg-[#1A3A52] hover:bg-[#1C3E5B] text-white font-black text-xs uppercase tracking-[0.3em] rounded-[1.5rem] shadow-xl shadow-[#1A3A52]/20 transform transition active:scale-[0.98]"
                    >
                      Siguiente Parámetro <ArrowRight className="ml-3 h-4 w-4" />
                    </Button>
                  ) : (
                    <Button 
                      onClick={addItemToProject} 
                      className="flex-1 h-16 bg-[#E85D04] hover:bg-[#F96D0C] text-white font-black text-xs uppercase tracking-[0.3em] rounded-[1.5rem] shadow-2xl shadow-orange-500/30 transform transition active:scale-[0.98] animate-in slide-in-from-right-4"
                    >
                      Añadir a mi Obra <Plus className="ml-3 h-5 w-5" />
                    </Button>
                  )}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    );
  }

  // VISTA: PROYECTO CONSOLIDADO (CARRITO)
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
