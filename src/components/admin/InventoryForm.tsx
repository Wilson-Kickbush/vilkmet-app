"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createInventoryItem } from "@/actions/finance";
import { InventoryItemInput } from "@/actions/finance";

export default function InventoryForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<InventoryItemInput>({
    nombre: "",
    tipo: "PROFILE",
    cantidad: 0,
    unidad: "unidades",
    stockMinimo: 0,
    proveedor: "",
    costoUnitario: 0,
    ubicacion: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === "cantidad" || name === "stockMinimo" || name === "costoUnitario") {
      setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nombre.trim() || !formData.proveedor.trim() || formData.cantidad < 0 || formData.stockMinimo < 0) {
      alert("Por favor completa todos los campos correctamente");
      return;
    }

    setIsSubmitting(true);
    
    try {
      await createInventoryItem(formData);
      
      // Limpiar formulario
      setFormData({
        nombre: "",
        tipo: "PROFILE",
        cantidad: 0,
        unidad: "unidades",
        stockMinimo: 0,
        proveedor: "",
        costoUnitario: 0,
        ubicacion: "",
      });
      
      // Cerrar formulario
      setIsOpen(false);
      
    } catch (error) {
      console.error("Error al crear item de inventario:", error);
      alert("No se pudo crear el item del inventario. Por favor intenta de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      nombre: "",
      tipo: "PROFILE",
      cantidad: 0,
      unidad: "unidades",
      stockMinimo: 0,
      proveedor: "",
      costoUnitario: 0,
      ubicacion: "",
    });
    setIsOpen(false);
  };

  // Si no está abierto, mostrar solo el botón
  if (!isOpen) {
    return (
      <Button 
        onClick={() => setIsOpen(true)}
        className="bg-[#1A3A52] hover:bg-[#112738] text-white gap-2"
      >
        <Plus className="w-4 h-4" /> Agregar Material
      </Button>
    );
  }

  // Si está abierto, mostrar el formulario
  return (
    <div className="bg-white rounded-lg shadow-lg border p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-[#1A3A52]">Agregar Material al Inventario</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCancel}
          className="h-8 w-8 p-0"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Nombre */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre del Material *
            </label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
              placeholder="Ej: Perfil aluminio 70mm"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1A3A52] focus:border-transparent"
            />
          </div>

          {/* Tipo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipo *
            </label>
            <select
              name="tipo"
              value={formData.tipo}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1A3A52] focus:border-transparent"
            >
              <option value="PROFILE">Perfil Aluminio</option>
              <option value="GLASS">Vidrio</option>
              <option value="COMPONENT">Componente</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Cantidad */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cantidad *
            </label>
            <input
              type="number"
              name="cantidad"
              value={formData.cantidad || ""}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
              placeholder="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1A3A52] focus:border-transparent"
            />
          </div>

          {/* Unidad */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Unidad *
            </label>
            <select
              name="unidad"
              value={formData.unidad}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1A3A52] focus:border-transparent"
            >
              <option value="unidades">Unidades</option>
              <option value="metros">Metros</option>
              <option value="litros">Litros</option>
              <option value="rollos">Rollos</option>
              <option value="kg">Kilogramos</option>
            </select>
          </div>

          {/* Stock Mínimo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Stock Mínimo *
            </label>
            <input
              type="number"
              name="stockMinimo"
              value={formData.stockMinimo || ""}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
              placeholder="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1A3A52] focus:border-transparent"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Proveedor */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Proveedor *
            </label>
            <input
              type="text"
              name="proveedor"
              value={formData.proveedor}
              onChange={handleChange}
              required
              placeholder="Ej: Aluminios S.A."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1A3A52] focus:border-transparent"
            />
          </div>

          {/* Costo Unitario */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Costo Unitario (ARS)
            </label>
            <input
              type="number"
              name="costoUnitario"
              value={formData.costoUnitario || ""}
              onChange={handleChange}
              min="0"
              step="0.01"
              placeholder="0.00"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1A3A52] focus:border-transparent"
            />
          </div>
        </div>

        {/* Ubicación */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Ubicación en Almacén
          </label>
          <input
            type="text"
            name="ubicacion"
            value={formData.ubicacion}
            onChange={handleChange}
            placeholder="Ej: Estante A, Nivel 3"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1A3A52] focus:border-transparent"
          />
        </div>

        {/* Botones */}
        <div className="flex justify-end gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            className="bg-[#1A3A52] hover:bg-[#112738] text-white"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Guardando..." : "Guardar Material"}
          </Button>
        </div>
      </form>
    </div>
  );
}
