/**
 * @file authStore.ts — propuesta de integración documentada.
 * @author DarwinG
 */

import { create } from 'zustand';
import { UiError } from '../api/errorMessages';
import { setAccessToken, setAuthFailureHandler } from '../api/http';
import { authApi } from '../api/securityApi';
import type { AuthUser } from '../api/securityApi';

/**
 * Estado de sesión de esta pestaña y acciones que mantienen coherencia con el transporte.
 * @author DarwinG
 */
interface AuthState {
    /** Indica que login y /me finalizaron; es estado visual, no prueba para el backend. */
    isAuthenticated: boolean;
    /** Perfil/permisos actuales, o null cuando la pestaña no tiene una sesión establecida. */
    user: AuthUser | null;
    /**
     * @param email Correo que se recorta antes del envío.
     * @param password Contraseña que debe enviarse intacta.
     * @returns Promesa resuelta solo tras login y /me; los fallos se propagan a la pantalla.
     */
    login: (email: string, password: string) => Promise<void>;
    /** @returns Promesa que actualiza /me para la sesión actual; rechaza ante fallo de consulta. */
    revalidate: () => Promise<void>;
    /** @returns Promesa de revocación remota global; limpia memoria después del éxito. */
    logout: () => Promise<void>;
    /** Elimina solo la sesión en memoria; no llama al servidor. No devuelve un resultado. */
    logoutLocal: () => void;
    /**
     * @param currentPassword Contraseña actual exigida por el servidor.
     * @param newPassword Nueva contraseña sin trim ni persistencia en el store.
     * @returns Promesa que, al éxito, elimina la sesión local afectada.
     */
    changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
}

/**
 * Contador local que distingue intentos/sesiones de esta pestaña.
 * Es independiente de tokenVersion del backend: impide aplicar respuestas asíncronas obsoletas.
 */
let sessionVersion = 0;
/** Temporizador de UX; se cancela al reemplazar/eliminar la credencial. No valida el JWT. */
let expirationTimer: ReturnType<typeof setTimeout> | undefined;

/**
 * Retira la credencial y su temporizador sin modificar directamente el estado de React.
 * @returns Nada; el llamador decide cómo actualizar isAuthenticated y user.
 * @remarks No realiza revocación remota ni afecta tokens emitidos para otros dispositivos.
 * @author DarwinG
 */
function clearToken(): void {
    clearTimeout(expirationTimer);
    expirationTimer = undefined;
    setAccessToken(null);
}

/**
 * Comprueba la forma mínima del campo usado por los guards visuales.
 * @param user Respuesta recibida de /me; el tipo TS no garantiza su forma en ejecución.
 * @returns Nada si permissions es un array de strings.
 * @throws Error cuando el contrato de permisos no coincide con la propuesta.
 * @remarks No es un validador completo de todos los DTO ni de firma/claims JWT.
 * @author DarwinG
 */
function validateUser(user: AuthUser): void {
    if (
        !Array.isArray(user.permissions) ||
        !user.permissions.every((permission) => typeof permission === 'string')
    ) {
        throw new UiError('INVALID_PERMISSION_RESPONSE');
    }
}

/**
 * Hook de sesión: seleccionar campos concretos evita suscripciones innecesarias.
 * @returns Estado o porción seleccionada; getState() permite invocar acciones fuera de React.
 * @remarks Zustand suministra set para actualizar estado y get para leerlo en callbacks tardíos.
 * Solo se guarda el perfil aquí; el JWT permanece en el módulo HTTP y las contraseñas no se guardan.
 */
export const useAuthStore = create<AuthState>((set, get) => ({
    isAuthenticated: false,
    user: null,

    /**
     * Inicia una generación nueva; ningún resultado de la generación anterior podrá restaurarla.
     * Los parámetros/retorno siguen AuthState.login; los efectos son transporte, temporizador y perfil.
     */
    login: async (email, password) => {
        /** Generación capturada antes de esperar la red; se compara tras cada paso asíncrono. */
        const version = ++sessionVersion;
        clearToken();
        set({ isAuthenticated: false, user: null });

        try {
            /** Respuesta de emisión; tokenType/expiresIn se comprueban antes de aceptar el token. */
            const session = await authApi.login(email.trim(), password);
            if (version !== sessionVersion) {
                throw new UiError('LOGIN_CANCELLED');
            }
            if (
                !session.token || session.tokenType !== 'Bearer' ||
                !Number.isFinite(session.expiresIn) ||
                session.expiresIn <= 0 || session.expiresIn > 3_600
            ) {
                throw new UiError('INVALID_SESSION_RESPONSE');
            }

            setAccessToken(session.token);
            /** La conversión a milisegundos usa expiresIn; solo expira la misma generación. */
            expirationTimer = setTimeout(() => {
                if (version === sessionVersion) get().logoutLocal();
            }, session.expiresIn * 1_000);

            /** Identidad y permisos consultados con el token recién recibido. */
            const user = await authApi.me();
            if (version !== sessionVersion) {
                throw new UiError('LOGIN_CANCELLED');
            }
            validateUser(user);
            set({ isAuthenticated: true, user });
        } catch (error) {
            if (version === sessionVersion) {
                clearToken();
                set({ isAuthenticated: false, user: null });
            }
            throw error;
        }
    },

    /**
     * Actualiza el perfil de la misma sesión sin emitir otro JWT ni renovar su duración.
     * Un fallo de red conserva el estado y se propaga; el interceptor atiende los 401.
     */
    revalidate: async () => {
        if (!get().isAuthenticated) return;
        /** Evita sobrescribir una sesión iniciada mientras /me estaba en curso. */
        const version = sessionVersion;
        /** Vista actual del servidor; no se aplicará si cambió sessionVersion. */
        const user = await authApi.me();
        if (version === sessionVersion) {
            try {
                validateUser(user);
                set({ user });
            } catch (error) {
                get().logoutLocal();
                throw error;
            }
        }
    },

    /**
     * Solicita revocación de todas las sesiones; no transforma fallos de red en éxito.
     * Sin sesión local basta con limpiar memoria, porque no hay credencial que enviar.
     */
    logout: async () => {
        if (!get().isAuthenticated) {
            get().logoutLocal();
            return;
        }
        /** La confirmación remota no debe cerrar una sesión nueva iniciada mientras esperaba. */
        const version = sessionVersion;
        // Ante un error de red, propagar el error para que la UI no anuncie
        // falsamente que el servidor confirmó la revocación.
        await authApi.logoutAll();
        if (version === sessionVersion) get().logoutLocal();
    },

    /** Invalida callbacks antiguos y limpia esta pestaña; no revoca credenciales en el servidor. */
    logoutLocal: () => {
        sessionVersion++;
        clearToken();
        set({ isAuthenticated: false, user: null });
    },

    /** Aplica el cambio remoto y obliga a reautenticar la sesión afectada tras el 204. */
    changePassword: async (currentPassword, newPassword) => {
        /** Identifica qué sesión debe limpiarse; evita afectar una nueva sesión concurrente. */
        const version = sessionVersion;
        await authApi.changePassword(currentPassword, newPassword);
        if (version === sessionVersion) get().logoutLocal();
    },
}));

/** Conecta HTTP con la acción local al cargar el módulo, sin importar el store desde http.ts. */
setAuthFailureHandler(() => useAuthStore.getState().logoutLocal());