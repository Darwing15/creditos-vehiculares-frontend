import { X, Printer, CheckCircle, Clock, AlertCircle } from 'lucide-react';

interface ModalPlanPagosProps {
    isOpen: boolean;
    onClose: () => void;
    credito: any; // Aquí reemplazas con tu tipo/interfaz real más adelante
}

// Mock de cuotas para el diseño
const mockCuotas = [
    { nro: 1, fecha: '15/10/2023', monto: 450.00, estado: 'Pagado', fechaPago: '14/10/2023' },
    { nro: 2, fecha: '15/11/2023', monto: 450.00, estado: 'Pagado', fechaPago: '15/11/2023' },
    { nro: 3, fecha: '15/12/2023', monto: 450.00, estado: 'Pendiente', fechaPago: '-' },
    { nro: 4, fecha: '15/01/2024', monto: 450.00, estado: 'Pendiente', fechaPago: '-' },
    { nro: 5, fecha: '15/02/2024', monto: 450.00, estado: 'Pendiente', fechaPago: '-' },
    { nro: 6, fecha: '15/03/2024', monto: 450.00, estado: 'Pendiente', fechaPago: '-' },
];

export default function ModalPlanPagos({ isOpen, onClose, credito }: ModalPlanPagosProps) {
    if (!isOpen || !credito) return null;

    return (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200">

                {/* Cabecera del Modal */}
                <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 bg-slate-50 flex-shrink-0">
                    <div>
                        <h2 className="text-xl font-bold text-slate-800">Plan de Pagos</h2>
                        <p className="text-sm text-slate-500 mt-1">Crédito {credito.id} - {credito.cliente}</p>
                    </div>
                    <button onClick={onClose} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Resumen Superior */}
                <div className="px-6 py-4 grid grid-cols-2 md:grid-cols-4 gap-4 bg-white border-b border-slate-100 flex-shrink-0">
                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                        <p className="text-xs text-slate-500 uppercase font-semibold">Vehículo</p>
                        <p className="text-sm font-medium text-slate-800 mt-1">{credito.vehiculo}</p>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                        <p className="text-xs text-slate-500 uppercase font-semibold">Monto Total</p>
                        <p className="text-sm font-medium text-slate-800 mt-1">{credito.monto}</p>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                        <p className="text-xs text-slate-500 uppercase font-semibold">Plazo</p>
                        <p className="text-sm font-medium text-slate-800 mt-1">{credito.plazo}</p>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                        <p className="text-xs text-slate-500 uppercase font-semibold">Estado</p>
                        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-emerald-100 text-emerald-700 mt-1">
                            {credito.estado}
                        </span>
                    </div>
                </div>

                {/* Tabla de Cuotas (Área scrolleable) */}
                <div className="flex-1 overflow-auto p-4 sm:p-6 bg-slate-50/50">
                    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse min-w-[800px]">
                                <thead>
                                    <tr className="bg-slate-50 border-b border-slate-200 text-sm text-slate-600">
                                        <th className="py-3 px-4 font-semibold whitespace-nowrap">N° Cuota</th>
                                        <th className="py-3 px-4 font-semibold whitespace-nowrap">Vencimiento</th>
                                        <th className="py-3 px-4 font-semibold whitespace-nowrap">Monto (S/)</th>
                                        <th className="py-3 px-4 font-semibold whitespace-nowrap">Fecha Pago</th>
                                        <th className="py-3 px-4 font-semibold whitespace-nowrap">Estado</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 text-sm">
                                    {mockCuotas.map((cuota) => (
                                        <tr key={cuota.nro} className="hover:bg-slate-50/80 transition-colors">
                                            <td className="py-3 px-4 text-slate-600 font-medium">{cuota.nro}</td>
                                            <td className="py-3 px-4 text-slate-700">{cuota.fecha}</td>
                                            <td className="py-3 px-4 text-slate-800 font-semibold">{cuota.monto.toFixed(2)}</td>
                                            <td className="py-3 px-4 text-slate-500">{cuota.fechaPago}</td>
                                            <td className="py-3 px-4">
                                                {cuota.estado === 'Pagado' && (
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                                                        <CheckCircle size={14} /> Pagado
                                                    </span>
                                                )}
                                                {cuota.estado === 'Pendiente' && (
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
                                                        <Clock size={14} /> Pendiente
                                                    </span>
                                                )}
                                                {cuota.estado === 'Vencido' && (
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-red-50 text-red-700 border border-red-200">
                                                        <AlertCircle size={14} /> Vencido
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Footer del Modal */}
                <div className="px-6 py-4 border-t border-slate-100 bg-white flex justify-between items-center flex-shrink-0">
                    <button className="flex items-center gap-2 text-slate-600 hover:text-indigo-600 font-medium text-sm transition-colors">
                        <Printer size={18} /> Imprimir Cronograma
                    </button>
                    <button onClick={onClose} className="px-5 py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-sm font-medium shadow-sm transition-colors">
                        Cerrar Ventana
                    </button>
                </div>

            </div>
        </div>
    );
}