/** 
 * Solo las unidades disponibles admiten edicion de catalogo. 
 * @author DarwinG 
 */
import { UiError } from '../api/errorMessages';
import CatalogFormDialog from './CatalogFormDialog';
import type { CatalogDialogProps, FieldSpec, FormValues } from './CatalogFormDialog';
import { vehicleApi } from '../api/vehicleApi';
import type { CreateVehicle } from '../api/vehicleApi';

const fields: readonly FieldSpec[] = [
  { name: 'vehicleType', label: 'Tipo de vehículo', maxLength: 50, required: true },
  { name: 'brand', label: 'Marca', maxLength: 100, required: true },
  { name: 'model', label: 'Modelo', maxLength: 150, required: true },
  { name: 'color', label: 'Color', maxLength: 50, required: true },
  { name: 'chassisNumber', label: 'Número de chasis', maxLength: 100, required: true },
  { name: 'engineNumber', label: 'Número de motor', maxLength: 100, required: true },
  { name: 'duaNumber', label: 'DUA', maxLength: 50, required: false },
  { name: 'manufacturingYear', label: 'Año de fabricación', type: 'number', required: true, step: '1', min: -2147483648, max: 2147483647 },
  { name: 'referencePrice', label: 'Precio de referencia', type: 'amount', required: true, step: '0.01', min: 0.01, max: 9999999999.99 }
];

async function load(code: string) {
  const detail = await vehicleApi.get(code);
  if (detail.status !== 'AVAILABLE')
    throw new UiError('VEHICLE_EDIT_BLOCKED');
  return {
    revision: detail.revision,
    values: Object.fromEntries(fields.map(field => [field.name, String(detail[field.name as keyof CreateVehicle] ?? '')]))
  };
}

async function save(values: FormValues, revision: string | null, code: string | null) {
  const request: CreateVehicle = {
    vehicleType: values.vehicleType.trim(),
    brand: values.brand.trim(),
    model: values.model.trim(),
    manufacturingYear: Number(values.manufacturingYear),
    color: values.color.trim(),
    chassisNumber: values.chassisNumber.trim(),
    engineNumber: values.engineNumber.trim(),
    duaNumber: values.duaNumber.trim() || null,
    referencePrice: Number(values.referencePrice),
  };

  if (code && revision)
    return vehicleApi.update(code, { ...request, expectedRevision: revision });

  return vehicleApi.create(request);
}

export default function ModalNuevoVehiculo(props: CatalogDialogProps) {
  return <CatalogFormDialog {...props} title="vehículo" module="vehicles" fields={fields} load={load} save={save}
    note="Una unidad nueva queda disponible en tu sucursal. Solo puedes editar unidades disponibles. El precio de referencia no fija las condiciones de una solicitud." />;
}
