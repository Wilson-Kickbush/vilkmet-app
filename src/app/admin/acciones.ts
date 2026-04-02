"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";


export async function upsertParameter(clave: string, valor: number, descripcion: string) {
  try {
    await prisma.systemParameter.upsert({
      where: { clave },
      update: { valor, descripcion },
      create: { clave, valor, descripcion }
    });
    
    revalidatePath("/admin/parametros");
    return { success: true };
  } catch (error) {
    console.error("Error upserting param", error);
    return { success: false, error: "Error de base de datos" };
  }
}

export async function updateLeadStatus(id: string, status: string) {
  try {
    await prisma.lead.update({
      where: { id },
      data: { status }
    });
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Error updating status", error);
    return { success: false };
  }
}

export async function updateLeadNotes(id: string, adminNotes: string) {
  try {
    await prisma.lead.update({
      where: { id },
      data: { adminNotes }
    });
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Error updating notes", error);
    return { success: false };
  }
}

export async function deleteLead(id: string) {
  try {
    await prisma.lead.delete({
      where: { id }
    });
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Error deleting lead", error);
    return { success: false };
  }
}
