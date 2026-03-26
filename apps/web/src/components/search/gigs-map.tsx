"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";

interface MapGig {
  id: string;
  title: string;
  category: string;
  budgetMin: number;
  budgetMax: number;
  city: string;
  latitude: number;
  longitude: number;
}

const mockNearbyGigs: MapGig[] = [
  { id: "1", title: "Logo Design for Startup", category: "Graphic Design", budgetMin: 5000, budgetMax: 12000, city: "Bangalore", latitude: 12.9716, longitude: 77.5946 },
  { id: "2", title: "Photography for Event", category: "Other", budgetMin: 8000, budgetMax: 15000, city: "Bangalore", latitude: 12.9352, longitude: 77.6245 },
  { id: "3", title: "Local Videography", category: "Video Editing", budgetMin: 10000, budgetMax: 25000, city: "Bangalore", latitude: 12.9850, longitude: 77.5533 },
];

export function GigsMap() {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [nearbyGigs, setNearbyGigs] = useState<MapGig[]>(mockNearbyGigs);
  const [selectedGig, setSelectedGig] = useState<MapGig | null>(null);
  const [radius, setRadius] = useState(25); // km

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => setUserLocation({ lat: 12.9716, lng: 77.5946 }) // Default: Bangalore
      );
    }
  }, []);

  // In production: load Leaflet dynamically and render actual map
  // For now: list-based "map" view

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Gigs Near Me</h2>
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-500">Radius:</label>
          <select
            value={radius}
            onChange={(e) => setRadius(Number(e.target.value))}
            className="text-sm border rounded px-2 py-1"
          >
            <option value={5}>5 km</option>
            <option value={10}>10 km</option>
            <option value={25}>25 km</option>
            <option value={50}>50 km</option>
          </select>
        </div>
      </div>

      {/* Map placeholder - in production use Leaflet + OpenStreetMap */}
      <div className="h-[400px] bg-gray-100 rounded-lg border relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-2">🗺️</div>
            <p className="text-sm text-muted-foreground">
              Interactive map loads with Leaflet + OpenStreetMap
            </p>
            {userLocation && (
              <p className="text-xs text-gray-400 mt-1">
                Your location: {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
              </p>
            )}
          </div>
        </div>
        {/* Gig markers overlay */}
        {nearbyGigs.map((gig, idx) => (
          <button
            key={gig.id}
            onClick={() => setSelectedGig(gig)}
            className="absolute bg-brand-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-xs font-bold shadow-lg hover:bg-brand-700 transition-colors"
            style={{
              top: `${30 + idx * 25}%`,
              left: `${20 + idx * 20}%`,
            }}
          >
            {idx + 1}
          </button>
        ))}
      </div>

      {/* Nearby gigs list */}
      <div className="space-y-3">
        {nearbyGigs.map((gig) => (
          <Card
            key={gig.id}
            className={`cursor-pointer transition-shadow ${selectedGig?.id === gig.id ? "ring-2 ring-brand-500" : "hover:shadow-md"}`}
            onClick={() => setSelectedGig(gig)}
          >
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-sm">{gig.title}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary" className="text-xs">{gig.category}</Badge>
                  <span className="text-xs text-gray-500">📍 {gig.city}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-sm">{formatCurrency(gig.budgetMin)} - {formatCurrency(gig.budgetMax)}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
