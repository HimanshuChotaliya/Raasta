import { User, Settings, Shield, Award, Clock } from 'lucide-react';

const Profile = () => {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      
      {/* Profile Header */}
      <section className="glass-panel" style={{ padding: 'var(--space-8)', display: 'flex', alignItems: 'center', gap: 'var(--space-6)' }}>
        <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: 'var(--accent-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <User size={48} color="white" />
        </div>
        <div>
          <h1 style={{ fontSize: 'var(--text-3xl)', marginBottom: 'var(--space-1)' }}>Rahul Sharma</h1>
          <p style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <Award size={16} color="var(--status-warning)" />
            Eco-Commuter Level 4
          </p>
        </div>
      </section>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 'var(--space-6)' }}>
        
        {/* Left Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
          <section className="glass-panel" style={{ padding: 'var(--space-6)' }}>
            <h3 style={{ marginBottom: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <Settings size={20} />
              Preferences
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Default Mode</span>
                <span style={{ fontWeight: 500 }}>Bicycle</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Accessibility</span>
                <span style={{ fontWeight: 500 }}>Standard</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Avoid Tolls</span>
                <span style={{ fontWeight: 500, color: 'var(--status-success)' }}>Yes</span>
              </div>
            </div>
          </section>

          <section className="glass-panel" style={{ padding: 'var(--space-6)' }}>
            <h3 style={{ marginBottom: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <Shield size={20} />
              Privacy
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-4)' }}>
              Your location data is anonymized and only used for real-time routing.
            </p>
            <button className="btn-secondary" style={{ width: '100%' }}>Manage Data</button>
          </section>
        </div>

        {/* Right Column */}
        <section className="glass-panel" style={{ padding: 'var(--space-6)' }}>
          <h3 style={{ marginBottom: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <Clock size={20} color="var(--accent-primary)" />
            Recent Activity
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            {[
              { id: 1, text: 'Completed a 5km cycle ride to GCC Club', points: '+50 pts', date: 'Today' },
              { id: 2, text: 'Reported congestion near Maxus Mall', points: '+10 pts', date: 'Yesterday' },
              { id: 3, text: 'Took the metro to Andheri', points: '+20 pts', date: '3 days ago' },
              { id: 4, text: 'Walked 2km to Mira Road Station', points: '+30 pts', date: '1 week ago' },
            ].map(activity => (
              <div key={activity.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', paddingBottom: 'var(--space-4)', borderBottom: '1px solid var(--border-color)' }}>
                <div>
                  <p style={{ fontWeight: 500, marginBottom: 'var(--space-1)' }}>{activity.text}</p>
                  <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>{activity.date}</p>
                </div>
                <span style={{ color: 'var(--status-success)', fontWeight: 600, fontSize: 'var(--text-sm)' }}>
                  {activity.points}
                </span>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
};

export default Profile;
