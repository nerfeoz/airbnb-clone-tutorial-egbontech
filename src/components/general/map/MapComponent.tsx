"use  client"

import { Icon } from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Popup, Marker } from "react-leaflet";

export interface MapProps {
  center: [number, number];
  price?: number;
}
export default function MapComponent({ center, price }: MapProps) {
    const customIcon = new Icon({
        iconUrl:"/images/marker-icon.png",
        iconSize:[32,42],
        iconAnchor:[32,42],
        popupAnchor:[0,-42]
    })
  return (
    <div className="relative w-full h-full overflow-hidden border border-gray-200 shadow-sm">
      <MapContainer
        className="w-full h-full"
        center={center}
        zoom={center ? 8 : 4}
        scrollWheelZoom={false}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Marker position={center} icon={customIcon}>
          {price && (
            <Popup>
              <p className="font-semibold">${price} / night</p>
            </Popup>
          )}
        </Marker>
      </MapContainer>
    </div>
  );
}
