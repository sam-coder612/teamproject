import React, { useState } from 'react';
import { useTravel } from '../../context/TravelContext';
import { HotelCard } from './HotelCard';

export const HotelContainer = () => {
  const { hotels } = useTravel();
  
  // Search & Filter States
  const [searchHotel, setSearchHotel] = useState('');
  const [minRating, setMinRating] = useState(0);
  const [maxPrice, setMaxPrice] = useState(15000);

  // Booking Flow States
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingDetails, setBookingDetails] = useState(null);

  // Controlled Form State (Required by prompt)
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);
  const [roomType, setRoomType] = useState('Standard');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [formErrors, setFormErrors] = useState({});

  // Filter Hotels
  const filteredHotels = hotels.filter((hotel) => {
    const matchesSearch = hotel.name.toLowerCase().includes(searchHotel.toLowerCase()) ||
                          hotel.location.toLowerCase().includes(searchHotel.toLowerCase());
    const matchesRating = hotel.rating >= minRating;
    const matchesPrice = hotel.pricePerNight <= maxPrice;
    return matchesSearch && matchesRating && matchesPrice;
  });

  const handleOpenBooking = (hotel) => {
    setSelectedHotel(hotel);
    // Reset form states
    setCheckIn('');
    setCheckOut('');
    setGuests(1);
    setRoomType('Standard');
    setFullName('');
    setPhone('');
    setFormErrors({});
  };

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    const errors = {};

    if (!fullName.trim()) errors.fullName = 'Full name is required';
    if (!phone.trim()) {
      errors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(phone.trim().replace(/[- ]/g, ''))) {
      errors.phone = 'Please enter a valid 10-digit phone number';
    }
    if (!checkIn) errors.checkIn = 'Check-in date is required';
    if (!checkOut) {
      errors.checkOut = 'Check-out date is required';
    } else if (checkIn && new Date(checkOut) <= new Date(checkIn)) {
      errors.checkOut = 'Check-out must be after check-in';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    // Success! Show booking confirmation card
    const details = {
      hotelName: selectedHotel.name,
      location: selectedHotel.location,
      fullName,
      checkIn,
      checkOut,
      guests,
      roomType,
      totalCost: calculateTotalCost(selectedHotel.pricePerNight, checkIn, checkOut),
      bookingId: `BK-${Math.floor(100000 + Math.random() * 900000)}`
    };

    setBookingDetails(details);
    setBookingSuccess(true);
    setSelectedHotel(null);
  };

  const calculateTotalCost = (price, start, end) => {
    if (!start || !end) return price;
    const startDate = new Date(start);
    const endDate = new Date(end);
    const timeDiff = endDate.getTime() - startDate.getTime();
    const days = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return (days > 0 ? days : 1) * price;
  };

  const closeBookingModal = () => {
    setSelectedHotel(null);
  };

  const closeSuccessModal = () => {
    setBookingSuccess(false);
    setBookingDetails(null);
  };

  return (
    <div className="hotel-container">
      {/* Filters bar */}
      <div className="filter-bar">
        {/* Controlled Search input */}
        <div className="form-group-filter">
          <label htmlFor="hotel-search">Search Hotel / City</label>
          <div className="search-input-wrapper">
            <input 
              id="hotel-search"
              type="text" 
              placeholder="e.g. resort, Goa, Paris" 
              value={searchHotel}
              onChange={(e) => setSearchHotel(e.target.value)}
            />
            <span className="search-icon">
              <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
          </div>
        </div>

        {/* Rating Filter */}
        <div className="form-group-filter">
          <label htmlFor="rating-select">Minimum Rating</label>
          <select 
            id="rating-select"
            value={minRating} 
            onChange={(e) => setMinRating(Number(e.target.value))}
          >
            <option value="0">All Ratings</option>
            <option value="4.5">4.5 ★ & Above</option>
            <option value="4.7">4.7 ★ & Above</option>
            <option value="4.8">4.8 ★ & Above</option>
          </select>
        </div>

        {/* Price Slider */}
        <div className="form-group-filter budget-slider-wrapper">
          <div className="budget-val-labels">
            <span>Max Price / Night</span>
            <span style={{ color: 'var(--primary)', fontWeight: '700' }}>
              ₹{maxPrice.toLocaleString('en-IN')}
            </span>
          </div>
          <input 
            type="range" 
            className="budget-slider"
            min="2000" 
            max="15000" 
            step="500"
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
          />
        </div>
      </div>

      {/* Hotel grid */}
      {filteredHotels.length > 0 ? (
        <div className="cards-grid">
          {filteredHotels.map((hotel, idx) => (
            <div 
              key={hotel.id} 
              className="stagger-card" 
              style={{ '--delay': `${idx * 0.08}s` }}
            >
              <HotelCard 
                hotel={hotel}
                onBook={handleOpenBooking}
              />
            </div>
          ))}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '3rem 1.5rem', backgroundColor: 'var(--white)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
          <svg viewBox="0 0 24 24" width="48" height="48" stroke="var(--text-light)" strokeWidth="1.5" fill="none" style={{ margin: '0 auto 1rem' }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          <h3>No Hotels Found</h3>
          <p style={{ color: 'var(--text-muted)' }}>Try adjusting your search query, rating minimum, or price sliders.</p>
        </div>
      )}

      {/* Controlled Hotel Booking Form Modal */}
      {selectedHotel && (
        <div className="modal-overlay" onClick={closeBookingModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Book Accommodation</h3>
              <button className="modal-close-btn" onClick={closeBookingModal}>&times;</button>
            </div>
            
            <div className="modal-body">
              <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
                <img src={selectedHotel.image} alt={selectedHotel.name} style={{ width: '80px', height: '60px', objectFit: 'cover', borderRadius: '4px' }} />
                <div>
                  <h4 style={{ fontSize: '1.1rem' }}>{selectedHotel.name}</h4>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{selectedHotel.location}</div>
                  <div style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--primary)' }}>₹{selectedHotel.pricePerNight.toLocaleString('en-IN')} / night</div>
                </div>
              </div>

              <form className="planner-form" onSubmit={handleBookingSubmit}>
                <div className="form-group">
                  <label htmlFor="booking-name">Full Name</label>
                  <input 
                    id="booking-name"
                    type="text" 
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your full name"
                  />
                  {formErrors.fullName && <div className="form-error">{formErrors.fullName}</div>}
                </div>

                <div className="form-group">
                  <label htmlFor="booking-phone">Phone Number</label>
                  <input 
                    id="booking-phone"
                    type="tel" 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="10-digit mobile number"
                  />
                  {formErrors.phone && <div className="form-error">{formErrors.phone}</div>}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label htmlFor="booking-checkin">Check-In</label>
                    <input 
                      id="booking-checkin"
                      type="date" 
                      value={checkIn}
                      onChange={(e) => setCheckIn(e.target.value)}
                    />
                    {formErrors.checkIn && <div className="form-error">{formErrors.checkIn}</div>}
                  </div>
                  <div className="form-group">
                    <label htmlFor="booking-checkout">Check-Out</label>
                    <input 
                      id="booking-checkout"
                      type="date" 
                      value={checkOut}
                      onChange={(e) => setCheckOut(e.target.value)}
                    />
                    {formErrors.checkOut && <div className="form-error">{formErrors.checkOut}</div>}
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label htmlFor="booking-guests">Number of Guests</label>
                    <input 
                      id="booking-guests"
                      type="number" 
                      min="1" 
                      max="10"
                      value={guests}
                      onChange={(e) => setGuests(Number(e.target.value))}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="booking-roomtype">Room Type</label>
                    <select 
                      id="booking-roomtype"
                      value={roomType}
                      onChange={(e) => setRoomType(e.target.value)}
                    >
                      <option value="Standard">Standard Room</option>
                      <option value="Deluxe">Deluxe Room</option>
                      <option value="Suite">Executive Suite</option>
                    </select>
                  </div>
                </div>

                <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: 'var(--primary-light)', borderRadius: 'var(--radius-sm)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>Estimated Cost:</span>
                  <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary)' }}>
                    ₹{calculateTotalCost(selectedHotel.pricePerNight, checkIn, checkOut).toLocaleString('en-IN')}
                  </span>
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
                  Confirm Booking
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Booking Success Confirmation Modal */}
      {bookingSuccess && bookingDetails && (
        <div className="modal-overlay" onClick={closeSuccessModal}>
          <div className="modal-content" style={{ borderTop: '5px solid var(--success)' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header" style={{ backgroundColor: 'var(--success)' }}>
              <h3>Booking Confirmed!</h3>
              <button className="modal-close-btn" onClick={closeSuccessModal}>&times;</button>
            </div>
            
            <div className="modal-body" style={{ textAlign: 'center' }}>
              <div className="success-checkmark">
                <svg viewBox="0 0 24 24" width="44" height="44" stroke="currentColor" strokeWidth="2.5" fill="none">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" />
                </svg>
              </div>
              <h4 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Thank you, {bookingDetails.fullName}!</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                Your room booking at <strong>{bookingDetails.hotelName}</strong> ({bookingDetails.location}) has been successfully processed.
              </p>

              <div style={{ textAlign: 'left', backgroundColor: 'var(--bg-light)', padding: '1.25rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9rem' }}>
                <div><strong>Booking ID:</strong> <span style={{ fontFamily: 'monospace', color: 'var(--primary)', fontWeight: 700 }}>{bookingDetails.bookingId}</span></div>
                <div><strong>Room Type:</strong> {bookingDetails.roomType}</div>
                <div><strong>Guests:</strong> {bookingDetails.guests}</div>
                <div><strong>Check-In:</strong> {bookingDetails.checkIn}</div>
                <div><strong>Check-Out:</strong> {bookingDetails.checkOut}</div>
                <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '0.5rem', marginTop: '0.5rem', display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
                  <span>Total Paid (at Hotel):</span>
                  <span style={{ color: 'var(--success)' }}>₹{bookingDetails.totalCost.toLocaleString('en-IN')}</span>
                </div>
              </div>
              
              <button className="btn btn-teal" onClick={closeSuccessModal} style={{ marginTop: '1.5rem', width: '100%' }}>
                Awesome, Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
