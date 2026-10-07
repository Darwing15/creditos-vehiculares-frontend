/**
 * @file securityApi.ts — propuesta de integración documentada.
 * @author DarwinG
 */

import { api, publicApi } from './http';

/**
 * Códigos de permisos de la propuesta backend, sin depender del nombre visible del rol.
 * `as const` conserva los literales para detectar errores al escribir un permiso.
 * Este catálogo permite construir la UI; no concede permisos por sí mismo.
 */
export const PERMISSIONS = [
    'security:users:read',
    'security:users:write',
    'security:users:assign-role',
    'security:roles:read',
    'security:roles:write',
    'security:roles:manage-permissions',
    'security:branches:read',
    'security:branches:write',
    'customers:read',
    'customers:write',
    'vehicles:read',
    'vehicles:write',
    'credit-applications:read',
    'credit-applications:create',
    'credit-applications:resolve',
] as const;

/**
 * Uno de los códigos admitidos por los controles de esta propuesta.
 * @author DarwinG
 */
export type Permission = typeof PERMISSIONS[number];

/**
 * Identidad vigente consultada en /me; es la fuente de datos del perfil y menú.
 * @author DarwinG
 */
export interface AuthUser {
    /** ID estable del usuario; /me usa id, mientras login conserva userId. */
    id: number;
    /** Nombre visible del usuario; no identifica sus permisos. */
    fullName: string;
    /** Correo de acceso y presentación, sin contraseña ni hash. */
    email: string;
    /** Relación numérica con el rol asignado. */
    roleId: number;
    /** Etiqueta visible del rol; no utilizarla para autorizar acciones. */
    roleName: string;
    /** Sucursal asignada por el servidor; no acredita acceso a otras sucursales. */
    branchId: number;
    /** Nombre de sucursal para presentación. */
    branchName: string;
    /** Permisos efectivos de la consulta; el servidor los comprueba en cada operación. */
    permissions: string[]; 
}

/**
 * Respuesta de login; no sustituye la consulta posterior de identidad y permisos.
 * @author DarwinG
 */
export interface LoginResponse {
    /** JWT de acceso sensible; se entrega al transporte y no al almacenamiento persistente. */
    token: string;
    /** Esquema esperado para Authorization; el store rechaza otros valores. */
    tokenType: 'Bearer';
    /** Duración en segundos, 600 en la configuración propuesta; no es un timestamp. */
    expiresIn: number; 
    /** Identificador conservado por compatibilidad con el contrato de login existente. */
    userId: number;
    /** Nombre mostrado al autenticar; /me vuelve a obtener la identidad actual. */
    fullName: string;
    /** Correo autenticado, sin material de contraseña. */
    email: string;
    /** Identificador del rol en el momento de emitir la respuesta. */
    roleId: number;
    /** Etiqueta informativa, no una política de autorización. */
    roleName: string;
    /** Identificador de la sucursal asignada al autenticar. */
    branchId: number;
    /** Etiqueta informativa de la sucursal. */
    branchName: string;
}

/**
 * Datos administrativos públicos del usuario; nunca incluye contraseña ni hash.
 * @author DarwinG
 */
export interface UserResponse {
    /** Clave del registro que se utiliza en las URLs de edición/desactivación. */
    id: number;
    /** Nombre completo que se adapta a nombre en el JSX existente. */
    fullName: string;
    /** Correo utilizado para acceder al sistema. */
    email: string;
    /** ID que debe conservar el selector de rol al editar. */
    roleId: number;
    /** Etiqueta del rol para mostrar en listas. */
    roleName: string;
    /** ID que debe conservar el selector de sucursal al editar. */
    branchId: number;
    /** Etiqueta de sucursal para mostrar en listas. */
    branchName: string;
    /** Estado devuelto por el servidor; no implica que exista una operación de reactivación. */
    active: boolean;
}

/**
 * Payload de alta; la autorización para asignar roleId se valida en el backend.
 * @author DarwinG
 */
