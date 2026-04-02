"use client";

import { useState, useEffect } from "react";
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
  DoorOpen,
  RefreshCw
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

interface SystemParams {
  margen_rentabilidad: number;
  porcentaje_mano_obra: number;
  gastos_administrativos: number;
  costo_kg_aluar: number;
  tipo_cambio_blue: number;
}

export function CotizadorDynamic() {
  const [view, setView] = useState<"builder" | "project" | "checkout">("builder");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  // Parámetros dinámicos del sistema
  const [params, setParams] = useState<SystemParams>({
    margen_rentabilidad: 40,
    porcentaje_mano_obra: 10,
    gastos_administrativos: 5,
    costo_kg_aluar: 10,
    tipo_cambio_blue: 1425
  });

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

  // 1. CARGA DE PARÁMETROS REALES
  useEffect(() => {
    const fetchParams = async () => {
      try {
        const res = await fetch("/api/quote"); // Reutilizamos el endpoint para ver si podemos obtener params o fallar a default
        // En una implementación ideal, tendríamos un endpoint /api/config.
        // Por ahora, usamos los defaults que ya matchean el paso 3.
      } catch (e) {
        console.error("Error cargando configuración técnica", e);
      }
    };
    fetchParams();
  }, []);

  const coloresMap: Record<string, string> = {
    blanco: "#FFFFFF",
    negro: "#2D2D2D",
    anodizado: "#a3a3a3",
    bronce: "#8B5A2B"
  };

  // 2. ALGORITMO DE PRECISIÓN VILKMET (Frontend Sync)
  const calculateLocalPrice = () => {
    const anchoM = Number(formData.ancho) / 1000;
    const altoM  = Number(formData.alto) / 1000;
    const perimetroM = (anchoM + altoM) * 2;
    const areaM2     = anchoM * altoM;
    
    // Masa por metro lineal
    let kgM = 1.8;
    if (formData.linea === "Herrero") kgM = 1.2;
    if (formData.linea.includes("A40")) kgM = 2.8;
    if (formData.linea.includes("RPT")) kgM = 3.4;

    // Costo de Vidrio USD/m2
    let glassCostUSD = 15;
    if (formData.vidrio === "float5") glassCostUSD = 18;
    if (formData.vidrio === "float6") glassCostUSD = 22;
    if (formData.vidrio === "dvh") glassCostUSD = 40;

    // Multiplicador Color
    const colorMult = (formData.color === "negro" || formData.color === "anodizado") ? 1.15 : 1.0;

    // FÓRMULA DE INGENIERÍA
    const costoAluARS = perimetroM * kgM * params.costo_kg_aluar * params.tipo_cambio_blue * colorMult;
    const costoVidrioARS = areaM2 * glassCostUSD * params.tipo_cambio_blue;
    
    const costoDirecto = costoAluARS + costoVidrioARS;
    
    // Aplicación secuencial de Márgenes (Mano de Obra -> Gastos Estructura -> Rentabilidad)
    const finalARS = costoDirecto * 
                     (1 + params.porcentaje_mano_obra / 100) * 
                     (1 + params.gastos_administrativos / 100) * 
                     (1 + params.margen_rentabilidad / 100);

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
      case "contado": return { label: "Contado (Altos Desempeños)", total: totalProject };
      case "lista": return { label: "Lista (1 Pago)", total: totalProject };
      case "cuotas3": return { label: "3 Cuotas (Fijas)", total: totalProject * 1.15, cuota: (totalProject * 1.15) / 3 };
      case "cuotas6": return { label: "6 Cuotas (Financiado)", total: totalProject * 1.30, cuota: (totalProject * 1.30) / 6 };
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
      else alert("Error en el servidor de cotizaciones");
    } catch (error) {
       console.error(error);
       alert("Error de conexión con VILKMET Security");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center py-20 animate-in fade-in zoom-in duration-700 max-w-2xl mx-auto">
        <CheckCircle2 className="h-24 w-24 text-green-500 mx-auto mb-8 animate-bounce" />
        <h3 className="text-4xl font-heading font-black text-primary mb-6 uppercase tracking-tighter italic">¡PROYECTO ENVIADO!</h3>
        <p className="text-xl text-muted-foreground mb-10 font-medium">
          Hola <span className="text-[#E85D04] font-black">{clientData.nombre}</span>, hemos recibido tu diseño. 
          Un ingeniero de <span className="font-bold text-primary">VILKMET</span> revisará la viabilidad técnica y te contactará.
        </p>
        <div className="bg-primary text-white p-12 rounded-[2rem] shadow-2xl border border-white/10 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
             <RefreshCw className="w-20 h-20 animate-spin-slow" />
          </div>
          <span className="block text-[10px] uppercase tracking-widest text-[#E85D04] mb-4 font-black text-center">Inversión Final Proyectada</span>
          <p className="text-6xl font-black tracking-tighter text-center">
            ${getFinancingLabel().total.toLocaleString("es-AR")}
          </p>
        </div>
        <Button onClick={() => window.location.reload()} variant="link" className="mt-16 text-primary uppercase font-bold tracking-widest text-xs">Iniciar Nuevo Diseño</Button>
      </div>
    );
  }

  if (view === "builder") {
    return (
      <div className="relative group/console max-w-7xl mx-auto pb-20">
        <div className="bg-white/90 backdrop-blur-2xl rounded-[3rem] border border-slate-200/50 shadow-2xl overflow-hidden p-2">
          <div className="grid lg:grid-cols-12 gap-0 overflow-visible">
            
            {/* Visualizador 3D Like */}
            <div className="lg:col-span-12 xl:col-span-7 p-12 lg:p-16 bg-slate-100/50 rounded-[2.5rem] relative overflow-hidden border border-slate-100 flex flex-col justify-between min-h-[650px]">
              <div className="flex items-center gap-3 z-10">
                <div className="h-3 w-3 bg-[#E85D04] rounded-full animate-pulse shadow-[0_0_15px_rgba(232,93,4,0.5)]"></div>
                <h3 className="text-[11px] font-black uppercase tracking-widest text-primary/60">VILKMET Console · v1.1 Elite</h3>
              </div>
              
              <div className="flex-1 flex flex-col justify-center py-12">
                <div className="relative group/sim scale-110 sm:scale-125 md:scale-[1.4] transition-transform duration-1000 origin-center">
                   <SimuladorVisual 
                    tipologia={formData.tipologia as any} 
                    ancho={Number(formData.ancho)} 
                    alto={Number(formData.alto)} 
                    colorHex={coloresMap[formData.color] || "#FFFFFF"}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative z-10">
                <div className="bg-white/95 p-6 rounded-[1.5rem] border border-slate-100 shadow-xl">
                    <span className="text-[9px] uppercase font-bold text-slate-400 block mb-1">Materia Prima</span>
                    <p className="text-lg font-black text-primary tracking-tight">ALUAR {formData.linea}</p>
                </div>
                <div className="bg-white/95 p-6 rounded-[1.5rem] border border-slate-100 shadow-xl">
                    <span className="text-[9px] uppercase font-bold text-slate-400 block mb-1">Área Técnica</span>
                    <p className="text-lg font-black text-primary tracking-tight">{formData.ancho} x {formData.alto} MM</p>
                </div>
                <div className="bg-[#E85D04] p-6 rounded-[1.5rem] shadow-xl text-center md:text-left text-white">
                    <span className="text-[9px] uppercase font-bold text-white/50 block mb-1">Cotización Parcial</span>
                    <p className="text-xl font-black tracking-tight">${calculateLocalPrice().toLocaleString("es-AR")}</p>
                </div>
              </div>

              {projectItems.length > 0 && (
                <button 
                  onClick={() => setView("project")}
                  className="absolute bottom-10 right-10 bg-primary text-white px-10 h-16 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-4 hover:scale-105 transition-all shadow-2xl z-20 border border-white/10"
                >
                  Ver Proyecto ({projectItems.length}) <ArrowRight className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Controles de Ingeniería */}
            <div className="lg:col-span-12 xl:col-span-5 p-12 lg:p-14">
              <div className="max-w-md mx-auto h-full flex flex-col justify-between">
                
                <nav className="flex justify-between items-center mb-16 relative">
                   <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-slate-100 -z-10"></div>
                   {[
                    { id: 1, icon: Layers, label: "Sistema" },
                    { id: 2, icon: Layout, label: "Diseño" },
                    { id: 3, icon: Maximize2, label: "Medida" },
                    { id: 4, icon: Settings2, label: "Técnico" }
                   ].map((s) => (
                    <div key={s.id} className="relative flex flex-col items-center">
                      <button 
                        onClick={() => s.id < step && setStep(s.id)}
                        className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all border-2 ${step >= s.id ? 'bg-primary text-white border-primary shadow-lg' : 'bg-white text-slate-200 border-slate-100'}`}
                      >
                        <s.icon className="h-5 w-5" />
                      </button>
                      <span className={`absolute -bottom-8 text-[9px] font-black uppercase tracking-widest ${step === s.id ? 'text-primary' : 'text-slate-300'}`}>{s.label}</span>
                    </div>
                  ))}
                </nav>

                <div className="flex-1 min-h-[380px]">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={step}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 1.05 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-8"
                    >
                      {step === 1 && (
                        <div className="space-y-8">
                          <h3 className="text-4xl font-heading font-black text-primary tracking-tighter uppercase italic">Perfilería <span className="text-[#E85D04]">Aluar.</span></h3>
                          <div className="grid grid-cols-1 gap-3">
                             {["Herrero", "Módena", "A40", "A40 RPT"].map((l) => (
                               <button 
                                key={l}
                                onClick={() => setFormData({...formData, linea: l as any})}
                                className={`h-16 rounded-2xl border-2 font-black uppercase text-xs tracking-widest transition-all ${formData.linea === l ? 'border-[#E85D04] bg-[#E85D04]/5 text-[#E85D04]' : 'border-slate-50 bg-slate-50/50 hover:border-slate-200'}`}
                               >
                                 Línea {l}
                               </button>
                             ))}
                          </div>
                        </div>
                      )}

                      {step === 2 && (
                        <div className="space-y-8">
                          <h3 className="text-4xl font-heading font-black text-primary tracking-tighter uppercase italic">Tipo <span className="text-[#E85D04]">Apertura.</span></h3>
                          <div className="grid grid-cols-1 gap-3">
                            {[
                                { id: "corrediza", label: "Corrediza", icon: Layers },
                                { id: "abrir", label: "De Abrir", icon: Layout },
                                { id: "puerta_abrir", label: "Puerta", icon: DoorOpen },
                                { id: "fijo", label: "Paño Fijo", icon: Maximize2 }
                            ].map((tipo) => (
                              <button 
                                key={tipo.id} 
                                onClick={() => setFormData({...formData, tipologia: tipo.id})}
                                className={`flex items-center gap-5 p-5 rounded-2xl border-2 transition-all ${formData.tipologia === tipo.id ? 'border-[#E85D04] bg-[#E85D04]/5' : 'border-slate-50 bg-slate-50/50 hover:border-slate-200'}`}
                              >
                                <tipo.icon className={`h-6 w-6 ${formData.tipologia === tipo.id ? 'text-[#E85D04]' : 'text-slate-300'}`} />
                                <span className="text-xs font-black uppercase tracking-widest">{tipo.label}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {step === 3 && (
                        <div className="space-y-8">
                          <h3 className="text-4xl font-heading font-black text-primary tracking-tighter uppercase italic">Corte <span className="text-[#E85D04]">Milimétrico.</span></h3>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                               <Label className="font-black text-[9px] text-slate-400 uppercase tracking-widest pl-2">Ancho MM</Label>
                               <Input type="number" value={formData.ancho} onChange={(e) => setFormData({...formData, ancho: e.target.value})} className="h-16 text-2xl font-black rounded-2xl border-2 px-6 bg-slate-50/50" />
                            </div>
                            <div className="space-y-2">
                               <Label className="font-black text-[9px] text-slate-400 uppercase tracking-widest pl-2">Alto MM</Label>
                               <Input type="number" value={formData.alto} onChange={(e) => setFormData({...formData, alto: e.target.value})} className="h-16 text-2xl font-black rounded-2xl border-2 px-6 bg-slate-50/50" />
                            </div>
                          </div>
                        </div>
                      )}

                      {step === 4 && (
                        <div className="space-y-8">
                          <h3 className="text-4xl font-heading font-black text-primary tracking-tighter uppercase italic">Control <span className="text-[#E85D04]">Térmico.</span></h3>
                          <div className="grid grid-cols-1 gap-3">
                              {[
                                { id: "float4", label: "Float 4mm" },
                                { id: "float6", label: "Float 6mm" },
                                { id: "dvh", label: "DVH (Estandar)" }
                              ].map((v) => (
                                <button 
                                  key={v.id}
                                  onClick={() => setFormData({...formData, vidrio: v.id})}
                                  className={`p-6 rounded-2xl border-2 text-left transition-all ${formData.vidrio === v.id ? 'border-[#E85D04] bg-[#E85D04]/5' : 'border-slate-50 bg-slate-50/50 hover:border-slate-200'}`}
                                >
                                  <p className="font-black text-xs uppercase tracking-[0.2em]">{v.label}</p>
                                </button>
                              ))}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>

                <div className="pt-8 flex gap-3">
                  <Button 
                    variant="outline" 
                    onClick={() => setStep(Math.max(1, step - 1))} 
                    disabled={step === 1} 
                    className="h-16 px-6 font-black uppercase text-[10px] rounded-xl border-2 bg-white text-primary flex-1 tracking-widest"
                  >
                    Atrás
                  </Button>
                  <Button 
                    onClick={() => step < 4 ? setStep(step + 1) : addItemToProject()} 
                    className={`h-16 px-8 font-black uppercase text-[10px] tracking-widest rounded-xl flex-2 shadow-xl ${step === 4 ? 'bg-[#E85D04] hover:bg-[#F96D0C]' : 'bg-primary hover:bg-[#2A4A62]'}`}
                  >
                    {step === 4 ? "Sellar Item" : "Continuar"}
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
      <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700 max-w-7xl mx-auto pb-20 px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-8 border-b border-slate-100">
           <div className="space-y-2">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#E85D04]">Configuración Técnica</span>
              <h2 className="text-6xl font-heading font-black text-primary tracking-tighter uppercase italic">Mi <span className="text-[#E85D04]">Obra.</span></h2>
           </div>
           <Button onClick={() => setView("builder")} className="h-16 px-10 rounded-2xl border-2 border-primary bg-transparent text-primary font-black uppercase text-[10px] tracking-[0.2em] hover:bg-primary hover:text-white transition-all">
              + AGREGAR ELEMENTO
           </Button>
        </div>

        <div className="grid lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-4">
            {projectItems.map((item) => (
              <div key={item.id} className="bg-white border-2 border-slate-50 p-10 rounded-[2.5rem] flex flex-col md:flex-row items-center gap-10 hover:border-[#E85D04]/20 transition-all">
                <div className="h-20 w-20 bg-slate-50 rounded-2xl flex items-center justify-center">
                  <Layout className="h-8 w-8 text-slate-200" />
                </div>
                <div className="flex-1 text-center md:text-left">
                  <span className="text-[9px] font-black uppercase tracking-widest text-[#E85D04] block mb-1">{item.linea}</span>
                  <h4 className="font-black text-2xl text-primary uppercase tracking-tighter mb-4">{item.tipologia}</h4>
                  <div className="flex gap-2 justify-center md:justify-start">
                    <span className="bg-slate-50 px-3 py-1 text-[9px] font-black text-slate-400 rounded-lg">{item.ancho}x{item.alto}mm</span>
                    <span className="bg-slate-50 px-3 py-1 text-[9px] font-black text-slate-400 rounded-lg uppercase">{item.vidrio}</span>
                  </div>
                </div>
                <div className="text-center md:text-right">
                   <p className="text-3xl font-black text-primary tracking-tighter">${item.subtotal.toLocaleString("es-AR")}</p>
                   <button onClick={() => removeItem(item.id)} className="text-red-400 hover:text-red-600 text-[10px] font-black uppercase mt-2">Eliminar</button>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-4">
             <Card className="rounded-[3rem] border-none bg-primary text-white p-10 shadow-3xl flex flex-col justify-between min-h-[450px]">
                <div className="space-y-6">
                   <span className="text-[10px] font-black uppercase tracking-widest text-white/30">Inversión Bruta Obra</span>
                   <h3 className="text-5xl font-black tracking-tighter">${totalProject.toLocaleString("es-AR")}</h3>
                   
                   <div className="grid grid-cols-1 gap-3 pt-8">
                       {[
                           { id: "contado", label: "Efectivo", icon: Wallet },
                           { id: "cuotas3", label: "3 Cuotas", icon: CreditCard },
                           { id: "cuotas6", label: "6 Cuotas", icon: CreditCard }
                       ].map((p) => (
                           <button key={p.id} onClick={() => setPaymentMode(p.id as any)} className={`flex items-center gap-4 p-5 rounded-2xl border-2 transition-all ${paymentMode === p.id ? 'border-[#E85D04] bg-[#E85D04]/10' : 'border-white/5 bg-white/5 opacity-40'}`}>
                               <p.icon className="h-5 w-5" />
                               <span className="text-[10px] font-black uppercase tracking-widest">{p.label}</span>
                           </button>
                       ))}
                   </div>
                </div>

                <div className="pt-8 mt-8 border-t border-white/5">
                    <Button onClick={() => setView("checkout")} className="w-full h-20 bg-[#E85D04] hover:bg-[#F96D0C] text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-xl">
                      CERRAR PRESUPUESTO
                    </Button>
                </div>
             </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-16 px-4">
      <div className="text-center mb-16">
         <h2 className="text-6xl font-heading font-black text-primary tracking-tighter uppercase italic">Consolidar <span className="text-[#E85D04]">V|K.</span></h2>
         <p className="text-slate-400 font-bold mt-4 uppercase tracking-tighter">Ingrese sus credenciales de contacto para recibir el legajo de obra.</p>
      </div>

      <div className="bg-white rounded-[4rem] border border-slate-100 shadow-2xl p-12">
        <form onSubmit={handleSubmitFinal} className="grid md:grid-cols-2 gap-12">
          <div className="space-y-6">
            <div className="space-y-2">
               <Label className="font-black text-[9px] uppercase tracking-widest text-slate-400 pl-2">Titular</Label>
               <Input required value={clientData.nombre} onChange={(e) => setClientData({...clientData, nombre: e.target.value})} className="h-16 rounded-2xl border-2 px-6 font-bold" />
            </div>
            <div className="space-y-2">
               <Label className="font-black text-[9px] uppercase tracking-widest text-slate-400 pl-2">WhatsApp</Label>
               <Input required value={clientData.whatsapp} onChange={(e) => setClientData({...clientData, whatsapp: e.target.value})} className="h-16 rounded-2xl border-2 px-6 font-bold" />
            </div>
            <Button type="submit" disabled={loading} className="w-full h-16 bg-[#E85D04] text-white font-black uppercase tracking-widest rounded-2xl mt-4">
                {loading ? "PROCESANDO..." : "OBTENER PRESUPUESTO"}
            </Button>
          </div>
          <div className="bg-primary/5 p-10 rounded-[2.5rem] flex flex-col justify-center border border-primary/5">
             <span className="text-[9px] font-black uppercase tracking-widest text-[#E85D04] block mb-2">Resumen de Inversión</span>
             <p className="text-5xl font-black text-primary tracking-tighter">
                ${getFinancingLabel().total.toLocaleString("es-AR")}
             </p>
             <span className="text-[10px] font-bold text-slate-400 mt-2 uppercase">{getFinancingLabel().label}</span>
          </div>
        </form>
      </div>
    </div>
  );
}
