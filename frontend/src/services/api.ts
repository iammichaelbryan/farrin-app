import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { 
  User, 
  LoginDTO, 
  RegisterDTO, 
  PasswordResetDTO,
  UserResponseDTO,
  Trip, 
  TripCreationDTO, 
  Destination, 
  Preference,
  Itinerary,
  Event,
  APIResponse,
  HTTPResponse
} from '@/types';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: (import.meta as any).env?.DEV ? 'http://localhost:8081' : '/api',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('🔄 Connecting to real API backend at http://localhost:8081');
    console.log('🔐 All data will be fetched from database - no mock data used');

    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('authToken');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Helper method to retry API calls with exponential backoff
  private async retryWithBackoff<T>(
    operation: () => Promise<T>,
    maxRetries: number = 3,
    initialDelay: number = 1000
  ): Promise<T> {
    let lastError: any;
    
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error: any) {
        lastError = error;
        
        // Don't retry on authentication errors or client errors (4xx)
        if (error.response?.status >= 400 && error.response?.status < 500) {
          throw error;
        }
        
        // Check if it's a connection error (ERR_CONNECTION_RESET, ERR_CONNECTION_REFUSED)
        const isConnectionError = error.code === 'ERR_CONNECTION_RESET' || 
                                  error.code === 'ERR_CONNECTION_REFUSED' ||
                                  error.message?.includes('Network Error');
        
        if (!isConnectionError && attempt === 0) {
          throw error; // Don't retry non-connection errors immediately
        }
        
        if (attempt < maxRetries - 1) {
          const delay = initialDelay * Math.pow(2, attempt);
          console.log(`🔄 API call failed (attempt ${attempt + 1}/${maxRetries}), retrying in ${delay}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }
    
    throw lastError;
  }

  // Helper method to get current user ID from localStorage
  private getCurrentUserId(): number | null {
    try {
      const currentUser = localStorage.getItem('user');
      if (currentUser) {
        const userData = JSON.parse(currentUser);
        return userData.id || null;
      }
      return null;
    } catch (error) {
      console.error('Error getting current user ID:', error);
      return null;
    }
  }

  // Authentication - User Management Service (Port 8081)
  async login(credentials: LoginDTO): Promise<APIResponse<UserResponseDTO>> {
    try {
      const response: AxiosResponse<UserResponseDTO> = await this.retryWithBackoff(
        () => this.client.post('/auth/login', credentials)
      );
      return {
        success: true,
        data: response.data,
        statusCode: response.status,
      };
    } catch (error: any) {
      return this.handleError(error);
    }
  }

  async register(userData: RegisterDTO): Promise<APIResponse<User>> {
    console.log('🔍 Registration attempt:', {
      firstName: userData.firstName,
      lastName: userData.lastName, 
      email: userData.email,
      dateOfBirth: userData.dateOfBirth,
      gender: userData.gender,
      citizenshipIds: userData.citizenshipIds,
      passwordLength: userData.password?.length || 0
    });
    
    try {
      const response: AxiosResponse<HTTPResponse> = await this.client.post('/auth/register', userData);
      // Return success but no user data since registration doesn't return user
      return {
        success: true,
        statusCode: response.status,
      };
    } catch (error: any) {
      return this.handleError(error);
    }
  }

  async logout(): Promise<APIResponse<void>> {
    try {
      await this.client.post('/auth/logout');
      localStorage.removeItem('authToken');
      return {
        success: true,
        statusCode: 200,
      };
    } catch (error: any) {
      return this.handleError(error);
    }
  }

  async requestPasswordReset(email: string): Promise<APIResponse<void>> {
    try {
      await this.client.post('/auth/password-reset-request', null, {
        params: { email }
      });
      return {
        success: true,
        statusCode: 200,
      };
    } catch (error: any) {
      return this.handleError(error);
    }
  }

  async resetPassword(resetData: PasswordResetDTO): Promise<APIResponse<void>> {
    try {
      await this.client.put('/auth/password-reset', resetData);
      return {
        success: true,
        statusCode: 200,
      };
    } catch (error: any) {
      return this.handleError(error);
    }
  }

  async verifyEmail(verificationCode: string, email: string): Promise<APIResponse<void>> {
    try {
      await this.client.put('/auth/verify-email', null, {
        params: { email, verificationCode }
      });
      return {
        success: true,
        statusCode: 200,
      };
    } catch (error: any) {
      return this.handleError(error);
    }
  }

  async deleteAccount(currentPassword: string): Promise<APIResponse<void>> {
    const userId = this.getCurrentUserId();
    if (!userId) {
      return {
        success: false,
        message: 'User ID is required',
        statusCode: 400,
      };
    }

    try {
      await this.client.delete('/auth/account', {
        data: {
          userId: userId,
          currentPassword: currentPassword
        }
      });
      return {
        success: true,
        statusCode: 200,
      };
    } catch (error: any) {
      return this.handleError(error);
    }
  }

  async checkUserByEmail(email: string): Promise<APIResponse<{ exists: boolean; name?: string }>> {
    try {
      const response = await this.client.get('/auth/check-user', {
        params: { email }
      });
      return {
        success: true,
        data: response.data,
        statusCode: response.status,
      };
    } catch (error: any) {
      return this.handleError(error);
    }
  }

  // User Profile - User Management Service (Port 8081)
  async getUserProfile(): Promise<APIResponse<User>> {
    const userId = this.getCurrentUserId();
    if (!userId) {
      return {
        success: false,
        message: 'User ID is required',
        statusCode: 400,
      };
    }

    try {
      const response: AxiosResponse<User> = await this.client.get('/profile', {
        params: { userId }
      });
      return {
        success: true,
        data: response.data,
        statusCode: response.status,
      };
    } catch (error: any) {
      return this.handleError(error);
    }
  }

  async updateProfile(profileData: Partial<User>): Promise<APIResponse<User>> {
    const userId = this.getCurrentUserId();
    if (!userId) {
      return {
        success: false,
        message: 'User ID is required',
        statusCode: 400,
      };
    }

    try {
      // Transform frontend data to backend ProfileUpdateDTO format
      const updateData = {
        userId: userId,
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        email: profileData.email,
        gender: profileData.gender,
        dob: profileData.dateOfBirth || profileData.dob,
        citizenships: profileData.citizenshipIds ? 
          profileData.citizenshipIds.map(id => ({ id })) : 
          profileData.citizenships
      };

      const response: AxiosResponse<User> = await this.client.put('/profile', updateData);
      return {
        success: true,
        data: response.data,
        statusCode: response.status,
      };
    } catch (error: any) {
      return this.handleError(error);
    }
  }

  // Preferences - User Management Service (Port 8081)
  async getUserPreferences(userId?: number): Promise<APIResponse<Preference>> {
    // Get user ID from localStorage if not provided
    const actualUserId = userId || this.getCurrentUserId();
    if (!actualUserId) {
      return {
        success: false,
        message: 'User ID is required',
        statusCode: 400,
      };
    }

    try {
      const response: AxiosResponse<Preference> = await this.client.get('/profile/preferences', {
        params: { userId: actualUserId }
      });
      return {
        success: true,
        data: response.data,
        statusCode: response.status,
      };
    } catch (error: any) {
      console.error('Failed to get user preferences from backend:', error);
      return this.handleError(error);
    }
  }

  async updatePreferences(preferences: Partial<Preference>): Promise<APIResponse<Preference>> {
    // Ensure userId is included
    const userId = preferences.userId || this.getCurrentUserId();
    if (!userId) {
      return {
        success: false,
        message: 'User ID is required',
        statusCode: 400,
      };
    }

    const preferencesWithUserId = { ...preferences, userId };

    try {
      const response: AxiosResponse<Preference> = await this.client.put('/profile/preferences', preferencesWithUserId);
      return {
        success: true,
        data: response.data,
        statusCode: response.status,
      };
    } catch (error: any) {
      return this.handleError(error);
    }
  }

  // Destinations - Trip Planning Service (Port 8082)
  async getDestinations(): Promise<APIResponse<Destination[]>> {
    try {
      const response: AxiosResponse<Destination[]> = await this.client.get('/trips/destinations');
      return {
        success: true,
        data: response.data,
        statusCode: response.status,
      };
    } catch (error: any) {
      return this.handleError(error);
    }
  }

  async getDestination(id: number): Promise<APIResponse<Destination>> {
    try {
      const response: AxiosResponse<Destination> = await this.client.get(`/trips/destinations/${id}`);
      return {
        success: true,
        data: response.data,
        statusCode: response.status,
      };
    } catch (error: any) {
      return this.handleError(error);
    }
  }

  // Trips - Trip Planning Service (Port 8082)
  async getTrips(userId: number): Promise<APIResponse<Trip[]>> {
    try {
      const response: AxiosResponse<Trip[]> = await this.client.get('/trips', {
        params: { userId }
      });
      return {
        success: true,
        data: response.data,
        statusCode: response.status,
      };
    } catch (error: any) {
      return this.handleError(error);
    }
  }

  async getTrip(id: number): Promise<APIResponse<Trip>> {
    try {
      const userId = this.getCurrentUserId();
      if (!userId) {
        return {
          success: false,
          message: 'User not authenticated',
          statusCode: 401,
        };
      }
      
      const response: AxiosResponse<Trip> = await this.retryWithBackoff(
        () => this.client.get(`/trips/${id}?userId=${userId}`)
      );
      return {
        success: true,
        data: response.data,
        statusCode: response.status,
      };
    } catch (error: any) {
      return this.handleError(error);
    }
  }

  async createTrip(tripData: TripCreationDTO): Promise<APIResponse<Trip>> {
    try {
      const response: AxiosResponse<Trip> = await this.client.post('/trips', tripData);
      return {
        success: true,
        data: response.data,
        statusCode: response.status,
      };
    } catch (error: any) {
      return this.handleError(error);
    }
  }

  async updateTrip(id: number, tripData: Partial<Trip>): Promise<APIResponse<Trip>> {
    try {
      const response: AxiosResponse<Trip> = await this.client.put(`/trips/${id}`, tripData);
      return {
        success: true,
        data: response.data,
        statusCode: response.status,
      };
    } catch (error: any) {
      return this.handleError(error);
    }
  }

  async deleteTrip(id: number): Promise<APIResponse<void>> {
    try {
      const userId = this.getCurrentUserId();
      if (!userId) {
        return {
          success: false,
          message: 'User not authenticated',
          statusCode: 401,
        };
      }
      
      await this.client.delete(`/trips/${id}`, {
        params: { userId }
      });
      return {
        success: true,
        statusCode: 204,
      };
    } catch (error: any) {
      return this.handleError(error);
    }
  }

  // Itineraries - Itinerary Service (Port 8083)
  async getItinerary(tripId: number): Promise<APIResponse<Itinerary>> {
    const userId = this.getCurrentUserId();
    try {
      const response: AxiosResponse<Itinerary> = await this.client.get(`/itinerary/${tripId}`, {
        params: { userId }
      });
      return {
        success: true,
        data: response.data,
        statusCode: response.status,
      };
    } catch (error: any) {
      return this.handleError(error);
    }
  }

  async getItineraryEvents(itineraryId: number): Promise<APIResponse<Event[]>> {
    const userId = this.getCurrentUserId();
    try {
      const response: AxiosResponse<Event[]> = await this.client.get(`/itinerary/events`, {
        params: { userId, itineraryId }
      });
      return {
        success: true,
        data: response.data,
        statusCode: response.status,
      };
    } catch (error: any) {
      return this.handleError(error);
    }
  }

  async createEvent(eventData: any): Promise<APIResponse<Event>> {
    try {
      const response: AxiosResponse<Event> = await this.client.post(`/itinerary/events`, eventData);
      return {
        success: true,
        data: response.data,
        statusCode: response.status,
      };
    } catch (error: any) {
      return this.handleError(error);
    }
  }

  async updateEvent(eventId: number, eventData: any): Promise<APIResponse<Event>> {
    try {
      const response: AxiosResponse<Event> = await this.client.put(`/itinerary/events/${eventId}`, eventData);
      return {
        success: true,
        data: response.data,
        statusCode: response.status,
      };
    } catch (error: any) {
      return this.handleError(error);
    }
  }

  async deleteEvent(eventId: number): Promise<APIResponse<void>> {
    const userId = this.getCurrentUserId();
    try {
      await this.client.delete(`/itinerary/events/${eventId}`, {
        params: { userId }
      });
      return {
        success: true,
        statusCode: 204,
      };
    } catch (error: any) {
      return this.handleError(error);
    }
  }

  // Flight Management
  async searchFlights(originId: number, destinationId: number, departureDate: string): Promise<APIResponse<any[]>> {
    try {
      const response = await this.client.get('/itinerary/flights/search', {
        params: { originId, destinationId, departureDate }
      });
      return {
        success: true,
        data: response.data,
        statusCode: response.status,
      };
    } catch (error: any) {
      return this.handleError(error);
    }
  }

  async addFlight(flightData: any): Promise<APIResponse<any>> {
    try {
      const response = await this.client.post('/itinerary/flights', flightData);
      return {
        success: true,
        data: response.data,
        statusCode: response.status,
      };
    } catch (error: any) {
      return this.handleError(error);
    }
  }

  // Accommodation Management  
  async searchAccommodations(destinationId: number, checkIn: string, checkOut: string): Promise<APIResponse<any[]>> {
    try {
      const response = await this.client.get('/itinerary/accommodations/search', {
        params: { destinationId, checkIn, checkOut }
      });
      return {
        success: true,
        data: response.data,
        statusCode: response.status,
      };
    } catch (error: any) {
      return this.handleError(error);
    }
  }

  async addAccommodation(accommodationData: any): Promise<APIResponse<any>> {
    try {
      const response = await this.client.post('/itinerary/accommodations', accommodationData);
      return {
        success: true,
        data: response.data,
        statusCode: response.status,
      };
    } catch (error: any) {
      return this.handleError(error);
    }
  }

  // Booking Management
  async getBookings(itineraryId: number): Promise<APIResponse<any[]>> {
    const userId = this.getCurrentUserId();
    try {
      const response = await this.client.get('/itinerary/bookings', {
        params: { userId, itineraryId }
      });
      return {
        success: true,
        data: response.data,
        statusCode: response.status,
      };
    } catch (error: any) {
      return this.handleError(error);
    }
  }

  async updateBookingStatus(bookingId: number, status: string): Promise<APIResponse<any>> {
    const userId = this.getCurrentUserId();
    try {
      const response = await this.client.put(`/itinerary/bookings/${bookingId}`, { status }, {
        params: { userId }
      });
      return {
        success: true,
        data: response.data,
        statusCode: response.status,
      };
    } catch (error: any) {
      return this.handleError(error);
    }
  }

  // Travel Requirements - Trip Planning Service (Port 8082)
  async getTravelRequirements(originCountryId: number, destinationCountryId: number): Promise<APIResponse<any>> {
    try {
      const response = await this.client.get('/trips/requirements', {
        params: { originCountryId, destinationCountryId }
      });
      return {
        success: true,
        data: response.data,
        statusCode: response.status,
      };
    } catch (error: any) {
      return this.handleError(error);
    }
  }

  // Recommendations - Recommendation Service (Port 8084)
  async getRecommendations(userId: number): Promise<APIResponse<Destination[]>> {
    try {
      const response: AxiosResponse<Destination[]> = await this.client.get('/recommendations', { 
        params: { userId } 
      });
      return {
        success: true,
        data: response.data,
        statusCode: response.status,
      };
    } catch (error: any) {
      return this.handleError(error);
    }
  }

  // Travel Goals Management
  async getTravelGoals(userId: number): Promise<APIResponse<any[]>> {
    try {
      const response = await this.client.get('/profile/goals', {
        params: { userId }
      });
      return {
        success: true,
        data: response.data,
        statusCode: response.status,
      };
    } catch (error: any) {
      return this.handleError(error);
    }
  }

  async createTravelGoal(goalData: any): Promise<APIResponse<any>> {
    try {
      const response = await this.client.post('/profile/goals', goalData);
      return {
        success: true,
        data: response.data,
        statusCode: response.status,
      };
    } catch (error: any) {
      return this.handleError(error);
    }
  }

  async updateTravelGoal(goalId: number, goalData: any): Promise<APIResponse<any>> {
    try {
      console.log('🎯 Updating travel goal:', goalId, 'with data:', goalData);
      const response = await this.client.put(`/profile/goals/${goalId}`, goalData);
      console.log('✅ Travel goal update response:', response);
      return {
        success: true,
        data: response.data,
        statusCode: response.status,
      };
    } catch (error: any) {
      console.error('❌ Travel goal update failed:', error);
      return this.handleError(error);
    }
  }

  async deleteTravelGoal(goalId: number, userId: number): Promise<APIResponse<void>> {
    try {
      await this.client.delete(`/profile/goals/${goalId}`, {
        params: { userId }
      });
      return {
        success: true,
        statusCode: 204,
      };
    } catch (error: any) {
      return this.handleError(error);
    }
  }

  // Bucket List Management
  async getBucketList(userId: number): Promise<APIResponse<any[]>> {
    try {
      const response = await this.client.get('/profile/bucket-list', {
        params: { userId }
      });
      return {
        success: true,
        data: response.data,
        statusCode: response.status,
      };
    } catch (error: any) {
      return this.handleError(error);
    }
  }

  async createBucketListItem(itemData: any): Promise<APIResponse<any>> {
    try {
      const response = await this.client.post('/profile/bucket-list', itemData);
      return {
        success: true,
        data: response.data,
        statusCode: response.status,
      };
    } catch (error: any) {
      return this.handleError(error);
    }
  }

  // Past Trips Management
  async getPastTrips(userId: number): Promise<APIResponse<any[]>> {
    try {
      const response = await this.client.get('/profile/history', {
        params: { userId }
      });
      return {
        success: true,
        data: response.data,
        statusCode: response.status,
      };
    } catch (error: any) {
      return this.handleError(error);
    }
  }

  async createPastTrip(tripData: any): Promise<APIResponse<any>> {
    try {
      const response = await this.client.post('/profile/history', tripData);
      return {
        success: true,
        data: response.data,
        statusCode: response.status,
      };
    } catch (error: any) {
      return this.handleError(error);
    }
  }

  async deletePastTrip(tripId: number, userId: number): Promise<APIResponse<void>> {
    try {
      await this.client.delete(`/profile/history/${tripId}`, {
        params: { userId }
      });
      return {
        success: true,
        statusCode: 204,
      };
    } catch (error: any) {
      return this.handleError(error);
    }
  }

  // Countries - Trip Planning Service (Port 8082)
  async getAllCountries(): Promise<APIResponse<any[]>> {
    console.log('🌐 getAllCountries: Making request to /trips/countries...');
    try {
      const response = await this.client.get('/trips/countries');
      console.log('✅ getAllCountries: Response received:', {
        status: response.status,
        dataLength: response.data?.length,
        firstItem: response.data?.[0]
      });
      return {
        success: true,
        data: response.data,
        statusCode: response.status,
      };
    } catch (error: any) {
      console.error('❌ getAllCountries: Request failed:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data
      });
      return this.handleError(error);
    }
  }

  // Destinations - Profile Service (Port 8081)
  async getAllDestinations(): Promise<APIResponse<any[]>> {
    try {
      const response = await this.client.get('/profile/destinations');
      return {
        success: true,
        data: response.data,
        statusCode: response.status,
      };
    } catch (error: any) {
      return this.handleError(error);
    }
  }

  // Bucket List - Profile Service (Port 8081)
  async addToBucketList(bucketData: { userId: number; destinationId: number }): Promise<APIResponse<any>> {
    try {
      const response = await this.client.post('/profile/bucket-list', bucketData);
      return {
        success: true,
        data: response.data,
        statusCode: response.status,
      };
    } catch (error: any) {
      return this.handleError(error);
    }
  }

  // Remove from Bucket List - Profile Service (Port 8081)
  async removeFromBucketList(destinationId: number, userId: number): Promise<APIResponse<void>> {
    try {
      await this.client.delete(`/profile/bucket-list/${destinationId}`, {
        params: { userId }
      });
      return {
        success: true,
        statusCode: 204,
      };
    } catch (error: any) {
      return this.handleError(error);
    }
  }

  // Past Trips - Profile Service (Port 8081)
  async addToPastTrips(tripData: { userId: number; destinationId: number }): Promise<APIResponse<any>> {
    try {
      const response = await this.client.post('/profile/history', tripData);
      return {
        success: true,
        data: response.data,
        statusCode: response.status,
      };
    } catch (error: any) {
      return this.handleError(error);
    }
  }

  // Error handling
  private handleError(error: any): APIResponse<any> {
    const response = error.response;
    if (response) {
      return {
        success: false,
        message: response.data?.errorMessage || response.data?.message || 'An error occurred',
        statusCode: response.status,
      };
    }
    return {
      success: false,
      message: 'Network error or server unavailable',
      statusCode: 0,
    };
  }
}

export const apiClient = new ApiClient();
export default apiClient;