# Frontend del Sistema de Créditos Vehiculares

Aplicación React, TypeScript y Vite para operaciones de clientes, vehículos y créditos, con permisos del usuario autenticado.

## Ejecución

```text
npm install
npm run dev
npm run build
npm run lint
```

VITE_API_BASE_URL configura el destino de la API propia; por defecto utiliza /api. El JWT de la sesión se incorpora mediante el transporte autenticado de src/api/http.ts.

## Alta de clientes y consulta DNI

ModalNuevoCliente activa la búsqueda cuando el documento es DNI y tiene ocho dígitos ASCII. Después de 350 ms, customerApi.lookupDni solicita POST /customers/identity-lookups a la API propia. El backend decide si utiliza caché o Factiliza.

CatalogFormDialog recibe FormLookup como extensión opcional. useFormLookup controla documento, sesión, intento, cancelación y estados de búsqueda. Solo se completa un campo vacío; se conserva cualquier corrección escrita por el operador mientras se espera. Cambiar documento limpia el nombre y descarta respuestas anteriores.

Guardar permanece bloqueado durante la búsqueda. Un fallo permite Reintentar consulta o completar el nombre manualmente. CE requiere quince dígitos en la captura y nombre manual. Editar un cliente existente no consulta automáticamente; tipo/número permanecen inmutables.

La consulta no acredita titularidad ni aprobación crediticia. El nombre continúa editable. No existe token Factiliza en VITE_*, localStorage o contratos del navegador; la credencial externa pertenece exclusivamente al backend.

## Errores

src/api/errorMessages.ts conserva los códigos controlados de identidad para errores de consulta. Los 401/403 de la aplicación mantienen prioridad y no se reinterpretan como saldo externo. customerApi valida que documento y nombre de respuesta puedan utilizarse antes de aplicar el autocompletado.

## Pruebas

Los tests de utilidades están en tests/*.test.ts, incluidos identityMessages.test.ts. Se ejecutan con un Node compatible con strip types:

```text
node --experimental-strip-types --test tests/*.test.ts
```

Las pruebas históricas identityLookupFlows.test.mjs se encuentran en el paquete de entrega del 11/10/2026 y usan API simulada. Para reproducirlas desde este repositorio debe incorporarse el archivo y configurarse Playwright como herramienta de pruebas, sin añadirlo como dependencia de producción. No requieren token real ni consumen cuota externa.

La documentación técnica de backend se encuentra en docs/customers/factiliza-dni.md de su repositorio; describe contrato completo, presupuesto local, persistencia y conservación. Mantener esa referencia como fuente de parámetros para evitar valores divergentes entre README.
