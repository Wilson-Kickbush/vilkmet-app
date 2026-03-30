import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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
      const param = params.find(p => p.clave === key);
      return param ? param.valor : defaultValue;
    };

    const profitMargin = getParam("margen_rentabilidad", 40); // 40%
    const laborMargin = getParam("porcentaje_mano_obra", 20); // 20%
    const aluCostPerKg = getParam("costo_kg_aluar", 8.5); // USD 8.5/kg por defecto

    // 2. MATEMATICA DE COSTOS
    // Simplificación de cálculo de peso por metro (simulado según línea)
    let kgsMetrosLineales = 0;
    const perimetro = (parseFloat(ancho) + parseFloat(alto)) * 2; // en metros

    switch (linea) {
      case "Herrero": kgsMetrosLineales = perimetro * 1.5; break; // 1.5kg por metro
      case "Módena": kgsMetrosLineales = perimetro * 2.2; break; // 2.2kg por metro
      case "A40": kgsMetrosLineales = perimetro * 3.5; break; // 3.5kg por metro
      case "A40 RPT": kgsMetrosLineales = perimetro * 4.2; break; 
      default: kgsMetrosLineales = perimetro * 2.0;
    }

    // Calcular costo vidrio
    let costVidrioM2 = vidrio === "dvh" ? 45000 : 15000; // Pesos ARS aprox
    const area = parseFloat(ancho) * parseFloat(alto);
    const totalVidrio = area * costVidrioM2;

    // Supongamos que el Alu Cost está en USD. Precio Aluminio * Tipo de Cambio
    const tipoCambio = getParam("tipo_cambio_blue", 1000); // 1000 ARS/USD
    const costoAluminioBase = (kgsMetrosLineales * aluCostPerKg) * tipoCambio;

    // Color (Recargo si es Anodizado o Negro)
    let colorMultiplier = 1.0;
    if (color === "negro" || color === "anodizado") colorMultiplier = 1.15;

    // Total Costo Directo
    const costoDirecto = (costoAluminioBase * colorMultiplier) + totalVidrio;

    // Agregar Mano de Obra y Rentabilidad
    const precioFinal = costoDirecto * (1 + (laborMargin / 100)) * (1 + (profitMargin / 100));

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
