package com.farrin.farrin.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.Period;
import java.util.List;
import java.util.Set;
import java.util.HashSet;
import java.util.ArrayList;

import com.farrin.farrin.dto.*;

@Entity
@Table(name = "users")
@Data
@EqualsAndHashCode(exclude = {"citizenships", "travelGoals", "trips", "travelHistoryEntries", "bucketList", "recommendations", "collaborativeTrips"})
@NoArgsConstructor
@AllArgsConstructor
public class User {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    
    @Column(name = "first_name", nullable = false, length = 50)
    private String firstName;
    
    @Column(name = "last_name", nullable = false, length = 50)
    private String lastName;
    
    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private Gender gender;
    
    @Column(name = "date_of_birth", nullable = false)
    private LocalDate dob;
    
    @Column(nullable = false, unique = true, length = 100)
    private String email;
    
    @Column(name = "password_hash", nullable = false, length = 255)
    private String passwordHash;
    
    @Column(name = "is_verified", nullable = false)
    private Boolean isVerified = false;
    
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "logged_in", nullable = false)
    private Boolean loggedIn = false;
    
    @Column(name = "last_login_at")
    private LocalDateTime lastLoginAt;

    @Column(name = "login_count", nullable = false)
    private Integer loginCount = 0;
    
    @Column(name = "verification_code", length = 10)
    private String verificationCode;
    
    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Preference preferences;
    
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<TravelGoal> travelGoals;
    
    @OneToMany(mappedBy = "owner", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Trip> trips;
    
    @ManyToMany
    @JoinTable(name = "user_citizenships",
               joinColumns = @JoinColumn(name = "user_id"),
               inverseJoinColumns = @JoinColumn(name = "country_id"))
    private Set<Country> citizenships;
    
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<TravelHistory> travelHistoryEntries;
    
    @ManyToMany
    @JoinTable(name = "user_bucket_list",
               joinColumns = @JoinColumn(name = "user_id"),
               inverseJoinColumns = @JoinColumn(name = "destination_id"))
    private Set<Destination> bucketList;
    
    @ManyToMany
    @JoinTable(name = "user_recommendations",
               joinColumns = @JoinColumn(name = "user_id"),
               inverseJoinColumns = @JoinColumn(name = "destination_id"))
    private Set<Destination> recommendations;
    
    @ManyToMany(mappedBy = "members")
    private Set<Itinerary> collaborativeTrips;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
    
    public Integer getAge() {
        if (dob != null) {
            return Period.between(dob, LocalDate.now()).getYears();
        }
        return null;
    }
    
    // ========================================================================
    // USER OPERATIONS FROM OCL SPECIFICATION
    // ========================================================================
    
    // UC-2: Login Operations
    public Boolean initiateLogin() {
        return true;
    }
    
    public Boolean submitLoginCredentials(String email, String password) {
        if (email == null || email.isEmpty() || password == null || password.isEmpty()) {
            return false;
        }
        // Implementation would validate credentials against database
        return this.email.equals(email) && isPassword(password);
    }
    
    public Boolean isPassword(String password) {
        if (password == null) return false;
        // Implementation would use password encoder to verify
        // For now, basic check (in real implementation, use BCrypt)
        return this.passwordHash != null && this.passwordHash.equals(password);
    }
    
    // UC-3: Reset Password Operations
    public Boolean initiatePasswordReset() {
        return true;
    }
    
    public Boolean submitResetRequest(String email) {
        if (email == null || email.isEmpty()) {
            return false;
        }
        return true;
    }
    
    public Boolean submitResetCode(String email, String code) {
        if (email == null || email.isEmpty() || code == null || code.isEmpty()) {
            return false;
        }
        return true;
    }
    
    public Boolean updatePassword(String newPassword) {
        if (newPassword == null || newPassword.length() < 8) {
            return false;
        }
        this.passwordHash = newPassword; // In real implementation, hash the password
        return true;
    }
    
    // UC-4: Edit Travel Profile Operations
    public Boolean initiateProfileEdit() {
        return true;
    }
    
    public Boolean submitUpdateProfileData(String firstName, String lastName, String email, 
                                         LocalDate dob, Set<Country> citizenships) {
        return updateProfile(firstName, lastName, email, dob, citizenships);
    }
    
    public Boolean updateProfile(String firstName, String lastName, String email, 
                               LocalDate dob, Set<Country> citizenships) {
        if (firstName == null || firstName.isEmpty() || 
            lastName == null || lastName.isEmpty() || 
            email == null || email.isEmpty() || 
            dob == null) {
            return false;
        }
        
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.dob = dob;
        if (citizenships != null) {
            this.citizenships = citizenships;
        }
        return true;
    }
    
    // UC-5: Manage Travel Preferences Operations
    public Boolean initiatePreferencesManagement() {
        return true;
    }
    
    public Boolean updatePreferences(Preference preferences) {
        if (preferences == null) {
            return false;
        }
        // Temporarily commented out due to circular reference during citizenship testing
        this.preferences = preferences;
        return true;
    }
    
    // UC-6: Manage Past Trips List Operations
    public Boolean initiatePastTripsManagement() {
        return true;
    }
    
    public Boolean addPastTripData(Destination destination) {
        return addToHistory(destination);
    }
    
    public Boolean addToHistory(Destination destination) {
        if (destination == null) {
            return false;
        }
        if (this.travelHistoryEntries == null) {
            this.travelHistoryEntries = new ArrayList<>();
        }
        
        TravelHistory historyEntry = new TravelHistory();
        historyEntry.setUserId(this.id);
        historyEntry.setDestinationId(destination.getId());
        historyEntry.setTripType("past_trip");
        historyEntry.setVisitStartDate(LocalDate.now());
        historyEntry.setVisitEndDate(LocalDate.now());
        
        this.travelHistoryEntries.add(historyEntry);
        return true;
    }
    
    // UC-7: Manage Travel Bucket List and Travel Goals Operations
    public Boolean initiateBucketListManagement() {
        return true;
    }
    
    public Boolean addToBucketListData(Destination destination) {
        return addToBucketList(destination);
    }
    
    public Boolean addToBucketList(Destination destination) {
        if (destination == null) {
            return false;
        }
        if (this.bucketList == null) {
            this.bucketList = new HashSet<>();
        }
        this.bucketList.add(destination);
        return true;
    }
    
    public Boolean removeFromBucketListData(Destination destination) {
        return removeFromBucketList(destination);
    }
    
    public Boolean removeFromBucketList(Destination destination) {
        if (destination == null) {
            return false;
        }
        if (this.bucketList != null) {
            this.bucketList.remove(destination);
        }
        return true;
    }
    
    public Boolean initiateGoalManagement() {
        return true;
    }
    
    public Boolean createTravelGoalData(String description, LocalDateTime targetDate, 
                                      Double progress, Boolean isCompleted) {
        if (description == null || description.isEmpty() || targetDate == null) {
            return false;
        }
        
        TravelGoal goal = new TravelGoal();
        goal.setUserId(this.id);
        goal.setDescription(description);
        goal.setTargetDate(targetDate);
        goal.setProgress(java.math.BigDecimal.valueOf(progress != null ? progress : 0.0));
        goal.setIsCompleted(isCompleted != null ? isCompleted : false);
        goal.setCreatedAt(LocalDateTime.now());
        return true;
    }
    
    public void addTravelGoal(TravelGoal goal) {
        if (this.travelGoals == null) {
            this.travelGoals = new ArrayList<>();
        }
        this.travelGoals.add(goal);
    }
    
    public Boolean deleteTravelGoal(TravelGoal goal) {
        if (goal == null || this.travelGoals == null) {
            return false;
        }
        return this.travelGoals.remove(goal);
    }
    
    public Boolean updateTravelGoal(Integer goalId, String description, LocalDateTime targetDate, 
                                  Double progress, Boolean isCompleted) {
        if (goalId == null || goalId <= 0 || description == null || description.isEmpty() || 
            targetDate == null || progress == null || progress < 0.0 || progress > 1.0) {
            return false;
        }
        
        if (this.travelGoals != null) {
            for (TravelGoal goal : this.travelGoals) {
                if (goal.getId().equals(goalId)) {
                    goal.setDescription(description);
                    goal.setTargetDate(targetDate);
                    goal.setProgress(java.math.BigDecimal.valueOf(progress));
                    goal.setIsCompleted(isCompleted);
                    goal.setUpdatedAt(LocalDateTime.now());
                    return true;
                }
            }
        }
        return false;
    }
    
    // Travel Requirements Operations
    public TravelRequirement viewTravelRequirements(Integer originCountryId, Integer destinationId) {
        if (originCountryId == null || originCountryId <= 0 || 
            destinationId == null || destinationId <= 0) {
            return null;
        }
        // Implementation would query database for travel requirements
        // This is a placeholder - actual implementation would use repository
        return new TravelRequirement();
    }
    
    public Boolean verifyTravelReqMet(Country startingPoint, Destination destination, Boolean confirmed) {
        if (startingPoint == null || destination == null) {
            return false;
        }
        // Implementation would verify travel requirements are met
        return confirmed != null ? confirmed : false;
    }
    
    // UC-10: Create Trip Operations
    public Boolean initiateTripCreation() {
        return true;
    }
    
    public Trip createTrip(Integer destinationId, TripType tripType, LocalDateTime startDate, 
                          Integer durationDays) {
        if (destinationId == null || destinationId <= 0 || tripType == null || 
            startDate == null || durationDays == null || durationDays <= 0) {
            return null;
        }
        
        Trip trip = new Trip();
        trip.setOwnerId(this.id);
        trip.setDestinationId(destinationId);
        trip.setTripType(tripType);
        trip.setStartDate(startDate);
        trip.setDurationDays(durationDays);
        trip.setStatus(TripStatus.PLANNED);
        trip.setCreatedAt(LocalDateTime.now());
        
        if (this.trips == null) {
            this.trips = new ArrayList<>();
        }
        this.trips.add(trip);
        
        return trip;
    }
    
    public Boolean inviteUsersToTrip(Integer tripId, Set<String> inviteeEmails) {
        if (tripId == null || tripId <= 0 || inviteeEmails == null || inviteeEmails.isEmpty()) {
            return false;
        }
        // Implementation would send invitations to users
        return true;
    }
    
    // UC-11: Add Flight to Trip Itinerary Operations
    public Boolean initiateFlightAddition() {
        return true;
    }
    
    public Set<FlightOptionDTO> searchFlightOptions(Integer originId, Integer destinationId, 
                                                   LocalDateTime startDate) {
        if (originId == null || originId <= 0 || destinationId == null || destinationId <= 0 || 
            startDate == null) {
            return new HashSet<>();
        }
        // Implementation would call external flight search API
        return new HashSet<>();
    }
    
    public Boolean addFlightToItinerary(Integer tripId, FlightDTO flightDetails) {
        if (tripId == null || tripId <= 0 || flightDetails == null) {
            return false;
        }
        // Implementation would add flight booking to trip itinerary
        return true;
    }
    
    // UC-12: Add Accommodation to Trip Itinerary Operations
    public Boolean initiateAccommodationAddition() {
        return true;
    }
    
    public Set<AccommodationOptionDTO> searchAccommodationOptions(Integer destinationId, 
                                                                 LocalDateTime checkIn, 
                                                                 LocalDateTime checkOut) {
        if (destinationId == null || destinationId <= 0 || checkIn == null || 
            checkOut == null || !checkOut.isAfter(checkIn)) {
            return new HashSet<>();
        }
        // Implementation would call external accommodation search API
        return new HashSet<>();
    }
    
    public Boolean addAccommodationToItinerary(Integer tripId, AccommodationDTO accommodationDetails) {
        if (tripId == null || tripId <= 0 || accommodationDetails == null) {
            return false;
        }
        // Implementation would add accommodation booking to trip itinerary
        return true;
    }
    
    // UC-13: Add Event to Trip Itinerary Operations
    public Boolean initiateEventCreation() {
        return true;
    }
    
    public Boolean createEventInItinerary(Integer tripId, EventDTO eventDetails) {
        if (tripId == null || tripId <= 0 || eventDetails == null) {
            return false;
        }
        // Implementation would create event in trip itinerary
        return true;
    }
    
    public Boolean updateEventInItinerary(Integer eventId, EventDTO eventDetails) {
        if (eventId == null || eventId <= 0 || eventDetails == null) {
            return false;
        }
        // Implementation would update existing event
        return true;
    }
    
    public Boolean deleteEventFromItinerary(Integer eventId) {
        if (eventId == null || eventId <= 0) {
            return false;
        }
        // Implementation would delete event from itinerary
        return true;
    }
    
    // UC-14: Add Weather Info to Trip Itinerary Operations
    public Boolean initiateWeatherInfoAddition() {
        return true;
    }
    
    public Set<WeatherDataDTO> requestWeatherInfo(Integer destinationId, Set<LocalDate> dates) {
        if (destinationId == null || destinationId <= 0 || dates == null || dates.isEmpty()) {
            return new HashSet<>();
        }
        // Implementation would call weather API
        return new HashSet<>();
    }
    
    public Boolean addWeatherInfoToItinerary(Integer tripId, Set<WeatherInfo> weatherData) {
        if (tripId == null || tripId <= 0 || weatherData == null) {
            return false;
        }
        // Implementation would add weather info to itinerary
        return true;
    }
    
    // UC-15: View Personalized Recommendations Operations
    public Boolean initiateRecommendationsView() {
        return true;
    }
    
    public RecommendationResponseDTO getPersonalizedRecommendations() {
        // Implementation would call recommendation service
        return new RecommendationResponseDTO();
    }
    
    public Set<String> getActivityRecommendations(Integer destinationId) {
        if (destinationId == null || destinationId <= 0) {
            return new HashSet<>();
        }
        // Implementation would get activity recommendations for destination
        return new HashSet<>();
    }
    
    public Integer getBudgetEstimate(Integer destinationId) {
        if (destinationId == null || destinationId <= 0) {
            return 0;
        }
        // Implementation would calculate budget estimate
        return 0;
    }
    
    // UC-16: Browse Destinations by Interest Operations
    public Boolean initiateDestinationBrowsing() {
        return true;
    }
    
    public Set<DestinationResponseDTO> browseDestinationsByInterest(Interest interest) {
        if (interest == null) {
            return new HashSet<>();
        }
        // Implementation would query destinations by interest
        return new HashSet<>();
    }
    
    public Set<DestinationResponseDTO> filterDestinations(Interest interest, TravelStyle travelStyle, 
                                                         Climate climate, Integer minBudget, 
                                                         Integer maxBudget) {
        if (interest == null || travelStyle == null || climate == null || 
            minBudget == null || minBudget < 0 || maxBudget == null || maxBudget < minBudget) {
            return new HashSet<>();
        }
        // Implementation would filter destinations based on criteria
        return new HashSet<>();
    }
    
    // UC-17: View Travel Bucket List & Goals Operations
    public Tuple<Set<Destination>, Set<TravelGoal>> viewBucketListAndGoals() {
        Set<Destination> bucketListResult = this.bucketList != null ? this.bucketList : new HashSet<>();
        Set<TravelGoal> goalsResult = this.travelGoals != null ? new HashSet<>(this.travelGoals) : new HashSet<>();
        return new Tuple<>(bucketListResult, goalsResult);
    }
    
    // ========================================================================
    // HELPER CLASSES FOR OPERATIONS
    // ========================================================================
    
    // Simple Tuple class for viewBucketListAndGoals operation
    public static class Tuple<T, U> {
        private final T bucketList;
        private final U goals;
        
        public Tuple(T bucketList, U goals) {
            this.bucketList = bucketList;
            this.goals = goals;
        }
        
        public T getBucketList() { return bucketList; }
        public U getGoals() { return goals; }
    }
}