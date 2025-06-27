import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, QuestionnaireData, Preference } from '@/types';
import { apiClient } from '@/services/api';

interface UserContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  preferences: Preference | null;
  questionnaireData: QuestionnaireData | null;
  login: (userData: User) => void;
  logout: () => void;
  updateUser: (userData: Partial<User>) => Promise<boolean>;
  updatePreferences: (preferences: Partial<Preference>) => Promise<boolean>;
  saveQuestionnaireData: (data: QuestionnaireData) => Promise<boolean>;
  refreshUserData: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [preferences, setPreferences] = useState<Preference | null>(null);
  const [questionnaireData, setQuestionnaireData] = useState<QuestionnaireData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user;

  // Initialize user data from localStorage on mount
  useEffect(() => {
    const initializeUser = async () => {
      try {
        const storedUser = localStorage.getItem('user');
        const storedToken = localStorage.getItem('authToken');
        const storedPreferences = localStorage.getItem('userPreferences');
        const storedQuestionnaireData = localStorage.getItem('questionnaireData');
        
        if (storedUser && storedToken) {
          const userData = JSON.parse(storedUser);
          setUser(userData);
          
          // Load preferences from localStorage first for immediate display
          if (storedPreferences) {
            setPreferences(JSON.parse(storedPreferences));
          }
          
          // Load questionnaire data from localStorage
          if (storedQuestionnaireData) {
            setQuestionnaireData(JSON.parse(storedQuestionnaireData));
          }
          
          // Then try to fetch fresh user data and preferences
          await refreshUserData();
        }
      } catch (error) {
        console.error('Error initializing user:', error);
        // Clear invalid data
        localStorage.removeItem('user');
        localStorage.removeItem('authToken');
        localStorage.removeItem('userPreferences');
        localStorage.removeItem('questionnaireData');
      } finally {
        setIsLoading(false);
      }
    };

    initializeUser();
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    // Note: authToken should be set by the authentication flow
  };

  const logout = async () => {
    try {
      await apiClient.logout();
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      setUser(null);
      setPreferences(null);
      setQuestionnaireData(null);
      localStorage.removeItem('user');
      localStorage.removeItem('authToken');
      localStorage.removeItem('questionnaireData');
      localStorage.removeItem('userPreferences');
    }
  };

  const updateUser = async (userData: Partial<User>): Promise<boolean> => {
    if (!user) return false;

    try {
      const response = await apiClient.updateProfile(userData);
      if (response.success && response.data) {
        const updatedUser = { ...user, ...response.data };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error updating user:', error);
      return false;
    }
  };

  const updatePreferences = async (newPreferences: Partial<Preference>): Promise<boolean> => {
    if (!user) return false;

    try {
      const response = await apiClient.updatePreferences(newPreferences);
      if (response.success && response.data) {
        setPreferences(response.data);
        localStorage.setItem('userPreferences', JSON.stringify(response.data));
        
        // Refresh all user data to get the latest state
        await refreshUserData();
        
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error updating preferences:', error);
      return false;
    }
  };

  const saveQuestionnaireData = async (data: QuestionnaireData): Promise<boolean> => {
    if (!user) return false;

    try {
      // Convert questionnaire data to preference format
      const preferenceData: Partial<Preference> = {
        userId: user.id,
        accommodationBudget: data.accommodationBudget ? parseInt(data.accommodationBudget) : undefined,
        transportationBudget: data.transportationBudget ? parseInt(data.transportationBudget) : undefined,
        totalBudget: data.totalBudget ? parseInt(data.totalBudget) : undefined,
        avgTravelDuration: data.avgTravelDuration,
        transportPreference: data.transportPreference,
        primaryInterest: data.primaryInterest,
        primaryTravelStyle: data.preferredTravelStyle,
        preferredClimate: data.preferredClimate,
        preferredTravelSeason: data.preferredTravelSeason,
        preferredAccommodation: data.preferredAccommodation,
        dataSharing: data.dataSharing,
      };

      const response = await apiClient.updatePreferences(preferenceData);
      if (response.success && response.data) {
        setPreferences(response.data);
        setQuestionnaireData(data);
        localStorage.setItem('userPreferences', JSON.stringify(response.data));
        localStorage.setItem('questionnaireData', JSON.stringify(data));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error saving questionnaire data:', error);
      return false;
    }
  };

  const refreshUserData = async (): Promise<void> => {
    if (!localStorage.getItem('authToken')) return;

    try {
      const [userResponse, preferencesResponse] = await Promise.all([
        apiClient.getUserProfile(),
        apiClient.getUserPreferences()
      ]);

      if (userResponse.success && userResponse.data) {
        setUser(userResponse.data);
        localStorage.setItem('user', JSON.stringify(userResponse.data));
      }

      if (preferencesResponse.success && preferencesResponse.data) {
        setPreferences(preferencesResponse.data);
        localStorage.setItem('userPreferences', JSON.stringify(preferencesResponse.data));
      }

      // Load questionnaire data from localStorage if available
      const storedQuestionnaireData = localStorage.getItem('questionnaireData');
      if (storedQuestionnaireData) {
        setQuestionnaireData(JSON.parse(storedQuestionnaireData));
      }
    } catch (error) {
      console.error('Error refreshing user data:', error);
    }
  };

  // Helper function to convert budget range to numbers
  const getBudgetRange = (budgetRange: string) => {
    switch (budgetRange) {
      case 'BUDGET':
        return { min: 0, max: 1000 };
      case 'MID_RANGE':
        return { min: 1000, max: 5000 };
      case 'LUXURY':
        return { min: 5000, max: 15000 };
      case 'ULTRA_LUXURY':
        return { min: 15000, max: 100000 };
      default:
        return { min: 1000, max: 5000 };
    }
  };

  const value: UserContextType = {
    user,
    isAuthenticated,
    isLoading,
    preferences,
    questionnaireData,
    login,
    logout,
    updateUser,
    updatePreferences,
    saveQuestionnaireData,
    refreshUserData,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};