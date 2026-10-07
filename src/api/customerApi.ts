/** 
 * Fichas de clientes de la sucursal autenticada. 
 * @author DarwinG 
 */
import { api } from './http';
import { catalogApi } from './catalogApi';
import type { CustomerOption } from './catalogApi';

export type CreateCustomer = {
    fullName: string; documentType: 'DNI' | 'CE'; documentNumber: string;
    phone: string | null; email: string | null; occupation: string | null;
    monthlyIncome: number | null; address: string | null; mapReference: string | null;
};

export type UpdateCustomer = Omit<CreateCustomer, 'documentType' | 'documentNumber'> & { expectedRevision: string };

export type CustomerDetail = CreateCustomer & {
    id: number;
    customerCode: string;
    branchId: number;
    active: boolean;
    revision: string
};

export const customerApi = {
    list: (): Promise<CustomerOption[]> => catalogApi.customers(),

    get: async (code: string): Promise<CustomerDetail> => (
        await api.get<CustomerDetail>(`/customers/${encodeURIComponent(code)}`)
    ).data,

    create: async (request: CreateCustomer): Promise<CustomerDetail> => (
        await api.post<CustomerDetail>('/customers', request)
    ).data,

    update: async (code: string, request: UpdateCustomer): Promise<CustomerDetail> => (
        await api.put<CustomerDetail>(`/customers/${encodeURIComponent(code)}`, request)
    ).data,
};
