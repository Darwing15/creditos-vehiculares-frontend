import type { ReactNode } from 'react';
import { useAuthStore } from '../stores/authStore';
import { canAccessModule, MODULE_ACCESS } from '../security/moduleAccess';
import type { ModuleId } from '../security/moduleAccess';

/** 
 * Protege visualmente una página con la misma política que el menú. 
 * @author DarwinG 
 */
interface Props {
    moduleId: ModuleId;
    children: ReactNode;
}

/**
 * Impide montar la página y disparar sus consultas si se abre la URL directamente
 * sin el permiso. No sustituye la seguridad del backend.
 * @author DarwinG
 */
export default function RequireModule({ moduleId, children }: Props) {
    const permissions = useAuthStore(state => state.user?.permissions);
    if (canAccessModule(moduleId, permissions))
        return children;
    return <p role="alert">{MODULE_ACCESS[moduleId].enabled
        ? 'No tienes permiso para acceder a esta sección.'
        : 'Esta sección aún no está disponible.'}</p>;
}
