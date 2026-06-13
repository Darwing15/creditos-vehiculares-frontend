import { useState } from 'react';
import {
    DollarSign,
    TrendingUp,
    TrendingDown,
    Unlock,
    Lock,
    PlusCircle,
    ArrowUpRight,
    ArrowDownRight,
    Search,
    Filter,
    Printer,
    FileSpreadsheet
} from 'lucide-react';
import ModalMovimientoCaja from '../components/ModalMovimientoCaja';

// Datos de ejemplo para simular el flujo diario de la tienda
const movimientosIniciales = [
    { id: 'REC-0024', hora: '11:15 AM', tipo: 'ingreso', concepto: 'Cuota Inicial - Pulsar NS200 (Cliente: Juan Quispe)', metodo: 'Efectivo', monto: 3500.00 },
    { id: 'REC-0023', hora: '10:30 AM', tipo: 'ingreso', concepto: 'Pago Cuota 03 - Crédito #1042 (Cliente: Ana Flores)', metodo: 'Transferencia BCP', monto: 480.00 },
    { id: 'EGR-0012', hora: '09:45 AM', tipo: 'egreso', concepto: 'Pago de servicios - Luz comercial', metodo: 'Efectivo', monto: 250.00 },
    { id: 'REC-0022', hora: '09:15 AM', tipo: 'ingreso', concepto: 'Pago Cuota 01 - Crédito #1089 (Cliente: Carlos Mendoza)', metodo: 'Yape', monto: 520.00 },
    { id: 'EGR-0011', hora: '08:30 AM', tipo: 'egreso', concepto: 'Gasto de Caja Chica - Artículos de limpieza', metodo: 'Efectivo', monto: 45.00 },
];

