import { useState } from 'react';
import {
    BarChart3,
    FileSpreadsheet,
    Download,
    CalendarRange,
    Store,
    ShieldAlert,
    TrendingUp,
    Users,
    RefreshCw,
    Clock
} from 'lucide-react';
import ModalProgramarReporte from '../components/ModalProgramarReporte';

// Listado estructurado de reportes estratégicos del negocio
const catalogoReportes = [
    { id: 'rep-coloc', categoria: 'financiero', titulo: 'Colocación de Créditos', desc: 'Resumen global de montos financiados e intereses proyectados.', icon: TrendingUp, color: 'text-emerald-600 bg-emerald-50' },
    { id: 'rep-mora', categoria: 'riesgos', titulo: 'Reporte de Mora y Carteras', desc: 'Identificación de clientes con cuotas vencidas agrupadas por tramos (30, 60, 90+ días).', icon: ShieldAlert, color: 'text-rose-600 bg-rose-50' },
    { id: 'rep-asesor', categoria: 'operativo', titulo: 'Eficiencia de Asesores', desc: 'Ranking de solicitudes ingresadas vs. aprobadas por ejecutivo comercial.', icon: Users, color: 'text-blue-600 bg-blue-50' },
];

// Datos ficticios para la grilla de vista previa en pantalla
const datosMockPreview = [
    { fecha: '2026-06-01', sucursal: 'Sede Central', cliente: 'Roberto Vega Prado', vehiculo: 'Honda CB190R', financiado: 'S/ 8,500.00', riesgo: 'Bajo' },
    { fecha: '2026-06-03', sucursal: 'Sucursal Tingo María', cliente: 'Elena Gomez Soto', vehiculo: 'Bajaj Pulsar NS200', financiado: 'S/ 11,200.00', riesgo: 'Medio' },
    { fecha: '2026-06-05', sucursal: 'Sede Central', cliente: 'Marcos Diaz Tello', vehiculo: 'Yamaha FZ25', financiado: 'S/ 14,000.00', riesgo: 'Bajo' },
];

