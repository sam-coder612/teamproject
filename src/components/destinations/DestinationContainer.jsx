import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTravel } from '../../context/TravelContext';
import { DestinationCard } from './DestinationCard';

export const DestinationContainer = () => {
  const { destinations, toggleFavorite, isFavorite } = useTravel();
  const navigate = useNavigate();
  
  // Filters State
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [maxBudget, setMaxBudget] = useState(120000);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal State
  const [selectedDest, setSelectedDest] = useState(null);

  // Uncontrolled Search Input Ref (Required by prompt)
  const searchInputRef = useRef(null);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchInputRef.current) {
      setSearchQuery(searchInputRef.current.value.trim().toLowerCase());
    }
  };

  const handleSearchClear = () => {
    if (searchInputRef.current) {
      searchInputRef.current.value = '';
      setSearchQuery('');
    }
  };

  // Filter Logic
  const filteredDestinations = destinations.filter((dest) => {
    const matchesCategory = selectedCategory === 'All' || dest.category === selectedCategory;
    const matchesBudget = dest.budget <= maxBudget;
    const matchesSearch = dest.name.toLowerCase().includes(searchQuery) || 
                          dest.country.toLowerCase().includes(searchQuery) ||
                          dest.description.toLowerCase().includes(searchQuery);
    return matchesCategory && matchesBudget && matchesSearch;
  });

  const handleShowOnMap = (destId) => {
    setSelectedDest(null);
    navigate(`/maps?dest=${destId}`);
  };

  return (
    <div className="destination-container">
      {/* Filter Bar */}
      <form className="filter-bar" onSubmit={handleSearchSubmit}>
        {/* Uncontrolled Search Input */}
        <div className="form-group-filter">
          <label htmlFor="search-input">Search Destination</label>
          <div className="search-input-wrapper">
            <input 
              id="search-input"
              type="text" 
              ref={searchInputRef}
              placeholder="Search by name, country..."
            />
            <span className="search-icon">
              <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
          </div>
          <div style={{ marginTop: '0.25rem', display: 'flex', gap: '0.5rem' }}>
            <button type="submit" className="btn btn-teal" style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem', borderRadius: '4px' }}>
              Search
            </button>
            {searchQuery && (
              <button type="button" onClick={handleSearchClear} className="btn btn-secondary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem', borderRadius: '4px' }}>
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Category Filter */}
        <div className="form-group-filter">
          <label htmlFor="category-select">Category</label>
          <select 
            id="category-select"
            value={selectedCategory} 
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="All">All Categories</option>
            <option value="Beaches">Beaches</option>
            <option value="Mountains">Mountains</option>
            <option value="Historical Places">Historical Places</option>
            <option value="Cities">Cities</option>
            <option value="Adventure Spots">Adventure Spots</option>
          </select>
        </div>

        {/* Budget Filter */}
        <div className="form-group-filter budget-slider-wrapper">
          <div className="budget-val-labels">
            <span>Max Budget</span>
            <span style={{ color: 'var(--primary)', fontWeight: '700' }}>
              ₹{maxBudget.toLocaleString('en-IN')}
            </span>
          </div>
          <input 
            type="range" 
            className="budget-slider"
            min="10000" 
            max="120000" 
            step="5000"
            value={maxBudget}
            onChange={(e) => setMaxBudget(Number(e.target.value))}
          />
        </div>
      </form>

      {/* Destinations List */}
      {filteredDestinations.length > 0 ? (
        <div className="cards-grid">
          {filteredDestinations.map((dest, idx) => (
            <div 
              key={dest.id} 
              className="stagger-card" 
              style={{ '--delay': `${idx * 0.08}s` }}
            >
              <DestinationCard 
                destination={dest}
                isFav={isFavorite(dest.id)}
                onToggleFav={toggleFavorite}
                onExplore={(destination) => setSelectedDest(destination)}
              />
            </div>
          ))}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '3rem 1.5rem', backgroundColor: 'var(--white)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
          <svg viewBox="0 0 24 24" width="48" height="48" stroke="var(--text-light)" strokeWidth="1.5" fill="none" style={{ margin: '0 auto 1rem' }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3>No Destinations Found</h3>
          <p style={{ color: 'var(--text-muted)' }}>Try adjusting your search query, category, or budget slider filters.</p>
        </div>
      )}

      {/* Explore Destination Detail Modal */}
      {selectedDest && (
        <div className="modal-overlay" onClick={() => setSelectedDest(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Explore {selectedDest.name}</h3>
              <button className="modal-close-btn" onClick={() => setSelectedDest(null)}>&times;</button>
            </div>
            
            <div className="card-img-wrapper" style={{ aspectRatio: '16/9' }}>
              <img src={selectedDest.image} alt={selectedDest.name} className="card-img" />
              <span className="card-badge">{selectedDest.category}</span>
            </div>

            <div className="modal-body">
              <div style={{ color: 'var(--teal)', fontWeight: '700', textTransform: 'uppercase', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                {selectedDest.country}
              </div>
              <p style={{ marginBottom: '1.5rem', color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                {selectedDest.description}
              </p>
              
              <h4 style={{ marginBottom: '0.5rem', fontSize: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
                Top Attractions
              </h4>
              <ul style={{ listStyle: 'none', paddingLeft: 0, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '1.5rem' }}>
                {selectedDest.attractions.map((att, index) => (
                  <li key={index} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--teal)' }}></span>
                    {att}
                  </li>
                ))}
              </ul>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--bg-light)', padding: '1rem', borderRadius: 'var(--radius-sm)' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-light)', textTransform: 'uppercase', fontWeight: 600 }}>Estimated Budget</span>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary)' }}>
                    ₹{selectedDest.budget.toLocaleString('en-IN')}
                  </div>
                </div>
                <button className="btn btn-primary" onClick={() => handleShowOnMap(selectedDest.id)}>
                  Show on Map
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
