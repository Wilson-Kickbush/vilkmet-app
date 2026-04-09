import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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
    const { items, client, paymentMode, totalFinanciado, leadId, quoteId } = body as {
      items: CartItem[];
      client: { nombre: string; whatsapp: string; email?: string };
      paymentMode: string;
      totalFinanciado: number;
      leadId?: string;
      quoteId?: string;
    };

    if (!client?.nombre || !client?.whatsapp || !items || items.length === 0) {
      return NextResponse.json({ error: "Faltan datos críticos para cotizar" }, { status: 400 });
    }

    // 1. OBTENCIÓN DINÁMICA DE PARÁMETROS (Sync with Admin Panel)
    let profitMargin = 40;
    let laborMargin = 10;
    let structureMargin = 5;
    let aluCostPerKg = 10;
    let tipoCambio = 1425;

    try {
      const params = await prisma.systemParameter.findMany();
      const getParam = (key: string, defaultValue: number) => {
        const param = params.find((p: { clave: string; valor: number }) => p.clave === key);
        return param ? param.valor : defaultValue;
      };

      profitMargin = getParam("margen_rentabilidad", 40);
      laborMargin = getParam("porcentaje_mano_obra", 10);
      structureMargin = getParam("gastos_administrativos", 5);
      aluCostPerKg = getParam("costo_kg_aluar", 10);
      tipoCambio = getParam("tipo_cambio_blue", 1425);
    } catch (dbErr) {
      console.error("ALERTA: Usando valores por defecto ante falla de DB:", dbErr);
    }

    // 2. ALGORITMO DE INGENIERÍA VILKMET (Procesador Server-Side)
    const processedItems = items.map((item) => ({
      ...item,
      subtotal: Math.round(Number(item.subtotal))
    }));

    // 3. PERSISTENCIA EN TRANSACCIÓN (Lead -> Quote -> Items)
    try {
      const result = await prisma.$transaction(async (tx) => {
        // Crear lead, cotización e items en una única operación atómica
        const lead = await tx.lead.create({
          data: {
            nombre: client.nombre,
            whatsapp: client.whatsapp,
            email: client.email || null,
            status: "NUEVO",
            quotes: {
              create: {
                status: "nuevo",
                precioFinal: Math.round(Number(totalFinanciado)),
                notasCliente: `Pago: ${paymentMode.toUpperCase()} | Proyecto Multi-Elemento | Gastos Estructura: ${structureMargin}% Incluido`,
                items: {
                  create: processedItems.map((pi) => ({
                    tipo: pi.tipologia.toLowerCase().includes("puerta") ? "puerta" : "ventana",
                    linea: pi.linea,
                    tipologia: pi.tipologia,
                    ancho: Number(pi.ancho),
                    alto: Number(pi.alto),
                    color: pi.color,
                    acristalamiento: pi.vidrio,
                    subtotal: Math.round(Number(pi.subtotal))
                  }))
                }
              }
            }
          },
          include: {
            quotes: {
              include: {
                items: true
              }
            }
          }
        });
        const quote = lead.quotes[0];
        return { leadId: lead.id, quoteId: quote.id };
      });

      return NextResponse.json({ 
        success: true, 
        ...result,
        message: "Proyecto guardado y securizado en CRM VILKMET" 
      }, { status: 200 });

    } catch (prismaErr: any) {
      console.error("FALLO CRÍTICO DE TRANSACCIÓN:", prismaErr);
      return NextResponse.json({ 
        error: "Fallo en la persistencia del CRM", 
        details: prismaErr?.message || "Check server logs" 
      }, { status: 500 });
    }

  } catch (error: any) {
    console.error("ERROR INTERNO DE API:", error);
    return NextResponse.json({ error: "Fallo en el procesador", details: error?.message }, { status: 500 });
  }
}
