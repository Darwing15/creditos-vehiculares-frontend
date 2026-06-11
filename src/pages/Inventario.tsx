import { useState } from 'react';
import { Search, Plus, Filter, Edit, Box, CheckCircle, Clock, ShieldCheck } from 'lucide-react';
import ModalNuevoVehiculo from '../components/ModalNuevoVehiculo';

export default function Inventario() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [vehiculoEdicion, setVehiculoEdicion] = useState<any>(null);

  const abrirModalNuevo = () => {
    setVehiculoEdicion(null);
    setIsModalOpen(true);
  };

  const abrirModalEditar = (vehiculo: any) => {
    setVehiculoEdicion(vehiculo);
    setIsModalOpen(true);
  };

  // Datos simulados enfocados en motocicletas y trimotos
  const inventario = [
    { id: "INV-001", marca: "Honda", modelo: "Wave 110S", chasis: "9C2KC2640M", motor: "KC26E50", precio: 6500, estado: "Disponible" },
    { id: "INV-002", marca: "Bajaj", modelo: "Pulsar NS200", chasis: "MD2A54BW5M", motor: "DHYA553", precio: 11800, estado: "Reservado" },
    { id: "INV-003", marca: "Ronco", modelo: "Cargo 200", chasis: "8AWTE4B20M", motor: "162FMJ2", precio: 14200, estado: "Vendido" },
    { id: "INV-004", marca: "Yamaha", modelo: "FZ-S FI V3.0", chasis: "ME1RG4614M", motor: "G3J1E00", precio: 10500, estado: "Disponible" },
  ];

  return (
    <div className="p-6 space-y-6">

      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Inventario de Vehículos</h1>
          <p className="text-slate-500">Control de stock, números de chasis y motor</p>
        </div>
        <button
          onClick={abrirModalNuevo}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all font-medium shadow-sm"
        >
          <Plus size={18} /> Registrar Vehículo
        </button>
      </div>

      {/* Tarjetas de Resumen de Stock */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 rounded-lg text-blue-600">
            <Box size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Total Unidades</p>
            <h3 className="text-2xl font-bold text-slate-800">45</h3>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 rounded-lg text-emerald-600">
            <CheckCircle size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Disponibles</p>
            <h3 className="text-2xl font-bold text-slate-800">32</h3>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-amber-50 rounded-lg text-amber-600">
            <Clock size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Reservadas (En Evaluación)</p>
            <h3 className="text-2xl font-bold text-slate-800">8</h3>
          </div>
        </div>
      </div>

      {/* Barra de Búsqueda y Filtros */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:w-1/2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Buscar por marca, modelo, chasis o motor..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all text-sm"
          />
        </div>
        <div className="flex w-full sm:w-auto gap-3">
          <select className="flex-1 sm:w-auto px-4 py-2 border border-slate-200 text-slate-600 rounded-lg bg-white text-sm focus:ring-2 focus:ring-emerald-500 outline-none">
            <option value="">Todas las Marcas</option>
            <option value="honda">Honda</option>
            <option value="bajaj">Bajaj</option>
            <option value="yamaha">Yamaha</option>
            <option value="ronco">Ronco</option>
          </select>
          <button className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 flex items-center justify-center gap-2 text-sm font-medium transition-colors">
            <Filter size={18} />
            <span className="hidden sm:inline">Estado</span>
          </button>
        </div>
      </div>

      {/* Tabla de Inventario */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs uppercase tracking-wider">
                <th className="px-6 py-4 font-semibold">Código / Marca</th>
                <th className="px-6 py-4 font-semibold">Modelo</th>
                <th className="px-6 py-4 font-semibold">Identificadores (VIN / Motor)</th>
                <th className="px-6 py-4 font-semibold">Precio Ref.</th>
                <th className="px-6 py-4 font-semibold">Estado</th>
                <th className="px-6 py-4 font-semibold text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {inventario.map((vehiculo) => (
                <tr key={vehiculo.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-6 py-4">
                    <div className="text-xs text-slate-400 font-mono mb-0.5">{vehiculo.id}</div>
                    <div className="font-bold text-slate-800">{vehiculo.marca}</div>
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-700">{vehiculo.modelo}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-slate-600 mb-1 text-xs">
                      <ShieldCheck size={14} className="text-slate-400" />
                      <span className="font-mono">{vehiculo.chasis}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-500 text-xs">
                      <span className="font-mono text-slate-400">Motor: {vehiculo.motor}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-semibold text-slate-800">S/ {vehiculo.precio}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${vehiculo.estado === 'Disponible' ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' :
                      vehiculo.estado === 'Reservado' ? 'bg-amber-100 text-amber-700 border border-amber-200' :
                        'bg-slate-100 text-slate-600 border border-slate-200'
                      }`}>
                      {vehiculo.estado}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => abrirModalEditar(vehiculo)}
                      className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Editar vehículo"
                    >
                      <Edit size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <ModalNuevoVehiculo
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        vehiculo={vehiculoEdicion}
      />
    </div>
  );
}