"use client";

import { Package, AlertTriangle, CheckCircle, Plus, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Datos de ejemplo para stock
const sampleInventory = [
  { id: 1, name: "Perfil Aluminio 70mm", type: "PROFILE", quantity: 125, unit: "metros", minStock: 50, status: "OK" },
  { id: 2, name: "Vidrio Templado 6mm", type: "GLASS", quantity: 42, unit: "unidades", minStock: 20, status: "LOW" },
  { id: 3, name: "Burlete Siliconado", type: "COMPONENT", quantity: 18, unit: "rollos", minStock: 10, status: "CRITICAL" },
  { id: 4, name: "Perfil Aluminio 50mm", type: "PROFILE", quantity: 85, unit: "metros", minStock: 40, status: "OK" },
  { id: 5, name: "Vidrio DVH 4+4", type: "GLASS", quantity: 25, unit: "unidades", minStock: 15, status: "OK" },
  { id: 6, name: "Manijas Cromadas", type: "COMPONENT", quantity: 8, unit: "unidades", minStock: 5, status: "CRITICAL" },
  { id: 7, name: "Sellador Acrílico", type: "COMPONENT", quantity: 12, unit: "litros", minStock: 5, status: "LOW" },
  { id: 8, name: "Perfil PVC Blanco", type: "PROFILE", quantity: 65, unit: "metros", minStock: 30, status: "OK" },
];

const typeLabels = {
  PROFILE: "Perfil",
  GLASS: "Vidrio",
  COMPONENT: "Componente",
};

const statusConfig = {
  OK: { label: "Stock OK", color: "bg-green-100 text-green-800", icon: CheckCircle },
  LOW: { label: "Stock Bajo", color: "bg-yellow-100 text-yellow-800", icon: AlertTriangle },
  CRITICAL: { label: "Stock Crítico", color: "bg-red-100 text-red-800", icon: AlertTriangle },
};

interface StockTableProps {
  showActions?: boolean;
  onEdit?: (item: any) => void;
  onDelete?: (item: any) => void;
  onAdd?: () => void;
}

export default function StockTable({ 
  showActions = true, 
  onEdit, 
  onDelete, 
  onAdd 
}: StockTableProps) {
  // Calcular estadísticas
  const totalItems = sampleInventory.length;
  const lowStockItems = sampleInventory.filter(item => item.status !== "OK").length;
  const criticalItems = sampleInventory.filter(item => item.status === "CRITICAL").length;

  const getStatus = (quantity: number, minStock: number) => {
    if (quantity <= minStock * 0.3) return "CRITICAL";
    if (quantity <= minStock) return "LOW";
    return "OK";
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <Package className="w-5 h-5 text-primary" />
            Control de Stock
          </CardTitle>
          <div className="flex gap-4 mt-2">
            <Badge variant="outline" className="text-sm">
              Total: {totalItems} productos
            </Badge>
            <Badge variant="outline" className="text-sm bg-yellow-50 text-yellow-700">
              Bajos: {lowStockItems}
            </Badge>
            <Badge variant="outline" className="text-sm bg-red-50 text-red-700">
              Críticos: {criticalItems}
            </Badge>
          </div>
        </div>
        {showActions && onAdd && (
          <Button onClick={onAdd} className="gap-2 bg-primary hover:bg-primary/90">
            <Plus className="w-4 h-4" />
            Nuevo Producto
          </Button>
        )}
      </CardHeader>
      
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Producto</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Tipo</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Cantidad</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Unidad</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Stock Mínimo</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Estado</th>
                {showActions && (
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Acciones</th>
                )}
              </tr>
            </thead>
            <tbody>
              {sampleInventory.map((item) => {
                const StatusIcon = statusConfig[item.status as keyof typeof statusConfig].icon;
                const statusInfo = statusConfig[item.status as keyof typeof statusConfig];
                
                return (
                  <tr key={item.id} className="border-b hover:bg-slate-50">
                    <td className="py-3 px-4">
                      <div className="font-medium">{item.name}</div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="outline" className="text-xs">
                        {typeLabels[item.type as keyof typeof typeLabels]}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-lg">{item.quantity}</div>
                    </td>
                    <td className="py-3 px-4 text-sm text-muted-foreground">
                      {item.unit}
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-sm">{item.minStock}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
                        <StatusIcon className="w-3 h-3" />
                        {statusInfo.label}
                      </div>
                    </td>
                    {showActions && (
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          {onEdit && (
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => onEdit(item)}
                              className="h-8 w-8 p-0"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                          )}
                          {onDelete && (
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => onDelete(item)}
                              className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {sampleInventory.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Package className="w-12 h-12 mx-auto mb-4 text-slate-300" />
            <p>No hay productos en inventario</p>
            {showActions && onAdd && (
              <Button 
                onClick={onAdd} 
                variant="outline" 
                className="mt-4 gap-2"
              >
                <Plus className="w-4 h-4" />
                Agregar primer producto
              </Button>
            )}
          </div>
        )}

        {/* Resumen de alertas */}
        {criticalItems > 0 && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2 text-red-700 font-medium">
              <AlertTriangle className="w-5 h-5" />
              <span>¡Atención! Tienes {criticalItems} producto(s) con stock crítico</span>
            </div>
            <p className="text-sm text-red-600 mt-1">
              Se recomienda realizar pedidos urgentes para evitar interrupciones en producción.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}