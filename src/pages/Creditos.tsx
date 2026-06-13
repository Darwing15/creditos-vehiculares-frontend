import { useState } from 'react';
import { Search, Plus, Filter, FileText, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import ModalNuevoCredito from '../components/ModalNuevoCredito';
import ModalPlanPagos from '../components/ModalPlanPagos';

export default function Creditos() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [creditoSeleccionado, setCreditoSeleccionado] = useState<any>(null);

  const handleVerPlan = (credito: any) => {
    setCreditoSeleccionado(credito);
    setIsPlanModalOpen(true);
  };

  // Datos simulados alineados con el negocio de vehículos menores
  const creditos = [
    { id: "CRE-001", cliente: "Juan Pérez", vehiculo: "Honda Wave 110S", total: "S/ 6,500", inicial: "S/ 1,500", cuotas: "12", estado: "Aprobado" },
    { id: "CRE-002", cliente: "María López", vehiculo: "Trimoto Ronco Cargo 200", total: "S/ 14,200", inicial: "S/ 3,000", cuotas: "24", estado: "Pendiente" },
    { id: "CRE-003", cliente: "Carlos Ruiz", vehiculo: "Bajaj Pulsar NS200", total: "S/ 11,800", inicial: "S/ 2,000", cuotas: "18", estado: "En Mora" },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Encabezado */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Créditos Vehiculares</h1>
          <p className="text-slate-500">Evaluación, aprobación y seguimiento de contratos</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all font-medium shadow-sm"
        >
          <Plus size={18} /> Evaluar Crédito
        </button>
      </div>

      {/* Mini KPIs del módulo */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center gap-3">
          <div className="p-2 bg-amber-50 rounded-lg text-amber-600"><Clock size={20} /></div>
          <div>
            <p className="text-xs text-slate-400 font-medium">Por Evaluar</p>
            <p className="text-lg font-bold text-slate-700">5 Solicitudes</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center gap-3">
          <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600"><CheckCircle size={20} /></div>
          <div>
            <p className="text-xs text-slate-400 font-medium">Activos este mes</p>
            <p className="text-lg font-bold text-slate-700">18 Créditos</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center gap-3">
          <div className="p-2 bg-rose-50 rounded-lg text-rose-600"><AlertTriangle size={20} /></div>
          <div>
            <p className="text-xs text-slate-400 font-medium">Riesgo Alto</p>
            <p className="text-lg font-bold text-slate-700">3 Alertas</p>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Buscar por cliente, código o vehículo..."
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
          />
        </div>
        <button className="px-4 py-2 border border-slate-200 rounded-lg flex items-center gap-2 hover:bg-slate-50 text-sm font-medium text-slate-600">
          <Filter size={18} /> Filtrar Estados
        </button>
      </div>

      {/* Tabla de Créditos */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-semibold text-slate-700 text-sm">Código</th>
                <th className="px-6 py-4 font-semibold text-slate-700 text-sm">Cliente</th>
                <th className="px-6 py-4 font-semibold text-slate-700 text-sm">Vehículo</th>
                <th className="px-6 py-4 font-semibold text-slate-700 text-sm">Monto Financiado</th>
                <th className="px-6 py-4 font-semibold text-slate-700 text-sm">Plazo</th>
                <th className="px-6 py-4 font-semibold text-slate-700 text-sm">Estado</th>
                <th className="px-6 py-4 font-semibold text-slate-700 text-sm text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {creditos.map((credito) => (
                <tr key={credito.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-mono font-bold text-slate-500">{credito.id}</td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-900">{credito.cliente}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{credito.vehiculo}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    <div>{credito.total}</div>
                    <div className="text-xs text-slate-400">Inicial: {credito.inicial}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">{credito.cuotas} meses</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${credito.estado === 'Aprobado' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                      credito.estado === 'Pendiente' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                        'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}>
                      {credito.estado}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-right">
                    <button
                      onClick={() => handleVerPlan(credito)}
                      className="text-slate-500 hover:text-emerald-600 p-1 rounded-md hover:bg-slate-100 transition-colors" title="Ver plan de pagos">
                      <FileText size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ModalNuevoCredito isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <ModalPlanPagos
        isOpen={isPlanModalOpen}
        onClose={() => setIsPlanModalOpen(false)}
        credito={creditoSeleccionado}
      />
    </div>
  );
}