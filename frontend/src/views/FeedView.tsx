import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MapPin, Heart, Star, Plane, Thermometer, ArrowLeft, Plus, Info, X } from 'lucide-react';
import { apiClient } from '@/services/api';
import { Destination } from '@/types';
import { useUser } from '@/contexts/UserContext';

const FeedView: React.FC = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [likedDestinations, setLikedDestinations] = useState<Set<number>>(new Set());
  const [bucketListDestinations, setBucketListDestinations] = useState<Set<number>>(new Set());
  const [isProcessing, setIsProcessing] = useState<Set<number>>(new Set());
  const [showExplanationModal, setShowExplanationModal] = useState(false);
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);

  useEffect(() => {
    const fetchDestinations = async () => {
      if (!user?.id) {
        setError('Please log in to view personalized recommendations');
        setIsLoading(false);
        return;
      }

      try {
        const response = await apiClient.getRecommendations(user.id);
        if (response.success && response.data) {
          setDestinations(response.data);
          
          // Initialize liked and bucket list states
          const liked = new Set<number>();
          const bucket = new Set<number>();
          
          response.data.forEach((dest: Destination) => {
            if (dest.isLiked) liked.add(dest.id);
            if (dest.isInBucketList) bucket.add(dest.id);
          });
          
          setLikedDestinations(liked);
          setBucketListDestinations(bucket);
        }
      } catch (err) {
        setError('Failed to load destination recommendations');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDestinations();
  }, [user?.id]);

  const handleLikeDestination = async (destinationId: number) => {
    if (!user?.id || isProcessing.has(destinationId)) return;
    
    setIsProcessing(prev => new Set([...prev, destinationId]));
    
    try {
      const isCurrentlyLiked = likedDestinations.has(destinationId);
      
      // TODO: Add API call to like/unlike destination
      // const response = await apiClient.toggleDestinationLike(user.id, destinationId);
      
      // For now, just update local state
      const newLiked = new Set(likedDestinations);
      if (isCurrentlyLiked) {
        newLiked.delete(destinationId);
      } else {
        newLiked.add(destinationId);
      }
      setLikedDestinations(newLiked);
      
    } catch (err) {
      setError('Failed to update destination like status');
    } finally {
      setIsProcessing(prev => {
        const newSet = new Set(prev);
        newSet.delete(destinationId);
        return newSet;
      });
    }
  };

  const handleAddToBucketList = async (destinationId: number) => {
    if (!user?.id || isProcessing.has(destinationId)) return;
    
    setIsProcessing(prev => new Set([...prev, destinationId]));
    
    try {
      const isCurrentlyInBucket = bucketListDestinations.has(destinationId);
      
      if (isCurrentlyInBucket) {
        const response = await apiClient.removeFromBucketList(destinationId, user.id);
        if (response.success) {
          setBucketListDestinations(prev => {
            const newSet = new Set(prev);
            newSet.delete(destinationId);
            return newSet;
          });
        }
      } else {
        const response = await apiClient.addToBucketList({ 
          userId: user.id, 
          destinationId: destinationId 
        });
        if (response.success) {
          setBucketListDestinations(prev => new Set([...prev, destinationId]));
        }
      }
      
    } catch (err) {
      setError('Failed to update bucket list');
    } finally {
      setIsProcessing(prev => {
        const newSet = new Set(prev);
        newSet.delete(destinationId);
        return newSet;
      });
    }
  };

  const handleStartTripPlan = (destination: Destination) => {
    navigate('/trip-creation', { 
      state: { 
        destinationId: destination.id,
        destinationName: destination.name,
        preSelected: true
      } 
    });
  };

  const handleShowExplanation = (destination: Destination) => {
    setSelectedDestination(destination);
    setShowExplanationModal(true);
  };

  const handleCloseExplanation = () => {
    setShowExplanationModal(false);
    setSelectedDestination(null);
  };


  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <Link
            to="/dashboard"
            className="flex items-center text-primary-600 hover:text-primary-700"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Dashboard
          </Link>
        </div>
        
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Your Personalized Feed</h1>
          <p className="text-gray-600 mt-1">AI-powered destination recommendations based on your preferences and travel history</p>
          {destinations.length > 0 && (
            <p className="text-primary-600 text-sm mt-2">
              ✨ {destinations.length} destinations curated just for you
            </p>
          )}
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
          {error}
        </div>
      )}


      {/* Destinations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {destinations.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <MapPin className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No recommendations yet</h3>
            <p className="text-gray-600">Complete your profile and preferences to get personalized recommendations</p>
          </div>
        ) : (
          destinations.map((destination) => (
            <div key={destination.id} className="bg-white rounded-xl shadow-sm border overflow-hidden hover:shadow-md transition-shadow">
              {/* Destination Image */}
              <div className="h-48 bg-gradient-to-r from-primary-400 to-primary-600 relative">
                {destination.imageUrl ? (
                  <img 
                    src={destination.imageUrl} 
                    alt={destination.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <MapPin className="h-12 w-12 text-white opacity-50" />
                  </div>
                )}
                
                {/* Action Buttons */}
                <div className="absolute top-4 right-4 flex space-x-2">
                  {/* Like Button */}
                  <button
                    onClick={() => handleLikeDestination(destination.id)}
                    disabled={isProcessing.has(destination.id)}
                    className="p-2 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors disabled:opacity-50"
                  >
                    <Heart 
                      className={`h-5 w-5 ${
                        likedDestinations.has(destination.id) 
                          ? 'text-red-500 fill-red-500' 
                          : 'text-white'
                      }`} 
                    />
                  </button>
                  
                  {/* Add to Bucket List Button */}
                  <button
                    onClick={() => handleAddToBucketList(destination.id)}
                    disabled={isProcessing.has(destination.id)}
                    className="p-2 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors disabled:opacity-50"
                  >
                    <Plus 
                      className={`h-5 w-5 ${
                        bucketListDestinations.has(destination.id) 
                          ? 'text-green-500 fill-green-500' 
                          : 'text-white'
                      }`} 
                    />
                  </button>
                </div>

                {/* Travel Advisory Badge */}
                {destination.travelAdvisory && (
                  <div className="absolute bottom-4 left-4">
                    <span className="bg-yellow-500 text-yellow-900 text-xs font-medium px-2 py-1 rounded">
                      {destination.travelAdvisory}
                    </span>
                  </div>
                )}
              </div>

              {/* Destination Content */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{destination.name}</h3>
                    <p className="text-sm text-gray-500">{destination.countryName}</p>
                  </div>
                  <div className="flex items-center ml-2 space-x-3">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                      <span className="text-sm text-gray-600 ml-1">
                        {destination.averageRating?.toFixed(1) || '4.5'}
                      </span>
                    </div>
                    {destination.confidence && (
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                        destination.confidence === 'High' ? 'bg-green-100 text-green-800' :
                        destination.confidence === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {destination.confidence} Match
                      </div>
                    )}
                    {/* Explanation Info Icon */}
                    {destination.explanation && (
                      <button
                        onClick={() => handleShowExplanation(destination)}
                        className="p-1 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-600 transition-colors"
                        title="Why was this recommended?"
                      >
                        <Info className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>

                {destination.explanation ? (
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {destination.explanation}
                  </p>
                ) : destination.description && (
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {destination.description}
                  </p>
                )}

                {/* Climate Info */}
                {destination.climate && (
                  <div className="flex items-center gap-2 mb-4 text-sm text-gray-500">
                    <Thermometer className="h-4 w-4" />
                    <span>{destination.climate.replace('_', ' ').toLowerCase()}</span>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleStartTripPlan(destination)}
                    className="flex-1 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center justify-center"
                  >
                    <Plane className="h-4 w-4 mr-2" />
                    Start Trip Plan
                  </button>
                </div>
                
                {/* Status Indicators */}
                <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
                  <div className="flex items-center space-x-3">
                    {likedDestinations.has(destination.id) && (
                      <span className="flex items-center text-red-600">
                        <Heart className="h-3 w-3 mr-1 fill-current" />
                        Liked
                      </span>
                    )}
                    {bucketListDestinations.has(destination.id) && (
                      <span className="flex items-center text-green-600">
                        <Plus className="h-3 w-3 mr-1" />
                        In Bucket List
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    {destination.probability && (
                      <span className="text-primary-600 font-medium">
                        {Math.round(destination.probability * 100)}% match
                      </span>
                    )}
                    {destination.rank && (
                      <span className="bg-primary-100 text-primary-700 px-2 py-1 rounded">
                        #{destination.rank}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* AI Recommendation Info */}
      {destinations.length > 0 && (
        <div className="text-center">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-blue-800 text-sm">
              🤖 <strong>AI-Powered Recommendations:</strong> These destinations are personally selected for you based on your preferences, travel history, and demographic data using our advanced machine learning model.
            </p>
          </div>
        </div>
      )}

      {/* Explanation Modal */}
      {showExplanationModal && selectedDestination && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900">
                Why {selectedDestination.name}?
              </h2>
              <button
                onClick={handleCloseExplanation}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {/* AI Explanation */}
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
                  🤖 AI Recommendation Explanation
                </h3>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-gray-700 leading-relaxed">
                    {selectedDestination.explanation}
                  </p>
                </div>
              </div>

              {/* Confidence Score */}
              {selectedDestination.confidence && (
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Confidence Level</h3>
                  <div className="flex items-center space-x-3">
                    <div className={`px-4 py-2 rounded-full text-sm font-medium ${
                      selectedDestination.confidence === 'High' ? 'bg-green-100 text-green-800' :
                      selectedDestination.confidence === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {selectedDestination.confidence} Confidence
                    </div>
                    {selectedDestination.probability && (
                      <span className="text-gray-600 text-sm">
                        ({Math.round(selectedDestination.probability * 100)}% match)
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Model Details */}
              {selectedDestination.shapDetails && Object.keys(selectedDestination.shapDetails).length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-3">What Influenced This Recommendation</h3>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {Object.entries(selectedDestination.shapDetails).map(([key, value]) => (
                        <div key={key} className="flex justify-between items-center">
                          <span className="text-gray-600 text-sm capitalize">
                            {key.replace(/_/g, ' ')}:
                          </span>
                          <span className="text-gray-900 text-sm font-medium">
                            {typeof value === 'number' ? `${(value * 100).toFixed(1)}%` : String(value)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Destination Info */}
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Destination Details</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span>{selectedDestination.countryName}</span>
                  </div>
                  {selectedDestination.climate && (
                    <div className="flex items-center space-x-2">
                      <Thermometer className="h-4 w-4 text-gray-400" />
                      <span>{selectedDestination.climate.replace('_', ' ').toLowerCase()}</span>
                    </div>
                  )}
                  {selectedDestination.averageRating && (
                    <div className="flex items-center space-x-2">
                      <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                      <span>{selectedDestination.averageRating.toFixed(1)} / 5.0 rating</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    handleCloseExplanation();
                    handleStartTripPlan(selectedDestination);
                  }}
                  className="flex-1 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center justify-center"
                >
                  <Plane className="h-4 w-4 mr-2" />
                  Start Trip Plan
                </button>
                <button
                  onClick={handleCloseExplanation}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md text-sm font-medium transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeedView;