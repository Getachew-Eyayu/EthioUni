"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const UniversityMap = dynamic(
  () => import("@/components/map/university-map").then((m) => m.UniversityMap),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[calc(100vh-12rem)] min-h-[400px] items-center justify-center rounded-lg border bg-muted">
        Loading map...
      </div>
    ),
  }
);

export default function MapPage() {
  const [universities, setUniversities] = useState([]);

  useEffect(() => {
    fetch("/api/universities")
      .then((res) => res.json())
      .then(setUniversities);
  }, []);

  const withCoords = universities.filter(
    (u: { latitude: number | null }) => u.latitude != null
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">University Map</h1>
        <p className="text-muted-foreground">
          Explore Ethiopian universities across the country
          {withCoords.length > 0 && (
            <span> — {withCoords.length} locations shown</span>
          )}
        </p>
      </div>
      <UniversityMap universities={universities} />
    </div>
  );
}
