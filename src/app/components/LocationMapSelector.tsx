import { useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapPin, Navigation } from "lucide-react";

// Fix for default marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

interface LocationMapSelectorProps {
  onLocationSelect: (lat: number, lng: number, address: string) => void;
}

interface LocationMarkerProps {
  position: [number, number];
  setPosition: (pos: [number, number]) => void;
}

function LocationMarker({ position, setPosition }: LocationMarkerProps) {
  useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
    },
  });

  return <Marker position={position} />;
}

export function LocationMapSelector({
  onLocationSelect,
}: LocationMapSelectorProps) {
  const [position, setPosition] = useState<[number, number]>([40.7128, -74.006]);
  const [selectedAddress, setSelectedAddress] = useState(
    "New York, NY 10001"
  );
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      setIsLoadingLocation(true);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setPosition([pos.coords.latitude, pos.coords.longitude]);
          setIsLoadingLocation(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          setIsLoadingLocation(false);
        }
      );
    }
  };

  const handleSelectLocation = () => {
    // Format the address based on coordinates (simplified)
    const lat = position[0].toFixed(4);
    const lng = position[1].toFixed(4);
    const addressString = selectedAddress || `${lat}, ${lng}`;
    onLocationSelect(position[0], position[1], addressString);
  };

  return (
    <div className="space-y-4">
      {/* Map Container */}
      <div className="rounded-xl overflow-hidden border border-gray-200 shadow-sm">
        <MapContainer
          center={position}
          zoom={13}
          style={{
            height: "400px",
            width: "100%",
          }}
          className="rounded-xl"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <LocationMarker position={position} setPosition={setPosition} />
        </MapContainer>
      </div>

      {/* Location Info */}
      <div className="bg-gray-50 rounded-lg p-3">
        <p className="text-xs text-gray-500 font-medium mb-1">Selected Location</p>
        <p className="text-sm font-semibold text-gray-900">
          {position[0].toFixed(4)}, {position[1].toFixed(4)}
        </p>
        <p className="text-xs text-gray-600 mt-1">{selectedAddress}</p>
      </div>

      {/* Get Current Location Button */}
      <button
        onClick={getCurrentLocation}
        disabled={isLoadingLocation}
        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-green-50 hover:bg-green-100 border border-green-300 text-green-700 font-semibold rounded-lg transition-colors active:scale-95 disabled:opacity-50"
      >
        <Navigation className="w-4 h-4" />
        {isLoadingLocation ? "Getting location..." : "Use My Current Location"}
      </button>

      {/* Select Button */}
      <button
        onClick={handleSelectLocation}
        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors active:scale-95"
      >
        <MapPin className="w-4 h-4" />
        Confirm Location
      </button>
    </div>
  );
}
