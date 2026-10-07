import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { Calculator, DollarSign, X } from 'lucide-react';
import { apiErrorMessage } from '../api/http';
import { catalogApi } from '../api/catalogApi';
import type { CustomerOption, VehicleOption } from '../api/catalogApi';
import { creditApplicationsApi } from '../api/creditApplicationsApi';
import type { CreditSimulationResponse } from '../api/creditApplicationsApi';

interface Props { isOpen: boolean; onClose: () => void; onCreated: () => void }

/** 
 * Registra una solicitud usando catalogos de la sucursal autenticada y
 * presenta la simulacion financiera del dominio.
 * @author DarwinG 
 */
export default function ModalNuevoCredito({ isOpen, onClose, onCreated }: Props) {
  const [customers, setCustomers] = useState<CustomerOption[]>([]);
  const [vehicles, setVehicles] = useState<VehicleOption[]>([]);
  const [customerId, setCustomerId] = useState(''), [vehicleId, setVehicleId] = useState('');
  const [price, setPrice] = useState(''), [down, setDown] = useState(''), [months, setMonths] = useState(6);
  const [loadingCatalog, setLoadingCatalog] = useState(false), [saving, setSaving] = useState(false);
  const [error, setError] = useState(''), [simulationError, setSimulationError] = useState('');
  const [simulation, setSimulation] = useState<CreditSimulationResponse | null>(null);
  const [simulationLoading, setSimulationLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    let cancelled = false;
    setCustomers([]);
    setVehicles([]);
    setCustomerId('');
    setVehicleId('');
    setPrice('');
    setDown('');
    setMonths(6);
    setSimulation(null);
    setLoadingCatalog(true);
    setError('');
    Promise.all([catalogApi.customers(), catalogApi.vehicles('AVAILABLE')])
      .then(([c, v]) => { if (!cancelled) { setCustomers(c); setVehicles(v); } })
      .catch((e: unknown) => { if (!cancelled) setError(apiErrorMessage(e)); })
      .finally(() => { if (!cancelled) setLoadingCatalog(false); });
    return () => { cancelled = true; };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || price.trim() === '' || down.trim() === '') {
      setSimulation(null);
      setSimulationLoading(false);
      setSimulationError('');
      return;
    }
    const p = Number(price), d = Number(down);
    if (!Number.isFinite(p) || !Number.isFinite(d) || p <= 0 || d < 0 || d >= p) {
      setSimulation(null);
      setSimulationLoading(false);
      setSimulationError('');
      return;
    }
    let cancelled = false;
    setSimulation(null);
    setSimulationError('');
    setSimulationLoading(true);
    const timer = window.setTimeout(() => {
      creditApplicationsApi.simulate({
        currency: 'PEN',
        vehiclePrice: p,
        downPayment: d,
        installmentCount: months
      })
        .then(result => { if (!cancelled) setSimulation(result); })
        .catch((reason: unknown) => { if (!cancelled) setSimulationError(apiErrorMessage(reason)); })
        .finally(() => { if (!cancelled) setSimulationLoading(false); });
    }, 300);
    return () => { cancelled = true; window.clearTimeout(timer); };
  }, [isOpen, price, down, months]);

  const vehicle = vehicles.find(v => String(v.id) === vehicleId);
  const amount = useMemo(() => {
    const p = Number(price), d = Number(down);
    return Number.isFinite(p) && Number.isFinite(d) && p > d && d >= 0 ? p - d : null;
  }, [price, down]);

  const chooseVehicle = (id: string) => {
    setVehicleId(id);
    const selected = vehicles.find(v => String(v.id) === id);
    if (selected) setPrice(String(selected.referencePrice));
  };

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (saving || loadingCatalog || !customers.some(c => String(c.id) === customerId) || !vehicle || amount === null) return;
    setSaving(true);
    setError('');
    try {
      await creditApplicationsApi.create({
        customerId: Number(customerId),
        vehicleId: vehicle.id,
        currency: 'PEN',
        vehiclePrice: Number(price),
        downPayment: Number(down),
        installmentCount: months
      });
      onCreated();
      onClose();
    } catch (reason) {
      setError(apiErrorMessage(reason));
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
      <div role="dialog" aria-modal="true" aria-labelledby="credit-dialog-title" className="w-full max-w-3xl overflow-hidden rounded-xl bg-white shadow-xl">
        <div className="flex justify-between border-b bg-slate-50 px-6 py-4">
          <div className="flex gap-2"><Calculator className="text-emerald-600" />
            <h2 id="credit-dialog-title" className="font-bold">Simulación y Evaluación de Crédito</h2>
          </div>
          <button disabled={saving} onClick={onClose} aria-label="Cerrar"><X /></button>
        </div>
        <form className="space-y-6 p-6" onSubmit={submit}>
          {error && <p role="alert" className="rounded bg-rose-50 p-3 text-sm text-rose-700">{error}</p>}
          {loadingCatalog ? <p>Cargando catálogos...</p> : <>
            <div className="grid gap-4 md:grid-cols-2">
              <label>Cliente solicitante
                <select required value={customerId} onChange={e => setCustomerId(e.target.value)} className="mt-2 w-full rounded border p-2">
                  <option value="">Seleccionar cliente existente...</option>
                  {customers.map(c => <option key={c.id} value={c.id}>{c.fullName} ({c.documentType}: {c.documentNumber})</option>)}
                </select>
              </label>
              <label>Vehículo a financiar
                <select required value={vehicleId} onChange={e => chooseVehicle(e.target.value)} className="mt-2 w-full rounded border p-2">
                  <option value="">Seleccionar unidad disponible...</option>
                  {vehicles.map(v => <option key={v.id} value={v.id}>{v.brand} {v.model} · S/ {v.referencePrice.toFixed(2)}</option>)}
                </select>
              </label>
            </div>
            <div className="grid gap-4 rounded-xl border bg-slate-50 p-4 sm:grid-cols-3">
              <label>Precio de venta (S/)
                <input required readOnly type="number" min="0.01" step="0.01" value={price} className="mt-2 w-full rounded border bg-slate-100 p-2" />
              </label>
              <label>Cuota inicial (S/)
                <input required type="number" min="0" step="0.01" value={down} onChange={e => setDown(e.target.value)} className="mt-2 w-full rounded border p-2" />
              </label>
              <label>Plazo
                <select value={months} onChange={e => setMonths(Number(e.target.value))} className="mt-2 w-full rounded border p-2">
                  {Array.from({ length: 12 }, (_, index) => index + 1).map(term => <option key={term} value={term}>{term} {term === 1 ? "mes" : "meses"}</option>)}
                </select>
              </label>
            </div>
            <div className="flex items-center justify-between rounded-xl border border-emerald-100 bg-emerald-50 p-4">
              <div className="flex items-center gap-3"><DollarSign /><div><b>Cuota mensual estimada</b>
                <p className="text-xs text-slate-500">{simulation ? 'Tasa compensatoria mensual ' + simulation.compensatoryInterestRate.toFixed(2) + '% · La última cuota puede diferir por redondeo' : 'Calculada con las reglas financieras del servidor'}</p>
              </div></div>
              <div className="text-right">
                <strong className="text-2xl text-emerald-700">{simulationLoading ? 'Calculando...' : simulation ? 'S/ ' + simulation.estimatedMonthlyInstallment.toFixed(2) : '—'}</strong>
                <p className="text-xs text-slate-500">{amount === null ? '' : 'Monto a financiar: S/ ' + amount.toFixed(2)}</p>
              </div>
            </div>
            {simulationError && <p role="alert" className="text-sm text-rose-700">{simulationError}</p>}
          </>}
          <div className="flex justify-end gap-3 border-t pt-3">
            <button type="button" disabled={saving} onClick={onClose} className="rounded border px-4 py-2">Cancelar</button>
            <button disabled={loadingCatalog || saving || !customers.length || !vehicles.length || !customerId || !vehicle || amount === null} className="rounded bg-emerald-600 px-4 py-2 text-white disabled:opacity-50">{saving ? 'Registrando...' : 'Registrar solicitud'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}