/** 
 * Pruebas sin dependencias adicionales de traducción y acceso. 
 * @author DarwinG 
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { ERROR_MESSAGES, UI_MESSAGES, UiError, userMessageForFailure } from '../src/api/errorMessages.ts';
import { canAccessModule, MODULE_ACCESS } from '../src/security/moduleAccess.ts';
import type { ModuleId } from '../src/security/moduleAccess.ts';

test('todos los códigos actuales del backend tienen traducción', () => {
  const codes: string[] = JSON.parse(readFileSync(new URL('./backend-error-codes.json', import.meta.url), 'utf8'));
  assert.ok(codes.length > 40);
  for (const code of codes) {
    assert.ok(Object.hasOwn(ERROR_MESSAGES, code), code);
    assert.notEqual(userMessageForFailure({ hasResponse: true, status: 400, errorCode: code }), UI_MESSAGES.UNEXPECTED);
  }
});

test('credenciales inválidas tienen una explicación en español', () => {
  assert.equal(userMessageForFailure({ hasResponse: true, status: 401, errorCode: 'INVALID_CREDENTIALS' }),
    'Correo electrónico o contraseña incorrectos.');
});

test('login 401 sin contrato no se confunde con sesión expirada', () => {
  assert.equal(userMessageForFailure({ hasResponse: true, status: 401, isLogin: true }), ERROR_MESSAGES.INVALID_CREDENTIALS);
  assert.equal(userMessageForFailure({ hasResponse: true, status: 401 }), ERROR_MESSAGES.UNAUTHORIZED);
});

test('sin respuesta devuelve servicio no disponible', () => {
  assert.equal(userMessageForFailure({ hasResponse: false }), UI_MESSAGES.SERVICE_UNAVAILABLE);
});

test('500 vacío de proxy devuelve servicio no disponible', () => {
  assert.equal(userMessageForFailure({ hasResponse: true, status: 500 }), UI_MESSAGES.SERVICE_UNAVAILABLE);
});

test('502 y 503 indican indisponibilidad', () => {
  for (const status of [502, 503]) assert.equal(userMessageForFailure({ hasResponse: true, status }), UI_MESSAGES.SERVICE_UNAVAILABLE);
});

test('timeouts de transporte y gateway tienen su mensaje', () => {
  for (const transportCode of ['ETIMEDOUT', 'ECONNABORTED'])
    assert.equal(userMessageForFailure({ hasResponse: false, transportCode }), UI_MESSAGES.TIMEOUT);
  for (const status of [408, 504]) assert.equal(userMessageForFailure({ hasResponse: true, status }), UI_MESSAGES.TIMEOUT);
});

test('500 con contrato INTERNAL_ERROR conserva su clasificación', () => {
  assert.equal(userMessageForFailure({ hasResponse: true, status: 500, errorCode: 'INTERNAL_ERROR' }), ERROR_MESSAGES.INTERNAL_ERROR);
});

test('código desconocido usa estado HTTP y no requiere texto del servidor', () => {
  assert.equal(userMessageForFailure({ hasResponse: true, status: 409, errorCode: 'UNKNOWN' }), ERROR_MESSAGES.DATA_INTEGRITY_CONFLICT);
  assert.equal(userMessageForFailure({ hasResponse: true, status: 400, errorCode: { message: 'SQL failure' } }), ERROR_MESSAGES.VALIDATION_ERROR);
});

test('no se permite heredar propiedades como código de error', () => {
  assert.equal(userMessageForFailure({ hasResponse: true, status: 400, errorCode: 'toString' }), ERROR_MESSAGES.VALIDATION_ERROR);
});

test('403 y límite de solicitudes son mensajes de usuario', () => {
  assert.equal(userMessageForFailure({ hasResponse: true, status: 403 }), ERROR_MESSAGES.FORBIDDEN);
  assert.match(userMessageForFailure({ hasResponse: true, status: 429 }), /Espera/);
});

test('cancelación explícita y errores locales tienen códigos seguros', () => {
  assert.equal(userMessageForFailure({ hasResponse: false, transportCode: 'ERR_CANCELED' }), UI_MESSAGES.OPERATION_CANCELLED);
  const error = new UiError('INVALID_SESSION_RESPONSE');
  assert.equal(error.code, 'INVALID_SESSION_RESPONSE');
  assert.equal(error.message, 'INVALID_SESSION_RESPONSE');
});

test('sin perfil se deniegan todos los módulos, incluso maquetas', () => {
  for (const id of Object.keys(MODULE_ACCESS) as ModuleId[]) assert.equal(canAccessModule(id, undefined), false);
});

test('un usuario sin permisos solo ve portada y maquetas acordadas', () => {
  const visible = (Object.keys(MODULE_ACCESS) as ModuleId[]).filter(id => canAccessModule(id, []));
  assert.deepEqual(visible, ['dashboard', 'cobranza', 'caja', 'reportes', 'configuracion']);
});

test('cada módulo integrado requiere su código exacto de lectura', () => {
  const pairs = [
    ['clientes', 'customers:read'], ['creditos', 'credit-applications:read'],
    ['inventario', 'vehicles:read'], ['usuarios', 'security:users:read'],
    ['sucursales', 'security:branches:read'],
  ] as const;
  for (const [id, permission] of pairs) {
    assert.equal(canAccessModule(id, [permission]), true);
    assert.equal(canAccessModule(id, ['ROLE_ADMIN']), false);
    assert.equal(canAccessModule(id, []), false);
  }
});

test('crear o resolver crédito no habilita la consulta de solicitudes', () => {
  assert.equal(canAccessModule('creditos', ['credit-applications:create', 'credit-applications:resolve']), false);
});

test('retirar un permiso retira acceso visual sin interpretar nombre de rol', () => {
  assert.equal(canAccessModule('usuarios', ['security:users:read']), true);
  assert.equal(canAccessModule('usuarios', ['security:users:write']), false);
});
