import React, { useState, useEffect } from 'react';
import { DestinationContainer } from '../components/destinations/DestinationContainer';

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

export const Destinations = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 700); // 700ms simulated network fetch delay
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="destinations-page section page-enter">
      <div className="container">
        <h2 className="section-title">Explore Destinations</h2>
        <p className="section-subtitle">Discover incredible places and filter by your specific preferences</p>
        
        {isLoading ? (
          <div className="cards-grid" style={{ marginTop: '2.5rem' }}>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        ) : (
          <div className="page-enter">
            <DestinationContainer />
          </div>
        )}
      </div>
    </div>
  );
};
