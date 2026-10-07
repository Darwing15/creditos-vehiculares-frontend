/** 
 * Paginacion local del conjunto ya cargado de la sucursal. 
 * @author DarwinG 
 */
type Props = {
    total: number;
    page: number;
    pageSize: number;
    onPageChange: (page: number) => void
};

export default function ListPagination({ total, page, pageSize, onPageChange }: Props) {
    const first = total ? page * pageSize + 1 : 0;
    const last = Math.min(total, (page + 1) * pageSize);
    return (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-t border-slate-200 bg-slate-50 px-6 py-4">
            <p className="text-sm text-slate-500" aria-live="polite">Mostrando {first} a {last} de {total} registros</p>
            <div className="flex gap-1">
                <button type="button" disabled={page === 0} onClick={() => onPageChange(page - 1)} className="rounded border border-slate-200 bg-white px-3 py-1 text-sm text-slate-600 hover:bg-slate-100 disabled:cursor-not-allowed disabled:text-slate-400">Anterior</button>
                <button type="button" disabled={last >= total} onClick={() => onPageChange(page + 1)} className="rounded border border-slate-200 bg-white px-3 py-1 text-sm text-slate-600 hover:bg-slate-100 disabled:cursor-not-allowed disabled:text-slate-400">Siguiente</button>
            </div>
        </div>
    );
}
