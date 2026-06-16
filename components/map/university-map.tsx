"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";
import "leaflet/dist/leaflet.css";

type University = {
  id: string;
  name: string;
  slug: string;
  location: string;
  region: string;
  type: string;
  latitude: number | null;
  longitude: number | null;
  avgRating: number;
};

const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

export function UniversityMap({ universities }: { universities: University[] }) {
  const withCoords = universities.filter(
    (u) => u.latitude != null && u.longitude != null
  );

  const center: [number, number] =
    withCoords.length > 0
      ? [
          withCoords.reduce((s, u) => s + u.latitude!, 0) / withCoords.length,
          withCoords.reduce((s, u) => s + u.longitude!, 0) / withCoords.length,
        ]
      : [9.03, 38.74];

  return (
    <MapContainer
      center={center}
      zoom={6}
      className="h-[calc(100vh-12rem)] min-h-[400px] w-full rounded-lg border"
      scrollWheelZoom
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {withCoords.map((uni) => (
        <Marker
          key={uni.id}
          position={[uni.latitude!, uni.longitude!]}
          icon={icon}
        >
          <Popup>
            <div className="space-y-1">
              <p className="font-semibold">{uni.name}</p>
              <p className="text-sm text-gray-600">
                {uni.location}, {uni.region}
              </p>
              <Badge variant="outline" className="text-xs">
                {uni.type}
              </Badge>
              {uni.avgRating > 0 && (
                <p className="flex items-center gap-1 text-sm">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  {uni.avgRating.toFixed(1)}
                </p>
              )}
              <Link
                href={`/universities/${uni.slug}`}
                className="text-sm text-green-700 hover:underline"
              >
                View details →
              </Link>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
