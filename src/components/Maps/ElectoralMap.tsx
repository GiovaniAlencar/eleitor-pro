import { useCallback, useState } from 'react';
import Map, { NavigationControl, FullscreenControl } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import MapMarker from './MapMarker';

interface Marker {
  latitude: number;
  longitude: number;
  type: 'eleitor' | 'lideranca';
}

interface ElectoralMapProps {
  markers: Marker[];
  onMarkerClick?: (marker: Marker) => void;
}

export default function ElectoralMap({ markers, onMarkerClick }: ElectoralMapProps) {
  const [viewState, setViewState] = useState({
    latitude: -23.5505,
    longitude: -46.6333,
    zoom: 11
  });

  const handleMarkerClick = useCallback((marker: Marker) => {
    onMarkerClick?.(marker);
  }, [onMarkerClick]);

  return (
    <Map
      {...viewState}
      onMove={evt => setViewState(evt.viewState)}
      style={{ width: '100%', height: 600 }}
      mapStyle="mapbox://styles/mapbox/light-v11"
      mapboxAccessToken="pk.eyJ1IjoiYXJmZXUxOTk3IiwiYSI6ImNseDVkbGFkaTA3ZmUyanBtaTdjbWJ6ZHkifQ.Z6-YXZ90DtD3INyqeDnHGQ"
    >
      <NavigationControl position="top-right" />
      <FullscreenControl position="top-right" />
      
      {markers.map((marker, index) => (
        <MapMarker
          key={index}
          {...marker}
          onClick={() => handleMarkerClick(marker)}
        />
      ))}
    </Map>
  );
}