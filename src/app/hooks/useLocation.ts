import { useState, useEffect } from "react";

export interface Location {
  id: string;
  name: string;
  zipCode: string;
}

const LOCATION_STORAGE_KEY = "grocery-location";
const DEFAULT_LOCATION: Location = {
  id: "default",
  name: "New York",
  zipCode: "10001",
};

const PRESET_LOCATIONS: Location[] = [
  { id: "1", name: "New York", zipCode: "10001" },
  { id: "2", name: "Manhattan", zipCode: "10002" },
  { id: "3", name: "Brooklyn", zipCode: "11201" },
  { id: "4", name: "Queens", zipCode: "11375" },
  { id: "5", name: "Bronx", zipCode: "10451" },
];

export function useLocation() {
  const [location, setLocationState] = useState<Location>(DEFAULT_LOCATION);
  const [isLoading, setIsLoading] = useState(true);

  // Load location from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(LOCATION_STORAGE_KEY);
      if (stored) {
        const parsedLocation = JSON.parse(stored);
        setLocationState(parsedLocation);
      }
    } catch (error) {
      console.error("Failed to load location from localStorage:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const setLocation = (newLocation: Location) => {
    setLocationState(newLocation);
    try {
      localStorage.setItem(LOCATION_STORAGE_KEY, JSON.stringify(newLocation));
    } catch (error) {
      console.error("Failed to save location to localStorage:", error);
    }
  };

  return {
    location,
    setLocation,
    isLoading,
    presetLocations: PRESET_LOCATIONS,
  };
}
