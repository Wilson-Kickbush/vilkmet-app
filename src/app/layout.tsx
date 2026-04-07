import type { Metadata } from "next";
import { Inter, Montserrat } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://vilkmet.com'),
  title: "Vilkmet | Aberturas de Aluminio de Alta Prestación",
  description: "Cotizador online de aberturas de aluminio de alta prestación. Instalaciones reales con calidad premium. Líneas Herrero, Módena, A40 y más.",
  openGraph: {
    type: "website",
    locale: "es_AR",
    url: "https://vilkmet.com",
    title: "Vilkmet | Aberturas de Aluminio de Alta Prestación",
    description: "Cotizador online de aberturas de aluminio de alta prestación. Instalaciones reales con calidad premium. Líneas Herrero, Módena, A40 y más.",
    siteName: "Vilkmet",
    images: [
      {
        url: "/projects/obra-real-1.jpg",
        width: 1200,
        height: 630,
        alt: "Instalación real de aberturas de aluminio Vilkmet",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Vilkmet | Aberturas de Aluminio de Alta Prestación",
    description: "Cotizador online de aberturas de aluminio de alta prestación. Instalaciones reales con calidad premium.",
    images: ["/projects/obra-real-1.jpg"],
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${inter.variable} ${montserrat.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
