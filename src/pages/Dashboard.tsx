import { useState, type JSX } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { 
  DollarSign, 
  Users, 
  AlertCircle, 
  TrendingUp, 
  Download, 
  FileText, 
  FileSpreadsheet, 
  ChevronDown 
} from 'lucide-react';

// Datos simulados de los últimos 6 meses
const data = [
  { name: 'Ene', ventas: 4000 },
  { name: 'Feb', ventas: 3000 },
  { name: 'Mar', ventas: 5000 },
  { name: 'Abr', ventas: 2780 },
  { name: 'May', ventas: 6890 },
  { name: 'Jun', ventas: 4390 },
];

export default function Dashboard() {
  const [isExportOpen, setIsExportOpen] = useState(false);

  const handleExport = (format: 'excel' | 'pdf') => {
    setIsExportOpen(false);
    // Aquí se conectará la lógica real con librerías como xlsx o jspdf
    alert(`Iniciando la generación y descarga del reporte en formato: ${format.toUpperCase()}`);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Encabezado con Botón de Exportación */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Panel de Control</h1>
          <p className="text-slate-500">Bienvenido al sistema de gestión de créditos vehiculares</p>
        </div>

        {/* Botón de Exportar con Dropdown */}
        <div className="relative">
          <button 
            onClick={() => setIsExportOpen(!isExportOpen)}
            className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-4 py-2 rounded-lg flex items-center gap-2 transition-all font-medium shadow-sm"
          >
            <Download size={18} className="text-slate-500" />
            Exportar Reporte
            <ChevronDown size={16} className={`text-slate-400 transition-transform ${isExportOpen ? 'rotate-180' : ''}`} />
          </button>

          {isExportOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-lg py-1 z-50 animate-in fade-in slide-in-from-top-1 duration-200">
              <button 
                onClick={() => handleExport('excel')}
                className="w-full px-4 py-2.5 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 transition-colors"
              >
                <FileSpreadsheet size={16} className="text-emerald-600" />
                Descargar Excel (.xlsx)
              </button>
              <button 
                onClick={() => handleExport('pdf')}
                className="w-full px-4 py-2.5 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 transition-colors"
              >
                <FileText size={16} className="text-red-500" />
                Descargar PDF (.pdf)
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Tarjetas KPI */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard title="Créditos Activos" value="124" icon={<Users className="text-blue-600" />} />
        <KPICard title="Ingresos del Mes" value="S/ 45,200" icon={<DollarSign className="text-emerald-600" />} />
        <KPICard title="Cuotas en Mora" value="8" icon={<AlertCircle className="text-red-600" />} />
        <KPICard title="Ventas Totales" value="210" icon={<TrendingUp className="text-purple-600" />} />
      </div>

      {/* Gráfico y Actividad Reciente */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h2 className="font-bold text-slate-800 mb-6">Evolución de Ventas (S/)</h2>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} stroke="#94a3b8" fontSize={12} />
                <YAxis axisLine={false} tickLine={false} stroke="#94a3b8" fontSize={12} />
                <Tooltip cursor={{ fill: '#f8fafc' }} />
                <Bar dataKey="ventas" radius={[4, 4, 0, 0]}>
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === data.length - 1 ? '#059669' : '#cbd5e1'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="font-bold text-slate-800 mb-4">Últimas Cobranzas</h2>
            <div className="space-y-3">
              <ActividadItem nombre="Juan Pérez" monto="S/ 850" fecha="Hoy, 04:30 PM" />
              <ActividadItem nombre="María López" monto="S/ 1,200" fecha="Ayer, 11:15 AM" />
              <ActividadItem nombre="Carlos Ruiz" monto="S/ 950" fecha="Ayer, 09:00 AM" />
            </div>
          </div>
          <button className="w-full text-center text-sm font-medium text-emerald-600 hover:text-emerald-700 mt-4 pt-3 border-t border-slate-100 transition-colors">
            Ver todas las transacciones
          </button>
        </div>
      </div>
    </div>
  );
}

function KPICard({ title, value, icon }: { title: string, value: string, icon: JSX.Element }) {
  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
      <div className="p-3 bg-slate-50 rounded-lg">{icon}</div>
      <div>
        <p className="text-sm text-slate-500 font-medium">{title}</p>
        <h3 className="text-2xl font-bold text-slate-800 mt-0.5">{value}</h3>
      </div>
    </div>
  );
}

function ActividadItem({ nombre, monto, fecha }: { nombre: string, monto: string, fecha: string }) {
  return (
    <div className="flex justify-between items-center py-2.5 border-b border-slate-50 last:border-0">
      <div>
        <p className="text-sm font-semibold text-slate-800">{nombre}</p>
        <p className="text-xs text-slate-400 mt-0.5">{fecha}</p>
      </div>
      <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">{monto}</span>
    </div>
  );
}