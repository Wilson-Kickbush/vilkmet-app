import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

interface CartItem {
  linea: string;
  tipologia: string;
  ancho: number;
  alto: number;
  color: string;
  vidrio: string;
  subtotal: number;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { items, totalFinanciado, paymentMode = "contado", leadId, quoteId, nombre, whatsapp } = body as {
      items: CartItem[];
      totalFinanciado?: number;
      paymentMode?: string;
      leadId?: string;
      quoteId?: string;
      nombre?: string;
      whatsapp?: string;
    };

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "No hay items para guardar" }, { status: 400 });
    }

    // Calcular total si no viene
    const total = totalFinanciado ?? items.reduce((acc, item) => acc + item.subtotal, 0);

    // Determinar si se proporcionaron datos de contacto
    const contactProvided = (nombre && nombre.trim() !== "") || (whatsapp && whatsapp.trim() !== "");

    let finalLeadId = leadId;
    let finalQuoteId = quoteId;
    let isUpdate = false;

    // Si tenemos leadId y quoteId, intentar actualizar la cotización existente
    if (leadId && quoteId) {
      // Verificar que existan y pertenezcan al mismo lead
      const existingLead = await prisma.lead.findUnique({ where: { id: leadId } });
      const existingQuote = await prisma.quote.findUnique({ where: { id: quoteId } });
      if (existingLead && existingQuote && existingQuote.leadId === leadId) {
        // Eliminar items anteriores
        await prisma.quoteItem.deleteMany({ where: { quoteId } });
        // Actualizar la cotización
        await prisma.quote.update({
          where: { id: quoteId },
          data: {
            precioFinal: Math.round(total),
            notasCliente: `[EARLY] Pago: ${paymentMode.toUpperCase()} | Actualizado automáticamente`,
          }
        });
        // Actualizar datos del lead si se proporcionó contacto
        if (contactProvided) {
          await prisma.lead.update({
            where: { id: leadId },
            data: {
              ...(nombre && nombre.trim() !== "" && { nombre: nombre.trim() }),
              ...(whatsapp && whatsapp.trim() !== "" && { whatsapp: whatsapp.trim() }),
              status: "PENDIENTE_CONTACTO",
            }
          });
        }
        isUpdate = true;
      } else {
        // IDs inválidos, ignorarlos y crear nuevo lead
        console.warn("Lead o Quote inválidos, creando nuevo lead");
        // Resetear IDs para que se cree nuevo lead
        finalLeadId = undefined;
        finalQuoteId = undefined;
      }
    }

    // Si no es update, crear nuevo lead
    if (!isUpdate) {
      // Crear nuevo lead con datos temporales o reales
      const lead = await prisma.lead.create({
        data: {
          nombre: nombre && nombre.trim() !== "" ? nombre.trim() : "COTIZACIÓN TEMPORAL",
          whatsapp: whatsapp && whatsapp.trim() !== "" ? whatsapp.trim() : "0000000000",
          email: null,
          status: contactProvided ? "PENDIENTE_CONTACTO" : "ABANDONADO_PRECOZ",
        }
      });
      finalLeadId = lead.id;

      // Crear la cotización vinculada
      const quote = await prisma.quote.create({
        data: {
          leadId: lead.id,
          status: "abandonado_precoz",
          precioFinal: Math.round(total),
          notasCliente: `[EARLY] Pago: ${paymentMode.toUpperCase()} | Guardado automático desde cotizador`,
          items: {
            create: items.map((item) => ({
              tipo: item.tipologia.toLowerCase().includes("puerta") ? "puerta" : "ventana",
              linea: item.linea,
              tipologia: item.tipologia,
              ancho: Number(item.ancho),
              alto: Number(item.alto),
              color: item.color,
              acristalamiento: item.vidrio,
              subtotal: Math.round(Number(item.subtotal))
            }))
          }
        }
      });
      finalQuoteId = quote.id;
    }

    // Si es update, crear los nuevos items
    if (isUpdate) {
      await prisma.quoteItem.createMany({
        data: items.map((item) => ({
          quoteId: finalQuoteId!,
          tipo: item.tipologia.toLowerCase().includes("puerta") ? "puerta" : "ventana",
          linea: item.linea,
          tipologia: item.tipologia,
          ancho: Number(item.ancho),
          alto: Number(item.alto),
          color: item.color,
          acristalamiento: item.vidrio,
          subtotal: Math.round(Number(item.subtotal))
        }))
      });
    }

    revalidatePath('/admin');

    return NextResponse.json({
      success: true, 
      leadId: finalLeadId,
      quoteId: finalQuoteId,
      message: isUpdate 
        ? "Cotización temporal actualizada" 
        : "Cotización temporal guardada como ABANDONADO_PRECOZ" 
    }, { status: 200 });

  } catch (error: any) {
    console.error("Error en early quote:", error);
    return NextResponse.json({ 
      error: "Fallo al guardar cotización temporal", 
      details: error?.message || "Check server logs" 
    }, { status: 500 });
  }
}