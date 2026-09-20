import { useEffect } from 'react';
import { MapContainer, Marker, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import { formatTemperature } from './format';
import type { Location } from '../types';

const SINGAPORE_CENTER: [number, number] = [1.3521, 103.8198];
const SINGAPORE_ZOOM = 11;

interface WeatherMapProps {
  locations: Location[];
  selectedId: number | null;
  onSelect: (id: number) => void;
  interactive: boolean;
}

function pinIcon(temperature: string, isSelected: boolean): L.DivIcon {
  return L.divIcon({
    className: '',
    html: `
      <div class="flex flex-col items-center gap-1">
        <div class="rounded-full border ${
          isSelected
            ? 'border-white/40 bg-white text-slate-900'
            : 'border-white/25 bg-white/[0.14] text-white'
        } px-2 py-0.5 text-xs font-semibold tabular-nums shadow shadow-black/30 backdrop-blur-xl">
          ${temperature}
        </div>
        <div class="h-2.5 w-2.5 rounded-full border-2 ${
          isSelected ? 'border-white bg-white' : 'border-white/70 bg-white/40'
        } shadow shadow-black/40"></div>
      </div>
    `,
    iconSize: [0, 0],
    iconAnchor: [0, 4],
  });
}

function FitBoundsToLocations({ locations }: { locations: Location[] }) {
  const map = useMap();

  useEffect(() => {
    if (locations.length === 0) {
      map.setView(SINGAPORE_CENTER, SINGAPORE_ZOOM);
      return;
    }
    if (locations.length === 1) {
      map.setView([locations[0].latitude, locations[0].longitude], SINGAPORE_ZOOM);
      return;
    }
    const bounds = L.latLngBounds(locations.map((l) => [l.latitude, l.longitude]));
    map.fitBounds(bounds, { padding: [48, 48] });
  }, [locations, map]);

  return null;
}

export function WeatherMap({ locations, selectedId, onSelect, interactive }: WeatherMapProps) {
  return (
    <MapContainer
      center={SINGAPORE_CENTER}
      zoom={SINGAPORE_ZOOM}
      className="h-full w-full"
      dragging={interactive}
      scrollWheelZoom={interactive}
      doubleClickZoom={interactive}
      touchZoom={interactive}
      boxZoom={interactive}
      keyboard={interactive}
      zoomControl={interactive}
      attributionControl={interactive}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <FitBoundsToLocations locations={locations} />
      {locations.map((location) => (
        <Marker
          key={location.id}
          position={[location.latitude, location.longitude]}
          icon={pinIcon(formatTemperature(location.weather.temperature_c), location.id === selectedId)}
          eventHandlers={{ click: () => onSelect(location.id) }}
        />
      ))}
    </MapContainer>
  );
}
