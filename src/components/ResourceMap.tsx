import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { Phone, MapPin, CheckCircle, Navigation, ShieldAlert, HeartPulse, Building2, Scale } from 'lucide-react';
import { Language, translations } from '../i18n/translations';

export interface ResourceItem {
  id: string;
  name: string;
  category: 'hospital' | 'police' | 'shelter' | 'legal' | 'counseling';
  county: string;
  address: string;
  phone: string;
  secondaryPhone?: string;
  openingHours: string;
  servicesOffered: string[];
  isVerified: boolean;
  isSafeSpace: boolean;
  latitude: number;
  longitude: number;
  notes?: string;
}

interface ResourceMapProps {
  resources: ResourceItem[];
  userLocation: { lat: number; lng: number } | null;
  selectedResource: ResourceItem | null;
  onSelectResource: (res: ResourceItem) => void;
  lang: Language;
  lowDataMode: boolean;
}

export const ResourceMap: React.FC<ResourceMapProps> = ({
  resources,
  userLocation,
  selectedResource,
  onSelectResource,
  lang,
  lowDataMode,
}) => {
  const t = translations[lang];
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const markersRef = useRef<L.Marker[]>([]);

  // Calculate distance in KM using Haversine formula
  const getDistanceKm = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return (R * c).toFixed(1);
  };

  useEffect(() => {
    if (lowDataMode || !mapContainerRef.current) return;

    if (!mapRef.current) {
      const defaultCenter: [number, number] = userLocation
        ? [userLocation.lat, userLocation.lng]
        : [-1.2921, 36.8219]; // Nairobi Default

      const map = L.map(mapContainerRef.current).setView(defaultCenter, 12);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors | Usalama Kenya Safe Resource Map',
        maxZoom: 18,
      }).addTo(map);

      mapRef.current = map;
    }

    const map = mapRef.current;

    // Clear old markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    // Add User location marker if available
    if (userLocation) {
      const userIcon = L.divIcon({
        className: 'user-pin-icon',
        html: `<div style="width:16px;height:16px;background:#059669;border:3px solid #fff;border-radius:50%;box-shadow:0 0 12px rgba(5,150,105,0.7);"></div>`,
        iconSize: [16, 16],
        iconAnchor: [8, 8],
      });
      const userMarker = L.marker([userLocation.lat, userLocation.lng], { icon: userIcon }).addTo(map);
      userMarker.bindPopup('<b>Your Approximate Location</b>');
      markersRef.current.push(userMarker);
    }

    // Add resource markers
    resources.forEach((res) => {
      let color = '#059669'; // default emerald
      if (res.category === 'hospital') color = '#2563eb'; // blue
      if (res.category === 'police') color = '#475569'; // slate
      if (res.category === 'shelter') color = '#9333ea'; // purple
      if (res.category === 'legal') color = '#d97706'; // amber

      const customIcon = L.divIcon({
        className: 'custom-resource-pin',
        html: `<div style="width:28px;height:28px;background:${color};color:#fff;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:bold;font-size:12px;border:2px solid #fff;box-shadow:0 3px 6px rgba(0,0,0,0.25);">
          ${res.category === 'hospital' ? '+' : res.category === 'police' ? 'P' : 'S'}
        </div>`,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      });

      const marker = L.marker([res.latitude, res.longitude], { icon: customIcon }).addTo(map);
      marker.on('click', () => {
        onSelectResource(res);
      });

      const distStr = userLocation
        ? `${getDistanceKm(userLocation.lat, userLocation.lng, res.latitude, res.longitude)} km ${t.distanceAway}`
        : '';

      marker.bindPopup(`
        <div style="min-width: 200px;">
          <h4 style="font-weight:700;color:#1e293b;margin:0 0 4px;">${res.name}</h4>
          <p style="font-size:11px;color:#64748b;margin:0 0 6px;">${res.address} ${distStr ? `• <b>${distStr}</b>` : ''}</p>
          <a href="tel:${res.phone}" style="display:inline-block;padding:4px 10px;background:#059669;color:#fff;font-weight:600;font-size:12px;border-radius:6px;text-decoration:none;">
            Call: ${res.phone}
          </a>
        </div>
      `);

      markersRef.current.push(marker);
    });

    if (selectedResource) {
      map.setView([selectedResource.latitude, selectedResource.longitude], 15);
    }
  }, [resources, userLocation, selectedResource, lowDataMode, lang]);

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
      {/* Map Header with Sleek Interface style */}
      <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-emerald-600" />
          <h3 className="font-bold text-slate-800 text-sm md:text-base">
            {t.nearbyHelpTitle}
          </h3>
          <span className="text-[11px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
            {resources.length} Verified
          </span>
        </div>
        {lowDataMode && (
          <span className="text-xs font-bold text-amber-700 bg-amber-100 px-2.5 py-1 rounded-full flex items-center gap-1">
            <ShieldAlert className="w-3.5 h-3.5" />
            {t.lowDataModeBadge}
          </span>
        )}
      </div>

      {/* Map view OR Low-Data fast list */}
      <div className="relative flex-1 min-h-[340px]">
        {!lowDataMode ? (
          <div ref={mapContainerRef} className="absolute inset-0 w-full h-full z-10" />
        ) : (
          <div className="p-6 space-y-3 overflow-y-auto max-h-[460px] bg-slate-50">
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-800 text-xs font-medium mb-4">
              ℹ️ Map images are disabled to save your data bundle and maximize speed. Showing fast text directory below.
            </div>
            {resources.map((res) => {
              const distance = userLocation
                ? getDistanceKm(userLocation.lat, userLocation.lng, res.latitude, res.longitude)
                : null;
              return (
                <div
                  key={res.id}
                  onClick={() => onSelectResource(res)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    selectedResource?.id === res.id
                      ? 'bg-emerald-50 border-emerald-600 shadow-sm'
                      : 'bg-white border-slate-200 hover:border-emerald-400'
                  }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-bold text-sm text-slate-900">{res.name}</h4>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                        res.category === 'hospital'
                          ? 'bg-blue-100 text-blue-700'
                          : res.category === 'police'
                          ? 'bg-slate-200 text-slate-700'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {res.category}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    {res.address} {distance && `• ${distance} km ${t.distanceAway}`}
                  </p>
                  <div className="mt-3 flex items-center justify-between">
                    <a
                      href={`tel:${res.phone}`}
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700"
                    >
                      <Phone className="w-3 h-3" />
                      {t.callNow}: {res.phone}
                    </a>
                    {res.isVerified && (
                      <span className="text-[11px] text-emerald-700 font-medium flex items-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                        {t.verifiedSafeSpace}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
