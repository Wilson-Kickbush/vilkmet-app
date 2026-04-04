"use client";

import { useState, useEffect } from "react";
import { SimuladorVisual } from "./SimuladorVisual";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  RefreshCw,
  MessageCircle,
  Mail,
  FileText
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink, Image } from '@react-pdf/renderer';

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

// ---------------------------------------------------------
// ESTILOS Y COMPONENTE PARA EL PDF
// ---------------------------------------------------------
const pdfStyles = StyleSheet.create({
  page: { 
    padding: 40, 
    fontFamily: 'Helvetica' 
  },
  header: { 
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30, 
    borderBottom: 2, 
    borderBottomColor: '#1A3A52', 
    paddingBottom: 20 
  },
  logoContainer: {
    width: 80,
    height: 80,
  },
  logo: {
    width: 80,
    height: 80,
  },
  headerText: {
    flex: 1,
    marginLeft: 20,
  },
  title: { 
    fontSize: 24, 
    color: '#1A3A52', 
    fontWeight: 'bold', 
    marginBottom: 5 
  },
  subtitle: { 
    fontSize: 14, 
    color: '#666' 
  },
  clientInfo: { 
    marginBottom: 25, 
    backgroundColor: '#f8f9fa', 
    padding: 15, 
    borderRadius: 5 
  },
  sectionTitle: { 
    fontSize: 16, 
    color: '#1A3A52', 
    fontWeight: 'bold', 
    marginBottom: 10 
  },
  text: { 
    fontSize: 12, 
    marginBottom: 5 
  },
  itemsSection: { 
    marginBottom: 25 
  },
  itemRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginBottom: 8, 
    paddingBottom: 8, 
    borderBottomWidth: 1, 
    borderBottomColor: '#eee' 
  },
  itemText: { 
    fontSize: 11, 
    flex: 3 
  },
  itemPrice: { 
    fontSize: 11, 
    fontWeight: 'bold', 
    flex: 1, 
    textAlign: 'right' 
  },
  summary: { 
    backgroundColor: '#f0f7ff', 
    padding: 20, 
    borderRadius: 5, 
    marginBottom: 20 
  },
  summaryRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginBottom: 8 
  },
  summaryLabel: { 
    fontSize: 13, 
    color: '#555' 
  },
  summaryValue: { 
    fontSize: 13, 
    fontWeight: 'bold' 
  },
  totalRow: { 
    marginTop: 15, 
    paddingTop: 15, 
    borderTopWidth: 2, 
    borderTopColor: '#1A3A52' 
  },
  totalLabel: { 
    fontSize: 16, 
    color: '#1A3A52', 
    fontWeight: 'bold' 
  },
  totalValue: { 
    fontSize: 18, 
    color: '#E85D04', 
    fontWeight: 'bold' 
  },
  warranty: {
    marginBottom: 25,
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderLeftWidth: 4,
    borderLeftColor: '#1A3A52',
    borderRadius: 3,
  },
  warrantyText: {
    fontSize: 10,
    color: '#333',
    fontStyle: 'italic',
  },
  footer: { 
    marginTop: 20,
    paddingTop: 20, 
    borderTopWidth: 1, 
    borderTopColor: '#ddd', 
    textAlign: 'center' 
  },
  footerText: { 
    fontSize: 10, 
    color: '#666', 
    textAlign: 'center', 
    marginBottom: 3 
  },
  footerNote: { 
    fontSize: 9, 
    color: '#999', 
    fontStyle: 'italic', 
    textAlign: 'center', 
    marginTop: 10 
  },
});

