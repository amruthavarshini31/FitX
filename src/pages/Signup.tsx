import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { Activity } from 'lucide-react';
import { motion } from 'framer-motion';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signup, loading, currentUser } = useAuth();
  const navigate = useNavigate();

  if (currentUser) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await signup(email, password, name);
    if (success) navigate('/dashboard');
  };

  return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-dark)' }}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-panel" 
        style={{ width: '400px', padding: '3rem', textAlign: 'center' }}
      >
        <Activity size={48} className="text-neon animate-pulse-glow" style={{ marginBottom: '1rem', borderRadius: '50%' }} />
        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>JOIN <span className="text-neon">AI FITNESS TRACKER</span></h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Create your athlete profile.</p>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <input 
            type="text" 
            placeholder="Athlete Name" 
            className="cyber-input" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input 
            type="email" 
            placeholder="Email Address" 
            className="cyber-input" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input 
            type="password" 
            placeholder="Create Password" 
            className="cyber-input" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          
          <button type="submit" className="neon-btn-solid" style={{ marginTop: '1rem' }} disabled={loading}>
            {loading ? 'Initializing...' : 'Create Profile'}
          </button>
        </form>
        
        <div style={{ marginTop: '2rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          Already registered? <Link to="/login" className="text-neon" style={{ fontWeight: 'bold' }}>Access terminal</Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;
