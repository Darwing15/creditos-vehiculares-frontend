import { useEffect, useState, type FormEvent } from 'react';
import { X, UserPlus, Key } from 'lucide-react';
import { apiErrorMessage } from '../api/http';
import { branchesApi, rolesApi } from '../api/securityApi';
import type {
    BranchResponse, RoleResponse, UpdateUserRequest, UserResponse,
} from '../api/securityApi';
import { useAuthStore } from '../stores/authStore';

/**
 * Contrato del formulario de usuarios; la página conserva la responsabilidad
 * de escribir, actualizar la lista y cerrar solamente tras una respuesta exitosa.
 * @author DarwinG
 */
interface ModalUsuarioProps {
    /** Visibilidad controlada por la pantalla de Usuarios. */
    isOpen: boolean;
    /** Solicita cerrar sin guardar; la UI debe bloquear esta acción durante saving. */
    onClose: () => void;
    /** Usuario real en edición; null solicita el formulario de alta. */
    usuario: UserResponse | null;
    /** Escritura pendiente en la página padre; impide envío/cierre simultáneos desde el modal. */
    saving: boolean;
    /** Mensaje de error que debe permanecer visible encima del overlay. */
    error: string | null;
    /**
     * Delega la escritura a la página para que esta actualice su lista y visibilidad.
     * @param values DTO administrativo, con IDs numéricos y sin contraseña.
     * @param password Contraseña inicial solo cuando usuario es null.
     * @returns Promesa resuelta tras manejar éxito/error en guardarUsuario; el modal no se cierra solo.
     */
    onSave: (values: UpdateUserRequest, password?: string) => Promise<void>;
}

