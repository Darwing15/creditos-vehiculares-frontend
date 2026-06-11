import { X, FileDigit, Motorbike } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehiculo: any;
}

export default function ModalNuevoVehiculo({ isOpen, onClose, vehiculo }: ModalProps) {
  if (!isOpen) return null;

  const isEdit = !!vehiculo;

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      {/* Contenedor del Modal con alto máximo y flexbox */}
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl border border-slate-200 flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200">

        {/* Cabecera del Modal (FIJA) */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 bg-slate-50 flex-shrink-0">
          <div className="flex items-center gap-2">
            <Motorbike className="text-emerald-600" size={20} />
            <h2 className="text-lg font-bold text-slate-800">
              {isEdit ? `Editar Vehículo: ${vehiculo.marca} ${vehiculo.modelo}`
                : 'Registrar Nuevo Vehículo'}
            </h2>
          </div>
          <button onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Formulario completo */}
        <form className="flex flex-col flex-1 overflow-hidden" onSubmit={(e) => e.preventDefault()}>

          {/* Cuerpo del Formulario (CON SCROLL EN CASO DE EXCESO) */}
          <div className="p-6 space-y-6 overflow-y-auto flex-1 bg-white">

            {/* SECCIÓN 1: Datos Generales */}
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">1. Datos Generales del Vehículo</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600">Tipo de Vehículo</label>
                  <select className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-emerald-500 outline-none">
                    <option value="">Seleccionar...</option>
                    <option value="motocicleta">Motocicleta Lineal</option>
                    <option value="trimoto_carga">Trimoto de Carga / Furgón</option>
                    <option value="trimoto_pasajero">Trimoto de Pasajeros (Torito)</option>
                    <option value="vehiculo_menor">Otros Vehículos Menores</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600">Marca</label>
                  <select className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-emerald-500 outline-none">
                    <option value="">Seleccionar...</option>
                    <option value="honda">Honda</option>
                    <option value="bajaj">Bajaj</option>
                    <option value="yamaha">Yamaha</option>
                    <option value="ronco">Ronco</option>
                    <option value="wanxin">Wanxin</option>
                  </select>
                </div>

                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-xs font-semibold text-slate-600">Modelo Específico</label>
                  <input type="text"
                    required
                    defaultValue={vehiculo?.modelo || ''}
                    placeholder="Ej: Pulsar NS200 FI o Torito RE 4S"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500 bg-white" />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600">Año de Fab.</label>
                  <input type="number" placeholder="2026" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500 bg-white" />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600">Color</label>
                  <input type="text" placeholder="Ej: Azul / Negro" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500 bg-white" />
                </div>

              </div>
            </div>

            {/* SECCIÓN 2: Identificadores Técnicos y Legales */}
            <div className="bg-amber-50/50 p-4 rounded-xl border border-amber-100">
              <div className="flex items-center gap-2 mb-3">
                <FileDigit className="text-amber-600" size={16} />
                <h3 className="text-xs font-bold text-amber-800 uppercase tracking-wider">2. Identificadores Únicos y Legales</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600">Número de Chasis (VIN)</label>
                  <input
                    type="text"
                    required
                    defaultValue={vehiculo?.chasis || ''}
                    placeholder="17 caracteres alfanuméricos"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-amber-500 bg-white font-mono uppercase"
                    maxLength={17}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600">Número de Motor</label>
                  <input
                    type="text"
                    required
                    defaultValue={vehiculo?.motor || ''}
                    placeholder="Código grabado en el motor"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-amber-500 bg-white font-mono uppercase"
                  />
                </div>

                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-xs font-semibold text-slate-600">Número de DUA (Declaración Única de Aduanas)</label>
                  <input
                    type="text"
                    placeholder="Ej: 118-2026-10-XXXXXX"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-amber-500 bg-white font-mono uppercase"
                  />
                </div>
              </div>

              <p className="text-[10px] text-amber-600 mt-2.5">
                * Crucial: El VIN, Motor y DUA deben coincidir exactamente con el certificado de importación para evitar rechazos en registros públicos (SUNARP).
              </p>
            </div>

            {/* SECCIÓN 3: Datos Comerciales */}
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">3. Datos Comerciales</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600">Precio de Venta Sugerido (S/)</label>
                  <div className="relative rounded-xl shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <span className={`text-sm`}>S/</span>
                    </div>
                    <input
                      type="number"
                      required
                      defaultValue={vehiculo?.precio}
                      placeholder="Ej: 14500"
                      className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500 bg-white" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600">Estado Inicial en Sistema</label>
                  <select className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-emerald-500 outline-none">
                    <option value="disponible">Disponible (Para exhibición/venta)</option>
                    <option value="almacen">En Almacén Técnico</option>
                  </select>
                </div>
              </div>
            </div>

          </div>

          {/* Botones de Acción (FIJOS ABAJO) */}
          <div className="flex justify-end gap-3 px-6 py-4 border-t border-slate-100 bg-slate-50 flex-shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium shadow-sm transition-colors"
            >
              Guardar Vehículo
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}