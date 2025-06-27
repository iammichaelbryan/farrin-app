import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Settings, Save, Camera, Shield, Globe, Heart, DollarSign, Compass, Calendar, Target, Star, Plus, Trash2, Edit3, X, MapPin, Plane } from 'lucide-react';
import { apiClient } from '@/services/api';
import { User as UserType, Preference, TravelGoal, BucketListItem, Country } from '@/types';
import { useUser } from '@/contexts/UserContext';

const ProfileView: React.FC = () => {
  const navigate = useNavigate();
  const { user: contextUser, preferences: contextPreferences, updateUser, updatePreferences, refreshUserData, isLoading: contextLoading } = useUser();

  // Helper function to calculate age from date of birth
  const calculateAge = (dob: string): number | null => {
    if (!dob) return null;
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeSection, setActiveSection] = useState<'personal' | 'preferences' | 'goals' | 'bucketlist' | 'pasttrips' | 'privacy'>('personal');
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});
  const [travelGoals, setTravelGoals] = useState<TravelGoal[]>([]);
  const [bucketListItems, setBucketListItems] = useState<BucketListItem[]>([]);
  const [pastTrips, setPastTrips] = useState<any[]>([]);
  const [showNewGoalForm, setShowNewGoalForm] = useState(false);
  const [showNewBucketForm, setShowNewBucketForm] = useState(false);
  const [showNewTripForm, setShowNewTripForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState<any>(null);
  const [countries, setCountries] = useState<Country[]>([]);
  const [destinations, setDestinations] = useState<any[]>([]);
  const [selectedCitizenships, setSelectedCitizenships] = useState<number[]>([]);
  const [isFormInitialized, setIsFormInitialized] = useState(false);

  const [profileForm, setProfileForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    gender: '' as '' | 'MALE' | 'FEMALE',
    dateOfBirth: '',
  });

  const [preferencesForm, setPreferencesForm] = useState({
    accommodationBudget: '',
    transportationBudget: '',
    totalBudget: '',
    primaryInterest: '' as '' | 'ADVENTURE' | 'RELAXATION' | 'CULTURAL_EXPERIENCE' | 'NATURE',
    primaryTravelStyle: '' as '' | 'CASUAL' | 'FREQUENT' | 'BUSINESS' | 'ENTHUSIAST' | 'ORGANIZER',
    preferredClimate: '' as '' | 'TROPICAL' | 'DRY' | 'CONTINENTAL' | 'POLAR' | 'MEDITERRANEAN' | 'ARID' | 'SEMI_ARID' | 'MONSOON' | 'TUNDRA',
    preferredTravelSeason: '' as '' | 'SPRING' | 'SUMMER' | 'AUTUMN' | 'WINTER',
    preferredAccommodation: '' as '' | 'HOTEL' | 'AIRBNB' | 'LODGE',
    avgTravelDuration: '',
    transportPreference: '' as '' | 'FLIGHTS',
    dataSharing: false,
  });

  // Auto-calculate total budget
  const calculateTotalBudget = () => {
    const accommodationBudget = parseInt(preferencesForm.accommodationBudget) || 0;
    const transportationBudget = parseInt(preferencesForm.transportationBudget) || 0;
    return accommodationBudget + transportationBudget;
  };

  const [newGoalForm, setNewGoalForm] = useState({
    name: '',
    description: '',
    targetDate: '',
    category: '' as '' | 'DESTINATION' | 'EXPERIENCE' | 'BUDGET' | 'CULTURAL' | 'ADVENTURE',
  });

  const [newBucketForm, setNewBucketForm] = useState({
    destinationId: '',
  });

  const [newTripForm, setNewTripForm] = useState({
    destinationId: '',
    startDate: '',
    endDate: '',
    rating: '5',
    totalCost: '',
  });

  useEffect(() => {
    // Initialize forms with context data only on first load or when explicitly requested
    if (contextUser && !isFormInitialized) {
      setProfileForm({
        firstName: contextUser.firstName || '',
        lastName: contextUser.lastName || '',
        email: contextUser.email || '',
        gender: contextUser.gender || '',
        dateOfBirth: contextUser.dateOfBirth || contextUser.dob || '',
      });

      // Initialize citizenships - prioritize existing citizenships array from backend
      if (contextUser.citizenships && contextUser.citizenships.length > 0) {
        setSelectedCitizenships(contextUser.citizenships.map(c => c.id));
      } else if (contextUser.citizenshipIds && contextUser.citizenshipIds.length > 0) {
        setSelectedCitizenships(contextUser.citizenshipIds);
      } else {
        setSelectedCitizenships([0]); // Start with one empty entry
      }
      
      setIsFormInitialized(true);
    }

    if (contextPreferences && !isFormInitialized) {
      setPreferencesForm({
        accommodationBudget: contextPreferences.accommodationBudget?.toString() || '',
        transportationBudget: contextPreferences.transportationBudget?.toString() || '',
        totalBudget: contextPreferences.totalBudget?.toString() || '',
        primaryInterest: contextPreferences.primaryInterest || '',
        primaryTravelStyle: contextPreferences.primaryTravelStyle || '',
        preferredClimate: contextPreferences.preferredClimate || '',
        preferredTravelSeason: contextPreferences.preferredTravelSeason || '',
        preferredAccommodation: contextPreferences.preferredAccommodation || '',
        avgTravelDuration: contextPreferences.avgTravelDuration?.toString() || '',
        transportPreference: contextPreferences.transportPreference || '',
        dataSharing: contextPreferences.dataSharing || false,
      });
    }

    // Load travel goals and bucket list from API
    if (contextUser) {
      const loadTravelData = async () => {
        try {
          // Load travel goals
          const goalsResponse = await apiClient.getTravelGoals(contextUser.id);
          if (goalsResponse.success && goalsResponse.data) {
            setTravelGoals(goalsResponse.data);
          }

          // Load bucket list
          const bucketListResponse = await apiClient.getBucketList(contextUser.id);
          if (bucketListResponse.success && bucketListResponse.data) {
            setBucketListItems(bucketListResponse.data);
          }

          // Load past trips
          const pastTripsResponse = await apiClient.getPastTrips(contextUser.id);
          if (pastTripsResponse.success && pastTripsResponse.data) {
            setPastTrips(pastTripsResponse.data);
          }
        } catch (error) {
          console.error('Failed to load travel data:', error);
        }
      };

      loadTravelData();
    }
  }, [contextUser, contextPreferences]);

  // Load countries and destinations on component mount
  useEffect(() => {
    const loadCountries = async () => {
      try {
        const response = await apiClient.getAllCountries();
        if (response.success && response.data) {
          setCountries(response.data);
        }
      } catch (error) {
        console.error('Failed to load countries:', error);
      }
    };

    const loadDestinations = async () => {
      try {
        const response = await apiClient.getAllDestinations();
        if (response.success && response.data) {
          setDestinations(response.data);
        }
      } catch (error) {
        console.error('Failed to load destinations:', error);
      }
    };

    loadCountries();
    loadDestinations();
  }, []);

  // Citizenship management functions
  const addCitizenship = () => {
    setSelectedCitizenships([...selectedCitizenships, 0]);
  };

  const removeCitizenship = (index: number) => {
    if (selectedCitizenships.length > 1) {
      const updatedCitizenships = selectedCitizenships.filter((_, i) => i !== index);
      setSelectedCitizenships(updatedCitizenships);
    }
  };

  const updateCitizenship = (index: number, countryId: number) => {
    const updatedCitizenships = selectedCitizenships.map((id, i) => 
      i === index ? countryId : id
    );
    setSelectedCitizenships(updatedCitizenships);
  };

  const validateProfileForm = () => {
    const errors: {[key: string]: string} = {};
    
    if (!profileForm.firstName.trim()) {
      errors.firstName = 'First name is required';
    }
    
    if (!profileForm.lastName.trim()) {
      errors.lastName = 'Last name is required';
    }
    
    if (!profileForm.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profileForm.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    if (!profileForm.dateOfBirth) {
      errors.dateOfBirth = 'Date of birth is required';
    }

    if (selectedCitizenships.filter(id => id > 0).length === 0) {
      errors.citizenship = 'At least one citizenship is required';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setValidationErrors({});

    if (!validateProfileForm()) {
      return;
    }

    setIsUpdating(true);

    try {
      const profileData = {
        ...profileForm,
        gender: profileForm.gender === '' ? undefined : profileForm.gender,
        citizenshipIds: selectedCitizenships.filter(id => id > 0)
      };
      const success = await updateUser(profileData);
      if (success) {
        setSuccess('Profile updated successfully');
        // Clear the success message after 3 seconds
        setTimeout(() => setSuccess(''), 3000);
        
        // Keep the form data in sync with what was just saved
        // No need to reinitialize, the form already has the correct data
      } else {
        setError('Failed to update profile');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setIsUpdating(false);
    }
  };

  const validatePreferencesForm = () => {
    const errors: {[key: string]: string} = {};
    
    const accommodationBudget = parseInt(preferencesForm.accommodationBudget);
    const transportationBudget = parseInt(preferencesForm.transportationBudget);
    const avgDuration = parseInt(preferencesForm.avgTravelDuration);
    
    if (preferencesForm.accommodationBudget && accommodationBudget < 0) {
      errors.accommodationBudget = 'Accommodation budget cannot be negative';
    }
    
    if (preferencesForm.transportationBudget && transportationBudget < 0) {
      errors.transportationBudget = 'Transportation budget cannot be negative';
    }
    
    if (preferencesForm.avgTravelDuration && avgDuration <= 0) {
      errors.avgTravelDuration = 'Average travel duration must be a positive number';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePreferencesSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setValidationErrors({});

    if (!validatePreferencesForm()) {
      return;
    }

    setIsUpdating(true);

    try {
      const preferencesData = {
        ...preferencesForm,
        accommodationBudget: preferencesForm.accommodationBudget ? parseInt(preferencesForm.accommodationBudget) : undefined,
        transportationBudget: preferencesForm.transportationBudget ? parseInt(preferencesForm.transportationBudget) : undefined,
        totalBudget: calculateTotalBudget(),
        avgTravelDuration: preferencesForm.avgTravelDuration ? parseInt(preferencesForm.avgTravelDuration) : undefined,
        primaryInterest: preferencesForm.primaryInterest === '' ? undefined : preferencesForm.primaryInterest,
        primaryTravelStyle: preferencesForm.primaryTravelStyle === '' ? undefined : preferencesForm.primaryTravelStyle,
        preferredClimate: preferencesForm.preferredClimate === '' ? undefined : preferencesForm.preferredClimate,
        preferredTravelSeason: preferencesForm.preferredTravelSeason === '' ? undefined : preferencesForm.preferredTravelSeason,
        preferredAccommodation: preferencesForm.preferredAccommodation === '' ? undefined : preferencesForm.preferredAccommodation,
        transportPreference: preferencesForm.transportPreference === '' ? undefined : preferencesForm.transportPreference,
      };

      const success = await updatePreferences(preferencesData);
      if (success) {
        setSuccess('Preferences updated successfully');
        // Clear the success message after 3 seconds
        setTimeout(() => setSuccess(''), 3000);
        
        // Keep the preferences form in sync with what was just saved
        // No need to reinitialize, the form already has the correct data
      } else {
        setError('Failed to update preferences');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleNewGoalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setValidationErrors({});

    if (!contextUser) {
      setError('User not authenticated');
      return;
    }

    if (!newGoalForm.name.trim()) {
      setValidationErrors({ name: 'Goal name is required' });
      return;
    }

    if (!newGoalForm.category) {
      setValidationErrors({ category: 'Goal category is required' });
      return;
    }

    if (!newGoalForm.description.trim()) {
      setValidationErrors({ description: 'Description is required' });
      return;
    }

    setIsUpdating(true);

    try {
      const goalData = {
        userId: contextUser.id,
        name: newGoalForm.name,
        description: newGoalForm.description,
        targetDate: newGoalForm.targetDate ? `${newGoalForm.targetDate}T00:00:00` : null,
        category: newGoalForm.category,
      };

      console.log('Sending goal data:', goalData); // Debug log
      const response = await apiClient.createTravelGoal(goalData);
      if (response.success && response.data) {
        // Add the new goal to the current list
        setTravelGoals([...travelGoals, response.data]);
        
        // Refresh user data to sync with backend
        await refreshUserData();
        
        // Reset form and close modal
        setNewGoalForm({
          name: '',
          description: '',
          targetDate: '',
          category: '',
        });
        setShowNewGoalForm(false);
        
        setSuccess('Travel goal added successfully');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError('Failed to add travel goal');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleNewBucketSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setValidationErrors({});

    if (!contextUser) {
      setError('User not authenticated');
      return;
    }

    if (!newBucketForm.destinationId) {
      setValidationErrors({ destinationId: 'Destination is required' });
      return;
    }


    setIsUpdating(true);

    try {
      const bucketData = {
        userId: contextUser.id,
        destinationId: parseInt(newBucketForm.destinationId),
      };

      const response = await apiClient.addToBucketList(bucketData);
      if (response.success && response.data) {
        // Add the new item to the current list
        setBucketListItems([...bucketListItems, response.data]);
        
        // Refresh user data to sync with backend
        await refreshUserData();
        
        // Reset form and close modal
        setNewBucketForm({
          destinationId: '',
        });
        setShowNewBucketForm(false);
        
        setSuccess('Destination added to bucket list successfully');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError('Failed to add destination to bucket list');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleNewTripSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setValidationErrors({});

    if (!contextUser) {
      setError('User not authenticated');
      return;
    }

    if (!newTripForm.destinationId) {
      setValidationErrors({ destinationId: 'Destination is required' });
      return;
    }

    if (!newTripForm.startDate) {
      setValidationErrors({ startDate: 'Start date is required' });
      return;
    }

    if (!newTripForm.endDate) {
      setValidationErrors({ endDate: 'End date is required' });
      return;
    }

    // Calculate duration
    const startDate = new Date(newTripForm.startDate);
    const endDate = new Date(newTripForm.endDate);
    const durationDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

    if (durationDays <= 0) {
      setValidationErrors({ endDate: 'End date must be after start date' });
      return;
    }

    setIsUpdating(true);

    try {
      const tripData = {
        userId: contextUser.id,
        destinationId: parseInt(newTripForm.destinationId),
        startDate: newTripForm.startDate || null,
        endDate: newTripForm.endDate || null,
        rating: newTripForm.rating ? parseInt(newTripForm.rating) : null,
        notes: null, // Could add a notes field later
        totalCost: newTripForm.totalCost ? parseInt(newTripForm.totalCost) : null,
      };

      const response = await apiClient.addToPastTrips(tripData);
      if (response.success && response.data) {
        // Refresh the past trips list to get the updated data from backend
        const pastTripsResponse = await apiClient.getPastTrips(contextUser.id);
        if (pastTripsResponse.success && pastTripsResponse.data) {
          setPastTrips(pastTripsResponse.data);
        }
        
        // Reset form and close modal
        setNewTripForm({
          destinationId: '',
          startDate: '',
          endDate: '',
          rating: '5',
          totalCost: '',
        });
        setShowNewTripForm(false);
        
        setSuccess('Past trip added successfully with rating');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError('Failed to add past trip');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeletePastTrip = async (tripId: number) => {
    if (!contextUser) return;

    if (confirm('Are you sure you want to delete this trip?')) {
      setIsUpdating(true);
      try {
        const response = await apiClient.deletePastTrip(tripId, contextUser.id);
        if (response.success) {
          setPastTrips(pastTrips.filter(trip => trip.id !== tripId));
          setSuccess('Trip deleted successfully');
          setTimeout(() => setSuccess(''), 3000);
        } else {
          setError('Failed to delete trip');
        }
      } catch (err) {
        setError('An unexpected error occurred');
      } finally {
        setIsUpdating(false);
      }
    }
  };

  const handleDeleteTravelGoal = async (goalId: number) => {
    if (!contextUser) return;

    if (confirm('Are you sure you want to delete this travel goal?')) {
      setIsUpdating(true);
      try {
        const response = await apiClient.deleteTravelGoal(goalId, contextUser.id);
        if (response.success) {
          setTravelGoals(travelGoals.filter(goal => goal.id !== goalId));
          setSuccess('Travel goal deleted successfully');
          setTimeout(() => setSuccess(''), 3000);
        } else {
          setError('Failed to delete travel goal');
        }
      } catch (err) {
        setError('An unexpected error occurred');
      } finally {
        setIsUpdating(false);
      }
    }
  };

  const handleEditTravelGoal = (goal: any) => {
    // Convert decimal progress (0.00-1.00) to percentage (0-100) for editing
    setEditingGoal({
      ...goal,
      progress: Math.round((goal.progress || 0) * 100)
    });
  };

  const handleUpdateGoalProgress = async (goalId: number, newProgress: number) => {
    if (!contextUser) return;

    setIsUpdating(true);
    try {
      const goalData = {
        userId: contextUser.id,
        progress: newProgress / 100, // Convert percentage (0-100) to decimal (0.00-1.00)
      };

      const response = await apiClient.updateTravelGoal(goalId, goalData);
      if (response.success) {
        // Update the goal in the local state with decimal value (what backend stores)
        setTravelGoals(travelGoals.map(goal => 
          goal.id === goalId 
            ? { ...goal, progress: newProgress / 100 }
            : goal
        ));
        setEditingGoal(null);
        setSuccess('Goal progress updated successfully');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError('Failed to update goal progress');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteBucketListItem = async (destinationId: number) => {
    if (!contextUser) return;

    if (confirm('Are you sure you want to remove this destination from your bucket list?')) {
      setIsUpdating(true);
      try {
        const response = await apiClient.removeFromBucketList(destinationId, contextUser.id);
        if (response.success) {
          setBucketListItems(bucketListItems.filter(item => item.id !== destinationId));
          setSuccess('Destination removed from bucket list');
          setTimeout(() => setSuccess(''), 3000);
        } else {
          setError('Failed to remove destination from bucket list');
        }
      } catch (err) {
        setError('An unexpected error occurred');
      } finally {
        setIsUpdating(false);
      }
    }
  };

  // Handler to start trip planning for a bucket list destination
  const handleStartTripPlan = (bucketListItem: BucketListItem) => {
    navigate('/trip-creation', { 
      state: { 
        destinationId: bucketListItem.destination.id,
        destination: bucketListItem.destination.name 
      } 
    });
  };

  // Handler for account deletion
  const handleDeleteAccount = async () => {
    if (!contextUser) return;

    // Step 1: Show warning modal and get confirmation
    const confirmed = window.confirm(
      "⚠️ WARNING: Account Deletion\n\n" +
      "This action will permanently delete your account and ALL associated data including:\n" +
      "• Personal information and preferences\n" +
      "• Travel goals and bucket list\n" +
      "• Past trips and travel history\n" +
      "• Trip plans and itineraries\n\n" +
      "This action CANNOT be undone!\n\n" +
      "Are you absolutely sure you want to delete your account?"
    );

    if (!confirmed) return;

    // Step 2: Get password confirmation
    const currentPassword = window.prompt(
      "To confirm account deletion, please enter your current password:"
    );

    if (!currentPassword) return;

    // Step 3: Final confirmation
    const finalConfirmed = window.confirm(
      "FINAL CONFIRMATION\n\n" +
      "This is your last chance to cancel.\n\n" +
      "Are you 100% sure you want to permanently delete your account?\n\n" +
      "Click OK to proceed with deletion or Cancel to abort."
    );

    if (!finalConfirmed) return;

    // Step 4: Process deletion
    setIsUpdating(true);
    setError('');
    setSuccess('');

    try {
      const response = await apiClient.deleteAccount(currentPassword);
      if (response.success) {
        // Clear all local data
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        
        // Show success message
        alert('✅ Account deleted successfully. You will now be redirected to the home page.');
        
        // Redirect to home page
        navigate('/');
      } else {
        setError(response.message || 'Account deletion failed. Please check your password and try again.');
      }
    } catch (err: any) {
      setError('An unexpected error occurred during account deletion. Please try again later.');
      console.error('Account deletion error:', err);
    } finally {
      setIsUpdating(false);
    }
  };

  if (contextLoading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const interestIcons = {
    ADVENTURE: '🏔️',
    RELAXATION: '🏖️',
    CULTURAL_EXPERIENCE: '🏛️',
    NATURE: '🌿'
  };

  const climateIcons = {
    TROPICAL: '🌴',
    DRY: '🏜️',
    CONTINENTAL: '🏙️',
    MEDITERRANEAN: '🌊',
    POLAR: '🧊',
    ARID: '🌵',
    SEMI_ARID: '🏞️',
    MONSOON: '🌧️',
    TUNDRA: '❄️'
  };

  const renderValidationError = (fieldName: string) => {
    if (validationErrors[fieldName]) {
      return (
        <p className="text-red-500 text-sm mt-1">{validationErrors[fieldName]}</p>
      );
    }
    return null;
  };

  return (
    <div className="max-w-6xl mx-auto px-4 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-2xl p-8 text-white">
        <div className="flex items-center space-x-6">
          <div className="relative">
            <div className="h-24 w-24 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <User className="h-12 w-12 text-white" />
            </div>
            <button className="absolute bottom-0 right-0 bg-white text-primary-600 rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow">
              <Camera className="h-4 w-4" />
            </button>
          </div>
          <div>
            <h1 className="text-3xl font-bold mb-2">
              {contextUser ? `${contextUser.firstName || 'Unknown'} ${contextUser.lastName || 'User'}` : 'Loading...'}
            </h1>
            <p className="text-primary-100 text-lg">{contextUser?.email}</p>
            <div className="flex items-center mt-3 space-x-4">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                contextUser?.isVerified 
                  ? 'bg-green-500 bg-opacity-20 text-green-100 border border-green-400 border-opacity-30' 
                  : 'bg-yellow-500 bg-opacity-20 text-yellow-100 border border-yellow-400 border-opacity-30'
              }`}>
                {contextUser?.isVerified ? '✓ Verified Account' : '⚠ Unverified Account'}
              </span>
              <span className="text-primary-200 text-sm">
                Member since {contextUser ? new Date(contextUser.createdAt).toLocaleDateString() : '...'}
              </span>
              {contextUser?.dob && (
                <span className="text-primary-200 text-sm">
                  Age {calculateAge(contextUser.dob)}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white rounded-xl shadow-sm border p-2">
        <nav className="flex space-x-1 overflow-x-auto">
          {[
            { id: 'personal', label: 'Personal Info', icon: User },
            { id: 'preferences', label: 'Preferences', icon: Settings },
            { id: 'goals', label: 'Travel Goals', icon: Target },
            { id: 'bucketlist', label: 'Bucket List', icon: Star },
            { id: 'pasttrips', label: 'Past Trips', icon: MapPin },
            { id: 'privacy', label: 'Privacy', icon: Shield }
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveSection(id as any)}
              className={`flex items-center px-4 py-3 rounded-lg font-medium transition-colors whitespace-nowrap ${
                activeSection === id
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <Icon className="h-4 w-4 mr-2" />
              {label}
            </button>
          ))}
        </nav>
      </div>

      {/* Messages */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg">
          {success}
        </div>
      )}

      {/* Content Sections */}
      {/* Personal Information */}
      {activeSection === 'personal' && (
        <div className="bg-white rounded-xl shadow-sm border p-8">
          <div className="flex items-center mb-8">
            <User className="h-6 w-6 text-primary-600 mr-3" />
            <h2 className="text-2xl font-semibold text-gray-900">Personal Information</h2>
          </div>
          
          <form onSubmit={handleProfileSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  required
                  value={profileForm.firstName}
                  onChange={(e) => setProfileForm({ ...profileForm, firstName: e.target.value })}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-primary-500 focus:border-primary-500 ${
                    validationErrors.firstName ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {renderValidationError('firstName')}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  required
                  value={profileForm.lastName}
                  onChange={(e) => setProfileForm({ ...profileForm, lastName: e.target.value })}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-primary-500 focus:border-primary-500 ${
                    validationErrors.lastName ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {renderValidationError('lastName')}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={profileForm.email}
                  onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-primary-500 focus:border-primary-500 ${
                    validationErrors.email ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {renderValidationError('email')}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gender
                </label>
                <select
                  value={profileForm.gender}
                  onChange={(e) => setProfileForm({ ...profileForm, gender: e.target.value as any })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="">Select gender</option>
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date of Birth
                </label>
                <input
                  type="date"
                  required
                  value={profileForm.dateOfBirth}
                  onChange={(e) => setProfileForm({ ...profileForm, dateOfBirth: e.target.value })}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-primary-500 focus:border-primary-500 ${
                    validationErrors.dateOfBirth ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {renderValidationError('dateOfBirth')}
              </div>

              <div className="md:col-span-2">
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Citizenship(s)
                  </label>
                  <button
                    type="button"
                    onClick={addCitizenship}
                    className="flex items-center text-primary-600 hover:text-primary-700 text-sm font-medium"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Citizenship
                  </button>
                </div>
                <div className="space-y-3">
                  {selectedCitizenships.map((countryId, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <select
                        value={countryId}
                        onChange={(e) => updateCitizenship(index, parseInt(e.target.value))}
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                        required={index === 0}
                      >
                        <option value={0}>Select country</option>
                        {countries
                          .sort((a, b) => a.name.localeCompare(b.name))
                          .map(country => (
                            <option key={country.id} value={country.id}>{country.name}</option>
                          ))}
                      </select>
                      {selectedCitizenships.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeCitizenship(index)}
                          className="p-2 text-red-500 hover:text-red-700"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Add all countries where you hold citizenship. This helps determine travel requirements.
                </p>
                {renderValidationError('citizenship')}
              </div>
            </div>

            <div className="flex justify-end pt-6 border-t border-gray-200">
              <button
                type="submit"
                disabled={isUpdating}
                className="bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white px-8 py-3 rounded-lg flex items-center space-x-2 transition-colors"
              >
                <Save className="h-4 w-4" />
                <span>{isUpdating ? 'Saving...' : 'Save Changes'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Travel Preferences */}
      {activeSection === 'preferences' && (
        <div className="space-y-8">
          <div className="bg-white rounded-xl shadow-sm border p-8">
            <div className="flex items-center mb-8">
              <Compass className="h-6 w-6 text-primary-600 mr-3" />
              <h2 className="text-2xl font-semibold text-gray-900">Travel Preferences</h2>
            </div>

            <form onSubmit={handlePreferencesSubmit} className="space-y-8">
              {/* Budget Section */}
              <div className="bg-gray-50 rounded-xl p-6">
                <div className="flex items-center mb-6">
                  <DollarSign className="h-5 w-5 text-green-600 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-900">Budget Range</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Accommodation Budget ($)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={preferencesForm.accommodationBudget}
                      onChange={(e) => setPreferencesForm({ ...preferencesForm, accommodationBudget: e.target.value })}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-primary-500 focus:border-primary-500 ${
                        validationErrors.accommodationBudget ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="e.g., 2000"
                    />
                    {renderValidationError('accommodationBudget')}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Transportation Budget ($)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={preferencesForm.transportationBudget}
                      onChange={(e) => setPreferencesForm({ ...preferencesForm, transportationBudget: e.target.value })}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-primary-500 focus:border-primary-500 ${
                        validationErrors.transportationBudget ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="e.g., 1500"
                    />
                    {renderValidationError('transportationBudget')}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Total Budget ($)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={calculateTotalBudget()}
                      readOnly
                      className="w-full px-4 py-3 border rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed border-gray-300"
                      placeholder="Auto-calculated"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Automatically calculated from accommodation + transportation budgets
                    </p>
                  </div>
                </div>
              </div>

              {/* Interests & Style */}
              <div className="bg-gray-50 rounded-xl p-6">
                <div className="flex items-center mb-6">
                  <Heart className="h-5 w-5 text-red-600 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-900">Travel Style & Interests</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Primary Interest
                    </label>
                    <select
                      value={preferencesForm.primaryInterest}
                      onChange={(e) => setPreferencesForm({ ...preferencesForm, primaryInterest: e.target.value as any })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="">Select interest</option>
                      <option value="ADVENTURE">🏔️ Adventure</option>
                      <option value="RELAXATION">🏖️ Relaxation</option>
                      <option value="CULTURAL_EXPERIENCE">🏛️ Cultural Experience</option>
                      <option value="NATURE">🌿 Nature</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Travel Style
                    </label>
                    <select
                      value={preferencesForm.primaryTravelStyle}
                      onChange={(e) => setPreferencesForm({ ...preferencesForm, primaryTravelStyle: e.target.value as any })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="">Select style</option>
                      <option value="CASUAL">🚶‍♂️ Casual</option>
                      <option value="FREQUENT">✈️ Frequent</option>
                      <option value="BUSINESS">💼 Business</option>
                      <option value="ENTHUSIAST">🎯 Enthusiast</option>
                      <option value="ORGANIZER">📋 Organizer</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Climate & Season */}
              <div className="bg-gray-50 rounded-xl p-6">
                <div className="flex items-center mb-6">
                  <Globe className="h-5 w-5 text-blue-600 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-900">Climate & Season Preferences</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Preferred Climate
                    </label>
                    <select
                      value={preferencesForm.preferredClimate}
                      onChange={(e) => setPreferencesForm({ ...preferencesForm, preferredClimate: e.target.value as any })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="">Select climate</option>
                      <option value="TROPICAL">🌴 Tropical</option>
                      <option value="DRY">🏜️ Dry</option>
                      <option value="CONTINENTAL">🏙️ Continental</option>
                      <option value="MEDITERRANEAN">🌊 Mediterranean</option>
                      <option value="POLAR">🧊 Polar</option>
                      <option value="ARID">🌵 Arid</option>
                      <option value="SEMI_ARID">🏞️ Semi-Arid</option>
                      <option value="MONSOON">🌧️ Monsoon</option>
                      <option value="TUNDRA">❄️ Tundra</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Preferred Season
                    </label>
                    <select
                      value={preferencesForm.preferredTravelSeason}
                      onChange={(e) => setPreferencesForm({ ...preferencesForm, preferredTravelSeason: e.target.value as any })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="">Select season</option>
                      <option value="SPRING">🌸 Spring</option>
                      <option value="SUMMER">☀️ Summer</option>
                      <option value="AUTUMN">🍂 Autumn</option>
                      <option value="WINTER">❄️ Winter</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Preferred Accommodation
                    </label>
                    <select
                      value={preferencesForm.preferredAccommodation}
                      onChange={(e) => setPreferencesForm({ ...preferencesForm, preferredAccommodation: e.target.value as any })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="">Select accommodation</option>
                      <option value="HOTEL">🏨 Hotel</option>
                      <option value="AIRBNB">🏠 Airbnb</option>
                      <option value="LODGE">🏔️ Lodge</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Travel Duration & Transport */}
              <div className="bg-gray-50 rounded-xl p-6">
                <div className="flex items-center mb-6">
                  <Plane className="h-5 w-5 text-blue-600 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-900">Travel Duration & Transport</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Average Travel Duration (days)
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={preferencesForm.avgTravelDuration}
                      onChange={(e) => setPreferencesForm({ ...preferencesForm, avgTravelDuration: e.target.value })}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-primary-500 focus:border-primary-500 ${
                        validationErrors.avgTravelDuration ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="e.g., 7"
                    />
                    {renderValidationError('avgTravelDuration')}
                    <p className="text-xs text-gray-500 mt-1">
                      How many days do you typically travel for?
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Transport Preference
                    </label>
                    <select
                      value={preferencesForm.transportPreference}
                      onChange={(e) => setPreferencesForm({ ...preferencesForm, transportPreference: e.target.value as any })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="">Select transport</option>
                      <option value="FLIGHTS">✈️ Flights</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Data Sharing Settings */}
              <div className="bg-gray-50 rounded-xl p-6">
                <div className="flex items-center mb-6">
                  <Shield className="h-5 w-5 text-green-600 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-900">Privacy Settings</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Data Sharing</h4>
                      <p className="text-sm text-gray-600">Allow Farrin to use your travel data to improve recommendations for all users</p>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="dataSharing"
                        checked={preferencesForm.dataSharing}
                        onChange={(e) => setPreferencesForm({ ...preferencesForm, dataSharing: e.target.checked })}
                        className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 focus:ring-2"
                      />
                      <label htmlFor="dataSharing" className="ml-2 text-sm font-medium text-gray-900">
                        {preferencesForm.dataSharing ? 'Enabled' : 'Disabled'}
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-6 border-t border-gray-200">
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white px-8 py-3 rounded-lg flex items-center space-x-2 transition-colors"
                >
                  <Save className="h-4 w-4" />
                  <span>{isUpdating ? 'Saving...' : 'Save Preferences'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Travel Goals */}
      {activeSection === 'goals' && (
        <div className="bg-white rounded-xl shadow-sm border p-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <Target className="h-6 w-6 text-primary-600 mr-3" />
              <h2 className="text-2xl font-semibold text-gray-900">Travel Goals</h2>
            </div>
            <button
              onClick={() => setShowNewGoalForm(true)}
              className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>Add Goal</span>
            </button>
          </div>

          <div className="space-y-6">
            {travelGoals.map((goal) => (
              <div key={goal.id} className="border border-gray-200 rounded-xl p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{goal.name}</h3>
                    <p className="text-gray-600 text-sm mb-3">{goal.description}</p>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        goal.category === 'DESTINATION' ? 'bg-blue-100 text-blue-700' :
                        goal.category === 'ADVENTURE' ? 'bg-green-100 text-green-700' :
                        goal.category === 'CULTURAL' ? 'bg-purple-100 text-purple-700' :
                        goal.category === 'BUDGET' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {goal.category}
                      </span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        goal.isCompleted ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                      }`}>
                        {goal.isCompleted ? 'COMPLETED' : 'ACTIVE'}
                      </span>
                      {goal.targetDate && (
                        <span className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          Target: {new Date(goal.targetDate).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="ml-4 flex items-center space-x-2">
                    <button 
                      onClick={() => handleEditTravelGoal(goal)}
                      className="p-2 text-gray-400 hover:text-primary-600 transition-colors"
                    >
                      <Edit3 className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => handleDeleteTravelGoal(goal.id)}
                      className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                      disabled={isUpdating}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Progress Bar */}
                <div>
                  {editingGoal?.id === goal.id ? (
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">Update Progress</span>
                        <div className="flex items-center space-x-2">
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={editingGoal.progress || 0}
                            onChange={(e) => setEditingGoal({ ...editingGoal, progress: parseInt(e.target.value) })}
                            className="w-24"
                          />
                          <span className="text-sm text-gray-600 w-10">{editingGoal.progress || 0}%</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 mt-2">
                        <button
                          onClick={() => handleUpdateGoalProgress(goal.id, editingGoal.progress || 0)}
                          disabled={isUpdating}
                          className="px-3 py-1 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white rounded text-sm"
                        >
                          {isUpdating ? 'Saving...' : 'Save'}
                        </button>
                        <button
                          onClick={() => setEditingGoal(null)}
                          className="px-3 py-1 border border-gray-300 text-gray-700 rounded text-sm hover:bg-gray-50"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">Progress</span>
                        <span className="text-sm text-gray-600">{Math.round((goal.progress || 0) * 100)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${Math.round((goal.progress || 0) * 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {travelGoals.length === 0 && (
              <div className="text-center py-12">
                <Target className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No travel goals yet</h3>
                <p className="text-gray-600 mb-4">Set your first travel goal to start tracking your progress</p>
                <button
                  onClick={() => setShowNewGoalForm(true)}
                  className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg transition-colors"
                >
                  Add Your First Goal
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* New Goal Form Modal */}
      {showNewGoalForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Add New Travel Goal</h3>
              <button
                onClick={() => setShowNewGoalForm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleNewGoalSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Goal Name *
                </label>
                <input
                  type="text"
                  required
                  value={newGoalForm.name}
                  onChange={(e) => setNewGoalForm({ ...newGoalForm, name: e.target.value })}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-primary-500 focus:border-primary-500 ${
                    validationErrors.name ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="e.g., Visit 5 European countries"
                />
                {renderValidationError('name')}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  required
                  value={newGoalForm.description}
                  onChange={(e) => setNewGoalForm({ ...newGoalForm, description: e.target.value })}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-primary-500 focus:border-primary-500 ${
                    validationErrors.description ? 'border-red-300' : 'border-gray-300'
                  }`}
                  rows={3}
                  placeholder="Describe your travel goal..."
                />
                {renderValidationError('description')}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  required
                  value={newGoalForm.category}
                  onChange={(e) => setNewGoalForm({ ...newGoalForm, category: e.target.value as any })}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-primary-500 focus:border-primary-500 ${
                    validationErrors.category ? 'border-red-300' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select category</option>
                  <option value="DESTINATION">Destination</option>
                  <option value="ADVENTURE">Adventure</option>
                  <option value="CULTURAL">Cultural</option>
                  <option value="BUDGET">Budget</option>
                  <option value="EXPERIENCE">Experience</option>
                </select>
                {renderValidationError('category')}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Target Date
                </label>
                <input
                  type="date"
                  value={newGoalForm.targetDate}
                  onChange={(e) => setNewGoalForm({ ...newGoalForm, targetDate: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              <div className="flex items-center space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowNewGoalForm(false)}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="flex-1 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white px-4 py-3 rounded-lg transition-colors"
                >
                  {isUpdating ? 'Adding...' : 'Add Goal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bucket List */}
      {activeSection === 'bucketlist' && (
        <div className="bg-white rounded-xl shadow-sm border p-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <Star className="h-6 w-6 text-primary-600 mr-3" />
              <h2 className="text-2xl font-semibold text-gray-900">Travel Bucket List</h2>
            </div>
            <button
              onClick={() => setShowNewBucketForm(true)}
              className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>Add Destination</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bucketListItems.map((item) => (
              <div key={item.id} className="border-2 rounded-xl p-6 transition-all border-gray-200 hover:border-primary-200">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-2 text-gray-900">
                      {item.name}
                    </h3>
                    {item.description && (
                      <p className="text-sm mb-3 text-gray-600">
                        {item.description}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center space-x-2">
                    <button className="p-1 text-gray-400 hover:text-primary-600 transition-colors">
                      <Edit3 className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => handleDeleteBucketListItem(item.id)}
                      className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                      disabled={isUpdating}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <button
                    onClick={() => handleStartTripPlan(item)}
                    className="flex items-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium"
                    disabled={isUpdating}
                  >
                    <Plane className="h-4 w-4" />
                    <span>Start Trip Plan</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {bucketListItems.length === 0 && (
            <div className="text-center py-12">
              <Star className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Your bucket list is empty</h3>
              <p className="text-gray-600 mb-4">Add dream destinations you want to visit someday</p>
              <button
                onClick={() => setShowNewBucketForm(true)}
                className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg transition-colors"
              >
                Add Your First Destination
              </button>
            </div>
          )}
        </div>
      )}

      {/* New Bucket List Item Form Modal */}
      {showNewBucketForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Add New Destination</h3>
              <button
                onClick={() => setShowNewBucketForm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleNewBucketSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Destination *
                </label>
                <select
                  required
                  value={newBucketForm.destinationId}
                  onChange={(e) => setNewBucketForm({ ...newBucketForm, destinationId: e.target.value })}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-primary-500 focus:border-primary-500 ${
                    validationErrors.destinationId ? 'border-red-300' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select a destination</option>
                  {destinations
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .map(destination => (
                      <option key={destination.id} value={destination.id}>
                        {destination.name}
                        {destination.countryName && ` - ${destination.countryName}`}
                      </option>
                    ))}
                </select>
                {renderValidationError('destinationId')}
              </div>


              <div className="flex items-center space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowNewBucketForm(false)}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="flex-1 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white px-4 py-3 rounded-lg transition-colors"
                >
                  {isUpdating ? 'Adding...' : 'Add Destination'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Past Trips */}
      {activeSection === 'pasttrips' && (
        <div className="bg-white rounded-xl shadow-sm border p-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <MapPin className="h-6 w-6 text-primary-600 mr-3" />
              <h2 className="text-2xl font-semibold text-gray-900">Past Trips</h2>
            </div>
            <button
              onClick={() => setShowNewTripForm(true)}
              className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>Add Trip</span>
            </button>
          </div>

          <div className="space-y-6">
            {pastTrips.length > 0 ? (
              pastTrips.map((trip) => (
                <div key={trip.id} className="border border-gray-200 rounded-xl p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{trip.name || trip.destination}</h3>
                      {trip.description && (
                        <p className="text-gray-600 text-sm mb-3">{trip.description}</p>
                      )}
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                        <span className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {trip.durationDays} days
                        </span>
                        <span>{new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}</span>
                        {trip.totalCost && (
                          <span className="flex items-center">
                            <DollarSign className="h-4 w-4 mr-1" />
                            ${trip.totalCost}
                          </span>
                        )}
                      </div>

                      {trip.rating && (
                        <div className="flex items-center mb-3">
                          <span className="text-sm text-gray-500 mr-2">Rating:</span>
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={`h-4 w-4 ${i < trip.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                              />
                            ))}
                          </div>
                        </div>
                      )}

                      {trip.highlights && trip.highlights.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {trip.highlights.map((highlight: string, index: number) => (
                            <span 
                              key={index}
                              className="inline-block bg-primary-100 text-primary-800 px-2 py-1 rounded-md text-xs"
                            >
                              {highlight}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => handleDeletePastTrip(trip.id)}
                        className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                        disabled={isUpdating}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <MapPin className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No past trips recorded</h3>
                <p className="text-gray-600 mb-4">Keep track of the amazing places you've visited</p>
                <button 
                  onClick={() => setShowNewTripForm(true)}
                  className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg transition-colors"
                >
                  Add Your First Trip
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* New Trip Form Modal */}
      {showNewTripForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Add Past Trip</h3>
              <button
                onClick={() => setShowNewTripForm(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleNewTripSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Destination *
                </label>
                <select
                  required
                  value={newTripForm.destinationId}
                  onChange={(e) => setNewTripForm({ ...newTripForm, destinationId: e.target.value })}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-primary-500 focus:border-primary-500 ${
                    validationErrors.destinationId ? 'border-red-300' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select a destination</option>
                  {destinations
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .map(destination => (
                      <option key={destination.id} value={destination.id}>
                        {destination.name}
                        {destination.countryName && ` - ${destination.countryName}`}
                      </option>
                    ))}
                </select>
                {renderValidationError('destinationId')}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={newTripForm.startDate}
                    onChange={(e) => setNewTripForm({ ...newTripForm, startDate: e.target.value })}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-primary-500 focus:border-primary-500 ${
                      validationErrors.startDate ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {renderValidationError('startDate')}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={newTripForm.endDate}
                    onChange={(e) => setNewTripForm({ ...newTripForm, endDate: e.target.value })}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-primary-500 focus:border-primary-500 ${
                      validationErrors.endDate ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {renderValidationError('endDate')}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Total Cost ($)
                </label>
                <input
                  type="number"
                  value={newTripForm.totalCost}
                  onChange={(e) => setNewTripForm({ ...newTripForm, totalCost: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                  placeholder="e.g., 2800"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rating (1-5 stars)
                </label>
                <select
                  value={newTripForm.rating}
                  onChange={(e) => setNewTripForm({ ...newTripForm, rating: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="5">5 - Excellent</option>
                  <option value="4">4 - Very Good</option>
                  <option value="3">3 - Good</option>
                  <option value="2">2 - Fair</option>
                  <option value="1">1 - Poor</option>
                </select>
              </div>

              <div className="flex items-center space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowNewTripForm(false)}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="flex-1 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white px-4 py-3 rounded-lg transition-colors"
                >
                  {isUpdating ? 'Adding...' : 'Add Trip'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Privacy & Security */}
      {activeSection === 'privacy' && (
        <div className="bg-white rounded-xl shadow-sm border p-8">
          <div className="flex items-center mb-8">
            <Shield className="h-6 w-6 text-primary-600 mr-3" />
            <h2 className="text-2xl font-semibold text-gray-900">Privacy & Security</h2>
          </div>

          <div className="space-y-6">
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Account Security</h3>
              <div className="space-y-3">
                <button className="w-full text-left px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  Change Password
                </button>
                <button className="w-full text-left px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  Enable Two-Factor Authentication
                </button>
                <button className="w-full text-left px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  Download My Data
                </button>
              </div>
            </div>

            <div className="border border-red-200 rounded-lg p-6 bg-red-50">
              <h3 className="text-lg font-medium text-red-900 mb-4">Danger Zone</h3>
              <button 
                onClick={handleDeleteAccount}
                disabled={isUpdating}
                className="bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white px-6 py-2 rounded-lg transition-colors"
              >
                {isUpdating ? 'Deleting Account...' : 'Delete Account'}
              </button>
              <p className="text-sm text-red-600 mt-2">
                This action cannot be undone. All your data will be permanently deleted.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileView;