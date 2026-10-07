/** 
 * Formato visual sin atribuir una moneda a valores que el dominio no identifica. 
 * @author DarwinG 
 */
const amountFormat = new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const canonicalAmount = /^[0-9]{1,10}(?:\.[0-9]{1,2})?$/;
const groupedEntry = /^[0-9]{1,3}(?:,[0-9]{3})+(?:\.[0-9]{0,2})?$/;

/** Acepta pegado con agrupacion de miles valida, conservando el punto decimal. */
export function normalizeAmountEntry(value: string): string {
    const trimmed = value.trim();
    return groupedEntry.test(trimmed) ? trimmed.replaceAll(',', '') : trimmed;
}

/** No redondea silenciosamente ni interpreta coma decimal como separador de miles. */
export function amountValidation(value: string, min?: number, max?: number): string {
    if (value === '')
        return '';
    if (!canonicalAmount.test(value))
        return 'Usa un monto como 1,234.50, con hasta dos decimales y punto decimal.';
    const amount = Number(value);
    if (min !== undefined && amount < min)
        return `El monto minimo es ${amountFormat.format(min)}.`;
    if (max !== undefined && amount > max)
        return `El monto maximo es ${amountFormat.format(max)}.`;
    return '';
}

export function formatAmount(value: number): string {
    return Number.isFinite(value) ? amountFormat.format(value) : '—';
}

/** Los vacios siguen vacios; una entrada invalida permanece visible para corregirla. */
export function formatAmountEntry(value: string): string {
    return value !== '' && canonicalAmount.test(value) ? formatAmount(Number(value)) : value;
}
