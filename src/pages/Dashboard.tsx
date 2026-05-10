import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { sharepointService } from '../services/sharepoint';
import { useAuth } from '../contexts/AuthContext';
import { Activity, Flame, Droplets, Target, Award } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
  const { currentUser } = useAuth();
  const [stats, setStats] = useState({ steps: 0, caloriesBurned: 0, caloriesConsumed: 0, water: 0 });

  const chartData = [
    { name: 'Mon', calories: 2400 },
    { name: 'Tue', calories: 1398 },
    { name: 'Wed', calories: 9800 },
    { name: 'Thu', calories: 3908 },
    { name: 'Fri', calories: 4800 },
    { name: 'Sat', calories: 3800 },
    { name: 'Sun', calories: 4300 },
  ];

  useEffect(() => {
    if (currentUser) {
      sharepointService.getSteps(currentUser.id).then((data: any) => {
        setStats(prev => ({ ...prev, steps: data.today }));
      });
      sharepointService.getCalories(currentUser.id).then((data: any) => {
        setStats(prev => ({ ...prev, caloriesBurned: data.total }));
      });
      sharepointService.getWater(currentUser.id).then((data: any) => {
        setStats(prev => ({ ...prev, water: data.glasses }));
      });
    }
  }, [currentUser]);

  const StatCard = ({ title, value, icon: Icon, color, delay }: any) => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="glass-panel"
      style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1 }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '1rem' }}>{title}</h3>
        <div style={{ background: `rgba(${color}, 0.1)`, padding: '0.5rem', borderRadius: '8px' }}>
          <Icon size={24} style={{ color: `rgb(${color})` }} />
        </div>
      </div>
      <div style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>{value}</div>
      <div className="progress-container">
        <div className="progress-bar" style={{ width: '75%', background: `rgb(${color})`, boxShadow: `0 0 10px rgba(${color}, 0.5)` }}></div>
      </div>
    </motion.div>
  );

  const handleAddWater = async () => {
    if (currentUser) {
      await sharepointService.saveWater(currentUser.id, stats.water + 1);
      setStats(prev => ({ ...prev, water: prev.water + 1 }));
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '2.5rem' }}>Welcome Back, <span className="text-gradient">{currentUser?.name}</span></h1>
          <p style={{ color: 'var(--text-secondary)', margin: '0.5rem 0 0 0' }}>Here's your performance overview today.</p>
        </div>
        <button className="neon-btn">Log Workout</button>
      </div>

      <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '2rem' }}>
        <StatCard title="Daily Steps" value={stats.steps.toLocaleString()} icon={Target} color="255, 42, 42" delay={0.1} />
        <StatCard title="Calories Burned" value={`${stats.caloriesBurned} kcal`} icon={Flame} color="255, 140, 42" delay={0.2} />
        <StatCard title="Calories Consumed" value="1,850 kcal" icon={Activity} color="42, 255, 140" delay={0.3} />
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-panel"
          style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1, position: 'relative' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '1rem' }}>Water Intake</h3>
            <div style={{ background: `rgba(42, 140, 255, 0.1)`, padding: '0.5rem', borderRadius: '8px' }}>
              <Droplets size={24} style={{ color: `rgb(42, 140, 255)` }} />
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>{stats.water} <span style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>glasses</span></div>
            <button onClick={handleAddWater} className="neon-btn-solid" style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}>+1 Glass</button>
          </div>
          <div className="progress-container">
            <div className="progress-bar" style={{ width: `${Math.min(100, (stats.water / 8) * 100)}%`, background: `rgb(42, 140, 255)`, boxShadow: `0 0 10px rgba(42, 140, 255, 0.5)` }}></div>
          </div>
        </motion.div>
      </div>

      <div style={{ display: 'flex', gap: '1.5rem' }}>
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-panel" 
          style={{ flex: 2 }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ margin: 0 }}>Weekly Activity</h2>
            <select className="cyber-input" style={{ width: 'auto', margin: 0, padding: '0.5rem' }}>
              <option>Calories Burned</option>
              <option>Steps</option>
            </select>
          </div>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorCalories" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ff2a2a" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#ff2a2a" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" />
                <YAxis stroke="rgba(255,255,255,0.5)" />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,42,42,0.3)', borderRadius: '8px' }} 
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="calories" stroke="#ff2a2a" fillOpacity={1} fill="url(#colorCalories)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="glass-panel" 
          style={{ flex: 1, display: 'flex', flexDirection: 'column' }}
        >
          <h2 style={{ margin: '0 0 1.5rem 0' }}>AI Insights</h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1 }}>
            <div style={{ padding: '1rem', background: 'rgba(255, 42, 42, 0.1)', borderLeft: '4px solid var(--primary-red)', borderRadius: '4px' }}>
              <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--primary-red)' }}>Recovery Required</h4>
              <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Your HRV indicates high fatigue. Consider Yoga or Light Cardio today instead of heavy lifting.</p>
            </div>
            <div style={{ padding: '1rem', background: 'rgba(255, 255, 255, 0.05)', borderLeft: '4px solid #42ff8c', borderRadius: '4px' }}>
              <h4 style={{ margin: '0 0 0.5rem 0', color: '#42ff8c' }}>Diet Check</h4>
              <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>You are 30g short on your daily protein goal. Suggesting a whey shake.</p>
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            <Award size={32} color="#ffd700" />
            <div>
              <div style={{ fontWeight: 'bold' }}>Current Streak: 14 Days</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Top 5% of athletes this week!</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
