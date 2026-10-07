/**
 * Presentacion en espanol del contrato de errores. Los mensajes tecnicos
 * del servidor nunca se interpolan en la interfaz.
 * @author DarwinG
 */
export const ERROR_MESSAGES = {
    USER_NOT_FOUND: 'No se encontró el usuario.',
    USER_ALREADY_EXISTS: 'Ya existe un usuario con ese correo electrónico.',
    USER_INACTIVE: 'El usuario está inactivo. Consulta con el administrador.',
    INVALID_CREDENTIALS: 'Correo electrónico o contraseña incorrectos.',
    ROLE_NOT_FOUND: 'No se encontró el rol.',
    ROLE_ALREADY_EXISTS: 'Ya existe un rol con ese nombre.',
    ROLE_IN_USE: 'El rol tiene usuarios asignados y no puede desactivarse.',
    BRANCH_NOT_FOUND: 'No se encontró la sucursal.',
    BRANCH_ALREADY_EXISTS: 'Ya existe una sucursal con ese código.',
    BRANCH_IN_USE: 'La sucursal tiene registros asociados y no puede desactivarse.',
    BRANCH_INACTIVE: 'La sucursal está inactiva. Consulta con el administrador.',
    ACCOUNT_DISABLED: 'La cuenta no está habilitada. Consulta con el administrador.',
    NEW_PASSWORD_MUST_BE_DIFFERENT: 'La nueva contraseña debe ser diferente de la actual.',
    INVALID_PERMISSION: 'Uno de los permisos seleccionados no es válido.',
    LAST_SECURITY_ADMIN_REQUIRED: 'Debe mantenerse al menos un administrador con todos los permisos requeridos.',
    SECURITY_SELF_DEACTIVATION: 'No puedes desactivar la cuenta que estás utilizando.',
    CUSTOMER_NOT_FOUND: 'No se encontró un cliente activo en tu sucursal.',
    CUSTOMER_ALREADY_EXISTS: 'Ya existe un cliente con ese documento.',
    VEHICLE_NOT_FOUND: 'No se encontró el vehículo en tu sucursal.',
    VEHICLE_ALREADY_EXISTS: 'Ya existe un vehículo con esos identificadores.',
    VEHICLE_NOT_EDITABLE: 'Solo puedes editar vehículos disponibles. Actualiza el inventario.',
    VEHICLE_OUT_OF_STOCK: 'El vehículo no está disponible para esta operación. Actualiza el inventario.',
    CREDIT_APPLICATION_INVALID_STATUS_TRANSITION: 'La solicitud ya no admite esta operación. Actualiza su estado.',
    CREDIT_APPLICATION_RESOLUTION_DATE_REQUIRED: 'No se pudo registrar la fecha de resolución de la solicitud.',
    CREDIT_APPLICATION_RESOLVER_REQUIRED: 'No se pudo identificar al responsable de resolver la solicitud.',
    CREDIT_APPLICATION_REJECTION_REASON_REQUIRED: 'Ingresa el motivo del rechazo.',
    CREDIT_APPLICATION_INVALID_DOWN_PAYMENT: 'La cuota inicial debe ser mayor o igual a cero y menor que el precio del vehículo.',
    CREDIT_APPLICATION_INVALID_FINANCED_AMOUNT: 'El monto financiado no es válido. Revisa el precio y la cuota inicial.',
    CREDIT_APPLICATION_INVALID_COMPENSATORY_INTEREST_RATE: 'La tasa de interés de la solicitud no es válida.',
    CREDIT_APPLICATION_INVALID_INSTALLMENT_COUNT: 'Selecciona un plazo entre 1 y 12 meses.',
    CREDIT_APPLICATION_NOT_FOUND: 'No se encontró la solicitud de crédito en tu sucursal.',
    CREDIT_NOT_FOUND: 'No se encontró el crédito.',
    CREDIT_ALREADY_CANCELLED: 'El crédito ya está cancelado.',
    CREDIT_ALREADY_FINISHED: 'El crédito ya está finalizado.',
    INSTALLMENT_NOT_FOUND: 'No se encontró la cuota.',
    INSTALLMENT_ALREADY_PAID: 'La cuota ya está pagada.',
    INSTALLMENT_INVALID_NUMBER: 'El número de cuota no es válido.',
    INSTALLMENT_INVALID_PRINCIPAL_AMOUNT: 'El capital de la cuota no es válido.',
    INSTALLMENT_INVALID_COMPENSATORY_INTEREST_AMOUNT: 'El interés de la cuota no es válido.',
    INSTALLMENT_INVALID_OUTSTANDING_PRINCIPAL: 'El saldo de capital no es válido.',
    PAYMENT_NOT_FOUND: 'No se encontró el pago.',
    PAYMENT_ALREADY_APPLIED: 'El pago ya fue aplicado.',
    CASH_TRANSACTION_NOT_FOUND: 'No se encontró el movimiento de caja.',
    VALIDATION_ERROR: 'Revisa los datos ingresados. Hay campos faltantes o inválidos.',
    RESOURCE_NOT_FOUND: 'No se encontró el recurso solicitado.',
    RESOURCE_ALREADY_EXISTS: 'Ya existe un registro con esos datos.',
    UNAUTHORIZED: 'Tu sesión no es válida o ha expirado. Inicia sesión nuevamente.',
    FORBIDDEN: 'No tienes permiso para realizar esta operación.',
    CONCURRENT_MODIFICATION: 'El registro cambió mientras lo editabas. Actualízalo antes de guardar.',
    DATA_INTEGRITY_CONFLICT: 'La operación entra en conflicto con los datos existentes.',
    INTERNAL_ERROR: 'No se pudo procesar la solicitud. Intenta nuevamente más tarde.',
} as const;

