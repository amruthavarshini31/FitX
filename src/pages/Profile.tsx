import React from 'react';
import { motion } from 'framer-motion';
import { Settings, User, LogOut, Award } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Profile = () => {
  const { currentUser, logout } = useAuth();

  return (
    <div>
      <h1 style={{ marginBottom: '2rem' }}>Athlete <span className="text-neon">Profile</span></h1>

      <div style={{ display: 'flex', gap: '2rem' }}>
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-panel"
          style={{ flex: 1, textAlign: 'center' }}
        >
          <div style={{ 
            width: '120px', height: '120px', borderRadius: '50%', 
            background: 'linear-gradient(45deg, #222, #444)', 
            border: '4px solid var(--primary-red)',
            margin: '0 auto 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '3rem', fontWeight: 'bold',
            boxShadow: 'var(--neon-red)'
          }}>
            {currentUser?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <h2 style={{ margin: '0 0 0.5rem 0' }}>{currentUser?.name}</h2>
          <div style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>{currentUser?.email}</div>
          
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '2rem' }}>
            <div style={{ background: 'rgba(0,0,0,0.5)', padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Level</div>
              <div style={{ fontWeight: 'bold', color: 'var(--primary-red)' }}>12</div>
            </div>
            <div style={{ background: 'rgba(0,0,0,0.5)', padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>XP</div>
              <div style={{ fontWeight: 'bold', color: '#42ff8c' }}>4,520</div>
            </div>
          </div>

          <button onClick={logout} className="neon-btn" style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}>
            <LogOut size={18} /> INITIATE LOGOUT
          </button>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-panel"
          style={{ flex: 2 }}
        >
          <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Settings className="text-neon" /> Configuration</h2>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Height (cm)</label>
              <input type="number" className="cyber-input" defaultValue={180} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Weight (kg)</label>
              <input type="number" className="cyber-input" defaultValue={75} />
            </div>
          </div>

          <h3 style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>Goals</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Daily Steps</label>
              <input type="number" className="cyber-input" defaultValue={10000} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Daily Calories (KCAL)</label>
              <input type="number" className="cyber-input" defaultValue={2500} />
            </div>
          </div>

          <h3 style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>Achievements</h3>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ background: 'rgba(255, 215, 0, 0.1)', border: '1px solid rgba(255, 215, 0, 0.3)', padding: '1rem', borderRadius: '8px', textAlign: 'center', width: '100px' }}>
              <Award color="#ffd700" size={32} style={{ margin: '0 auto 0.5rem' }} />
              <div style={{ fontSize: '0.7rem' }}>7 Day Streak</div>
            </div>
            <div style={{ background: 'rgba(255, 42, 42, 0.1)', border: '1px solid rgba(255, 42, 42, 0.3)', padding: '1rem', borderRadius: '8px', textAlign: 'center', width: '100px' }}>
              <Award color="#ff2a2a" size={32} style={{ margin: '0 auto 0.5rem' }} />
              <div style={{ fontSize: '0.7rem' }}>10k Steps</div>
            </div>
          </div>
          
          <button className="neon-btn-solid" style={{ marginTop: '2rem' }}>SAVE CONFIGURATION</button>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
