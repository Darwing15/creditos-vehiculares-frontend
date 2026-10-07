/** 
 * Alta y edicion de la misma identidad; no cambia documento ni sucursal. 
 * @author DarwinG 
 */
import CatalogFormDialog from './CatalogFormDialog';
import type { CatalogDialogProps, FieldSpec, FormValues } from './CatalogFormDialog';
import { customerApi } from '../api/customerApi';
import type { CreateCustomer } from '../api/customerApi';

const documentLength = (values: FormValues) => values.documentType === 'CE' ? 15 : 8;

const fields: readonly FieldSpec[] = [
  { name: 'documentType', label: 'Tipo de documento', choices: ['DNI', 'CE'], required: true, immutable: true, resetFieldsOnChange: ['documentNumber'] },
  { name: 'fullName', label: 'Nombre completo', maxLength: 150, required: true },
  {
    name: 'documentNumber', label: 'Número de documento', maxLength: documentLength, minLength: documentLength, required: true, immutable: true, inputMode: 'numeric',
    pattern: values => `[0-9]{${documentLength(values)}}`,
    normalizeInput: (value, values) => value.replace(/[^0-9]/g, '').slice(0, documentLength(values))
  },
  { name: 'phone', label: 'Teléfono', maxLength: 20, required: false },
  { name: 'email', label: 'Correo electrónico', maxLength: 120, required: false, type: 'email' },
  { name: 'occupation', label: 'Ocupación', maxLength: 150, required: false },
  { name: 'address', label: 'Dirección', maxLength: 255, required: false },
  { name: 'mapReference', label: 'Referencia de ubicación', maxLength: 255, required: false },
  { name: 'monthlyIncome', label: 'Ingreso mensual declarado', type: 'amount', min: 0, max: 9999999999.99, step: '0.01' }
];

const optional = (value: string): string | null => value.trim() || null;

async function load(code: string) {
  const detail = await customerApi.get(code);
  return {
    revision: detail.revision,
    values: Object.fromEntries(fields.map(field => [field.name, String(detail[field.name as keyof CreateCustomer] ?? '')]))
  };
}

async function save(values: FormValues, revision: string | null, code: string | null) {
  const profile = {
    fullName: values.fullName.trim(),
    phone: optional(values.phone),
    email: optional(values.email),
    occupation: optional(values.occupation),
    monthlyIncome: values.monthlyIncome === '' ? null : Number(values.monthlyIncome),
    address: optional(values.address),
    mapReference: optional(values.mapReference),
  };

  if (code && revision)
    return customerApi.update(code, { ...profile, expectedRevision: revision });

  return customerApi.create({ ...profile, documentType: values.documentType === 'CE' ? 'CE' : 'DNI', documentNumber: values.documentNumber.trim() });
}
export default function ModalNuevoCliente(props: CatalogDialogProps) {
  return <CatalogFormDialog {...props} title="cliente" module="customers" fields={fields} load={load} save={save}
    note="El DNI requiere 8 dígitos y el CE 15. Al cambiar el tipo, vuelve a ingresar el número. El documento se conserva al editar. El ingreso mensual es declarado." />;
}
