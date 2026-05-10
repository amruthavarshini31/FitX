import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Square, Save, Activity } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { sharepointService } from '../services/sharepoint';
import { powerAutomateService } from '../services/powerAutomate';

const WorkoutTracker = () => {
  const { currentUser } = useAuth();
  const [isActive, setIsActive] = useState(false);
  const [time, setTime] = useState(0); // in seconds
  const [category, setCategory] = useState('Chest');
  const [weight, setWeight] = useState(75); // Mock weight for demo
  const [calories, setCalories] = useState(0);

  const categories = ['Chest', 'Back', 'Legs', 'Arms', 'Shoulders', 'Abs', 'Cardio', 'Yoga'];

  // MET values for demo
  const metValues: Record<string, number> = {
    'Chest': 6.0, 'Back': 6.0, 'Legs': 6.0, 'Arms': 5.0,
    'Shoulders': 5.5, 'Abs': 4.5, 'Cardio': 8.0, 'Yoga': 3.0
  };

  useEffect(() => {
    let interval: any = null;
    if (isActive) {
      interval = setInterval(() => {
        setTime((time) => time + 1);
      }, 1000);
    } else if (!isActive && time !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, time]);

  useEffect(() => {
    // Calories = MET × Weight (kg) × Duration (hours)
    const durationHours = time / 3600;
    const currentMet = metValues[category] || 5.0;
    const calcCalories = currentMet * weight * durationHours;
    setCalories(Math.round(calcCalories));
  }, [time, category, weight]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTime(0);
    setCalories(0);
  };

  const finishWorkout = async () => {
    if (time < 60) {
      alert("Workout must be at least 1 minute to save.");
      return;
    }
    
    setIsActive(false);
    
    // Save to SharePoint mock
    await sharepointService.saveWorkout({
      userId: currentUser?.id,
      category,
      duration: Math.floor(time / 60),
      caloriesBurned: calories,
      date: new Date().toISOString()
    });
    
    // Trigger Power Automate Achievement if long workout
    if (time > 1800) {
      powerAutomateService.triggerAchievementNotification(currentUser?.id || '', "30+ Min Workout Master");
    }

    alert(`Workout Saved! You burned ${calories} kcal.`);
    resetTimer();
  };

  const formatTime = (timeInSecs: number) => {
    const getSeconds = `0${(timeInSecs % 60)}`.slice(-2);
    const minutes = `${Math.floor(timeInSecs / 60)}`;
    const getMinutes = `0${Number(minutes) % 60}`.slice(-2);
    const getHours = `0${Math.floor(timeInSecs / 3600)}`.slice(-2);
    return `${getHours}:${getMinutes}:${getSeconds}`;
  };

  return (
    <div>
      <h1 style={{ marginBottom: '2rem' }}>Workout <span className="text-neon">Terminal</span></h1>

      <div style={{ display: 'flex', gap: '2rem' }}>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel"
          style={{ flex: 1, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
        >
          <div style={{ 
            width: '250px', height: '250px', 
            borderRadius: '50%', 
            border: `4px solid ${isActive ? 'var(--primary-red)' : 'rgba(255,255,255,0.1)'}`,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            boxShadow: isActive ? 'var(--neon-red-intense)' : 'none',
            transition: 'var(--transition-smooth)',
            marginBottom: '2rem'
          }}>
            <div style={{ fontSize: '3.5rem', fontWeight: 'bold', fontFamily: 'monospace' }}>
              {formatTime(time)}
            </div>
            <div style={{ color: 'var(--primary-red)', fontWeight: 'bold', fontSize: '1.2rem', marginTop: '0.5rem' }}>
              {calories} <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>KCAL</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button 
              onClick={toggleTimer} 
              className={isActive ? "neon-btn" : "neon-btn-solid"}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              {isActive ? <><Square size={18} /> PAUSE</> : <><Play size={18} /> START</>}
            </button>
            {time > 0 && !isActive && (
              <button onClick={finishWorkout} className="neon-btn-solid" style={{ background: '#42ff8c', color: '#000', border: 'none', boxShadow: '0 0 10px rgba(66, 255, 140, 0.5)' }}>
                <Save size={18} /> FINISH & SAVE
              </button>
            )}
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-panel"
          style={{ flex: 1 }}
        >
          <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Activity className="text-neon" /> Configuration
          </h2>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Workout Category</label>
            <select 
              className="cyber-input" 
              value={category} 
              onChange={(e) => setCategory(e.target.value)}
              disabled={isActive}
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Current Weight (kg)</label>
            <input 
              type="number" 
              className="cyber-input" 
              value={weight} 
              onChange={(e) => setWeight(Number(e.target.value))}
              disabled={isActive}
            />
          </div>

          <div style={{ padding: '1rem', background: 'rgba(0,0,0,0.5)', borderRadius: '8px', borderLeft: '4px solid var(--primary-red)' }}>
            <h4 style={{ margin: '0 0 0.5rem 0' }}>Formula Info</h4>
            <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              Calories Burned = MET ({metValues[category]}) × Weight ({weight}kg) × Duration in hours.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default WorkoutTracker;
