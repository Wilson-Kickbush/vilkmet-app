"use client";

import { useState } from "react";
import { Plus, Minus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { adjustStock, deleteInventoryItem } from "@/actions/finance";

interface StockActionsProps {
  itemId: string;
  currentQuantity: number;
  unidad: string;
}

export default function StockActions({ itemId, currentQuantity, unidad }: StockActionsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleAdjustStock = async (delta: number) => {
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      await adjustStock(itemId, delta);
    } catch (error) {
      console.error("Error al ajustar stock:", error);
      alert("No se pudo ajustar el stock. Por favor intenta de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("¿Estás seguro de que quieres eliminar este material? Esta acción no se puede deshacer.")) {
      return;
    }

    setIsDeleting(true);
    try {
      await deleteInventoryItem(itemId);
    } catch (error) {
      console.error("Error al eliminar item:", error);
      alert("No se pudo eliminar el material. Por favor intenta de nuevo.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex items-center gap-1">
      {/* Botón para restar */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleAdjustStock(-1)}
        disabled={isLoading || currentQuantity <= 0}
        className="h-7 w-7 p-0 bg-red-50 hover:bg-red-100 text-red-600 border-red-200"
        title={`Restar 1 ${unidad}`}
      >
        <Minus className="w-3 h-3" />
      </Button>

      {/* Botón para sumar */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleAdjustStock(1)}
        disabled={isLoading}
        className="h-7 w-7 p-0 bg-green-50 hover:bg-green-100 text-green-600 border-green-200"
        title={`Sumar 1 ${unidad}`}
      >
        <Plus className="w-3 h-3" />
      </Button>

      {/* Botón para eliminar */}
      <Button
        variant="outline"
        size="sm"
        onClick={handleDelete}
        disabled={isDeleting}
        className="h-7 w-7 p-0 bg-gray-50 hover:bg-gray-100 text-gray-600 border-gray-200 ml-2"
        title="Eliminar material"
      >
        <Trash2 className="w-3 h-3" />
      </Button>
    </div>
  );
}
