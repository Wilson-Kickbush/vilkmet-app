"use client";

import { useState, useEffect } from "react";
import { 
  Send, 
  CheckCircle2, 
  Trash2, 
  CreditCard, 
  Wallet, 
  Maximize2,
  Settings2,
  Layout,
  Layers,
  ArrowRight,
  DoorOpen,
  RefreshCw,
  FileText,
  MessageCircle,
  Mail,
  Download,
  Share2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Document, 
  Page, 
  Text, 
  View, 
  StyleSheet, 
  PDFDownloadLink,
  Font 
} from '@react-pdf/renderer';
import { SimuladorVisual } from "./SimuladorVisual";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

interface ProjectItem {
  id: string;
  linea: string;
  tipologia: string;
  ancho: number;
  alto: number;
  color: string;
  vidrio: string;
  subtotal: number;
}

interface SystemParams {
  margen_rentabilidad: number;
  porcentaje_mano_obra: number;
  gastos_administrativos: number;
  costo_kg_aluar: number;
  tipo_cambio_blue: number;
}

interface PresupuestoPDFProps {
  clientData: {
    nombre: string;
    whatsapp: string;
    email?: string;
  };
  projectItems: ProjectItem[];
  paymentMode: string;
  financingDetails: {
    label: string;
    total: number;
    subtotal: number;
    cuota?: number;
  };
}

// Estilos para el PDF
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 30,
    borderBottom: 2,
    borderBottomColor: '#1A3A52',
    paddingBottom: 20,
  },
  title: {
    fontSize: 24,
    color: '#1A3A52',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
  },
  clientInfo: {
    marginBottom: 25,
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 5,
  },
  sectionTitle: {
    fontSize: 16,
    color: '#1A3A52',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  text: {
    fontSize: 12,
    marginBottom: 5,
  },
  itemsSection: {
    marginBottom: 25,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  itemText: {
    fontSize: 12,
    flex: 3,
  },
  itemPrice: {
    fontSize: 12,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'right',
  },
  summary: {
    backgroundColor: '#f0f7ff',
    padding: 20,
    borderRadius: 5,
    marginBottom: 30,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 13,
    color: '#555',
  },
  summaryValue: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  totalRow: {
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 2,
    borderTopColor: '#1A3A52',
  },
  totalLabel: {
    fontSize: 16,
    color: '#1A3A52',
    fontWeight: 'bold',
  },
  totalValue: {
    fontSize: 18,
    color: '#E85D04',
    fontWeight: 'bold',
  },
  footer: {
    marginTop: 40,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    textAlign: 'center',
  },
  footerText: {
    fontSize: 10,
    color: '#666',
    textAlign: 'center',
    marginBottom: 3,
  },
  footerNote: {
    fontSize: 9,
    color: '#999',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 10,
  },
});

