import React from 'react';

export const HotelCard = ({ hotel, onBook }) => {
  const { name, location, rating, pricePerNight, image } = hotel;

  return (
    <article className="card-item">
      <div className="card-img-wrapper">
        <img src={image} alt={name} className="card-img" loading="lazy" />
        <span className="card-badge" style={{ backgroundColor: 'var(--primary)' }}>
          {rating} ★
        </span>
      </div>

      <div className="card-body">
        <span className="card-meta" style={{ color: 'var(--primary)' }}>{location}</span>
        <h3 className="card-name">{name}</h3>
        
        <div className="card-footer" style={{ marginTop: 'auto' }}>
          <div className="card-price-group">
            <div className="card-price-label">Price Per Night</div>
            <div className="card-price">
              ₹{pricePerNight.toLocaleString('en-IN')}
              <span>/night</span>
            </div>
          </div>
          <button className="btn btn-primary" onClick={() => onBook(hotel)}>
            Book Now
          </button>
        </div>
      </div>
    </article>
  );
};
