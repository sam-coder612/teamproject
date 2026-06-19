import React, { useState, useEffect } from 'react';
import { HotelContainer } from '../components/hotels/HotelContainer';

const SkeletonCard = () => (
  <div className="skeleton-card">
    <div className="skeleton-shimmer skeleton-img"></div>
    <div style={{ padding: '1rem 0 0.5rem' }}>
      <div className="skeleton-shimmer skeleton-title" style={{ marginBottom: '1rem' }}></div>
      <div className="skeleton-shimmer skeleton-text" style={{ marginBottom: '0.5rem' }}></div>
      <div className="skeleton-shimmer skeleton-text" style={{ marginBottom: '0.5rem' }}></div>
      <div className="skeleton-shimmer skeleton-text-short" style={{ marginTop: '1rem' }}></div>
    </div>
  </div>
);

export const Hotels = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 700); // 700ms simulated network delay
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="hotels-page section page-enter">
      <div className="container">
        <h2 className="section-title">Hotel Finder & Booking</h2>
        <p className="section-subtitle">Find cozy rooms and luxury resorts tailored to your travel destinations</p>
        
        {isLoading ? (
          <div className="cards-grid" style={{ marginTop: '2.5rem' }}>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        ) : (
          <div className="page-enter">
            <HotelContainer />
          </div>
        )}
      </div>
    </div>
  );
};
