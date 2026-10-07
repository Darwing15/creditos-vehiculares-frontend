import { useEffect, useMemo, useRef, useState } from 'react';
import { Search, Plus, Filter, Clock, CheckCircle, RefreshCw } from 'lucide-react';
import ModalNuevoCredito from '../components/ModalNuevoCredito';
import ModalAprobarSolicitud from '../components/ModalAprobarSolicitud';
import { catalogApi } from '../api/catalogApi';
import type { CustomerOption, VehicleOption } from '../api/catalogApi';
import { creditApplicationsApi } from '../api/creditApplicationsApi';
import type { ApplicationStatus, CreditApplication } from '../api/creditApplicationsApi';
import { apiErrorMessage } from '../api/http';
import { useAuthStore } from '../stores/authStore';

/** Etiquetas de presentacion; conserva los codigos del contrato HTTP. 
 * @author DarwinG 
 */
const statusLabels: Record<ApplicationStatus, string> = {
  PENDING: 'Pendiente',
  APPROVED: 'Aprobada',
  REJECTED: 'Rechazada',
  CANCELLED: 'Cancelada',
  EXPIRED: 'Vencida',
};

const statusStyles: Record<ApplicationStatus, string> = {
  APPROVED: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  PENDING: 'bg-amber-50 text-amber-700 border border-amber-200',
  EXPIRED: 'bg-rose-50 text-rose-700 border border-rose-200',
  CANCELLED: 'bg-slate-100 text-slate-600 border border-slate-200',
  REJECTED: 'bg-red-100 text-red-600 border border-red-200',
};

/**
 * Consulta solicitudes por sucursal, conserva fallos por recurso y distingue
 * una consulta fallida de un listado vacio. Descarta respuestas obsoletas.
 * @author DarwinG
 */
