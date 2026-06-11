import { X, Calendar, Mail, FileText, Clock } from 'lucide-react';

interface ModalProgramarReporteProps {
    isOpen: boolean;
    onClose: () => void;
    reporteSeleccionado: string | null;
}

export default function ModalProgramarReporte({ isOpen, onClose, reporteSeleccionado }: ModalProgramarReporteProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-lg border border-slate-200 flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200">

                {/* Cabecera */}
                <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 bg-slate-50 flex-shrink-0">
                    <div className="flex items-center gap-2">
                        <Calendar className="text-indigo-600" size={20} />
                        <h2 className="text-lg font-bold text-slate-800">Programar Envío Automático</h2>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Formulario */}
                <form className="flex flex-col flex-1 overflow-hidden" onSubmit={(e) => e.preventDefault()}>
                    <div className="p-6 space-y-5 overflow-y-auto flex-1 bg-white">

                        {/* Reporte Objetivo */}
                        <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                            <span className="text-xs text-slate-400 font-medium block">Reporte a automatizar:</span>
                            <span className="text-sm font-semibold text-slate-700 flex items-center gap-1.5 mt-0.5">
                                <FileText size={14} className="text-indigo-500" />
                                {reporteSeleccionado || 'Ninguno seleccionado'}
                            </span>
                        </div>

                        {/* Frecuencia temporal */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-600 flex items-center gap-1">
                                <Clock size={13} /> Frecuencia de Envío
                            </label>
                            <select required className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-indigo-500 outline-none">
                                <option value="diario">Todos los días (Cierre de caja - 7:00 PM)</option>
                                <option value="semanal">Cada Lunes por la mañana (8:00 AM)</option>
                                <option value="mensual">El 1ro de cada mes (Balance General)</option>
                            </select>
                        </div>

                        {/* Destinatarios */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-600 flex items-center gap-1">
                                <Mail size={13} /> Correos Electrónicos Destinatarios
                            </label>
                            <input
                                type="text"
                                required
                                placeholder="ejemplo: gerencia@empresa.com, finanzas@empresa.com"
                                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                            />
                            <p className="text-[11px] text-slate-400">Separa múltiples correos electrónicos utilizando comas (,)</p>
                        </div>

                        {/* Formato del archivo */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-600">Formato del Adjunto</label>
                            <div className="grid grid-cols-2 gap-3">
                                <label className="border border-slate-200 rounded-lg p-3 flex items-center gap-2 cursor-pointer hover:bg-slate-50 transition-colors">
                                    <input type="radio" name="formato" defaultChecked className="text-indigo-600 focus:ring-indigo-500" />
                                    <div>
                                        <span className="text-xs font-bold block text-slate-700">Microsoft Excel</span>
                                        <span className="text-[10px] text-slate-400">(.xlsx) Ideal para datos</span>
                                    </div>
                                </label>
                                <label className="border border-slate-200 rounded-lg p-3 flex items-center gap-2 cursor-pointer hover:bg-slate-50 transition-colors">
                                    <input type="radio" name="formato" className="text-indigo-600 focus:ring-indigo-500" />
                                    <div>
                                        <span className="text-xs font-bold block text-slate-700">Documento PDF</span>
                                        <span className="text-[10px] text-slate-400">(.pdf) Listo para imprimir</span>
                                    </div>
                                </label>
                            </div>
                        </div>

                    </div>

                    {/* Botones */}
                    <div className="flex justify-end gap-3 px-6 py-4 border-t border-slate-100 bg-slate-50 flex-shrink-0">
                        <button type="button" onClick={onClose} className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
                            Cancelar
                        </button>
                        <button type="submit" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium shadow-sm transition-colors">
                            Activar Tarea Programada
                        </button>
                    </div>
                </form>

            </div>
        </div>
    );
}