import { X, Store, MapPin, Phone, User, Hash } from 'lucide-react';

interface ModalSucursalProps {
    isOpen: boolean;
    onClose: () => void;
    sucursal: any; // Mapear luego a tu modelo real de Sucursal
}

export default function ModalNuevaSucursal({ isOpen, onClose, sucursal }: ModalSucursalProps) {
    if (!isOpen) return null;

    const isEdit = !!sucursal;

    return (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            {/* Contenedor con Scroll Interno Seguro */}
            <div className="bg-white rounded-xl shadow-xl w-full max-w-lg border border-slate-200 flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200">

                {/* Cabecera */}
                <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 bg-slate-50 flex-shrink-0">
                    <div className="flex items-center gap-2">
                        <Store className="text-emerald-600" size={20} />
                        <h2 className="text-lg font-bold text-slate-800">
                            {isEdit ? `Modificar Sede: ${sucursal.nombre}` : 'Registrar Nueva Sucursal'}
                        </h2>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Formulario */}
                <form className="flex flex-col flex-1 overflow-hidden" onSubmit={(e) => e.preventDefault()}>

                    {/* Cuerpo con Scroll Técnico */}
                    <div className="p-6 space-y-5 overflow-y-auto flex-1 bg-white">

                        {/* Sección 1: Identificación de la Sede */}
                        <div className="space-y-4">
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">1. Identificación Comercial</h3>

                            <div className="grid grid-cols-3 gap-4">
                                <div className="col-span-2 space-y-1.5">
                                    <label className="text-xs font-semibold text-slate-600">Nombre de la Sucursal</label>
                                    <input
                                        type="text"
                                        required
                                        defaultValue={sucursal?.nombre || ''}
                                        placeholder="Ej: Sucursal Ate - Vitarte"
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-slate-600 flex items-center gap-1">
                                        <Hash size={12} /> Prefijo/Código
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        maxLength={4}
                                        defaultValue={sucursal?.codigo || ''}
                                        placeholder="Ej: ATE1"
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500 bg-white font-mono uppercase text-center"
                                    />
                                </div>
                            </div>
                        </div>

                        <hr className="border-slate-100" />

                        {/* Sección 2: Ubicación y Contacto */}
                        <div className="space-y-4">
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">2. Ubicación y Contacto</h3>

                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-slate-600 flex items-center gap-1">
                                    <MapPin size={13} className="text-slate-400" /> Dirección Fiscal/Física
                                </label>
                                <input
                                    type="text"
                                    required
                                    defaultValue={sucursal?.direccion || ''}
                                    placeholder="Av. Nicolás de Ayllón 1245, Ate, Lima"
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-slate-600 flex items-center gap-1">
                                        <Phone size={13} className="text-slate-400" /> Teléfono de Sede
                                    </label>
                                    <input
                                        type="tel"
                                        required
                                        defaultValue={sucursal?.telefono || ''}
                                        placeholder="(01) 458-9632"
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-slate-600 flex items-center gap-1">
                                        <User size={13} className="text-slate-400" /> Administrador / Encargado
                                    </label>
                                    <select
                                        required
                                        defaultValue={sucursal?.encargado || ''}
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
                                    >
                                        <option value="">Asignar un líder...</option>
                                        <option value="Carlos Mendoza">Rosalina Gonzales Marchena</option>
                                        <option value="Juan Quispe Vega">Ronal Sotomayor Gonzales</option>
                                        <option value="Milagros Rivas">Wendy Sotomayor Gonzales</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <hr className="border-slate-100" />

                        {/* Sección 3: Meta Mensual de Colocación Créditos */}
                        <div className="space-y-3">
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">3. Indicadores de Rendimiento (KPI)</h3>
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-slate-600">Meta Mensual de Financiamiento (S/)</label>
                                <div className="relative rounded-lg shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <span className="text-slate-400 text-sm">S/</span>
                                    </div>
                                    <input
                                        type="number"
                                        placeholder="50,000.00"
                                        className="w-full pl-8 pr-4 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                                    />
                                </div>
                                <p className="text-[11px] text-slate-400">Ayuda a calcular el porcentaje de cumplimiento en el Dashboard principal.</p>
                            </div>
                        </div>

                    </div>

                    {/* Botones de Acción */}
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
                            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium shadow-sm transition-colors"
                        >
                            {isEdit ? 'Actualizar Sede' : 'Crear Sede'}
                        </button>
                    </div>
                </form>

            </div>
        </div>
    );
}