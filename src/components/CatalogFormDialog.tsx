/** 
 * Formulario compartido; el servidor valida permisos y datos en cada escritura.
 * @author DarwinG 
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import axios from 'axios';
import { X } from 'lucide-react';
import AmountInput from './AmountInput';
import { apiErrorMessage } from '../api/http';
import { useAuthStore } from '../stores/authStore';
import { useFormLookup } from '../hooks/useFormLookup';
import type { FormLookup } from '../hooks/useFormLookup';

type FieldRule<T> = T | ((values: FormValues) => T);

export type FieldSpec = {
    name: string;
    label: string;
    required?: boolean;
    maxLength?: FieldRule<number>;
    minLength?: FieldRule<number>;
    pattern?: FieldRule<string>;
    inputMode?: 'numeric' | 'decimal';
    normalizeInput?: (value: string, values: FormValues) => string;
    resetFieldsOnChange?: readonly string[];
    type?: 'text' | 'email' | 'number' | 'amount';
    min?: number;
    max?: number;
    step?: string;
    choices?: readonly string[];
    immutable?: boolean;
};

export type FormValues = Record<string, string>;
export type FormDetail = {
    values: FormValues;
    revision: string
};
export type CatalogDialogProps = {
    code: string | null;
    onClose: () => void;
    onSaved: () => void
};

type Props = CatalogDialogProps & {
    title: string;
    module: 'customers' | 'vehicles';
    fields: readonly FieldSpec[];
    note: string;
    lookup?: FormLookup;
    load: (code: string) => Promise<FormDetail>;
    save: (values: FormValues, revision: string | null, code: string | null) => Promise<unknown>;
};

export default function CatalogFormDialog({ code, onClose, onSaved, title, module, fields, note, load, save, lookup }: Props) {
    const user = useAuthStore(state => state.user);
    const allowed = !!user?.permissions.includes(`${module}:read`) && !!user.permissions.includes(`${module}:write`);
    const dialog = useRef<HTMLDialogElement>(null);
    const lifecycle = useRef({ version: 0 });
    const writing = useRef(false);
    const [values, setValues] = useState<FormValues>(() => Object.fromEntries(fields.map(field => [field.name, field.choices?.[0] ?? ''])));
    const [revision, setRevision] = useState<string | null>(null);
    const [loading, setLoading] = useState(code !== null);
    const [saving, setSaving] = useState(false);
    const [blocked, setBlocked] = useState(false);
    const [error, setError] = useState('');

    const applyLookup = useCallback((key: string, patch: FormValues) => {
        if (writing.current) return;
        setValues(previous => {
            if (!lookup || lookup.key(previous) !== key)
                return previous;
            /* No sobrescribir una corrección escrita mientras la consulta estaba en curso. */
            const emptyFields = Object.fromEntries(Object.entries(patch)
                .filter(([name]) => (previous[name] ?? '').trim() === ''));
            return { ...previous, ...emptyFields };
        });
    }, [lookup]);
    const enrichment = useFormLookup(lookup, values, allowed && !code && !saving && !blocked, applyLookup);

    useEffect(() => {
        const element = dialog.current;
        const previous = document.activeElement;
        element?.showModal();
        return () => {
            element?.close();
            if (previous instanceof HTMLElement && previous.isConnected)
                previous.focus();
        };
    }, []);

    useEffect(() => {
        const tracker = lifecycle.current;
        const version = ++tracker.version;
        async function readDetail() {
            if (!code || !allowed)
                return;
            try {
                const detail = await load(code);
                if (tracker.version !== version || useAuthStore.getState().user !== user)
                    return;
                setValues(detail.values);
                setRevision(detail.revision);
            } catch (failure) {
                if (tracker.version !== version || useAuthStore.getState().user !== user)
                    return;
                setError(apiErrorMessage(failure));
                setBlocked(true);
            } finally {
                if (tracker.version === version && useAuthStore.getState().user === user)
                    setLoading(false);
            }
        }
        void readDetail();
        return () => { tracker.version++; };
    }, [code, allowed, load, user]);

    async function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (writing.current || enrichment.busy || !allowed || loading || blocked || (code !== null && revision === null))
            return;
        writing.current = true;
        setSaving(true);
        setError('');

        const version = lifecycle.current.version;

        try {
            await save(values, revision, code);
            if (lifecycle.current.version === version && useAuthStore.getState().user === user)
                onSaved();
        } catch (failure) {
            if (lifecycle.current.version !== version || useAuthStore.getState().user !== user)
                return;
            const uncertain = !axios.isAxiosError(failure) || !failure.response || failure.response.status >= 500;
            const conflict = axios.isAxiosError(failure) && failure.response?.status === 409;
            const forbidden = axios.isAxiosError(failure) && failure.response?.status === 403;

            setBlocked(uncertain || conflict || forbidden);
            setError(uncertain
                ? 'No se pudo confirmar el resultado. Cierra este formulario y consulta el listado antes de volver a registrar o editar.'
                : `${apiErrorMessage(failure)}${conflict ? ' Cierra y vuelve a abrir la ficha para revisar los datos actuales.' : ''}`);
        } finally {
            writing.current = false;
            if (lifecycle.current.version === version && useAuthStore.getState().user === user)
                setSaving(false);
        }
    }

    function fieldRule<T>(rule: FieldRule<T> | undefined): T | undefined {
        return typeof rule === 'function' ? (rule as (values: FormValues) => T)(values) : rule;
    }

    function changeField(field: FieldSpec, value: string) {
        setValues(previous => {
            const normalized = field.normalizeInput ? field.normalizeInput(value, previous) : value;
            if (normalized === previous[field.name])
                return previous;
            return {
                ...previous,
                ...Object.fromEntries((field.resetFieldsOnChange ?? []).map(name => [name, ''])),
                [field.name]: normalized,
            };
        });
    }

    function close() { if (!writing.current) onClose(); }

    return (
        <dialog ref={dialog} aria-labelledby="catalog-title" onCancel={event => { event.preventDefault(); close(); }}
            className="m-auto w-[calc(100%-2rem)] max-w-2xl max-h-[90dvh] rounded-xl p-0 shadow-xl backdrop:bg-slate-900/50">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white p-5">
                <h2 id="catalog-title" className="text-xl font-bold text-slate-800">{code ? 'Editar' : 'Registrar'} {title}</h2>
                <button type="button" aria-label="Cerrar formulario" disabled={saving} onClick={close} className="rounded-lg p-2 hover:bg-slate-100 disabled:opacity-40"><X size={20} /></button>
            </div>
            <form onSubmit={event => void submit(event)} className="p-5 space-y-4">
                <p className="text-sm text-slate-500">{note}</p>
                {!allowed && <p role="alert">No tienes permiso para guardar esta ficha.</p>}
                {error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-red-800">{error}</p>}
                {loading && <p role="status">Cargando ficha…</p>}
                <fieldset disabled={loading || saving || !allowed || blocked} className="grid grid-cols-1 sm:grid-cols-2 gap-4 disabled:opacity-60">
                    {fields.map(field => <label key={field.name} className="block text-sm text-slate-700" htmlFor={`${module}-${field.name}`}>
                        <span className="mb-1 block font-medium">{field.label}{field.required && <span aria-hidden="true"> *</span>}</span>
                        {field.choices ? <select id={`${module}-${field.name}`} value={values[field.name] ?? ''}
                            disabled={!!code && field.immutable} onChange={event => changeField(field, event.target.value)}
                            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 disabled:bg-slate-100">
                            {field.choices.map(choice => <option key={choice}>{choice}</option>)}
                        </select> : field.type === 'amount' ? <AmountInput id={`${module}-${field.name}`} value={values[field.name] ?? ''}
                            required={field.required} readOnly={!!code && field.immutable} min={field.min} max={field.max}
                            onValueChange={value => changeField(field, value)} /> : <input id={`${module}-${field.name}`} type={field.type ?? 'text'} value={values[field.name] ?? ''}
                                readOnly={!!code && field.immutable} required={field.required} maxLength={fieldRule(field.maxLength)} minLength={fieldRule(field.minLength)}
                                pattern={fieldRule(field.pattern)} inputMode={field.inputMode}
                                onPaste={event => {
                                    if (!field.normalizeInput || event.currentTarget.readOnly) return;
                                    event.preventDefault();
                                    const input = event.currentTarget;
                                    const before = input.value.slice(0, input.selectionStart ?? 0);
                                    const after = input.value.slice(input.selectionEnd ?? input.value.length);
                                    changeField(field, before + event.clipboardData.getData('text') + after);
                                }}
                                min={field.min} max={field.max} step={field.step}
                                onChange={event => changeField(field, event.target.value)}
                                className="w-full rounded-lg border border-slate-200 px-3 py-2 read-only:bg-slate-100 focus:outline-emerald-600" />}
                    </label>)}
                </fieldset>
                {enrichment.message && <div className={`rounded-lg p-3 text-sm ${enrichment.status === 'error' ? 'bg-amber-50 text-amber-900' : 'bg-slate-50 text-slate-700'}`}>
                    <p role="status" aria-live="polite">{enrichment.message}</p>
                    {enrichment.status === 'error' && <button type="button" onClick={enrichment.retry}
                        className="mt-2 rounded border border-amber-300 px-3 py-1 font-medium">Reintentar consulta</button>}
                </div>}
                <div className="flex justify-end gap-3 border-t border-slate-200 pt-4">
                    <button type="button" disabled={saving} onClick={close} className="rounded-lg border border-slate-200 px-4 py-2">Cerrar</button>
                    <button type="submit" disabled={enrichment.busy || loading || saving || !allowed || blocked || (!!code && !revision)} className="rounded-lg bg-emerald-600 px-4 py-2 text-white disabled:opacity-40">
                        {saving ? 'Guardando…' : 'Guardar'}
                    </button>
                </div>
            </form>
        </dialog>
    );
}
