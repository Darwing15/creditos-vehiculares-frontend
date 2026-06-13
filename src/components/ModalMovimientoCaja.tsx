import { X, ArrowUpRight, ArrowDownRight, ReceiptText } from 'lucide-react';
import { useState, useEffect } from 'react';

interface ModalMovimientoProps {
    isOpen: boolean;
    onClose: () => void;
    tipo: 'ingreso' | 'egreso';
}

export default function ModalMovimientoCaja({ isOpen, onClose, tipo }: ModalMovimientoProps) {
    const [metodoPago, setMetodoPago] = useState('');

    // Limpiar estados cuando el modal cambia o se cierra
    useEffect(() => {
        if (!isOpen) setMetodoPago('');
    }, [isOpen]);

    if (!isOpen) return null;

    const isIngreso = tipo === 'ingreso';

    // Conceptos dinámicos según el tipo de movimiento en vehículos menores
    const conceptos = isIngreso
        ? [
            { value: 'cuota_inicial', label: 'Cuota Inicial (Separación/Venta)' },
            { value: 'pago_cuota', label: 'Pago de Cuota Mensual' },
            { value: 'interes_mora', label: 'Cobro de Mora / Gastos Administrativos' },
            { value: 'venta_contado', label: 'Venta de Vehículo al Contado' },
            { value: 'otro_ingreso', label: 'Otros Ingresos de Caja' },
        ]
        : [
            { value: 'gasto_operativo', label: 'Gasto Operativo / Servicios (Luz, Agua, Internet)' },
            { value: 'caja_chica', label: 'Reposición / Gasto de Caja Chica' },
            { value: 'proveedores', label: 'Pago a Proveedores / Trámites SUNARP' },
            { value: 'comisiones', label: 'Pago de Comisiones a Asesores' },
            { value: 'otro_egreso', label: 'Otros Egresos / Salidas Extraordinarias' },
        ];

    return (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            {/* Contenedor del Modal con Alto Máximo y Scroll Seguro */}
            <div className="bg-white rounded-xl shadow-xl w-full max-w-lg border border-slate-200 flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200">

                {/* Cabecera del Modal (Dinámica según Tipo) */}
                <div className={`flex justify-between items-center px-6 py-4 border-b border-slate-100 flex-shrink-0 ${isIngreso ? 'bg-emerald-50/50' : 'bg-rose-50/50'
                    }`}>
                    <div className="flex items-center gap-2">
                        <div className={`p-1.5 rounded-lg ${isIngreso ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                            {isIngreso ? <ArrowUpRight size={18} /> : <ArrowDownRight size={18} />}
                        </div>
                        <h2 className="text-lg font-bold text-slate-800">
                            Registrar {isIngreso ? 'Ingreso de Efectivo / Dinero' : 'Egreso / Salida de Dinero'}
                        </h2>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Formulario */}
                <form className="flex flex-col flex-1 overflow-hidden" onSubmit={(e) => e.preventDefault()}>

                    {/* Cuerpo del Formulario con scroll en pantallas compactas */}
                    <div className="p-6 space-y-5 overflow-y-auto flex-1 bg-white">

                        {/* Campo 1: Monto (Destacado en grande) */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Monto de la Operación (S/)</label>
                            <div className="relative rounded-xl shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <span className={`text-xl font-bold ${isIngreso ? 'text-emerald-600' : 'text-rose-600'}`}>S/</span>
                                </div>
                                <input
                                    type="number"
                                    step="0.01"
                                    required
                                    placeholder="0.00"
                                    className={`w-full pl-11 pr-4 py-3 border text-2xl font-bold rounded-xl outline-none transition-all ${isIngreso
                                            ? 'border-slate-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-emerald-700'
                                            : 'border-slate-200 focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 text-rose-700'
                                        }`}
                                />
                            </div>
                        </div>

                        {/* Campo 2: Concepto / Categoría */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-600">Concepto / Motivo</label>
                            <select required className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-slate-500 outline-none">
                                <option value="">Seleccionar un concepto...</option>
                                {conceptos.map((c) => (
                                    <option key={c.value} value={c.value}>{c.label}</option>
                                ))}
                            </select>
                        </div>

                        {/* Campo 3: Método de Pago */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-600">Método de Movimiento</label>
                            <select
                                required
                                value={metodoPago}
                                onChange={(e) => setMetodoPago(e.target.value)}
                                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-slate-500 outline-none"
                            >
                                <option value="">Seleccionar método...</option>
                                <option value="efectivo">Efectivo en Ventanilla</option>
                                <option value="bcp">Transferencia BCP</option>
                                <option value="bbva">Transferencia BBVA</option>
                                <option value="interbank">Transferencia Interbank</option>
                                <option value="yape">Yape</option>
                                <option value="plin">Plin</option>
                                <option value="tarjeta">Tarjeta Débito / Crédito</option>
                            </select>
                        </div>

                        {/* Campo 4: Condicional - Nro de Operación (Aparece si no es efectivo) */}
                        {metodoPago && metodoPago !== 'efectivo' && (
                            <div className="space-y-1.5 bg-slate-50 p-3 rounded-lg border border-slate-100 animate-in fade-in slide-in-from-top-2 duration-200">
                                <label className="text-xs font-semibold text-slate-600 flex items-center gap-1.5">
                                    <ReceiptText size={14} className="text-slate-400" />
                                    Número de Operación / Referencia Bancaria
                                </label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Ej: 0234159 / YAPE-5489"
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-slate-500 bg-white font-mono uppercase"
                                />
                            </div>
                        )}

                        {/* Campo 5: Detalle / Glosa descriptiva */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-600">Detalle o Glosa Descriptiva</label>
                            <textarea
                                rows={3}
                                required
                                placeholder="Escribe información relevante adicionales (Ej: Nombre del cliente, número de DNI, Chasis de la moto, nro de recibo, etc.)"
                                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-slate-500 bg-white resize-none"
                            />
                        </div>

                    </div>

                    {/* Botones de Acción (Fijos en la base) */}
                    <div className="flex justify-end gap-3 px-6 py-4 border-t border-slate-100 bg-slate-50 flex-shrink-0">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className={`px-4 py-2 text-white rounded-lg text-sm font-medium shadow-sm transition-colors ${isIngreso ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-rose-600 hover:bg-rose-700'
                                }`}
                        >
                            Confirmar {isIngreso ? 'Ingreso' : 'Egreso'}
                        </button>
                    </div>
                </form>

            </div>
        </div>
    );
}