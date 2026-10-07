/**
 * @file RequirePermission.tsx — propuesta de integración documentada.
 * @author DarwinG
 */

import type { ReactNode } from 'react';
import { useAuthStore } from '../stores/authStore';
import type { Permission } from '../api/securityApi';

/**
 * Contrato del guard visual: un permiso requerido y el contenido a mostrar si se posee.
 * @author DarwinG
 */
interface Props {
    /** Código estable del permiso; no aceptar el nombre visible de un rol. */
    permission: Permission;
    /** Página/contenido React que solo se renderiza cuando la sesión declara el permiso. */
    children: ReactNode;
}

/**
 * Presenta el contenido autorizado por los permisos de /me o un aviso de acceso denegado.
 * @param props Propiedades con permission requerido y children a proteger visualmente.
 * @returns El contenido React permitido o el aviso; no redirige ni modifica sesión.
 * @remarks Debe usarse dentro del control de autenticación del router. No protege endpoints.
 * @author DarwinG
 */
export default function RequirePermission({ permission, children }: Props) {
    /** Booleano seleccionado del store; false también cubre ausencia de usuario autenticado. */
    const allowed = useAuthStore(
        (state) => state.user?.permissions.includes(permission) ?? false,
    );
    return allowed
        ? children
        : <p role="alert">No tienes permiso para acceder a esta sección.</p>;
}