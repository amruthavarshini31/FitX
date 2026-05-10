import React, { createContext, useContext, useState, useEffect } from 'react';

const API_URL = 'http://localhost:5000/api/auth';

type User = {
  id: string;
  name: string;
  email: string;
};

type AuthContextType = {
  currentUser: User | null;
  loading: boolean;
  login: (email: string, password?: string) => Promise<boolean>;
  signup: (email: string, password?: string, name?: string) => Promise<boolean>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    if (token && user) {
      setCurrentUser(JSON.parse(user));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password = 'password123') => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Login failed');
      
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setCurrentUser(data.user);
      return true;
    } catch (err: any) {
      console.error('Login failed', err);
      alert(`Login failed: ${err.message}`);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (email: string, password = 'password123', name = 'Athlete') => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Signup failed');
      
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setCurrentUser(data.user);
      return true;
    } catch (err: any) {
      console.error('Signup failed', err);
      alert(`Signup failed: ${err.message}`);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setCurrentUser(null);
    setLoading(false);
  };

  return (
    <AuthContext.Provider value={{ currentUser, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
