/**
 * Lectura tipada de los catalogos usados por CreditApplication.
 * @author DarwinG
 */
import { api } from './http';

export type CustomerOption = {
    id: number;
    customerCode: string;
    fullName: string;
    documentType: 'DNI' | 'CE';
    documentNumber: string;
    phone: string | null;
    address: string | null;
    branchId: number;
    active: boolean;
};

export type VehicleOption = {
    id: number;
    vehicleCode: string;
    vehicleType: string;
    brand: string;
    model: string;
    manufacturingYear: number;
    color: string;
    chassisNumber: string;
    engineNumber: string;
    referencePrice: number;
    branchId: number;
    status: 'AVAILABLE' | 'RESERVED' | 'SOLD';
};

export const catalogApi = {
    /** Clientes activos de la sucursal asociada a la sesion. */
    async customers(): Promise<CustomerOption[]> {
        return (await api.get<CustomerOption[]>('/customers', { params: { active: true } })).data;
    },

    /** Inventario de la sucursal; omite status para rotular solicitudes ya registradas. */
    async vehicles(status?: VehicleOption['status']): Promise<VehicleOption[]> {
        return (await api.get<VehicleOption[]>('/vehicles', { params: status ? { status } : {} })).data;
    },
};