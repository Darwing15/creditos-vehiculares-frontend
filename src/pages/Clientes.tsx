/** 
 * Listado por sucursal con presentacion comercial y permisos efectivos. 
 * @author DarwinG 
 */
import { useEffect, useRef, useState } from 'react';
import { Edit, Plus, RefreshCw, Search } from 'lucide-react';
import { customerApi } from '../api/customerApi';
import type { CustomerOption } from '../api/catalogApi';
import { apiErrorMessage } from '../api/http';
import { useAuthStore } from '../stores/authStore';
import ModalNuevoCliente from '../components/ModalNuevoCliente';
import ListPagination from '../components/ListPagination';

export default function Clientes() {
    const user = useAuthStore(state => state.user);
    const canRead = user?.permissions.includes('customers:read') ?? false;
    const canWrite = user?.permissions.includes('customers:write') ?? false;
    const [result, setResult] = useState<{ session: typeof user; rows: CustomerOption[] }>({ session: null, rows: [] });
    const rows = result.session === user ? result.rows : [];
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [notice, setNotice] = useState('');
    const [revision, setRevision] = useState(0);
    const [query, setQuery] = useState('');
    const [requestedPage, setPage] = useState(0);

    const [selection, setSelection] = useState<string | null>(null);
    const lifecycle = useRef({ version: 0 });

    useEffect(() => {
        const tracker = lifecycle.current;
        const version = ++tracker.version;
        async function load() {
            if (!canRead) {
                setResult({ session: user, rows: [] });
                setLoading(false); return;
            }
            setLoading(true);
            setError('');
            try {
                const data = await customerApi.list();
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

    const visible = rows.filter(row => `${row.fullName} ${row.documentNumber} ${row.phone ?? ''}`.toLocaleLowerCase('es').includes(query.trim().toLocaleLowerCase('es')));

    const page = Math.min(requestedPage, Math.max(0, Math.ceil(visible.length / pageSize) - 1));
    const pageRows = visible.slice(page * pageSize, (page + 1) * pageSize);

    if (!canRead)
        return <p role="alert" className="p-6">No tienes permiso para consultar clientes.</p>;

    return (
        <div className="space-y-6 p-4 sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div><h1 className="text-2xl font-bold text-slate-800">Gestión de Clientes</h1><p className="text-sm text-slate-500">Fichas de tu sucursal</p></div>
                {canWrite && <button type="button" onClick={() => { setNotice(''); setSelection('new'); }} className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 font-medium text-white shadow-sm hover:bg-emerald-700"><Plus size={18} />Registrar cliente</button>}
            </div>
            {notice && <p role="status" className="rounded-lg bg-emerald-50 p-3 text-emerald-800">{notice}</p>}
            {error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-red-800">{error}</p>}

            <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm lg:flex-row">
                <label className="relative flex-1"><Search size={18} className="absolute left-3 top-3 text-slate-400" /><span className="sr-only">Buscar clientes</span><input value={query} onChange={event => { setQuery(event.target.value); setPage(0); }} placeholder="Buscar por nombre, documento, teléfono o dirección…" className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-10 pr-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500" /></label>

                <button type="button" aria-label="Actualizar listado" disabled={loading} onClick={() => setRevision(value => value + 1)} className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-600 disabled:opacity-40"><RefreshCw size={18} />Actualizar</button>
            </div>
            {loading ? <p role="status">Cargando clientes…</p> : <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                <div className="overflow-x-auto"><table className="w-full text-left text-sm text-slate-700">
                    <thead className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500"><tr><th className="px-6 py-3.5">Cliente / Documento</th><th className="px-6 py-3.5">Contacto</th><th className="px-6 py-3.5">Dirección</th><th className="px-6 py-3.5 text-center">Estado</th>{canWrite && <th className="px-6 py-3.5 text-center">Acciones</th>}</tr></thead>
                    <tbody className="divide-y divide-slate-200">{pageRows.map(row => <tr key={row.id} className="hover:bg-slate-50/70">
                        <td className="px-6 py-4"><p className="font-semibold text-slate-800">{row.fullName}</p><p className="mt-0.5 font-mono text-xs text-slate-400">{row.documentType}: {row.documentNumber}</p></td>
                        <td className="px-6 py-4 text-slate-600">{row.phone ?? 'Sin teléfono'}</td>
                        <td className="max-w-xs truncate px-6 py-4 text-slate-600" title={row.address ?? undefined}>{row.address || 'Sin dirección'}</td>
                        <td className="px-6 py-4 text-center"><span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${row.active ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>{row.active ? 'Activo' : 'Inactivo'}</span></td>
                        {canWrite && <td className="px-6 py-4 text-center"><button type="button" aria-label={`Editar cliente: ${row.fullName}`} title="Editar cliente" onClick={() => edit(row.customerCode, row.fullName)} className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-emerald-50 hover:text-emerald-600"><Edit size={18} /></button></td>}
                    </tr>)}</tbody>
                </table></div>
                {!visible.length && <p className="p-5 text-slate-500">No hay clientes para este filtro.</p>}
                <ListPagination total={visible.length} page={page} pageSize={pageSize} onPageChange={setPage} />
            </div>}
            {selection && canWrite && <ModalNuevoCliente key={`${user?.id}:${user?.branchId}:${selection}`} code={selection === 'new' ? null : selection} onClose={close} onSaved={saved} />}
        </div>
    );
}
