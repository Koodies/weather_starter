import { useStore } from '../state/store';
import { CloseIcon, CloudIcon, HomeIcon } from './icons';
import { formatTemperature, formatTime } from './format';
import type { KeyboardEvent, MouseEvent } from 'react';
import type { Location } from '../types';

interface SidebarCardProps {
  location: Location;
  isHome: boolean;
}

export function SidebarCard({ location, isHome }: SidebarCardProps) {
  const { selectedId, select, remove } = useStore();
  const isSelected = selectedId === location.id;
  const observed = formatTime(location.weather.observed_at);
  const area =
    location.weather.area || `${location.latitude.toFixed(3)}, ${location.longitude.toFixed(3)}`;
  const condition = location.weather.condition || '-';
  const temperature = formatTemperature(location.weather.temperature_c);
  const high = formatTemperature(location.weather.forecast_high_c);
  const low = formatTemperature(location.weather.forecast_low_c);

  const onSelect = () => select(location.id);
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget) return;
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onSelect();
    }
  };
  const onDelete = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    void remove(location.id);
  };
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={onKeyDown}
      aria-pressed={isSelected}
      className={`relative w-full cursor-pointer overflow-hidden rounded-2xl border text-left backdrop-blur-xl transition ${
        isSelected
          ? 'border-[color:var(--accent)] bg-[rgb(var(--ink)/8%)] shadow-lg shadow-[rgb(var(--recede)/20%)]'
          : 'border-[rgb(var(--ink)/10%)] bg-[rgb(var(--ink)/7%)] hover:bg-[rgb(var(--ink)/12%)]'
      }`}
    >
      <button
        type="button"
        onClick={onDelete}
        aria-label="Delete location"
        className="absolute right-2 top-2 z-10 rounded-full p-1 text-[rgb(var(--ink)/50%)] transition hover:bg-[rgb(var(--ink)/10%)] hover:text-[rgb(var(--ink)/90%)]"
      >
        <CloseIcon className="h-3.5 w-3.5" />
      </button>
      <div className="flex items-start justify-between gap-3 px-4 pt-3">
        <div className="min-w-0">
          <div className="truncate text-lg font-semibold leading-tight text-[rgb(var(--ink))]">
            {area}
          </div>
          <div className="mt-0.5 flex items-center gap-1.5 text-[11px] text-[rgb(var(--ink)/70%)]">
            {isHome ? (
              <>
                <span>My Location</span>
                <span className="text-[rgb(var(--ink)/40%)]">·</span>
                <HomeIcon className="h-3 w-3" />
                <span>Home</span>
              </>
            ) : observed ? (
              <span>{observed}</span>
            ) : (
              <span className="text-[rgb(var(--ink)/50%)]">Not refreshed</span>
            )}
          </div>
        </div>
        <div className="text-3xl font-light tabular-nums text-[rgb(var(--ink)/90%)]">
          {temperature}
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between border-t border-[rgb(var(--ink)/10%)] px-4 py-2 text-xs">
        <div className="flex items-center gap-2 text-[rgb(var(--ink)/80%)]">
          <CloudIcon className="h-4 w-4 text-[rgb(var(--ink)/70%)]" />
          <span>{condition}</span>
        </div>
        <div className="text-[rgb(var(--ink)/60%)] tabular-nums">
          H:{high} L:{low}
        </div>
      </div>
    </div>
  );
}
