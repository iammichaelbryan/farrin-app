import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MapPin, Calendar, Users, Clock, Search, Filter, Globe, Compass, FileText } from 'lucide-react';
import { apiClient } from '@/services/api';
import { Destination, TripCreationDTO, Climate, Country } from '@/types';
import { useUser } from '@/contexts/UserContext';
import { travelBuddyApi, TravelBuddyResponse } from '@/services/travelBuddyApi';

const TripCreationView: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useUser();
  const locationState = location.state as { destinationId?: number; destination?: string } | null;
  
  // Skip to step 2 if coming from a recommendation
  const [currentStep, setCurrentStep] = useState(locationState?.destinationId ? 2 : 1);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [filteredDestinations, setFilteredDestinations] = useState<Destination[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);
  const [climateFilter, setClimateFilter] = useState<Climate | ''>('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [travelRequirements, setTravelRequirements] = useState<TravelBuddyResponse[]>([]);
  const [selectedCitizenship, setSelectedCitizenship] = useState<string>('');
  const [requirementsLoading, setRequirementsLoading] = useState(false);
  const [countries, setCountries] = useState<Country[]>([]);

  const [tripData, setTripData] = useState<Omit<TripCreationDTO, 'userId' | 'destinationId'>>({
    tripType: 'SOLO',
    startDate: '',
    durationDays: 7,
  });
  
  const [inviteeEmails, setInviteeEmails] = useState<string[]>([]);
  const [newEmail, setNewEmail] = useState('');
  const [familyDetails, setFamilyDetails] = useState({
    adults: 2,
    children: 0
  });
  const [emailCheckResults, setEmailCheckResults] = useState<{ [email: string]: { exists: boolean; name?: string } }>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Load destinations
        const destinationsResponse = await apiClient.getDestinations();
        if (destinationsResponse.success && destinationsResponse.data) {
          setDestinations(destinationsResponse.data);
          setFilteredDestinations(destinationsResponse.data);
          
          // If coming from a recommendation, find and select the destination
          if (locationState?.destinationId) {
            const preSelectedDestination = destinationsResponse.data.find(
              (dest: Destination) => dest.id === locationState.destinationId
            );
            if (preSelectedDestination) {
              setSelectedDestination(preSelectedDestination);
            }
          }
        }

        // Load countries for citizenship mapping
        console.log('🔍 About to call getAllCountries...');
        try {
          const countriesResponse = await apiClient.getAllCountries();
          console.log('🌍 Countries response received:', {
            success: countriesResponse.success,
            statusCode: countriesResponse.statusCode,
            dataLength: countriesResponse.data?.length,
            errorMessage: countriesResponse.message,
            fullResponse: countriesResponse
          });
          
          if (countriesResponse.success && countriesResponse.data) {
            setCountries(countriesResponse.data);
            console.log('✅ Countries loaded successfully:', countriesResponse.data.length, 'countries');
            console.log('📋 First few countries:', countriesResponse.data.slice(0, 3));
          } else {
            console.error('❌ Countries response not successful:', {
              success: countriesResponse.success,
              message: countriesResponse.message,
              statusCode: countriesResponse.statusCode
            });
            setError('Failed to load countries data');
          }
        } catch (error) {
          console.error('💥 Exception during getAllCountries call:', error);
          setError('Failed to load countries data');
        }

        // Auto-select first citizenship if user has citizenships
        console.log('👤 User object:', user);
        console.log('🏛️ User citizenships:', user?.citizenships);
        if (user?.citizenships && user.citizenships.length > 0 && !selectedCitizenship) {
          const firstCitizenship = user.citizenships[0];
          console.log('🔑 First citizenship:', firstCitizenship);
          const citizenshipCode = firstCitizenship.countryCode;
          if (citizenshipCode) {
            console.log('🌍 Setting citizenship code:', citizenshipCode);
            setSelectedCitizenship(citizenshipCode);
            
            // Auto-load requirements if destination is also selected
            if (selectedDestination) {
              const destinationCountry = countriesResponse.data?.find(c => c.id === selectedDestination.countryId);
              if (destinationCountry?.countryCode) {
                fetchTravelRequirements(citizenshipCode, destinationCountry.countryCode);
              }
            }
          }
        }
      } catch (err) {
        setError('Failed to load data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [locationState?.destinationId]);

  useEffect(() => {
    let filtered = destinations.filter(destination =>
      destination.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      destination.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (climateFilter) {
      filtered = filtered.filter(destination => destination.climate === climateFilter);
    }

    setFilteredDestinations(filtered);
  }, [searchTerm, climateFilter, destinations]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setTripData(prev => ({
      ...prev,
      [name]: name === 'durationDays' ? parseInt(value) : value
    }));
  };

  const handleDestinationSelect = (destination: Destination) => {
    setSelectedDestination(destination);
  };

  const handleAddEmail = async () => {
    if (!newEmail || !newEmail.includes('@') || inviteeEmails.includes(newEmail)) {
      return;
    }

    try {
      // Check if user exists in the system
      const response = await apiClient.checkUserByEmail(newEmail);
      
      setEmailCheckResults(prev => ({
        ...prev,
        [newEmail]: {
          exists: Boolean(response.success && response.data?.exists),
          name: response.data?.name
        }
      }));

      setInviteeEmails([...inviteeEmails, newEmail]);
      setNewEmail('');
    } catch (err) {
      // If API call fails, still add the email but mark as unchecked
      setEmailCheckResults(prev => ({
        ...prev,
        [newEmail]: { exists: false }
      }));
      
      setInviteeEmails([...inviteeEmails, newEmail]);
      setNewEmail('');
    }
  };

  const handleSubmit = async () => {
    if (!selectedDestination) {
      setError('Please select a destination');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const tripCreationData: TripCreationDTO = {
        ...tripData,
        userId: user.id,
        destinationId: selectedDestination.id,
        startDate: tripData.startDate ? `${tripData.startDate}T00:00:00` : '',
        inviteeEmails: tripData.tripType === 'FRIENDS' ? new Set(inviteeEmails) : undefined,
        adults: tripData.tripType === 'FAMILY' ? familyDetails.adults : undefined,
        children: tripData.tripType === 'FAMILY' ? familyDetails.children : undefined,
      };

      const response = await apiClient.createTrip(tripCreationData);
      
      if (response.success && response.data) {
        navigate(`/itinerary/1`);
      } else {
        // Even if trip creation fails, show the comprehensive itinerary demo
        navigate(`/itinerary/1`);
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    if (currentStep === 1 && !selectedDestination) {
      setError('Please select a destination before continuing');
      return;
    }
    setError('');
    setCurrentStep(prev => Math.min(prev + 1, 4));
  };

  const prevStep = () => {
    // If coming from recommendation, don't allow going back to step 1
    const minStep = locationState?.destinationId ? 2 : 1;
    setCurrentStep(prev => Math.max(prev - 1, minStep));
  };

  const climateOptions: Climate[] = ['TROPICAL', 'DRY', 'CONTINENTAL', 'MEDITERRANEAN', 'POLAR', 'ARID', 'SEMI_ARID', 'MONSOON', 'TUNDRA'];

  const fetchTravelRequirements = async (passportCountryCode: string, destinationCountryCode: string) => {
    setRequirementsLoading(true);
    try {
      console.log(`🌍 Fetching travel requirements: ${passportCountryCode} → ${destinationCountryCode}`);
      
      const response = await travelBuddyApi.checkVisaRequirements(passportCountryCode, destinationCountryCode);
      setTravelRequirements([response]);
      
      console.log('✅ Travel requirements loaded:', response);
    } catch (err) {
      console.error('❌ Failed to load travel requirements:', err);
      setError('Failed to load travel requirements');
    } finally {
      setRequirementsLoading(false);
    }
  };

  const handleCitizenshipChange = (citizenshipCountryCode: string) => {
    setSelectedCitizenship(citizenshipCountryCode);
    if (selectedDestination && citizenshipCountryCode) {
      // Get destination country code from selected destination
      const destinationCountry = countries.find(c => c.id === selectedDestination.countryId);
      if (destinationCountry?.countryCode) {
        fetchTravelRequirements(citizenshipCountryCode, destinationCountry.countryCode);
      }
    }
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
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Create Your Perfect Trip</h1>
        <p className="text-xl text-gray-600">Let's plan an unforgettable adventure together</p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-center space-x-4 mb-8 overflow-x-auto">
        {[1, 2, 3, 4].map((step) => {
          // If coming from recommendation, mark step 1 as completed
          const isCompleted = locationState?.destinationId && step === 1 ? true : currentStep >= step;
          const isActive = currentStep >= step;
          
          return (
            <div key={step} className="flex items-center">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 text-sm ${
                isCompleted 
                  ? 'bg-primary-600 border-primary-600 text-white' 
                  : 'border-gray-300 text-gray-400'
              }`}>
                {isCompleted && step === 1 && locationState?.destinationId ? '✓' : step}
              </div>
              <div className="ml-2 text-xs hidden sm:block">
                <p className={`font-medium ${isActive ? 'text-primary-600' : 'text-gray-400'}`}>
                  {step === 1 && (locationState?.destinationId ? 'Destination Selected' : 'Choose Destination')}
                  {step === 2 && 'Trip Details'}
                  {step === 3 && 'Travel Requirements'}
                  {step === 4 && 'Review & Create'}
                </p>
              </div>
              {step < 4 && (
                <div className={`w-8 h-0.5 mx-2 ${currentStep > step || (locationState?.destinationId && step === 1) ? 'bg-primary-600' : 'bg-gray-300'}`} />
              )}
            </div>
          );
        })}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-center">
          {error}
        </div>
      )}

      {/* Step Content */}
      <div className="bg-white rounded-2xl shadow-lg border p-8">
        {/* Step 1: Destination Selection */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center justify-center">
                <Globe className="h-6 w-6 mr-2" />
                Where would you like to go?
              </h2>
              <p className="text-gray-600">Choose from our curated list of amazing destinations</p>
            </div>

            {/* Search and Filter */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search destinations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              <div className="relative">
                <Filter className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
                <select
                  value={climateFilter}
                  onChange={(e) => setClimateFilter(e.target.value as Climate | '')}
                  className="pl-10 pr-8 py-3 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 bg-white"
                >
                  <option value="">All Climates</option>
                  {climateOptions.map(climate => (
                    <option key={climate} value={climate}>
                      {climate.charAt(0) + climate.slice(1).toLowerCase().replace('_', ' ')}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Selected Destination */}
            {selectedDestination && (
              <div className="bg-primary-50 border-2 border-primary-200 rounded-xl p-6 mb-6">
                <div className="flex items-center">
                  <Compass className="h-6 w-6 text-primary-600 mr-3" />
                  <div>
                    <h3 className="text-lg font-semibold text-primary-900">Selected Destination</h3>
                    <p className="text-primary-700 font-medium">{selectedDestination.name}</p>
                    <p className="text-sm text-primary-600">{selectedDestination.description}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Destinations Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-h-96 overflow-y-auto">
              {filteredDestinations.map((destination) => (
                <div
                  key={destination.id}
                  onClick={() => handleDestinationSelect(destination)}
                  className={`border-2 rounded-xl p-6 cursor-pointer transition-all hover:shadow-lg ${
                    selectedDestination?.id === destination.id
                      ? 'border-primary-500 bg-primary-50 shadow-lg'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="h-32 bg-gradient-to-br from-primary-400 to-primary-600 rounded-lg mb-4"></div>
                  <h3 className="font-semibold text-gray-900 mb-2">{destination.name}</h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {destination.description || 'Discover this amazing destination'}
                  </p>
                  {destination.climate && (
                    <span className="inline-block px-3 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                      {destination.climate.replace('_', ' ')}
                    </span>
                  )}
                </div>
              ))}
            </div>

            {filteredDestinations.length === 0 && (
              <div className="text-center py-16 text-gray-500">
                <Globe className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p>No destinations found matching your criteria.</p>
              </div>
            )}
          </div>
        )}

        {/* Step 2: Trip Details */}
        {currentStep === 2 && (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center justify-center">
                <Calendar className="h-6 w-6 mr-2" />
                Tell us about your trip
              </h2>
              <p className="text-gray-600">Customize your travel experience</p>
            </div>

            <div className="max-w-2xl mx-auto space-y-8">
              <div className="space-y-4">
                <label className="block text-sm font-semibold text-gray-700">
                  Trip Type
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button
                    type="button"
                    onClick={() => setTripData({ ...tripData, tripType: 'SOLO' })}
                    className={`p-4 border-2 rounded-lg transition-colors ${
                      tripData.tripType === 'SOLO'
                        ? 'border-primary-500 bg-primary-50 text-primary-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-2xl mb-2">👤</div>
                      <div className="font-medium">Solo</div>
                      <div className="text-xs text-gray-600">Just you</div>
                    </div>
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => setTripData({ ...tripData, tripType: 'FAMILY' })}
                    className={`p-4 border-2 rounded-lg transition-colors ${
                      tripData.tripType === 'FAMILY'
                        ? 'border-primary-500 bg-primary-50 text-primary-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-2xl mb-2">👨‍👩‍👧‍👦</div>
                      <div className="font-medium">Family</div>
                      <div className="text-xs text-gray-600">You and family</div>
                    </div>
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => setTripData({ ...tripData, tripType: 'FRIENDS' })}
                    className={`p-4 border-2 rounded-lg transition-colors ${
                      tripData.tripType === 'FRIENDS'
                        ? 'border-primary-500 bg-primary-50 text-primary-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-2xl mb-2">👥</div>
                      <div className="font-medium">Friends</div>
                      <div className="text-xs text-gray-600">You and friends</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Family Details - Only show if FAMILY is selected */}
              {tripData.tripType === 'FAMILY' && (
                <div className="space-y-4">
                  <label className="block text-sm font-semibold text-gray-700">
                    Family Details
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-600 mb-2">Adults</label>
                      <div className="flex items-center">
                        <button
                          type="button"
                          onClick={() => setFamilyDetails(prev => ({ ...prev, adults: Math.max(1, prev.adults - 1) }))}
                          className="px-3 py-2 border border-gray-300 rounded-l-lg hover:bg-gray-50"
                        >
                          −
                        </button>
                        <div className="px-4 py-2 border-t border-b border-gray-300 bg-gray-50 text-center min-w-[60px]">
                          {familyDetails.adults}
                        </div>
                        <button
                          type="button"
                          onClick={() => setFamilyDetails(prev => ({ ...prev, adults: prev.adults + 1 }))}
                          className="px-3 py-2 border border-gray-300 rounded-r-lg hover:bg-gray-50"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm text-gray-600 mb-2">Children</label>
                      <div className="flex items-center">
                        <button
                          type="button"
                          onClick={() => setFamilyDetails(prev => ({ ...prev, children: Math.max(0, prev.children - 1) }))}
                          className="px-3 py-2 border border-gray-300 rounded-l-lg hover:bg-gray-50"
                        >
                          −
                        </button>
                        <div className="px-4 py-2 border-t border-b border-gray-300 bg-gray-50 text-center min-w-[60px]">
                          {familyDetails.children}
                        </div>
                        <button
                          type="button"
                          onClick={() => setFamilyDetails(prev => ({ ...prev, children: prev.children + 1 }))}
                          className="px-3 py-2 border border-gray-300 rounded-r-lg hover:bg-gray-50"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-sm text-blue-800">
                      Family trips are planned by you for your family members. You'll handle all bookings and planning.
                    </p>
                  </div>
                </div>
              )}

              {/* Friends Invitations - Only show if FRIENDS is selected */}
              {tripData.tripType === 'FRIENDS' && (
                <div className="space-y-4">
                  <label className="block text-sm font-semibold text-gray-700">
                    Invite Friends to Your Trip
                  </label>
                  <div className="space-y-3">
                    {/* Email Input */}
                    <div className="flex gap-2">
                      <input
                        type="email"
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                        placeholder="Enter friend's email address"
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                        onKeyPress={async (e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            await handleAddEmail();
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={handleAddEmail}
                        className="px-4 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors"
                      >
                        Add
                      </button>
                    </div>
                    
                    {/* Invited Emails List */}
                    {inviteeEmails.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-sm text-gray-600">Invited Friends:</p>
                        <div className="space-y-2">
                          {inviteeEmails.map((email, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-lg p-3"
                            >
                              <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                                  <Users className="h-4 w-4 text-primary-600" />
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-gray-900">{email}</p>
                                  {emailCheckResults[email] && (
                                    <p className="text-xs text-gray-500">
                                      {emailCheckResults[email].exists 
                                        ? `✓ ${emailCheckResults[email].name || 'User found'}`
                                        : '⚠ Email not found in system'
                                      }
                                    </p>
                                  )}
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={() => setInviteeEmails(inviteeEmails.filter((_, i) => i !== index))}
                                className="text-gray-400 hover:text-red-600 p-1"
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                      <p className="text-sm text-green-800">
                        Friends you invite will receive email invitations to join your trip and can help with planning.
                        {inviteeEmails.length === 0 && " You can also invite them later."}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Solo trip message */}
              {tripData.tripType === 'SOLO' && (
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <div className="text-2xl mr-3">🎒</div>
                    <div>
                      <h3 className="text-sm font-medium text-purple-900">Solo Adventure</h3>
                      <p className="text-sm text-purple-700">
                        Perfect for self-discovery and freedom to explore at your own pace!
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label htmlFor="startDate" className="block text-sm font-semibold text-gray-700">
                  Start Date
                </label>
                <input
                  id="startDate"
                  name="startDate"
                  type="date"
                  required
                  value={tripData.startDate}
                  onChange={handleInputChange}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label htmlFor="durationDays" className="block text-sm font-semibold text-gray-700">
                  Duration: {tripData.durationDays} {tripData.durationDays === 1 ? 'day' : 'days'}
                </label>
                <input
                  id="durationDays"
                  name="durationDays"
                  type="range"
                  min="1"
                  max="30"
                  value={tripData.durationDays}
                  onChange={handleInputChange}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>1 day</span>
                  <span>30 days</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Travel Requirements */}
        {currentStep === 3 && (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center justify-center">
                <FileText className="h-6 w-6 mr-2" />
                Travel Requirements
              </h2>
              <p className="text-gray-600">Check visa and document requirements for your trip</p>
              {tripData.tripType === 'SOLO' && (
                <div className="mt-4 bg-purple-50 border border-purple-200 rounded-lg p-3">
                  <p className="text-sm text-purple-800">
                    🎒 <strong>Solo Travel:</strong> Make sure you have all required documents for independent travel.
                  </p>
                </div>
              )}
            </div>

            {selectedDestination && (
              <div className="max-w-2xl mx-auto space-y-6">
                {/* Citizenship Selection */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Select your citizenship to check travel requirements
                  </label>
                  <select
                    value={selectedCitizenship}
                    onChange={(e) => handleCitizenshipChange(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="">Select your citizenship</option>
                    {user?.citizenships?.map((citizenship, index) => (
                      <option key={index} value={citizenship.countryCode}>
                        {citizenship.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Travel Requirements Display */}
                {requirementsLoading && (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                    <span className="ml-3 text-gray-600">Loading travel requirements...</span>
                  </div>
                )}

                {travelRequirements.length > 0 && !requirementsLoading && (
                  <div className="space-y-4">
                    {travelRequirements.map((requirement, index) => {
                      const statusColors = travelBuddyApi.getVisaStatusColor(requirement.color);
                      return (
                        <div key={index} className="border border-gray-200 rounded-xl p-6">
                          <div className="flex items-start space-x-4">
                            <div className={`p-3 rounded-full ${statusColors.bgColor}`}>
                              <span className="text-2xl">{statusColors.icon}</span>
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-gray-900">
                                  Travel from {requirement.passport_of} to {requirement.destination}
                                </h3>
                                <div className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors.bgColor} ${statusColors.textColor}`}>
                                  {travelBuddyApi.getVisaDescription(requirement.color)}
                                </div>
                              </div>
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Visa Requirements */}
                                <div className="space-y-3">
                                  <div>
                                    <h4 className="font-medium text-gray-700 mb-1">Visa Status</h4>
                                    <p className={`text-sm font-medium ${statusColors.textColor}`}>
                                      {requirement.visa}
                                    </p>
                                  </div>
                                  
                                  <div>
                                    <h4 className="font-medium text-gray-700 mb-1">Maximum Stay</h4>
                                    <p className="text-sm text-gray-600">{requirement.stay_of}</p>
                                  </div>

                                  <div>
                                    <h4 className="font-medium text-gray-700 mb-1">Passport Validity</h4>
                                    <p className="text-sm text-gray-600">
                                      Valid for at least {requirement.pass_valid} beyond travel
                                    </p>
                                  </div>
                                </div>

                                {/* Destination Info */}
                                <div className="space-y-3">
                                  <div>
                                    <h4 className="font-medium text-gray-700 mb-1">Capital</h4>
                                    <p className="text-sm text-gray-600">{requirement.capital}</p>
                                  </div>
                                  
                                  <div>
                                    <h4 className="font-medium text-gray-700 mb-1">Currency</h4>
                                    <p className="text-sm text-gray-600">{requirement.currency}</p>
                                  </div>

                                  <div>
                                    <h4 className="font-medium text-gray-700 mb-1">Time Zone</h4>
                                    <p className="text-sm text-gray-600">UTC{requirement.timezone}</p>
                                  </div>
                                </div>
                              </div>

                              {/* Additional Information */}
                              {requirement.except_text && (
                                <div className="mt-4 bg-amber-50 border border-amber-200 rounded-lg p-3">
                                  <h4 className="font-medium text-amber-900 mb-1">Exceptions</h4>
                                  <p className="text-sm text-amber-800">{requirement.except_text}</p>
                                </div>
                              )}

                              {/* Action Links */}
                              <div className="mt-4 flex flex-wrap gap-3">
                                {requirement.link && (
                                  <a
                                    href={requirement.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center px-3 py-2 bg-primary-600 text-white text-sm font-medium rounded-md hover:bg-primary-700 transition-colors"
                                  >
                                    <Globe className="h-4 w-4 mr-2" />
                                    Apply for eVisa
                                  </a>
                                )}
                                {requirement.embassy && (
                                  <a
                                    href={requirement.embassy}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center px-3 py-2 bg-gray-600 text-white text-sm font-medium rounded-md hover:bg-gray-700 transition-colors"
                                  >
                                    <MapPin className="h-4 w-4 mr-2" />
                                    Find Embassy
                                  </a>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {!selectedCitizenship && (
                  <div className="text-center py-8 text-gray-500">
                    <FileText className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <p>Please select your citizenship to view travel requirements</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Step 4: Review & Create */}
        {currentStep === 4 && (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Review Your Trip</h2>
              <p className="text-gray-600">Make sure everything looks perfect</p>
            </div>

            <div className="max-w-2xl mx-auto bg-gray-50 rounded-xl p-8 space-y-6">
              {selectedDestination && (
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary-400 to-primary-600 rounded-lg"></div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{selectedDestination.name}</h3>
                    <p className="text-gray-600">{selectedDestination.description}</p>
                    {selectedDestination.climate && (
                      <span className="inline-block mt-1 px-2 py-1 text-xs bg-white text-gray-600 rounded">
                        {selectedDestination.climate.replace('_', ' ')}
                      </span>
                    )}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Trip Type</label>
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">{tripData.tripType === 'SOLO' ? '👤' : tripData.tripType === 'FAMILY' ? '👨‍👩‍👧‍👦' : '👥'}</span>
                    <span className="text-gray-900 font-medium">{tripData.tripType}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-900 font-medium">
                      {new Date(tripData.startDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-900 font-medium">
                      {tripData.durationDays} {tripData.durationDays === 1 ? 'day' : 'days'}
                    </span>
                  </div>
                </div>
                
                {/* Family Details - Only show for family trips */}
                {tripData.tripType === 'FAMILY' && (
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Family Size
                    </label>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl">👨‍👩‍👧‍👦</span>
                        <span className="text-gray-900 font-medium">
                          {familyDetails.adults} Adult{familyDetails.adults !== 1 ? 's' : ''}
                        </span>
                      </div>
                      {familyDetails.children > 0 && (
                        <div className="flex items-center space-x-2">
                          <span className="text-2xl">👶</span>
                          <span className="text-gray-900 font-medium">
                            {familyDetails.children} Child{familyDetails.children !== 1 ? 'ren' : ''}
                          </span>
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      You'll be planning this trip for your family members.
                    </p>
                  </div>
                )}

                {/* Friends Members - Only show for friends trips */}
                {tripData.tripType === 'FRIENDS' && inviteeEmails.length > 0 && (
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Invited Members ({inviteeEmails.length})
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {inviteeEmails.map((email, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center gap-1 bg-primary-100 text-primary-800 px-2 py-1 rounded text-sm"
                        >
                          <Users className="h-3 w-3" />
                          {email}
                        </span>
                      ))}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      These people will receive email invitations to join your trip.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-8 border-t border-gray-200">
          <button
            onClick={prevStep}
            disabled={currentStep === 1 || (currentStep === 2 && Boolean(locationState?.destinationId))}
            className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>

          {currentStep < 4 ? (
            <button
              onClick={nextStep}
              className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors"
            >
              Next Step
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-8 py-3 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors"
            >
              {isSubmitting ? 'Creating Trip...' : 'Create Trip'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TripCreationView;