export default function Reportes() {
    const [reporteSeleccionado, setReporteSeleccionado] = useState(catalogoReportes[0].titulo);
    const [modalOpen, setModalOpen] = useState(false);

    const handleProgramar = (titulo: string) => {
        setReporteSeleccionado(titulo);
        setModalOpen(true);
    };

    return (
        <div className="p-6 space-y-6">

            {/* Encabezado */}
            <div>
                <h1 className="text-2xl font-bold text-slate-800">Centro de Reportes e Inteligencia</h1>
                <p className="text-slate-500">Genera auditorías, analiza carteras de riesgo y exporta datos fiscales oficiales</p>
            </div>

            {/* Panel de Filtros Globales de Consulta */}
            <div className="bg-white p-4 border border-slate-200 rounded-xl shadow-sm grid grid-cols-1 md:grid-cols-3 gap-4">

                <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-600 flex items-center gap-1">
                        <CalendarRange size={14} className="text-slate-400" /> Rango de Fechas
                    </label>
                    <input
                        type="date"
                        className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-sm bg-white outline-none focus:ring-2 focus:ring-indigo-500 text-slate-700"
                    />
                </div>

                <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-600 flex items-center gap-1">
                        <Store size={14} className="text-slate-400" /> Filtrar por Sucursal
                    </label>
                    <select className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-sm bg-white outline-none focus:ring-2 focus:ring-indigo-500 text-slate-700">
                        <option value="todas">Consolidado Nacional (Todas)</option>
                        <option value="central">Sede Central (Tocache)</option>
                        <option value="ate">Sucursal Tingo María</option>
                    </select>
                </div>

                <div className="flex items-end">
                    <button className="w-full bg-slate-800 hover:bg-slate-900 text-white text-sm font-medium py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-sm">
                        <RefreshCw size={15} /> Procesar Datos del Servidor
                    </button>
                </div>

            </div>

            {/* Grid del Catálogo de Reportes Disponibles */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {catalogoReportes.map((rep) => {
                    const IconComponent = rep.icon;
                    return (
                        <div
                            key={rep.id}
                            onClick={() => setReporteSeleccionado(rep.titulo)}
                            className={`p-5 bg-white border rounded-xl shadow-sm flex flex-col justify-between cursor-pointer transition-all hover:border-indigo-300 ${reporteSeleccionado === rep.titulo ? 'ring-2 ring-indigo-500/20 border-indigo-500' : 'border-slate-200'
                                }`}
                        >
                            <div className="space-y-3">
                                <div className={`w-10 h-10 ${rep.color} rounded-lg flex items-center justify-center`}>
                                    <IconComponent size={20} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-800 text-sm">{rep.titulo}</h3>
                                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">{rep.desc}</p>
                                </div>
                            </div>

                            {/* Botón de acciones del reporte */}
                            <div className="mt-5 pt-3 border-t border-slate-100 flex justify-between items-center">
                                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                                    {rep.categoria}
                                </span>
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation(); // Evita seleccionar la tarjeta al hacer clic en el reloj
                                        handleProgramar(rep.titulo);
                                    }}
                                    className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-slate-50 rounded transition-colors"
                                    title="Programar envío automático por correo"
                                >
                                    <Clock size={15} />
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Panel Inferior: Vista Previa y Exportación */}
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">

                {/* Cabecera del Panel de Vista Previa */}
                <div className="px-6 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
                    <div>
                        <div className="flex items-center gap-2">
                            <BarChart3 className="text-indigo-500" size={16} />
                            <h3 className="font-bold text-slate-800 text-sm">Vista Previa: {reporteSeleccionado}</h3>
                        </div>
                        <p className="text-xs text-slate-400">Muestra los primeros 3 registros encontrados bajo los criterios actuales</p>
                    </div>

                    {/* Botones de Descarga en Formatos Oficiales */}
                    <div className="flex items-center gap-2">
                        <button className="px-3 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors">
                            <FileSpreadsheet size={14} /> Exportar Excel (.xlsx)
                        </button>
                        <button className="px-3 py-1.5 bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors">
                            <Download size={14} /> Descargar PDF (.pdf)
                        </button>
                    </div>
                </div>

                {/* Tabla de Muestra */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 text-slate-400 uppercase text-[10px] font-bold tracking-wider border-b border-slate-100">
                                <th className="px-6 py-2.5">Fecha</th>
                                <th className="px-6 py-2.5">Sucursal</th>
                                <th className="px-6 py-2.5">Cliente Titular</th>
                                <th className="px-6 py-2.5">Modelo Vehículo</th>
                                <th className="px-6 py-2.5">Monto Financiado</th>
                                <th className="px-6 py-2.5">Clasificación Riesgo</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-xs text-slate-600">
                            {datosMockPreview.map((row, i) => (
                                <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-3 font-mono">{row.fecha}</td>
                                    <td className="px-6 py-3 font-medium text-slate-700">{row.sucursal}</td>
                                    <td className="px-6 py-3">{row.cliente}</td>
                                    <td className="px-6 py-3">{row.vehiculo}</td>
                                    <td className="px-6 py-3 font-mono font-semibold text-slate-800">{row.financiado}</td>
                                    <td className="px-6 py-3">
                                        <span className={`px-2 py-0.5 rounded font-medium text-[10px] ${row.riesgo === 'Bajo' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                                            }`}>
                                            {row.riesgo}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 text-[11px] text-slate-400 text-right">
                    Para ver el universo completo de datos ({datosMockPreview.length * 42} filas estimadas), descargue el documento en formato Excel o PDF.
                </div>

            </div>

            <ModalProgramarReporte
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                reporteSeleccionado={reporteSeleccionado}
            />

        </div>
    );
}