export interface CreateUserRequest {
    /** Nombre completo: se recortan espacios de extremos, no se inventa desde el correo. */
    fullName: string;
    /** Correo validado por el servidor; el cliente solo recorta espacios de extremos. */
    email: string;
    /** Contraseña inicial: conservar exactamente su contenido, sin trim ni logs. */
    password: string;
    /** ID positivo del catálogo de roles; no enviar la etiqueta del selector. */
    roleId: number;
    /** ID positivo de una sucursal permitida; no enviar claves ficticias como central. */
    branchId: number;
}

/**
 * Edición administrativa: excluye la contraseña y conserva IDs de las relaciones.
 * @author DarwinG
 */
export type UpdateUserRequest = Omit<CreateUserRequest, 'password'>;

/**
 * Datos de seguridad/organización de una sucursal, sin saldos ni metas comerciales.
 * @author DarwinG
 */
export interface BranchResponse {
    /** Clave de sucursal utilizada por la API; diferente del código operativo. */
    id: number;
    /** Código operativo definido al crear y no modificable mediante UpdateBranchRequest. */
    code: string;
    /** Nombre visible del establecimiento. */
    name: string;
    /** Dirección obligatoria del contrato backend. */
    address: string;
    /** Teléfono opcional; null expresa ausencia del dato. */
    phone: string | null;
    /** Correo opcional de la sucursal; no es la credencial del usuario responsable. */
    email: string | null;
    /** ID del encargado o null; no contiene su nombre ni presupone que exista un catálogo cargado. */
    managerId: number | null;
    /** Estado operativo devuelto por el servidor. */
    active: boolean;
}

/**
 * Payload de alta sin ID ni estado controlados por el servidor.
 * Con la regla de 02 enviar managerId: null; asignarlo al editar, tras crear usuarios de la sede.
 * @author DarwinG
 */
export type CreateBranchRequest =
    Omit<BranchResponse, 'id' | 'active'>;

/**
 * Edición de sucursal que excluye el código inmutable; managerId admite un ID o null.
 * @author DarwinG
 */
export type UpdateBranchRequest =
    Omit<CreateBranchRequest, 'code'>;

/**
 * Metadatos actuales de rol; el contrato no añade active ni permisos embebidos.
 * @author DarwinG
 */
export interface RoleResponse {
    /** ID utilizado tanto en metadatos como en los endpoints separados de permisos. */
    id: number;
    /** Nombre visible del rol; renombrarlo no debe definir sus autorizaciones. */
    name: string;
    /** Explicación opcional de la finalidad del rol. */
    description: string | null;
}

/**
 * Alta de metadatos; la asignación de permisos ocurre mediante otra operación.
 * @author DarwinG
 */
export type CreateRoleRequest = Omit<RoleResponse, 'id'>;

/**
 * El contrato de edición admite los mismos metadatos que el alta.
 * @author DarwinG
 */
export type UpdateRoleRequest = CreateRoleRequest;

/**
 * Construye operaciones compartidas por los tres catálogos ya existentes.
 * @typeParam Response - DTO público que devuelve cada operación.
 * @typeParam Create - Payload permitido para crear.
 * @typeParam Update - Payload permitido para actualizar.
 * @param resource Nombre fijo del catálogo, definido por el código y no por entrada del usuario.
 * @returns Funciones de lista, alta, edición y desactivación; no hay delete físico ni reactivación.
 * @author DarwinG
 */
function resourceApi<Response, Create, Update>(resource: string) {
    /** Ruta relativa al baseURL que ya termina en /api. */
    const path = `/security/${resource}`;
    return {
        /**
         * Consulta la lista sin suponer paginación o filtros inexistentes.
         * @param signal Cancelación opcional para pantallas desmontadas.
         * @returns Array directo de registros del contrato actual.
         */
        async list(signal?: AbortSignal): Promise<Response[]> {
            return (await api.get<Response[]>(path, { signal })).data;
        },

        /**
         * Solicita el alta usando exclusivamente el DTO correspondiente.
         * @param request Datos de creación; el servidor decide ID, estado y autorización.
         * @returns Registro confirmado por el servidor tras responder 201.
         * @remarks No reintentar automáticamente: un timeout puede ocurrir después del alta.
         */
        async create(request: Create): Promise<Response> {
            return (await api.post<Response>(path, request)).data;
        },

        /**
         * Sustituye los datos editables permitidos por el contrato PUT.
         * @param id ID del registro, no un nombre ni un código operativo.
         * @param request Payload de edición completo; no se comporta como PATCH parcial.
         * @returns Registro actualizado que permite refrescar la lista local.
         */
        async update(id: number, request: Update): Promise<Response> {
            return (await api.put<Response>(`${path}/${id}`, request)).data;
        },

        /**
         * Solicita la desactivación lógica y deja al servidor aplicar sus invariantes.
         * @param id ID del registro que se desactivará.
         * @returns Representación del registro; RoleResponse no expone active.
         */
        async deactivate(id: number): Promise<Response> {
            return (
                await api.patch<Response>(`${path}/${id}/deactivate`)
            ).data;
        },
    };
}

