import type { CreditApplication } from '../api/creditApplicationsApi';
import type { AuthUser } from '../api/securityApi';

/** Guards visuales; SecurityConfig y los servicios son la autoridad del servidor. */
export function canApproveCreditApplication(
    user: AuthUser | null,
    application: CreditApplication | null,
): boolean {
    return user !== null && application !== null
        && user.permissions.includes('credit-applications:read')
        && user.permissions.includes('credit-applications:resolve')
        && user.branchId === application.branchId
        && application.status === 'PENDING';
}
