"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { fetchActiveLeads, fetchLeadWithQuote } from "../acciones";
import { FileText, Mail, MessageSquare, Printer, Plus, Trash2 } from "lucide-react";

type Lead = {
  id: string;
  nombre: string;
  whatsapp: string;
  email?: string;
  status: string;
  quotes: Quote[];
};

type Quote = {
  id: string;
  linea: string;
  tipologia: string;
  ancho: number;
  alto: number;
  color: string;
  acristalamiento: string;
  precioFinal: number;
  items: QuoteItem[];
};

type QuoteItem = {
  id: string;
  tipo: string;
  linea: string;
  tipologia: string;
  ancho: number;
  alto: number;
  color: string;
  acristalamiento: string;
  cantidad: number;
  subtotal: number;
};

type OrderItem = {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
};

export function ProformaGenerator() {
  // State for leads and selection
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selectedLeadId, setSelectedLeadId] = useState<string>("");
  const [loadingLeads, setLoadingLeads] = useState(true);

  // Customer data (editable)
  const [customerData, setCustomerData] = useState({
    nombre: "",
    dniCuit: "",
    direccion: "",
    telefono: "",
    email: "",
  });

  // Order items
  const [orderItems, setOrderItems] = useState<OrderItem[]>([
    { id: "1", description: "", quantity: 1, unitPrice: 0, subtotal: 0 },
  ]);

  // Commercial terms
  const [commercialTerms, setCommercialTerms] = useState({
    instalacionFlete: 0,
    anticipoPorcentaje: 30,
    tiempoEntrega: "15 días hábiles",
    validezOferta: "30 días",
  });

  // Legal text
  const [legalText, setLegalText] = useState(`GARANTÍA ALUAR: Todos los perfiles de aluminio utilizados son de marca ALUAR, con certificación de origen y garantía de 10 años contra defectos de fabricación. La garantía no cubre daños por mal uso, instalación incorrecta o desastres naturales.`);

  // Fetch leads on mount
  useEffect(() => {
    async function loadLeads() {
      setLoadingLeads(true);
      const result = await fetchActiveLeads();
      if (result.success) {
        setLeads(result.leads as Lead[]);
      } else {
        console.error("Error loading leads:", result.error);
      }
      setLoadingLeads(false);
    }
    loadLeads();
  }, []);

  // When a lead is selected, auto‑fill customer data and populate order items
  useEffect(() => {
    if (!selectedLeadId) return;
    async function loadLead() {
      const result = await fetchLeadWithQuote(selectedLeadId);
      if (result.success && result.lead) {
        const lead = result.lead as Lead;
        // Fill customer data
        setCustomerData({
          nombre: lead.nombre,
          dniCuit: "",
          direccion: "",
          telefono: lead.whatsapp,
          email: lead.email || "",
        });
        // Convert quote items to order items
        const items: OrderItem[] = [];
        lead.quotes.forEach(quote => {
          quote.items.forEach(item => {
            items.push({
              id: item.id,
              description: `${item.tipo} ${item.linea} - ${item.tipologia} ${item.ancho}x${item.alto}mm ${item.color} ${item.acristalamiento}`,
              quantity: item.cantidad,
              unitPrice: item.subtotal / item.cantidad,
              subtotal: item.subtotal,
            });
          });
        });
        if (items.length > 0) {
          setOrderItems(items);
        } else {
          // If no items, keep at least one empty row
          setOrderItems([{ id: "1", description: "", quantity: 1, unitPrice: 0, subtotal: 0 }]);
        }
      }
    }
    loadLead();
  }, [selectedLeadId]);

  // Handlers for order items
  const updateOrderItem = (id: string, field: keyof OrderItem, value: string | number) => {
    setOrderItems(prev =>
      prev.map(item => {
        if (item.id === id) {
          const updated = { ...item, [field]: value };
          // Recalculate subtotal if quantity or unitPrice changes
          if (field === "quantity" || field === "unitPrice") {
            updated.subtotal = updated.quantity * updated.unitPrice;
          }
          return updated;
        }
        return item;
      })
    );
  };

  const addOrderItem = () => {
    const newId = (orderItems.length + 1).toString();
    setOrderItems([...orderItems, { id: newId, description: "", quantity: 1, unitPrice: 0, subtotal: 0 }]);
  };

  const removeOrderItem = (id: string) => {
    if (orderItems.length === 1) return; // keep at least one row
    setOrderItems(orderItems.filter(item => item.id !== id));
  };

  // Calculations
  const subtotal = orderItems.reduce((sum, item) => sum + item.subtotal, 0);
  const instalacionFlete = commercialTerms.instalacionFlete;
  const totalSinAnticipo = subtotal + instalacionFlete;
  const anticipo = totalSinAnticipo * (commercialTerms.anticipoPorcentaje / 100);
  const saldo = totalSinAnticipo - anticipo;

  // Print functionality
  const handlePrint = () => {
    window.print();
  };

  // Email share
  const handleEmailShare = () => {
    const subject = "Presupuesto Oficial Vilkmet";
    const body = `Hola ${customerData.nombre}, adjunto la proforma detallada.\n\n${window.location.href}`;
    window.open(`mailto:${customerData.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
  };

  // WhatsApp share
  const handleWhatsAppShare = () => {
    const message = `Hola ${customerData.nombre}, te comparto la proforma oficial de VILKMET. Puedes revisarla aquí: ${window.location.href}`;
    window.open(`https://wa.me/${customerData.telefono.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`, "_blank");
  };

  return (
    <div className="space-y-8">
      {/* Print‑only document (hidden on screen) */}
      <div className="print-only hidden">
        <div className="print-container">
          <div className="print-logo">
            <h1>VILKMET</h1>
            <p className="text-sm">Aberturas de Aluminio ALUAR – Cotización Oficial</p>
          </div>
          
          <div className="print-section">
            <h2 className="text-lg font-bold">Cliente</h2>
            <p><strong>Nombre:</strong> {customerData.nombre}</p>
            <p><strong>DNI/CUIT:</strong> {customerData.dniCuit}</p>
            <p><strong>Dirección de obra:</strong> {customerData.direccion}</p>
            <p><strong>Teléfono:</strong> {customerData.telefono}</p>
            <p><strong>Email:</strong> {customerData.email}</p>
          </div>
          
          <div className="print-section">
            <h2 className="text-lg font-bold">Detalle del Pedido</h2>
            <table className="print-table">
              <thead>
                <tr>
                  <th>Descripción</th>
                  <th>Cant.</th>
                  <th>Precio Unit.</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {orderItems.map(item => (
                  <tr key={item.id}>
                    <td>{item.description}</td>
                    <td>{item.quantity}</td>
                    <td>${item.unitPrice.toFixed(2)}</td>
                    <td>${item.subtotal.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="print-section">
            <h2 className="text-lg font-bold">Resumen de Costos</h2>
            <p><strong>Subtotal:</strong> ${subtotal.toFixed(2)}</p>
            <p><strong>Instalación/Flete:</strong> ${instalacionFlete.toFixed(2)}</p>
            <p><strong>Total sin anticipo:</strong> ${totalSinAnticipo.toFixed(2)}</p>
            <p><strong>Anticipo ({commercialTerms.anticipoPorcentaje}%):</strong> ${anticipo.toFixed(2)}</p>
            <p><strong>Saldo:</strong> ${saldo.toFixed(2)}</p>
            <p><strong>Tiempo de entrega estimado:</strong> {commercialTerms.tiempoEntrega}</p>
            <p><strong>Validez de la oferta:</strong> {commercialTerms.validezOferta}</p>
          </div>
          
          <div className="print-section">
            <h2 className="text-lg font-bold">Condiciones y Garantía</h2>
            <p>{legalText}</p>
          </div>
          
          <div className="print-signature">
            <div>
              <p>Firma del Cliente</p>
              <p>Nombre y aclaración</p>
            </div>
            <div>
              <p>Firma VILKMET</p>
              <p>Responsable de ventas</p>
            </div>
          </div>
        </div>
      </div>

      {/* Lead selector */}
      <Card className="no-print">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Importar desde CRM
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="lead-select">Seleccionar Lead activo</Label>
              <Select value={selectedLeadId} onValueChange={(value) => setSelectedLeadId(value || "")} disabled={loadingLeads}>
                <SelectTrigger id="lead-select">
                  <SelectValue placeholder={loadingLeads ? "Cargando leads..." : "Seleccione un lead"} />
                </SelectTrigger>
                <SelectContent>
                  {leads.map(lead => (
                    <SelectItem key={lead.id} value={lead.id}>
                      {lead.nombre} ({lead.email || lead.whatsapp}) – {lead.quotes.length} cotizaciones
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">
                Al seleccionar un lead, el formulario se auto‑completará con sus datos y las aberturas cotizadas.
              </p>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Leads cargados</span>
                <span className="text-2xl font-bold text-primary">{leads.length}</span>
              </div>
              <Button variant="outline" onClick={() => window.location.reload()} className="w-full">
                Actualizar lista
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Customer data */}
      <Card className="no-print">
        <CardHeader>
          <CardTitle>Datos del Cliente</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre completo *</Label>
              <Input
                id="nombre"
                value={customerData.nombre}
                onChange={e => setCustomerData({ ...customerData, nombre: e.target.value })}
                placeholder="Ej: Juan Pérez"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dniCuit">DNI / CUIT</Label>
              <Input
                id="dniCuit"
                value={customerData.dniCuit}
                onChange={e => setCustomerData({ ...customerData, dniCuit: e.target.value })}
                placeholder="Ej: 20-12345678-9"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="direccion">Dirección de la obra</Label>
              <Input
                id="direccion"
                value={customerData.direccion}
                onChange={e => setCustomerData({ ...customerData, direccion: e.target.value })}
                placeholder="Calle, número, localidad"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="telefono">Teléfono *</Label>
              <Input
                id="telefono"
                value={customerData.telefono}
                onChange={e => setCustomerData({ ...customerData, telefono: e.target.value })}
                placeholder="+54 9 11 1234-5678"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={customerData.email}
                onChange={e => setCustomerData({ ...customerData, email: e.target.value })}
                placeholder="cliente@ejemplo.com"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Order details table */}
      <Card className="no-print">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Detalle del Pedido</CardTitle>
          <Button onClick={addOrderItem} variant="outline" size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Agregar línea
          </Button>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50%]">Descripción del producto</TableHead>
                  <TableHead className="text-center">Cantidad</TableHead>
                  <TableHead className="text-right">Precio unitario</TableHead>
                  <TableHead className="text-right">Subtotal</TableHead>
                  <TableHead className="text-center">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orderItems.map(item => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <Input
                        value={item.description}
                        onChange={e => updateOrderItem(item.id, "description", e.target.value)}
                        placeholder="Ej: Ventana corrediza ALUAR A40 color blanco"
                        className="border-0 focus-visible:ring-0"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={e => updateOrderItem(item.id, "quantity", parseInt(e.target.value) || 1)}
                        className="text-center border-0 focus-visible:ring-0"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        step="0.01"
                        value={item.unitPrice}
                        onChange={e => updateOrderItem(item.id, "unitPrice", parseFloat(e.target.value) || 0)}
                        className="text-right border-0 focus-visible:ring-0"
                      />
                    </TableCell>
                    <TableCell className="text-right font-semibold">
                      ${item.subtotal.toLocaleString("es-AR", { minimumFractionDigits: 2 })}
                    </TableCell>
                    <TableCell className="text-center">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeOrderItem(item.id)}
                        disabled={orderItems.length === 1}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="mt-6 flex justify-end">
            <div className="text-right space-y-2">
              <div className="flex items-center justify-between gap-8">
                <span className="text-muted-foreground">Subtotal:</span>
                <span className="text-xl font-bold">${subtotal.toLocaleString("es-AR", { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex items-center justify-between gap-8">
                <span className="text-muted-foreground">Instalación / Flete:</span>
                <span className="text-xl font-bold">${instalacionFlete.toLocaleString("es-AR", { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex items-center justify-between gap-8 border-t pt-2">
                <span className="text-muted-foreground">Total sin anticipo:</span>
                <span className="text-2xl font-bold text-primary">${totalSinAnticipo.toLocaleString("es-AR", { minimumFractionDigits: 2 })}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Commercial terms */}
      <Card className="no-print">
        <CardHeader>
          <CardTitle>Condiciones Comerciales</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
              <Label htmlFor="instalacionFlete">Costo de instalación/flete ($)</Label>
              <Input
                id="instalacionFlete"
                type="number"
                step="0.01"
                value={commercialTerms.instalacionFlete}
                onChange={e => setCommercialTerms({ ...commercialTerms, instalacionFlete: parseFloat(e.target.value) || 0 })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="anticipoPorcentaje">% de Anticipo requerido</Label>
              <Input
                id="anticipoPorcentaje"
                type="number"
                min="0"
                max="100"
                value={commercialTerms.anticipoPorcentaje}
                onChange={e => setCommercialTerms({ ...commercialTerms, anticipoPorcentaje: parseInt(e.target.value) || 0 })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tiempoEntrega">Tiempo de entrega estimado</Label>
              <Input
                id="tiempoEntrega"
                value={commercialTerms.tiempoEntrega}
                onChange={e => setCommercialTerms({ ...commercialTerms, tiempoEntrega: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="validezOferta">Validez de la oferta</Label>
              <Input
                id="validezOferta"
                value={commercialTerms.validezOferta}
                onChange={e => setCommercialTerms({ ...commercialTerms, validezOferta: e.target.value })}
              />
            </div>
          </div>
          <div className="mt-8 grid md:grid-cols-3 gap-6 bg-slate-50 p-6 rounded-lg">
            <div className="text-center">
              <div className="text-sm text-muted-foreground">Anticipo ({commercialTerms.anticipoPorcentaje}%)</div>
              <div className="text-3xl font-bold text-primary">${anticipo.toLocaleString("es-AR", { minimumFractionDigits: 2 })}</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-muted-foreground">Saldo a pagar</div>
              <div className="text-3xl font-bold text-slate-700">${saldo.toLocaleString("es-AR", { minimumFractionDigits: 2 })}</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-muted-foreground">Total general</div>
              <div className="text-3xl font-bold text-[#E85D04]">${totalSinAnticipo.toLocaleString("es-AR", { minimumFractionDigits: 2 })}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Legal text */}
      <Card className="no-print">
        <CardHeader>
          <CardTitle>Texto Legal / Garantía</CardTitle>
        </CardHeader>
        <CardContent>
          <textarea
            value={legalText}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setLegalText(e.target.value)}
            rows={6}
            className="w-full p-3 border rounded-md font-mono text-sm"
          />
          <p className="mt-4 text-sm text-muted-foreground">
            Este texto aparecerá al final del documento impreso. Puede editar la garantía, exclusiones, etc.
          </p>
        </CardContent>
      </Card>

      {/* Action buttons */}
      <Card className="no-print">
        <CardContent className="flex flex-col md:flex-row gap-4 justify-between pt-6">
          <Button onClick={handlePrint} size="lg" className="flex-1">
            <Printer className="w-5 h-5 mr-2" />
            Imprimir / Guardar PDF
          </Button>
          <Button onClick={handleEmailShare} size="lg" variant="outline" className="flex-1">
            <Mail className="w-5 h-5 mr-2" />
            Enviar por Email
          </Button>
          <Button onClick={handleWhatsAppShare} size="lg" variant="outline" className="flex-1">
            <MessageSquare className="w-5 h-5 mr-2" />
            Enviar por WhatsApp
          </Button>
        </CardContent>
      </Card>

      {/* Print‑only styles (hidden on screen) */}
      <style jsx global>{`
        .print-only {
          display: none;
        }
        .no-print {
        }
        @media print {
          header, aside, nav, .no-print {
            display: none !important;
          }
          .print-only {
            display: block !important;
          }
          body {
            font-family: Arial, sans-serif;
            font-size: 12pt;
            color: #000;
            background: #fff;
            margin: 0;
            padding: 0;
          }
          .print-container {
            width: 210mm;
            min-height: 297mm;
            margin: 0 auto;
            padding: 20mm;
            box-sizing: border-box;
          }
          .print-logo {
            text-align: center;
            font-size: 24pt;
            font-weight: bold;
            margin-bottom: 20mm;
            border-bottom: 2pt solid #000;
            padding-bottom: 10mm;
          }
          .print-section {
            margin-bottom: 10mm;
          }
          .print-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 5mm;
          }
          .print-table th,
          .print-table td {
            border: 1pt solid #000;
            padding: 4pt;
            text-align: left;
          }
          .print-signature {
            margin-top: 30mm;
            display: flex;
            justify-content: space-between;
          }
          .print-signature div {
            width: 45%;
            border-top: 1pt solid #000;
            padding-top: 10pt;
            text-align: center;
          }
        }
      `}</style>
    </div>
  );
}