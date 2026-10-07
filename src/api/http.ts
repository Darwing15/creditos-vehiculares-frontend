/**
 * @file http.ts — propuesta de integración documentada.
 * @author DarwinG
 */

import axios from 'axios';
import { UiError, UI_MESSAGES, userMessageForFailure } from './errorMessages';

/** Configuración común; los dos clientes comparten destino y límite de espera. */
const configuration = {
    /** URL pública; /api permite desplegar detrás de un proxy del mismo origen. */
    baseURL: import.meta.env.VITE_API_BASE_URL ?? '/api',
    /** Milisegundos de espera; expirar no revierte una escritura del servidor. */
    timeout: 15_000,
};

/** Transporte de login: no incorpora la credencial de una sesión previa. */
export const publicApi = axios.create(configuration);
/** Transporte autenticado; sus interceptores se registran una vez al cargar el módulo. */
export const api = axios.create(configuration);

/** Credencial solo en memoria; null impide adjuntar Authorization. Nunca se registra en logs. */
let accessToken: string | null = null;
/** Enlace hacia la limpieza del store; evita que el transporte importe Zustand. */
let authFailureHandler: () => void = () => { };

/**
 * Cambia la credencial usada por las próximas solicitudes privadas.
 * @param token JWT emitido por el servidor, o null para retirarlo del transporte.
 * @returns Nada; modifica exclusivamente la referencia en memoria.
 * @remarks No valida la firma, no persiste el token ni revoca sesiones remotas.
 * @author DarwinG
 */
export function setAccessToken(token: string | null): void {
    accessToken = token;
}

/**
 * Registra la reacción de la aplicación ante un 401 de la sesión vigente.
 * @param handler Callback sin parámetros que limpia el estado local de sesión.
 * @returns Nada; reemplaza el callback anterior, no acumula listeners.
 * @author DarwinG
 */
export function setAuthFailureHandler(handler: () => void): void {
    authFailureHandler = handler;
}

api.interceptors.request.use(
    /**
     * Adjunta la credencial actual o retira una cabecera anterior.
     * @param request Configuración Axios de la solicitud que está por enviarse.
     * @returns La misma configuración con Authorization ajustado.
     * @remarks Solo usar este cliente con los endpoints de la API configurada.
     */
    (request) => {
        if (accessToken) {
            request.headers.set('Authorization', `Bearer ${accessToken}`);
        } else {
            request.headers.delete('Authorization');
        }
        return request;
    },
);

api.interceptors.response.use(
    /**
     * @param response Respuesta exitosa del servidor.
     * @returns La respuesta sin alterar sus datos.
     */
    (response) => response,
    /**
     * Notifica expiración/revocación únicamente para la credencial aún vigente.
     * @param error Fallo de transporte o respuesta HTTP rechazada por Axios.
     * @returns Promesa rechazada con el error original para que cada pantalla lo maneje.
     * @remarks Ni un 403 ni un fallo de red equivalen a pérdida de autenticación.
     */
    (error: unknown) => {
        if (axios.isAxiosError(error)) {
            /** Cabecera realmente enviada; identifica qué sesión originó este fallo. */
            const sentAuthorization =
                error.config?.headers.get('Authorization');

            // Un 401 de una sesión anterior no debe cerrar una sesión nueva.
            if (
                error.response?.status === 401 &&
                accessToken !== null &&
                sentAuthorization === `Bearer ${accessToken}`
            ) {
                authFailureHandler();
            }
        }
        return Promise.reject(error);
    },
);

/**
 * Traduce un error a un mensaje de interfaz conservando su significado.
 * @param error Valor capturado por un catch; puede no proceder de Axios.
 * @returns Mensaje para presentar al usuario, sin incluir cabeceras ni credenciales.
 * @remarks Es una función de presentación: no cambia sesión ni reintenta operaciones.
 * @author DarwinG
 */
export function apiErrorMessage(error: unknown): string {
    if (error instanceof UiError) return UI_MESSAGES[error.code];
    if (axios.isAxiosError(error)) {
        const data: unknown = error.response?.data;
        const errorCode = data !== null && typeof data === 'object' && 'errorCode' in data
            ? data.errorCode : undefined;
        /* Login puede usar una URL relativa o absoluta; nunca se muestra la URL al usuario. */
        const requestPath = error.config?.url?.split('?')[0];
        return userMessageForFailure({
            hasResponse: error.response !== undefined,
            status: error.response?.status,
            transportCode: error.code,
            errorCode,
            isLogin: requestPath?.endsWith('/auth/login'),
        });
    }
    /* Error.message puede contener detalles técnicos o estar en inglés. */
    return UI_MESSAGES.UNEXPECTED;
}