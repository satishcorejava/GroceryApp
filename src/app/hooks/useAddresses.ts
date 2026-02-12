import { useState, useEffect } from "react";
import { addressesApi, AddressRequest } from "../services/api";

export interface Address {
  id: string;
  type?: "home" | "work" | "other";
  label: string;
  street: string;
  city: string;
  state: string;
  zip?: string;
  zipCode?: string;
  coordinates?: { lat: number; lng: number };
  isDefault?: boolean;
}

const ADDRESSES_STORAGE_KEY = "grocery-addresses";

const defaultAddresses: Address[] = [
  {
    id: "1",
    type: "home",
    label: "Home",
    street: "123 Main Street",
    city: "New York",
    state: "NY",
    zip: "10001",
    isDefault: true,
  },
  {
    id: "2",
    type: "work",
    label: "Work",
    street: "456 Business Ave",
    city: "New York",
    state: "NY",
    zip: "10002",
    isDefault: false,
  },
];

export function useAddresses() {
  const [addresses, setAddresses] = useState<Address[]>(() => {
    const stored = localStorage.getItem(ADDRESSES_STORAGE_KEY);
    return stored ? JSON.parse(stored) : defaultAddresses;
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load addresses from API on mount
  useEffect(() => {
    const loadAddresses = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem("auth-token");
        if (token) {
          try {
            const apiAddresses = await addressesApi.getAll();
            setAddresses(apiAddresses);
            localStorage.setItem(ADDRESSES_STORAGE_KEY, JSON.stringify(apiAddresses));
          } catch (err) {
            console.error("Failed to load addresses from API:", err);
            // Fall back to localStorage
          }
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadAddresses();
  }, []);

  useEffect(() => {
    localStorage.setItem(ADDRESSES_STORAGE_KEY, JSON.stringify(addresses));
  }, [addresses]);

  const addAddress = async (newAddress: Omit<Address, "id">) => {
    setError(null);
    try {
      const id = Date.now().toString();
      const addressWithId: Address = {
        ...newAddress,
        id,
      };
      
      // Try to add via API if logged in
      const token = localStorage.getItem("auth-token");
      if (token) {
        try {
          const apiAddress = await addressesApi.create({
            label: newAddress.label,
            street: newAddress.street,
            city: newAddress.city,
            state: newAddress.state,
            zipCode: newAddress.zipCode || newAddress.zip || "",
            coordinates: newAddress.coordinates || { lat: 0, lng: 0 },
            isDefault: newAddress.isDefault,
          });
          setAddresses((prev: Address[]) => {
            if (newAddress.isDefault || prev.length === 0) {
              return [
                ...prev.map((addr: Address) => ({ ...addr, isDefault: false })),
                apiAddress,
              ];
            }
            return [...prev, apiAddress];
          });
          return;
        } catch (err) {
          console.error("Failed to add address via API:", err);
        }
      }

      // If this is the first address or marked as default, make it default
      if (addresses.length === 0 || newAddress.isDefault) {
        setAddresses([
          ...addresses.map((addr: Address) => ({ ...addr, isDefault: false })),
          addressWithId,
        ]);
      } else {
        setAddresses([...addresses, addressWithId]);
      }
    } catch (err: any) {
      const errorMessage = err.message || "Failed to add address";
      setError(errorMessage);
    }
  };

  const updateAddress = async (
    id: string,
    updatedAddress: Partial<Address>
  ) => {
    setError(null);
    try {
      const token = localStorage.getItem("auth-token");
      if (token) {
        try {
          await addressesApi.update(id, {
            label: updatedAddress.label || "",
            street: updatedAddress.street || "",
            city: updatedAddress.city || "",
            state: updatedAddress.state || "",
            zipCode: updatedAddress.zipCode || updatedAddress.zip || "",
            coordinates: updatedAddress.coordinates || { lat: 0, lng: 0 },
          });
        } catch (err) {
          console.error("Failed to update address via API:", err);
        }
      }

      setAddresses((prev: Address[]) =>
        prev.map((addr: Address) =>
          addr.id === id ? { ...addr, ...updatedAddress } : addr
        )
      );
    } catch (err: any) {
      const errorMessage = err.message || "Failed to update address";
      setError(errorMessage);
    }
  };

  const deleteAddress = async (id: string) => {
    setError(null);
    try {
      const token = localStorage.getItem("auth-token");
      if (token) {
        try {
          await addressesApi.delete(id);
        } catch (err) {
          console.error("Failed to delete address via API:", err);
        }
      }

      const newAddresses = addresses.filter((addr: Address) => addr.id !== id);

      // If deleted address was default, make the first remaining address default
      if (
        newAddresses.length > 0 &&
        !newAddresses.some((addr: Address) => addr.isDefault)
      ) {
        newAddresses[0].isDefault = true;
      }

      setAddresses(newAddresses);
    } catch (err: any) {
      const errorMessage = err.message || "Failed to delete address";
      setError(errorMessage);
    }
  };

  const setDefaultAddress = async (id: string) => {
    setError(null);
    try {
      const token = localStorage.getItem("auth-token");
      if (token) {
        try {
          await addressesApi.setDefault(id);
        } catch (err) {
          console.error("Failed to set default address via API:", err);
        }
      }

      setAddresses((prev: Address[]) =>
        prev.map((addr: Address) => ({
          ...addr,
          isDefault: addr.id === id,
        }))
      );
    } catch (err: any) {
      const errorMessage = err.message || "Failed to set default address";
      setError(errorMessage);
    }
  };

  const getDefaultAddress = () => {
    return addresses.find((addr: Address) => addr.isDefault) || addresses[0];
  };

  return {
    addresses,
    isLoading,
    error,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
    getDefaultAddress,
  };
}