const PresupuestoPDF = ({ clientData, projectItems, paymentMode, financingDetails }: any) => (
  <Document>
    <Page size="A4" style={pdfStyles.page}>
      {/* Header con logo */}
      <View style={pdfStyles.header}>
        <View style={pdfStyles.logoContainer}>
          <Image 
            src="/logo.png" 
            style={pdfStyles.logo}
          />
        </View>
        <View style={pdfStyles.headerText}>
          <Text style={pdfStyles.title}>VILKMET - Presupuesto Técnico</Text>
          <Text style={pdfStyles.subtitle}>Sistemas de Aluminio de Alta Performance</Text>
        </View>
      </View>

      {/* Información del cliente */}
      <View style={pdfStyles.clientInfo}>
        <Text style={pdfStyles.sectionTitle}>Información del Cliente</Text>
        <Text style={pdfStyles.text}>Nombre: {clientData.nombre}</Text>
        <Text style={pdfStyles.text}>WhatsApp: {clientData.whatsapp}</Text>
        {clientData.email && <Text style={pdfStyles.text}>Email: {clientData.email}</Text>}
        <Text style={pdfStyles.text}>Fecha: {new Date().toLocaleDateString('es-AR')}</Text>
      </View>

      {/* Detalle del proyecto */}
      <View style={pdfStyles.itemsSection}>
        <Text style={pdfStyles.sectionTitle}>Detalle del Proyecto</Text>
        {projectItems.map((item: any, index: number) => (
          <View key={index} style={pdfStyles.itemRow}>
            <Text style={pdfStyles.itemText}>
              Línea {item.linea} - {item.tipologia} ({item.ancho}x{item.alto}mm) | 
              Color: {item.color} | Vidrio: {item.vidrio}
            </Text>
            <Text style={pdfStyles.itemPrice}>
              ${item.subtotal.toLocaleString('es-AR')}
            </Text>
          </View>
        ))}
      </View>

      {/* Resumen financiero */}
      <View style={pdfStyles.summary}>
        <Text style={pdfStyles.sectionTitle}>Resumen Financiero</Text>
        <View style={pdfStyles.summaryRow}>
          <Text style={pdfStyles.summaryLabel}>Subtotal:</Text>
          <Text style={pdfStyles.summaryValue}>
            ${financingDetails.subtotal?.toLocaleString('es-AR')}
          </Text>
        </View>
        <View style={pdfStyles.summaryRow}>
          <Text style={pdfStyles.summaryLabel}>Modalidad:</Text>
          <Text style={pdfStyles.summaryValue}>{financingDetails.label}</Text>
        </View>
        {financingDetails.cuota && (
          <View style={pdfStyles.summaryRow}>
            <Text style={pdfStyles.summaryLabel}>Cuota mensual:</Text>
            <Text style={pdfStyles.summaryValue}>
              ${Math.round(financingDetails.cuota).toLocaleString('es-AR')}
            </Text>
          </View>
        )}
        <View style={[pdfStyles.summaryRow, pdfStyles.totalRow]}>
          <Text style={pdfStyles.totalLabel}>TOTAL FINAL:</Text>
          <Text style={pdfStyles.totalValue}>
            ${financingDetails.total.toLocaleString('es-AR')}
          </Text>
        </View>
      </View>

      {/* Garantía y condiciones */}
      <View style={pdfStyles.warranty}>
        <Text style={pdfStyles.warrantyText}>
          Garantía y Respaldo
        </Text>
        <Text style={[pdfStyles.warrantyText, {marginTop: 5}]}>
          Para su tranquilidad, cada proyecto se formaliza mediante un Contrato de Locación de Obra. Otorgamos una Garantía Contractual de 1 año sobre materiales y cerramientos, superando el plazo legal y bajo normativas de Defensa del Consumidor.
        </Text>
        <Text style={[pdfStyles.warrantyText, {marginTop: 5, fontWeight: 'bold'}]}>
          Perfiles Aluar | Herrajes Premium
        </Text>
      </View>

      {/* Footer corporativo */}
      <View style={pdfStyles.footer}>
        <Text style={pdfStyles.footerText}>
          VILKMET - Sistemas de Aluminio de Alta Performance
        </Text>
        <Text style={pdfStyles.footerText}>
          WhatsApp: 11-5096-0796 | Email: ventas@vilkmet.com | www.vilkmet.com
        </Text>
        <Text style={pdfStyles.footerNote}>
          Este presupuesto tiene validez por 30 días
        </Text>
      </View>
    </Page>
  </Document>
);

