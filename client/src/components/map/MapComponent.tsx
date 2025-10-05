import React, { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./MapStyles.css";

// Fix for default markers in React-Leaflet
delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })
  ._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Create a custom marker icon
const createCustomIcon = (color: string = "blue") => {
  return L.divIcon({
    className: "custom-div-icon",
    html: `<div style="
      background-color: ${color};
      width: 20px;
      height: 20px;
      border-radius: 50%;
      border: 2px solid white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.3);
    "></div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });
};

// Interface for place data
export interface Place {
  id: string;
  name: string;
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  category?: string;
  country?: string;
  region?: string;
}

// Interface for map props
interface MapComponentProps {
  places?: Place[];
  center?: [number, number];
  zoom?: number;
  height?: string;
  onPlaceSelect?: (place: Place) => void;
  className?: string;
}

// Component to handle map updates when places change
const MapUpdater: React.FC<{ places: Place[] }> = ({ places }) => {
  const map = useMap();
  const prevPlacesRef = useRef<Place[]>([]);

  useEffect(() => {
    // Only update if places actually changed
    if (
      places.length > 0 &&
      JSON.stringify(places) !== JSON.stringify(prevPlacesRef.current)
    ) {
      try {
        // Create bounds to fit all places
        const bounds = L.latLngBounds(
          places.map((place) => [place.coordinates.lat, place.coordinates.lng])
        );
        map.fitBounds(bounds, { padding: [20, 20] });
        prevPlacesRef.current = places;
      } catch (error) {
        console.warn("Error updating map bounds:", error);
      }
    }
  }, [places, map]);

  return null;
};

const MapComponent: React.FC<MapComponentProps> = ({
  places = [],
  center = [51.505, -0.09], // Default to London
  zoom = 13,
  height = "400px",
  onPlaceSelect,
  className = "",
}) => {
  const [isMapReady, setIsMapReady] = useState(false);

  // Initialize map when component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMapReady(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  if (!isMapReady) {
    return (
      <div
        className={`w-full ${className} flex items-center justify-center bg-gray-100 rounded-lg`}
        style={{ height }}
      >
        <div className="text-gray-500">Loading map...</div>
      </div>
    );
  }

  return (
    <div className={`w-full ${className} relative z-[1]`} style={{ height }}>
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: "100%", width: "100%" }}
        className="h-full w-full rounded-lg shadow-lg"
        zoomControl={true}
        scrollWheelZoom={true}
        doubleClickZoom={true}
        dragging={true}
      >
        {/* OpenStreetMap tiles (free) */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Update map bounds when places change */}
        <MapUpdater places={places} />

        {/* Render markers for each place */}
        {places.map((place) => (
          <Marker
            key={place.id}
            position={[place.coordinates.lat, place.coordinates.lng]}
            icon={createCustomIcon("#3b82f6")}
            eventHandlers={{
              click: () => {
                if (onPlaceSelect) {
                  onPlaceSelect(place);
                }
              },
            }}
          >
            <Popup>
              <div className="p-2 min-w-[200px]">
                <h3 className="font-semibold text-lg">{place.name}</h3>
                <p className="text-sm text-gray-600">{place.address}</p>
                {place.category && (
                  <span className="inline-block mt-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                    {place.category}
                  </span>
                )}
                {onPlaceSelect && (
                  <button
                    onClick={() => onPlaceSelect(place)}
                    className="mt-2 w-full bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors"
                  >
                    Select Place
                  </button>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapComponent;
