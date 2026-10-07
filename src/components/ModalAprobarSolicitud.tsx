import { useEffect, useRef, useState } from 'react';
import { CheckCircle, RefreshCw, X } from 'lucide-react';
import { creditApplicationsApi } from '../api/creditApplicationsApi';
import type { CreditApplication } from '../api/creditApplicationsApi';
import { apiErrorMessage } from '../api/http';
import { canApproveCreditApplication } from '../security/creditApplicationAccess';
import { useAuthStore } from '../stores/authStore';

type Props = {
    applicationCode: string;
    customerNames: Map<number, string>;
    vehicleNames: Map<number, string>;
    onClose: () => void;
    onApproved: (application: CreditApplication) => void;
};

const statusLabels = {
    PENDING: 'Pendiente', APPROVED: 'Aprobada', REJECTED: 'Rechazada',
    CANCELLED: 'Cancelada', EXPIRED: 'Vencida',
};

/**
 * Relee la solicitud antes de confirmar. Un fallo de escritura exige consultar
 * nuevamente su estado: la perdida de respuesta no demuestra un rollback.
 * El dialogo nativo contiene el foco y devuelve el foco al cerrarse.
 * @author DarwinG
 */
export default function ModalAprobarSolicitud({
    applicationCode, customerNames, vehicleNames, onClose, onApproved,
}: Props) {
    const user = useAuthStore(state => state.user);
    const dialog = useRef<HTMLDialogElement>(null);
    const epoch = useRef({ version: 0 });
    const inFlight = useRef(false);
    const [application, setApplication] = useState<CreditApplication | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [reviewed, setReviewed] = useState(false);
    const [needsRefresh, setNeedsRefresh] = useState(false);
    const [error, setError] = useState('');
    const [revision, setRevision] = useState(0);
    const canApprove = canApproveCreditApplication(user, application);

    useEffect(() => {
        const element = dialog.current;
        const previousFocus = document.activeElement;
        element?.showModal();
        return () => {
            element?.close();
            if (previousFocus instanceof HTMLElement && previousFocus.isConnected) previousFocus.focus();
        };
    }, []);

    useEffect(() => {
        const tracker = epoch.current;
        const version = ++tracker.version;
        const session = useAuthStore.getState().user;
        if (!session || !session.permissions.includes('credit-applications:read')) return;
        const branchId = session.branchId;
        async function loadDetail() {
            try {
                const current = await creditApplicationsApi.get(applicationCode);
                if (version !== epoch.current.version || useAuthStore.getState().user !== session) return;
                if (current.applicationCode !== applicationCode || current.branchId !== branchId) {
                    setError('No se pudo verificar la solicitud en tu sucursal.');
                    setNeedsRefresh(true);
                    return;
                }
                setApplication(current);
                setNeedsRefresh(false);
            } catch (failure) {
                if (version !== epoch.current.version || useAuthStore.getState().user !== session) return;
                setError(apiErrorMessage(failure));
                setNeedsRefresh(true);
            } finally {
                if (version === epoch.current.version) setLoading(false);
            }
        }
        void loadDetail();
        return () => { ++tracker.version; };
    }, [applicationCode, revision]);

    async function approve() {
        const session = useAuthStore.getState().user;
        if (inFlight.current || loading || needsRefresh || !reviewed
            || !canApproveCreditApplication(session, application)) return;
        const version = epoch.current.version;
        inFlight.current = true;
        setSaving(true);
        setError('');
        try {
            const approved = await creditApplicationsApi.approve(applicationCode);
            if (version !== epoch.current.version || useAuthStore.getState().user !== session) return;
            if (approved.applicationCode !== applicationCode || approved.status !== 'APPROVED'
                || approved.branchId !== session?.branchId) {
                setError('No se pudo confirmar el resultado. Consulta el estado actual de la solicitud.');
                setNeedsRefresh(true);
                setReviewed(false);
                return;
            }
            onApproved(approved);
        } catch (failure) {
            if (version !== epoch.current.version || useAuthStore.getState().user !== session) return;
            setError(apiErrorMessage(failure));
            setNeedsRefresh(true);
            setReviewed(false);
        } finally {
            inFlight.current = false;
            if (version === epoch.current.version) setSaving(false);
        }
    }

    const money = (amount: number) => new Intl.NumberFormat('es-PE', {
        style: 'currency', currency: application?.currency ?? 'PEN',
    }).format(amount);
    const resolvedAt = application?.resolvedAt
        ? new Intl.DateTimeFormat('es-PE', {
            dateStyle: 'medium', timeStyle: 'short', timeZone: 'America/Lima',
        }).format(new Date(application.resolvedAt)) : null;

    return (
        <dialog ref={dialog} aria-labelledby="approval-title"
            onCancel={event => { event.preventDefault(); if (!saving) onClose(); }}
            className="fixed inset-0 m-auto max-h-[90dvh] w-[min(94vw,640px)] overflow-y-auto rounded-2xl bg-white p-0 text-slate-800 shadow-xl backdrop:bg-slate-900/50">
            <div className="flex items-center justify-between border-b border-slate-200 p-5">
                <h2 id="approval-title" className="text-xl font-bold">Revisar solicitud de crédito</h2>
                <button type="button" disabled={saving} onClick={onClose} aria-label="Cerrar revisión"
                    className="rounded-lg p-2 hover:bg-slate-100 disabled:opacity-50"><X size={20} /></button>
            </div>
            <div className="space-y-5 p-5" aria-busy={loading || saving}>
                {loading && <p role="status">Consultando el estado actual…</p>}
                {error && <p role="alert" className="rounded-lg bg-rose-50 p-3 text-rose-700">{error}</p>}
                {application && <>
                    <div className="flex items-center justify-between gap-3">
                        <b className="font-mono">{application.applicationNumber}</b>
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-sm">{statusLabels[application.status]}</span>
                    </div>
                    <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        {[
                            ['Cliente', customerNames.get(application.customerId) ?? `Cliente #${application.customerId}`],
                            ['Vehículo', vehicleNames.get(application.vehicleId) ?? `Vehículo #${application.vehicleId}`],
                            ['Precio registrado', money(application.vehiclePrice)],
                            ['Inicial pactada', money(application.downPayment)],
                            ['Monto financiado', money(application.financedAmount)],
                            ['Plazo', `${application.installmentCount} meses`],
                            ['Tasa compensatoria mensual', `${application.compensatoryInterestRate.toLocaleString('es-PE')} %`],
                            ['Moneda', application.currency],
                        ].map(([label, value]) => <div key={label}><dt className="text-sm text-slate-500">{label}</dt>
                            <dd className="mt-1 font-medium">{value}</dd></div>)}
                    </dl>
                    <p className="rounded-lg bg-emerald-50 p-3 text-sm text-emerald-900">
                        La aprobación autoriza continuar con la formalización. La deuda se registra después de la firma del contrato.
                        La inicial mostrada es el importe pactado; su cobro se registra por separado.
                    </p>
                    {resolvedAt && <p className="text-sm text-slate-600">Resuelta el {resolvedAt} (hora de Lima)
                        {application.resolvedBy !== null && ` por el usuario #${application.resolvedBy}`}.</p>}
                    {application.rejectionReason && <p className="text-sm">Motivo de rechazo: {application.rejectionReason}</p>}
                    {application.status !== 'PENDING' && <p role="status">Esta solicitud ya fue resuelta.</p>}
                    {application.status === 'PENDING' && !canApprove && <p>No tienes permiso para aprobar esta solicitud.</p>}
                    {canApprove && !needsRefresh && <label className="flex items-start gap-3 text-sm">
                        <input type="checkbox" checked={reviewed} disabled={saving}
                            onChange={event => setReviewed(event.target.checked)} className="mt-1" />
                        <span>He revisado el expediente y las condiciones registradas, y confirmo la decisión de aprobación.</span>
                    </label>}
                </>}
                {needsRefresh && <p className="text-sm text-amber-800">
                    Consulta el estado actual antes de volver a confirmar. Una respuesta perdida puede corresponder a una aprobación completada.
                </p>}
            </div>
            <div className="flex flex-wrap justify-end gap-3 border-t border-slate-200 p-5">
                <button type="button" disabled={loading || saving} onClick={() => {
                    setLoading(true); setReviewed(false); setError(''); setApplication(null);
                    setRevision(value => value + 1);
                }}
                    className="flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2 disabled:opacity-50">
                    <RefreshCw size={16} /> Consultar estado
                </button>
                <button type="button" disabled={saving} onClick={onClose}
                    className="rounded-lg border border-slate-300 px-4 py-2 disabled:opacity-50">Cerrar</button>
                {canApprove && <button type="button" disabled={loading || saving || needsRefresh || !reviewed}
                    onClick={() => void approve()}
                    className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-white disabled:opacity-50">
                    <CheckCircle size={16} /> {saving ? 'Aprobando…' : 'Confirmar aprobación'}
                </button>}
            </div>
        </dialog>
    );
}
