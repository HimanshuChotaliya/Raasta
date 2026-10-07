import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { AlertCircle, Navigation, Clock, Activity, Search } from 'lucide-react';
import L from 'leaflet';

// Fix Leaflet default marker icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Component to recenter map when route changes
const MapEffect = ({ route }: { route: [number, number][] }) => {
  const map = useMap();
  useEffect(() => {
    if (route && route.length > 0) {
      const bounds = L.latLngBounds(route);
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [route, map]);
  return null;
};

// Popular local aliases to bypass API limits and ensure accuracy
const POPULAR_LOCATIONS: Record<string, {lat: number, lon: number}> = {
  "shree l r tiwari college of engineering": { lat: 19.299166, lon: 72.876345 },
  "mbmc office": { lat: 19.2929387, lon: 72.8916659 },
  "maxus mall": { lat: 19.2964853, lon: 72.8482569 },
  "mira road station": { lat: 19.2821, lon: 72.8557 },
  "bhayandar station": { lat: 19.2952, lon: 72.8556 },
  "gcc club": { lat: 19.2843, lon: 72.8785 }
};

const Journey = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const startParam = searchParams.get('start') || 'Mira Road Station';
  const endParam = searchParams.get('end') || 'Maxus Mall';
  const modeParam = searchParams.get('mode') || 'car';

  const [route, setRoute] = useState<[number, number][]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSimulating, setIsSimulating] = useState(false);
  const [congestionEvent, setCongestionEvent] = useState<{lat: number, lng: number, type: string} | null>(null);
  const [distance, setDistance] = useState('');
  const [duration, setDuration] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // 1. Geocode locations and fetch real route from OSRM API
  useEffect(() => {
    const fetchRoute = async () => {
      setIsLoading(true);
      setErrorMsg('');
      try {
        // Geocode helper with local fallback
        const geocode = async (query: string) => {
          const qLower = query.toLowerCase().trim();
          if (POPULAR_LOCATIONS[qLower]) {
            return [{ lat: POPULAR_LOCATIONS[qLower].lat, lon: POPULAR_LOCATIONS[qLower].lon }];
          }

          let res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`);
          let data = await res.json();
          if (data.length === 0) {
            // Try appending local context if first attempt fails
            res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query + ', Mira Bhayandar')}&limit=1`);
            data = await res.json();
          }
          if (data.length === 0) {
            // Try appending Mumbai as a wider fallback
            res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query + ', Mumbai')}&limit=1`);
            data = await res.json();
          }
          return data;
        };

        // Geocode Start
        const startData = await geocode(startParam);
        
        // Geocode End
        const endData = await geocode(endParam);

        if (startData.length === 0 || endData.length === 0) {
          setErrorMsg('Could not find one or both locations. Please try adding city/state names for better results.');
          setIsLoading(false);
          return;
        }

        const startCoords = { lat: parseFloat(startData[0].lat), lon: parseFloat(startData[0].lon) };
        const endCoords = { lat: parseFloat(endData[0].lat), lon: parseFloat(endData[0].lon) };

        // Determine OSRM profile based on mode
        let osrmProfile = 'driving';
        if (modeParam === 'cycle') osrmProfile = 'cycling';
        if (modeParam === 'walker' || modeParam === 'wheelchair') osrmProfile = 'walking';

        // Fetch Route from OSRM Public API
        const routeRes = await fetch(`https://router.project-osrm.org/route/v1/${osrmProfile}/${startCoords.lon},${startCoords.lat};${endCoords.lon},${endCoords.lat}?overview=full&geometries=geojson`);
        const routeData = await routeRes.json();

        if (routeData.code !== 'Ok') {
          setErrorMsg('Could not calculate a route between these locations.');
          setIsLoading(false);
          return;
        }

        // Convert GeoJSON LineString coordinates [lon, lat] to Leaflet [lat, lon]
        const coordinates = routeData.routes[0].geometry.coordinates.map((coord: number[]) => [coord[1], coord[0]] as [number, number]);
        setRoute(coordinates);
        
        // Update meta
        const distKm = (routeData.routes[0].distance / 1000).toFixed(1);
        setDistance(`${distKm} km`);
        const durMin = Math.round(routeData.routes[0].duration / 60);
        setDuration(`${durMin} mins`);
        
      } catch (err) {
        setErrorMsg('Network error while resolving locations.');
      }
      setIsLoading(false);
    };

    fetchRoute();
  }, [startParam, endParam, modeParam]);

  // Simulated live reflection of congestion
  useEffect(() => {
    const handleStorageChange = () => {
      const congestion = localStorage.getItem('active_congestion');
      if (congestion) {
        const data = JSON.parse(congestion);
        setCongestionEvent(data);
        setIsSimulating(true);
        
        // Simulate a routing engine recalculating path around the congestion
        setTimeout(() => {
          setIsSimulating(false);
          if (route.length > 0) {
            const currentRoute = [...route];
            // Modify middle point to "avoid" congestion slightly for visual demo
            const midIndex = Math.floor(currentRoute.length / 2);
            currentRoute[midIndex] = [currentRoute[midIndex][0] + 0.005, currentRoute[midIndex][1] - 0.005];
            setRoute(currentRoute);
          }
        }, 1500);
      } else {
        setCongestionEvent(null);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    const handleLocalUpdate = () => handleStorageChange();
    window.addEventListener('congestionUpdate', handleLocalUpdate);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('congestionUpdate', handleLocalUpdate);
    };
  }, [route]); // re-bind listener when route updates

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 140px)', gap: 'var(--space-4)' }}>
      
      {/* Top Bar - Route Details */}
      <div className="glass-panel" style={{ padding: 'var(--space-4)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: 'var(--text-xl)', marginBottom: 'var(--space-1)' }}>
            {startParam} <span style={{ color: 'var(--text-secondary)' }}>to</span> {endParam}
          </h2>
          <div style={{ display: 'flex', gap: 'var(--space-4)', color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Navigation size={14} /> Mode: 
              <select 
                value={modeParam} 
                onChange={(e) => setSearchParams({ start: startParam, end: endParam, mode: e.target.value })}
                style={{ 
                  background: 'var(--bg-secondary)', 
                  color: 'var(--text-primary)', 
                  border: '1px solid var(--border-color)', 
                  borderRadius: 'var(--radius-sm)', 
                  padding: '2px 8px', 
                  outline: 'none',
                  textTransform: 'capitalize',
                  cursor: 'pointer'
                }}
              >
                <option value="car">Car / Bike / Auto</option>
                <option value="cycle">Bicycle</option>
                <option value="big_vehicle">Big Vehicle (Truck/Bus)</option>
                <option value="walker">Walker</option>
                <option value="wheelchair">Wheelchair</option>
              </select>
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Clock size={14} /> Est. Time: <span style={{ color: 'var(--text-primary)' }}>{isLoading ? '...' : duration}</span>
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Activity size={14} /> Distance: <span style={{ color: 'var(--text-primary)' }}>{isLoading ? '...' : distance}</span>
            </span>
            {isSimulating && (
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--status-warning)' }}>
                <Activity size={14} className="spin" style={{ animation: 'spin 2s linear infinite' }} /> Recalculating route...
              </span>
            )}
          </div>
        </div>
        
        {congestionEvent && !isSimulating && (
           <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', background: 'rgba(239, 68, 68, 0.1)', padding: 'var(--space-2) var(--space-4)', borderRadius: 'var(--radius-md)', color: 'var(--status-error)', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
             <AlertCircle size={18} />
             <span>Route adjusted for active {congestionEvent.type.replace('_', ' ')}</span>
           </div>
        )}
      </div>

      {errorMsg && (
        <div style={{ padding: 'var(--space-4)', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid var(--status-error)', borderRadius: 'var(--radius-md)', color: 'var(--status-error)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <AlertCircle size={20} />
          {errorMsg}
        </div>
      )}

      {/* Map Area */}
      <div className="glass-panel" style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
        {isLoading && !errorMsg ? (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--glass-bg)', backdropFilter: 'blur(4px)', zIndex: 1000, color: 'white' }}>
             <Search size={40} color="var(--accent-primary)" style={{ marginBottom: '1rem', animation: 'spin 2s linear infinite' }} />
             <p style={{ fontWeight: 500 }}>Geocoding locations & calculating real route...</p>
             <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
          </div>
        ) : null}

        <MapContainer 
          center={[19.2842, 72.8688]} 
          zoom={14} 
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            className="map-tiles"
          />
          
          <MapEffect route={route} />

          {/* Start Marker */}
          {route.length > 0 && (
            <Marker position={route[0]}>
              <Popup>Start: {startParam}</Popup>
            </Marker>
          )}
          
          {/* End Marker */}
          {route.length > 0 && (
            <Marker position={route[route.length - 1]}>
              <Popup>End: {endParam}</Popup>
            </Marker>
          )}

          {/* Render Route */}
          {route.length > 0 && (
            <Polyline 
              positions={route} 
              color={congestionEvent && !isSimulating ? "var(--status-warning)" : "var(--accent-primary)"} 
              weight={5} 
              opacity={0.8} 
            />
          )}

          {/* Render Congestion Zone if active */}
          {congestionEvent && (
            <Marker position={[congestionEvent.lat, congestionEvent.lng]}>
              <Popup>
                <strong style={{ color: 'black' }}>Active Override</strong>
                <br />
                Type: {congestionEvent.type}
              </Popup>
            </Marker>
          )}

        </MapContainer>
      </div>
    </div>
  );
};

export default Journey;
