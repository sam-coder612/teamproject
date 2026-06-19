import React, { useState } from 'react';
import { useTravel } from '../context/TravelContext';

export const TripPlanner = () => {
  const { destinations, savedTrips, saveTrip, deleteTrip } = useTravel();

  // Controlled Form States
  const [source, setSource] = useState('');
  const [destinationId, setDestinationId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [travelers, setTravelers] = useState(1);
  const [errors, setErrors] = useState({});

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const formErrors = {};

    // Form Validations
    if (!source.trim()) formErrors.source = 'Source location is required';
    if (!destinationId) formErrors.destination = 'Please select a destination';
    if (!startDate) formErrors.startDate = 'Start date is required';
    if (!endDate) {
      formErrors.endDate = 'End date is required';
    } else if (startDate && new Date(endDate) < new Date(startDate)) {
      formErrors.endDate = 'End date cannot be before start date';
    }
    if (travelers < 1) formErrors.travelers = 'Must have at least 1 traveler';

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    const selectedDest = destinations.find((d) => d.id === destinationId);
    const start = new Date(startDate);
    const end = new Date(endDate);
    const durationDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 3600 * 24)) + 1;
    
    // Derived Cost Calculation Formula
    // Base budget per person + (days * daily lodging/food factor) * number of travelers
    const calculatedCost = (selectedDest.budget + (durationDays * 2500)) * travelers;

    const trip = {
      id: `trip-${Date.now()}`,
      source: source.trim(),
      destinationId: selectedDest.id,
      destinationName: selectedDest.name,
      destinationCountry: selectedDest.country,
      startDate,
      endDate,
      duration: durationDays,
      travelers,
      estimatedCost: calculatedCost
    };

    saveTrip(trip);
    
    // Clear inputs
    setSource('');
    setDestinationId('');
    setStartDate('');
    setEndDate('');
    setTravelers(1);
    setErrors({});
  };

  return (
    <div className="trip-planner-page section page-enter">
      <div className="container">
        <h2 className="section-title">Smart Trip Planner</h2>
        <p className="section-subtitle">Plan details of your next adventure and keep track of your saved itineraries</p>

        <div className="planner-grid">
          {/* Planning Form */}
          <div className="planner-form-card">
            <h3 className="form-title">Create Itinerary</h3>
            <form className="planner-form" onSubmit={handleFormSubmit}>
              <div className="form-group">
                <label htmlFor="planner-source">Source Location</label>
                <input
                  id="planner-source"
                  type="text"
                  placeholder="e.g. New Delhi"
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                />
                {errors.source && <div className="form-error">{errors.source}</div>}
              </div>

              <div className="form-group">
                <label htmlFor="planner-dest">Destination</label>
                <select
                  id="planner-dest"
                  value={destinationId}
                  onChange={(e) => setDestinationId(e.target.value)}
                >
                  <option value="">-- Select Destination --</option>
                  {destinations.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} ({d.country})
                    </option>
                  ))}
                </select>
                {errors.destination && <div className="form-error">{errors.destination}</div>}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label htmlFor="planner-start">Start Date</label>
                  <input
                    id="planner-start"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                  {errors.startDate && <div className="form-error">{errors.startDate}</div>}
                </div>
                <div className="form-group">
                  <label htmlFor="planner-end">End Date</label>
                  <input
                    id="planner-end"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                  {errors.endDate && <div className="form-error">{errors.endDate}</div>}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="planner-travelers">Number of Travelers</label>
                <input
                  id="planner-travelers"
                  type="number"
                  min="1"
                  max="100"
                  value={travelers}
                  onChange={(e) => setTravelers(Number(e.target.value))}
                />
                {errors.travelers && <div className="form-error">{errors.travelers}</div>}
              </div>

              <button type="submit" className="btn btn-teal" style={{ marginTop: '1rem' }}>
                Plan Trip
              </button>
            </form>
          </div>

          {/* Saved Trips Display */}
          <div>
            <h3 className="form-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Saved Trips</span>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                {savedTrips.length} Scheduled
              </span>
            </h3>

            {savedTrips.length > 0 ? (
              <div className="trips-list-container">
                {savedTrips.map((trip) => (
                  <div key={trip.id} className="trip-summary-card">
                    <div className="trip-summary-header">
                      <div className="trip-summary-dest">
                        {trip.destinationName}
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500, marginLeft: '0.5rem' }}>
                          ({trip.destinationCountry})
                        </span>
                      </div>
                      <button
                        className="trip-delete-btn"
                        onClick={() => deleteTrip(trip.id)}
                        aria-label="Delete Trip"
                      >
                        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>

                    <div className="trip-summary-body">
                      <div className="trip-summary-item">
                        <span className="trip-summary-label">Route</span>
                        <span className="trip-summary-val" style={{ fontSize: '0.9rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {trip.source} &rarr; {trip.destinationName}
                        </span>
                      </div>
                      <div className="trip-summary-item">
                        <span className="trip-summary-label">Duration</span>
                        <span className="trip-summary-val">{trip.duration} Days</span>
                      </div>
                      <div className="trip-summary-item">
                        <span className="trip-summary-label">Travelers</span>
                        <span className="trip-summary-val">{trip.travelers} Persons</span>
                      </div>
                      <div className="trip-summary-item">
                        <span className="trip-summary-label">Est. Cost</span>
                        <span className="trip-summary-val" style={{ color: 'var(--primary)' }}>
                          ₹{trip.estimatedCost.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '4rem 1.5rem', backgroundColor: 'var(--white)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <svg viewBox="0 0 24 24" width="48" height="48" stroke="var(--text-light)" strokeWidth="1.5" fill="none" style={{ marginBottom: '1rem' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <h4>No Planned Trips</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
                  Enter details on the left to schedule and generate your next trip summary.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