export default function Caja() {
    const [cajaAbierta, setCajaAbierta] = useState(true);
    const [movimientos] = useState(movimientosIniciales);
    const [modalOpen, setModalOpen] = useState(false);
    const [tipoMovimiento, setTipoMovimiento] = useState<'ingreso' | 'egreso'>('ingreso');

    const abrirModal = (tipo: 'ingreso' | 'egreso') => {
        setTipoMovimiento(tipo);
        setModalOpen(true);
    };

    return (
        <div className="p-6 space-y-6">

            {/* Encabezado Principal */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Control de Caja Chica</h1>
                    <p className="text-slate-500">Gestión de ingresos, egresos diarios y arqueo de caja</p>
                </div>

                {/* Acciones de Apertura/Cierre */}
                <div className="flex items-center gap-3">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${cajaAbierta ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}>
                        <span className={`w-2 h-2 rounded-full ${cajaAbierta ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                        Caja {cajaAbierta ? 'Abierta' : 'Cerrada'}
                    </span>

                    <button
                        onClick={() => setCajaAbierta(!cajaAbierta)}
                        className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg shadow-sm border transition-colors ${cajaAbierta
                            ? 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                            : 'bg-slate-800 text-white border-transparent hover:bg-slate-900'
                            }`}
                    >
                        {cajaAbierta ? (
                            <>
                                <Lock size={16} /> Realizar Arqueo y Cerrar
                            </>
                        ) : (
                            <>
                                <Unlock size={16} /> Abrir Caja del Día
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Tarjetas de Indicadores Financieros */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

                {/* Saldo Disponible */}
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                    <div className="space-y-1">
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Saldo Disponible</p>
                        <h3 className="text-2xl font-bold text-slate-800">S/ 4,205.00</h3>
                    </div>
                    <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                        <DollarSign size={24} />
                    </div>
                </div>

                {/* Ingresos del Día */}
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                    <div className="space-y-1">
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Ingresos del Día</p>
                        <h3 className="text-2xl font-bold text-emerald-600">S/ 4,500.00</h3>
                    </div>
                    <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                        <TrendingUp size={24} />
                    </div>
                </div>

                {/* Egresos del Día */}
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                    <div className="space-y-1">
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Egresos del Día</p>
                        <h3 className="text-2xl font-bold text-rose-600">S/ 295.00</h3>
                    </div>
                    <div className="p-3 bg-rose-50 text-rose-600 rounded-xl">
                        <TrendingDown size={24} />
                    </div>
                </div>

                {/* Saldo de Apertura */}
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                    <div className="space-y-1">
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Monto de Apertura</p>
                        <h3 className="text-2xl font-bold text-slate-500">S/ 0.00</h3>
                    </div>
                    <div className="p-3 bg-slate-50 text-slate-500 rounded-xl">
                        <Unlock size={24} />
                    </div>
                </div>
            </div>

            {/* Operaciones de Movimientos Rápidos */}
            {cajaAbierta && (
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col md:flex-row gap-4 justify-between items-center">
                    <div className="text-sm text-slate-600 text-center md:text-left">
                        <span className="font-bold text-slate-800">Operaciones Rápidas de Caja:</span> Registre inmediatamente salidas o entradas excepcionales de dinero.
                    </div>
                    <div className="flex gap-3 w-full md:w-auto">
                        <button
                            onClick={() => abrirModal('ingreso')}
                            className="flex-1 md:flex-initial bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 text-sm font-medium transition-colors shadow-sm"
                        >
                            <PlusCircle size={18} /> Registrar Ingreso
                        </button>
                        <button
                            onClick={() => abrirModal('egreso')}
                            className="flex-1 md:flex-initial bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 text-sm font-medium transition-colors shadow-sm"
                        >
                            <PlusCircle size={18} /> Registrar Egreso
                        </button>
                    </div>
                </div>
            )}

            {/* Tabla de Movimientos */}
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">

                {/* Filtros de la Tabla */}
                <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-50/50">
                    <div className="relative w-full sm:w-72">
                        <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Buscar movimiento..."
                            className="w-full pl-9 pr-4 py-1.5 border border-slate-200 rounded-lg text-sm bg-white outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                    </div>

                    <div className="flex gap-2 w-full sm:w-auto justify-end">
                        <button className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600 transition-colors" title="Filtrar">
                            <Filter size={18} />
                        </button>
                        <button className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600 transition-colors" title="Exportar Excel">
                            <FileSpreadsheet size={18} />
                        </button>
                    </div>
                </div>

                {/* Tabla Responsiva */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 text-slate-400 uppercase text-[10px] font-bold tracking-wider border-b border-slate-100">
                                <th className="px-6 py-3">ID Recibo</th>
                                <th className="px-6 py-3">Hora</th>
                                <th className="px-6 py-3">Tipo</th>
                                <th className="px-6 py-3">Concepto / Detalle</th>
                                <th className="px-6 py-3">Método</th>
                                <th className="px-6 py-3 text-right">Monto</th>
                                <th className="px-6 py-3 text-center">Acción</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-sm">
                            {movimientos.map((m) => (
                                <tr key={m.id} className="hover:bg-slate-50/70 transition-colors">
                                    <td className="px-6 py-3.5 font-mono font-medium text-slate-600">{m.id}</td>
                                    <td className="px-6 py-3.5 text-slate-500 whitespace-nowrap">{m.hora}</td>
                                    <td className="px-6 py-3.5">
                                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${m.tipo === 'ingreso' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                                            }`}>
                                            {m.tipo === 'ingreso' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                                            {m.tipo === 'ingreso' ? 'Ingreso' : 'Egreso'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-3.5 font-medium text-slate-700 min-w-[300px] whitespace-normal break-words">{m.concepto}</td>
                                    <td className="px-6 py-3.5 text-slate-500">{m.metodo}</td>
                                    <td className={`px-6 py-3.5 text-right font-bold whitespace-nowrap ${m.tipo === 'ingreso' ? 'text-emerald-600' : 'text-rose-600'
                                        }`}>
                                        {m.tipo === 'ingreso' ? '+' : '-'} S/ {m.monto.toFixed(2)}
                                    </td>
                                    <td className="px-6 py-3.5 text-center">
                                        <button className="text-slate-400 hover:text-indigo-600 transition-colors" title="Imprimir Ticket">
                                            <Printer size={16} className="mx-auto" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <ModalMovimientoCaja
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                tipo={tipoMovimiento}
            />
        </div>
    );
}