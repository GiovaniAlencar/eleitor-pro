import { Marker } from 'react-map-gl';
import { MapPin, Users } from 'lucide-react';

interface MapMarkerProps {
  latitude: number;
  longitude: number;
  type: 'eleitor' | 'lideranca';
  onClick?: () => void;
}

export default function MapMarker({ latitude, longitude, type, onClick }: MapMarkerProps) {
  return (
    <Marker latitude={latitude} longitude={longitude}>
      <button
        onClick={onClick}
        className={`p-1 rounded-full transition-transform hover:scale-110 ${
          type === 'eleitor' ? 'bg-green-500' : 'bg-blue-500'
        }`}
      >
        {type === 'eleitor' ? (
          <MapPin className="w-5 h-5 text-white" />
        ) : (
          <Users className="w-5 h-5 text-white" />
        )}
      </button>
    </Marker>
  );
}