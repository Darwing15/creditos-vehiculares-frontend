import { X, UserPlus, Key } from 'lucide-react';

interface ModalNuevoUsuarioProps {
    isOpen: boolean;
    onClose: () => void;
    usuario: any; // Aquí luego mapearás tu interfaz/tipo Usuario real
}

export default function ModalNuevoUsuario({ isOpen, onClose, usuario }: ModalNuevoUsuarioProps) {
    if (!isOpen) return null;

    const isEdit = !!usuario;

    return (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            {/* Contenedor del Modal con scroll adaptativo controlado */}
            <div className="bg-white rounded-xl shadow-xl w-full max-w-lg border border-slate-200 flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200">

                {/* Cabecera */}
                <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 bg-slate-50 flex-shrink-0">
                    <div className="flex items-center gap-2">
                        <UserPlus className="text-emerald-600" size={20} />
                        <h2 className="text-lg font-bold text-slate-800">
                            {isEdit ? `Editar Usuario: ${usuario.nombre}` : 'Registrar Nuevo Colaborador'}
                        </h2>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Formulario */}
                <form className="flex flex-col flex-1 overflow-hidden" onSubmit={(e) => e.preventDefault()}>

                    {/* Cuerpo con Scroll Técnico Interno */}
                    <div className="p-6 space-y-5 overflow-y-auto flex-1 bg-white">

                        {/* Sección 1: Datos Personales */}
                        <div className="space-y-4">
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">1. Datos Personales</h3>

                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-slate-600">Nombre Completo</label>
                                <input
                                    type="text"
                                    required
                                    defaultValue={usuario?.nombre || ''}
                                    placeholder="Ej: Juan Pérez Prado"
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-slate-600">Correo Electrónico (Acceso)</label>
                                <input
                                    type="email"
                                    required
                                    defaultValue={usuario?.email || ''}
                                    placeholder="juan.perez@empresa.com"
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                                />
                            </div>
                        </div>

                        <hr className="border-slate-100" />

                        {/* Sección 2: Credenciales de Acceso */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-1.5">
                                <Key size={14} className="text-slate-400" />
                                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">2. Seguridad</h3>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-slate-600">
                                    {isEdit ? 'Nueva Contraseña (Opcional)' : 'Contraseña Inicial'}
                                </label>
                                <input
                                    type="password"
                                    required={!isEdit}
                                    placeholder={isEdit ? 'Dejar en blanco para no cambiar' : 'Mínimo 8 caracteres'}
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                                />
                            </div>
                        </div>

                        <hr className="border-slate-100" />

                        {/* Sección 3: Permisos de Operación */}
                        <div className="space-y-4">
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">3. Asignación de Roles y Sedes</h3>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-slate-600">Rol del Sistema</label>
                                    <select
                                        required
                                        defaultValue={usuario?.rol || ''}
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
                                    >
                                        <option value="">Seleccionar...</option>
                                        <option value="Administrador">Administrador (Acceso Total)</option>
                                        <option value="Asesor Comercial">Asesor de Ventas</option>
                                        <option value="Analista de Crédito">Analista de Riesgos</option>
                                        <option value="Cajero">Cajero / Tesorero</option>
                                        <option value="Gestor de Cobranza">Gestor de Cobranzas</option>
                                    </select>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-slate-600">Sucursal Base</label>
                                    <select
                                        required
                                        defaultValue={usuario?.sucursal ? 'central' : ''}
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
                                    >
                                        <option value="">Seleccionar...</option>
                                        <option value="central">Sede Central (Tocache)</option>
                                        <option value="ate">Sucursal Tingo María</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                            <strong>Nota de Auditoría:</strong> Todo usuario creado quedará registrado bajo criptografía BCrypt en el backend y sus acciones serán guardadas en el log de trazabilidad del sistema.
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
                            {isEdit ? 'Guardar Cambios' : 'Crear Colaborador'}
                        </button>
                    </div>
                </form>

            </div>
        </div>
    );
}