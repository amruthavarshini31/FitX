import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, User, Cpu } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const AICoach = () => {
  const { currentUser } = useAuth();
  const [messages, setMessages] = useState([
    { id: 1, sender: 'ai', text: `Hello ${currentUser?.name || 'Athlete'}, I am your AI Fitness Tracker Coach. How can I optimize your training today?` }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { id: Date.now(), sender: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      // Import sharepointService if not already imported at top
      const { sharepointService } = await import('../services/sharepoint');
      const res = await sharepointService.chat(userMessage.text);
      
      const aiMsg = { id: Date.now() + 1, sender: 'ai', text: res.reply };
      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      const errorMsg = { id: Date.now() + 1, sender: 'ai', text: "Error connecting to AI core. Make sure your Express backend is running and Gemini API key is configured." };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 100px)' }}>
      <h1 style={{ marginBottom: '1rem' }}>AI <span className="text-neon">Coach</span></h1>
      
      <div className="glass-panel" style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '0', overflow: 'hidden' }}>
        <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#ff2a2a', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 15px rgba(255,42,42,0.5)' }}>
            <Cpu color="#fff" />
          </div>
          <div>
            <div style={{ fontWeight: 'bold' }}>AI Fitness Tracker Terminal</div>
            <div style={{ fontSize: '0.8rem', color: '#42ff8c' }}>● Online</div>
          </div>
        </div>
        
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {messages.map((msg) => (
            <motion.div 
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ 
                display: 'flex', 
                gap: '1rem',
                alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                flexDirection: msg.sender === 'user' ? 'row-reverse' : 'row',
                maxWidth: '80%'
              }}
            >
              <div style={{ 
                width: '32px', height: '32px', borderRadius: '50%', 
                background: msg.sender === 'user' ? '#333' : 'var(--primary-red)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
              }}>
                {msg.sender === 'user' ? <User size={16} /> : <Cpu size={16} />}
              </div>
              <div style={{ 
                background: msg.sender === 'user' ? 'rgba(255,255,255,0.1)' : 'rgba(255,42,42,0.1)',
                padding: '1rem',
                borderRadius: '12px',
                border: msg.sender === 'ai' ? '1px solid rgba(255,42,42,0.3)' : '1px solid rgba(255,255,255,0.1)',
                lineHeight: '1.5',
                borderTopRightRadius: msg.sender === 'user' ? '0' : '12px',
                borderTopLeftRadius: msg.sender === 'ai' ? '0' : '12px',
              }}>
                {msg.text}
              </div>
            </motion.div>
          ))}
          {isTyping && (
            <div style={{ display: 'flex', gap: '1rem', alignSelf: 'flex-start', maxWidth: '80%' }}>
               <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--primary-red)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Cpu size={16} />
              </div>
              <div style={{ background: 'rgba(255,42,42,0.1)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(255,42,42,0.3)', display: 'flex', gap: '0.5rem', alignItems: 'center', borderTopLeftRadius: '0' }}>
                <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1 }} style={{ width: '8px', height: '8px', background: 'var(--primary-red)', borderRadius: '50%' }} />
                <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} style={{ width: '8px', height: '8px', background: 'var(--primary-red)', borderRadius: '50%' }} />
                <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} style={{ width: '8px', height: '8px', background: 'var(--primary-red)', borderRadius: '50%' }} />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        
        <div style={{ padding: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', gap: '1rem' }}>
          <input 
            type="text" 
            className="cyber-input" 
            style={{ margin: 0, flex: 1 }} 
            placeholder="Ask AI Fitness Tracker..." 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          />
          <button className="neon-btn-solid" onClick={handleSend} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Send size={18} /> SEND
          </button>
        </div>
      </div>
    </div>
  );
};

export default AICoach;
