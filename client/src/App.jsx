import React, { useState } from 'react';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';

export default function App() {
  const [view, setView] = useState('landing');

  return (
    <>
      {view === 'landing' ? (
        <LandingPage setView={setView} />
      ) : (
        <Dashboard setView={setView} />
      )}
    </>
  );
}
