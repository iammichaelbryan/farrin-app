import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { 
  Calendar, MapPin, Plus, Clock, Edit, Trash2, ArrowLeft, Navigation, CloudRain, 
  Users, Plane, Hotel, Car, Train, Bus, Utensils, Camera, ShoppingBag, 
  Mountain, Waves, TreePine, Building, Star, DollarSign, ThermometerSun,
  Wind, Droplets, Eye, Sun, Moon, Sunrise, Sunset
} from 'lucide-react';
import { apiClient } from '@/services/api';
import { Trip, Itinerary, Event } from '@/types';

interface MockEvent {
  id: number;
  name: string;
  type: 'activity' | 'dining' | 'transport' | 'accommodation' | 'sightseeing';
  time: string;
  duration: string;
  location: string;
  cost: number;
  description: string;
  confirmed: boolean;
  rating?: number;
}

interface MockBooking {
  id: number;
  type: 'flight' | 'hotel' | 'car';
  name: string;
  details: string;
  cost: number;
  status: 'confirmed' | 'pending' | 'cancelled';
  confirmationCode?: string;
  checkIn?: string;
  checkOut?: string;
}

interface MockWeather {
  date: string;
  high: number;
  low: number;
  condition: 'sunny' | 'cloudy' | 'rainy' | 'partly-cloudy';
  precipitation: number;
  humidity: number;
  windSpeed: number;
  uvIndex: number;
}

