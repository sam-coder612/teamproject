import React, { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTravel } from '../context/TravelContext';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Pre-defined map coordinate configurations
const MAP_LOCATIONS = {
  goa: {
    id: 'goa',
    name: 'Goa',
    center: [15.4909, 73.8263],
    zoom: 11,
    attractions: [
      { name: 'Calangute Beach', coords: [15.5494, 73.7535], type: 'attraction' },
      { name: 'Basilica of Bom Jesus', coords: [15.5009, 73.9116], type: 'attraction' },
      { name: 'Fort Aguada', coords: [15.4922, 73.7737], type: 'attraction' }
    ],
    hotels: [
      { name: 'Ocean View Resort', coords: [15.5400, 73.7580], type: 'hotel', price: '₹4,500' }
    ]
  },
  bali: {
    id: 'bali',
    name: 'Bali',
    center: [-8.4095, 115.1889],
    zoom: 10,
    attractions: [
      { name: 'Ubud Monkey Forest', coords: [-8.5192, 115.2606], type: 'attraction' },
      { name: 'Uluwatu Temple', coords: [-8.8291, 115.0849], type: 'attraction' },
      { name: 'Tegallalang Rice Terrace', coords: [-8.4338, 115.2780], type: 'attraction' }
    ],
    hotels: [
      { name: 'Ubud Garden Villa & Spa', coords: [-8.5100, 115.2500], type: 'hotel', price: '₹5,500' }
    ]
  },
  paris: {
    id: 'paris',
    name: 'Paris',
    center: [48.8566, 2.3522],
    zoom: 12,
    attractions: [
      { name: 'Eiffel Tower', coords: [48.8584, 2.2945], type: 'attraction' },
      { name: 'Louvre Museum', coords: [48.8606, 2.3376], type: 'attraction' },
      { name: 'Arc de Triomphe', coords: [48.8738, 2.2950], type: 'attraction' }
    ],
    hotels: [
      { name: 'City Lights Hotel', coords: [48.8650, 2.3200], type: 'hotel', price: '₹8,500' }
    ]
  },
  dubai: {
    id: 'dubai',
    name: 'Dubai',
    center: [25.2048, 55.2708],
    zoom: 11,
    attractions: [
      { name: 'Burj Khalifa', coords: [25.1972, 55.2744], type: 'attraction' },
      { name: 'Dubai Mall', coords: [25.1985, 55.2796], type: 'attraction' },
      { name: 'Palm Jumeirah', coords: [25.1124, 55.1390], type: 'attraction' }
    ],
    hotels: [
      { name: 'The Dubai Marina Palace', coords: [25.0780, 55.1350], type: 'hotel', price: '₹12,000' }
    ]
  }
};

export const Maps = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markersGroup = useRef(null);

  // Read URL query parameter, default to 'goa'
  const currentLocId = searchParams.get('dest') || 'goa';
  const activeLocation = MAP_LOCATIONS[currentLocId] || MAP_LOCATIONS.goa;

  // Custom SVG Markers
  const createCustomIcon = (color, label) => {
    return L.divIcon({
      html: `
        <div style="
          background-color: ${color}; 
          color: white; 
          width: 30px; 
          height: 30px; 
          border-radius: 50% 50% 50% 0; 
          transform: rotate(-45deg); 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          box-shadow: 0 2px 5px rgba(0,0,0,0.3);
          border: 2px solid white;
        ">
          <div style="transform: rotate(45deg); font-weight: bold; font-size: 14px;">
            ${label}
          </div>
        </div>
      `,
      className: 'custom-map-marker',
      iconSize: [30, 30],
      iconAnchor: [15, 30],
      popupAnchor: [0, -30]
    });
  };

  // Initialize and Update Map
  useEffect(() => {
    if (!mapRef.current) return;

    // Create map instance if it doesn't exist
    if (!mapInstance.current) {
      mapInstance.current = L.map(mapRef.current).setView(
        activeLocation.center,
        activeLocation.zoom
      );

      // Load street map tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(mapInstance.current);

      // Create a layer group for markers
      markersGroup.current = L.layerGroup().addTo(mapInstance.current);
    } else {
      // Update viewport coordinates
      mapInstance.current.setView(activeLocation.center, activeLocation.zoom);
      markersGroup.current.clearLayers();
    }

    // Add Main Destination Marker
    const mainMarker = L.marker(activeLocation.center, {
      icon: createCustomIcon('var(--primary)', '📍')
    })
      .bindPopup(`<strong>${activeLocation.name} City Center</strong>`)
      .addTo(markersGroup.current);
    mainMarker.openPopup();

    // Add Attraction Markers
    activeLocation.attractions.forEach((att) => {
      L.marker(att.coords, {
        icon: createCustomIcon('var(--teal)', '🏛️')
      })
        .bindPopup(`<strong>${att.name}</strong><br/>Popular Tourist Attraction`)
        .addTo(markersGroup.current);
    });

    // Add Hotel Markers
    activeLocation.hotels.forEach((hotel) => {
      L.marker(hotel.coords, {
        icon: createCustomIcon('#f59e0b', '🏨')
      })
        .bindPopup(`<strong>${hotel.name}</strong><br/>Nearby Hotel Accommodation<br/>From ${hotel.price}/night`)
        .addTo(markersGroup.current);
    });

    // Clean up map instance on unmount
    return () => {
      if (mapInstance.current && currentLocId === '') {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, [activeLocation]);

  const handleLocationChange = (locId) => {
    setSearchParams({ dest: locId });
  };

  return (
    <div className="maps-page section page-enter">
      <div className="container">
        <h2 className="section-title">Interactive Destination Maps</h2>
        <p className="section-subtitle">Navigate tourist attractions and discover hotels near your favorite regions</p>

        <div className="map-page-layout">
          {/* Places Sidebar */}
          <div className="map-places-sidebar">
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>Select Destination</h3>
            
            <div className="map-locations-list">
              {Object.values(MAP_LOCATIONS).map((loc) => (
                <button
                  key={loc.id}
                  className={`map-location-select-btn ${currentLocId === loc.id ? 'active' : ''}`}
                  onClick={() => handleLocationChange(loc.id)}
                >
                  <span>{loc.name}</span>
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              ))}
            </div>

            <h3 style={{ fontSize: '1.1rem', marginTop: '2rem', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
              Legend & Markers
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ display: 'inline-block', width: '12px', height: '12px', borderRadius: '50%', backgroundColor: 'var(--primary)' }}></span>
                <span>City Center Marker</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ display: 'inline-block', width: '12px', height: '12px', borderRadius: '50%', backgroundColor: 'var(--teal)' }}></span>
                <span>Attractions (Museums, Beaches, Parks)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ display: 'inline-block', width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#f59e0b' }}></span>
                <span>Hotels & Accommodations</span>
              </div>
            </div>
          </div>

          {/* Map Viewer Container */}
          <div className="map-container-wrapper">
            <div ref={mapRef} className="leaflet-container-actual"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
