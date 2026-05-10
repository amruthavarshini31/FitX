import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Footprints, Map, Flame, TrendingUp } from 'lucide-react';
import { sharepointService } from '../services/sharepoint';
import { useAuth } from '../contexts/AuthContext';

const StepTracker = () => {
  const { currentUser } = useAuth();
  const [steps, setSteps] = useState(0);
  const goalSteps = 10000;
  
  useEffect(() => {
    if (currentUser) {
      sharepointService.getSteps(currentUser.id).then((data: any) => {
        setSteps(data.today);
      });
    }
  }, [currentUser]);

  const percentage = Math.min(100, (steps / goalSteps) * 100);
  
  // Calculate mock stats based on steps
  const distanceKm = (steps * 0.000762).toFixed(2);
  const caloriesBurned = Math.round(steps * 0.04);

  return (
    <div>
      <h1 style={{ marginBottom: '2rem' }}>Movement <span className="text-neon">Tracking</span></h1>

      <div style={{ display: 'flex', gap: '2rem' }}>
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-panel"
          style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
        >
          <div style={{ position: 'relative', width: '250px', height: '250px' }}>
            {/* SVG Ring */}
            <svg width="250" height="250" viewBox="0 0 250 250">
              <circle 
                cx="125" cy="125" r="110" 
                fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="15"
              />
              <circle 
                cx="125" cy="125" r="110" 
                fill="none" stroke="var(--primary-red)" strokeWidth="15"
                strokeDasharray="691" 
                strokeDashoffset={691 - (691 * percentage) / 100}
                strokeLinecap="round"
                style={{ transition: 'stroke-dashoffset 1s ease-in-out', filter: 'drop-shadow(0 0 8px rgba(255,42,42,0.5))' }}
                transform="rotate(-90 125 125)"
              />
            </svg>
            
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
              <Footprints size={32} className="text-neon" style={{ marginBottom: '0.5rem' }} />
              <div style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>{steps.toLocaleString()}</div>
              <div style={{ color: 'var(--text-secondary)' }}>/ {goalSteps.toLocaleString()}</div>
            </div>
          </div>
          
          <h3 style={{ marginTop: '2rem', textAlign: 'center' }}>Daily Progress: {percentage.toFixed(1)}%</h3>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-panel"
          style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
        >
          <h2>Session Statistics</h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div style={{ background: 'rgba(0,0,0,0.4)', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <Map className="text-neon" style={{ marginBottom: '1rem' }} />
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Distance</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{distanceKm} <span style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>km</span></div>
            </div>
            
            <div style={{ background: 'rgba(0,0,0,0.4)', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <Flame style={{ color: '#ff8c2a', marginBottom: '1rem' }} />
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Calories</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{caloriesBurned} <span style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>kcal</span></div>
            </div>
          </div>
          
          <div style={{ background: 'rgba(255, 42, 42, 0.1)', padding: '1.5rem', borderRadius: '12px', borderLeft: '4px solid var(--primary-red)', marginTop: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <TrendingUp className="text-neon" size={20} />
              <h4 style={{ margin: 0, color: 'var(--primary-red)' }}>Google Fit Sync Active</h4>
            </div>
            <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Your step data is automatically synchronizing with the central API structure.</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default StepTracker;
