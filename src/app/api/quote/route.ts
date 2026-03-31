import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { linea, tipologia, ancho, alto, color, vidrio, nombre, whatsapp, email } = body;

    // Validación básica de campos requeridos (Barrera de Conversión)
    if (!nombre || !whatsapp || !ancho || !alto || !linea || !tipologia) {
      return NextResponse.json({ error: "Faltan campos obligatorios" }, { status: 400 });
    }

    // 1. OBTENER PARÁMETROS DEL SISTEMA
    // Aquí consultaríamos a SystemParameter en un sistema real (ej: costo aluminio, ganancia, M.O.)
    // Vamos a usar defaults si no existen
    
    // Obtenemos todos los parámetros para cálculos
    const params = await prisma.systemParameter.findMany();
    const getParam = (key: string, defaultValue: number) => {
      const param = params.find((p: { clave: string; valor: number }) => p.clave === key);
      return param ? param.valor : defaultValue;
    };

    const profitMargin = getParam("margen_rentabilidad", 40); // 40%
    const laborMargin = getParam("porcentaje_mano_obra", 20); // 20%
    const aluCostPerKg = getParam("costo_kg_aluar", 8.5); // USD 8.5/kg por defecto

    // 2. MATEMATICA DE COSTOS
    // Las medidas vienen en MILÍMETROS → convertir a metros
    const anchoM = parseFloat(ancho) / 1000;
    const altoM  = parseFloat(alto)  / 1000;
    const perimetroM = (anchoM + altoM) * 2; // metros lineales
    const areaM2     = anchoM * altoM;        // metros cuadrados

    // Kg de aluminio según línea (kg por metro lineal de perfil)
    let kgPorMetro = 2.0;
    switch (linea) {
      case "Herrero": kgPorMetro = 1.2; break; // perfil liviano
      case "Módena":  kgPorMetro = 1.8; break; // perfil medio
      case "A40":     kgPorMetro = 2.8; break; // perfil pesado
      case "A40 RPT": kgPorMetro = 3.4; break; // perfil RPT con barrera térmica
    }
    const totalKgAlu = perimetroM * kgPorMetro;

    // Costo aluminio en USD
    const costoAluUSD = totalKgAlu * aluCostPerKg;

    // Tipo de cambio (ARS por USD)
    const tipoCambio = getParam("tipo_cambio_blue", 1400);

    // Color: recargo si es anodizado o negro
    const colorMultiplier = (color === "negro" || color === "anodizado") ? 1.15 : 1.0;
    const costoAluARS = costoAluUSD * tipoCambio * colorMultiplier;

    // Costo vidrio en USD/m² → convertir a ARS
    // DVH ~35 USD/m², simple ~12 USD/m² (valores de referencia industria argentina)
    const costoVidrioUSDm2 = vidrio === "dvh" ? 35 : 12;
    const costoVidrioARS   = areaM2 * costoVidrioUSDm2 * tipoCambio;

    // Costo directo total en ARS
    const costoDirecto = costoAluARS + costoVidrioARS;

    // Aplicar mano de obra y margen de rentabilidad
    const precioFinal = costoDirecto * (1 + laborMargin / 100) * (1 + profitMargin / 100);


    // 3. GUARDAR EL LEAD Y LA COTIZACIÓN EN PRISMA
    const lead = await prisma.lead.create({
      data: {
        nombre,
        whatsapp,
        email: email || null,
        quotes: {
          create: {
            linea,
            tipologia,
            ancho: parseFloat(ancho),
            alto: parseFloat(alto),
            color,
            acristalamiento: vidrio,
            precioFinal: Math.round(precioFinal)
          }
        }
      },
      include: {
        quotes: true
      }
    });

    return NextResponse.json({ 
      success: true, 
      precioFinal: Math.round(precioFinal),
      message: "Cotización generada correctamente",
      leadId: lead.id
    }, { status: 200 });

  } catch (error) {
    console.error("Error generating quote:", error);
    return NextResponse.json({ error: "Error interno del servidor generando cotización" }, { status: 500 });
  }
}
