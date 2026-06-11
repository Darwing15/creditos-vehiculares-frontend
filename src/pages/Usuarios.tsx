import { useState } from 'react';
import {
    UserPlus,
    Search,
    Shield,
    Mail,
    MapPin,
    Edit2,
    CheckCircle,
    XCircle,
    X,
    Key,
    ToggleLeft
} from 'lucide-react';
import ModalNuevoUsuario from '../components/ModalNuevoUsuario';

// Datos de ejemplo para la simulación del personal de la empresa
const usuariosIniciales = [
    { id: 1, nombre: 'Rosalina Gonzales Marchena', email: 'nina.g@tienda.com', rol: 'Administrador', sucursal: 'Sede Central (Tocache)', estado: 'activo' },
    { id: 2, nombre: 'Walter Sotomayoy Chambi', email: 'walter.sotomayor@tienda.com', rol: 'Cajero', sucursal: 'Sede Central (Tocache)', estado: 'activo' },
    { id: 3, nombre: 'Ronal Sotomayor Gonzales', email: 'ronal.sotomayor@tienda.com', rol: 'Asesor Comercial', sucursal: 'Sucursal Tingo María', estado: 'activo' },
];

export default function Usuarios() {
    const [usuarios, setUsuarios] = useState(usuariosIniciales);
    const [modalOpen, setModalOpen] = useState(false);
    const [usuarioEdicion, setUsuarioEdicion] = useState<any>(null);

    const abrirModalNuevo = () => {
        setUsuarioEdicion(null);
        setModalOpen(true);
    };

    const abrirModalEditar = (usuario: any) => {
        setUsuarioEdicion(usuario);
        setModalOpen(true);
    };

    return (
        <div className="p-6 space-y-6">

            {/* Encabezado */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Control de Usuarios y Permisos</h1>
                    <p className="text-slate-500">Administra el personal, asigna roles de seguridad y sucursales</p>
                </div>

                <button
                    onClick={abrirModalNuevo}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all font-medium shadow-sm"
                >
                    <UserPlus size={18} /> Registrar Usuario
                </button>
            </div>

            {/* Filtros y Buscador */}
            <div className="bg-white p-4 border border-slate-200 rounded-xl shadow-sm flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Buscar por nombre, correo o rol..."
                        className="w-full pl-9 pr-4 py-1.5 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                    />
                </div>
                <select className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm bg-white outline-none focus:ring-2 focus:ring-emerald-500">
                    <option value="">Todas las Sucursales</option>
                    <option value="central">Sede Central</option>
                    <option value="ate">Sucursal Tingo María</option>
                </select>
                <select className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm bg-white outline-none focus:ring-2 focus:ring-emerald-500">
                    <option value="">Todos los Roles</option>
                    <option value="admin">Administrador</option>
                    <option value="asesor">Asesor Comercial</option>
                    <option value="analista">Analista de Crédito</option>
                    <option value="cajero">Cajero</option>
                </select>
            </div>

            {/* Tabla de Colaboradores */}
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 text-slate-400 uppercase text-[10px] font-bold tracking-wider border-b border-slate-100">
                                <th className="px-6 py-3">Colaborador</th>
                                <th className="px-6 py-3">Rol / Permisos</th>
                                <th className="px-6 py-3">Sucursal Asignada</th>
                                <th className="px-6 py-3">Estado</th>
                                <th className="px-6 py-3 text-center">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-sm">
                            {usuarios.map((u) => (
                                <tr key={u.id} className="hover:bg-slate-50/70 transition-colors">

                                    {/* Info Personal */}
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 bg-slate-100 text-slate-700 font-bold rounded-full flex items-center justify-center text-sm border border-slate-200">
                                                {u.nombre.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-slate-800">{u.nombre}</h4>
                                                <span className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                                                    <Mail size={12} /> {u.email}
                                                </span>
                                            </div>
                                        </div>
                                    </td>

                                    {/* Rol */}
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium ${u.rol === 'Administrador' ? 'bg-purple-50 text-purple-700 border border-purple-100' :
                                            u.rol === 'Analista de Crédito' ? 'bg-blue-50 text-blue-700 border border-blue-100' :
                                                u.rol === 'Cajero' ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                                                    'bg-slate-100 text-slate-700'
                                            }`}>
                                            <Shield size={12} />
                                            {u.rol}
                                        </span>
                                    </td>

                                    {/* Sucursal */}
                                    <td className="px-6 py-4 text-slate-600">
                                        <span className="flex items-center gap-1.5 text-xs font-medium">
                                            <MapPin size={14} className="text-slate-400" />
                                            {u.sucursal}
                                        </span>
                                    </td>

                                    {/* Estado */}
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${u.estado === 'activo' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                                            }`}>
                                            {u.estado === 'activo' ? <CheckCircle size={12} /> : <XCircle size={12} />}
                                            {u.estado === 'activo' ? 'Activo' : 'Inactivo'}
                                        </span>
                                    </td>

                                    {/* Botones de acción */}
                                    <td className="px-6 py-4 text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            <button
                                                onClick={() => abrirModalEditar(u)}
                                                className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded-md transition-colors"
                                                title="Editar Datos"
                                            >
                                                <Edit2 size={15} />
                                            </button>
                                            <button
                                                className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-slate-100 rounded-md transition-colors"
                                                title="Cambiar Estado / Bloquear"
                                            >
                                                <ToggleLeft size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <ModalNuevoUsuario
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                usuario={usuarioEdicion}
            />
        </div>
    );
}