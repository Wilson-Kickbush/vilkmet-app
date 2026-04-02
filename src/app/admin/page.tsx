import { prisma } from "@/lib/prisma";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Phone, Mail, Clock, LayoutTemplate, Trash2, CheckCircle2, TrendingUp, Users, DollarSign, MessageSquare } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { updateLeadStatus, updateLeadNotes, deleteLead } from "./acciones";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Revalidate on every request since it's an admin dashboard
export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const leads = await prisma.lead.findMany({
    include: { quotes: true },
    orderBy: { fechaAlta: "desc" }
  });

  const totalLeads = leads.length;
  const pipelineValue = leads.reduce((acc, lead) => 
    acc + lead.quotes.reduce((qAcc, q) => qAcc + q.precioFinal, 0), 0
  );
  const conversionRate = totalLeads > 0 
    ? (leads.filter(l => l.status === "VENDIDO").length / totalLeads) * 100 
    : 0;

  return (
    <div className="space-y-8 pb-20">
      {/* Header Visual Elite */}
      <div className="relative p-8 rounded-3xl bg-primary overflow-hidden shadow-2xl border border-white/10">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h2 className="text-4xl font-heading font-black text-white tracking-widest uppercase">
              Embudo de <span className="text-[#E85D04]">Ventas</span>
            </h2>
            <p className="text-blue-100/60 mt-2 font-medium">Gestión estratégica de prospectos VILKMET.</p>
          </div>
          <div className="text-right">
             <div className="bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-xl">
               <span className="text-[10px] font-black uppercase tracking-widest text-white/50 block mb-1">Última Actualización</span>
               <span className="text-sm font-bold text-white uppercase">{format(new Date(), "PP", { locale: es })}</span>
             </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10 relative z-10">
          <Card className="bg-white/5 border-white/10 backdrop-blur-sm shadow-none">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-3 text-blue-100/60">
                <Users className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-widest">Prospectos Totales</span>
              </div>
            </CardHeader>
            <CardContent>
              <span className="text-3xl font-heading font-black text-white">{totalLeads}</span>
            </CardContent>
          </Card>
          <Card className="bg-white/5 border-white/10 backdrop-blur-sm shadow-none">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-3 text-blue-100/60">
                <DollarSign className="w-4 h-4 text-[#E85D04]" />
                <span className="text-[10px] font-black uppercase tracking-widest">Pipeline Abierto</span>
              </div>
            </CardHeader>
            <CardContent>
              <span className="text-3xl font-heading font-black text-white">${pipelineValue.toLocaleString("es-AR")}</span>
            </CardContent>
          </Card>
          <Card className="bg-white/5 border-white/10 backdrop-blur-sm shadow-none">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-3 text-blue-100/60">
                <TrendingUp className="w-4 h-4 text-green-400" />
                <span className="text-[10px] font-black uppercase tracking-widest">Conversión</span>
              </div>
            </CardHeader>
            <CardContent>
              <span className="text-3xl font-heading font-black text-white">{conversionRate.toFixed(1)}%</span>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {leads.length === 0 ? (
          <div className="col-span-full text-center py-24 bg-white rounded-[2rem] border-2 border-dashed border-slate-200 shadow-inner">
             <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-10 h-10 text-slate-300" />
             </div>
             <h3 className="text-2xl font-heading font-black text-primary uppercase">Sin Actividad Comercial</h3>
             <p className="text-muted-foreground mt-2 font-medium">Los leads del cotizador aparecerán automáticamente.</p>
          </div>
        ) : (
          leads.map(lead => (
            <LeadManagementCard key={lead.id} lead={lead} />
          ))
        )}
      </div>
    </div>
  );
}

function LeadManagementCard({ lead }: { lead: any }) {
  return (
    <Card className="rounded-[2rem] overflow-hidden border-none shadow-xl hover:shadow-2xl transition-all duration-500 group">
      <CardHeader className="p-8 border-b bg-white relative overflow-hidden">
        {/* Indicador de Estado */}
        <div className={`absolute top-0 right-0 px-6 py-2 rounded-bl-2xl font-black text-[10px] uppercase tracking-widest shadow-sm ${
          lead.status === "VENDIDO" ? "bg-green-500 text-white" :
          lead.status === "PERDIDO" ? "bg-red-500 text-white" :
          lead.status === "PRESUPUESTADO" ? "bg-blue-500 text-white" :
          "bg-[#E85D04] text-white"
        }`}>
          {lead.status}
        </div>

        <div className="flex justify-between items-start gap-4 pr-16 text-primary">
          <div>
            <CardTitle className="text-2xl font-heading font-black uppercase tracking-tight leading-none mb-2">
              {lead.nombre}
            </CardTitle>
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
              <Clock className="w-3 h-3 text-[#E85D04]" />
              Entró el {format(new Date(lead.fechaAlta), "PPP", { locale: es })}
            </div>
          </div>
          
          <form action={async () => { "use server"; await deleteLead(lead.id); }}>
            <button className="p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all rounded-xl">
              <Trash2 className="w-5 h-5" />
            </button>
          </form>
        </div>

        <div className="flex flex-wrap gap-4 mt-8">
          <a 
            href={`https://wa.me/${lead.whatsapp.replace(/\D/g, '')}?text=Hola%20${lead.nombre},%20vimos%20tu%20cotización%20en%20VILKMET...`} 
            target="_blank" 
            className="flex items-center gap-3 px-6 py-3 bg-green-50 text-green-600 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-green-100 transition-colors border border-green-200"
          >
            <Phone className="w-4 h-4" /> WhatsApp
          </a>
          <div className="flex-1 min-w-[200px]">
            <LeadStatusSelector leadId={lead.id} currentStatus={lead.status} />
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-8 bg-slate-50/50 space-y-6">
        {/* Listado de Cotizaciones */}
        <div className="space-y-4">
          <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/40 flex items-center gap-2">
            <LayoutTemplate className="w-3 h-3" /> Detalle Arquitectónico
          </h4>
          {lead.quotes.map((quote: any) => (
             <div key={quote.id} className="bg-white border-2 border-slate-100 p-6 rounded-2xl shadow-sm hover:border-accent/20 transition-all">
                <div className="flex justify-between items-center border-b border-slate-50 pb-4 mb-4">
                   <span className="font-heading font-black text-primary text-lg uppercase tracking-tight">{quote.linea}</span>
                   <span className="text-2xl font-heading font-black text-[#E85D04]">${quote.precioFinal.toLocaleString("es-AR")}</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground/80">
                   <div className="space-y-1">
                      <span className="text-accent/60 block">Tipología</span>
                      <span className="text-primary">{quote.tipologia}</span>
                   </div>
                   <div className="space-y-1">
                      <span className="text-accent/60 block">Color</span>
                      <span className="text-primary">{quote.color}</span>
                   </div>
                   <div className="space-y-1">
                      <span className="text-accent/60 block">Medidas</span>
                      <span className="text-primary">{quote.ancho}x{quote.alto} mm</span>
                   </div>
                   <div className="space-y-1">
                      <span className="text-accent/60 block">Vidrio</span>
                      <span className="text-primary">{quote.acristalamiento}</span>
                   </div>
                </div>
             </div>
          ))}
        </div>

        {/* Notas del Admin */}
        <div className="pt-4 border-t border-slate-200/50">
          <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/40 flex items-center gap-2 mb-3">
            <MessageSquare className="w-3 h-3" /> Notas de Wilson
          </h4>
          <LeadNotesInput leadId={lead.id} initialNotes={lead.adminNotes || ""} />
        </div>
      </CardContent>
    </Card>
  );
}

// Subcomponente para el selector de estado
async function LeadStatusSelector({ leadId, currentStatus }: { leadId: string, currentStatus: string }) {
  return (
    <form action={async (formData) => { "use server"; await updateLeadStatus(leadId, formData.get("status") as string); }}>
      <select 
        name="status"
        defaultValue={currentStatus}
        onChange={(e) => e.target.form?.requestSubmit()}
        className="w-full bg-white border-2 border-slate-100 px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-primary focus:border-accent outline-none appearance-none transition-all cursor-pointer shadow-sm"
      >
        <option value="NUEVO">NUEVO</option>
        <option value="CONTACTADO">CONTACTADO</option>
        <option value="PRESUPUESTADO">PRESUPUESTADO</option>
        <option value="VENDIDO">✅ VENDIDO</option>
        <option value="PERDIDO">❌ PERDIDO</option>
      </select>
    </form>
  );
}

// Subcomponente para las notas con Server Action
async function LeadNotesInput({ leadId, initialNotes }: { leadId: string, initialNotes: string }) {
  return (
    <form action={async (formData) => { "use server"; await updateLeadNotes(leadId, formData.get("notes") as string); }} className="relative group">
      <textarea 
        name="notes"
        defaultValue={initialNotes}
        placeholder="Escribe notas sobre la obra..."
        className="w-full bg-white border-2 border-slate-100 p-4 rounded-2xl text-sm text-primary/80 focus:border-accent/40 outline-none transition-all placeholder:text-slate-300 min-h-[100px] resize-none pr-12 shadow-inner"
      />
      <button className="absolute bottom-4 right-4 p-2 bg-slate-50 text-slate-400 hover:text-accent hover:bg-accent/10 rounded-lg transition-all opacity-0 group-focus-within:opacity-100">
        <CheckCircle2 className="w-4 h-4" />
      </button>
    </form>
  );
}
