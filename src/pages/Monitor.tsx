import React, { useState } from 'react';
import { Activity, ShieldAlert, X, Radio } from 'lucide-react';

const Monitor = () => {
  const [type, setType] = useState('vehicle_congestion');
  const [severity, setSeverity] = useState('7');
  const [duration, setDuration] = useState('120');
  const [isActive, setIsActive] = useState(false);
  const [coords, setCoords] = useState('19.2900, 72.8600'); // Mock coordinate selection

  const handleInject = (e: React.FormEvent) => {
    e.preventDefault();
    const event = {
      type,
      severity: parseInt(severity),
      duration: parseInt(duration),
      lat: parseFloat(coords.split(',')[0]),
      lng: parseFloat(coords.split(',')[1]),
      timestamp: new Date().toISOString()
    };
    
    // In a real app this is a POST /monitor/inject
    // For demo, we write to localStorage to trigger the Journey page listener
    localStorage.setItem('active_congestion', JSON.stringify(event));
    
    // Dispatch custom event for same-tab updates
    window.dispatchEvent(new Event('congestionUpdate'));
    
    setIsActive(true);
  };

  const handleClear = () => {
    localStorage.removeItem('active_congestion');
    window.dispatchEvent(new Event('congestionUpdate'));
    setIsActive(false);
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-6)' }}>
        <Activity size={28} color="var(--status-error)" />
        <h1 style={{ fontSize: 'var(--text-3xl)', color: 'var(--status-error)' }}>Monitor / Inject</h1>
      </div>
      
      <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-8)' }}>
        System administration interface. Inject synthetic congestion/crowd events to simulate routing engine responses in real-time.
      </p>

      <div className="glass-panel" style={{ padding: 'var(--space-6)', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
        <h2 style={{ marginBottom: 'var(--space-6)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <Radio size={20} />
          Broadcast New Event
        </h2>

        <form onSubmit={handleInject} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
            <div>
              <label className="label">Event Type</label>
              <select className="input-field" value={type} onChange={(e) => setType(e.target.value)}>
                <option value="vehicle_congestion">Vehicle Congestion</option>
                <option value="pedestrian_crowd">Pedestrian Crowd</option>
                <option value="full_block">Full Block</option>
                <option value="restricted_zone">Restricted Zone (Big Vehicles)</option>
              </select>
            </div>
            
            <div>
              <label className="label">Severity (1-10)</label>
              <input 
                type="number" 
                min="1" max="10" 
                className="input-field" 
                value={severity}
                onChange={(e) => setSeverity(e.target.value)}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
            <div>
              <label className="label">Target Coordinates (Lat, Lng)</label>
              <input 
                type="text" 
                className="input-field" 
                value={coords}
                onChange={(e) => setCoords(e.target.value)}
                placeholder="e.g. 19.2900, 72.8600"
              />
              <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Represents center of affected 30m grid cells</span>
            </div>
            
            <div>
              <label className="label">Duration (Minutes)</label>
              <input 
                type="number" 
                className="input-field" 
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="btn-primary" 
            style={{ background: 'var(--status-error)', marginTop: 'var(--space-4)' }}
            disabled={isActive}
          >
            <ShieldAlert size={20} />
            Inject Event to Routing Engine
          </button>
        </form>
      </div>

      {isActive && (
        <div className="glass-panel" style={{ marginTop: 'var(--space-6)', padding: 'var(--space-6)', background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ color: 'var(--status-error)', marginBottom: 'var(--space-1)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: 'var(--status-error)', animation: 'pulse 2s infinite' }}></span>
                Active Injection
              </h3>
              <p style={{ color: 'var(--text-secondary)' }}>Type: {type.replace('_', ' ')} | Severity: {severity} | Coords: {coords}</p>
            </div>
            <button onClick={handleClear} className="btn-secondary" style={{ borderColor: 'var(--status-error)', color: 'var(--status-error)' }}>
              <X size={16} />
              Clear Override
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4); }
          70% { box-shadow: 0 0 0 10px rgba(239, 68, 68, 0); }
          100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
        }
      `}</style>
    </div>
  );
};

export default Monitor;
