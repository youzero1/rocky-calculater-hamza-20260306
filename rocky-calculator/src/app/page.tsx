'use client';

import { useState, useEffect } from 'react';
import Calculator from '@/components/Calculator';
import CalculationHistory from '@/components/CalculationHistory';
import { ICalculation } from '@/entities/Calculation';

export default function Home() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [history, setHistory] = useState<ICalculation[]>([]);
  const [toast, setToast] = useState({ show: false, message: '' });

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await fetch('/api/calculations');
      if (res.ok) {
        const data = await res.json();
        setHistory(data);
      }
    } catch (err) {
      console.error('Failed to fetch history:', err);
    }
  };

  const saveCalculation = async (expression: string, result: string) => {
    try {
      const res = await fetch('/api/calculations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ expression, result }),
      });
      if (res.ok) {
        const saved = await res.json();
        setHistory((prev) => [saved, ...prev]);
      }
    } catch (err) {
      console.error('Failed to save calculation:', err);
    }
  };

  const clearHistory = async () => {
    try {
      await fetch('/api/calculations', { method: 'DELETE' });
      setHistory([]);
    } catch (err) {
      console.error('Failed to clear history:', err);
    }
  };

  const toggleTheme = () => {
    setTheme((t) => (t === 'dark' ? 'light' : 'dark'));
  };

  const showToast = (message: string) => {
    setToast({ show: true, message });
    setTimeout(() => setToast({ show: false, message: '' }), 2500);
  };

  return (
    <div className={`app-container ${theme}`}>
      <header className="app-header">
        <div>
          <h1 className="app-title">🧮 Rocky Calculator</h1>
          <p className="app-subtitle">
            <span className="pulse-dot" style={{ marginRight: '0.4rem' }}></span>
            Social-powered arithmetic
          </p>
        </div>
        <button className="theme-toggle" onClick={toggleTheme}>
          {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
        </button>
      </header>

      <main className="main-content">
        <div className="calculator-card">
          <Calculator onCalculate={saveCalculation} onToast={showToast} />
        </div>
        <div className="history-card">
          <CalculationHistory
            history={history}
            onClear={clearHistory}
            onToast={showToast}
          />
        </div>
      </main>

      <footer className="app-footer">
        Made with ❤️ by <span className="footer-brand">Rocky Calculator</span> &mdash;
        Crunching numbers, socially.
      </footer>

      <div className={`toast ${toast.show ? 'show' : ''}`}>{toast.message}</div>
    </div>
  );
}
