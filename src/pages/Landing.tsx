import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navigation, Clock, MapPin, Search } from 'lucide-react';

const Landing = () => {
  const navigate = useNavigate();
  const [start, setStart] = useState('');
  const [destination, setDestination] = useState('');
  const [mode, setMode] = useState('car');

  const handleRouteSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (start && destination) {
      navigate(`/journey?start=${encodeURIComponent(start)}&end=${encodeURIComponent(destination)}&mode=${mode}`);
    }
  };

  const previousCommutes = [
    { id: 1, start: 'Mira Road Station', end: 'Bhayandar East', mode: 'walker', time: 'Yesterday, 6:00 PM' },
    { id: 2, start: 'Maxus Mall', end: 'MBMC Office', mode: 'car', time: 'Mon, 9:30 AM' },
    { id: 3, start: 'GCC Club', end: 'Thakur Mall', mode: 'cycle', time: 'Sun, 7:00 AM' },
  ];

  const getModeIcon = () => {
    // For demo purposes, we can just use Navigation for all or switch cases.
    return <Navigation size={16} />;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
      {/* Hero Section */}
      <section style={{ textAlign: 'center', margin: 'var(--space-8) 0' }}>
        <h1 style={{ fontSize: 'var(--text-4xl)', marginBottom: 'var(--space-4)' }}>
          <span className="gradient-text">Intelligent Routing</span> for <br /> Mira-Bhayandar
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-lg)', maxWidth: '600px', margin: '0 auto' }}>
          Constraint-aware multi-modal navigation reacting to live congestion and accessible paths.
        </p>
      </section>

      {/* Main Search Panel */}
      <section className="glass-panel" style={{ padding: 'var(--space-8)', maxWidth: '800px', margin: '0 auto', width: '100%' }}>
        <h2 style={{ marginBottom: 'var(--space-6)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <Search size={24} color="var(--accent-primary)" />
          Plan Your Journey
        </h2>
        
        <form onSubmit={handleRouteSearch} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
            <div>
              <label className="label">Start Location</label>
              <div style={{ position: 'relative' }}>
                <MapPin size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-secondary)' }} />
                <input 
                  type="text" 
                  className="input-field" 
                  style={{ paddingLeft: '40px' }}
                  placeholder="e.g. Mira Road Station"
                  value={start}
                  onChange={(e) => setStart(e.target.value)}
                  required
                />
              </div>
            </div>
            <div>
              <label className="label">Destination</label>
              <div style={{ position: 'relative' }}>
                <MapPin size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-secondary)' }} />
                <input 
                  type="text" 
                  className="input-field" 
                  style={{ paddingLeft: '40px' }}
                  placeholder="e.g. Maxus Mall"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>
          
          <div>
            <label className="label">Commuter Mode</label>
            <select 
              className="input-field"
              value={mode}
              onChange={(e) => setMode(e.target.value)}
            >
              <option value="car">Car / Bike / Auto / Taxi</option>
              <option value="cycle">Bicycle</option>
              <option value="big_vehicle">Bus / Truck (Big Vehicle)</option>
              <option value="scheduled">Scheduled (Bus/Metro)</option>
              <option value="walker">Walker</option>
              <option value="wheelchair">Wheelchair</option>
            </select>
          </div>

          <button type="submit" className="btn-primary" style={{ marginTop: 'var(--space-4)' }}>
            <Navigation size={20} />
            Find Route
          </button>
        </form>
      </section>

      {/* Previous Commutes */}
      <section style={{ maxWidth: '800px', margin: '0 auto', width: '100%' }}>
        <h3 style={{ marginBottom: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <Clock size={20} color="var(--accent-secondary)" />
          Previous Commutes
        </h3>
        
        <div style={{ display: 'grid', gap: 'var(--space-4)' }}>
          {previousCommutes.map((commute) => (
            <div key={commute.id} className="glass-panel" style={{ padding: 'var(--space-4)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-1)' }}>
                  <span style={{ fontWeight: 600 }}>{commute.start}</span>
                  <span style={{ color: 'var(--text-secondary)' }}>→</span>
                  <span style={{ fontWeight: 600 }}>{commute.end}</span>
                </div>
                <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                  {getModeIcon()}
                  <span style={{ textTransform: 'capitalize' }}>{commute.mode}</span>
                  <span>•</span>
                  <span>{commute.time}</span>
                </div>
              </div>
              <button 
                className="btn-secondary"
                onClick={() => {
                  setStart(commute.start);
                  setDestination(commute.end);
                  setMode(commute.mode);
                }}
              >
                Replan
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Landing;