const ItineraryView: React.FC = () => {
  const { tripId } = useParams<{ tripId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const isStandalone = location.pathname === '/demo-itinerary';

  // Mock data for demonstration
  const mockTrip: Trip = {
    id: parseInt(tripId || '1'),
    ownerId: 4,
    destinationId: 19,
    destinationName: 'Paris',
    tripType: 'SOLO',
    startDate: '2025-06-26T00:00:00',
    endDate: '2025-07-03T00:00:00',
    durationDays: 7,
    status: 'PLANNED',
    createdAt: '2025-06-19T10:04:53.414498'
  };

  const mockEvents: MockEvent[][] = [
    // Day 1
    [
      {
        id: 1,
        name: 'Arrival at Charles de Gaulle Airport',
        type: 'transport',
        time: '10:30',
        duration: '3h',
        location: 'CDG Airport',
        cost: 0,
        description: 'Flight landing, customs, and baggage claim',
        confirmed: true
      },
      {
        id: 2,
        name: 'Hotel Check-in',
        type: 'accommodation',
        time: '14:00',
        duration: '30min',
        location: 'Hotel des Grands Boulevards',
        cost: 0,
        description: 'Check into your boutique hotel in the 2nd arrondissement',
        confirmed: true,
        rating: 4.5
      },
      {
        id: 3,
        name: 'Seine River Cruise',
        type: 'sightseeing',
        time: '16:00',
        duration: '1h 30min',
        location: 'Pont Neuf',
        cost: 25,
        description: 'Scenic cruise along the Seine with commentary',
        confirmed: true,
        rating: 4.3
      },
      {
        id: 4,
        name: 'Dinner at Le Comptoir du Relais',
        type: 'dining',
        time: '19:30',
        duration: '2h',
        location: '9 Carrefour de l\'Odéon',
        cost: 85,
        description: 'Traditional French bistro with authentic cuisine',
        confirmed: true,
        rating: 4.7
      }
    ],
    // Day 2
    [
      {
        id: 5,
        name: 'Louvre Museum',
        type: 'sightseeing',
        time: '09:00',
        duration: '4h',
        location: 'Louvre Museum',
        cost: 17,
        description: 'Skip-the-line tickets to see Mona Lisa and more',
        confirmed: true,
        rating: 4.8
      },
      {
        id: 6,
        name: 'Lunch at Angelina',
        type: 'dining',
        time: '13:30',
        duration: '1h',
        location: '226 Rue de Rivoli',
        cost: 35,
        description: 'Famous hot chocolate and pastries',
        confirmed: false,
        rating: 4.4
      },
      {
        id: 7,
        name: 'Tuileries Garden Walk',
        type: 'activity',
        time: '15:00',
        duration: '1h 30min',
        location: 'Tuileries Garden',
        cost: 0,
        description: 'Leisurely stroll through historic gardens',
        confirmed: false
      },
      {
        id: 8,
        name: 'Place Vendôme Shopping',
        type: 'activity',
        time: '17:00',
        duration: '2h',
        location: 'Place Vendôme',
        cost: 200,
        description: 'Luxury shopping district exploration',
        confirmed: false
      }
    ],
    // Day 3
    [
      {
        id: 9,
        name: 'Eiffel Tower Visit',
        type: 'sightseeing',
        time: '09:30',
        duration: '3h',
        location: 'Eiffel Tower',
        cost: 29,
        description: 'Summit access with panoramic city views',
        confirmed: true,
        rating: 4.9
      },
      {
        id: 10,
        name: 'Picnic at Champ de Mars',
        type: 'dining',
        time: '12:30',
        duration: '1h 30min',
        location: 'Champ de Mars',
        cost: 25,
        description: 'French delicacies with Eiffel Tower backdrop',
        confirmed: false
      },
      {
        id: 11,
        name: 'Montmartre District Tour',
        type: 'sightseeing',
        time: '15:00',
        duration: '3h',
        location: 'Montmartre',
        cost: 40,
        description: 'Guided tour of artist quarter and Sacré-Cœur',
        confirmed: true,
        rating: 4.6
      }
    ],
    // Days 4-7 with similar structure...
    [
      {
        id: 12,
        name: 'Versailles Day Trip',
        type: 'sightseeing',
        time: '08:00',
        duration: '8h',
        location: 'Palace of Versailles',
        cost: 65,
        description: 'Full day exploring the magnificent palace and gardens',
        confirmed: true,
        rating: 4.8
      }
    ],
    [
      {
        id: 13,
        name: 'Latin Quarter Exploration',
        type: 'activity',
        time: '10:00',
        duration: '4h',
        location: 'Latin Quarter',
        cost: 30,
        description: 'Historic neighborhood, bookshops, and cafés',
        confirmed: false
      },
      {
        id: 14,
        name: 'Cooking Class',
        type: 'activity',
        time: '16:00',
        duration: '3h',
        location: 'La Cuisine Paris',
        cost: 120,
        description: 'Learn to cook classic French dishes',
        confirmed: true,
        rating: 4.9
      }
    ],
    [
      {
        id: 15,
        name: 'Musée d\'Orsay',
        type: 'sightseeing',
        time: '10:00',
        duration: '3h',
        location: 'Musée d\'Orsay',
        cost: 16,
        description: 'Impressionist masterpieces collection',
        confirmed: true,
        rating: 4.7
      },
      {
        id: 16,
        name: 'Seine Evening Dinner Cruise',
        type: 'dining',
        time: '19:00',
        duration: '3h',
        location: 'Port de la Bourdonnais',
        cost: 150,
        description: 'Gourmet dining with illuminated city views',
        confirmed: true,
        rating: 4.5
      }
    ],
    [
      {
        id: 17,
        name: 'Last-minute Shopping',
        type: 'activity',
        time: '10:00',
        duration: '3h',
        location: 'Champs-Élysées',
        cost: 100,
        description: 'Souvenir shopping and final exploration',
        confirmed: false
      },
      {
        id: 18,
        name: 'Departure to Airport',
        type: 'transport',
        time: '15:00',
        duration: '1h 30min',
        location: 'CDG Airport',
        cost: 35,
        description: 'Taxi to airport for departure',
        confirmed: true
      }
    ]
  ];

  const mockBookings: MockBooking[] = [
    {
      id: 1,
      type: 'flight',
      name: 'Air France AF 123',
      details: 'JFK → CDG • Economy Class',
      cost: 850,
      status: 'confirmed',
      confirmationCode: 'AF123XYZ'
    },
    {
      id: 2,
      type: 'hotel',
      name: 'Hotel des Grands Boulevards',
      details: 'Superior Room • 7 nights',
      cost: 1400,
      status: 'confirmed',
      confirmationCode: 'HGB789',
      checkIn: '2025-06-26',
      checkOut: '2025-07-03'
    },
    {
      id: 3,
      type: 'flight',
      name: 'Air France AF 456',
      details: 'CDG → JFK • Economy Class',
      cost: 920,
      status: 'confirmed',
      confirmationCode: 'AF456ABC'
    }
  ];

  const mockWeather: MockWeather[] = [
    {
      date: '2025-06-26',
      high: 24,
      low: 16,
      condition: 'partly-cloudy',
      precipitation: 10,
      humidity: 65,
      windSpeed: 12,
      uvIndex: 6
    },
    {
      date: '2025-06-27',
      high: 26,
      low: 18,
      condition: 'sunny',
      precipitation: 0,
      humidity: 58,
      windSpeed: 8,
      uvIndex: 7
    },
    {
      date: '2025-06-28',
      high: 22,
      low: 15,
      condition: 'rainy',
      precipitation: 80,
      humidity: 75,
      windSpeed: 15,
      uvIndex: 3
    },
    {
      date: '2025-06-29',
      high: 25,
      low: 17,
      condition: 'cloudy',
      precipitation: 20,
      humidity: 70,
      windSpeed: 10,
      uvIndex: 5
    },
    {
      date: '2025-06-30',
      high: 27,
      low: 19,
      condition: 'sunny',
      precipitation: 5,
      humidity: 55,
      windSpeed: 7,
      uvIndex: 8
    },
    {
      date: '2025-07-01',
      high: 29,
      low: 21,
      condition: 'sunny',
      precipitation: 0,
      humidity: 52,
      windSpeed: 9,
      uvIndex: 8
    },
    {
      date: '2025-07-02',
      high: 28,
      low: 20,
      condition: 'partly-cloudy',
      precipitation: 15,
      humidity: 60,
      windSpeed: 11,
      uvIndex: 7
    }
  ];

  const [trip, setTrip] = useState<Trip | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'overview' | 'timeline' | 'bookings' | 'weather' | 'budget'>('overview');
  const [selectedDay, setSelectedDay] = useState(0);
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [showAddBooking, setShowAddBooking] = useState(false);
  const [showEditBooking, setShowEditBooking] = useState(false);
  const [editingBooking, setEditingBooking] = useState<MockBooking | null>(null);
  const [bookingToDelete, setBookingToDelete] = useState<number | null>(null);
  const [showFlightSearch, setShowFlightSearch] = useState(false);
  const [showAccommodationSearch, setShowAccommodationSearch] = useState(false);

  useEffect(() => {
    const loadTripData = async () => {
      if (!tripId || isStandalone) {
        // Use mock data for standalone demo or when no tripId
        setTrip(mockTrip);
        console.log('ItineraryView loaded with mock data');
        return;
      }

      setIsLoading(true);
      setError('');

      try {
        // Check if user is authenticated first
        const currentUser = localStorage.getItem('user');
        console.log('🔍 Authentication check - currentUser:', currentUser);
        
        if (!currentUser) {
          console.log('❌ No authenticated user found, using mock data for trip', tripId);
          const fallbackTrip = {
            ...mockTrip,
            id: parseInt(tripId)
          };
          setTrip(fallbackTrip);
          setIsLoading(false);
          return;
        }

        console.log('✅ User authenticated, attempting API call for trip', tripId);
        // Try to fetch real trip data from API
        const response = await apiClient.getTrip(parseInt(tripId));
        
        if (response.success && response.data) {
          // Add destinationName if missing
          const tripData = {
            ...response.data,
            destinationName: response.data.destinationName || 'Your Destination'
          };
          setTrip(tripData);
          console.log('ItineraryView loaded with API data:', tripData);
        } else {
          throw new Error(response.message || 'Failed to load trip');
        }
      } catch (error) {
        console.error('Failed to load trip data, falling back to mock:', error);
        // Fallback to mock data with the correct tripId
        const fallbackTrip = {
          ...mockTrip,
          id: parseInt(tripId)
        };
        setTrip(fallbackTrip);
        setError(''); // Don't show error when we have fallback data
      } finally {
        setIsLoading(false);
      }
    };

    loadTripData();
  }, [tripId, isStandalone]);

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'transport': return <Plane className="h-4 w-4" />;
      case 'accommodation': return <Hotel className="h-4 w-4" />;
      case 'dining': return <Utensils className="h-4 w-4" />;
      case 'sightseeing': return <Camera className="h-4 w-4" />;
      case 'activity': return <Mountain className="h-4 w-4" />;
      default: return <Calendar className="h-4 w-4" />;
    }
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case 'transport': return 'bg-blue-100 text-blue-600 border-blue-200';
      case 'accommodation': return 'bg-purple-100 text-purple-600 border-purple-200';
      case 'dining': return 'bg-orange-100 text-orange-600 border-orange-200';
      case 'sightseeing': return 'bg-green-100 text-green-600 border-green-200';
      case 'activity': return 'bg-indigo-100 text-indigo-600 border-indigo-200';
      default: return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case 'sunny': return <Sun className="h-5 w-5 text-yellow-500" />;
      case 'partly-cloudy': return <CloudRain className="h-5 w-5 text-gray-500" />;
      case 'cloudy': return <CloudRain className="h-5 w-5 text-gray-600" />;
      case 'rainy': return <CloudRain className="h-5 w-5 text-blue-600" />;
      default: return <Sun className="h-5 w-5 text-yellow-500" />;
    }
  };

  const getTotalBudget = () => {
    return mockBookings.reduce((total, booking) => total + booking.cost, 0) +
           mockEvents.flat().reduce((total, event) => total + event.cost, 0);
  };

  const getBookingIcon = (type: string) => {
    switch (type) {
      case 'flight': return <Plane className="h-5 w-5" />;
      case 'hotel': return <Hotel className="h-5 w-5" />;
      case 'car': return <Car className="h-5 w-5" />;
      default: return <Calendar className="h-5 w-5" />;
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your itinerary...</p>
        </div>
      </div>
    );
  }

  // Show error state if trip failed to load and no fallback
  if (error && !trip) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Trip not found</h1>
          <p className="text-gray-600 mb-6">The trip you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/feed')}
            className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg"
          >
            Back to Feed
          </button>
        </div>
      </div>
    );
  }

  // Show message if no trip data available
  if (!trip) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">No trip data</h1>
          <p className="text-gray-600 mb-6">Unable to load trip information.</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              {!isStandalone && (
                <button
                  onClick={() => navigate('/dashboard')}
                  className="text-gray-600 hover:text-gray-900"
                >
                  <ArrowLeft className="h-6 w-6" />
                </button>
              )}
              {isStandalone && (
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">F</span>
                  </div>
                  <span className="text-lg font-bold text-gray-900">Farrin</span>
                </div>
              )}
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  {trip?.destinationName || 'Your Trip'} Itinerary
                </h1>
                <p className="text-sm text-gray-600">
                  {trip && new Date(trip.startDate).toLocaleDateString()} - {trip && trip.endDate && new Date(trip.endDate).toLocaleDateString()} • {trip?.durationDays} days
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Total Budget: <span className="font-semibold text-green-600">${getTotalBudget().toLocaleString()}</span>
              </span>
              {isStandalone && (
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <span>Demo Itinerary</span>
                  <span className="px-2 py-1 bg-blue-100 text-blue-600 rounded text-xs">Live Preview</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: Calendar },
              { id: 'timeline', label: 'Daily Timeline', icon: Clock },
              { id: 'bookings', label: 'Bookings', icon: Plane },
              { id: 'weather', label: 'Weather', icon: CloudRain },
              { id: 'budget', label: 'Budget', icon: DollarSign },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-4 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Trip Summary */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-4">Trip Overview</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <Calendar className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Duration</p>
                    <p className="font-semibold">{trip?.durationDays} Days</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <MapPin className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Destination</p>
                    <p className="font-semibold">{trip?.destinationName}</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <Users className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Type</p>
                    <p className="font-semibold">{trip?.tripType}</p>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <DollarSign className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Budget</p>
                    <p className="font-semibold">${getTotalBudget().toLocaleString()}</p>
                  </div>
                </div>
              </div>

              {/* Quick Day Navigation */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold mb-4">Daily Overview</h3>
                <div className="grid grid-cols-7 gap-2">
                  {Array.from({ length: trip?.durationDays || 7 }, (_, i) => {
                    const date = new Date(trip?.startDate || '2025-06-26');
                    date.setDate(date.getDate() + i);
                    const dayEvents = mockEvents[i] || [];
                    const dailyCost = dayEvents.reduce((sum, event) => sum + event.cost, 0);
                    
                    return (
                      <button
                        key={i}
                        onClick={() => { setSelectedDay(i); setActiveTab('timeline'); }}
                        className="p-3 text-center border rounded-lg hover:bg-primary-50 hover:border-primary-300 transition-colors"
                      >
                        <p className="text-xs text-gray-500">Day {i + 1}</p>
                        <p className="text-sm font-medium">{date.toLocaleDateString('en', { month: 'short', day: 'numeric' })}</p>
                        <p className="text-xs text-gray-600">{dayEvents.length} events</p>
                        <p className="text-xs text-green-600 font-medium">${dailyCost}</p>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Weather Preview */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold mb-4">Weather Forecast</h3>
                <div className="space-y-3">
                  {mockWeather.slice(0, 3).map((weather, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {getWeatherIcon(weather.condition)}
                        <div>
                          <p className="text-sm font-medium">
                            {new Date(weather.date).toLocaleDateString('en', { weekday: 'short', month: 'short', day: 'numeric' })}
                          </p>
                          <p className="text-xs text-gray-600 capitalize">{weather.condition.replace('-', ' ')}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{weather.high}°/{weather.low}°</p>
                        <p className="text-xs text-blue-600">{weather.precipitation}% rain</p>
                      </div>
                    </div>
                  ))}
                </div>
                <button 
                  onClick={() => setActiveTab('weather')}
                  className="mt-4 w-full text-center text-sm text-primary-600 hover:text-primary-700"
                >
                  View full forecast →
                </button>
              </div>

              {/* Bookings Preview */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold mb-4">Confirmed Bookings</h3>
                <div className="space-y-3">
                  {mockBookings.map((booking) => (
                    <div key={booking.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="text-green-600">
                        {getBookingIcon(booking.type)}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{booking.name}</p>
                        <p className="text-xs text-gray-600">{booking.details}</p>
                      </div>
                      <p className="text-sm font-semibold text-green-600">${booking.cost}</p>
                    </div>
                  ))}
                </div>
                <button 
                  onClick={() => setActiveTab('bookings')}
                  className="mt-4 w-full text-center text-sm text-primary-600 hover:text-primary-700"
                >
                  Manage bookings →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Timeline Tab */}
        {activeTab === 'timeline' && (
          <div className="space-y-6">
            {/* Day Navigation */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Daily Timeline</h2>
                <button
                  onClick={() => setShowAddEvent(true)}
                  className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Event</span>
                </button>
              </div>
              
              <div className="flex space-x-2 overflow-x-auto pb-2">
                {Array.from({ length: trip?.durationDays || 7 }, (_, i) => {
                  const date = new Date(trip?.startDate || '2025-06-26');
                  date.setDate(date.getDate() + i);
                  const dayEvents = mockEvents[i] || [];
                  
                  return (
                    <button
                      key={i}
                      onClick={() => setSelectedDay(i)}
                      className={`flex-shrink-0 p-4 rounded-lg border-2 transition-colors ${
                        selectedDay === i
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <p className="text-sm font-medium">Day {i + 1}</p>
                      <p className="text-xs text-gray-600">
                        {date.toLocaleDateString('en', { weekday: 'short', month: 'short', day: 'numeric' })}
                      </p>
                      <p className="text-xs text-primary-600 mt-1">{dayEvents.length} events</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Selected Day Events */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">
                  Day {selectedDay + 1} - {new Date(new Date(trip?.startDate || '2025-06-26').getTime() + selectedDay * 24 * 60 * 60 * 1000).toLocaleDateString('en', { weekday: 'long', month: 'long', day: 'numeric' })}
                </h3>
                <div className="text-sm text-gray-600">
                  Total: <span className="font-semibold text-green-600">
                    ${(mockEvents[selectedDay] || []).reduce((sum, event) => sum + event.cost, 0)}
                  </span>
                </div>
              </div>

              {(mockEvents[selectedDay] || []).length === 0 ? (
                <div className="text-center py-12">
                  <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-gray-900 mb-2">No events planned</h4>
                  <p className="text-gray-600 mb-6">Add some activities to make the most of your day!</p>
                  <button
                    onClick={() => setShowAddEvent(true)}
                    className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg"
                  >
                    Add First Event
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {(mockEvents[selectedDay] || []).map((event, index) => (
                    <div key={event.id} className="relative">
                      {/* Timeline connector */}
                      {index < (mockEvents[selectedDay] || []).length - 1 && (
                        <div className="absolute left-8 top-16 w-0.5 h-8 bg-gray-200"></div>
                      )}
                      
                      <div className={`flex items-start space-x-4 p-4 rounded-lg border-2 ${
                        event.confirmed ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-white'
                      }`}>
                        <div className={`flex-shrink-0 p-2 rounded-lg border ${getEventColor(event.type)}`}>
                          {getEventIcon(event.type)}
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="font-medium text-gray-900">{event.name}</h4>
                              <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                                <span className="flex items-center space-x-1">
                                  <Clock className="h-3 w-3" />
                                  <span>{event.time}</span>
                                </span>
                                <span>Duration: {event.duration}</span>
                                <span className="flex items-center space-x-1">
                                  <MapPin className="h-3 w-3" />
                                  <span>{event.location}</span>
                                </span>
                              </div>
                              {event.rating && (
                                <div className="flex items-center space-x-1 mt-1">
                                  <Star className="h-3 w-3 text-yellow-400 fill-current" />
                                  <span className="text-xs text-gray-600">{event.rating}/5</span>
                                </div>
                              )}
                            </div>
                            
                            <div className="text-right">
                              <p className="font-semibold text-gray-900">
                                {event.cost > 0 ? `$${event.cost}` : 'Free'}
                              </p>
                              <div className="flex items-center space-x-2 mt-2">
                                {event.confirmed && (
                                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                                    Confirmed
                                  </span>
                                )}
                                <button className="text-gray-400 hover:text-gray-600">
                                  <Edit className="h-4 w-4" />
                                </button>
                                <button className="text-gray-400 hover:text-red-600">
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                          
                          <p className="text-sm text-gray-600 mt-2">{event.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Bookings Tab */}
        {activeTab === 'bookings' && (
          <div className="space-y-6">
            {/* Flight Bookings Section */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <Plane className="h-6 w-6 text-blue-600" />
                  <h2 className="text-xl font-semibold">Flight Bookings</h2>
                </div>
                <div className="flex items-center space-x-3">
                  <button 
                    onClick={() => setShowFlightSearch(true)}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
                  >
                    <Navigation className="h-4 w-4" />
                    <span>Search Flights</span>
                  </button>
                  <button 
                    onClick={() => setShowAddBooking(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add Booking</span>
                  </button>
                </div>
              </div>

              <div className="grid gap-4">
                {mockBookings.filter(booking => booking.type === 'flight').map((booking) => (
                  <div key={booking.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
                          <Plane className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{booking.name}</h3>
                          <p className="text-gray-600">{booking.details}</p>
                          {booking.confirmationCode && (
                            <p className="text-sm text-gray-500 mt-1">
                              Confirmation: {booking.confirmationCode}
                            </p>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="text-xl font-bold text-gray-900">${booking.cost.toLocaleString()}</p>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                            booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                            booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button 
                            onClick={() => {
                              setEditingBooking(booking);
                              setShowEditBooking(true);
                            }}
                            className="text-gray-400 hover:text-blue-600 transition-colors"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => setBookingToDelete(booking.id)}
                            className="text-gray-400 hover:text-red-600 transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {mockBookings.filter(booking => booking.type === 'flight').length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Plane className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                    <p>No flight bookings yet</p>
                    <button 
                      onClick={() => setShowAddBooking(true)}
                      className="mt-2 text-blue-600 hover:text-blue-700"
                    >
                      Add your first flight
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Accommodation Bookings Section */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <Hotel className="h-6 w-6 text-purple-600" />
                  <h2 className="text-xl font-semibold">Accommodation Bookings</h2>
                </div>
                <div className="flex items-center space-x-3">
                  <button 
                    onClick={() => setShowAccommodationSearch(true)}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
                  >
                    <Navigation className="h-4 w-4" />
                    <span>Search Hotels</span>
                  </button>
                  <button 
                    onClick={() => setShowAddBooking(true)}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add Booking</span>
                  </button>
                </div>
              </div>

              <div className="grid gap-4">
                {mockBookings.filter(booking => booking.type === 'hotel').map((booking) => (
                  <div key={booking.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="p-3 bg-purple-100 text-purple-600 rounded-lg">
                          <Hotel className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{booking.name}</h3>
                          <p className="text-gray-600">{booking.details}</p>
                          {booking.confirmationCode && (
                            <p className="text-sm text-gray-500 mt-1">
                              Confirmation: {booking.confirmationCode}
                            </p>
                          )}
                          {booking.checkIn && booking.checkOut && (
                            <p className="text-sm text-gray-500">
                              Check-in: {new Date(booking.checkIn).toLocaleDateString()} - Check-out: {new Date(booking.checkOut).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="text-xl font-bold text-gray-900">${booking.cost.toLocaleString()}</p>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                            booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                            booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button 
                            onClick={() => {
                              setEditingBooking(booking);
                              setShowEditBooking(true);
                            }}
                            className="text-gray-400 hover:text-purple-600 transition-colors"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => setBookingToDelete(booking.id)}
                            className="text-gray-400 hover:text-red-600 transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {mockBookings.filter(booking => booking.type === 'hotel').length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Hotel className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                    <p>No accommodation bookings yet</p>
                    <button 
                      onClick={() => setShowAddBooking(true)}
                      className="mt-2 text-purple-600 hover:text-purple-700"
                    >
                      Add your first hotel
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Car Rental Section */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <Car className="h-6 w-6 text-green-600" />
                  <h2 className="text-xl font-semibold">Car Rentals & Transport</h2>
                </div>
                <button 
                  onClick={() => setShowAddBooking(true)}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Rental</span>
                </button>
              </div>

              <div className="grid gap-4">
                {mockBookings.filter(booking => booking.type === 'car').map((booking) => (
                  <div key={booking.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="p-3 bg-green-100 text-green-600 rounded-lg">
                          <Car className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{booking.name}</h3>
                          <p className="text-gray-600">{booking.details}</p>
                          {booking.confirmationCode && (
                            <p className="text-sm text-gray-500 mt-1">
                              Confirmation: {booking.confirmationCode}
                            </p>
                          )}
                          {booking.checkIn && booking.checkOut && (
                            <p className="text-sm text-gray-500">
                              Pickup: {new Date(booking.checkIn).toLocaleDateString()} - Return: {new Date(booking.checkOut).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="text-xl font-bold text-gray-900">${booking.cost.toLocaleString()}</p>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                            booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                            booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button 
                            onClick={() => {
                              setEditingBooking(booking);
                              setShowEditBooking(true);
                            }}
                            className="text-gray-400 hover:text-green-600 transition-colors"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => setBookingToDelete(booking.id)}
                            className="text-gray-400 hover:text-red-600 transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {mockBookings.filter(booking => booking.type === 'car').length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Car className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                    <p>No car rentals yet</p>
                    <button 
                      onClick={() => setShowAddBooking(true)}
                      className="mt-2 text-green-600 hover:text-green-700"
                    >
                      Add car rental
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Weather Tab */}
        {activeTab === 'weather' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-6">Weather Forecast</h2>
              
              <div className="grid gap-4">
                {mockWeather.map((weather, index) => {
                  const date = new Date(weather.date);
                  const dayEvents = mockEvents[index] || [];
                  const outdoorEvents = dayEvents.filter(event => 
                    event.type === 'sightseeing' || event.type === 'activity'
                  );
                  
                  return (
                    <div key={index} className="border rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-4">
                          {getWeatherIcon(weather.condition)}
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              Day {index + 1} - {date.toLocaleDateString('en', { weekday: 'long', month: 'long', day: 'numeric' })}
                            </h3>
                            <p className="text-gray-600 capitalize">{weather.condition.replace('-', ' ')}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-3xl font-bold text-gray-900">{weather.high}°</p>
                          <p className="text-gray-600">Low: {weather.low}°</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-4 gap-4 mb-4">
                        <div className="text-center">
                          <Droplets className="h-5 w-5 text-blue-500 mx-auto mb-1" />
                          <p className="text-sm text-gray-600">Precipitation</p>
                          <p className="font-semibold">{weather.precipitation}%</p>
                        </div>
                        <div className="text-center">
                          <Wind className="h-5 w-5 text-gray-500 mx-auto mb-1" />
                          <p className="text-sm text-gray-600">Wind</p>
                          <p className="font-semibold">{weather.windSpeed} mph</p>
                        </div>
                        <div className="text-center">
                          <Eye className="h-5 w-5 text-gray-500 mx-auto mb-1" />
                          <p className="text-sm text-gray-600">Humidity</p>
                          <p className="font-semibold">{weather.humidity}%</p>
                        </div>
                        <div className="text-center">
                          <Sun className="h-5 w-5 text-yellow-500 mx-auto mb-1" />
                          <p className="text-sm text-gray-600">UV Index</p>
                          <p className="font-semibold">{weather.uvIndex}/10</p>
                        </div>
                      </div>
                      
                      {outdoorEvents.length > 0 && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                          <h4 className="font-medium text-yellow-800 mb-2">Outdoor Activities</h4>
                          <div className="space-y-1">
                            {outdoorEvents.map(event => (
                              <p key={event.id} className="text-sm text-yellow-700">
                                • {event.name} at {event.time}
                              </p>
                            ))}
                          </div>
                          {weather.precipitation > 50 && (
                            <p className="text-sm text-yellow-700 mt-2 font-medium">
                              ☔ High chance of rain - consider indoor alternatives
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Budget Tab */}
        {activeTab === 'budget' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-6">Trip Budget</h2>
              
              {/* Budget Overview */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="text-center p-6 bg-blue-50 rounded-lg">
                  <DollarSign className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Total Budget</p>
                  <p className="text-2xl font-bold text-blue-600">${getTotalBudget().toLocaleString()}</p>
                </div>
                <div className="text-center p-6 bg-green-50 rounded-lg">
                  <Plane className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Bookings</p>
                  <p className="text-2xl font-bold text-green-600">
                    ${mockBookings.reduce((sum, b) => sum + b.cost, 0).toLocaleString()}
                  </p>
                </div>
                <div className="text-center p-6 bg-orange-50 rounded-lg">
                  <Calendar className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Activities</p>
                  <p className="text-2xl font-bold text-orange-600">
                    ${mockEvents.flat().reduce((sum, e) => sum + e.cost, 0).toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Daily Breakdown */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Daily Spending</h3>
                <div className="space-y-4">
                  {Array.from({ length: trip?.durationDays || 7 }, (_, i) => {
                    const date = new Date(trip?.startDate || '2025-06-26');
                    date.setDate(date.getDate() + i);
                    const dayEvents = mockEvents[i] || [];
                    const dailyTotal = dayEvents.reduce((sum, event) => sum + event.cost, 0);
                    const maxDaily = Math.max(...mockEvents.map(day => 
                      day.reduce((sum, event) => sum + event.cost, 0)
                    ));
                    const percentage = maxDaily > 0 ? (dailyTotal / maxDaily) * 100 : 0;
                    
                    return (
                      <div key={i} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <h4 className="font-medium">Day {i + 1}</h4>
                            <p className="text-sm text-gray-600">
                              {date.toLocaleDateString('en', { weekday: 'long', month: 'short', day: 'numeric' })}
                            </p>
                          </div>
                          <p className="text-lg font-semibold">${dailyTotal.toLocaleString()}</p>
                        </div>
                        
                        <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                          <div 
                            className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                          {[
                            { type: 'dining', label: 'Food', icon: Utensils },
                            { type: 'sightseeing', label: 'Sights', icon: Camera },
                            { type: 'activity', label: 'Activities', icon: Mountain },
                            { type: 'transport', label: 'Transport', icon: Car }
                          ].map(category => {
                            const categoryTotal = dayEvents
                              .filter(event => event.type === category.type)
                              .reduce((sum, event) => sum + event.cost, 0);
                            
                            return (
                              <div key={category.type} className="flex items-center space-x-2">
                                <category.icon className="h-4 w-4 text-gray-500" />
                                <span className="text-gray-600">${categoryTotal}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add Event Modal */}
      {showAddEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">Add New Event</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Event Name</label>
                  <input 
                    type="text" 
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    placeholder="e.g., Visit Eiffel Tower"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select className="w-full border border-gray-300 rounded-lg px-3 py-2">
                    <option value="sightseeing">Sightseeing</option>
                    <option value="dining">Dining</option>
                    <option value="activity">Activity</option>
                    <option value="transport">Transport</option>
                    <option value="accommodation">Accommodation</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                    <input 
                      type="time" 
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Cost</label>
                    <input 
                      type="number" 
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      placeholder="0"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <input 
                    type="text" 
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    placeholder="Address or landmark"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea 
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    rows={3}
                    placeholder="Additional details..."
                  ></textarea>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button 
                  onClick={() => setShowAddEvent(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => setShowAddEvent(false)}
                  className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg"
                >
                  Add Event
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Booking Modal */}
      {showAddBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full mx-4">
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">Add New Booking</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Booking Type</label>
                  <select className="w-full border border-gray-300 rounded-lg px-3 py-2">
                    <option value="flight">Flight</option>
                    <option value="hotel">Hotel/Accommodation</option>
                    <option value="car">Car Rental</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name/Title</label>
                  <input 
                    type="text" 
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    placeholder="e.g., Air France Flight AF123"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Details</label>
                  <input 
                    type="text" 
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    placeholder="e.g., JFK → CDG • Economy Class"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Cost ($)</label>
                    <input 
                      type="number" 
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select className="w-full border border-gray-300 rounded-lg px-3 py-2">
                      <option value="confirmed">Confirmed</option>
                      <option value="pending">Pending</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Confirmation Code</label>
                  <input 
                    type="text" 
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    placeholder="e.g., AF123XYZ"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Check-in/Start Date</label>
                    <input 
                      type="date" 
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Check-out/End Date</label>
                    <input 
                      type="date" 
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button 
                  onClick={() => setShowAddBooking(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => {
                    setShowAddBooking(false);
                    // Add booking logic would go here
                  }}
                  className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg"
                >
                  Add Booking
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Booking Modal */}
      {showEditBooking && editingBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full mx-4">
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">Edit Booking</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Booking Type</label>
                  <select className="w-full border border-gray-300 rounded-lg px-3 py-2" defaultValue={editingBooking.type}>
                    <option value="flight">Flight</option>
                    <option value="hotel">Hotel/Accommodation</option>
                    <option value="car">Car Rental</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name/Title</label>
                  <input 
                    type="text" 
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    defaultValue={editingBooking.name}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Details</label>
                  <input 
                    type="text" 
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    defaultValue={editingBooking.details}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Cost ($)</label>
                    <input 
                      type="number" 
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      defaultValue={editingBooking.cost}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select className="w-full border border-gray-300 rounded-lg px-3 py-2" defaultValue={editingBooking.status}>
                      <option value="confirmed">Confirmed</option>
                      <option value="pending">Pending</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Confirmation Code</label>
                  <input 
                    type="text" 
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    defaultValue={editingBooking.confirmationCode || ''}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Check-in/Start Date</label>
                    <input 
                      type="date" 
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      defaultValue={editingBooking.checkIn || ''}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Check-out/End Date</label>
                    <input 
                      type="date" 
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      defaultValue={editingBooking.checkOut || ''}
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button 
                  onClick={() => {
                    setShowEditBooking(false);
                    setEditingBooking(null);
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => {
                    setShowEditBooking(false);
                    setEditingBooking(null);
                    // Update booking logic would go here
                  }}
                  className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg"
                >
                  Update Booking
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {bookingToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-3 bg-red-100 text-red-600 rounded-full">
                  <Trash2 className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Delete Booking</h3>
                  <p className="text-sm text-gray-600">This action cannot be undone.</p>
                </div>
              </div>
              
              <p className="text-gray-700 mb-6">
                Are you sure you want to delete this booking? All associated information will be permanently removed.
              </p>
              
              <div className="flex justify-end space-x-3">
                <button 
                  onClick={() => setBookingToDelete(null)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => {
                    setBookingToDelete(null);
                    // Delete booking logic would go here
                  }}
                  className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg"
                >
                  Delete Booking
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Flight Search Modal */}
      {showFlightSearch && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold">Search Flights</h3>
                <button 
                  onClick={() => setShowFlightSearch(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <Plus className="h-6 w-6 rotate-45" />
                </button>
              </div>
              
              {/* Search Form */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">From</label>
                    <input 
                      type="text" 
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      defaultValue="New York (JFK)"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
                    <input 
                      type="text" 
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      defaultValue="Paris (CDG)"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Departure</label>
                    <input 
                      type="date" 
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      defaultValue="2025-06-26"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Passengers</label>
                    <select className="w-full border border-gray-300 rounded-lg px-3 py-2">
                      <option value="1">1 Adult</option>
                      <option value="2">2 Adults</option>
                      <option value="3">3 Adults</option>
                      <option value="4">4 Adults</option>
                    </select>
                  </div>
                </div>
                
                {/* Advanced Filters */}
                <div className="mt-4 border-t pt-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Filters</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Price Range */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Price Range ($)</label>
                      <div className="grid grid-cols-2 gap-2">
                        <input 
                          type="number" 
                          className="w-full border border-gray-300 rounded-lg px-3 py-2"
                          placeholder="Min"
                          min="0"
                        />
                        <input 
                          type="number" 
                          className="w-full border border-gray-300 rounded-lg px-3 py-2"
                          placeholder="Max"
                          min="0"
                        />
                      </div>
                    </div>
                    
                    {/* Duration Filter */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                      <select className="w-full border border-gray-300 rounded-lg px-3 py-2">
                        <option value="">Any Duration</option>
                        <option value="6">Under 6 hours</option>
                        <option value="10">Under 10 hours</option>
                        <option value="15">Under 15 hours</option>
                        <option value="20">Under 20 hours</option>
                      </select>
                    </div>
                    
                    {/* Airline Filter */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Airline</label>
                      <select className="w-full border border-gray-300 rounded-lg px-3 py-2">
                        <option value="">All Airlines</option>
                        <option value="air-france">Air France</option>
                        <option value="delta">Delta</option>
                        <option value="united">United</option>
                        <option value="lufthansa">Lufthansa</option>
                        <option value="british">British Airways</option>
                      </select>
                    </div>
                  </div>
                  
                  {/* Additional Filters Row */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Stops</label>
                      <select className="w-full border border-gray-300 rounded-lg px-3 py-2">
                        <option value="">Any Stops</option>
                        <option value="0">Direct Only</option>
                        <option value="1">1 Stop Max</option>
                        <option value="2">2 Stops Max</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Departure Time</label>
                      <select className="w-full border border-gray-300 rounded-lg px-3 py-2">
                        <option value="">Any Time</option>
                        <option value="morning">Morning (6AM - 12PM)</option>
                        <option value="afternoon">Afternoon (12PM - 6PM)</option>
                        <option value="evening">Evening (6PM - 12AM)</option>
                        <option value="night">Night (12AM - 6AM)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
                      <select className="w-full border border-gray-300 rounded-lg px-3 py-2">
                        <option value="economy">Economy</option>
                        <option value="premium">Premium Economy</option>
                        <option value="business">Business</option>
                        <option value="first">First Class</option>
                      </select>
                    </div>
                  </div>
                </div>
                
                <button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg">
                  Search Flights
                </button>
              </div>

              {/* Mock Flight Results */}
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-semibold">Available Flights</h4>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span>Sort by:</span>
                    <select className="border border-gray-300 rounded px-2 py-1">
                      <option value="price">Price (Low to High)</option>
                      <option value="duration">Duration</option>
                      <option value="departure">Departure Time</option>
                      <option value="airline">Airline</option>
                    </select>
                  </div>
                </div>
                <div className="text-sm text-gray-600 mb-4">
                  ⚠️ These are demo results. In the live system, you would book externally and then add booking details.
                </div>
                
                {/* Flight Option 1 */}
                <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
                        <Plane className="h-6 w-6" />
                      </div>
                      <div>
                        <h5 className="font-semibold text-gray-900">Air France AF 123</h5>
                        <p className="text-gray-600">JFK → CDG • 7h 30m • Direct</p>
                        <p className="text-sm text-gray-500">Departs: 08:45 AM • Arrives: 10:15 PM</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-blue-600">$850</p>
                      <p className="text-sm text-gray-500">Economy</p>
                      <button className="mt-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm">
                        Book External
                      </button>
                    </div>
                  </div>
                </div>

                {/* Flight Option 2 */}
                <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
                        <Plane className="h-6 w-6" />
                      </div>
                      <div>
                        <h5 className="font-semibold text-gray-900">Delta DL 456</h5>
                        <p className="text-gray-600">JFK → CDG • 8h 15m • 1 Stop</p>
                        <p className="text-sm text-gray-500">Departs: 11:30 AM • Arrives: 12:45 AM+1</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-blue-600">$720</p>
                      <p className="text-sm text-gray-500">Economy</p>
                      <button className="mt-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm">
                        Book External
                      </button>
                    </div>
                  </div>
                </div>

                {/* Flight Option 3 */}
                <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
                        <Plane className="h-6 w-6" />
                      </div>
                      <div>
                        <h5 className="font-semibold text-gray-900">United UA 789</h5>
                        <p className="text-gray-600">JFK → CDG • 9h 45m • 1 Stop</p>
                        <p className="text-sm text-gray-500">Departs: 03:15 PM • Arrives: 09:00 AM+1</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-blue-600">$695</p>
                      <p className="text-sm text-gray-500">Economy</p>
                      <button className="mt-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm">
                        Book External
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h5 className="font-medium text-yellow-800 mb-2">How it works:</h5>
                <ol className="text-sm text-yellow-700 space-y-1">
                  <li>1. Click "Book External" to be redirected to the airline's website</li>
                  <li>2. Complete your booking on their platform</li>
                  <li>3. Return here and use "Add Booking" to save your confirmation details</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Accommodation Search Modal */}
      {showAccommodationSearch && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold">Search Accommodations</h3>
                <button 
                  onClick={() => setShowAccommodationSearch(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <Plus className="h-6 w-6 rotate-45" />
                </button>
              </div>
              
              {/* Search Form */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Destination</label>
                    <input 
                      type="text" 
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      defaultValue="Paris, France"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Check-in</label>
                    <input 
                      type="date" 
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      defaultValue="2025-06-26"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Check-out</label>
                    <input 
                      type="date" 
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      defaultValue="2025-07-03"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Guests</label>
                    <select className="w-full border border-gray-300 rounded-lg px-3 py-2">
                      <option value="1">1 Guest</option>
                      <option value="2">2 Guests</option>
                      <option value="3">3 Guests</option>
                      <option value="4">4 Guests</option>
                    </select>
                  </div>
                </div>
                
                {/* Advanced Filters */}
                <div className="mt-4 border-t pt-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Filters</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Price Range */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Price Range ($/night)</label>
                      <div className="grid grid-cols-2 gap-2">
                        <input 
                          type="number" 
                          className="w-full border border-gray-300 rounded-lg px-3 py-2"
                          placeholder="Min"
                          min="0"
                        />
                        <input 
                          type="number" 
                          className="w-full border border-gray-300 rounded-lg px-3 py-2"
                          placeholder="Max"
                          min="0"
                        />
                      </div>
                    </div>
                    
                    {/* Amenities Filter */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Amenities</label>
                      <select className="w-full border border-gray-300 rounded-lg px-3 py-2">
                        <option value="">Any Amenities</option>
                        <option value="wifi">Free WiFi</option>
                        <option value="breakfast">Breakfast Included</option>
                        <option value="parking">Free Parking</option>
                        <option value="gym">Gym/Fitness</option>
                        <option value="spa">Spa Services</option>
                        <option value="pool">Swimming Pool</option>
                        <option value="restaurant">Restaurant</option>
                      </select>
                    </div>
                    
                    {/* Guest Rating Filter */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Guest Rating</label>
                      <select className="w-full border border-gray-300 rounded-lg px-3 py-2">
                        <option value="">Any Rating</option>
                        <option value="3.0">3.0+ Rating</option>
                        <option value="3.5">3.5+ Rating</option>
                        <option value="4.0">4.0+ Rating</option>
                        <option value="4.5">4.5+ Rating</option>
                      </select>
                    </div>
                  </div>
                </div>
                
                <button className="mt-4 bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg">
                  Search Hotels
                </button>
              </div>

              {/* Mock Hotel Results */}
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-semibold">Available Accommodations</h4>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span>Sort by:</span>
                    <select className="border border-gray-300 rounded px-2 py-1">
                      <option value="price">Price (Low to High)</option>
                      <option value="rating">Guest Rating</option>
                      <option value="distance">Distance to Center</option>
                      <option value="popularity">Popularity</option>
                    </select>
                  </div>
                </div>
                <div className="text-sm text-gray-600 mb-4">
                  ⚠️ These are demo results. In the live system, you would book externally and then add booking details.
                </div>
                
                {/* Hotel Option 1 */}
                <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-purple-100 text-purple-600 rounded-lg">
                        <Hotel className="h-6 w-6" />
                      </div>
                      <div>
                        <h5 className="font-semibold text-gray-900">Hotel des Grands Boulevards</h5>
                        <p className="text-gray-600">Boutique Hotel • 2nd Arrondissement</p>
                        <p className="text-sm text-gray-500">★★★★☆ 4.2 (1,240 reviews)</p>
                        <p className="text-sm text-gray-500">Free WiFi • Breakfast included • Gym</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-purple-600">$200</p>
                      <p className="text-sm text-gray-500">per night</p>
                      <p className="text-sm font-semibold text-gray-700">$1,400 total</p>
                      <button className="mt-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm">
                        Book External
                      </button>
                    </div>
                  </div>
                </div>

                {/* Hotel Option 2 */}
                <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-purple-100 text-purple-600 rounded-lg">
                        <Hotel className="h-6 w-6" />
                      </div>
                      <div>
                        <h5 className="font-semibold text-gray-900">Le Marais Boutique Hotel</h5>
                        <p className="text-gray-600">Historic District • 4th Arrondissement</p>
                        <p className="text-sm text-gray-500">★★★★★ 4.7 (892 reviews)</p>
                        <p className="text-sm text-gray-500">Free WiFi • Restaurant • Spa</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-purple-600">$280</p>
                      <p className="text-sm text-gray-500">per night</p>
                      <p className="text-sm font-semibold text-gray-700">$1,960 total</p>
                      <button className="mt-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm">
                        Book External
                      </button>
                    </div>
                  </div>
                </div>

                {/* Hotel Option 3 */}
                <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-purple-100 text-purple-600 rounded-lg">
                        <Hotel className="h-6 w-6" />
                      </div>
                      <div>
                        <h5 className="font-semibold text-gray-900">Budget Paris Inn</h5>
                        <p className="text-gray-600">Economy Hotel • 10th Arrondissement</p>
                        <p className="text-sm text-gray-500">★★★☆☆ 3.8 (2,156 reviews)</p>
                        <p className="text-sm text-gray-500">Free WiFi • 24/7 Reception</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-purple-600">$120</p>
                      <p className="text-sm text-gray-500">per night</p>
                      <p className="text-sm font-semibold text-gray-700">$840 total</p>
                      <button className="mt-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm">
                        Book External
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h5 className="font-medium text-yellow-800 mb-2">How it works:</h5>
                <ol className="text-sm text-yellow-700 space-y-1">
                  <li>1. Click "Book External" to be redirected to the hotel's booking site</li>
                  <li>2. Complete your reservation on their platform</li>
                  <li>3. Return here and use "Add Booking" to save your confirmation details</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Standalone Footer */}
      {isStandalone && (
        <footer className="bg-white border-t mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center">
              <div className="flex items-center justify-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">F</span>
                </div>
                <span className="text-xl font-bold text-gray-900">Farrin</span>
              </div>
              <p className="text-gray-600 mb-4">
                Your comprehensive travel companion for planning unforgettable international trips.
              </p>
              <p className="text-sm text-gray-500">
                This is a demo of what your trip itinerary could look like with Farrin.
              </p>
              <div className="mt-6">
                <button
                  onClick={() => window.open('/', '_blank')}
                  className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-medium"
                >
                  Start Planning Your Trip
                </button>
              </div>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
};

export default ItineraryView;