import React, { createContext, useState, useEffect, useContext } from 'react';

const TravelContext = createContext();

const PRELOADED_DESTINATIONS = [
  {
    id: 'goa',
    name: 'Goa',
    country: 'India',
    category: 'Beaches',
    description: 'Famous for its pristine beaches, vibrant nightlife, Portuguese heritage, and delicious seafood. Perfect for relaxation and water sports.',
    budget: 15000,
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    attractions: ['Baga Beach', 'Aguada Fort', 'Basilica of Bom Jesus', 'Dudhsagar Falls'],
    coordinates: [15.2993, 74.1240] // Goa latitude, longitude
  },
  {
    id: 'manali',
    name: 'Manali',
    country: 'India',
    category: 'Mountains',
    description: 'A breathtaking mountain retreat in Himachal Pradesh, famous for snow-capped peaks, adventure activities, and scenic valleys.',
    budget: 18000,
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80',
    attractions: ['Solang Valley', 'Hadimba Temple', 'Rohtang Pass', 'Jogini Waterfall'],
    coordinates: [32.2396, 77.1887]
  },
  {
    id: 'ooty',
    name: 'Ooty',
    country: 'India',
    category: 'Mountains',
    description: 'The "Queen of Hill Stations" in Tamil Nadu, known for its lush tea gardens, serene lakes, and pleasant climate.',
    budget: 12000,
    image: 'https://i.pinimg.com/1200x/43/d8/e2/43d8e2452b719baddc40fce081c368f4.jpg',
    attractions: ['Ooty Lake', 'Botanical Gardens', 'Doddabetta Peak', 'Tea Museum'],
    coordinates: [11.4102, 76.6950]
  },
  {
    id: 'jaipur',
    name: 'Jaipur',
    country: 'India',
    category: 'Historical Places',
    description: 'The "Pink City" of Rajasthan, renowned for its majestic forts, royal palaces, rich architecture, and cultural heritage.',
    budget: 14000,
    image: 'https://i.pinimg.com/736x/b5/d3/a1/b5d3a1399c56f95742a2672ab695ce0d.jpg',
    attractions: ['Hawa Mahal', 'Amer Fort', 'City Palace', 'Jantar Mantar'],
    coordinates: [26.9124, 75.7873]
  },
  {
    id: 'kerala',
    name: 'Kerala',
    country: 'India',
    category: 'Adventure Spots',
    description: 'Known as "God\'s Own Country", famous for its serene backwaters, tropical beaches, spices, wildlife sanctuaries, and Ayurveda.',
    budget: 20000,
    image: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=800&q=80',
    attractions: ['Alleppey Backwaters', 'Munnar Tea Hills', 'Wayanad Caves', 'Kochi Fort'],
    coordinates: [10.8505, 76.2711]
  },
  {
    id: 'bali',
    name: 'Bali',
    country: 'Indonesia',
    category: 'Beaches',
    description: 'A tropical paradise offering scenic beaches, volcanic mountains, iconic rice paddies, and highly spiritual culture.',
    budget: 45000,
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80',
    attractions: ['Uluwatu Temple', 'Ubud Monkey Forest', 'Tegallalang Rice Terraces', 'Seminyak Beach'],
    coordinates: [-8.4095, 115.1889]
  },
  {
    id: 'dubai',
    name: 'Dubai',
    country: 'UAE',
    category: 'Cities',
    description: 'A global luxury destination famous for ultra-modern architecture, high-end shopping, desert safaris, and lively nightlife.',
    budget: 65000,
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80',
    attractions: ['Burj Khalifa', 'Dubai Mall', 'Palm Jumeirah', 'Desert Safari Adventure'],
    coordinates: [25.2048, 55.2708]
  },
  {
    id: 'singapore',
    name: 'Singapore',
    country: 'Singapore',
    category: 'Cities',
    description: 'An advanced global financial center with a tropical climate, botanical gardens, futuristic structures, and diverse food culture.',
    budget: 55000,
    image: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=800&q=80',
    attractions: ['Gardens by the Bay', 'Sentosa Island', 'Universal Studios', 'Marina Bay Sands'],
    coordinates: [1.3521, 103.8198]
  },
  {
    id: 'paris',
    name: 'Paris',
    country: 'France',
    category: 'Historical Places',
    description: 'The global center for art, fashion, gastronomy, and culture. Acclaimed for landmarks like the Eiffel Tower and Louvre Museum.',
    budget: 95000,
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80',
    attractions: ['Eiffel Tower', 'Louvre Museum', 'Notre-Dame Cathedral', 'Arc de Triomphe'],
    coordinates: [48.8566, 2.3522]
  },
  {
    id: 'switzerland',
    name: 'Switzerland',
    country: 'Switzerland',
    category: 'Adventure Spots',
    description: 'A mountainous Central European country, home to numerous lakes, villages and the high peaks of the Alps. Famed for ski resorts and hiking.',
    budget: 110000,
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80',
    attractions: ['Matterhorn Mountain', 'Lake Geneva', 'Interlaken Adventure Hub', 'Jungfraujoch Peak'],
    coordinates: [46.8182, 8.2275]
  }
];

