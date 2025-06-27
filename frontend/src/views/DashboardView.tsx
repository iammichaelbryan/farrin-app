import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, MapPin, Calendar, Plane, Clock, Star, Compass, TrendingUp, Target, CheckCircle, Trash2, Edit } from 'lucide-react';
import { apiClient } from '@/services/api';
import { useUser } from '@/contexts/UserContext';
import { Trip, Destination, TravelGoal } from '@/types';

const DashboardView: React.FC = () => {
  const { user, isAuthenticated, isLoading: userLoading } = useUser();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [recommendations, setRecommendations] = useState<Destination[]>([]);
  const [travelGoals, setTravelGoals] = useState<TravelGoal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'upcoming' | 'completed'>('all');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [tripToDelete, setTripToDelete] = useState<Trip | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user || !isAuthenticated) {
        setIsLoading(false);
        return;
      }

      try {
        console.log('🔄 Loading dashboard data for user:', user.id);
        const [tripsResponse, recommendationsResponse, goalsResponse] = await Promise.all([
          apiClient.getTrips(user.id),
          apiClient.getRecommendations(user.id),
          apiClient.getTravelGoals(user.id)
        ]);
        
        console.log('📊 Dashboard API responses:', {
          trips: tripsResponse,
          recommendations: recommendationsResponse,
          goals: goalsResponse
        });

        if (tripsResponse.success && tripsResponse.data) {
          // Backend returns Set<TripResponseDTO>, convert to array
          const trips = Array.isArray(tripsResponse.data) ? tripsResponse.data : Array.from(tripsResponse.data);
          setTrips(trips);
        }

        if (recommendationsResponse.success && recommendationsResponse.data) {
          // Backend returns RecommendationResponseDTO with destinations property
          const destinations = recommendationsResponse.data.destinations || [];
          setRecommendations(Array.isArray(destinations) ? destinations : Array.from(destinations));
        }

        // Load user's actual travel goals
        if (goalsResponse.success && goalsResponse.data) {
          // Backend returns Set<TravelGoal>, convert to array
          const goals = Array.isArray(goalsResponse.data) ? goalsResponse.data : Array.from(goalsResponse.data);
          setTravelGoals(goals);
        }
      } catch (err) {
        setError('Failed to load dashboard data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [user, isAuthenticated]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'UPCOMING': return 'bg-blue-100 text-blue-800';
      case 'COMPLETED': return 'bg-gray-100 text-gray-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredTrips = trips.filter(trip => {
    if (activeFilter === 'upcoming') return trip.status === 'UPCOMING';
    if (activeFilter === 'completed') return trip.status === 'COMPLETED';
    return true;
  });

  const stats = {
    total: trips.length,
    upcoming: trips.filter(t => t.status === 'UPCOMING').length,
    completed: trips.filter(t => t.status === 'COMPLETED').length,
    recommendations: recommendations.length
  };

  // Handle loading states
  if (userLoading || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // Handle unauthenticated state
  if (!isAuthenticated || !user) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Authentication Required</h2>
          <p className="text-gray-600">Please log in to view your dashboard.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Your Travel Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage and track your travel adventures</p>
        </div>
        <Link
          to="/trip-creation"
          className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <Plus className="h-5 w-5" />
          <span>Create New Trip Plan</span>
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <MapPin className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Trips</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Clock className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Upcoming</p>
              <p className="text-2xl font-bold text-gray-900">{stats.upcoming}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Plane className="h-8 w-8 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900">{stats.completed}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Compass className="h-8 w-8 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Recommendations</p>
              <p className="text-2xl font-bold text-gray-900">{stats.recommendations}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Dashboard Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Trips */}
        <div className="lg:col-span-2 space-y-6">
          {/* Filter Tabs */}
          <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
            {['all', 'upcoming', 'completed'].map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter as any)}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors capitalize ${
                  activeFilter === filter
                    ? 'bg-white text-primary-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {filter} Trips
              </button>
            ))}
          </div>

          {/* Trips List */}
          <div className="bg-white rounded-xl shadow-sm border">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Your Trips
              </h2>
            </div>
            <div className="p-6">
              {filteredTrips.length === 0 ? (
                <div className="text-center py-12">
                  <MapPin className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {activeFilter === 'all' ? 'No trips yet' : `No ${activeFilter} trips`}
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {activeFilter === 'all' 
                      ? 'Start planning your first adventure!' 
                      : 'Try changing the filter to see other trips.'}
                  </p>
                  {activeFilter === 'all' && (
                    <Link
                      to="/trip-creation"
                      className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg inline-flex items-center space-x-2"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Create Your First Trip Plan</span>
                    </Link>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredTrips.map((trip) => (
                    <div key={trip.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="text-2xl">
                            {trip.tripType === 'SOLO' ? '👤' : '👥'}
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">Trip #{trip.id}</h3>
                            <p className="text-sm text-gray-600">
                              {new Date(trip.startDate).toLocaleDateString()} • {trip.durationDays} days
                            </p>
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(trip.status)}`}>
                          {trip.status}
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div className="text-sm text-gray-600">
                          Created {new Date(trip.createdAt).toLocaleDateString()}
                        </div>
                        <div className="flex space-x-3">
                          <Link
                            to={`/itinerary/1`}
                            className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                          >
                            View Itinerary
                          </Link>
                          <button className="text-gray-400 hover:text-gray-600 p-1">
                            <Edit className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => {
                              setTripToDelete(trip);
                              setShowDeleteModal(true);
                            }}
                            className="text-gray-400 hover:text-red-600 p-1 transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Quick Actions & Activity */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              Quick Actions
            </h3>
            <div className="space-y-3">
              <Link
                to="/trip-creation"
                className="w-full text-left px-4 py-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors flex items-center"
              >
                <Plus className="h-4 w-4 mr-3 text-primary-600" />
                <span className="text-sm font-medium">Create New Trip Plan</span>
              </Link>
              <Link
                to="/profile"
                className="w-full text-left px-4 py-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors flex items-center"
              >
                <Star className="h-4 w-4 mr-3 text-yellow-600" />
                <span className="text-sm font-medium">Update Preferences</span>
              </Link>
              <Link
                to="/feed"
                className="w-full text-left px-4 py-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors flex items-center"
              >
                <Compass className="h-4 w-4 mr-3 text-green-600" />
                <span className="text-sm font-medium">Explore Destinations</span>
              </Link>
            </div>
          </div>

          {/* Recent Recommendations Preview */}
          {recommendations.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Star className="h-5 w-5 mr-2" />
                  Latest Recommendations
                </h3>
                <Link
                  to="/feed"
                  className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                >
                  View All
                </Link>
              </div>
              <div className="space-y-4">
                {recommendations.slice(0, 2).map((destination) => (
                  <div key={destination.id} className="border border-gray-200 rounded-lg overflow-hidden">
                    <div className="h-20 bg-gradient-to-r from-primary-400 to-primary-600"></div>
                    <div className="p-4">
                      <h4 className="font-medium text-gray-900 mb-1">{destination.name}</h4>
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                        {destination.description || 'Discover this amazing destination'}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                          {destination.climate}
                        </span>
                        <Link
                          to="/trip-creation"
                          className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                        >
                          Plan Trip
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Travel Goals Progress */}
          {travelGoals.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Target className="h-5 w-5 mr-2" />
                  Travel Goals
                </h3>
                <Link
                  to="/profile"
                  className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                >
                  View All
                </Link>
              </div>
              <div className="space-y-4">
                {travelGoals.slice(0, 3).map((goal) => (
                  <div key={goal.id} className="space-y-2">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 text-sm">{goal.name}</h4>
                        <p className="text-xs text-gray-600 mt-1 line-clamp-1">{goal.description}</p>
                      </div>
                      <span className="text-xs text-primary-600 font-medium ml-2">
                        {Math.round(goal.progress * 100)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${Math.round(goal.progress * 100)}%` }}
                      ></div>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className={`px-2 py-1 rounded ${
                        goal.category === 'DESTINATION' ? 'bg-blue-100 text-blue-600' :
                        goal.category === 'ADVENTURE' ? 'bg-orange-100 text-orange-600' :
                        goal.category === 'BUDGET' ? 'bg-green-100 text-green-600' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        {goal.category?.toLowerCase() || 'uncategorized'}
                      </span>
                      {goal.targetDate && (
                        <span className="text-gray-500">
                          Due {new Date(goal.targetDate).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Activity Feed */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center text-gray-600">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                <span>Trip #1 status updated to completed</span>
              </div>
              <div className="flex items-center text-gray-600">
                <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                <span>New recommendation: Tokyo, Japan</span>
              </div>
              <div className="flex items-center text-gray-600">
                <div className="w-2 h-2 bg-purple-400 rounded-full mr-3"></div>
                <span>Profile preferences updated</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Trip Modal */}
      {showDeleteModal && tripToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0">
                <Trash2 className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-medium text-gray-900">Delete Trip</h3>
              </div>
            </div>
            
            <div className="mb-6">
              <p className="text-sm text-gray-600">
                Are you sure you want to delete <strong>Trip #{tripToDelete.id}</strong>? This action cannot be undone and will permanently remove all associated itinerary data, bookings, and events.
              </p>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setTripToDelete(null);
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  if (!user || !tripToDelete) return;
                  
                  try {
                    setIsLoading(true);
                    const result = await apiClient.deleteTrip(tripToDelete.id);
                    
                    if (result.success) {
                      // Remove the deleted trip from the state
                      setTrips(trips.filter(t => t.id !== tripToDelete.id));
                      setShowDeleteModal(false);
                      setTripToDelete(null);
                      console.log('✅ Trip deleted successfully');
                    } else {
                      setError(result.message || 'Failed to delete trip');
                      console.error('❌ Failed to delete trip:', result.message);
                    }
                  } catch (err) {
                    setError('An error occurred while deleting the trip');
                    console.error('❌ Delete trip error:', err);
                  } finally {
                    setIsLoading(false);
                  }
                }}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors"
              >
                Delete Trip
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardView;