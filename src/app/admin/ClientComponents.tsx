"use client";

import { updateLeadStatus, updateLeadNotes } from "./acciones";
import { CheckCircle2 } from "lucide-react";

export function StatusSelector({ leadId, currentStatus }: { leadId: string, currentStatus: string }) {
  return (
    <form action={async (formData) => { await updateLeadStatus(leadId, formData.get("status") as string); }}>
      <select 
        name="status"
        defaultValue={currentStatus || "NUEVO"}
        onChange={(e) => e.target.form?.requestSubmit()}
        className="w-full bg-slate-50 border-none px-6 py-3 rounded-xl text-[10px] font-black uppercase text-[#1A3A52] outline-none cursor-pointer hover:bg-slate-100 transition-colors"
      >
        <option value="NUEVO">NUEVO</option>
        <option value="CONTACTADO">CONTACTADO</option>
        <option value="PRESUPUESTADO">PRESUPUESTADO</option>
        <option value="VENDIDO">🏆 VENDIDO</option>
        <option value="PERDIDO">⚠️ PERDIDO</option>
      </select>
    </form>
  );
}

export function NotesInput({ leadId, initialNotes }: { leadId: string, initialNotes: string }) {
  return (
    <form action={async (formData) => { await updateLeadNotes(leadId, formData.get("notes") as string); }} className="relative group">
      <textarea 
        name="notes"
        defaultValue={initialNotes}
        placeholder="Añadir notas de gestión..."
        onBlur={(e) => {
          if (e.target.value !== initialNotes) {
            e.target.form?.requestSubmit();
          }
        }}
        className="w-full bg-slate-50 border-none p-4 rounded-xl text-sm text-primary/70 focus:ring-1 ring-[#1A3A52]/10 outline-none resize-none min-h-[80px] transition-all"
      />
      <div className="absolute bottom-3 right-3 opacity-20 group-hover:opacity-100 transition-opacity">
         <CheckCircle2 className="w-4 h-4 text-slate-300" />
      </div>
    </form>
  );
}
