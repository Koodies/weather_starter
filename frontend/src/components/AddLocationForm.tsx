import { useState } from 'react';
import type { FormEvent } from 'react';
import { useStore } from '../state/store';
import { PlusIcon } from './icons';

export function AddLocationForm() {
  const { isAdding, setAdding, create } = useStore();
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const cancel = () => {
    setLatitude('');
    setLongitude('');
    setSubmitError(null);
    setAdding(false);
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setSubmitError(null);
    try {
      await create({ latitude: Number(latitude), longitude: Number(longitude) });
      setLatitude('');
      setLongitude('');
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Could not add location');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isAdding) {
    return (
      <button
        type="button"
        onClick={() => setAdding(true)}
        className="flex w-full items-center justify-center gap-2 rounded-2xl border border-[rgb(var(--ink)/15%)] bg-[rgb(var(--ink)/7%)] px-3 py-2.5 text-sm font-medium text-[rgb(var(--ink)/85%)] backdrop-blur-xl hover:bg-[rgb(var(--ink)/12%)]"
      >
        <PlusIcon />
        <span>Add Location</span>
      </button>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="grid gap-2.5 rounded-2xl border border-[rgb(var(--ink)/15%)] bg-[rgb(var(--ink)/10%)] p-3 backdrop-blur-xl"
    >
      <p className="eyebrow text-[11px] font-semibold uppercase tracking-[0.14em] text-[rgb(var(--ink)/60%)]">
        New coordinate
      </p>
      <div className="grid grid-cols-2 gap-2">
        <label className="grid gap-1">
          <span className="text-[11px] text-[rgb(var(--ink)/60%)]">Latitude</span>
          <input
            type="number"
            step="any"
            value={latitude}
            onChange={(e) => setLatitude(e.target.value)}
            placeholder="1.3508"
            required
            className="rounded-md border border-[rgb(var(--ink)/15%)] bg-[rgb(var(--ink)/10%)] px-2 py-1.5 text-sm text-[rgb(var(--ink))] placeholder:text-[rgb(var(--ink)/40%)]"
          />
        </label>
        <label className="grid gap-1">
          <span className="text-[11px] text-[rgb(var(--ink)/60%)]">Longitude</span>
          <input
            type="number"
            step="any"
            value={longitude}
            onChange={(e) => setLongitude(e.target.value)}
            placeholder="103.8390"
            required
            className="rounded-md border border-[rgb(var(--ink)/15%)] bg-[rgb(var(--ink)/10%)] px-2 py-1.5 text-sm text-[rgb(var(--ink))] placeholder:text-[rgb(var(--ink)/40%)]"
          />
        </label>
      </div>
      <div className="flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={cancel}
          className="rounded-md px-2.5 py-1.5 text-xs font-medium text-[rgb(var(--ink)/70%)] hover:text-[rgb(var(--ink))]"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="rounded-md bg-[rgb(var(--ink)/90%)] px-3 py-1.5 text-xs font-semibold text-slate-900 hover:bg-[rgb(var(--ink))] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? 'Adding…' : 'Add'}
        </button>
      </div>
      {submitError && (
        <p className="rounded-md border border-red-300/30 bg-red-500/15 px-2.5 py-1.5 text-xs text-red-100">
          {submitError}
        </p>
      )}
    </form>
  );
}