export default function Creditos() {
  const user = useAuthStore(state => state.user);
  const [open, setOpen] = useState(false);
  const [selectedCode, setSelectedCode] = useState<string | null>(null);
  const [notice, setNotice] = useState('');
  const [status, setStatus] = useState<ApplicationStatus>('PENDING');
  const [rows, setRows] = useState<CreditApplication[]>([]);
  const [customers, setCustomers] = useState<CustomerOption[]>([]);
  const [vehicles, setVehicles] = useState<VehicleOption[]>([]);
  const [search, setSearch] = useState('');
  const [errors, setErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [listFailed, setListFailed] = useState(false);
  const [revision, setRevision] = useState(0);
  const requestVersion = useRef(0);
  const canRead = user?.permissions.includes('credit-applications:read') ?? false;
  const canReadCustomers = user?.permissions.includes('customers:read') ?? false;
  const canReadVehicles = user?.permissions.includes('vehicles:read') ?? false;
  const canCreate = ['credit-applications:create', 'customers:read', 'vehicles:read']
    .every(permission => user?.permissions.includes(permission));

  useEffect(() => {
    const version = ++requestVersion.current;
    let cancelled = false;
    async function load() {
      setLoading(true);
      setErrors([]);
      setRows([]);
      setCustomers([]);
      setVehicles([]);
      setListFailed(false);
      if (!canRead) {
        setErrors(['No tienes permiso para consultar solicitudes de crédito.']);
        setListFailed(true);
        setLoading(false);
        return;
      }
      const [applications, clients, inventory] = await Promise.allSettled([
        creditApplicationsApi.list(status),
        canReadCustomers ? catalogApi.customers() : Promise.resolve([] as CustomerOption[]),
        canReadVehicles ? catalogApi.vehicles() : Promise.resolve([] as VehicleOption[]),
      ]);
      if (cancelled || version !== requestVersion.current)
        return;
      const messages: string[] = [];
      if (applications.status === 'fulfilled')
        setRows(applications.value);
      else {
        setListFailed(true);
        messages.push('Solicitudes: ' + apiErrorMessage(applications.reason));
      }
      if (clients.status === 'fulfilled')
        setCustomers(clients.value);
      else messages.push('Clientes: ' + apiErrorMessage(clients.reason));
      if (inventory.status === 'fulfilled')
        setVehicles(inventory.value);
      else messages.push('Vehículos: ' + apiErrorMessage(inventory.reason));
      setErrors(messages);
      setLoading(false);
    }
    void load();
    return () => { cancelled = true; };
  }, [status, revision, canRead, canReadCustomers, canReadVehicles, user]);

  const customerNames = useMemo(() => new Map(customers.map(c => [c.id, c.fullName])), [customers]);
  const vehicleNames = useMemo(() => new Map(vehicles.map(v => [v.id, `${v.vehicleType} ${v.brand} ${v.model}`])), [vehicles]);
  const visible = useMemo(() => {
    const query = search.trim().toLocaleLowerCase('es-PE');
    return rows.filter(row => !query || [row.applicationNumber, customerNames.get(row.customerId),
    vehicleNames.get(row.vehicleId), `Cliente #${row.customerId}`, `Vehículo #${row.vehicleId}`]
      .join(' ').toLocaleLowerCase('es-PE').includes(query));
  }, [rows, customerNames, vehicleNames, search]);
  const money = (amount: number, currency: CreditApplication['currency']) =>
    new Intl.NumberFormat('es-PE', { style: 'currency', currency }).format(amount);

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div><h1 className="text-2xl font-bold">Solicitudes de Crédito</h1>
          <p className="text-slate-500">Evaluación y seguimiento de solicitudes</p></div>
        {canCreate && <button onClick={() => setOpen(true)} className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-3 text-white">
          <Plus size={18} /> Nueva solicitud
        </button>}
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex gap-3 rounded-xl border border-slate-200 bg-white p-4">
          <Clock className="text-amber-600" /><div><p>Solicitudes en filtro</p>
            <b>{loading ? 'Cargando…' : listFailed ? 'Sin datos' : visible.length}</b></div>
        </div>
        <div className="flex gap-3 rounded-xl border border-slate-200 bg-white p-4">
          <CheckCircle className="text-emerald-600" /><div><p>Estado consultado</p><b>{statusLabels[status]}</b></div>
        </div>
      </div>
      <div className="flex flex-wrap gap-3">
        <label className="relative min-w-56 flex-1"><span className="sr-only">Buscar solicitudes</span>
          <Search className="absolute left-3 top-3 text-slate-400" size={18} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar por cliente, código o vehículo..."
            className="w-full rounded-lg border border-slate-200 py-2.5 pl-10 pr-4" />
        </label>
        <label className="flex items-center gap-2 rounded-lg border border-slate-200 px-3">
          <Filter size={16} /><span className="sr-only">Estado de solicitud</span>
          <select value={status} onChange={e => setStatus(e.target.value as ApplicationStatus)} className="py-2.5">
            <option value="PENDING">Pendientes</option><option value="APPROVED">Aprobadas</option>
            <option value="REJECTED">Rechazadas</option><option value="CANCELLED">Canceladas</option><option value="EXPIRED">Vencidas</option>
          </select>
        </label>
        <button disabled={loading} onClick={() => setRevision(value => value + 1)} aria-label="Actualizar solicitudes"
          className="rounded-lg border border-slate-200 px-3 disabled:opacity-50"><RefreshCw size={18} /></button>
      </div>
      {errors.length > 0 && <div role="alert" className="space-y-1 rounded-lg bg-rose-50 p-3 text-rose-700">
        {errors.map(message => <p key={message}>{message}</p>)}
      </div>}
      {notice && canRead && <p role="status" className="rounded-lg bg-emerald-50 p-3 text-emerald-800">{notice}</p>}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div className="overflow-x-auto"><table className="w-full min-w-[800px] text-left" aria-busy={loading}>
          <thead className="border-b border-slate-200 bg-slate-50"><tr>
            {['Código', 'Cliente', 'Vehículo', 'Monto financiado', 'Plazo', 'Estado', 'Acciones'].map(label => <th key={label} className="px-6 py-4 text-sm">{label}</th>)}
          </tr></thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? <tr><td colSpan={7} className="p-8 text-center">Cargando…</td></tr>
              : listFailed ? <tr><td colSpan={7} className="p-8 text-center">No se pudo consultar el listado.</td></tr>
                : visible.length === 0 ? <tr><td colSpan={7} className="p-8 text-center">No hay solicitudes para este filtro.</td></tr>
                  : visible.map(row => <tr key={row.applicationCode}>
                    <td className="px-6 py-4 font-mono">{row.applicationNumber}</td>
                    <td className="px-6 py-4">{customerNames.get(row.customerId) ?? `Cliente #${row.customerId}`}</td>
                    <td className="px-6 py-4">{vehicleNames.get(row.vehicleId) ?? `Vehículo #${row.vehicleId}`}</td>
                    <td className="px-6 py-4">{money(row.financedAmount, row.currency)}
                      <div className="text-xs text-slate-500">Inicial: {money(row.downPayment, row.currency)}</div></td>
                    <td className="px-6 py-4">{row.installmentCount} meses</td>
                    <td className="px-6 py-4"><span className={`rounded-full px-3 py-1 text-sm ${statusStyles[row.status]}`}>{statusLabels[row.status]}</span></td>
                    <td className="px-6 py-4">{canRead && <button type="button"
                      onClick={() => { setNotice(''); setSelectedCode(row.applicationCode); }}
                      className="rounded-lg border border-emerald-200 px-3 py-2 text-sm text-emerald-700 hover:bg-emerald-50"
                      aria-label={`Revisar solicitud ${row.applicationNumber}`}>Revisar</button>}</td>
                  </tr>)}
          </tbody>
        </table></div>
      </div>
      <ModalNuevoCredito isOpen={open && canCreate} onClose={() => setOpen(false)} onCreated={() => setRevision(value => value + 1)} />
      {selectedCode && canRead && <ModalAprobarSolicitud
        key={`${selectedCode}:${user?.id}:${user?.branchId}`}
        applicationCode={selectedCode} customerNames={customerNames} vehicleNames={vehicleNames}
        onClose={() => setSelectedCode(null)}
        onApproved={approved => {
          setSelectedCode(null);
          setRows(current => current.filter(row => row.applicationCode !== approved.applicationCode));
          setNotice(`Solicitud ${approved.applicationNumber} aprobada. Puedes consultarla en el filtro Aprobadas.`);
          setRevision(value => value + 1);
        }} />}
    </div>
  );
}