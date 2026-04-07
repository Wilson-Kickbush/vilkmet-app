import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    margen_rentabilidad: 40,
    porcentaje_mano_obra: 10,
    gastos_administrativos: 5,
    costo_kg_aluar: 10,
    tipo_cambio_blue: 1425
  });
}