// Componente para el PDF
const PresupuestoPDF = ({ 
  clientData, 
  projectItems, 
  paymentMode, 
  financingDetails 
}: PresupuestoPDFProps) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.title}>VILKMET - Presupuesto Técnico</Text>
        <Text style={styles.subtitle}>Sistemas de Aluminio de Alta Performance</Text>
      </View>

      <View style={styles.clientInfo}>
        <Text style={styles.sectionTitle}>Información del Cliente</Text>
        <Text style={styles.text}>Nombre: {clientData.nombre}</Text>
        <Text style={styles.text}>WhatsApp: {clientData.whatsapp}</Text>
        {clientData.email && <Text style={styles.text}>Email: {clientData.email}</Text>}
        <Text style={styles.text}>Fecha: {new Date().toLocaleDateString('es-AR')}</Text>
      </View>

      <View style={styles.itemsSection}>
        <Text style={styles.sectionTitle}>Detalle del Proyecto</Text>
        {projectItems.map((item, index) => (
          <View key={index} style={styles.itemRow}>
            <Text style={styles.itemText}>
              {item.linea} - {item.tipologia} ({item.ancho}x{item.alto}mm)
            </Text>
            <Text style={styles.itemPrice}>
              ${item.subtotal.toLocaleString('es-AR')}
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.summary}>
        <Text style={styles.sectionTitle}>Resumen Financiero</Text>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Subtotal:</Text>
          <Text style={styles.summaryValue}>
            ${financingDetails.subtotal.toLocaleString('es-AR')}
          </Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Modalidad:</Text>
          <Text style={styles.summaryValue}>{financingDetails.label}</Text>
        </View>
        {financingDetails.cuota && (
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Cuota mensual:</Text>
            <Text style={styles.summaryValue}>
              ${Math.round(financingDetails.cuota).toLocaleString('es-AR')}
            </Text>
          </View>
        )}
        <View style={[styles.summaryRow, styles.totalRow]}>
          <Text style={styles.totalLabel}>TOTAL FINAL:</Text>
          <Text style={styles.totalValue}>
            ${financingDetails.total.toLocaleString('es-AR')}
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          VILKMET - Sistemas de Aluminio de Alta Performance
        </Text>
        <Text style={styles.footerText}>
          Contacto: +54 9 11 1234-5678 | info@vilkmet.com
        </Text>
        <Text style={styles.footerNote}>
          Este presupuesto tiene validez por 30 días
        </Text>
      </View>
    </Page>
  </Document>
);

// Componente para opciones de exportación
function ExportOptions({ 
  clientData, 
  projectItems, 
  paymentMode, 
  financingDetails 
}: PresupuestoPDFProps) {
  const handleWhatsAppShare = () => {
    const message = `¡Hola ${clientData.nombre}! Te comparto tu presupuesto VILKMET:\n\n` +
                   `Proyecto: ${projectItems.length} elementos\n` +
                   `Total: $${financingDetails.total.toLocaleString('es-AR')}\n` +
                   `Modalidad: ${financingDetails.label}\n\n` +
                   `Pronto nos pondremos en contacto para asesorarte con tu proyecto.`;
    
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${clientData.whatsapp.replace(/\D/g, '')}?text=${encodedMessage}`, '_blank');
  };

  const handleEmailShare = () => {
    const subject = `Presupuesto VILKMET - ${clientData.nombre}`;
    const body = `Estimado/a ${clientData.nombre},\n\n` +
                `Adjunto encontrarás tu presupuesto detallado de VILKMET.\n\n` +
                `Resumen:\n` +
                `- Proyecto: ${projectItems.length} elementos\n` +
                `- Total: $${financingDetails.total.toLocaleString('es-AR')}\n` +
                `- Modalidad: ${financingDetails.label}\n\n` +
                `Nuestro equipo se pondrá en contacto contigo en breve para asesorarte con tu proyecto.\n\n` +
                `Saludos cordiales,\n` +
                `Equipo VILKMET`;
    
    window.open(`mailto:${clientData.email || ''}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, '_blank');
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
      <PDFDownloadLink
        document={
          <PresupuestoPDF 
            clientData={clientData}
            projectItems={projectItems}
            paymentMode={paymentMode}
            financingDetails={financingDetails}
          />
        }
        fileName={'Presupuesto_VILKMET.pdf'}
        style={{
          textDecoration: 'none',
        }}
      >
        <Button 
          variant="outline" 
          className="h-14 flex-1 bg-white text-primary border-primary hover:bg-primary hover:text-white transition-all"
        >
          <FileText className="w-5 h-5 mr-3" />
          Descargar PDF
        </Button>
      </PDFDownloadLink>

      <Button 
        onClick={handleWhatsAppShare}
        variant="outline"
        className="h-14 flex-1 bg-green-50 text-green-700 border-green-200 hover:bg-green-100 hover:text-green-800 transition-all"
      >
        <MessageCircle className="w-5 h-5 mr-3" />
        Enviar por WhatsApp
      </Button>

      <Button 
        onClick={handleEmailShare}
        variant="outline"
        className="h-14 flex-1 bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 hover:text-blue-800 transition-all"
      >
        <Mail className="w-5 h-5 mr-3" />
        Enviar por Email
      </Button>
    </div>
  );
}
