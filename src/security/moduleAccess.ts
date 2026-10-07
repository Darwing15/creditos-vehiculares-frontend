import type { Permission } from '../api/securityApi';

/** 
 * Política compartida por menú y rutas. 
 * @author DarwinG 
 */
interface ModuleRule {
    enabled: boolean;
    requiredPermission?: Permission;
}

/**
 * Los módulos integrados requieren su permiso. Por decisión del usuario,
 * las maquetas permanecen visibles a sesiones autenticadas y no otorgan
 * permisos de API. Dashboard es la portada de demostración.
 * @author DarwinG
 */
export const MODULE_ACCESS = {
    dashboard: { enabled: true },
    clientes: { enabled: true, requiredPermission: 'customers:read' },
    creditos: { enabled: true, requiredPermission: 'credit-applications:read' },
    inventario: { enabled: true, requiredPermission: 'vehicles:read' },
    usuarios: { enabled: true, requiredPermission: 'security:users:read' },
    sucursales: { enabled: true, requiredPermission: 'security:branches:read' },
    cobranza: { enabled: true },
    caja: { enabled: true },
    reportes: { enabled: true },
    configuracion: { enabled: true },
} as const satisfies Record<string, ModuleRule>;

export type ModuleId = keyof typeof MODULE_ACCESS;

/**
 * Comprueba permisos de /me sin comparar nombres de rol.
 * @param moduleId módulo solicitado
 * @param permissions permisos del usuario autenticado; undefined niega acceso
 * @returns acceso visual permitido; la API conserva su propia autorización
 * @author DarwinG
 */
export function canAccessModule(moduleId: ModuleId, permissions: readonly string[] | undefined): boolean {
    if (permissions === undefined)
        return false;
    const rule: ModuleRule = MODULE_ACCESS[moduleId];
    return rule.enabled && (rule.requiredPermission === undefined || permissions.includes(rule.requiredPermission));
}
