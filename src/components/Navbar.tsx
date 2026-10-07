import { NavLink } from 'react-router-dom';
import { Map, User, Activity } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <Map size={28} color="var(--accent-primary)" />
        <h1 className="gradient-text" style={{ fontSize: '1.5rem', margin: 0 }}>OmniRoute</h1>
      </div>
      
      <div className="nav-links">
        <NavLink 
          to="/" 
          className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <span>Home</span>
        </NavLink>
        <NavLink 
          to="/journey" 
          className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <Map size={18} />
          <span>Journey</span>
        </NavLink>
        <NavLink 
          to="/profile" 
          className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <User size={18} />
          <span>Profile</span>
        </NavLink>
        {/* The monitor page is intentionally hidden from regular navigation as per requirements,
            but we can add a subtle link or leave it completely hidden unless typed in URL */}
        <NavLink 
          to="/monitor" 
          className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: 0.3 }}
          title="System Monitor (Admin)"
        >
          <Activity size={18} />
        </NavLink>
      </div>
    </nav>
  );
};

export default Navbar;
