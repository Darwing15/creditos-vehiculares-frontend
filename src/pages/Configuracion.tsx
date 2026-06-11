import { useState } from 'react';
import {
    Building,
    Percent,
    Key,
    Save,
    ShieldCheck,
    Globe,
    CreditCard,
    Smartphone,
    Cpu
} from 'lucide-react';

export default function Configuracion() {
    const [activeTab, setActiveTab] = useState<'empresa' | 'creditos' | 'integraciones'>('empresa');
    const [guardadoExitoso, setGuardadoExitoso] = useState(false);

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        setGuardadoExitoso(true);
        setTimeout(() => setGuardadoExitoso(false), 3000);
    };

    return (
        <div className="p-6 space-y-6 max-w-5xl">

            {/* Encabezado */}
            <div>
                <h1 className="text-2xl font-bold text-slate-800">Configuración del Sistema</h1>
                <p className="text-slate-500">Parámetros globales, políticas crediticias y llaves de cifrado de APIs externas</p>
            </div>

            <div className="flex flex-col md:flex-row gap-6 items-start">

                {/* Navegación de Tabs Lateral (Sidebar Interno) */}
                <div className="w-full md:w-64 bg-white border border-slate-200 rounded-xl p-2 shadow-sm space-y-1 flex-shrink-0">
                    <button
                        onClick={() => setActiveTab('empresa')}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === 'empresa'
                                ? 'bg-indigo-50 text-indigo-700'
                                : 'text-slate-600 hover:bg-slate-50'
                            }`}
                    >
                        <Building size={18} />
                        Datos de la Empresa
                    </button>

                    <button
                        onClick={() => setActiveTab('creditos')}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === 'creditos'
                                ? 'bg-indigo-50 text-indigo-700'
                                : 'text-slate-600 hover:bg-slate-50'
                            }`}
                    >
                        <Percent size={18} />
                        Políticas de Crédito
                    </button>

                    <button
                        onClick={() => setActiveTab('integraciones')}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === 'integraciones'
                                ? 'bg-indigo-50 text-indigo-700'
                                : 'text-slate-600 hover:bg-slate-50'
                            }`}
                    >
                        <Key size={18} />
                        APIs e Integraciones
                    </button>
                </div>

                {/* Contenedor Dinámico de Formularios */}
                <div className="flex-1 w-full bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                    <form onSubmit={handleSave}>

                        <div className="p-6">

                            {/* TAB 1: DATOS DE LA EMPRESA */}
                            {activeTab === 'empresa' && (
                                <div className="space-y-4 animate-in fade-in duration-150">
                                    <div>
                                        <h3 className="text-base font-bold text-slate-800">Identidad Corporativa</h3>
                                        <p className="text-xs text-slate-400">Información fiscal utilizada en las plantillas de contratos y comprobantes de pago.</p>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-semibold text-slate-600">Razón Social</label>
                                            <input type="text" defaultValue="Inversiones Sotomayor S.A.C." required className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500 bg-white" />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-semibold text-slate-600">Número de RUC</label>
                                            <input type="text" maxLength={11} defaultValue="20601234567" required className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm font-mono outline-none focus:ring-2 focus:ring-indigo-500 bg-white" />
                                        </div>
                                        <div className="col-span-1 sm:col-span-2 space-y-1.5">
                                            <label className="text-xs font-semibold text-slate-600">Dirección Fiscal Principal</label>
                                            <input type="text" defaultValue="Av. Ricardo Palma 202, Tocache" required className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500 bg-white" />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-semibold text-slate-600">Moneda por Defecto</label>
                                            <select className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white outline-none focus:ring-2 focus:ring-indigo-500">
                                                <option value="PEN">Soles Peruanos (S/)</option>
                                                <option value="USD">Dólares Americanos ($)</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* TAB 2: POLÍTICAS DE CRÉDITO */}
                            {activeTab === 'creditos' && (
                                <div className="space-y-5 animate-in fade-in duration-150">
                                    <div>
                                        <h3 className="text-base font-bold text-slate-800">Reglas Financieras del Simulador</h3>
                                        <p className="text-xs text-slate-400">Establece topes y porcentajes de riesgo automáticos para las solicitudes.</p>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                        {/* Tasa Nominal / Efectiva */}
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-semibold text-slate-600">Tasa Efectiva Anual Base (TEA %)</label>
                                            <div className="relative">
                                                <input type="number" step="0.01" defaultValue="42.50" required className="w-full pr-8 pl-3 py-2 border border-slate-200 rounded-lg text-sm font-mono outline-none focus:ring-2 focus:ring-indigo-500 bg-white" />
                                                <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-bold">%</span>
                                            </div>
                                        </div>

                                        {/* Penalidad por Mora */}
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-semibold text-slate-600">Tasa de Interés Moratorio Diario (TIM %)</label>
                                            <div className="relative">
                                                <input type="number" step="0.01" defaultValue="0.12" required className="w-full pr-8 pl-3 py-2 border border-slate-200 rounded-lg text-sm font-mono outline-none focus:ring-2 focus:ring-indigo-500 bg-white" />
                                                <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-bold">%</span>
                                            </div>
                                        </div>

                                        {/* Cuota inicial mínima */}
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-semibold text-slate-600">Cuota Inicial Mínima Sugerida</label>
                                            <div className="relative">
                                                <input type="number" defaultValue="15" required className="w-full pr-8 pl-3 py-2 border border-slate-200 rounded-lg text-sm font-mono outline-none focus:ring-2 focus:ring-indigo-500 bg-white" />
                                                <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-bold">%</span>
                                            </div>
                                        </div>

                                        {/* Plazo máximo */}
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-semibold text-slate-600">Plazo Máximo de Financiamiento</label>
                                            <select className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white outline-none focus:ring-2 focus:ring-indigo-500">
                                                <option value="24">24 meses (2 años)</option>
                                                <option value="36">36 meses (3 años)</option>
                                                <option value="48">48 meses (4 años)</option>
                                            </select>
                                        </div>
                                    </div>

                                    {/* Alerta de Políticas */}
                                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg flex gap-2 text-xs text-amber-800">
                                        <ShieldCheck size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
                                        <span><strong>Nota de Riesgo:</strong> Modificar los valores de TEA o Mora afectará directamente a las nuevas simulaciones de crédito creadas a partir de este momento. No altera contratos ya vigentes o firmados.</span>
                                    </div>
                                </div>
                            )}

                            {/* TAB 3: APIS E INTEGRACIONES */}
                            {activeTab === 'integraciones' && (
                                <div className="space-y-4 animate-in fade-in duration-150">
                                    <div>
                                        <h3 className="text-base font-bold text-slate-800">Conexiones de Servicios de Terceros</h3>
                                        <p className="text-xs text-slate-400">Tokens de autenticación para automatizar la consulta de datos de clientes.</p>
                                    </div>

                                    <div className="space-y-4">
                                        {/* Central de Riesgo - Equifax */}
                                        <div className="p-4 border border-slate-100 bg-slate-50/50 rounded-xl space-y-3">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <CreditCard size={16} className="text-indigo-600" />
                                                    <span className="text-xs font-bold text-slate-700">Central de Riesgo (Sentinel / Equifax)</span>
                                                </div>
                                                <span className="px-1.5 py-0.5 bg-emerald-50 text-emerald-700 font-semibold rounded text-[10px]">Conectado</span>
                                            </div>
                                            <input type="password" placeholder="••••••••••••••••••••••••••••••••" className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-mono outline-none focus:ring-2 focus:ring-indigo-500 bg-white" />
                                        </div>

                                        {/* Validación de Identidad DNI */}
                                        <div className="p-4 border border-slate-100 bg-slate-50/50 rounded-xl space-y-3">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <Globe size={16} className="text-blue-600" />
                                                    <span className="text-xs font-bold text-slate-700">Servicio de Consulta DNI/RUC (Reniec API)</span>
                                                </div>
                                                <span className="px-1.5 py-0.5 bg-emerald-50 text-emerald-700 font-semibold rounded text-[10px]">Conectado</span>
                                            </div>
                                            <input type="password" placeholder="••••••••••••••••••••••••••••••••" className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-mono outline-none focus:ring-2 focus:ring-indigo-500 bg-white" />
                                        </div>

                                        {/* Pasarela de Mensajería SMS */}
                                        <div className="p-4 border border-slate-100 bg-slate-50/50 rounded-xl space-y-3">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <Smartphone size={16} className="text-amber-600" />
                                                    <span className="text-xs font-bold text-slate-700">Pasarela SMS (Alertas de cuotas vencidas)</span>
                                                </div>
                                                <span className="px-1.5 py-0.5 bg-slate-100 text-slate-500 font-semibold rounded text-[10px]">Desactivado</span>
                                            </div>
                                            <input type="text" placeholder="Ingresar API Key de Twilio o Infobip" className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs outline-none focus:ring-2 focus:ring-indigo-500 bg-white" />
                                        </div>
                                    </div>
                                </div>
                            )}

                        </div>

                        {/* Footer con Botón de Guardado y Confirmación Visual */}
                        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex flex-col sm:flex-row justify-between items-center gap-3">
                            <div className="flex items-center gap-2 text-slate-400 text-xs">
                                <Cpu size={14} />
                                <span>Último cambio por: Admin_Sotomayor</span>
                            </div>

                            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                                {guardadoExitoso && (
                                    <span className="text-emerald-600 text-xs font-semibold animate-fade-in">
                                        ✓ Cambios aplicados con éxito
                                    </span>
                                )}
                                <button
                                    type="submit"
                                    className="w-full sm:w-auto bg-slate-800 hover:bg-slate-900 text-white text-sm font-medium py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-sm"
                                >
                                    <Save size={16} /> Guardar Cambios
                                </button>
                            </div>
                        </div>

                    </form>
                </div>

            </div>

        </div>
    );
}