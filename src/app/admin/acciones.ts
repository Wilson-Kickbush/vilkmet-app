"use server";

import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient({ datasourceUrl: process.env.DATABASE_URL || "file:./dev.db" });

export async function upsertParameter(clave: string, valor: number, descripcion: string) {
  try {
    await prisma.systemParameter.upsert({
      where: { clave },
      update: { valor, descripcion },
      create: { clave, valor, descripcion }
    });
    
    // Invalidate the cache for paths that use this
    revalidatePath("/admin/parametros");
    return { success: true };
  } catch (error) {
    console.error("Error upserting param", error);
    return { success: false, error: "Error de base de datos" };
  }
}
