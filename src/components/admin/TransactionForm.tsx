"use client";

import { useState, useEffect } from "react";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createTransaction } from "@/actions/finance";
import { TransactionInput } from "@/actions/finance";

export default function TransactionForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Función para obtener la fecha actual en formato YYYY-MM-DD
  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const [formData, setFormData] = useState({
    tipo: "INGRESO",
    categoria: "",
    descripcion: "",
    monto: 0,
    fecha: getTodayDate(), // Usar formato YYYY-MM-DD para el input date
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === "monto") {
      setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.categoria.trim() || !formData.descripcion.trim() || !formData.fecha || formData.monto <= 0) {
      alert("Por favor completa todos los campos correctamente");
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Convertir la fecha de string YYYY-MM-DD a objeto Date
      const fechaDate = new Date(formData.fecha);
      
      await createTransaction({
        tipo: formData.tipo as "INGRESO" | "EGRESO",
        categoria: formData.categoria,
        descripcion: formData.descripcion,
        monto: formData.monto,
        fecha: fechaDate,
      });
      
      // Limpiar formulario
      setFormData({
        tipo: "INGRESO",
        categoria: "",
        descripcion: "",
        monto: 0,
        fecha: getTodayDate(),
      });
      
      // Cerrar formulario
      setIsOpen(false);
      
    } catch (error) {
      console.error("Error al crear transacción:", error);
      alert("No se pudo crear la transacción. Por favor intenta de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      tipo: "INGRESO",
      categoria: "",
      descripcion: "",
      monto: 0,
      fecha: getTodayDate(),
    });
    setIsOpen(false);
  };

  // Si no está abierto, mostrar solo el botón
  if (!isOpen) {
    return (
      <Button 
        onClick={() => setIsOpen(true)}
        className="bg-[#E85D04] hover:bg-[#c24e03] text-white gap-2"
      >
        <Plus className="w-4 h-4" /> Nuevo Movimiento
      </Button>
    );
  }

  // Si está abierto, mostrar el formulario
  return (
    <div className="bg-white rounded-lg shadow-lg border p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-[#1A3A52]">Nuevo Movimiento</h3>
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
              <option value="INGRESO">Ingreso</option>
              <option value="EGRESO">Egreso</option>
            </select>
          </div>

          {/* Categoría */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Categoría *
            </label>
            <select
              name="categoria"
              value={formData.categoria}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1A3A52] focus:border-transparent"
            >
              <option value="">Seleccionar categoría</option>
              <option value="VENTA">Venta</option>
              <option value="SEÑA">Seña</option>
              <option value="MATERIALES">Materiales</option>
              <option value="SERVICIOS">Servicios</option>
              <option value="PERSONAL">Personal</option>
              <option value="ALQUILER">Alquiler</option>
              <option value="OTRO">Otro</option>
            </select>
          </div>
        </div>

        {/* Fecha */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Fecha *
          </label>
          <input
            type="date"
            name="fecha"
            value={formData.fecha}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1A3A52] focus:border-transparent"
          />
        </div>

        {/* Descripción */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Descripción *
          </label>
          <input
            type="text"
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            required
            placeholder="Ej: Venta de ventana corrediza"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1A3A52] focus:border-transparent"
          />
        </div>

        {/* Monto */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Monto (ARS) *
          </label>
          <input
            type="number"
            name="monto"
            value={formData.monto || ""}
            onChange={handleChange}
            required
            min="0"
            step="0.01"
            placeholder="0.00"
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
            {isSubmitting ? "Guardando..." : "Guardar Movimiento"}
          </Button>
        </div>
      </form>
    </div>
  );
}
