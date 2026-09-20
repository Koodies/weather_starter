import { useEffect, useState } from 'react';
import { useStore } from '../state/store';
import { WeatherMap } from './WeatherMap';
import { CloseIcon, ExpandIcon, LocationIcon } from './icons';
import type { Location } from '../types';

interface MapCardProps {
  locations: Location[];
  selectedId: number | null;
}

export function MapCard({ locations, selectedId }: MapCardProps) {
  const { select } = useStore();
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (!isExpanded) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsExpanded(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isExpanded]);

  return (
    <>
      <section className="flex flex-col gap-3 rounded-2xl border border-white/15 bg-white/[0.08] p-4 backdrop-blur-xl">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/60">
            <LocationIcon className="h-3 w-3" />
            <span>Map</span>
          </div>
          <button
            type="button"
            onClick={() => setIsExpanded(true)}
            aria-label="Expand map"
            className="rounded-full p-1 text-white/60 transition hover:bg-white/10 hover:text-white/90"
          >
            <ExpandIcon />
          </button>
        </header>

        <div className="relative h-56 overflow-hidden rounded-xl">
          <WeatherMap
            locations={locations}
            selectedId={selectedId}
            onSelect={select}
            interactive={false}
          />
          <button
            type="button"
            onClick={() => setIsExpanded(true)}
            aria-label="Expand map"
            className="absolute inset-0 cursor-pointer"
          />
        </div>
      </section>

      {isExpanded && (
        <div className="fixed inset-0 z-50 flex flex-col bg-black/60 backdrop-blur-sm">
          <div className="flex items-center justify-between p-4">
            <span className="text-sm font-medium text-white/85">Map</span>
            <button
              type="button"
              onClick={() => setIsExpanded(false)}
              aria-label="Close map"
              className="flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.08] px-3 py-1.5 text-xs font-medium text-white/85 backdrop-blur-xl hover:bg-white/[0.14]"
            >
              <CloseIcon className="h-3.5 w-3.5" />
              <span>Close</span>
            </button>
          </div>
          <div className="flex-1 px-4 pb-4">
            <div className="h-full w-full overflow-hidden rounded-2xl">
              <WeatherMap
                locations={locations}
                selectedId={selectedId}
                onSelect={select}
                interactive
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