/** 
 * Mensajes seguros que no dependen del texto de una excepcion. 
 * @author DarwinG 
 */
export const UI_MESSAGES = {
    VEHICLE_EDIT_BLOCKED: 'El vehículo ya está reservado o vendido. Cierra el formulario y actualiza el inventario.',
    SERVICE_UNAVAILABLE: 'Servicio no disponible. Revisa tu conexión e intenta nuevamente más tarde.',
    TIMEOUT: 'El servicio tardó demasiado en responder. Intenta nuevamente más tarde.',
    OPERATION_CANCELLED: 'La operación fue cancelada.',
    LOGIN_CANCELLED: 'El inicio de sesión fue cancelado.',
    INVALID_SESSION_RESPONSE: 'No se pudo iniciar sesión. El servidor devolvió una respuesta inválida.',
    INVALID_PERMISSION_RESPONSE: 'No se pudieron cargar los permisos de tu cuenta. Inicia sesión nuevamente.',
    UNEXPECTED: 'No se pudo completar la operación. Intenta nuevamente.',
} as const;

/** 
 * Error local controlado con codigo estable; no transporta secretos. 
 * @author DarwinG 
 */
export class UiError extends Error {
    readonly code: keyof typeof UI_MESSAGES;
    constructor(code: keyof typeof UI_MESSAGES) {
        super(code);
        this.name = 'UiError';
        this.code = code;
    }
}

/** 
 * Datos minimos para clasificar transporte y contrato sin depender de Axios. 
 * @author DarwinG 
 */
export interface ApiFailure {
    hasResponse: boolean;
    status?: number;
    errorCode?: unknown;
    transportCode?: string;
    isLogin?: boolean;
}

/**
 * Traduce por código, con respaldo por estado HTTP. Una respuesta de proxy
 * sin contrato puede contener HTML, estar vacía o usar un estado 500.
 * @param failure clasificación del fallo; no se utiliza message del servidor
 * @returns texto seguro en español
 * @author DarwinG
 */
export function userMessageForFailure(failure: ApiFailure): string {
    if (failure.transportCode === 'ERR_CANCELED')
        return UI_MESSAGES.OPERATION_CANCELLED;
    if (['ECONNABORTED', 'ETIMEDOUT'].includes(failure.transportCode ?? '') ||
        failure.status === 408 || failure.status === 504)
        return UI_MESSAGES.TIMEOUT;
    if (!failure.hasResponse || failure.status === 502 || failure.status === 503)
        return UI_MESSAGES.SERVICE_UNAVAILABLE;
    if (failure.status === 500 && failure.errorCode !== 'INTERNAL_ERROR')
        return UI_MESSAGES.SERVICE_UNAVAILABLE;
    if (failure.status !== undefined && failure.status >= 500)
        return ERROR_MESSAGES.INTERNAL_ERROR;
    if (failure.status === 401 && failure.isLogin)
        return ERROR_MESSAGES.INVALID_CREDENTIALS;
    if (failure.status === 403)
        return ERROR_MESSAGES.FORBIDDEN;
    if (typeof failure.errorCode === 'string' && Object.hasOwn(ERROR_MESSAGES, failure.errorCode))
        return ERROR_MESSAGES[failure.errorCode as keyof typeof ERROR_MESSAGES];

    switch (failure.status) {
        case 400:
        case 422:
            return ERROR_MESSAGES.VALIDATION_ERROR;
        case 401:
            return ERROR_MESSAGES.UNAUTHORIZED;
        case 404:
            return ERROR_MESSAGES.RESOURCE_NOT_FOUND;
        case 409:
            return ERROR_MESSAGES.DATA_INTEGRITY_CONFLICT;
        case 429:
            return 'Se realizaron demasiadas solicitudes. Espera un momento e intenta nuevamente.';
        default: return UI_MESSAGES.UNEXPECTED;
    }
}
