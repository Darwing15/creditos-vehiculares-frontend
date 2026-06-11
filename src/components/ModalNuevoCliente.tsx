import { X, User, Briefcase, MapPin, Phone, Mail, DollarSign } from 'lucide-react';

interface ModalNuevoClienteProps {
  isOpen: boolean;
  onClose: () => void;
  cliente: any; // Mapeo dinámico del objeto cliente para edición
}

export default function ModalNuevoCliente({ isOpen, onClose, cliente }: ModalNuevoClienteProps) {
  if (!isOpen) return null;

  const isEdit = !!cliente;

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      {/* Contenedor del Modal con scroll adaptativo y animación suave */}
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg border border-slate-200 flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200">

        {/* Cabecera */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 bg-slate-50 flex-shrink-0">
          <div className="flex items-center gap-2">
            <User className="text-emerald-600" size={20} />
            <h2 className="text-lg font-bold text-slate-800">
              {isEdit ? `Editar Cliente: ${cliente.nombre}` : 'Registrar Nuevo Cliente'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-slate-200/70 rounded-lg text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Formulario Interno */}
        <form className="flex flex-col flex-1 overflow-hidden" onSubmit={(e) => e.preventDefault()}>

          {/* Cuerpo con Scroll Independiente */}
          <div className="p-6 space-y-5 overflow-y-auto flex-1">

            {/* SECCIÓN 1: IDENTIDAD */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-emerald-700 uppercase tracking-wider flex items-center gap-1.5">
                <User size={14} /> Datos de Identidad
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="col-span-1 sm:col-span-2 space-y-1">
                  <label className="text-xs font-semibold text-slate-600">Nombres y Apellidos Completos</label>
                  <input type="text" defaultValue={cliente?.nombre || ''} required className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500 bg-white" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-600">Número de DNI</label>
                  <input type="text" maxLength={8} defaultValue={cliente?.dni || ''} required className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm font-mono outline-none focus:ring-2 focus:ring-emerald-500 bg-white" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-600">Teléfono Móvil</label>
                  <input type="text" defaultValue={cliente?.telefono || ''} required className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500 bg-white" />
                </div>
                <div className="col-span-1 sm:col-span-2 space-y-1">
                  <label className="text-xs font-semibold text-slate-600">Correo Electrónico</label>
                  <input type="email" placeholder="correo@ejemplo.com" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500 bg-white" />
                </div>
              </div>
            </div>

            {/* SECCIÓN 2: SITUACIÓN LABORAL */}
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <h3 className="text-xs font-bold text-emerald-700 uppercase tracking-wider flex items-center gap-1.5">
                <Briefcase size={14} /> Información Económica
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-600">Ocupación / Actividad</label>
                  <input type="text" placeholder="Ej. Comerciante Independiente" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500 bg-white" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-600">Ingreso Mensual Neto</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-xs text-slate-400 font-medium">S/</span>
                    <input type="number" placeholder="0.00" className="w-full pl-8 pr-3 py-2 border border-slate-200 rounded-lg text-sm font-mono outline-none focus:ring-2 focus:ring-emerald-500 bg-white" />
                  </div>
                </div>
              </div>
            </div>

            {/* SECCIÓN 3: RESIDENCIA */}
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <h3 className="text-xs font-bold text-emerald-700 uppercase tracking-wider flex items-center gap-1.5">
                <MapPin size={14} /> Ubicación de Residencia
              </h3>
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-600">Dirección Domiciliaria</label>
                  <input type="text" defaultValue={cliente?.direccion || ''} required className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500 bg-white" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-600">Referencias de Mapa</label>
                  <textarea rows={2} placeholder="Ej. Altura de la cuadra 5 de Av. Principal, portón negro" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500 bg-white resize-none"></textarea>
                </div>
              </div>
            </div>

            <div className="text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
              <strong>Nota de Cumplimiento:</strong> El registro de nuevos prospectos ejecuta de manera automática un pre-filtro de identidad en las bases de datos autorizadas de la institución.
            </div>

          </div>

          {/* Botones de Acción Estacionarios en el Footer */}
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
              {isEdit ? 'Guardar Cambios' : 'Registrar Cliente'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}