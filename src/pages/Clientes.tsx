import { Search, Plus, MoreVertical, Edit, Trash2, Filter } from 'lucide-react';
import { useState } from 'react';
import ModalNuevoCliente from '../components/ModalNuevoCliente';

// Datos de simulación locales
const mockClientes = [
    { id: 1, nombre: 'Carlos Ruiz Meléndez', dni: '74859612', telefono: '987 654 321', direccion: 'Jr. Progreso 123, Tocache', estado: 'Activo' },
    { id: 2, nombre: 'María Fernández Salas', dni: '45123698', telefono: '912 345 678', direccion: 'Av. Belaunde Terry, Uchiza', estado: 'Al día' },
    { id: 3, nombre: 'Jorge Pérez López', dni: '12457896', telefono: '945 123 789', direccion: 'Caserío Nuevo Bambamarca', estado: 'En mora' },
    { id: 4, nombre: 'Ana Gómez Silva', dni: '78965412', telefono: '999 888 777', direccion: 'Jr. San Martín 456, Tocache', estado: 'Activo' },
];

export default function Clientes() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [clienteEdicion, setClienteEdicion] = useState<any>(null);

    /* Abre el modal limpio para nuevos registros */
    const abrirModalNuevo = () => {
        setClienteEdicion(null);
        setIsModalOpen(true);
    };

    /* Abre el modal inyectando los datos de la fila seleccionada */
    const abrirModalEditar = (cliente: any) => {
        setClienteEdicion(cliente);
        setIsModalOpen(true);
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-200 p-6">

            {/* ENCABEZADO */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Gestión de Clientes</h1>
                    <p className="text-slate-500 text-sm">Administra el padrón de clientes evaluados, aprobados y en cartera</p>
                </div>
                <button
                    onClick={abrirModalNuevo}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all font-medium shadow-sm"
                >
                    <Plus size={18} /> Registrar Cliente
                </button>
            </div>

            {/* FILTROS DE BÚSQUEDA */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
                <div className="relative w-full md:max-w-md">
                    <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Buscar por nombre, DNI o teléfono..."
                        className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm bg-white outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                </div>
                <button className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
                    <Filter size={16} /> Más Filtros
                </button>
            </div>

            {/* TABLA PRINCIPAL */}
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                                <th className="px-6 py-3.5">Cliente / DNI</th>
                                <th className="px-6 py-3.5">Contacto</th>
                                <th className="px-6 py-3.5">Dirección</th>
                                <th className="px-6 py-3.5 text-center">Estado</th>
                                <th className="px-6 py-3.5 text-center">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 text-sm text-slate-700">
                            {mockClientes.map((cliente) => (
                                <tr key={cliente.id} className="hover:bg-slate-50/70 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="font-semibold text-slate-800">{cliente.nombre}</div>
                                        <div className="text-xs font-mono text-slate-400 mt-0.5">{cliente.dni}</div>
                                    </td>
                                    <td className="px-6 py-4 text-slate-600">
                                        {cliente.telefono}
                                    </td>
                                    <td className="px-6 py-4 max-w-xs truncate text-slate-600">
                                        {cliente.direccion}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${cliente.estado === 'Activo' || cliente.estado === 'Al día'
                                            ? 'bg-emerald-50 text-emerald-700'
                                            : 'bg-amber-50 text-amber-700'
                                            }`}>
                                            {cliente.estado}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-center gap-1.5">
                                            <button
                                                onClick={() => abrirModalEditar(cliente)}
                                                className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                                                title="Editar Cliente"
                                            >
                                                <Edit size={16} />
                                            </button>
                                            <button className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Eliminar">
                                                <Trash2 size={16} />
                                            </button>
                                            <button className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors" title="Más opciones">
                                                <MoreVertical size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* FILAS DE PAGINACIÓN */}
                <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between bg-slate-50">
                    <p className="text-sm text-slate-500">Mostrando 1 a 4 de 4 registros</p>
                    <div className="flex gap-1">
                        <button className="px-3 py-1 border border-slate-200 rounded text-sm text-slate-400 cursor-not-allowed bg-white">Anterior</button>
                        <button className="px-3 py-1 border border-slate-200 rounded text-sm text-slate-600 hover:bg-slate-100 bg-white">Siguiente</button>
                    </div>
                </div>
            </div>

            {/* Inyección balanceada del nuevo componente modal modal */}
            <ModalNuevoCliente
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                cliente={clienteEdicion}
            />

        </div>
    );
}