// ---------------------------------------------------------
// COMPONENTE PRINCIPAL
// ---------------------------------------------------------
export function CotizadorDynamic() {
  const [view, setView] = useState<"builder" | "project" | "checkout">("builder");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
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
    linea: "Modena",
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

  useEffect(() => {
    const fetchParams = async () => {
      try {
        const res = await fetch("/api/config");
        if (res.ok) {
          const data = await res.json();
          setParams(data);
        }
      } catch (e) {
        console.error("Error cargando configuración técnica");
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

  const calculateLocalPrice = () => {
    const anchoM = Number(formData.ancho) / 1000;
    const altoM  = Number(formData.alto) / 1000;
    const perimetroM = (anchoM + altoM) * 2;
    const areaM2     = anchoM * altoM;
    
    let kgM = 1.8;
    if (formData.linea === "Herrero") kgM = 1.2;
    if (formData.linea.includes("A40")) kgM = 2.8;
    if (formData.linea.includes("RPT")) kgM = 3.4;

    let glassCostUSD = 15;
    if (formData.vidrio === "float5") glassCostUSD = 18;
    if (formData.vidrio === "float6") glassCostUSD = 22;
    if (formData.vidrio === "dvh") glassCostUSD = 40;

    const colorMult = (formData.color === "negro" || formData.color === "anodizado") ? 1.15 : 1.0;

    const costoAluARS = perimetroM * kgM * params.costo_kg_aluar * params.tipo_cambio_blue * colorMult;
    const costoVidrioARS = areaM2 * glassCostUSD * params.tipo_cambio_blue;
    
    const costoDirecto = costoAluARS + costoVidrioARS;
    const finalARS = costoDirecto * (1 + params.porcentaje_mano_obra / 100) * (1 + params.gastos_administrativos / 100) * (1 + params.margen_rentabilidad / 100);

    return Math.round(finalARS);
  };

  const calculateFinancing = () => {
    const baseTotal = projectItems.reduce((acc, item) => acc + item.subtotal, 0);
    switch(paymentMode) {
      case "contado": return { label: "Contado Efectivo (-5%)", total: Math.round(baseTotal * 0.95), subtotal: baseTotal, cuota: null };
      case "lista": return { label: "Lista de Precios", total: baseTotal, subtotal: baseTotal, cuota: null };
      case "cuotas3": return { label: "3 Cuotas Fijas (+12%)", total: Math.round(baseTotal * 1.12), subtotal: baseTotal, cuota: Math.round((baseTotal * 1.12) / 3) };
      case "cuotas6": return { label: "6 Cuotas Financiadas (+25%)", total: Math.round(baseTotal * 1.25), subtotal: baseTotal, cuota: Math.round((baseTotal * 1.25) / 6) };
      default: return { label: "Contado", total: baseTotal, subtotal: baseTotal, cuota: null };
    }
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

  const financingLabel = calculateFinancing();

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
          totalFinanciado: financingLabel.total
        })
      });
      if (res.ok) setSuccess(true);
      else alert("Error en el servidor de cotizaciones");
    } catch (error) {
       console.error(error);
       alert("Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------------------------------------
  // RENDER: VISTA DE ÉXITO 
  // ---------------------------------------------------------
  if (success) {
    const handleWhatsAppShare = () => {
      const message = `¡Hola ${clientData.nombre}! Recibimos tu solicitud en VILKMET.\n\nTotal Proyecto: $${financingLabel.total.toLocaleString('es-AR')}\nModalidad: ${financingLabel.label}\n\nEn breve nos comunicaremos.`;
      const encoded = encodeURIComponent(message);
      window.open(`https://wa.me/${clientData.whatsapp.replace(/\D/g, '')}?text=${encoded}`, '_blank');
    };

    const handleEmailShare = () => {
      const subject = `Presupuesto VILKMET - ${clientData.nombre}`;
      const body = `Estimado/a ${clientData.nombre},\n\nGracias por cotizar con VILKMET. Su proyecto tiene un valor de $${financingLabel.total.toLocaleString('es-AR')} abonando en la modalidad: ${financingLabel.label}.\n\nSaludos.`;
      window.open(`mailto:${clientData.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, '_blank');
    };

    return (
      <div id="sistema-cotizador" className="text-center py-20 animate-in fade-in zoom-in duration-700 max-w-4xl mx-auto px-4">
        <CheckCircle2 className="h-24 w-24 text-green-500 mx-auto mb-8 animate-bounce" />
        <h3 className="text-4xl font-heading font-black text-[#1A3A52] mb-6 uppercase tracking-tighter">¡Solicitud Recibida!</h3>
        <p className="text-xl text-gray-600 mb-10 font-medium max-w-2xl mx-auto">
          Hola <span className="text-[#E85D04] font-bold">{clientData.nombre}</span>, hemos registrado tu cotización. En breve un asesor se pondrá en contacto contigo.
        </p>

        <div className="bg-[#1A3A52] text-white p-10 rounded-[2rem] shadow-2xl mb-10">
           <span className="text-sm font-bold uppercase tracking-widest text-[#E85D04] mb-2 block">Total Inversión</span>
           <p className="text-5xl font-black tracking-tighter">${financingLabel.total.toLocaleString("es-AR")}</p>
           <p className="text-sm mt-2 text-gray-300">{financingLabel.label}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <PDFDownloadLink
            document={<PresupuestoPDF clientData={clientData} projectItems={projectItems} financingDetails={financingLabel} />}
            fileName="Presupuesto_VILKMET.pdf"
            style={{ textDecoration: 'none' }}
          >
            <Button variant="outline" className="w-full h-14 bg-white border-[#1A3A52] text-[#1A3A52] hover:bg-[#1A3A52] hover:text-white">
              <FileText className="w-5 h-5 mr-2" /> Descargar PDF
            </Button>
          </PDFDownloadLink>

          <Button onClick={handleWhatsAppShare} variant="outline" className="h-14 bg-green-50 border-green-200 text-green-700 hover:bg-green-100 hover:text-green-800">
            <MessageCircle className="w-5 h-5 mr-2" /> WhatsApp
          </Button>

          <Button onClick={handleEmailShare} variant="outline" className="h-14 bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100 hover:text-blue-800">
            <Mail className="w-5 h-5 mr-2" /> Email
          </Button>
        </div>
        
        <div className="mt-12 text-center">
          <Button 
            onClick={() => window.location.reload()} 
            variant="link" 
            className="text-[#E85D04] font-bold uppercase tracking-widest text-xs hover:text-[#c24e03]"
          >
            <RefreshCw className="w-3 h-3 mr-2" /> Iniciar Nuevo Proyecto
          </Button>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------
  // RENDER: VISTA DEL PROYECTO / CARRITO
  // ---------------------------------------------------------
  if (view === "project") {
    return (
      <div id="sistema-cotizador" className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700 max-w-7xl mx-auto pb-20 px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-8 border-b border-slate-100">
           <div className="space-y-2">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#E85D04]">Configuración Técnica</span>
              <h2 className="text-6xl font-heading font-black text-[#1A3A52] tracking-tighter uppercase italic">Mi <span className="text-[#E85D04]">Obra.</span></h2>
           </div>
           <Button onClick={() => setView("builder")} className="h-16 px-10 rounded-2xl border-2 border-[#1A3A52] bg-transparent text-[#1A3A52] font-black uppercase text-[10px] tracking-[0.2em] hover:bg-[#1A3A52] hover:text-white transition-all">
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
                  <h4 className="font-black text-2xl text-[#1A3A52] uppercase tracking-tighter mb-4">{item.tipologia}</h4>
                  <div className="flex gap-2 justify-center md:justify-start">
                    <span className="bg-slate-50 px-3 py-1 text-[9px] font-black text-slate-400 rounded-lg">{item.ancho}x{item.alto}mm</span>
                    <span className="bg-slate-50 px-3 py-1 text-[9px] font-black text-slate-400 rounded-lg uppercase">{item.vidrio}</span>
                  </div>
                </div>
                <div className="text-center md:text-right">
                   <p className="text-3xl font-black text-[#1A3A52] tracking-tighter">${item.subtotal.toLocaleString("es-AR")}</p>
                   <button onClick={() => removeItem(item.id)} className="text-red-400 hover:text-red-600 text-[10px] font-black uppercase mt-2">Eliminar</button>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-4">
             <Card className="rounded-[3rem] border-none bg-[#1A3A52] text-white p-10 shadow-3xl flex flex-col justify-between min-h-[450px]">
                <div className="space-y-6">
                   <span className="text-[10px] font-black uppercase tracking-widest text-white/30">Inversión Final</span>
                   <h3 className="text-5xl font-black tracking-tighter">${financingLabel.total.toLocaleString("es-AR")}</h3>
                   <p className="text-sm font-bold text-[#E85D04]">{financingLabel.label}</p>
                   {financingLabel.cuota && (
                      <p className="text-xs text-white/70">Monto de la cuota: ${financingLabel.cuota.toLocaleString("es-AR")}</p>
                   )}
                   
                   <div className="grid grid-cols-1 gap-3 pt-8">
                       {[
                           { id: "contado", label: "Efectivo (-5%)", icon: Wallet },
                           { id: "lista", label: "Lista (1 Pago)", icon: CreditCard },
                           { id: "cuotas3", label: "3 Cuotas (+12%)", icon: CreditCard },
                           { id: "cuotas6", label: "6 Cuotas (+25%)", icon: CreditCard }
                       ].map((p) => (
                           <button key={p.id} onClick={() => setPaymentMode(p.id as any)} className={`flex items-center gap-4 p-5 rounded-2xl border-2 transition-all ${paymentMode === p.id ? 'border-[#E85D04] bg-[#E85D04]/10' : 'border-white/5 bg-white/5 opacity-40'}`}>
                               <p.icon className="h-5 w-5" />
                               <span className="text-[10px] font-black uppercase tracking-widest">{p.label}</span>
                           </button>
                       ))}
                   </div>
                </div>

                <div className="pt-8 border-t border-white/10 mt-8">
                    <Button onClick={() => setView("checkout")} className="w-full h-16 rounded-2xl bg-[#E85D04] hover:bg-[#c24e03] text-white font-black uppercase text-[10px] tracking-[0.2em]">
                       AVANZAR A DATOS <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </div>
             </Card>
          </div>
        </div>
      </div>
    );
  }

  if (view === "checkout") {
    return (
      <div id="sistema-cotizador" className="max-w-2xl mx-auto py-10 px-4">
        <div className="text-center mb-12">
           <h2 className="text-4xl font-heading font-black text-[#1A3A52] tracking-tighter uppercase mb-4">Confirmar <span className="text-[#E85D04]">Proyecto.</span></h2>
           <p className="text-slate-500 font-medium">Completa tus datos para agendar la medición técnica.</p>
        </div>
        
        <form onSubmit={handleSubmitFinal} className="space-y-6">
          <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-xl space-y-6">
             <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Nombre Completo</Label>
                <Input required value={clientData.nombre} onChange={e => setClientData({...clientData, nombre: e.target.value})} className="h-14 rounded-2xl bg-slate-50 border-none" />
             </div>
             <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">WhatsApp</Label>
                <Input required type="tel" value={clientData.whatsapp} onChange={e => setClientData({...clientData, whatsapp: e.target.value})} className="h-14 rounded-2xl bg-slate-50 border-none" />
             </div>
             <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Email (Opcional)</Label>
                <Input type="email" value={clientData.email} onChange={e => setClientData({...clientData, email: e.target.value})} className="h-14 rounded-2xl bg-slate-50 border-none" />
             </div>
             <Button type="submit" disabled={loading} className="w-full h-16 rounded-2xl bg-[#1A3A52] hover:bg-[#112738] text-white font-black uppercase text-[10px] tracking-[0.2em] mt-4">
               {loading ? "PROCESANDO..." : "ENVIAR SOLICITUD DE OBRA"} <Send className="ml-2 h-4 w-4" />
            </Button>
          </div>
          <div className="bg-primary/5 p-10 rounded-[2.5rem] flex flex-col justify-center border border-primary/5">
             <span className="text-[9px] font-black uppercase tracking-widest text-[#E85D04] block mb-2">Resumen de Inversión</span>
             <p className="text-5xl font-black text-[#1A3A52] tracking-tighter">
                ${financingLabel.total.toLocaleString("es-AR")}
             </p>
             <span className="text-[10px] font-bold text-slate-400 mt-2 uppercase">{financingLabel.label}</span>
          </div>
        </form>
      </div>
    );
  }

  // ---------------------------------------------------------
  // RENDER: VISTA DEL BUILDER PRINCIPAL
  // ---------------------------------------------------------
  return (
    <div id="sistema-cotizador" className="relative group/console max-w-7xl mx-auto pb-20">
      <div className="bg-white/90 backdrop-blur-2xl rounded-[3rem] border border-slate-200/50 shadow-2xl overflow-hidden p-2">
        <div className="grid lg:grid-cols-12 gap-0 overflow-visible">
          
          <div className="lg:col-span-12 xl:col-span-7 p-12 lg:p-16 bg-slate-100/50 rounded-[2.5rem] relative overflow-hidden border border-slate-100 flex flex-col justify-between min-h-[650px]">
            <div className="flex items-center gap-3 z-10">
              <div className="h-3 w-3 bg-[#E85D04] rounded-full animate-pulse shadow-[0_0_15px_rgba(232,93,4,0.5)]"></div>
              <h3 className="text-[11px] font-black uppercase tracking-widest text-[#1A3A52]/60">COTIZADOR DIGITAL VILKMET</h3>
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

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 relative z-10">
              <div className="bg-white/95 p-4 rounded-[1.5rem] border border-slate-100 shadow-xl">
                  <span className="text-[9px] uppercase font-bold text-slate-400 block mb-1">Materia Prima</span>
                  <p className="text-base md:text-sm lg:text-base font-black text-[#1A3A52] tracking-tight">ALUAR {formData.linea}</p>
              </div>
              <div className="bg-white/95 p-4 rounded-[1.5rem] border border-slate-100 shadow-xl">
                  <span className="text-[9px] uppercase font-bold text-slate-400 block mb-1">Área Técnica</span>
                  <p className="text-base md:text-sm lg:text-base font-black text-[#1A3A52] tracking-tight">{formData.ancho} x {formData.alto} MM</p>
              </div>
              <div className="bg-[#E85D04] p-4 rounded-[1.5rem] shadow-xl text-center md:text-left text-white">
                  <span className="text-[9px] uppercase font-bold text-white/50 block mb-1">Cotización Parcial</span>
                  <p className="text-lg md:text-base lg:text-lg font-black tracking-tight">${calculateLocalPrice().toLocaleString("es-AR")}</p>
              </div>
            </div>

            {projectItems.length > 0 && (
              <button 
                onClick={() => setView("project")}
                className="absolute bottom-10 right-10 bg-[#1A3A52] text-white px-10 h-16 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-4 hover:scale-105 transition-all shadow-2xl z-20 border border-white/10"
              >
                Ver Proyecto ({projectItems.length}) <ArrowRight className="h-4 w-4" />
              </button>
            )}
          </div>

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
                      className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all border-2 ${step >= s.id ? 'bg-[#1A3A52] text-white border-[#1A3A52] shadow-lg' : 'bg-white text-slate-200 border-slate-100'}`}
                    >
                      <s.icon className="h-5 w-5" />
                    </button>
                    <span className={`absolute -bottom-8 text-[9px] font-black uppercase tracking-widest ${step === s.id ? 'text-[#1A3A52]' : 'text-slate-600'}`}>{s.label}</span>
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
                        <h3 className="text-4xl font-heading font-black text-[#1A3A52] tracking-tighter uppercase">Perfilería <span className="text-[#E85D04]">Aluar.</span></h3>
                        <div className="grid grid-cols-1 gap-3">
                           {["Herrero", "Modena", "A40", "A40 RPT"].map((l) => (
                             <button 
                              key={l}
                              onClick={() => setFormData({...formData, linea: l as any})}
                              className={`h-16 rounded-2xl border-2 font-black uppercase text-xs tracking-widest transition-all ${formData.linea === l ? 'border-[#E85D04] bg-[#E85D04]/5 text-[#E85D04]' : 'border-slate-300 bg-transparent text-slate-700 hover:border-slate-400'}`}
                             >
                               Línea {l}
                             </button>
                           ))}
                        </div>
                      </div>
                    )}

                    {step === 2 && (
                      <div className="space-y-8">
                        <h3 className="text-4xl font-heading font-black text-[#1A3A52] tracking-tighter uppercase">Tipo <span className="text-[#E85D04]">Apertura.</span></h3>
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
                              className={`flex items-center gap-5 p-5 rounded-2xl border-2 transition-all ${formData.tipologia === tipo.id ? 'border-[#E85D04] bg-[#E85D04]/5' : 'border-slate-600 bg-transparent hover:border-slate-400'}`}
                            >
                              <tipo.icon className={`h-6 w-6 ${formData.tipologia === tipo.id ? 'text-[#E85D04]' : 'text-slate-500'}`} />
                              <span className="text-xs font-black uppercase tracking-widest text-slate-600">{tipo.label}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {step === 3 && (
                      <div className="space-y-8">
                        <h3 className="text-4xl font-heading font-black text-[#1A3A52] tracking-tighter uppercase">Corte <span className="text-[#E85D04]">Milimétrico.</span></h3>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                             <Label className="font-black text-[9px] text-slate-400 uppercase tracking-widest pl-2">Ancho MM</Label>
                             <Input type="number" value={formData.ancho} onChange={(e) => setFormData({...formData, ancho: e.target.value})} className="h-16 rounded-2xl bg-slate-50 border-none font-black text-xl px-6" />
                          </div>
                          <div className="space-y-2">
                             <Label className="font-black text-[9px] text-slate-400 uppercase tracking-widest pl-2">Alto MM</Label>
                             <Input type="number" value={formData.alto} onChange={(e) => setFormData({...formData, alto: e.target.value})} className="h-16 rounded-2xl bg-slate-50 border-none font-black text-xl px-6" />
                          </div>
                        </div>
                      </div>
                    )}

                    {step === 4 && (
                      <div className="space-y-8">
                        <h3 className="text-4xl font-heading font-black text-[#1A3A52] tracking-tighter uppercase">Térmica <span className="text-[#E85D04]">& Color.</span></h3>
                        <div className="space-y-4">
                           <Label className="font-black text-[9px] text-slate-400 uppercase tracking-widest pl-2">Terminación</Label>
                           <div className="grid grid-cols-4 gap-2">
                             {Object.entries(coloresMap).map(([k, hex]) => (
                               <button 
                                 key={k} 
                                 onClick={() => setFormData({...formData, color: k})}
                                 className={`group relative aspect-square rounded-2xl border-2 transition-all overflow-hidden ${formData.color === k ? 'border-[#E85D04]' : 'border-slate-100 hover:border-slate-300'}`}
                               >
                                 <div className="absolute inset-0" style={{backgroundColor: hex}}></div>
                                 {formData.color === k && <div className="absolute inset-0 flex items-center justify-center bg-black/20"><CheckCircle2 className="h-6 w-6 text-white" /></div>}
                               </button>
                             ))}
                           </div>
                        </div>
                        <div className="space-y-4">
                           <Label className="font-black text-[9px] text-slate-400 uppercase tracking-widest pl-2">Cristal</Label>
                           <div className="grid grid-cols-2 gap-3">
                             {["float4", "float5", "float6", "dvh"].map((v) => (
                               <button 
                                 key={v} 
                                 onClick={() => setFormData({...formData, vidrio: v})}
                                 className={`p-4 rounded-2xl border-2 font-black text-[10px] uppercase tracking-widest transition-all ${formData.vidrio === v ? 'border-[#E85D04] bg-[#E85D04]/5 text-[#E85D04]' : 'border-slate-300 bg-transparent text-slate-700 hover:border-slate-400'}`}
                               >
                                 {v === 'dvh' ? 'DVH Térmico' : v}
                               </button>
                             ))}
                           </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="pt-8 border-t border-slate-100 flex justify-between">
                 <Button 
                   onClick={() => setStep(step - 1)} 
                   disabled={step === 1}
                   variant="ghost"
                   className="h-14 px-8 rounded-2xl font-semibold uppercase text-[10px] tracking-[0.2em] text-[#1A3A52] hover:text-[#E85D04] hover:bg-[#1A3A52]/5"
                 >
                   Volver
                 </Button>
                 {step < 4 ? (
                    <Button 
                      onClick={() => setStep(step + 1)}
                      className="h-14 px-10 rounded-2xl bg-[#1A3A52] hover:bg-[#E85D04] text-white font-black uppercase text-[10px] tracking-[0.2em] shadow-xl transition-all hover:scale-105"
                    >
                      Siguiente Fase
                    </Button>
                 ) : (
                    <Button 
                      onClick={addItemToProject}
                      className="h-14 px-10 rounded-2xl bg-[#E85D04] hover:bg-[#c24e03] text-white font-black uppercase text-[10px] tracking-[0.2em] shadow-xl shadow-[#E85D04]/20 transition-all hover:scale-105 animate-pulse"
                    >
                      Agregar Proyecto
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