import { useState } from 'react';
import {
    Store,
    Plus,
    MapPin,
    Phone,
    User,
    Edit3,
    Coins,
    Building2,
    Search,
    CheckCircle,
    XCircle
} from 'lucide-react';
import ModalNuevaSucursal from '../components/ModalNuevaSucursal';

const sucursalesIniciales = [
    { id: 1, codigo: 'CENT', nombre: 'Sede Central (Tocahe)', direccion: 'Av. Ricardo Palma 202', telefono: '(042) 715-4000', encargado: 'Rosalina Gonzales Marchena', cajaActual: 'S/ 24,500.00', estado: 'activo' },
    { id: 2, codigo: 'TINGO', nombre: 'Sucursal Tingo María', direccion: 'Av. Nicolás de Ayllón 1245', telefono: '(01) 458-9632', encargado: 'Ronal Sotomayor Gonzales', cajaActual: 'S/ 8,200.00', estado: 'activo' },
];

export default function Sucursales() {
    const [sucursales] = useState(sucursalesIniciales);
    const [modalOpen, setModalOpen] = useState(false);
    const [sucursalEdicion, setSucursalEdicion] = useState<any>(null);

    const abrirModalNueva = () => {
        setSucursalEdicion(null);
        setModalOpen(true);
    };

    const abrirModalEditar = (sucursal: any) => {
        setSucursalEdicion(sucursal);
        setModalOpen(true);
    };

    return (
        <div className="p-6 space-y-6">

            {/* Encabezado */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Estructura Organizacional (Sucursales)</h1>
                    <p className="text-slate-500">Monitorea y configura los centros de costos y puntos de venta del negocio</p>
                </div>
                <button
                    onClick={abrirModalNueva}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all font-medium shadow-sm"
                >
                    <Plus size={18} /> Agregar Sucursal
                </button>
            </div>

            {/* Buscador de Sucursales */}
            <div className="bg-white p-4 border border-slate-200 rounded-xl shadow-sm flex items-center">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Buscar sucursal por nombre, ciudad o código..."
                        className="w-full pl-9 pr-4 py-1.5 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                    />
                </div>
            </div>

            {/* Grid Dinámico de Sedes */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {sucursales.map((s) => (
                    <div
                        key={s.id}
                        className={`bg-white border rounded-xl shadow-sm overflow-hidden flex flex-col transition-all hover:shadow-md ${s.estado === 'activo' ? 'border-slate-200' : 'border-slate-200 opacity-75'
                            }`}
                    >
                        {/* Encabezado de la Tarjeta */}
                        <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-start">
                            <div className="space-y-1">
                                <span className="inline-block px-2 py-0.5 bg-slate-200 text-slate-700 font-mono text-[10px] font-bold rounded">
                                    {s.codigo}
                                </span>
                                <h3 className="font-bold text-slate-800 text-base">{s.nombre}</h3>
                            </div>

                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold ${s.estado === 'activo' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                                }`}>
                                {s.estado === 'activo' ? <CheckCircle size={11} /> : <XCircle size={11} />}
                                {s.estado === 'activo' ? 'Operando' : 'Cerrada'}
                            </span>
                        </div>

                        {/* Detalles / Cuerpo Informativo */}
                        <div className="p-5 flex-1 space-y-3.5 text-sm text-slate-600">
                            <div className="flex items-start gap-2.5">
                                <MapPin size={16} className="text-slate-400 flex-shrink-0 mt-0.5" />
                                <span className="text-xs leading-relaxed">{s.direccion}</span>
                            </div>

                            <div className="flex items-center gap-2.5">
                                <Phone size={15} className="text-slate-400 flex-shrink-0" />
                                <span className="text-xs">{s.telefono}</span>
                            </div>

                            <div className="flex items-center gap-2.5">
                                <User size={15} className="text-slate-400 flex-shrink-0" />
                                <span className="text-xs font-medium text-slate-700">Líder: {s.encargado}</span>
                            </div>

                            {/* Caja Chica / Saldo Financiero Integrado de la Sede */}
                            <div className="mt-4 p-3 bg-slate-50 border border-slate-100 rounded-lg flex justify-between items-center">
                                <div className="flex items-center gap-2 text-slate-500">
                                    <Coins size={16} className="text-slate-400" />
                                    <span className="text-xs">Efectivo en Caja</span>
                                </div>
                                <span className={`font-bold font-mono text-sm ${s.estado === 'activo' ? 'text-slate-800' : 'text-slate-400'
                                    }`}>
                                    {s.cajaActual}
                                </span>
                            </div>
                        </div>

                        {/* Base de la tarjeta: Botones de Acción */}
                        <div className="px-5 py-3.5 bg-slate-50/70 border-t border-slate-100 flex justify-end gap-2">
                            <button
                                onClick={() => abrirModalEditar(s)}
                                className="text-xs font-medium text-indigo-600 hover:text-indigo-800 bg-white border border-slate-200 px-3 py-1.5 rounded-md shadow-xs hover:bg-slate-50 transition-colors flex items-center gap-1"
                            >
                                <Edit3 size={13} /> Configurar Sede
                            </button>
                        </div>

                    </div>
                ))}
            </div>

            {/* Modal Desplegable Separado */}
            <ModalNuevaSucursal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                sucursal={sucursalEdicion}
            />
        </div>
    );
}