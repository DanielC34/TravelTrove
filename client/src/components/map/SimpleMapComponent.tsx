import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./MapStyles.css";

// Fix for default markers
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

interface SimpleMapComponentProps {
  places?: Place[];
  center?: [number, number];
  zoom?: number;
  height?: string;
  onPlaceSelect?: (place: Place) => void;
  className?: string;
}

const SimpleMapComponent: React.FC<SimpleMapComponentProps> = ({
  places = [],
  center = [51.505, -0.09],
  zoom = 13,
  height = "400px",
  onPlaceSelect,
  className = "",
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const [isMapReady, setIsMapReady] = useState(false);

  // Initialize map
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    try {
      // Create map instance
      const map = L.map(mapRef.current).setView(center, zoom);
      mapInstanceRef.current = map;

      // Add tile layer
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      setIsMapReady(true);
    } catch (error) {
      console.error("Error initializing map:", error);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [center, zoom]);

  // Update markers when places change
  useEffect(() => {
    if (!mapInstanceRef.current || !isMapReady) return;

    // Clear existing markers
    markersRef.current.forEach((marker) => {
      mapInstanceRef.current?.removeLayer(marker);
    });
    markersRef.current = [];

    // Add new markers
    places.forEach((place) => {
      try {
        const marker = L.marker([
          place.coordinates.lat,
          place.coordinates.lng,
        ]).addTo(mapInstanceRef.current!);

        // Create popup content
        const popupContent = `
          <div style="padding: 8px; min-width: 200px;">
            <h3 style="font-weight: 600; font-size: 16px; margin: 0 0 4px 0;">${
              place.name
            }</h3>
            <p style="font-size: 14px; color: #666; margin: 0 0 8px 0;">${
              place.address
            }</p>
            ${
              place.category
                ? `<span style="display: inline-block; padding: 2px 8px; background: #dbeafe; color: #1e40af; font-size: 12px; border-radius: 4px;">${place.category}</span>`
                : ""
            }
            ${
              onPlaceSelect
                ? `<button onclick="window.selectPlace('${place.id}')" style="margin-top: 8px; width: 100%; background: #3b82f6; color: white; padding: 6px 12px; border: none; border-radius: 4px; cursor: pointer; font-size: 14px;">Select Place</button>`
                : ""
            }
          </div>
        `;

        marker.bindPopup(popupContent);
        markersRef.current.push(marker);

        // Add click handler
        marker.on("click", () => {
          if (onPlaceSelect) {
            onPlaceSelect(place);
          }
        });
      } catch (error) {
        console.error("Error adding marker:", error);
      }
    });

    // Fit bounds if we have places
    if (places.length > 0) {
      try {
        const group = new L.FeatureGroup(markersRef.current);
        mapInstanceRef.current.fitBounds(group.getBounds().pad(0.1));
      } catch (error) {
        console.warn("Error fitting bounds:", error);
      }
    }
  }, [places, isMapReady, onPlaceSelect]);

  // Set up global function for popup buttons
  useEffect(() => {
    (window as any).selectPlace = (placeId: string) => {
      const place = places.find((p) => p.id === placeId);
      if (place && onPlaceSelect) {
        onPlaceSelect(place);
      }
    };

    return () => {
      delete (window as any).selectPlace;
    };
  }, [places, onPlaceSelect]);

  return (
    <div className={`w-full ${className} relative z-[1]`} style={{ height }}>
      <div
        ref={mapRef}
        style={{ height: "100%", width: "100%" }}
        className="h-full w-full rounded-lg shadow-lg"
      />
      {!isMapReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
          <div className="text-gray-500">Loading map...</div>
        </div>
      )}
    </div>
  );
};

export default SimpleMapComponent;
