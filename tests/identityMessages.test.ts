import test from 'node:test';
import assert from 'node:assert/strict';
import { userMessageForFailure, ERROR_MESSAGES } from '../src/api/errorMessages.ts';

test('503 de cuota externa conserva el mensaje específico de identidad', () => {
    assert.equal(userMessageForFailure({ hasResponse: true, status: 503, errorCode: 'IDENTITY_QUOTA_EXHAUSTED' }),
        ERROR_MESSAGES.IDENTITY_QUOTA_EXHAUSTED);
});
test('504 de DNI conserva la posibilidad de ingreso manual', () => {
    assert.equal(userMessageForFailure({ hasResponse: true, status: 504, errorCode: 'IDENTITY_PROVIDER_TIMEOUT' }),
        ERROR_MESSAGES.IDENTITY_PROVIDER_TIMEOUT);
});
test('código externo no enmascara 401 ni 403 de la sesión', () => {
    assert.equal(userMessageForFailure({ hasResponse: true, status: 401, errorCode: 'IDENTITY_QUOTA_EXHAUSTED' }),
        ERROR_MESSAGES.UNAUTHORIZED);
    assert.equal(userMessageForFailure({ hasResponse: true, status: 403, errorCode: 'IDENTITY_QUOTA_EXHAUSTED' }),
        ERROR_MESSAGES.FORBIDDEN);
});
