/** 
 * Unidades fisicas de la sucursal autenticada. 
 * @author DarwinG 
 */
import { api } from './http';
import { catalogApi } from './catalogApi';
import type { VehicleOption } from './catalogApi';

export type CreateVehicle = {
    vehicleType: string;
    brand: string;
    model: string;
    manufacturingYear: number;
    color: string;
    chassisNumber: string;
    engineNumber: string;
    duaNumber: string | null;
    referencePrice: number;
};

export type UpdateVehicle = CreateVehicle & { expectedRevision: string };

export type VehicleDetail = CreateVehicle & {
    id: number;
    vehicleCode: string;
    branchId: number;
    status: VehicleOption['status'];
    revision: string
};

export const vehicleApi = {
    list: (): Promise<VehicleOption[]> => catalogApi.vehicles(),

    get: async (code: string): Promise<VehicleDetail> => (
        await api.get<VehicleDetail>(`/vehicles/${encodeURIComponent(code)}`)
    ).data,

    create: async (request: CreateVehicle): Promise<VehicleDetail> => (
        await api.post<VehicleDetail>('/vehicles', request)
    ).data,

    update: async (code: string, request: UpdateVehicle): Promise<VehicleDetail> => (
        await api.put<VehicleDetail>(`/vehicles/${encodeURIComponent(code)}`, request)
    ).data,
};