const PRELOADED_HOTELS = [
  {
    id: 'ocean-view',
    name: 'Ocean View Resort',
    location: 'Goa',
    rating: 4.8,
    pricePerNight: 4500,
    image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'mountain-retreat',
    name: 'Mountain Retreat',
    location: 'Manali',
    rating: 4.7,
    pricePerNight: 3500,
    image: 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'paradise-inn',
    name: 'Paradise Inn',
    location: 'Ooty',
    rating: 4.5,
    pricePerNight: 2800,
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'royal-palace',
    name: 'Royal Palace Hotel',
    location: 'Jaipur',
    rating: 4.9,
    pricePerNight: 6500,
    image: 'https://i.pinimg.com/1200x/22/b7/cd/22b7cd6203247cb019807863d7379072.jpg'
  },
  {
    id: 'city-lights',
    name: 'City Lights Hotel',
    location: 'Paris',
    rating: 4.6,
    pricePerNight: 8500,
    image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'bali-spa-resort',
    name: 'Ubud Garden Villa & Spa',
    location: 'Bali',
    rating: 4.8,
    pricePerNight: 5500,
    image: 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'dubai-luxury-marina',
    name: 'The Dubai Marina Palace',
    location: 'Dubai',
    rating: 4.9,
    pricePerNight: 12000,
    image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80'
  }
];

export const TravelProvider = ({ children }) => {
  const [destinations] = useState(PRELOADED_DESTINATIONS);
  const [hotels] = useState(PRELOADED_HOTELS);
  
  // Load saved trips from local storage
  const [savedTrips, setSavedTrips] = useState(() => {
    try {
      const stored = localStorage.getItem('travelwise_saved_trips');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Failed to parse saved trips:', error);
      return [];
    }
  });

  // Load favorite destinations from local storage
  const [favoriteDestinations, setFavoriteDestinations] = useState(() => {
    try {
      const stored = localStorage.getItem('travelwise_favorite_destinations');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Failed to parse favorite destinations:', error);
      return [];
    }
  });

  // Sync saved trips with localStorage
  useEffect(() => {
    localStorage.setItem('travelwise_saved_trips', JSON.stringify(savedTrips));
  }, [savedTrips]);

  // Sync favorite destinations with localStorage
  useEffect(() => {
    localStorage.setItem('travelwise_favorite_destinations', JSON.stringify(favoriteDestinations));
  }, [favoriteDestinations]);

  // Helper actions
  const saveTrip = (trip) => {
    const newTrip = {
      ...trip,
      id: trip.id || `trip-${Date.now()}`
    };
    setSavedTrips((prevTrips) => [newTrip, ...prevTrips]);
  };

  const deleteTrip = (tripId) => {
    setSavedTrips((prevTrips) => prevTrips.filter((trip) => trip.id !== tripId));
  };

  const toggleFavorite = (destId) => {
    setFavoriteDestinations((prevFavs) => {
      if (prevFavs.includes(destId)) {
        return prevFavs.filter((id) => id !== destId);
      } else {
        return [...prevFavs, destId];
      }
    });
  };

  const isFavorite = (destId) => {
    return favoriteDestinations.includes(destId);
  };

  return (
    <TravelContext.Provider
      value={{
        destinations,
        hotels,
        savedTrips,
        favoriteDestinations,
        saveTrip,
        deleteTrip,
        toggleFavorite,
        isFavorite
      }}
    >
      {children}
    </TravelContext.Provider>
  );
};

export const useTravel = () => {
  const context = useContext(TravelContext);
  if (!context) {
    throw new Error('useTravel must be used within a TravelProvider');
  }
  return context;
};
