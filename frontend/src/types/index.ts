export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  gender?: 'MALE' | 'FEMALE';
  dateOfBirth: string;
  dob: string;  // Date of birth for age calculation
  age?: number;
  citizenshipIds?: number[];
  citizenships?: Country[];
  isVerified: boolean;
  loginCount?: number;
  createdAt: string;
  loggedIn?: boolean;
  lastLoginAt?: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface RegisterDTO {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  dateOfBirth: string;
  gender?: 'MALE' | 'FEMALE';
  citizenshipIds: number[];
}

export interface PasswordResetDTO {
  email: string;
  resetCode: string;
  newPassword: string;
}

export interface UserResponseDTO {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  gender?: 'MALE' | 'FEMALE';
  age?: number;
  isVerified: boolean;
  loginCount: number;
  token?: string;
}

export interface QuestionnaireData {
  accommodationBudget: string;
  transportationBudget: string;
  totalBudget: string;
  primaryInterest: Interest;
  preferredTravelStyle: TravelStyle;
  preferredClimate: Climate;
  preferredTravelSeason: Season;
  preferredAccommodation: 'HOTEL' | 'AIRBNB' | 'LODGE';
  avgTravelDuration: number;
  transportPreference: 'FLIGHTS';
  dataSharing: boolean;
}

export interface TravelHistoryEntry {
  destination: string;
  countryId?: number;
  year: number;
  rating: number;
  tripType: 'BUSINESS' | 'LEISURE' | 'ADVENTURE' | 'CULTURAL' | 'RELAXATION';
}

export interface Destination {
  id: number;
  name: string;
  description?: string;
  countryId: number;
  countryName?: string;
  continentName?: string;
  climate?: Climate;
  popularActivities?: string[];
  imageUrl?: string;
  travelAdvisory?: string;
  latitude?: number;
  longitude?: number;
  averageRating?: number;
  isLiked?: boolean;
  isInBucketList?: boolean;
  
  // ML Model prediction fields
  rank?: number;
  probability?: number;
  confidence?: 'High' | 'Medium' | 'Low';
  explanation?: string;
  shapDetails?: any;
}

export interface Trip {
  id: number;
  ownerId: number;
  destinationId: number;
  destinationName?: string;
  tripType: 'SOLO' | 'FAMILY' | 'FRIENDS';
  startDate: string;
  endDate?: string;
  durationDays: number;
  status: 'PLANNED' | 'ONGOING' | 'COMPLETED' | 'CANCELLED';
  createdAt: string;
  updatedAt?: string;
}

export interface TripCreationDTO {
  userId: number;
  destinationId: number;
  tripType: 'SOLO' | 'FAMILY' | 'FRIENDS';
  startDate: string;
  durationDays: number;
  inviteeEmails?: Set<string>;
  adults?: number;
  children?: number;
}

export interface Preference {
  id: number;
  userId: number;
  accommodationBudget?: number;
  transportationBudget?: number;
  totalBudget?: number;
  primaryInterest?: Interest;
  primaryTravelStyle?: TravelStyle;
  preferredClimate?: Climate;
  preferredTravelSeason?: Season;
  preferredAccommodation?: 'HOTEL' | 'AIRBNB' | 'LODGE';
  avgTravelDuration?: number;
  transportPreference?: 'FLIGHTS';
  dataSharing: boolean;
  updatedAt?: string;
}

export interface Itinerary {
  id: number;
  tripId: number;
  createdAt: string;
  updatedAt?: string;
}

export interface Event {
  id: number;
  itineraryId: number;
  name: string;
  eventDateTime: string;
  location?: string;
  description?: string;
  createdBy: number;
  createdAt: string;
}

export interface Booking {
  id: number;
  itineraryId: number;
  providerName?: string;
  cost: number;
  status: 'BOOKED' | 'CANCELLED' | 'PENDING';
  userNotes?: string;
  confirmationCode?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Flight {
  id: number;
  classification?: 'ONE_WAY' | 'TWO_WAY';
  departure: string;
  arrival: string;
  flightNumber?: string;
  departureLocation?: string;
  arrivalLocation?: string;
  duration?: number;
  availableSeats?: number;
}

export interface Accommodation {
  id: number;
  name: string;
  checkIn: string;
  checkOut: string;
  pricePerNight?: number;
  currency?: CurrencyCode;
  address?: string;
  rating?: number;
  availableRooms?: number;
  roomType?: string;
  childrenAllowed: boolean;
}

export type Climate = 'TROPICAL' | 'DRY' | 'CONTINENTAL' | 'POLAR' | 'MEDITERRANEAN' | 'ARID' | 'SEMI_ARID' | 'MONSOON' | 'TUNDRA';
export type Interest = 'ADVENTURE' | 'RELAXATION' | 'CULTURAL_EXPERIENCE' | 'NATURE';
export type TravelStyle = 'CASUAL' | 'FREQUENT' | 'BUSINESS' | 'ENTHUSIAST' | 'ORGANIZER';
export type Season = 'SPRING' | 'SUMMER' | 'AUTUMN' | 'WINTER';
export type CurrencyCode = 'JMD' | 'USD' | 'EUR' | 'AUS' | 'GBP' | 'CAD';

export interface APIResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  statusCode: number;
}

export interface HTTPResponse {
  statusCode: number;
  errorMessage?: string;
  data?: any;
}

export interface Country {
  id: number;
  name: string;
  countryCode: string;
  continentId?: number;
}

export interface TravelRequirement {
  fromCountry: string;
  toCountry: string;
  visaRequired: boolean;
  visaType?: string;
  maxStayDays?: number;
  passportValidityMonths: number;
  additionalDocuments?: string[];
  notes?: string;
}

export interface TravelGoal {
  id: number;
  userId: number;
  name: string;
  description: string;
  targetDate?: string;
  category: 'DESTINATION' | 'EXPERIENCE' | 'BUDGET' | 'CULTURAL' | 'ADVENTURE';
  isCompleted: boolean;
  progress: number; // 0-100
  createdAt: string;
  updatedAt?: string;
}

export interface BucketListItem {
  id: number;
  userId: number;
  name?: string;
  destination: {
    id: number;
    name: string;
    countryName?: string;
  };
  description?: string;
  priority?: 'LOW' | 'MEDIUM' | 'HIGH';
  estimatedCost?: number;
  bestTimeToVisit?: string;
  isCompleted?: boolean;
  completedDate?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface RecommendationExplanation {
  destinationId: number;
  reasons: {
    type: 'BUDGET_MATCH' | 'INTEREST_MATCH' | 'CLIMATE_PREFERENCE' | 'TRAVEL_HISTORY' | 'SEASON_PREFERENCE';
    description: string;
    confidence: number; // 0-1
  }[];
  overallScore: number; // 0-1
}