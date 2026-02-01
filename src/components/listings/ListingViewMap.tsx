"use client";

import useCountries from "@/custom-hooks/useCountries";
import dynamic from "next/dynamic";

interface ListingViewMapProps {
  price: number;
  locationValue: string;
}

export default function ListingViewMap({
  price,
  locationValue,
}: ListingViewMapProps) {
  const { getByValue } = useCountries();
  const location = getByValue(locationValue);
  const MapComponent = dynamic(() => import("../general/map/MapComponent"), {
    ssr: false,
    loading: () => <p className="text-center py-6">Loading map...</p>,
  });

  if (!location) return;
  return (
    <div className="h-120 overflow-hidden border border-gray-500">
      <MapComponent price={price} center={location?.latlng} />
    </div>
  );
}
