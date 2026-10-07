/** 
 * Texto monetario accesible: presentacion agrupada, valor canonico sin separadores. 
 * @author DarwinG 
 */
import { useEffect, useRef, useState } from 'react';
import { amountValidation, formatAmountEntry, normalizeAmountEntry } from '../utils/amounts';

type Props = {
    id: string;
    value: string;
    onValueChange: (value: string) => void;
    required?: boolean;
    readOnly?: boolean;
    min?: number;
    max?: number;
};

export default function AmountInput({ id, value, onValueChange, required, readOnly, min, max }: Props) {
    const input = useRef<HTMLInputElement>(null);
    const [editingText, setEditingText] = useState<string | null>(null);

    useEffect(() => {
        input.current?.setCustomValidity(amountValidation(value, min, max));
    }, [value, min, max]);

    return (
        <input ref={input} id={id} type="text" inputMode="decimal" required={required} readOnly={readOnly}
            value={editingText ?? formatAmountEntry(value)}
            onFocus={() => setEditingText(formatAmountEntry(value))} onBlur={() => setEditingText(null)}
            onChange={event => {
                setEditingText(event.target.value);
                onValueChange(normalizeAmountEntry(event.target.value));
            }}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 read-only:bg-slate-100 focus:outline-emerald-600" />
    );
}
