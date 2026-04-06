"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// Tipos para las transacciones
export interface TransactionInput {
  tipo: "INGRESO" | "EGRESO";
  categoria: string;
  descripcion: string;
  monto: number;
  fecha: Date;
}

export interface InventoryItemInput {
  nombre: string;
  tipo: "PROFILE" | "GLASS" | "COMPONENT";
  cantidad: number;
  unidad: string;
  stockMinimo: number;
  proveedor: string;
  costoUnitario?: number;
  ubicacion?: string;
}

/**
 * Obtiene todas las transacciones financieras
 */
export async function getTransactions() {
  try {
    const transactions = await prisma.transaction.findMany({
      orderBy: {
        fecha: "desc"
      },
      take: 50 // Limitar a las últimas 50 transacciones
    });
    
    return transactions;
  } catch (error) {
    console.error("Error al obtener transacciones:", error);
    throw new Error("No se pudieron cargar las transacciones");
  }
}

/**
 * Crea una nueva transacción financiera
 */
export async function createTransaction(data: TransactionInput) {
  try {
    // Validar datos básicos
    if (!data.tipo || !data.categoria || !data.descripcion || !data.monto || !data.fecha) {
      throw new Error("Todos los campos son requeridos");
    }

    if (data.monto <= 0) {
      throw new Error("El monto debe ser mayor a 0");
    }

    // Calcular mes y año a partir de la fecha
    const fechaDate = new Date(data.fecha);
    const mes = fechaDate.getMonth() + 1; // getMonth() devuelve 0-11, sumamos 1 para 1-12
    const anio = fechaDate.getFullYear();

    const transaction = await prisma.transaction.create({
      data: {
        tipo: data.tipo,
        categoria: data.categoria,
        descripcion: data.descripcion,
        monto: data.monto,
        fecha: data.fecha,
        mes: mes,
        anio: anio,
      }
    });

    // Revalidar la página de finanzas para mostrar los nuevos datos
    revalidatePath("/admin/finanzas");
    
    return transaction;
  } catch (error) {
    console.error("Error al crear transacción:", error);
    throw new Error("No se pudo crear la transacción");
  }
}

/**
 * Obtiene todos los items del inventario
 */
export async function getInventory() {
  try {
    const inventory = await prisma.inventory.findMany({
      orderBy: {
        nombre: "asc"
      }
    });
    
    return inventory;
  } catch (error) {
    console.error("Error al obtener inventario:", error);
    throw new Error("No se pudieron cargar los items del inventario");
  }
}

/**
 * Crea un nuevo item en el inventario
 */
export async function createInventoryItem(data: InventoryItemInput) {
  try {
    // Validar datos básicos
    if (!data.nombre || !data.tipo || !data.cantidad || !data.unidad || !data.stockMinimo || !data.proveedor) {
      throw new Error("Todos los campos requeridos deben ser completados");
    }

    if (data.cantidad < 0) {
      throw new Error("La cantidad no puede ser negativa");
    }

    if (data.stockMinimo < 0) {
      throw new Error("El stock mínimo no puede ser negativo");
    }

    const inventoryItem = await prisma.inventory.create({
      data: {
        nombre: data.nombre,
        tipo: data.tipo,
        cantidad: data.cantidad,
        unidad: data.unidad,
        stockMinimo: data.stockMinimo,
        proveedor: data.proveedor,
        costoUnitario: data.costoUnitario || 0,
        ubicacion: data.ubicacion || "",
      }
    });

    // Revalidar la página de finanzas para mostrar los nuevos datos
    revalidatePath("/admin/finanzas");
    
    return inventoryItem;
  } catch (error) {
    console.error("Error al crear item de inventario:", error);
    throw new Error("No se pudo crear el item del inventario");
  }
}

/**
 * Ajusta el stock de un item (suma o resta)
 */
export async function adjustStock(id: string, delta: number) {
  try {
    // Obtener el item actual
    const currentItem = await prisma.inventory.findUnique({
      where: { id }
    });

    if (!currentItem) {
      throw new Error("Item no encontrado");
    }

    const nuevaCantidad = currentItem.cantidad + delta;
    
    if (nuevaCantidad < 0) {
      throw new Error("La cantidad resultante no puede ser negativa");
    }

    const updatedItem = await prisma.inventory.update({
      where: { id },
      data: { cantidad: nuevaCantidad }
    });

    // Revalidar la página de finanzas para mostrar los nuevos datos
    revalidatePath("/admin/finanzas");
    
    return updatedItem;
  } catch (error) {
    console.error("Error al ajustar stock:", error);
    throw new Error("No se pudo ajustar el stock");
  }
}

/**
 * Actualiza la cantidad de un item en el inventario
 */
export async function updateInventoryQuantity(id: string, nuevaCantidad: number) {
  try {
    if (nuevaCantidad < 0) {
      throw new Error("La cantidad no puede ser negativa");
    }

    const updatedItem = await prisma.inventory.update({
      where: { id },
      data: { cantidad: nuevaCantidad }
    });

    // Revalidar la página de finanzas para mostrar los nuevos datos
    revalidatePath("/admin/finanzas");
    
    return updatedItem;
  } catch (error) {
    console.error("Error al actualizar cantidad:", error);
    throw new Error("No se pudo actualizar la cantidad");
  }
}

/**
 * Elimina una transacción
 */
export async function deleteTransaction(id: number) {
  try {
    await prisma.transaction.delete({
      where: { id: String(id) } // <-- ¡AQUÍ ESTÁ LA MAGIA!
    });

    // Revalidar la página de finanzas para mostrar los nuevos datos
    revalidatePath("/admin/finanzas");
    
    return { success: true };
  } catch (error) {
    console.error("Error al eliminar transacción:", error);
    throw new Error("No se pudo eliminar la transacción");
  }
}

/**
 * Elimina un item del inventario
 */
export async function deleteInventoryItem(id: string) {
  try {
    await prisma.inventory.delete({
      where: { id }
    });

    // Revalidar la página de finanzas para mostrar los nuevos datos
    revalidatePath("/admin/finanzas");
    
    return { success: true };
  } catch (error) {
    console.error("Error al eliminar item de inventario:", error);
    throw new Error("No se pudo eliminar el item del inventario");
  }
}