import { useEffect, useMemo, useState } from 'react';
import {
    UserPlus, Search, Shield, Mail, MapPin,
    Edit2, CheckCircle, XCircle, ToggleLeft,
} from 'lucide-react';
import ModalNuevoUsuario from '../components/ModalNuevoUsuario';
import { apiErrorMessage } from '../api/http';
import { usersApi } from '../api/securityApi';
import type {
    CreateUserRequest, UpdateUserRequest, UserResponse,
} from '../api/securityApi';
import { useAuthStore } from '../stores/authStore';

/**
 * Consulta y administra usuarios usando las respuestas reales de seguridad.
 * Los filtros operan sobre la lista recibida; esta API aún no ofrece paginación.
 * @author DarwinG
 */
export default function Usuarios() {
    const permissions = useAuthStore((state) => state.user?.permissions);
    const canWrite = permissions?.includes('security:users:write') === true;
    const canCreate = canWrite &&
        permissions?.includes('security:users:assign-role') === true &&
        permissions?.includes('security:roles:read') === true &&
        permissions?.includes('security:branches:read') === true;
    /** Lista visible/setter; solo incorpora registros leídos o confirmados por la API. */
    const [usuarios, setUsuarios] = useState<UserResponse[]>([]);
    /** Registro seleccionado/setter; null distingue creación de edición. */
    const [usuarioEdicion, setUsuarioEdicion] = useState<UserResponse | null>(null);
    /** Estado/setter de la carga inicial; permite diferenciar carga de una lista vacía. */
    const [loading, setLoading] = useState(true);
    /** Estado/setter de una escritura; compartido para deshabilitar acciones mientras se espera. */
    const [saving, setSaving] = useState(false);
    /** Mensaje/setter de consulta o escritura; presentarlo dentro del modal cuando está abierto. */
    const [error, setError] = useState<string | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState('');
    const [branchFilter, setBranchFilter] = useState('');

    /**
     * Efecto de montaje: carga la lista una vez por instancia de la pantalla.
     * El callback retorna una limpieza que cancela la solicitud al desmontar.
     * Los callbacks ignoran una respuesta cancelada para no sobrescribir estado obsoleto.
     */
    useEffect(() => {
        /** Cancelación de esta carga; no se reutiliza para operaciones de escritura. */
        const controller = new AbortController();
        usersApi.list(controller.signal)
            /** Recibe data como array del backend y adapta cada registro al JSX existente. */
            .then((data) => {
                if (!controller.signal.aborted) setUsuarios(data);
            })
            .catch((cause: unknown) => {
                if (!controller.signal.aborted) setError(apiErrorMessage(cause));
            })
            .finally(() => {
                if (!controller.signal.aborted) setLoading(false);
            });
        return () => controller.abort();
    }, []);

    /** Deriva filtros de registros reales y compara IDs, nunca etiquetas de autorización. */
    const roleOptions = useMemo(
        () => Array.from(new Map(
            usuarios.map((user) => [user.roleId, user.roleName] as const),
        )),
        [usuarios],
    );
    const branchOptions = useMemo(
        () => Array.from(new Map(
            usuarios.map((user) => [user.branchId, user.branchName] as const),
        )),
        [usuarios],
    );
    const visibleUsers = useMemo(() => {
        const needle = search.trim().toLocaleLowerCase();
        return usuarios.filter((user) =>
            (!needle ||
                user.fullName.toLocaleLowerCase().includes(needle) ||
                user.email.toLocaleLowerCase().includes(needle) ||
                user.roleName.toLocaleLowerCase().includes(needle)) &&
            (!roleFilter || user.roleId === Number(roleFilter)) &&
            (!branchFilter || user.branchId === Number(branchFilter)),
        );
    }, [usuarios, search, roleFilter, branchFilter]);

    /**
     * Inserta o sustituye solo una respuesta confirmada por el servidor.
     * @param user Registro devuelto por POST, PUT o PATCH.
     * @returns Nada; programa una actualización funcional de la lista local.
     * @remarks No hace una actualización optimista antes de que el servidor confirme.
     */
    const upsertUser = (user: UserResponse) => {
        setUsuarios((previous) => previous.some((item) => item.id === user.id)
            ? previous.map((item) => item.id === user.id ? user : item)
            : [...previous, user]);
    };

    /**
     * Alta y edición usan payloads distintos: la contraseña inicial nunca va en PUT.
     * En fallo, conserva el formulario y muestra el mensaje dentro del modal.
     * @param values Campos administrativos con roleId/branchId numéricos, sin contraseña.
     * @param initialPassword Contraseña obligatoria solo en alta; nunca se agrega al PUT.
     * @returns Promesa resuelta después de actualizar la lista o presentar el error.
     * @remarks Los fallos se guardan en error para conservar el formulario abierto; no se relanzan.
     */
    const guardarUsuario = async (
        values: UpdateUserRequest, initialPassword?: string,
    ): Promise<void> => {
        if (saving) return;
        setSaving(true);
        setError(null);
        try {
            let saved: UserResponse;
            if (usuarioEdicion) {
                saved = await usersApi.update(usuarioEdicion.id, values);
            } else {
                if (!initialPassword) {
                    throw new Error('La contraseña inicial es obligatoria.');
                }
                const request: CreateUserRequest = {
                    ...values,
                    password: initialPassword,
                };
                saved = await usersApi.create(request);
            }
            upsertUser(saved);
            setModalOpen(false);
            setUsuarioEdicion(null);
        } catch (cause) {
            setError(apiErrorMessage(cause));
        } finally {
            setSaving(false);
        }
    };

    /**
     * Solicita confirmación antes de desactivar y actualiza el estado devuelto por el backend.
     * @param user Registro seleccionado; active evita ofrecer de nuevo una desactivación ya reflejada.
     * @returns Promesa resuelta tras actualizar la lista o mostrar un error.
     * @remarks No implementa reactivación ni autoriza la acción: eso corresponde al servidor.
     */
    const desactivarUsuario = async (user: UserResponse): Promise<void> => {
        if (saving || !user.active) return;
        if (!window.confirm('¿Desactivar a ' + user.fullName + '?')) return;
        setSaving(true);
        setError(null);
        try {
            upsertUser(await usersApi.deactivate(user.id));
        } catch (cause) {
            setError(apiErrorMessage(cause));
        } finally {
            setSaving(false);
        }
    };

    const abrirModalNuevo = () => {
        setError(null);
        setUsuarioEdicion(null);
        setModalOpen(true);
    };

    const abrirModalEditar = (user: UserResponse) => {
        setError(null);
        setUsuarioEdicion(user);
        setModalOpen(true);
    };

    const cerrarModal = () => {
        if (saving) return;
        setModalOpen(false);
        setUsuarioEdicion(null);
        setError(null);
    };

    return (
        <div className="space-y-6 p-6">
            <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Control de usuarios y permisos</h1>
                    <p className="text-slate-500">Administra personal, roles y sucursales.</p>
                </div>
                {canCreate && (
                    <button
                        type="button"
                        onClick={abrirModalNuevo}
                        disabled={saving}
                        className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 font-medium text-white disabled:opacity-50"
                    >
                        <UserPlus size={18} /> Registrar usuario
                    </button>
                )}
            </header>

            {!modalOpen && error && (
                <p role="alert" className="rounded-lg bg-rose-50 p-3 text-sm text-rose-700">
                    {error}
                </p>
            )}
            <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 sm:flex-row">
                <label className="relative flex-1">
                    <span className="sr-only">Buscar usuarios</span>
                    <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
                    <input
                        type="search"
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        placeholder="Buscar por nombre, correo o rol"
                        className="w-full rounded-lg border border-slate-200 py-1.5 pl-9 pr-4 text-sm"
                    />
                </label>
                <label>
                    <span className="sr-only">Filtrar por sucursal</span>
                    <select
                        value={branchFilter}
                        onChange={(event) => setBranchFilter(event.target.value)}
                        className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm"
                    >
                        <option value="">Todas las sucursales</option>
                        {branchOptions.map(([id, name]) => (
                            <option key={id} value={id}>{name}</option>
                        ))}
                    </select>
                </label>
                <label>
                    <span className="sr-only">Filtrar por rol</span>
                    <select
                        value={roleFilter}
                        onChange={(event) => setRoleFilter(event.target.value)}
                        className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm"
                    >
                        <option value="">Todos los roles</option>
                        {roleOptions.map(([id, name]) => (
                            <option key={id} value={id}>{name}</option>
                        ))}
                    </select>
                </label>
            </div>

            {loading ? (
                <p role="status">Cargando usuarios…</p>
            ) : (
                <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
                    <table className="w-full border-collapse text-left text-sm">
                        <thead className="border-b border-slate-100 bg-slate-50 text-xs uppercase text-slate-500">
                            <tr>
                                <th className="px-6 py-3">Colaborador</th>
                                <th className="px-6 py-3">Rol</th>
                                <th className="px-6 py-3">Sucursal</th>
                                <th className="px-6 py-3">Estado</th>
                                <th className="px-6 py-3 text-center">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {visibleUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-slate-50">
                                    <td className="px-6 py-4">
                                        <strong>{user.fullName}</strong>
                                        <span className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                                            <Mail size={12} /> {user.email}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="flex items-center gap-1">
                                            <Shield size={14} /> {user.roleName}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="flex items-center gap-1">
                                            <MapPin size={14} /> {user.branchName}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="flex items-center gap-1">
                                            {user.active
                                                ? <CheckCircle size={14} className="text-emerald-600" />
                                                : <XCircle size={14} className="text-rose-600" />}
                                            {user.active ? 'Activo' : 'Inactivo'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex justify-center gap-2">
                                            {canWrite && (
                                                <>
                                                    <button
                                                        type="button"
                                                        onClick={() => abrirModalEditar(user)}
                                                        disabled={saving || !user.active}
                                                        title="Editar usuario"
                                                        aria-label={'Editar a ' + user.fullName}
                                                        className="rounded-md p-1.5 text-slate-500 hover:text-indigo-600 disabled:opacity-50"
                                                    >
                                                        <Edit2 size={16} />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => void desactivarUsuario(user)}
                                                        disabled={saving || !user.active}
                                                        title="Desactivar usuario"
                                                        aria-label={'Desactivar a ' + user.fullName}
                                                        className="rounded-md p-1.5 text-slate-500 hover:text-amber-600 disabled:opacity-50"
                                                    >
                                                        <ToggleLeft size={16} />
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {visibleUsers.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                                        No hay usuarios para los filtros seleccionados.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {modalOpen && <ModalNuevoUsuario
                key={usuarioEdicion?.id ?? 'new'}
                isOpen={modalOpen}
                onClose={cerrarModal}
                usuario={usuarioEdicion}
                saving={saving}
                error={error}
                onSave={guardarUsuario}
            />}
        </div>
    );
}