import React from 'react';

export const DestinationCard = ({ destination, isFav, onToggleFav, onExplore }) => {
  const { id, name, country, category, description, budget, image } = destination;

  return (
    <article className="card-item">
      <div className="card-img-wrapper">
        <img src={image} alt={name} className="card-img" loading="lazy" />
        <span className="card-badge">{category}</span>
        <button 
          className={`card-fav-btn ${isFav ? 'active' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            onToggleFav(id);
          }}
          aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}
        >
          <svg viewBox="0 0 24 24" width="20" height="20" fill={isFav ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
      </div>

      <div className="card-body">
        <span className="card-meta">{country}</span>
        <h3 className="card-name">{name}</h3>
        <p className="card-desc">{description}</p>
        
        <div className="card-footer">
          <div className="card-price-group">
            <div className="card-price-label">Est. Budget</div>
            <div className="card-price">₹{budget.toLocaleString('en-IN')}</div>
          </div>
          <button className="btn btn-teal" onClick={() => onExplore(destination)}>
            Explore
          </button>
        </div>
      </div>
    </article>
  );
};
