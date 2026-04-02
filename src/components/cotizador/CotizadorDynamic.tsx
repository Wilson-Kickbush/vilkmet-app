"use client";

import { useState } from "react";
import { SimuladorVisual } from "./SimuladorVisual";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Send, 
  CheckCircle2, 
  Trash2, 
  CreditCard, 
  Wallet, 
  Maximize2,
  Settings2,
  Layout,
  Layers,
  ArrowRight,
  DoorOpen
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
      case "contado": return { label: "Contado (10% OFF)", total: totalProject * 0.9 };
      case "lista": return { label: "Lista (1 Pago)", total: totalProject };
      case "cuotas3": return { label: "3 Cuotas (+15%)", total: totalProject * 1.15, cuota: (totalProject * 1.15) / 3 };
      case "cuotas6": return { label: "6 Cuotas (+30%)", total: totalProject * 1.30, cuota: (totalProject * 1.30) / 6 };
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
       console.error(error);
       alert("Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center py-20 animate-in fade-in zoom-in duration-700 max-w-2xl mx-auto">
        <CheckCircle2 className="h-24 w-24 text-green-500 mx-auto mb-8 animate-bounce" />
        <h3 className="text-4xl font-heading font-black text-[#1A3A52] mb-6 uppercase tracking-tighter">¡SOLICITUD ENVIADA!</h3>
        <p className="text-xl text-muted-foreground mb-10 font-medium">
          Hola <span className="text-primary font-black">{clientData.nombre}</span>, tu proyecto ha sido recibido. 
          Un asesor técnico de <span className="font-bold text-[#1A3A52]">VILKMET</span> te contactará a la brevedad.
        </p>
        <div className="bg-[#1A3A52] text-white p-10 rounded-[3rem] shadow-2xl border border-white/10 relative overflow-hidden">
          <span className="block text-[10px] uppercase tracking-widest text-white/40 mb-4 font-black text-center">Inversión Estimada</span>
          <p className="text-5xl font-black tracking-tighter text-center">
            ${getFinancingLabel().total.toLocaleString("es-AR")}
          </p>
        </div>
        <Button onClick={() => window.location.reload()} variant="link" className="mt-16 text-primary uppercase font-bold tracking-widest text-xs">Nueva Solicitud</Button>
      </div>
    );
  }

  if (view === "builder") {
    return (
      <div className="relative group/console max-w-7xl mx-auto pb-20">
        <div className="bg-white/80 backdrop-blur-xl rounded-[4rem] border border-slate-200/60 shadow-2xl overflow-visible p-4">
          <div className="grid lg:grid-cols-12 gap-0 overflow-visible">
            
            <div className="lg:col-span-12 xl:col-span-7 p-12 lg:p-16 bg-slate-50/50 rounded-[3.5rem] relative overflow-hidden border border-slate-100 flex flex-col justify-between min-h-[700px]">
              <div className="flex items-center gap-3 z-10">
                <div className="h-3 w-3 bg-[#E85D04] rounded-full animate-pulse"></div>
                <h3 className="text-[11px] font-black uppercase tracking-widest text-[#1A3A52]/80">Configuración Arquitectónica</h3>
              </div>
              
              <div className="flex-1 flex flex-col justify-center py-2">
                <div className="relative group/sim scale-110 sm:scale-125 md:scale-[1.7] transition-transform duration-1000 origin-center">
                   <SimuladorVisual 
                    tipologia={formData.tipologia as "corrediza" | "abrir" | "fijo"} 
                    ancho={Number(formData.ancho)} 
                    alto={Number(formData.alto)} 
                    colorHex={coloresMap[formData.color] || "#FFFFFF"}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
                <div className="bg-white/95 p-6 rounded-[2rem] border border-slate-100 shadow-xl">
                    <span className="text-[10px] uppercase font-bold text-slate-500 block mb-2 text-center md:text-left">Perfilería</span>
                    <p className="text-lg font-black text-[#1A3A52] tracking-tight text-center md:text-left">{formData.linea}</p>
                </div>
                <div className="bg-white/95 p-6 rounded-[2rem] border border-slate-100 shadow-xl">
                    <span className="text-[10px] uppercase font-bold text-slate-500 block mb-2 text-center md:text-left">Dimensión</span>
                    <p className="text-lg font-black text-[#1A3A52] tracking-tight text-center md:text-left">{formData.ancho} x {formData.alto} mm</p>
                </div>
                <div className="bg-[#1A3A52] p-6 rounded-[2rem] shadow-xl text-center md:text-left">
                    <span className="text-[10px] uppercase font-bold text-white/60 block mb-2">Subtotal</span>
                    <p className="text-lg font-black text-white tracking-tight">${calculateLocalPrice().toLocaleString("es-AR")}</p>
                </div>
              </div>

              {projectItems.length > 0 && (
                <button 
                  onClick={() => setView("project")}
                  className="absolute bottom-10 right-10 bg-[#E85D04] text-white px-10 h-16 rounded-full text-xs font-black uppercase tracking-wider flex items-center gap-4 hover:scale-105 transition-all shadow-2xl z-20"
                >
                  Ver Proyecto ({projectItems.length}) <ArrowRight className="h-4 w-4" />
                </button>
              )}
            </div>

            <div className="lg:col-span-12 xl:col-span-5 p-12 lg:p-14 overflow-visible">
              <div className="max-w-md mx-auto h-full flex flex-col justify-between overflow-visible">
                
                <nav className="flex justify-between items-center mb-16 relative">
                   <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-slate-100 -z-10"></div>
                   {[
                    { id: 1, icon: Layers, label: "Sistema" },
                    { id: 2, icon: Layout, label: "Apertura" },
                    { id: 3, icon: Maximize2, label: "Medidas" },
                    { id: 4, icon: Settings2, label: "Vidrio" }
                   ].map((s) => (
                    <div key={s.id} className="relative flex flex-col items-center">
                      <button 
                        onClick={() => s.id < step && setStep(s.id)}
                        className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all border-2 ${step >= s.id ? 'bg-[#1A3A52] text-white border-[#1A3A52] shadow-lg shadow-[#1A3A52]/20' : 'bg-white text-slate-200 border-slate-100'}`}
                      >
                        <s.icon className="h-6 w-6" />
                      </button>
                      <span className={`absolute -bottom-10 text-[11px] font-black uppercase tracking-widest ${step === s.id ? 'text-[#1A3A52]' : 'text-slate-400'}`}>{s.label}</span>
                    </div>
                  ))}
                </nav>

                <div className="flex-1 overflow-visible min-h-[400px]">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={step}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-10 overflow-visible"
                    >
                      {step === 1 && (
                        <div className="space-y-8 overflow-visible">
                          <h3 className="text-5xl font-heading font-black text-[#1A3A52] tracking-tighter">Línea <span className="text-[#E85D04]">Técnica.</span></h3>
                          <div className="relative z-[50]">
                            <Select value={formData.linea} onValueChange={(v) => v && setFormData({...formData, linea: v})}>
                              <SelectTrigger className="h-20 text-xl font-bold rounded-3xl border-2 border-slate-100 px-8 shadow-sm">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="rounded-3xl p-4 min-w-[300px]">
                                <SelectItem value="Herrero" className="h-16 font-bold rounded-2xl cursor-pointer">Línea Herrero</SelectItem>
                                <SelectItem value="Módena" className="h-16 font-bold rounded-2xl cursor-pointer">Línea Módena</SelectItem>
                                <SelectItem value="A40" className="h-16 font-bold rounded-2xl cursor-pointer">Línea A40</SelectItem>
                                <SelectItem value="A40 RPT" className="h-16 font-bold rounded-2xl cursor-pointer">Línea A40 RPT</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      )}

                      {step === 2 && (
                        <div className="space-y-8">
                          <h3 className="text-5xl font-heading font-black text-[#1A3A52] tracking-tighter">Tipo de <span className="text-[#E85D04]">Apertura.</span></h3>
                          <div className="grid grid-cols-1 gap-4">
                            {[
                                { id: "corrediza", label: "Corrediza (Ventana/Balcón)", desc: "Suavidad milimétrica", icon: Layers },
                                { id: "abrir", label: "Ventana de Abrir", desc: "Hermeticidad Total", icon: Layout },
                                { id: "puerta_abrir", label: "Puerta de Abrir", desc: "Ingresos de Alta Gama", icon: DoorOpen },
                                { id: "fijo", label: "Paño Fijo", desc: "Mínimo Perfil", icon: Maximize2 }
                            ].map((tipo) => (
                              <button 
                                key={tipo.id} 
                                onClick={() => setFormData({...formData, tipologia: tipo.id})}
                                className={`flex items-center gap-6 p-6 rounded-3xl border-2 transition-all ${formData.tipologia === tipo.id ? 'border-[#E85D04] bg-[#E85D04]/5 shadow-xl shadow-orange-500/5' : 'border-slate-50 bg-slate-50/50 hover:border-slate-200'}`}
                              >
                                <tipo.icon className={`h-10 w-10 ${formData.tipologia === tipo.id ? 'text-[#E85D04]' : 'text-slate-300'}`} />
                                <div className="text-left">
                                  <span className="block text-lg font-black uppercase tracking-tight">{tipo.label}</span>
                                  <span className="text-[11px] font-black text-slate-500/60 uppercase tracking-widest">{tipo.desc}</span>
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {step === 3 && (
                        <div className="space-y-10">
                          <h3 className="text-5xl font-heading font-black text-[#1A3A52] tracking-tighter">Medidas <span className="text-[#E85D04]">Nominales.</span></h3>
                          <div className="space-y-8">
                            <div className="space-y-2">
                              <Label className="font-bold text-slate-400 uppercase text-[10px] tracking-widest pl-3">Ancho (MM)</Label>
                              <Input type="number" value={formData.ancho} onChange={(e) => setFormData({...formData, ancho: e.target.value})} className="h-20 text-4xl font-black rounded-3xl border-2 px-8" />
                            </div>
                            <div className="space-y-2">
                              <Label className="font-bold text-slate-400 uppercase text-[10px] tracking-widest pl-3">Alto (MM)</Label>
                              <Input type="number" value={formData.alto} onChange={(e) => setFormData({...formData, alto: e.target.value})} className="h-20 text-4xl font-black rounded-3xl border-2 px-8" />
                            </div>
                          </div>
                        </div>
                      )}

                      {step === 4 && (
                        <div className="space-y-8">
                          <h3 className="text-5xl font-heading font-black text-[#1A3A52] tracking-tighter">Tipo de <span className="text-[#E85D04]">Cristal.</span></h3>
                          <div className="grid grid-cols-1 gap-4">
                              {[
                                { id: "float4", label: "Float 4mm", desc: "Estándar Incoloro" },
                                { id: "float5", label: "Float 5mm", desc: "Rigidez Media" },
                                { id: "float6", label: "Float 6mm", desc: "Alta Resistencia" },
                                { id: "dvh", label: "DVH (4+12+4)", desc: "Aislamiento Térmico" }
                              ].map((v) => (
                                <button 
                                  key={v.id}
                                  onClick={() => setFormData({...formData, vidrio: v.id})}
                                  className={`flex justify-between items-center p-6 rounded-3xl border-2 transition-all ${formData.vidrio === v.id ? 'border-[#E85D04] bg-[#E85D04]/5' : 'border-slate-50 bg-white hover:border-slate-200'}`}
                                >
                                  <div className="text-left">
                                    <p className="font-black text-lg uppercase tracking-tight">{v.label}</p>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{v.desc}</p>
                                  </div>
                                </button>
                              ))}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>

                <div className="pt-10 flex gap-4">
                  <Button 
                    variant="outline" 
                    onClick={() => setStep(Math.max(1, step - 1))} 
                    disabled={step === 1} 
                    className="h-16 px-8 font-black uppercase rounded-2xl border-2 border-slate-200 bg-slate-100/50 text-[#1A3A52] hover:bg-slate-200 flex-1 transition-all"
                  >
                    Atrás
                  </Button>
                  <Button 
                    onClick={() => step < 4 ? setStep(step + 1) : addItemToProject()} 
                    className={`h-16 px-10 font-black uppercase text-xs tracking-wider rounded-2xl flex-2 shadow-xl ${step === 4 ? 'bg-[#E85D04] hover:bg-[#F96D0C]' : 'bg-[#1A3A52] hover:bg-[#2A4A62]'}`}
                  >
                    {step === 4 ? "Agregar Item" : "Continuar"}
                  </Button>
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
      <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700 max-w-7xl mx-auto pb-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-8 border-b border-slate-100">
          <div className="space-y-4">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-[#E85D04]">Resumen Técnico</h3>
            <h2 className="text-6xl font-heading font-black text-[#1A3A52] tracking-tighter">Mi Proyecto.</h2>
          </div>
          <Button onClick={() => setView("builder")} className="h-16 px-10 rounded-full border-2 border-[#1A3A52] bg-transparent text-[#1A3A52] font-black uppercase text-xs tracking-wider hover:bg-[#1A3A52] hover:text-white transition-all shadow-xl">
             + AGREGAR OTRA ABERTURA
          </Button>
        </div>

        <div className="grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-12 xl:col-span-8 space-y-6">
            {projectItems.map((item) => (
              <div key={item.id} className="bg-white border border-slate-100 p-8 rounded-[3rem] flex flex-col md:flex-row items-center gap-10 hover:shadow-2xl transition-all group">
                <div className="h-24 w-24 bg-slate-50 rounded-3xl flex items-center justify-center shrink-0">
                  <Layout className="h-10 w-10 text-slate-200" />
                </div>
                <div className="flex-1 text-center md:text-left space-y-3">
                  <h4 className="font-black text-2xl text-[#1A3A52] uppercase tracking-tighter">{item.linea} · {item.tipologia}</h4>
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                    <span className="px-4 py-1.5 bg-slate-50 text-[9px] font-bold text-slate-400 rounded-full tracking-wider uppercase">{item.ancho}x{item.alto}mm</span>
                    <span className="px-4 py-1.5 bg-slate-50 text-[9px] font-bold text-slate-400 rounded-full tracking-wider uppercase">{item.vidrio.replace('float','F')}</span>
                  </div>
                  <p className="text-3xl font-black text-[#1A3A52] tracking-tighter">${item.subtotal.toLocaleString("es-AR")}</p>
                </div>
                <Button variant="ghost" size="icon" onClick={() => removeItem(item.id)} className="h-14 w-14 rounded-2xl text-slate-200 hover:text-red-500 hover:bg-red-50 transition-all">
                  <Trash2 className="h-6 w-6" />
                </Button>
              </div>
            ))}
          </div>

          <div className="lg:col-span-12 xl:col-span-4 lg:mb-10 xl:mb-0">
            <Card className="rounded-[4rem] border-none bg-[#1A3A52] text-white p-2 shadow-2xl relative overflow-hidden group/card min-h-[500px] flex flex-col">
               <CardContent className="p-10 flex-1 flex flex-col justify-between">
                 <div className="space-y-6">
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/30">Subtotal Proyecto</span>
                    <h3 className="text-5xl font-black tracking-tighter">${totalProject.toLocaleString("es-AR")}</h3>
                    
                    <div className="space-y-4 pt-10">
                        <span className="text-[9px] font-black uppercase tracking-widest text-white/30">Elegir Plan de Financiación</span>
                        <div className="grid grid-cols-1 gap-3">
                            {[
                                { id: "contado", label: "Efectivo", desc: "10% OFF", icon: Wallet, tag: "AHORRO" },
                                { id: "cuotas3", label: "3 Cuotas", desc: "+15%", icon: CreditCard },
                                { id: "cuotas6", label: "6 Cuotas", desc: "+30%", icon: CreditCard }
                            ].map((p) => (
                                <button key={p.id} onClick={() => setPaymentMode(p.id as any)} className={`flex items-center justify-between p-6 rounded-[2rem] border-2 transition-all relative overflow-hidden ${paymentMode === p.id ? 'border-[#E85D04] bg-[#E85D04]/10 shadow-xl' : 'border-white/5 bg-white/5 opacity-60 hover:opacity-100'}`}>
                                    <div className="flex items-center gap-4">
                                        <p.icon className={`h-6 w-6 ${paymentMode === p.id ? 'text-[#E85D04]' : 'text-white/20'}`} />
                                        <div className="text-left">
                                            <p className="text-xs font-black uppercase tracking-wider">{p.label}</p>
                                            <p className="text-[9px] font-bold opacity-30 uppercase tracking-widest leading-none mt-1">{p.desc}</p>
                                        </div>
                                    </div>
                                    {p.tag && <span className="absolute top-2 right-2 text-[8px] font-black bg-[#E85D04] text-white px-3 py-1 rounded-full">{p.tag}</span>}
                                </button>
                            ))}
                        </div>
                    </div>
                 </div>

                 <div className="pt-10 mt-10 border-t border-white/5 space-y-8">
                     <div className="flex flex-col gap-2">
                        <span className="text-[9px] font-black uppercase tracking-widest text-[#E85D04]">Total Final {getFinancingLabel().label}</span>
                        <p className="text-4xl font-black tracking-tighter">${getFinancingLabel().total.toLocaleString("es-AR")}</p>
                     </div>
                    <Button onClick={() => setView("checkout")} className="w-full h-20 bg-[#E85D04] hover:bg-[#F96D0C] text-white font-black text-xs uppercase tracking-widest rounded-3xl shadow-2xl">
                      SOLICITAR PRESUPUESTO
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
    <div className="max-w-4xl mx-auto py-24 animate-in fade-in slide-in-from-bottom-12 duration-700">
      <div className="text-center mb-16 space-y-4">
         <h3 className="text-[10px] font-black uppercase tracking-widest text-[#E85D04]">Último Paso</h3>
         <h2 className="text-6xl font-heading font-black text-[#1A3A52] tracking-tighter">Consolidar <span className="text-[#E85D04] italic">Proyecto.</span></h2>
         <p className="text-slate-500 font-bold max-w-xl mx-auto text-lg leading-relaxed uppercase tracking-tight">Ingresa tus datos para recibir el presupuesto técnico personalizado.</p>
      </div>

      <div className="bg-white rounded-[4rem] border border-slate-100 shadow-2xl p-6 md:p-12">
        <form onSubmit={handleSubmitFinal} className="grid lg:grid-cols-12 gap-12">
          
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-4">
               <Label className="font-bold text-slate-600 uppercase text-[10px] tracking-widest pl-4">Titular del Proyecto</Label>
               <Input required value={clientData.nombre} onChange={(e) => setClientData({...clientData, nombre: e.target.value})} className="h-20 rounded-3xl border-2 px-8 text-xl font-bold" placeholder="Nombre completo" />
            </div>
            <div className="space-y-4">
               <Label className="font-bold text-slate-600 uppercase text-[10px] tracking-widest pl-4">Canal WhatsApp</Label>
               <Input required value={clientData.whatsapp} onChange={(e) => setClientData({...clientData, whatsapp: e.target.value})} className="h-20 rounded-3xl border-2 px-8 text-xl font-bold" placeholder="+54 9..." />
            </div>
            <div className="space-y-4">
               <Label className="font-bold text-slate-600 uppercase text-[10px] tracking-widest pl-4">Mail de Archivo</Label>
               <Input type="email" value={clientData.email} onChange={(e) => setClientData({...clientData, email: e.target.value})} className="h-20 rounded-3xl border-2 px-8 text-xl font-bold" placeholder="tu@email.com" />
            </div>
            <div className="pt-6">
                <Button type="submit" disabled={loading} className="w-full h-20 bg-[#E85D04] hover:bg-[#F96D0C] text-white font-black text-xs uppercase tracking-widest rounded-full shadow-2xl transition-all active:scale-[0.98]">
                    {loading ? "PROCESANDO..." : "SOLICITAR PRESUPUESTO DIGITAL"} <Send className="ml-4 h-5 w-5" />
                </Button>
            </div>
          </div>

          <div className="lg:col-span-5">
             <div className="bg-[#1A3A52] p-10 rounded-[3rem] text-white h-full flex flex-col justify-between shadow-2xl overflow-hidden relative">
               <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-16 translate-x-16"></div>
               
               <div className="space-y-8 relative">
                  <div className="flex justify-between items-center border-b border-white/10 pb-6">
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#E85D04]">Composición Obra</span>
                    <span className="text-xl font-black uppercase">{projectItems.length} Elementos</span>
                  </div>
                  
                  <div className="space-y-5">
                    <span className="text-[9px] font-black uppercase tracking-widest text-white/30 block">Inversión Final {getFinancingLabel().label}</span>
                    <p className="text-4xl font-black text-[#E85D04] tracking-tighter leading-none">
                        ${getFinancingLabel().total.toLocaleString("es-AR")}
                    </p>
                  </div>
               </div>

               {getFinancingLabel().cuota && (
                <div className="pt-6 border-t border-white/10 mt-8 relative">
                    <span className="text-[8px] font-bold uppercase tracking-widest text-white/30 block mb-1">Cuota Fija Estimada</span>
                    <p className="text-2xl font-black tracking-tight text-white/80">${getFinancingLabel().cuota?.toLocaleString("es-AR")}</p>
                </div>
               )}
             </div>
          </div>

        </form>
      </div>
    </div>
  );
}
