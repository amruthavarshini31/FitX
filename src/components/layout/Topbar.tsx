import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Bell, Search, LogOut } from 'lucide-react';

const Topbar = () => {
  const { currentUser, logout } = useAuth();

  return (
    <header className="glass-panel" style={{
      borderRadius: '0',
      borderBottom: 'var(--border-glass)',
      borderTop: 'none',
      borderLeft: 'none',
      borderRight: 'none',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '1rem 2rem',
      position: 'sticky',
      top: 0,
      zIndex: 10
    }}>
      <div style={{ display: 'flex', alignItems: 'center', width: '300px' }}>
        <div style={{ position: 'relative', width: '100%' }}>
          <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
          <input 
            type="text" 
            placeholder="Search exercises, food..." 
            className="cyber-input"
            style={{ margin: 0, paddingLeft: '2.5rem', borderRadius: '20px' }}
          />
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <div style={{ position: 'relative', cursor: 'pointer' }}>
          <Bell size={20} color="var(--text-secondary)" />
          <span style={{
            position: 'absolute',
            top: '-5px',
            right: '-5px',
            background: 'var(--primary-red)',
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            boxShadow: 'var(--neon-red)'
          }}></span>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>{currentUser?.name || 'User'}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--primary-red)' }}>Level 12 Athlete</div>
          </div>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: 'linear-gradient(45deg, #111, #333)',
            border: '2px solid var(--primary-red)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--neon-red)'
          }}>
            {currentUser?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
        </div>

        <button 
          onClick={logout}
          style={{ background: 'transparent', color: 'var(--text-secondary)', cursor: 'pointer' }}
          title="Logout"
        >
          <LogOut size={20} />
        </button>
      </div>
    </header>
  );
};

export default Topbar;
