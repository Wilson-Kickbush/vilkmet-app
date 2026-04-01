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
    const { items, client, paymentMode, totalFinanciado } = body as {
      items: CartItem[];
      client: { nombre: string; whatsapp: string; email?: string };
      paymentMode: string;
      totalFinanciado: number;
    };

    if (!client?.nombre || !client?.whatsapp || !items || items.length === 0) {
      return NextResponse.json({ error: "Faltan datos del cliente o productos" }, { status: 400 });
    }

    // 1. OBTENER PARÁMETROS DEL SISTEMA
    const params = await prisma.systemParameter.findMany();
    const getParam = (key: string, defaultValue: number) => {
      const param = params.find((p: { clave: string; valor: number }) => p.clave === key);
      return param ? param.valor : defaultValue;
    };

    const profitMargin = getParam("margen_rentabilidad", 40);
    const laborMargin = getParam("porcentaje_mano_obra", 20);
    const aluCostPerKg = getParam("costo_kg_aluar", 8.5);
    const tipoCambio = getParam("tipo_cambio_blue", 1400);

    // 2. PROCESAR CADA ÍTEM Y CALCULAR PRECIOS REALES EN SERVER
    const processedItems = items.map((item) => {
      const anchoM = item.ancho / 1000;
      const altoM  = item.alto / 1000;
      const perimetroM = (anchoM + altoM) * 2;
      const areaM2     = anchoM * altoM;

      let kgPorMetro = 1.8;
      switch (item.linea) {
        case "Herrero": kgPorMetro = 1.2; break;
        case "Módena":  kgPorMetro = 1.8; break;
        case "A40":     kgPorMetro = 2.8; break;
        case "A40 RPT": kgPorMetro = 3.4; break;
      }

      const costoAluUSD = perimetroM * kgPorMetro * aluCostPerKg;
      const colorMultiplier = (item.color === "negro" || item.color === "anodizado") ? 1.15 : 1.0;
      const costoAluARS = costoAluUSD * tipoCambio * colorMultiplier;

      const costoVidrioUSDm2 = item.vidrio === "dvh" ? 35 : 12;
      const costoVidrioARS   = areaM2 * costoVidrioUSDm2 * tipoCambio;

      const costoDirecto = costoAluARS + costoVidrioARS;
      const subtotalBase = costoDirecto * (1 + laborMargin / 100) * (1 + profitMargin / 100);

      return {
        ...item,
        subtotal: Math.round(subtotalBase)
      };
    });

    // 3. PERSISTENCIA EN TRANSACCIÓN (Lead -> Quote -> Items)
    const result = await prisma.$transaction(async (tx) => {
      const lead = await tx.lead.create({
        data: {
          nombre: client.nombre,
          whatsapp: client.whatsapp,
          email: client.email || null,
        }
      });

      const quote = await tx.quote.create({
        data: {
          leadId: lead.id,
          precioFinal: totalFinanciado,
          // Guardamos el modo de pago en las notas para referencia del admin
          notasCliente: `Modo de Pago elegido: ${paymentMode.toUpperCase()}`,
          items: {
            create: processedItems.map((pi) => ({
              tipo: pi.tipologia.includes("puerta") ? "puerta" : "ventana",
              linea: pi.linea,
              tipologia: pi.tipologia,
              ancho: pi.ancho,
              alto: pi.alto,
              color: pi.color,
              acristalamiento: pi.vidrio,
              subtotal: pi.subtotal
            }))
          }
        }
      });

      return { leadId: lead.id, quoteId: quote.id };
    });

    return NextResponse.json({ 
      success: true, 
      ...result,
      message: "Proyecto guardado y presupuesto generado" 
    }, { status: 200 });

  } catch (error) {
    console.error("Error saving project:", error);
    return NextResponse.json({ error: "Error interno procesando el proyecto" }, { status: 500 });
  }
}
