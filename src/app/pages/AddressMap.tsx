import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, MapPin, Search, Navigation, Save } from "lucide-react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { motion } from "motion/react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useAddresses } from "../hooks/useAddresses";

// Fix for default marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

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

export function AddressMap() {
  const navigate = useNavigate();
  const { addresses, addAddress } = useAddresses();
  const [position, setPosition] = useState<[number, number]>([40.7128, -74.006]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [address, setAddress] = useState({
    street: "",
    city: "",
    state: "",
    zip: "",
    label: "Home",
  });

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setPosition([pos.coords.latitude, pos.coords.longitude]);
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    }
  };

  const handleSave = () => {
    if (!address.street || !address.city || !address.state || !address.zip) {
      alert("Please fill in all address fields");
      return;
    }

    setIsLoading(true);
    
    // Simulate save delay
    setTimeout(() => {
      const labelMap: { [key: string]: "home" | "work" | "other" } = {
        "Home": "home",
        "Work": "work",
        "Other": "other",
      };

      const addressType = labelMap[address.label] || "other";
      
      addAddress({
        type: addressType,
        label: address.label,
        street: address.street,
        city: address.city,
        state: address.state,
        zip: address.zip,
        isDefault: addresses.length === 0, // Make first address default
      });

      setIsLoading(false);
      navigate("/account/addresses");
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-br from-green-600 to-green-700 text-white p-4 shadow-lg z-[1000]">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/account/addresses")}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors active:scale-95"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="font-bold">Select Location</h1>
        </div>
      </div>

      {/* Search Bar */}
      <div className="p-4 bg-white border-b shadow-sm z-[1000]">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search for area, street name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-50 rounded-xl text-sm outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
      </div>

      {/* Map */}
      <div className="flex-1 relative">
        <MapContainer
          center={position}
          zoom={13}
          style={{ height: "100%", width: "100%" }}
          zoomControl={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <LocationMarker position={position} setPosition={setPosition} />
        </MapContainer>

        {/* Current Location Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={getCurrentLocation}
          className="absolute bottom-32 right-4 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center z-[1000]"
        >
          <Navigation className="w-5 h-5 text-green-600" />
        </motion.button>
      </div>

      {/* Address Form */}
      <div className="bg-white p-4 space-y-3 shadow-lg rounded-t-3xl z-[1000]">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-gradient-to-br from-green-50 to-green-100 rounded-lg flex items-center justify-center">
            <MapPin className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">Delivery Address</h3>
            <p className="text-xs text-gray-500">Complete the details below</p>
          </div>
        </div>

        <div className="space-y-2">
          <select
            value={address.label}
            onChange={(e) => setAddress({ ...address, label: e.target.value })}
            className="w-full p-3 bg-gray-50 rounded-xl text-sm outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="Home">Home</option>
            <option value="Work">Work</option>
            <option value="Other">Other</option>
          </select>

          <input
            type="text"
            placeholder="Street Address"
            value={address.street}
            onChange={(e) => setAddress({ ...address, street: e.target.value })}
            className="w-full p-3 bg-gray-50 rounded-xl text-sm outline-none focus:ring-2 focus:ring-green-500"
          />

          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              placeholder="City"
              value={address.city}
              onChange={(e) => setAddress({ ...address, city: e.target.value })}
              className="p-3 bg-gray-50 rounded-xl text-sm outline-none focus:ring-2 focus:ring-green-500"
            />
            <input
              type="text"
              placeholder="State"
              value={address.state}
              onChange={(e) => setAddress({ ...address, state: e.target.value })}
              className="p-3 bg-gray-50 rounded-xl text-sm outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <input
            type="text"
            placeholder="ZIP Code"
            value={address.zip}
            onChange={(e) => setAddress({ ...address, zip: e.target.value })}
            className="w-full p-3 bg-gray-50 rounded-xl text-sm outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSave}
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl p-4 flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save className="w-5 h-5" />
          <span className="font-semibold">{isLoading ? "Saving..." : "Save Address"}</span>
        </motion.button>
      </div>
    </div>
  );
}
