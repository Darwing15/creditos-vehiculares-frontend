/** 
 * Consulta asincrona opcional de formularios, cancelable y vinculada a la sesion vigente.
 * @author DarwinG
 */
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { apiErrorMessage } from '../api/http';
import { useAuthStore } from '../stores/authStore';

export type FormLookup = {
    key: (values: Record<string, string>) => string | null;
    resolve: (key: string, signal: AbortSignal) => Promise<Record<string, string>>;
    successMessage: string;
};
type LookupState = {
    key: string | null;
    session: ReturnType<typeof useAuthStore.getState>['user'];
    attempt: number;
    status: 'waiting' | 'loading' | 'success' | 'error';
    message: string;
};

/** Cada resultado se aplica unicamente a la busqueda, intento y sesion que lo originaron. */
export function useFormLookup(definition: FormLookup | undefined, values: Record<string, string>,
    enabled: boolean, apply: (key: string, patch: Record<string, string>) => void) {
    const user = useAuthStore(state => state.user);
    const key = definition?.key(values) ?? null;
    const [attempt, setAttempt] = useState(0);
    const [state, setState] = useState<LookupState | null>(null);
    const lastAttempt = useRef<{ key: string; session: typeof user; attempt: number } | null>(null);

    useEffect(() => {
        if (!definition || !enabled || !key || !user) return;
        if (lastAttempt.current?.key === key && lastAttempt.current.session === user
            && lastAttempt.current.attempt === attempt) return;
        let active = true;
        let completed = false;
        const controller = new AbortController();
        const timer = setTimeout(() => {
            lastAttempt.current = { key, session: user, attempt };
            setState({
                key,
                session: user,
                attempt,
                status: 'loading',
                message: 'Consultando DNI…'
            });
            void definition.resolve(key, controller.signal).then(patch => {
                if (!active || controller.signal.aborted || useAuthStore.getState().user !== user) return;
                completed = true;
                apply(key, patch);
                setState({
                    key,
                    session: user,
                    attempt,
                    status: 'success',
                    message: definition.successMessage
                });
            }).catch((failure: unknown) => {
                if (!active || controller.signal.aborted || axios.isCancel(failure)
                    || useAuthStore.getState().user !== user) return;
                completed = true;
                setState({
                    key,
                    session: user,
                    attempt,
                    status: 'error',
                    message: apiErrorMessage(failure)
                });
            });
        }, 350);
        return () => {
            active = false; 
            clearTimeout(timer); 
            controller.abort();
            if (!completed && lastAttempt.current?.key === key && lastAttempt.current.session === user
                && lastAttempt.current.attempt === attempt) lastAttempt.current = null;
        };
    }, [definition, enabled, key, user, attempt, apply]);

    const eligible = !!definition && enabled && !!key && !!user;
    const current = state?.key === key && state.session === user && state.attempt === attempt ? state : null;
    return {
        busy: eligible && (!current || current.status === 'waiting' || current.status === 'loading'),
        status: eligible ? current?.status ?? 'waiting' : 'idle',
        message: eligible ? current?.message ?? 'Preparando consulta de DNI…' : '',
        retry: () => setAttempt(value => value + 1),
    };
}
