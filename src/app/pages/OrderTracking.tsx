import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { ArrowLeft, Package, MapPin, CheckCircle, Clock, Truck } from "lucide-react";
import { MapContainer, TileLayer, Marker, Polyline } from "react-leaflet";
import { motion } from "motion/react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Create custom delivery person icon
const deliveryIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

interface TrackingStep {
  id: string;
  label: string;
  description: string;
  timestamp: string;
  completed: boolean;
  icon: any;
}

export function OrderTracking() {
  const navigate = useNavigate();
  const { orderId } = useParams();
  
  const [deliveryLocation, setDeliveryLocation] = useState<[number, number]>([40.7128, -74.006]);
  const [driverLocation, setDriverLocation] = useState<[number, number]>([40.7200, -74.0100]);
  
  const [trackingSteps] = useState<TrackingStep[]>([
    {
      id: "1",
      label: "Order Placed",
      description: "Your order has been confirmed",
      timestamp: "2026-02-09, 10:30 AM",
      completed: true,
      icon: CheckCircle,
    },
    {
      id: "2",
      label: "Order Packed",
      description: "Items are being prepared",
      timestamp: "2026-02-09, 11:15 AM",
      completed: true,
      icon: Package,
    },
    {
      id: "3",
      label: "Out for Delivery",
      description: "Your order is on the way",
      timestamp: "2026-02-10, 9:00 AM",
      completed: true,
      icon: Truck,
    },
    {
      id: "4",
      label: "Delivered",
      description: "Expected delivery",
      timestamp: "Today, 11:30 AM",
      completed: false,
      icon: MapPin,
    },
  ]);

  // Simulate driver movement
  useEffect(() => {
    const interval = setInterval(() => {
      setDriverLocation((prev) => {
        const newLat = prev[0] + (Math.random() - 0.5) * 0.001;
        const newLng = prev[1] + (Math.random() - 0.5) * 0.001;
        return [newLat, newLng];
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const routeCoordinates: [number, number][] = [
    driverLocation,
    [40.7180, -74.0080],
    [40.7150, -74.0070],
    deliveryLocation,
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-br from-green-600 to-green-700 text-white p-4 shadow-lg z-[1000]">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/account/orders")}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors active:scale-95"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="font-bold">Track Order</h1>
            <p className="text-xs opacity-90">ORD-2026-001234</p>
          </div>
        </div>
      </div>

      {/* Map */}
      <div className="h-80 relative z-0">
        <MapContainer
          center={deliveryLocation}
          zoom={14}
          style={{ height: "100%", width: "100%" }}
          zoomControl={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {/* Delivery location marker */}
          <Marker position={deliveryLocation} />
          
          {/* Driver location marker */}
          <Marker position={driverLocation} icon={deliveryIcon} />
          
          {/* Route polyline */}
          <Polyline
            positions={routeCoordinates}
            color="#16a34a"
            weight={4}
            opacity={0.7}
            dashArray="10, 10"
          />
        </MapContainer>

        {/* Driver Info Card */}
        <div className="absolute bottom-4 left-4 right-4 bg-white rounded-2xl p-4 shadow-xl z-[1000]">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center">
              <Truck className="w-6 h-6 text-green-600" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-gray-800">John Smith</p>
              <p className="text-xs text-gray-500">Delivery Partner</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-green-600">5 mins away</p>
              <p className="text-xs text-gray-500">2.3 km</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tracking Steps */}
      <div className="flex-1 bg-white rounded-t-3xl -mt-6 p-4 relative z-10">
        <h2 className="font-bold text-gray-800 mb-4">Order Status</h2>
        
        <div className="space-y-4">
          {trackingSteps.map((step, index) => {
            const Icon = step.icon;
            const isLast = index === trackingSteps.length - 1;
            
            return (
              <div key={step.id} className="relative">
                <div className="flex gap-4">
                  {/* Timeline */}
                  <div className="flex flex-col items-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className={`w-10 h-10 rounded-full flex items-center justify-center shadow-md ${
                        step.completed
                          ? "bg-green-600 text-white"
                          : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </motion.div>
                    
                    {!isLast && (
                      <div
                        className={`w-0.5 h-12 mt-2 ${
                          step.completed ? "bg-green-600" : "bg-gray-200"
                        }`}
                      />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 pb-8">
                    <h3 className={`font-semibold ${
                      step.completed ? "text-gray-800" : "text-gray-400"
                    }`}>
                      {step.label}
                    </h3>
                    <p className="text-sm text-gray-500 mt-0.5">
                      {step.description}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {step.timestamp}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Order Items Summary */}
        <div className="mt-6 p-4 bg-gray-50 rounded-xl">
          <h3 className="font-semibold text-gray-800 mb-3">Order Items</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Fresh Tomatoes × 2</span>
              <span className="text-gray-800">₹5.40</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Organic Milk × 1</span>
              <span className="text-gray-800">₹4.20</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Whole Wheat Bread × 1</span>
              <span className="text-gray-800">₹3.50</span>
            </div>
            <div className="pt-2 border-t border-gray-200 flex justify-between">
              <span className="font-semibold text-gray-800">Total</span>
              <span className="font-bold text-green-600">₹45.80</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
