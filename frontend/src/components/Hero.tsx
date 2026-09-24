import { useStore, useSelectedLocation } from '../state/store';
import { useTheme } from '../state/theme';
import { LocationIcon, RefreshIcon } from './icons';
import { HourlyStrip } from './HourlyStrip';
import { TenDayForecast } from './TenDayForecast';
import { TileGrid } from './Tiles';
import { MapCard } from './MapCard';
import { formatTemperature, formatTime } from './format';

export function Hero() {
  const { locations, refresh, refreshingId } = useStore();
  const selected = useSelectedLocation();
  const { themeId } = useTheme();
  const isAurora = themeId === 'midnight-aurora';

  if (!selected) {
    return (
      <main className="flex flex-1 flex-col p-10">
        <div className="flex flex-1 items-center justify-center">
          <div className="text-center">
            <p className="text-2xl font-light text-[rgb(var(--ink)/85%)]">Select a location</p>
            <p className="mt-2 text-sm text-[rgb(var(--ink)/60%)]">
              Add a Singapore coordinate from the sidebar to see its weather.
            </p>
          </div>
        </div>
      </main>
    );
  }

  const isHome = locations[0]?.id === selected.id;
  const area =
    selected.weather?.area || `${selected.latitude.toFixed(3)}, ${selected.longitude.toFixed(3)}`;
  const condition = selected.weather?.condition || 'Conditions unavailable';
  const observed = formatTime(selected.weather?.observed_at);
  const validPeriod = selected.weather?.valid_period_text;
  const source = selected.weather?.source;
  const isRefreshing = refreshingId === selected.id;
  const temperature = formatTemperature(selected.weather?.temperature_c);
  const high = formatTemperature(selected.weather?.forecast_high_c);
  const low = formatTemperature(selected.weather?.forecast_low_c);

  return (
    <main className="flex-1 overflow-y-auto">
      <div className="mx-auto flex max-w-5xl flex-col gap-3 p-6 lg:p-8">
        <header className="flex flex-col items-center pt-6 pb-2 text-center">
          {isHome && (
            <div className="eyebrow mb-2 flex items-center gap-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--ink)/70%)]">
              <LocationIcon className="h-3 w-3" />
              <span>Home</span>
            </div>
          )}
          <h1
            className="font-[family-name:var(--font-display)] text-4xl font-light leading-tight text-[rgb(var(--ink))]"
          >
            {area}
          </h1>
          <div
            className={`mt-2 font-[family-name:var(--font-display)] text-[6.5rem] leading-none tracking-tight ${
              isAurora
                ? 'bg-gradient-to-r from-[var(--aurora-teal)] to-[var(--aurora-violet)] bg-clip-text font-medium tracking-tighter text-transparent'
                : 'font-extralight text-[rgb(var(--ink))]'
            }`}
          >
            {temperature}
          </div>
          <div className="mt-1 text-lg text-[rgb(var(--ink)/90%)]">{condition}</div>
          <div className="mt-1 text-sm text-[rgb(var(--ink)/70%)] tabular-nums">
            H:{high} L:{low}
          </div>
          {observed && (
            <div className="mt-3 text-xs text-[rgb(var(--ink)/55%)]">Updated {observed}</div>
          )}
        </header>

        {validPeriod && (
          <p className="px-2 pb-1 text-center text-xs text-[rgb(var(--ink)/65%)]">{validPeriod}</p>
        )}

        <HourlyStrip periods={selected.weather?.forecast_periods} />
        <TenDayForecast weather={selected.weather} />
        <TileGrid weather={selected.weather} />
        <MapCard locations={locations} selectedId={selected.id} />

        <footer className="mt-2 flex flex-col items-center gap-3 pb-8 text-xs text-[rgb(var(--ink)/55%)]">
          <button
            type="button"
            onClick={() => void refresh(selected.id)}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 rounded-full border border-[rgb(var(--ink)/15%)] bg-[rgb(var(--ink)/8%)] px-3 py-1.5 text-xs font-medium text-[rgb(var(--ink)/85%)] backdrop-blur-xl hover:bg-[rgb(var(--ink)/14%)] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshIcon className={`h-3.5 w-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>{isRefreshing ? 'Refreshing…' : 'Refresh'}</span>
          </button>
          <p>
            Weather for {area}
            {source ? ` · ${source}` : ''}
          </p>
        </footer>
      </div>
    </main>
  );
}
