/** 
 * Listado real de la sucursal con permisos por capacidad. 
 * @author DarwinG 
 */
import { useEffect, useRef, useState } from 'react';
import { Edit, Plus, RefreshCw, Search, Box, CircleCheck, Clock, ShieldCheck } from 'lucide-react';
import { vehicleApi } from '../api/vehicleApi';
import type { VehicleOption } from '../api/catalogApi';
import { apiErrorMessage } from '../api/http';
import { useAuthStore } from '../stores/authStore';
import ModalNuevoVehiculo from '../components/ModalNuevoVehiculo';
import ListPagination from '../components/ListPagination';
import { formatAmount } from '../utils/amounts';

const statusLabels = { 
  AVAILABLE: 'Disponible', 
  RESERVED: 'Reservado', 
  SOLD: 'Vendido' 
};

const statusStyles = {
  AVAILABLE: 'border-emerald-200 bg-emerald-100 border text-emerald-700',
  RESERVED: 'border-amber-200 bg-amber-50 border text-amber-700',
  SOLD: 'border-slate-200 bg-slate-100 border text-slate-600',
};

export default function Inventario() {
  const user = useAuthStore(state => state.user);
  const canRead = user?.permissions.includes('vehicles:read') ?? false;
  const canWrite = user?.permissions.includes('vehicles:write') ?? false;
  const [result, setResult] = useState<{ session: typeof user; rows: VehicleOption[] }>({ session: null, rows: [] });
  const rows = result.session === user ? result.rows : [];
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [revision, setRevision] = useState(0);
  const [query, setQuery] = useState('');
  const [requestedPage, setPage] = useState(0);
  const [status, setStatus] = useState('');
  const [brand, setBrand] = useState('');
  const [selection, setSelection] = useState<string | null>(null);
  const lifecycle = useRef({ version: 0 });

  useEffect(() => {
    const tracker = lifecycle.current;
    const version = ++tracker.version;
    async function load() {
      if (!canRead) {
        setResult({
          session: user,
          rows: []
        });
        setLoading(false);
        return;
      }
      setLoading(true);
      setError('');
      try {
        const data = await vehicleApi.list();
        if (tracker.version === version && useAuthStore.getState().user === user)
          setResult({
            session: user,
            rows: data
          });
      } catch (failure) {
        if (tracker.version === version && useAuthStore.getState().user === user) {
          setResult({
            session: user,
            rows: []
          });
          setError(apiErrorMessage(failure));
        }
      } finally {
        if (tracker.version === version && useAuthStore.getState().user === user)
          setLoading(false);
      }
    }
    void load();
    return () => { tracker.version++; };
  }, [canRead, revision, user]);

  function close() {
    setSelection(null);
    setRevision(value => value + 1);
  }

  function saved() {
    setNotice('Ficha guardada correctamente.');
    close();
  }

  const pageSize = 10;
  function edit(code: string, name: string) {
    if (!code) {
      setError(`No se puede abrir la ficha de ${name}. Actualiza el listado; falta su identificador público.`);
      return;
    }
    setNotice(''); setSelection(code);
  }

  const visible = rows.filter(row => `${row.brand} ${row.model} ${row.vehicleCode}`.toLocaleLowerCase('es')
    .includes(query.trim().toLocaleLowerCase('es')) && (!status || row.status === status));
  const brands = [...new Set(rows.map(row => row.brand))].sort((a, b) => a.localeCompare(b, 'es'));
  const page = Math.min(requestedPage, Math.max(0, Math.ceil(visible.length / pageSize) - 1));
  const pageRows = visible.slice(page * pageSize, (page + 1) * pageSize);

  if (!canRead)
    return <p role="alert" className="p-6">No tienes permiso para consultar vehículos.</p>;

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div><h1 className="text-2xl font-bold text-slate-800">Inventario de Vehículos</h1><p className="text-sm text-slate-500">Fichas de tu sucursal</p></div>
        {canWrite && <button type="button" onClick={() => { setNotice(''); setSelection('new'); }} className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 font-medium text-white shadow-sm hover:bg-emerald-700"><Plus size={18} />Registrar vehículo</button>}
      </div>
      {notice && <p role="status" className="rounded-lg bg-emerald-50 p-3 text-emerald-800">{notice}</p>}
      {error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-red-800">{error}</p>}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm"><span className="rounded-lg bg-blue-50 p-3 text-blue-600"><Box size={24} /></span><div><p className="text-sm text-slate-500">Total Unidades</p><p className="text-2xl font-bold text-slate-800">{loading || error ? '—' : rows.length}</p></div></div>
        <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm"><span className="rounded-lg bg-emerald-50 p-3 text-emerald-600"><CircleCheck size={24} /></span><div><p className="text-sm text-slate-500">Disponibles</p><p className="text-2xl font-bold text-slate-800">{loading || error ? '—' : rows.filter(row => row.status === 'AVAILABLE').length}</p></div></div>
        <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm"><span className="rounded-lg bg-amber-50 p-3 text-amber-600"><Clock size={24} /></span><div><p className="text-sm text-slate-500">Reservadas</p><p className="text-2xl font-bold text-slate-800">{loading || error ? '—' : rows.filter(row => row.status === 'RESERVED').length}</p></div></div>
      </div>
      <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm lg:flex-row">
        <label className="relative flex-1"><Search size={18} className="absolute left-3 top-3 text-slate-400" /><span className="sr-only">Buscar vehículos</span><input value={query} onChange={event => { setQuery(event.target.value); setPage(0); }} placeholder="Buscar por marca, modelo, chasis o motor…" className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-10 pr-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500" /></label>
        <select aria-label="Filtrar por marca" value={brand} onChange={event => { setBrand(event.target.value); setPage(0); }} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600">
          <option value="">Todas las marcas</option>{brands.map(value => <option key={value}>{value}</option>)}
        </select>
        <select aria-label="Filtrar por estado" value={status} onChange={event => { setStatus(event.target.value); setPage(0); }} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600">
          <option value="">Todos los estados</option><option value="AVAILABLE">Disponibles</option><option value="RESERVED">Reservados</option><option value="SOLD">Vendidos</option>
        </select>
        <button type="button" aria-label="Actualizar listado" disabled={loading} onClick={() => setRevision(value => value + 1)} className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-600 disabled:opacity-40"><RefreshCw size={18} />Actualizar</button>
      </div>
      {loading ? <p role="status">Cargando vehículos…</p> : <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto"><table className="w-full text-left text-sm text-slate-700">
          <thead className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500"><tr><th className="px-6 py-3.5">Unidad</th><th className="px-6 py-3.5">Modelo</th><th className="px-6 py-3.5">Identificadores (VIN / Motor)</th><th className="px-6 py-3.5">Precio ref.</th><th className="px-6 py-3.5">Estado</th>{canWrite && <th className="px-6 py-3.5 text-center">Acciones</th>}</tr></thead>
          <tbody className="divide-y divide-slate-200">{pageRows.map(row => <tr key={row.id} className="hover:bg-slate-50/70">
            <td className="px-6 py-4"><p className="font-semibold text-slate-800">{row.vehicleType}</p><p className="mt-0.5 text-xs text-slate-400">{row.brand}</p></td>
            <td className="px-6 py-4"><p>{row.model}</p><p className="mt-0.5 text-xs text-slate-400">{row.manufacturingYear} · {row.color}</p></td>
            <td className="px-6 py-4"><p className="flex items-center gap-2 font-mono text-xs"><ShieldCheck size={14} className="shrink-0 text-slate-400" />{row.chassisNumber || 'Sin chasis'}</p><p className="mt-1 font-mono text-xs text-slate-400">Motor: {row.engineNumber || 'Sin motor'}</p></td>
            <td className="whitespace-nowrap px-6 py-4 font-semibold text-slate-800">{formatAmount(row.referencePrice)}</td>
            <td className="px-6 py-4"><span className={`inline-flex items-center rounded-full border px-3 py-0.5 text-xs font-medium ${statusStyles[row.status]}`}>{statusLabels[row.status]}</span></td>
            {canWrite && <td className="px-6 py-4 text-center">{row.status === 'AVAILABLE' && <button type="button" aria-label={`Editar vehículo: ${row.brand} ${row.model}`} title="Editar vehículo" onClick={() => edit(row.vehicleCode, `${row.brand} ${row.model}`)} className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-emerald-50 hover:text-emerald-600"><Edit size={18} /></button>}</td>}
          </tr>)}</tbody>
        </table></div>
        {!visible.length && <p className="p-5 text-slate-500">No hay vehículos para este filtro.</p>}
        <ListPagination total={visible.length} page={page} pageSize={pageSize} onPageChange={setPage} />
      </div>}
      {selection && canWrite && <ModalNuevoVehiculo key={`${user?.id}:${user?.branchId}:${selection}`} code={selection === 'new' ? null : selection} onClose={close} onSaved={saved} />}
    </div>
  );
}
