import { Search, Filter, AlertTriangle, Phone, CheckCircle, CreditCard, MessageCircle, Bell } from 'lucide-react';

export default function Cobranza() {
  // Datos simulados de cartera en mora y próximos vencimientos
  const cobranzas = [
    { id: "COB-101", cliente: "Carlos Ruiz", credito: "CRE-003", telefono: "945 123 789", cuota: "S/ 485.50", mora: 15, estado: "Riesgo Alto" },
    { id: "COB-102", cliente: "Jorge Pérez", credito: "CRE-015", telefono: "912 345 678", cuota: "S/ 320.00", mora: 5, estado: "Atraso Leve" },
    { id: "COB-103", cliente: "Ana Silva", credito: "CRE-022", telefono: "999 888 777", cuota: "S/ 550.00", mora: 0, estado: "Vence Hoy" },
  ];

  return (
    <div className="p-6 space-y-6">
      
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Gestión de Cobranzas</h1>
          <p className="text-slate-500">Control de mora, vencimientos y registro de pagos</p>
        </div>
      </div>

      {/* Tarjetas de Indicadores (KPIs) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4 border-l-4 border-l-rose-500">
          <div className="p-3 bg-rose-50 rounded-lg text-rose-600">
            <AlertTriangle size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Cartera en Mora</p>
            <h3 className="text-2xl font-bold text-slate-800">S/ 12,450</h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4 border-l-4 border-l-amber-500">
          <div className="p-3 bg-amber-50 rounded-lg text-amber-600">
            <Bell size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Vencimientos Hoy</p>
            <h3 className="text-2xl font-bold text-slate-800">14 Cuotas</h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4 border-l-4 border-l-emerald-500">
          <div className="p-3 bg-emerald-50 rounded-lg text-emerald-600">
            <CheckCircle size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Recuperado Hoy</p>
            <h3 className="text-2xl font-bold text-slate-800">S/ 3,200</h3>
          </div>
        </div>
      </div>

      {/* Barra de Herramientas y Filtros */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Buscar cliente o número de crédito..." 
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all text-sm"
          />
        </div>
        <div className="flex w-full sm:w-auto gap-3">
          <select className="flex-1 sm:w-auto px-4 py-2 border border-slate-200 text-slate-600 rounded-lg bg-white text-sm focus:ring-2 focus:ring-emerald-500 outline-none">
            <option value="">Todos los tramos</option>
            <option value="1-8">1 a 8 días (Leve)</option>
            <option value="9-30">9 a 30 días (Medio)</option>
            <option value="30+">Más de 30 días (Alto)</option>
          </select>
          <button className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 flex items-center justify-center gap-2 text-sm font-medium transition-colors">
            <Filter size={18} />
            <span className="hidden sm:inline">Filtros</span>
          </button>
        </div>
      </div>

      {/* Tabla de Cobranzas y Alertas */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs uppercase tracking-wider">
                <th className="px-6 py-4 font-semibold">Cliente / Crédito</th>
                <th className="px-6 py-4 font-semibold">Contacto</th>
                <th className="px-6 py-4 font-semibold">Cuota a Pagar</th>
                <th className="px-6 py-4 font-semibold">Días Mora</th>
                <th className="px-6 py-4 font-semibold">Estado</th>
                <th className="px-6 py-4 font-semibold text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {cobranzas.map((cobro) => (
                <tr key={cobro.id} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-800">{cobro.cliente}</div>
                    <div className="text-xs text-slate-500 font-mono mt-0.5">{cobro.credito}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-slate-600">
                      <Phone size={14} className="text-slate-400" />
                      {cobro.telefono}
                    </div>
                  </td>
                  <td className="px-6 py-4 font-bold text-slate-700">{cobro.cuota}</td>
                  <td className="px-6 py-4">
                    <span className={`font-bold ${cobro.mora > 0 ? 'text-rose-600' : 'text-slate-600'}`}>
                      {cobro.mora} días
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                      cobro.estado === 'Riesgo Alto' ? 'bg-rose-100 text-rose-700 border border-rose-200' : 
                      cobro.estado === 'Atraso Leve' ? 'bg-amber-100 text-amber-700 border border-amber-200' : 
                      'bg-emerald-100 text-emerald-700 border border-emerald-200'
                    }`}>
                      {cobro.estado}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        className="p-2 text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors flex items-center gap-2 font-medium text-xs border border-emerald-200"
                        title="Registrar Pago de Cuota"
                      >
                        <CreditCard size={16} /> Pago
                      </button>
                      <button 
                        className="p-2 text-slate-500 hover:text-green-600 hover:bg-green-50 border border-transparent hover:border-green-200 rounded-lg transition-all"
                        title="Enviar recordatorio por WhatsApp"
                      >
                        <MessageCircle size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}