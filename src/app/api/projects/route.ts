import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const projects = await prisma.portfolioProject.findMany({
      orderBy: { created_at: 'desc' },
      take: 6,
    });
    return NextResponse.json(projects);
  } catch (error) {
    console.error("Error en API:", error);
    return NextResponse.json([
      {
        id: "fallback-1",
        title: "Ventana Balcón",
        location: "Lomas de Zamora",
        image_url: "/path/to/placeholder.jpg",
        description: "Obra Realizada por VILKMET"
      }
    ]);
  }
}