/** Operaciones de usuarios; los tipos separan contraseña inicial de edición. */
export const usersApi = resourceApi<
    UserResponse, CreateUserRequest, UpdateUserRequest
>('users');

/** Operaciones de sucursales; el DTO de edición excluye code. */
export const branchesApi = resourceApi<
    BranchResponse, CreateBranchRequest, UpdateBranchRequest
>('branches');

/** Metadatos de roles existentes y operaciones de permisos añadidas por la propuesta. */
export const rolesApi = {
    ...resourceApi<RoleResponse, CreateRoleRequest, UpdateRoleRequest>('roles'),

    /**
     * Consulta permisos por el endpoint NUEVO separado de RoleResponse.
     * @param id ID del rol consultado.
     * @returns Lista de códigos; no un objeto RoleResponse ni una página.
     */
    async getPermissions(id: number): Promise<string[]> {
        return (
            await api.get<string[]>(`/security/roles/${id}/permissions`)
        ).data;
    },

    /**
     * Reemplaza el conjunto de permisos mediante el endpoint NUEVO propuesto.
     * @param id ID del rol cuyo conjunto se modificará.
     * @param permissions Conjunto final seleccionado; [] solicita dejarlo sin permisos.
     * @returns Códigos persistidos; el backend comprueba manage-permissions y sus invariantes.
     * @remarks El payload es { permissions }, nunca se agrega al PUT de metadatos.
     */
    async setPermissions(id: number, permissions: Permission[]): Promise<string[]> {
        return (
            await api.put<string[]>(`/security/roles/${id}/permissions`, {
                permissions,
            })
        ).data;
    },
};

/** Transporte de autenticación; el store coordina los cambios de estado posteriores. */
export const authApi = {
    /**
     * Intercambia credenciales por la respuesta de login.
     * @param email Correo de acceso, normalizado por el llamador según la política acordada.
     * @param password Contraseña tal como la escribió el usuario; no se persiste.
     * @returns JWT y metadatos, incluidos tokenType y expiresIn nuevos.
     * @remarks Usa publicApi para no adjuntar un token de sesión anterior.
     */
    async login(email: string, password: string): Promise<LoginResponse> {
        return (
            await publicApi.post<LoginResponse>('/auth/login', { email, password })
        ).data;
    },

    /**
     * Consulta identidad y permisos con el JWT actual.
     * @returns DTO de /me, que usa id y no userId.
     * @remarks No decodifica el JWT como sustituto de la consulta al servidor.
     */
    async me(): Promise<AuthUser> {
        return (await api.get<AuthUser>('/auth/me')).data;
    },

    /**
     * Solicita el endpoint NUEVO de revocación de todas las sesiones del usuario.
     * @returns Promesa resuelta tras 204; sin cuerpo JSON.
     * @remarks Ante fallo se rechaza; no puede afirmarse que la revocación fue confirmada.
     */
    async logoutAll(): Promise<void> {
        await api.post('/auth/logout-all');
    },
    
    /**
     * Solicita cambio de contraseña de la identidad autenticada.
     * @param currentPassword Contraseña actual para verificar posesión de la cuenta.
     * @param newPassword Nueva contraseña, sin normalización ni registro en logs.
     * @returns Promesa resuelta tras 204; el store limpia la sesión al éxito.
     */
    async changePassword(currentPassword: string, newPassword: string): Promise<void> {
        await api.post('/auth/change-password', {
            currentPassword,
            newPassword,
        });
    },
};