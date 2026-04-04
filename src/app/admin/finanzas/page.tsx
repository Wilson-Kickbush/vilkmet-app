import { DollarSign, TrendingUp, TrendingDown, Package } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getTransactions, getInventory } from "@/actions/finance";
import TransactionForm from "@/components/admin/TransactionForm";
import InventoryForm from "@/components/admin/InventoryForm";
import StockActions from "@/components/admin/StockActions";

export default async function FinanzasPage() {
  let transactions = [];
  let inventory = [];
  let error = null;

  try {
    // Obtener datos reales de la base de datos con manejo de errores
    transactions = await getTransactions();
  } catch (err) {
    console.error("Error al cargar transacciones:", err);
    error = "No se pudieron cargar las transacciones";
  }

  try {
    inventory = await getInventory();
  } catch (err) {
    console.error("Error al cargar inventario:", err);
    error = error || "No se pudieron cargar los items del inventario";
  }

  // Calcular resumen financiero
  const ingresos = transactions
    .filter(t => t.tipo === "INGRESO")
    .reduce((sum, t) => sum + t.monto, 0);

  const egresos = transactions
    .filter(t => t.tipo === "EGRESO")
    .reduce((sum, t) => sum + t.monto, 0);

  const saldoNeto = ingresos - egresos;

  // Calcular estadísticas de inventario
  const totalItems = inventory.length;
  const lowStockItems = inventory.filter(item => item.cantidad <= item.stockMinimo * 1.5).length;
  const criticalItems = inventory.filter(item => item.cantidad <= item.stockMinimo).length;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-AR', { 
      style: 'currency', 
      currency: 'ARS', 
      minimumFractionDigits: 0 
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Si hay un error, mostrar mensaje de error
  if (error) {
    return (
      <div className="space-y-8 p-6">
        <div className="flex items-center justify-between border-b pb-4">
          <div>
            <h1 className="text-3xl font-black font-heading text-[#1A3A52]">Contabilidad VILKMET</h1>
            <p className="text-gray-500 mt-1">Gestión financiera y control de stock</p>
          </div>
        </div>
        
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h2 className="text-xl font-bold text-red-700 mb-2">Error al cargar datos</h2>
          <p className="text-red-600">{error}</p>
          <p className="text-sm text-red-500 mt-2">
            Por favor, verifica que la base de datos esté configurada correctamente y que las migraciones de Prisma estén aplicadas.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6">
      <div className="flex items-center justify-between border-b pb-4">
        <div>
          <h1 className="text-3xl font-black font-heading text-[#1A3A52]">Contabilidad VILKMET</h1>
          <p className="text-gray-500 mt-1">Gestión financiera y control de stock</p>
        </div>
      </div>

      {/* Cards de Resumen */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-green-500 shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold text-gray-500 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-500" /> Ingresos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-green-600">{formatCurrency(ingresos)}</div>
            <p className="text-xs text-gray-400 mt-1">{transactions.filter(t => t.tipo === "INGRESO").length} transacciones</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500 shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold text-gray-500 flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-red-500" /> Egresos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-red-600">{formatCurrency(egresos)}</div>
            <p className="text-xs text-gray-400 mt-1">{transactions.filter(t => t.tipo === "EGRESO").length} transacciones</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-[#1A3A52] bg-[#1A3A52] text-white shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold text-gray-300 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-white" /> Saldo Neto
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black">{formatCurrency(saldoNeto)}</div>
            <p className="text-xs text-gray-300 mt-1">Balance actual</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-[#E85D04] shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold text-gray-500 flex items-center gap-2">
              <Package className="w-4 h-4 text-[#E85D04]" /> Materiales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-[#1A3A52]">{totalItems} Items</div>
            <div className="flex gap-2 mt-2">
              {criticalItems > 0 && (
                <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full font-medium">
                  {criticalItems} crítico
                </span>
              )}
              {lowStockItems > 0 && (
                <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full font-medium">
                  {lowStockItems} bajo
                </span>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pestañas */}
      <Tabs defaultValue="cashflow" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-gray-200">
          <TabsTrigger value="cashflow" className="font-bold data-[state=active]:bg-[#1A3A52] data-[state=active]:text-white">
            Flujo de Caja
          </TabsTrigger>
          <TabsTrigger value="inventory" className="font-bold data-[state=active]:bg-[#1A3A52] data-[state=active]:text-white">
            Inventario
          </TabsTrigger>
        </TabsList>

        <TabsContent value="cashflow" className="mt-6">
          {/* Formulario de transacción */}
          <TransactionForm />
          
          <div className="p-6 bg-white rounded-lg shadow border">
            <h2 className="text-xl font-bold text-[#1A3A52] mb-6">Últimos Movimientos</h2>
            
            {/* Tabla de transacciones reales */}
            {transactions.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 text-sm font-bold text-gray-600">Fecha</th>
                      <th className="text-left py-3 px-4 text-sm font-bold text-gray-600">Concepto</th>
                      <th className="text-left py-3 px-4 text-sm font-bold text-gray-600">Categoría</th>
                      <th className="text-left py-3 px-4 text-sm font-bold text-gray-600">Monto</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((transaction) => (
                      <tr key={transaction.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4 text-sm text-gray-700">
                          {formatDate(transaction.fecha)}
                        </td>
                        <td className="py-3 px-4 text-sm font-medium text-gray-900">
                          {transaction.descripcion}
                        </td>
                        <td className="py-3 px-4 text-sm">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            transaction.tipo === "INGRESO" 
                              ? "bg-green-100 text-green-800" 
                              : "bg-red-100 text-red-800"
                          }`}>
                            {transaction.categoria}
                          </span>
                        </td>
                        <td className={`py-3 px-4 text-sm font-bold ${
                          transaction.tipo === "INGRESO" ? "text-green-600" : "text-red-600"
                        }`}>
                          {transaction.tipo === "INGRESO" ? "+" : "-"} {formatCurrency(transaction.monto)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 border rounded-lg bg-gray-50">
                <p className="text-gray-500">No hay transacciones registradas aún</p>
                <p className="text-sm text-gray-400 mt-1">Comienza agregando tu primer movimiento</p>
              </div>
            )}
            
            <div className="mt-4 text-sm text-gray-500">
              Mostrando {transactions.length} transacciones
            </div>
          </div>
        </TabsContent>

        <TabsContent value="inventory" className="mt-6">
          {/* Formulario de inventario */}
          <InventoryForm />
          
          <div className="p-6 bg-white rounded-lg shadow border">
            <h2 className="text-xl font-bold text-[#1A3A52] mb-6">Control de Stock</h2>
            
            {/* Tabla de inventario real */}
            {inventory.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 text-sm font-bold text-gray-600">Producto</th>
                      <th className="text-left py-3 px-4 text-sm font-bold text-gray-600">Tipo</th>
                      <th className="text-left py-3 px-4 text-sm font-bold text-gray-600">Cantidad</th>
                      <th className="text-left py-3 px-4 text-sm font-bold text-gray-600">Stock Mín.</th>
                      <th className="text-left py-3 px-4 text-sm font-bold text-gray-600">Estado</th>
                      <th className="text-left py-3 px-4 text-sm font-bold text-gray-600">Ubicación</th>
                      <th className="text-left py-3 px-4 text-sm font-bold text-gray-600">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inventory.map((item) => {
                      const stockStatus = item.cantidad <= item.stockMinimo ? "CRITICAL" : 
                                        item.cantidad <= item.stockMinimo * 1.5 ? "LOW" : "OK";
                      return (
                        <tr key={item.id} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4 text-sm font-medium text-gray-900">
                            {item.nombre}
                          </td>
                          <td className="py-3 px-4 text-sm">
                            <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
                              {item.tipo === "PROFILE" ? "Perfil Aluminio" : 
                               item.tipo === "GLASS" ? "Vidrio" : "Componente"}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-sm">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-gray-900">{item.cantidad}</span>
                              <span className="text-xs text-gray-500">{item.unidad}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-700">{item.stockMinimo}</td>
                          <td className="py-3 px-4 text-sm">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                              stockStatus === "CRITICAL" ? "bg-red-100 text-red-800" :
                              stockStatus === "LOW" ? "bg-yellow-100 text-yellow-800" :
                              "bg-green-100 text-green-800"
                            }`}>
                              {stockStatus === "CRITICAL" ? "Crítico" : 
                               stockStatus === "LOW" ? "Bajo" : "OK"}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-700">
                            {item.ubicacion || "Sin ubicación"}
                          </td>
                          <td className="py-3 px-4 text-sm">
                            <StockActions 
                              itemId={item.id}
                              currentQuantity={item.cantidad}
                              unidad={item.unidad}
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 border rounded-lg bg-gray-50">
                <p className="text-gray-500">No hay productos en el inventario</p>
                <p className="text-sm text-gray-400 mt-1">Comienza agregando tu primer material</p>
              </div>
            )}
            
            <div className="mt-4 text-sm text-gray-500">
              Mostrando {inventory.length} productos en inventario
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
