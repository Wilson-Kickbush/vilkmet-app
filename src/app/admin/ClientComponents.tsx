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
        className="w-full bg-white border border-slate-300 px-4 py-3 rounded-lg text-sm font-semibold text-slate-800 outline-none cursor-pointer hover:border-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
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
        className="w-full bg-white border border-slate-300 p-4 rounded-lg text-sm text-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none min-h-[80px] transition-all"
      />
      <div className="absolute bottom-3 right-3 opacity-40 group-hover:opacity-100 transition-opacity">
         <CheckCircle2 className="w-4 h-4 text-slate-400" />
      </div>
    </form>
  );
}
