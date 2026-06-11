import { X, Calculator, DollarSign } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ModalNuevoCredito({ isOpen, onClose }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Cabecera del Modal */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-2">
            <Calculator className="text-emerald-600" size={20} />
            <h2 className="text-lg font-bold text-slate-800">Simulación y Evaluación de Crédito</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Contenido del Formulario */}
        <form className="p-6 space-y-6" onSubmit={(e) => e.preventDefault()}>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Selección de Cliente */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Cliente Solicitante</label>
              <select className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-emerald-500 outline-none">
                <option>Seleccionar cliente existente...</option>
                <option>Juan Pérez (DNI: 12345678)</option>
                <option>María López (DNI: 87654321)</option>
              </select>
            </div>

            {/* Selección de Vehículo (Inventario) */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Vehículo a Financiar</label>
              <select className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-emerald-500 outline-none">
                <option>Seleccionar modelo del inventario...</option>
                <option>Honda Wave 110S (Precio Ref: S/ 6,500)</option>
                <option>Trimoto Ronco Cargo 200 (Precio Ref: S/ 14,200)</option>
              </select>
            </div>
          </div>

          {/* Parámetros Financieros */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500">Precio de Venta (S/)</label>
              <input type="number" placeholder="6500" className="w-full px-3 py-1.5 border border-slate-200 rounded-md text-sm outline-none focus:ring-2 focus:ring-emerald-500 bg-white" />
            </div>
            
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500">Cuota Inicial (S/)</label>
              <input type="number" placeholder="1500" className="w-full px-3 py-1.5 border border-slate-200 rounded-md text-sm outline-none focus:ring-2 focus:ring-emerald-500 bg-white" />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500">Plazo (Meses)</label>
              <select className="w-full px-3 py-1.5 border border-slate-200 rounded-md text-sm outline-none focus:ring-2 focus:ring-emerald-500 bg-white bg-no-repeat">
                <option value="6">6 meses</option>
                <option value="12">12 meses</option>
                <option value="18">18 meses</option>
                <option value="24">24 meses</option>
              </select>
            </div>
          </div>

          {/* Cuadro Resumen Informativo de la Cuota Automatizada */}
          <div className="border border-emerald-100 bg-emerald-50/50 p-4 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-emerald-600 rounded-lg text-white">
                <DollarSign size={22} />
              </div>
              <div>
                <p className="text-xs text-emerald-800 font-medium">Cuota Mensual Estimada</p>
                <p className="text-xs text-slate-400 mt-0.5">Calculado con una Tasa Efectiva Mensual (TEM) del 3.5%</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black text-emerald-700">S/ 485.50</span>
              <p className="text-[10px] text-slate-400 font-mono">Monto Neto Financiar: S/ 5,000</p>
            </div>
          </div>

          {/* Botones de Acción */}
          <div className="flex justify-end gap-3 pt-2 border-t border-slate-100">
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
              Registrar y Generar Plan
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}