import React from 'react';
import { NavLink } from 'react-router-dom';
import { Activity, LayoutDashboard, Utensils, Footprints, MessageSquare, UserCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const Sidebar = () => {
  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Workout', path: '/workout', icon: Activity },
    { name: 'Diet', path: '/diet', icon: Utensils },
    { name: 'Steps', path: '/steps', icon: Footprints },
    { name: 'AI Coach', path: '/ai-coach', icon: MessageSquare },
    { name: 'Profile', path: '/profile', icon: UserCircle },
  ];

  return (
    <motion.aside 
      initial={{ x: -250 }}
      animate={{ x: 0 }}
      className="glass-panel"
      style={{
        width: '250px',
        height: '100vh',
        borderRadius: '0',
        borderRight: 'var(--border-neon)',
        borderLeft: 'none',
        borderTop: 'none',
        borderBottom: 'none',
        display: 'flex',
        flexDirection: 'column',
        position: 'sticky',
        top: 0
      }}
    >
      <div style={{ padding: '2rem 1rem', textAlign: 'center', marginBottom: '2rem' }}>
        <h2 className="text-gradient" style={{ margin: 0, fontSize: '1.5rem', letterSpacing: '2px', textTransform: 'uppercase' }}>
          AI Fitness <span className="text-neon">Tracker</span>
        </h2>
      </div>

      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              padding: '1rem 1.5rem',
              borderRadius: '8px',
              color: isActive ? 'var(--primary-red)' : 'var(--text-secondary)',
              background: isActive ? 'rgba(255, 42, 42, 0.1)' : 'transparent',
              borderLeft: isActive ? '4px solid var(--primary-red)' : '4px solid transparent',
              fontWeight: isActive ? 600 : 400,
              textDecoration: 'none',
              transition: 'var(--transition-smooth)'
            })}
          >
            <item.icon size={20} />
            {item.name}
          </NavLink>
        ))}
      </nav>
      
      <div style={{ padding: '1rem', textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
        v2.0.0 Pro Edition
      </div>
    </motion.aside>
  );
};

export default Sidebar;
