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
  
  const [projectItems, setProjectItems] = useState<ProjectItem[]>([]);
  const [paymentMode, setPaymentMode] = useState<"contado" | "lista" | "cuotas3" | "cuotas6">("contado");

  const [formData, setFormData] = useState({
    linea: "Módena",
    tipologia: "corrediza",
    ancho: "1500",
    alto: "1200",
    color: "blanco",
    vidrio: "float4"
  });

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

  const calculateLocalPrice = () => {
    const a = Number(formData.ancho) / 1000;
    const h = Number(formData.alto) / 1000;
    const mLin = (a + h) * 2;
    const m2 = a * h;
    
    let kgM = 1.8;
    if (formData.linea === "Herrero") kgM = 1.2;
    if (formData.linea.includes("A40")) kgM = 2.8;

    let glassCost = 12;
    if (formData.vidrio === "float5") glassCost = 16;
    if (formData.vidrio === "float6") glassCost = 22;
    if (formData.vidrio === "dvh") glassCost = 35;

    const baseCostUSD = (mLin * kgM * 8.5) + (m2 * glassCost);
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
        <h3 className="text-4xl font-heading font-black text-[#1A3A52] mb-6 uppercase tracking-tighter">¡PROYECTO RECIBIDO!</h3>
        <p className="text-xl text-muted-foreground mb-10 font-medium">
          Hola <span className="text-primary font-black">{clientData.nombre}</span>, tu solicitud de <span className="font-bold underline decoration-[#E85D04] tracking-tight">{projectItems.length} aberturas de autor</span> ha sido enviada con éxito. 
          Un asesor técnico de <span className="font-bold text-[#1A3A52]">VILKMET</span> te contactará a la brevedad.
        </p>
        <div className="bg-[#1A3A52] text-white p-14 rounded-[4rem] shadow-[0_45px_70px_-15px_rgba(26,58,82,0.4)] border border-white/10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#E85D04]/20 rounded-full blur-[100px] -translate-y-20 translate-x-20"></div>
          <span className="block text-[10px] uppercase tracking-[0.5em] text-white/40 mb-6 font-black">Inversión Final Proyecto ({getFinancingLabel().label})</span>
          <span className="text-8xl font-black tracking-tighter">
            ${getFinancingLabel().total.toLocaleString("es-AR")}
          </span>
        </div>
        <Button onClick={() => window.location.reload()} variant="link" className="mt-16 text-primary uppercase font-black tracking-[0.3em] text-[10px] hover:text-[#E85D04] transition-colors">Iniciar nueva obra</Button>
      </div>
    );
  }

  if (view === "builder") {
    return (
      <div className="relative group/console max-w-7xl mx-auto pb-20">
        <div className="bg-white/80 backdrop-blur-xl rounded-[4rem] border border-slate-200/60 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.08)] overflow-visible p-4">
          <div className="grid lg:grid-cols-12 gap-0 overflow-visible">
            
            <div className="lg:col-span-12 xl:col-span-7 p-12 lg:p-20 bg-slate-50/50 rounded-[3.5rem] relative overflow-hidden border border-slate-100 flex flex-col justify-between min-h-[750px]">
              <div className="flex items-center gap-4 z-10">
                <div className="h-4 w-4 bg-[#E85D04] rounded-full animate-pulse shadow-[0_0_15px_#E85D04]"></div>
                <h3 className="text-[11px] font-black uppercase tracking-[0.6em] text-[#1A3A52]/60">Ingeniería Realidad Aumentada</h3>
              </div>
              
              <div className="flex-1 flex flex-col justify-center py-10">
                <div className="relative group/sim scale-110 md:scale-135 transition-transform duration-1000 ease-out">
                   <div className="absolute inset-0 bg-[#1A3A52]/5 rounded-[5rem] blur-[140px] scale-90 group-hover/sim:scale-110 transition-transform duration-1000"></div>
                   <SimuladorVisual 
                    tipologia={formData.tipologia as "corrediza" | "abrir" | "fijo"} 
                    ancho={Number(formData.ancho)} 
                    alto={Number(formData.alto)} 
                    colorHex={coloresMap[formData.color] || "#FFFFFF"}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
                <div className="bg-white/95 backdrop-blur-md p-8 rounded-[2rem] border border-white shadow-2xl">
                    <div className="flex items-center gap-4 mb-4">
                       <Layers className="h-5 w-5 text-[#E85D04]" />
                       <span className="text-[11px] uppercase font-black text-slate-700 tracking-widest">Perfilaría</span>
                    </div>
                    <p className="text-xl font-black text-[#1A3A52] tracking-tight">{formData.linea}</p>
                </div>
                <div className="bg-white/95 backdrop-blur-md p-8 rounded-[2rem] border border-white shadow-2xl">
                    <div className="flex items-center gap-4 mb-4">
                       <Maximize2 className="h-5 w-5 text-[#E85D04]" />
                       <span className="text-[11px] uppercase font-black text-slate-700 tracking-widest">Dimensión</span>
                    </div>
                    <p className="text-xl font-black text-[#1A3A52] tracking-tight">{formData.ancho} x {formData.alto} mm</p>
                </div>
                <div className="bg-[#1A3A52] p-8 rounded-[2rem] border border-white/10 shadow-2xl ring-1 ring-white/20">
                    <div className="flex items-center gap-4 mb-4">
                       <Wallet className="h-5 w-5 text-[#E85D04]" />
                       <span className="text-[11px] uppercase font-black text-white/40 tracking-widest">Estimado</span>
                    </div>
                    <p className="text-xl font-black text-white tracking-tight">${calculateLocalPrice().toLocaleString("es-AR")}</p>
                </div>
              </div>

              {projectItems.length > 0 && (
                <button 
                  onClick={() => setView("project")}
                  className="absolute bottom-12 right-12 bg-[#1A3A52] text-white px-12 h-20 rounded-[2.5rem] text-sm font-black tracking-[0.2em] uppercase flex items-center gap-5 hover:bg-[#E85D04] hover:scale-105 transition-all shadow-[0_30px_60px_-10px_rgba(26,58,82,0.5)] z-20 border-2 border-white/20 group/btn"
                >
                  Ver Proyecto ({projectItems.length}) <ArrowRight className="h-5 w-5 group-hover/btn:translate-x-1 transition-transform" />
                </button>
              )}
            </div>

            <div className="lg:col-span-12 xl:col-span-5 p-12 lg:p-16 overflow-visible">
              <div className="max-w-xl mx-auto h-full flex flex-col overflow-visible">
                
                <nav className="flex justify-between items-center mb-20 relative px-2">
                   <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-slate-100 -z-10"></div>
                   {[
                    { id: 1, label: "SISTEMA", icon: Layers },
                    { id: 2, label: "APERTURA", icon: Layout },
                    { id: 3, label: "MEDIDAS", icon: Maximize2 },
                    { id: 4, label: "VIDRIO", icon: Settings2 }
                   ].map((s) => (
                    <div key={s.id} className="relative flex flex-col items-center">
                      <button 
                        onClick={() => s.id < step && setStep(s.id)}
                        className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center transition-all duration-500 border-2 ${step >= s.id ? 'bg-[#1A3A52] text-white border-[#1A3A52] shadow-xl shadow-[#1A3A52]/30' : 'bg-white text-slate-200 border-slate-100 hover:border-slate-300'}`}
                      >
                        <s.icon className={`h-7 w-7 ${step === s.id ? 'animate-pulse' : ''}`} />
                      </button>
                      <span className={`absolute -bottom-10 text-[10px] font-black uppercase tracking-[0.3em] transition-colors ${step === s.id ? 'text-[#1A3A52]' : 'text-slate-300'}`}>{s.label}</span>
                    </div>
                  ))}
                </nav>

                <div className="flex-1 overflow-visible min-h-[480px]">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={step}
                      initial={{ opacity: 0, scale: 0.98, x: 30 }}
                      animate={{ opacity: 1, scale: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.98, x: -30 }}
                      className="space-y-14 overflow-visible"
                    >
                      {step === 1 && (
                        <div className="space-y-10 overflow-visible">
                          <div className="space-y-4">
                            <h3 className="text-6xl font-heading font-black text-[#1A3A52] tracking-tighter leading-none">Línea <br/><span className="text-[#E85D04]">Técnica</span></h3>
                            <p className="text-slate-400 font-bold uppercase text-[11px] tracking-[0.4em]">Perfiles Certificados por ALUAR</p>
                          </div>
                          
                          <div className="relative z-[50] overflow-visible">
                            <Select value={formData.linea} onValueChange={(v) => v && setFormData({...formData, linea: v})}>
                              <SelectTrigger className="h-28 text-2xl font-black rounded-[2.5rem] border-2 border-slate-100 bg-white hover:border-[#1A3A52] transition-all focus:ring-0 px-12 shadow-sm text-[#1A3A52]">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent sideOffset={12} className="rounded-[2.5rem] border-slate-200 shadow-2xl p-6 min-w-[350px]">
                                <SelectItem value="Herrero" className="h-20 font-black rounded-3xl focus:bg-slate-50 cursor-pointer px-8 text-lg">Línea Herrero (Estándar)</SelectItem>
                                <SelectItem value="Módena" className="h-20 font-black rounded-3xl focus:bg-slate-50 cursor-pointer px-8 text-lg">Línea Módena (Alta Gama)</SelectItem>
                                <SelectItem value="A40" className="h-20 font-black rounded-3xl focus:bg-slate-50 cursor-pointer px-8 text-lg">Línea A40 (Premium)</SelectItem>
                                <SelectItem value="A40 RPT" className="h-20 font-black rounded-3xl focus:bg-slate-50 cursor-pointer px-8 text-lg">Línea A40 RPT (Térmica)</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      )}

                      {step === 2 && (
                        <div className="space-y-12">
                          <h3 className="text-6xl font-heading font-black text-[#1A3A52] tracking-tighter leading-none">Diseño de <br/><span className="text-[#E85D04]">Apertura</span></h3>
                          
                          <div className="grid grid-cols-1 gap-5">
                            {[
                                { id: "corrediza", label: "Sistema Corredizo", desc: "Suavidad milimétrica", icon: Layers },
                                { id: "abrir", label: "Puerta de Abrir", desc: "Hermeticidad Total", icon: Layout },
                                { id: "fijo", label: "Paño Fijo", desc: "Diseño Estático", icon: Maximize2 }
                            ].map((tipo) => (
                              <button 
                                key={tipo.id} 
                                onClick={() => setFormData({...formData, tipologia: tipo.id})}
                                className={`flex items-center gap-8 p-10 rounded-[2.5rem] border-2 transition-all duration-500 relative overflow-hidden group ${formData.tipologia === tipo.id ? 'border-[#E85D04] bg-[#E85D04]/5 shadow-[0_20px_40px_-15px_rgba(232,93,4,0.15)]' : 'border-slate-50 bg-slate-50/50 text-slate-400 hover:border-slate-200 hover:bg-white'}`}
                              >
                                <tipo.icon className={`h-12 w-12 ${formData.tipologia === tipo.id ? 'text-[#E85D04]' : 'text-slate-300'}`} />
                                <div className="text-left space-y-1">
                                  <span className={`block text-xl font-black uppercase tracking-tighter ${formData.tipologia === tipo.id ? 'text-[#1A3A52]' : ''}`}>{tipo.label}</span>
                                  <span className={`text-[11px] font-black uppercase tracking-widest opacity-60 ${formData.tipologia === tipo.id ? 'text-[#1A3A52]/60' : ''}`}>{tipo.desc}</span>
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {step === 3 && (
                        <div className="space-y-14">
                          <h3 className="text-6xl font-heading font-black text-[#1A3A52] tracking-tighter leading-none">Ingeniería <br/><span className="text-[#E85D04]">Milimétrica</span></h3>
                          
                          <div className="space-y-10">
                            <div className="space-y-5">
                              <Label className="font-black text-slate-600 uppercase text-[12px] tracking-[0.5em] pl-4">Ancho Nominal (MM)</Label>
                              <Input 
                                type="number" 
                                value={formData.ancho} 
                                onChange={(e) => setFormData({...formData, ancho: e.target.value})} 
                                className="h-28 text-6xl font-black rounded-[3rem] border-2 border-slate-100 focus:border-[#E85D04] transition-all px-14 bg-white shadow-inner text-[#1A3A52]" 
                              />
                            </div>
                            <div className="space-y-5">
                              <Label className="font-black text-slate-600 uppercase text-[12px] tracking-[0.5em] pl-4">Alto Nominal (MM)</Label>
                              <Input 
                                type="number" 
                                value={formData.alto} 
                                onChange={(e) => setFormData({...formData, alto: e.target.value})} 
                                className="h-28 text-6xl font-black rounded-[3rem] border-2 border-slate-100 focus:border-[#E85D04] transition-all px-14 bg-white shadow-inner text-[#1A3A52]" 
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {step === 4 && (
                        <div className="space-y-12">
                          <h3 className="text-6xl font-heading font-black text-[#1A3A52] tracking-tighter leading-none">Composición <br/><span className="text-[#E85D04]">del Cristal</span></h3>
                          
                          <div className="grid grid-cols-1 gap-5">
                              {[
                                { id: "float4", label: "Float Incoloro 4mm", desc: "Espesor Estándar", cat: "F4" },
                                { id: "float5", label: "Float Incoloro 5mm", desc: "Rigidez Media", cat: "F5" },
                                { id: "float6", label: "Float Incoloro 6mm", desc: "Alta Resistencia", cat: "F6" },
                                { id: "dvh", label: "DVH (4+12+4)", desc: "Aislamiento Termoacústico", cat: "ELITE" }
                              ].map((v) => (
                                <button 
                                  key={v.id}
                                  onClick={() => setFormData({...formData, vidrio: v.id})}
                                  className={`flex items-center justify-between p-8 rounded-[2.5rem] border-2 text-left transition-all group ${formData.vidrio === v.id ? 'border-[#E85D04] bg-[#E85D04]/5' : 'border-slate-50 bg-white hover:border-slate-200'}`}
                                >
                                  <div className="space-y-1">
                                    <p className={`font-black text-xl uppercase tracking-tighter ${formData.vidrio === v.id ? 'text-[#1A3A52]' : 'text-slate-400 group-hover:text-slate-600'}`}>{v.label}</p>
                                    <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest opacity-60">{v.desc}</p>
                                  </div>
                                  <span className={`text-[10px] font-black px-6 py-2 rounded-full border ${formData.vidrio === v.id ? 'bg-[#E85D04] text-white border-[#E85D04] shadow-lg shadow-orange-500/20' : 'bg-slate-50 text-slate-300 border-slate-100'}`}>{v.cat}</span>
                                </button>
                              ))}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>

                <div className="pt-14 flex flex-col gap-6">
                  <div className="flex gap-4">
                    <Button 
                        variant="ghost" 
                        onClick={() => setStep(Math.max(1, step - 1))} 
                        disabled={step === 1} 
                        className="h-24 px-10 font-black text-[12px] uppercase tracking-[0.4em] rounded-[3rem] hover:bg-slate-50 flex-1 border-2 border-slate-100 text-slate-400"
                    >
                        Retroceder
                    </Button>
                    
                    {step < 4 ? (
                        <Button 
                        onClick={() => setStep(step + 1)} 
                        className="flex-[2.5] h-24 bg-[#1A3A52] hover:bg-[#1C3E5B] text-white font-black text-xs uppercase tracking-[0.4em] rounded-[3rem] shadow-[0_20px_50px_-10px_rgba(26,58,82,0.4)] transform transition active:scale-[0.98] group/next"
                        >
                        Siguiente <ArrowRight className="ml-5 h-6 w-6 group-hover/next:translate-x-2 transition-transform" />
                        </Button>
                    ) : (
                        <Button 
                        onClick={addItemToProject} 
                        className="flex-[2.5] h-24 bg-[#E85D04] hover:bg-[#F96D0C] text-white font-black text-xs uppercase tracking-[0.4em] rounded-[3rem] shadow-[0_25px_60px_-10px_rgba(232,93,4,0.5)] transform transition active:scale-[0.98] group/add"
                        >
                        Añadir a la Obra <Plus className="ml-5 h-7 w-7 group-add:rotate-90 transition-transform" />
                        </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    );
  }

  if (view === "project") {
    return (
      <div className="space-y-16 animate-in fade-in slide-in-from-bottom-12 duration-1000 max-w-7xl mx-auto pb-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 pb-12 border-b border-slate-100">
          <div className="space-y-4">
            <h3 className="text-[11px] font-black uppercase tracking-[0.7em] text-[#E85D04]">Estado del Proyecto</h3>
            <h2 className="text-7xl font-heading font-black text-[#1A3A52] tracking-tighter leading-none">Mi Obra <br/><span className="text-[#E85D04] italic">Vilkmet.</span></h2>
          </div>
          <Button onClick={() => setView("builder")} className="h-20 px-12 rounded-[2.5rem] border-4 border-[#1A3A52] bg-transparent text-[#1A3A52] font-black uppercase text-xs tracking-[0.3em] hover:bg-[#1A3A52] hover:text-white transition-all shadow-xl">
            <Plus className="mr-5 h-6 w-6" /> AGREGAR OTRA ABERTURA
          </Button>
        </div>

        <div className="grid lg:grid-cols-12 gap-16">
          <div className="lg:col-span-12 xl:col-span-8 space-y-8">
            {projectItems.map((item) => (
              <motion.div 
                layout
                key={item.id} 
                className="bg-white border border-slate-100 p-10 rounded-[3.5rem] flex flex-col md:flex-row items-center gap-12 group hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.08)] transition-all duration-700"
              >
                <div className="h-32 w-32 bg-slate-50/50 rounded-3xl flex items-center justify-center p-6 shrink-0 group-hover:rotate-3 transition-transform">
                  <div className={`border-4 border-[#1A3A52]/20 rounded-lg bg-white shadow-inner flex items-center justify-center`} style={{ width: 65, height: 65 * (item.alto/item.ancho) }}>
                      <span className="text-[9px] font-black text-slate-300">VILK-{item.id.slice(0,3).toUpperCase()}</span>
                  </div>
                </div>
                <div className="flex-1 text-center md:text-left space-y-4">
                  <h4 className="font-black text-3xl text-[#1A3A52] uppercase tracking-tighter leading-none">{item.linea} · {item.tipologia}</h4>
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                    <span className="px-5 py-2 bg-slate-50 text-[10px] font-black text-slate-500 rounded-full tracking-widest uppercase border border-slate-100">{item.ancho}x{item.alto}mm</span>
                    <span className="px-5 py-2 bg-slate-50 text-[10px] font-black text-slate-500 rounded-full tracking-widest uppercase border border-slate-100">{item.vidrio.replace('float', 'F')}mm</span>
                    <span className="px-5 py-2 bg-slate-50 text-[10px] font-black text-slate-500 rounded-full tracking-widest uppercase border border-slate-100">{item.color}</span>
                  </div>
                  <p className="text-4xl font-black text-[#1A3A52] tracking-tighter pt-2">${item.subtotal.toLocaleString("es-AR")}</p>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => removeItem(item.id)} 
                  className="h-16 w-16 rounded-2xl text-slate-200 hover:text-red-500 hover:bg-red-50 transition-all"
                >
                  <Trash2 className="h-8 w-8" />
                </Button>
              </motion.div>
            ))}

            {projectItems.length === 0 && (
              <div className="text-center py-32 bg-slate-50 rounded-[4rem] border-4 border-dashed border-slate-200 space-y-6">
                <Layers className="h-16 w-16 text-slate-200 mx-auto" />
                <p className="text-slate-400 font-black uppercase text-sm tracking-widest">No hay piezas cargadas en la obra</p>
                <Button onClick={() => setView("builder")} variant="link" className="text-[#E85D04] font-black uppercase text-xs tracking-widest">Iniciar configuración</Button>
              </div>
            )}
          </div>

          <div className="lg:col-span-12 xl:col-span-4 translate-y-0 xl:-translate-y-20">
            <Card className="rounded-[4rem] border-none bg-[#1A3A52] text-white p-2 shadow-[0_60px_120px_-30px_rgba(26,58,82,0.6)] relative overflow-hidden group/card">
               <div className="absolute top-10 right-10 w-48 h-48 bg-[#E85D04]/30 rounded-full blur-[90px] animate-pulse"></div>
               <CardContent className="p-12 space-y-12">
                 <div className="space-y-4">
                    <span className="text-[11px] font-black uppercase tracking-[0.5em] text-white/30">Subtotal Inversión</span>
                    <h3 className="text-6xl font-black tracking-tighter leading-none">${getFinancingLabel().total.toLocaleString("es-AR")}</h3>
                 </div>

                 <div className="space-y-5">
                    <Label className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40 pl-3">Plan de Financiación de Obra</Label>
                    <div className="grid grid-cols-1 gap-4">
                       {[
                         { id: "contado", label: "Efectivo / Transferencia", desc: "Beneficio Contado -10%", icon: Wallet, tag: "AHORRO" },
                         { id: "cuotas3", label: "3 Cuotas Fijas", desc: "Plan Financiero Vilkmet", icon: CreditCard, tag: "+15%" },
                         { id: "cuotas6", label: "6 Cuotas Fijas", desc: "Plan Visa/Master Vilkmet", icon: CreditCard, tag: "+30%" }
                       ].map((p) => (
                         <button 
                          key={p.id}
                          onClick={() => setPaymentMode(p.id as "contado" | "cuotas3" | "cuotas6")}
                          className={`flex items-center justify-between p-8 rounded-[2.2rem] border-2 transition-all duration-500 ${paymentMode === p.id ? 'border-[#E85D04] bg-[#E85D04]/15 shadow-2xl ring-1 ring-[#E85D04]/40' : 'border-white/5 bg-white/5 opacity-60 hover:opacity-100 hover:bg-white/10'}`}
                         >
                            <div className="flex items-center gap-5 text-left">
                              <p.icon className={`h-7 w-7 ${paymentMode === p.id ? 'text-[#E85D04]' : 'text-white/30'}`} />
                              <div>
                                <p className="text-sm font-black uppercase tracking-tighter">{p.label}</p>
                                <p className="text-[10px] font-bold opacity-40 uppercase tracking-widest mt-1">{p.desc}</p>
                              </div>
                            </div>
                            <span className={`text-[10px] font-black px-4 py-1 rounded-full ${paymentMode === p.id ? 'bg-[#E85D04] text-white' : 'bg-white/10 text-white/30'}`}>{p.tag}</span>
                         </button>
                       ))}
                    </div>
                 </div>

                 <div className="pt-10 border-t border-white/10 space-y-10">
                    {getFinancingLabel().cuota && (
                      <div className="flex justify-between items-center text-[#E85D04]">
                         <span className="text-[11px] font-black uppercase tracking-[0.4em] leading-none text-white/40">Valor de <br/>Cuota Fija</span>
                         <span className="text-3xl font-black tracking-tighter">${getFinancingLabel().cuota?.toLocaleString("es-AR")}</span>
                      </div>
                    )}
                    
                    <Button 
                      disabled={projectItems.length === 0}
                      onClick={() => setView("checkout")}
                      className="w-full h-24 bg-[#E85D04] hover:bg-[#F96D0C] text-white font-black text-sm uppercase tracking-[0.5em] rounded-[2.5rem] shadow-[0_30px_60px_-10px_rgba(232,93,4,0.4)] transform transition active:scale-[0.98]"
                    >
                      Formalizar Obra
                    </Button>
                 </div>
               </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-24 animate-in fade-in slide-in-from-bottom-20 duration-1000">
      <div className="text-center mb-20 space-y-6">
         <h3 className="text-[11px] font-black uppercase tracking-[0.7em] text-[#1A3A52]/40">Verificación y Contacto Final</h3>
         <h2 className="text-7xl font-heading font-black text-[#1A3A52] tracking-tighter leading-none lg:text-8xl">Cierre de <br/><span className="text-[#E85D04] italic">Vínculo.</span></h2>
         <p className="text-slate-500 font-bold max-w-xl mx-auto text-xl leading-relaxed uppercase tracking-tight">Tu proyecto está configurado con éxito. <br/>Ingresa tus datos de obra para la validación final.</p>
      </div>

      <div className="bg-white rounded-[5rem] border border-slate-100 shadow-[0_80px_160px_-40px_rgba(0,0,0,0.15)] p-6 md:p-12">
        <form onSubmit={handleSubmitFinal} className="grid md:grid-cols-2 gap-12 md:gap-20 p-10 lg:p-14">
          <div className="space-y-12">
            <div className="space-y-5">
               <Label className="font-black text-[12px] uppercase tracking-[0.5em] text-slate-500 pl-4">Titular Responsable</Label>
               <Input 
                required 
                value={clientData.nombre} 
                onChange={(e) => setClientData({...clientData, nombre: e.target.value})} 
                className="h-24 rounded-[3rem] border-2 border-slate-100 bg-slate-50/30 px-12 text-2xl font-black placeholder:text-slate-300 focus:bg-white transition-all shadow-inner text-[#1A3A52]"
                placeholder="Nombre y Apellido"
               />
            </div>
            <div className="space-y-5">
               <Label className="font-black text-[12px] uppercase tracking-[0.5em] text-slate-500 pl-4">Canal WhatsApp de Obra</Label>
               <Input 
                required 
                value={clientData.whatsapp} 
                onChange={(e) => setClientData({...clientData, whatsapp: e.target.value})} 
                className="h-24 rounded-[3rem] border-2 border-slate-100 bg-slate-50/30 px-12 text-2xl font-black placeholder:text-slate-300 focus:bg-white transition-all shadow-inner text-[#1A3A52]"
                placeholder="+54 9..."
               />
            </div>
            <div className="space-y-5">
               <Label className="font-black text-[12px] uppercase tracking-[0.5em] text-slate-500 pl-4">Archivo de Proyecto (Mail)</Label>
               <Input 
                type="email" 
                value={clientData.email} 
                onChange={(e) => setClientData({...clientData, email: e.target.value})} 
                className="h-24 rounded-[3rem] border-2 border-slate-100 bg-slate-50/30 px-12 text-2xl font-black placeholder:text-slate-300 focus:bg-white transition-all shadow-inner text-[#1A3A52]"
                placeholder="tu@email.com"
               />
            </div>
          </div>

          <div className="space-y-16">
             <div className="bg-[#1A3A52] p-12 rounded-[4rem] text-white relative overflow-hidden shadow-2xl ring-1 ring-white/10">
               <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32 rotate-45"></div>
               <div className="relative space-y-10">
                  <div className="flex justify-between items-center border-b border-white/10 pb-8">
                    <span className="text-[11px] font-black uppercase tracking-[0.5em] text-white/30">Configuración</span>
                    <span className="text-2xl font-black uppercase tracking-tighter">{projectItems.length} Aberturas</span>
                  </div>
                  <div className="space-y-3">
                    <span className="text-[11px] font-black uppercase tracking-[0.5em] text-white/30">Inversión Final {getFinancingLabel().label}</span>
                    <p className="text-6xl font-black text-[#E85D04] tracking-tighter">${getFinancingLabel().total.toLocaleString("es-AR")}</p>
                  </div>
               </div>
             </div>

             <div className="flex flex-col gap-6">
                <Button 
                  type="submit" 
                  disabled={loading}
                  className="w-full h-28 bg-[#E85D04] hover:bg-[#F96D0C] text-white font-black text-xl uppercase tracking-[0.5em] rounded-[3rem] shadow-[0_30px_70px_-15px_rgba(232,93,4,0.6)] transform hover:scale-[1.03] active:scale-[0.98] transition-all"
                >
                  {loading ? "BLOQUEANDO..." : "SOLICITAR OBRA"} <Send className="ml-6 h-7 w-7" />
                </Button>
                <Button 
                  type="button" 
                  variant="ghost" 
                  onClick={() => setView("project")}
                  className="h-20 font-black uppercase text-[11px] tracking-[0.4em] text-slate-400 hover:text-[#1A3A52] transition-colors"
                >
                  Revisar memoria técnica
                </Button>
             </div>
          </div>
        </form>
      </div>
    </div>
  );
}