export default function ModalNuevoUsuario({
    isOpen, onClose, usuario, saving, error, onSave }: ModalUsuarioProps) {
    const permissions = useAuthStore((state) => state.user?.permissions);
    const isEdit = usuario !== null;
    const canChooseRole =
        permissions?.includes('security:users:assign-role') === true &&
        permissions?.includes('security:roles:read') === true;
    const canChooseBranch =
        permissions?.includes('security:branches:read') === true;
    const [roles, setRoles] = useState<RoleResponse[]>([]);
    const [branches, setBranches] = useState<BranchResponse[]>([]);
    const [catalogLoading, setCatalogLoading] = useState(true);
    const [catalogError, setCatalogError] = useState<string | null>(null);
    const [validationError, setValidationError] = useState<string | null>(null);
    const [selectedRoleId, setSelectedRoleId] = useState(usuario ? String(usuario.roleId) : '');
    const [selectedBranchId, setSelectedBranchId] = useState(usuario ? String(usuario.branchId) : '');

    /** Cancela consultas de una apertura anterior para no mostrar opciones obsoletas. */
    useEffect(() => {
        if (!isOpen) return;
        const controller = new AbortController();

        void Promise.all([
            canChooseRole
                ? rolesApi.list(controller.signal)
                : Promise.resolve([] as RoleResponse[]),
            canChooseBranch
                ? branchesApi.list(controller.signal)
                : Promise.resolve([] as BranchResponse[]),
        ])
            .then(([loadedRoles, loadedBranches]) => {
                if (controller.signal.aborted) return;
                setRoles(loadedRoles);
                setBranches(loadedBranches);
            })
            .catch((cause: unknown) => {
                if (!controller.signal.aborted) {
                    setCatalogError(apiErrorMessage(cause));
                }
            })
            .finally(() => {
                if (!controller.signal.aborted) setCatalogLoading(false);
            });
        return () => controller.abort();
    }, [isOpen, canChooseRole, canChooseBranch]);

    if (!isOpen) return null;

    const activeBranches = branches.filter((branch) => branch.active);
    const canCreate = canChooseRole && canChooseBranch;

    /**
     * Convierte los valores HTML a los tipos exactos que espera el DTO administrativo.
     * @param event Envío del formulario real del modal, con nombres de campos definidos abajo.
     * @returns Promesa que espera onSave; no navega ni cierra el modal por sí misma.
     * @remarks Se recortan nombre/correo; la contraseña conserva todos sus caracteres.
     */
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (saving || catalogLoading || catalogError) return;
        setValidationError(null);
        if (!isEdit && !canCreate) {
            setValidationError('Faltan permisos para consultar catálogos o asignar roles.');
            return;
        }
        /** Instantánea de controles con name; los controles disabled no se incluyen. */
        const form = new FormData(event.currentTarget);
        /** ID numérico del rol; Number('') produce 0 y se rechaza mediante el guard siguiente. */
        const roleId = canChooseRole ? Number(selectedRoleId) : usuario?.roleId;
        /** ID numérico de sucursal; no admite nombres, decimales ni valores no seguros de JavaScript. */
        const branchId = canChooseBranch ? Number(selectedBranchId) : usuario?.branchId;

        if (
            !Number.isSafeInteger(roleId) || Number(roleId) <= 0 ||
            !Number.isSafeInteger(branchId) || Number(branchId) <= 0 ||
            (canChooseRole && !roles.some((role) => role.id === roleId)) ||
            (canChooseBranch && !activeBranches.some((branch) => branch.id === branchId))
        ) {
            setValidationError('Selecciona un rol y una sucursal activa válidos.');
            return;
        }
        const password = isEdit ? undefined : String(form.get('password') ?? '');
        if (password !== undefined) {
            const bytes = new TextEncoder().encode(password).length;
            if (password.length < 15 || password.length > 72 || bytes > 72) {
                setValidationError(
                    'La contraseña debe tener entre 15 y 72 caracteres y máximo 72 bytes UTF-8.',
                );
                return;
            }
        }
        await onSave({
            fullName: String(form.get('fullName') ?? '').trim(),
            email: String(form.get('email') ?? '').trim(),
            roleId: roleId as number,
            branchId: branchId as number,
        }, password);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="usuario-modal-title"
                className="flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl"
            >
                <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-6 py-4">
                    <div className="flex items-center gap-2">
                        <UserPlus className="text-emerald-600" size={20} />
                        <h2 id="usuario-modal-title" className="text-lg font-bold text-slate-800">
                            {isEdit ? 'Editar usuario: ' + usuario.fullName : 'Registrar nuevo colaborador'}
                        </h2>
                    </div>
                    <button
                        type="button"
                        aria-label="Cerrar formulario"
                        onClick={onClose}
                        disabled={saving}
                        className="text-slate-400 hover:text-slate-600 disabled:opacity-50"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form
                    key={usuario?.id ?? 'new'}
                    onSubmit={handleSubmit}
                    className="flex min-h-0 flex-1 flex-col"
                    aria-busy={saving}
                >
                    <div className="flex-1 space-y-5 overflow-y-auto p-6">
                        {catalogLoading && <p role="status">Cargando catálogos…</p>}
                        {catalogError && <p role="alert" className="text-sm text-rose-700">{catalogError}</p>}
                        {validationError && <p role="alert" className="text-sm text-rose-700">{validationError}</p>}
                        {error && <p role="alert" className="text-sm text-rose-700">{error}</p>}

                        <section className="space-y-4">
                            <h3 className="text-xs font-bold uppercase text-slate-400">1. Datos personales</h3>
                            <div className="space-y-1">
                                <label htmlFor="usuario-full-name" className="text-xs font-semibold">
                                    Nombre completo
                                </label>
                                <input
                                    id="usuario-full-name"
                                    name="fullName"
                                    type="text"
                                    required
                                    maxLength={150}
                                    defaultValue={usuario?.fullName ?? ''}
                                    disabled={saving}
                                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                                />
                            </div>
                            <div className="space-y-1">
                                <label htmlFor="usuario-email" className="text-xs font-semibold">
                                    Correo electrónico
                                </label>
                                <input
                                    id="usuario-email"
                                    name="email"
                                    type="email"
                                    required
                                    maxLength={120}
                                    defaultValue={usuario?.email ?? ''}
                                    disabled={saving}
                                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                                />
                            </div>
                        </section>

                        {!isEdit && (
                            <section className="space-y-2 border-t border-slate-100 pt-5">
                                <h3 className="flex items-center gap-1 text-xs font-bold uppercase text-slate-400">
                                    <Key size={14} /> 2. Contraseña inicial
                                </h3>
                                <label htmlFor="usuario-password" className="text-xs font-semibold">
                                    Contraseña inicial
                                </label>
                                <input
                                    id="usuario-password"
                                    name="password"
                                    type="password"
                                    required
                                    minLength={15}
                                    maxLength={72}
                                    autoComplete="new-password"
                                    disabled={saving}
                                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                                />
                                <p className="text-xs text-slate-500">Entre 15 y 72 caracteres; máximo 72 bytes UTF-8.</p>
                            </section>
                        )}

                        <section className="space-y-4 border-t border-slate-100 pt-5">
                            <h3 className="text-xs font-bold uppercase text-slate-400">3. Rol y sucursal</h3>
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div className="space-y-1">
                                    <label htmlFor="usuario-role" className="text-xs font-semibold">Rol</label>
                                    {canChooseRole ? (
                                        <select
                                            id="usuario-role"
                                            name="roleId"
                                            required
                                            value={selectedRoleId}
                                            onChange={(event) => setSelectedRoleId(event.target.value)}
                                            disabled={saving || catalogLoading || !!catalogError}
                                            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                                        >
                                            <option value="">Selecciona un rol</option>
                                            {roles.map((role) => (
                                                <option key={role.id} value={role.id}>{role.name}</option>
                                            ))}
                                        </select>
                                    ) : (
                                        <input
                                            id="usuario-role"
                                            value={usuario?.roleName ?? 'No disponible'}
                                            disabled
                                            className="w-full rounded-lg border border-slate-200 bg-slate-100 px-3 py-2 text-sm"
                                        />
                                    )}
                                </div>
                                <div className="space-y-1">
                                    <label htmlFor="usuario-branch" className="text-xs font-semibold">Sucursal activa</label>
                                    {canChooseBranch ? (
                                        <select
                                            id="usuario-branch"
                                            name="branchId"
                                            required
                                            value={selectedBranchId}
                                            onChange={(event) => setSelectedBranchId(event.target.value)}
                                            disabled={saving || catalogLoading || !!catalogError}
                                            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                                        >
                                            <option value="">Selecciona una sucursal</option>
                                            {activeBranches.map((branch) => (
                                                <option key={branch.id} value={branch.id}>{branch.name}</option>
                                            ))}
                                        </select>
                                    ) : (
                                        <input
                                            id="usuario-branch"
                                            value={usuario?.branchName ?? 'No disponible'}
                                            disabled
                                            className="w-full rounded-lg border border-slate-200 bg-slate-100 px-3 py-2 text-sm"
                                        />
                                    )}
                                </div>
                            </div>
                        </section>
                    </div>

                    <div className="flex justify-end gap-3 border-t border-slate-100 bg-slate-50 px-6 py-4">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={saving}
                            className="rounded-lg border border-slate-200 px-4 py-2 text-sm disabled:opacity-50"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={saving || catalogLoading || !!catalogError || (!isEdit && !canCreate)}
                            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm text-white disabled:opacity-50"
                        >
                            {saving ? 'Guardando…' : isEdit ? 'Guardar cambios' : 'Crear colaborador'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}