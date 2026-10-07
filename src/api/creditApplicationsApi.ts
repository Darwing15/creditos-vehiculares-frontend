import { api } from './http';
/** 
 * Estados admitidos por CreditApplication. 
 * @author DarwinG 
 */
export type ApplicationStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED' | 'EXPIRED';

/** 
 * Respuesta publica de la solicitud. 
 * @author DarwinG
 */
export type CreditApplication = {
    applicationCode: string;
    applicationNumber: string;
    customerId: number;
    vehicleId: number;
    branchId: number;
    currency: 'PEN' | 'USD';
    vehiclePrice: number;
    downPayment: number;
    financedAmount: number;
    compensatoryInterestRate: number;
    installmentCount: number;
    status: ApplicationStatus;
    resolvedAt: string | null;
    resolvedBy: number | null;
    rejectionReason: string | null
};

/** 
 * Payload de alta: la sucursal se obtiene del usuario autenticado. 
 * @author DarwinG 
 */
export type CreateCreditApplication = {
    customerId: number;
    vehicleId: number;
    currency: 'PEN' | 'USD';
    vehiclePrice: number;
    downPayment: number;
    installmentCount: number
};

/** 
 * Entrada para la simulacion financiera no persistente. 
 * @author DarwinG
 */
export type CreditSimulationRequest = {
    currency: 'PEN' | 'USD';
    vehiclePrice: number;
    downPayment: number;
    installmentCount: number;
};

/** 
 * Estimacion calculada por los domain services. 
 * @author DarwinG
 */
export type CreditSimulationResponse = {
    currency: 'PEN' | 'USD';
    financedAmount: number;
    compensatoryInterestRate: number;
    monthlyCompensatoryInterestAmount: number;
    installmentCount: number;
    estimatedMonthlyInstallment: number;
};

export const creditApplicationsApi = {
    /** Relee el estado actual dentro de la sucursal autenticada. */
    async get(applicationCode: string): Promise<CreditApplication> {
        return (await api.get<CreditApplication>(
            `/credit-applications/${encodeURIComponent(applicationCode)}`
        )).data;
    },

    /** Aprueba sin aceptar identidad, sucursal ni condiciones desde el cliente. */
    async approve(applicationCode: string): Promise<CreditApplication> {
        return (await api.patch<CreditApplication>(
            `/credit-applications/${encodeURIComponent(applicationCode)}/approve`
        )).data;
    },

    /** Lista solicitudes por estado. */
    async list(status: ApplicationStatus): Promise<CreditApplication[]> {
        return (await api.get<CreditApplication[]>(
            '/credit-applications', { params: { status } }
        )).data;
    },

    /** Registra la solicitud. */
    async create(request: CreateCreditApplication): Promise<CreditApplication> {
        return (await api.post<CreditApplication>(
            '/credit-applications', request
        )).data;
    },
    
    /** Simula sin registrar solicitud ni credito. */
    async simulate(request: CreditSimulationRequest): Promise<CreditSimulationResponse> {
        return (await api.post<CreditSimulationResponse>(
            '/credit-applications/simulations', request
        )).data;
    },
};