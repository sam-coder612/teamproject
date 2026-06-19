import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { TravelProvider } from './context/TravelContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { Destinations } from './pages/Destinations';
import { TripPlanner } from './pages/TripPlanner';
import { BudgetCalculator } from './pages/BudgetCalculator';
import { Hotels } from './pages/Hotels';
import { Maps } from './pages/Maps';
import { Contact } from './pages/Contact';
import './App.css';

function App() {
  return (
    <ErrorBoundary>
      <TravelProvider>
        <BrowserRouter>
          <div className="app-container">
            {/* Global Navigation Bar */}
            <Navbar />

            {/* Main Routing Container */}
            <main className="main-content">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/destinations" element={<Destinations />} />
                <Route path="/trip-planner" element={<TripPlanner />} />
                <Route path="/budget-calculator" element={<BudgetCalculator />} />
                <Route path="/hotels" element={<Hotels />} />
                <Route path="/maps" element={<Maps />} />
                <Route path="/contact" element={<Contact />} />
                {/* Fallback route - redirects to Home */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>

            {/* Standard Footer */}
            <footer style={{
              backgroundColor: 'var(--text-main)',
              color: 'var(--white)',
              padding: '2.5rem 1.5rem',
              textAlign: 'center',
              borderTop: '1px solid var(--border-color)',
              fontSize: '0.9rem'
            }}>
              <div style={{
                maxWidth: '1200px',
                margin: '0 auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div style={{ fontWeight: 800, fontFamily: 'var(--font-heading)', fontSize: '1.25rem', color: 'var(--teal)' }}>
                  Travel<span style={{ color: 'var(--white)' }}>Wise</span>
                </div>
                <p style={{ color: 'var(--text-light)', maxWidth: '400px' }}>
                  Smart tourism planning tools and hotel booking portal for modern travelers. Plan Smarter, Travel Better.
                </p>
                <div style={{
                  borderTop: '1px solid #334155',
                  width: '100%',
                  paddingTop: '1rem',
                  marginTop: '0.5rem',
                  color: 'var(--text-light)',
                  fontSize: '0.8rem'
                }}>
                  &copy; {new Date().getFullYear()} TravelWise Inc. All rights reserved.
                </div>
              </div>
            </footer>
          </div>
        </BrowserRouter>
      </TravelProvider>
    </ErrorBoundary>
  );
}

export default App;
