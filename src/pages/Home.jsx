import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTravel } from '../context/TravelContext';
import { DestinationCard } from '../components/destinations/DestinationCard';
import { MountainIntro } from '../components/MountainIntro';

export const Home = () => {
  const navigate = useNavigate();
  const { destinations, toggleFavorite, isFavorite } = useTravel();

  // Get a few popular destinations (Goa, Bali, Paris)
  const popularDestinations = destinations.filter(d => 
    ['goa', 'bali', 'paris'].includes(d.id)
  );

  return (
    <div className="home-page">
      {/* Scroll-Driven Mountain Gateway Intro */}
      <MountainIntro />

      {/* Scroll Spacer to push homepage content down, allowing scroll timeline seek */}
      <div className="home-scroll-spacer" style={{ height: '300vh' }}></div>

      {/* Statistics Cards */}
      <section className="container" style={{ position: 'relative', zIndex: 10, marginTop: '2rem' }}>
        <div className="stats-container">
          <div className="stats-card" style={{ animationDelay: '0.1s' }}>
            <div className="stats-number">100+</div>
            <div className="stats-label">Destinations Covered</div>
          </div>
          <div className="stats-card" style={{ animationDelay: '0.2s' }}>
            <div className="stats-number">5,000+</div>
            <div className="stats-label">Happy Travelers</div>
          </div>
          <div className="stats-card" style={{ animationDelay: '0.3s' }}>
            <div className="stats-number">4.9 ★</div>
            <div className="stats-label">Average User Rating</div>
          </div>
        </div>
      </section>

      {/* Popular Destinations Section */}
      <section className="section container">
        <h2 className="section-title">Popular Destinations</h2>
        <p className="section-subtitle">Handpicked locations that travelers rave about</p>
        
        <div className="cards-grid">
          {popularDestinations.map((dest, idx) => (
            <div 
              key={dest.id} 
              className="stagger-card" 
              style={{ '--delay': `${idx * 0.15}s` }}
            >
              <DestinationCard 
                destination={dest}
                isFav={isFavorite(dest.id)}
                onToggleFav={toggleFavorite}
                onExplore={() => navigate(`/destinations`)}
              />
            </div>
          ))}
        </div>
        
        <div style={{ textAlign: 'center', marginTop: '3rem' }}>
          <button className="btn btn-primary" onClick={() => navigate('/destinations')}>
            View All Destinations
          </button>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="section section-bg">
        <div className="container">
          <h2 className="section-title">Why Choose TravelWise?</h2>
          <p className="section-subtitle">We offer the smartest travel planning features to make your trip unforgettable</p>
          
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <svg viewBox="0 0 24 24" width="28" height="28" stroke="currentColor" strokeWidth="2" fill="none">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              </div>
              <h3 className="feature-title">Smart Route Maps</h3>
              <p className="feature-desc">Visualize tourist attractions, popular spots, and nearby hotels on an interactive map system.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <svg viewBox="0 0 24 24" width="28" height="28" stroke="currentColor" strokeWidth="2" fill="none">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="feature-title">Budget Optimizer</h3>
              <p className="feature-desc">Calculate your expenses for transportation, accommodation, and food to avoid overspending.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <svg viewBox="0 0 24 24" width="28" height="28" stroke="currentColor" strokeWidth="2" fill="none">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="feature-title">Intuitive Trip Planner</h3>
              <p className="feature-desc">Generate detailed itineraries and save planned trips to LocalStorage for quick access.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
