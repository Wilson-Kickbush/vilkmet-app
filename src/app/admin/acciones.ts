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

export async function cleanOldAbandonedCarts() {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const result = await prisma.lead.deleteMany({
      where: {
        status: "ABANDONADO_PRECOZ",
        fechaAlta: { lt: thirtyDaysAgo }
      }
    });
    revalidatePath("/admin");
    return { success: true, deletedCount: result.count };
  } catch (error) {
    console.error("Error cleaning old abandoned carts", error);
    return { success: false, error: "Error de base de datos" };
  }
}

export async function fetchActiveLeads() {
  try {
    const leads = await prisma.lead.findMany({
      where: {
        OR: [
          { status: "NUEVO" },
          { status: "COTIZADO" },
          { status: "SEGUIMIENTO" }
        ]
      },
      include: {
        quotes: {
          include: {
            items: true
          }
        }
      },
      orderBy: {
        fechaAlta: "desc"
      }
    });
    return { success: true, leads };
  } catch (error) {
    console.error("Error fetching leads", error);
    return { success: false, error: "Error de base de datos" };
  }
}

export async function fetchLeadWithQuote(leadId: string) {
  try {
    const lead = await prisma.lead.findUnique({
      where: { id: leadId },
      include: {
        quotes: {
          include: {
            items: true
          }
        }
      }
    });
    if (!lead) {
      return { success: false, error: "Lead no encontrado" };
    }
    return { success: true, lead };
  } catch (error) {
    console.error("Error fetching lead", error);
    return { success: false, error: "Error de base de datos" };
  }
}
