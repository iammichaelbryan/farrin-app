package com.farrin.farrin.service;

import com.farrin.farrin.dto.*;
import com.farrin.farrin.model.*;
import com.farrin.farrin.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Set;
import java.util.HashSet;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class ProfileService extends BaseService {

    private final UserRepository userRepository;
    private final PreferenceRepository preferenceRepository;
    private final TravelGoalRepository travelGoalRepository;
    private final TravelHistoryRepository travelHistoryRepository;
    private final DestinationRepository destinationRepository;
    private final CountryRepository countryRepository;
    private final DataValidationService validationService;
    private final EventHandlerService eventHandlerService;
    private final UserResponseDTOBuilder userResponseDTOBuilder;
    private final DestinationResponseDTOBuilder destinationResponseDTOBuilder;
    private final DTODirector dtoDirector;

    public Boolean updateProfile(User user, ProfileUpdateDTO dto) {
        try {
            logOperation("updateProfile", dto.getUserId());
            
            if (!validationService.validateUserInput(dto)) {
                return false;
            }

            if (dto.getEmail() != null && !validationService.validateEmailFormat(dto.getEmail())) {
                return false;
            }

            // Check if email is already taken by another user
            if (dto.getEmail() != null && !dto.getEmail().equals(user.getEmail())) {
                Optional<User> existingUser = userRepository.findByEmail(dto.getEmail());
                if (existingUser.isPresent() && !existingUser.get().getId().equals(user.getId())) {
                    log.warn("Email {} already taken by another user", dto.getEmail());
                    return false;
                }
            }

            // Update user fields
            if (dto.getFirstName() != null) {
                user.setFirstName(dto.getFirstName());
            }
            if (dto.getLastName() != null) {
                user.setLastName(dto.getLastName());
            }
            if (dto.getEmail() != null) {
                // Only require re-verification if email actually changed
                if (!dto.getEmail().equals(user.getEmail())) {
                    user.setIsVerified(false); // Require re-verification for new email
                }
                user.setEmail(dto.getEmail());
            }
            if (dto.getGender() != null) {
                user.setGender(dto.getGender());
            }
            if (dto.getDob() != null) {
                user.setDob(dto.getDob());
            }
            if (dto.getCitizenships() != null && !dto.getCitizenships().isEmpty()) {
                // Fetch full Country objects from database using IDs
                Set<Country> validCitizenships = new HashSet<>();
                for (Country citizenship : dto.getCitizenships()) {
                    if (citizenship.getId() != null) {
                        Optional<Country> countryOpt = countryRepository.findById(citizenship.getId());
                        if (countryOpt.isPresent()) {
                            validCitizenships.add(countryOpt.get());
                        } else {
                            log.warn("Country with ID {} not found", citizenship.getId());
                        }
                    }
                }
                user.setCitizenships(validCitizenships);
            }

            userRepository.save(user);
            
            eventHandlerService.createEvent(user.getId(), 
                EventContext.PROFILE_UPDATED, 
                "User profile updated");

            return true;
            
        } catch (Exception e) {
            handleServiceException(e, "updateProfile");
            return false;
        }
    }

    public Boolean updatePreferences(User user, PreferenceUpdateDTO dto) {
        try {
            logOperation("updatePreferences", dto.getUserId());
            
            if (!validationService.validateUserInput(dto)) {
                return false;
            }

            // Validate budget fields and calculate total if both are provided
            if (dto.getAccommodationBudget() != null && dto.getTransportationBudget() != null) {
                dto.setTotalBudget(dto.getAccommodationBudget() + dto.getTransportationBudget());
            } else if (dto.getTotalBudget() != null && dto.getAccommodationBudget() != null) {
                dto.setTransportationBudget(dto.getTotalBudget() - dto.getAccommodationBudget());
            } else if (dto.getTotalBudget() != null && dto.getTransportationBudget() != null) {
                dto.setAccommodationBudget(dto.getTotalBudget() - dto.getTransportationBudget());
            }

            // Find existing preference or create new one
            Preference preference = preferenceRepository.findByUserId(user.getId())
                .orElse(new Preference());
            
            preference.setUserId(user.getId());

            // Update preference fields
            if (dto.getAccommodationBudget() != null) {
                preference.setAccommodationBudget(dto.getAccommodationBudget());
            }
            if (dto.getTransportationBudget() != null) {
                preference.setTransportationBudget(dto.getTransportationBudget());
            }
            if (dto.getTotalBudget() != null) {
                preference.setTotalBudget(dto.getTotalBudget());
            }
            if (dto.getPrimaryInterest() != null) {
                preference.setPrimaryInterest(dto.getPrimaryInterest());
            }
            if (dto.getPrimaryTravelStyle() != null) {
                preference.setPrimaryTravelStyle(dto.getPrimaryTravelStyle());
            }
            if (dto.getPreferredClimate() != null) {
                preference.setPreferredClimate(dto.getPreferredClimate());
            }
            if (dto.getPreferredTravelSeason() != null) {
                preference.setPreferredTravelSeason(dto.getPreferredTravelSeason());
            }
            if (dto.getPreferredAccommodation() != null) {
                preference.setPreferredAccommodation(dto.getPreferredAccommodation());
            }
            if (dto.getDataSharing() != null) {
                preference.setDataSharing(dto.getDataSharing());
            }
            if (dto.getAvgTravelDuration() != null) {
                preference.setAvgTravelDuration(dto.getAvgTravelDuration());
            }
            if (dto.getTransportPreference() != null) {
                preference.setTransportPreference(dto.getTransportPreference());
            }

            preference.setUpdatedAt(LocalDateTime.now());
            preferenceRepository.save(preference);

            eventHandlerService.createEvent(user.getId(), 
                EventContext.PREFERENCES_CHANGED, 
                "User preferences updated");

            return true;
            
        } catch (Exception e) {
            handleServiceException(e, "updatePreferences");
            return false;
        }
    }

    public UserResponseDTO getUserProfile(Integer userId) {
        try {
            logOperation("getUserProfile", userId);
            
            // First get user with basic relations (preferences, citizenships)
            Optional<User> userOpt = userRepository.findByIdWithBasicRelations(userId);
            if (userOpt.isEmpty()) {
                return null;
            }

            User user = userOpt.get();
            
            // Load travel history and bucket list separately due to Hibernate limitations
            User userWithHistory = userRepository.findByIdWithTravelHistory(userId).orElse(user);
            User userWithBucketList = userRepository.findByIdWithBucketList(userId).orElse(user);
            
            // Set the loaded collections on the main user object
            if (userWithHistory.getTravelHistoryEntries() != null) {
                user.setTravelHistoryEntries(userWithHistory.getTravelHistoryEntries());
            }
            if (userWithBucketList.getBucketList() != null) {
                user.setBucketList(userWithBucketList.getBucketList());
            }
            
            return buildUserResponseDTO(user);
            
        } catch (Exception e) {
            handleServiceException(e, "getUserProfile");
            return null;
        }
    }

    public Preference getUserPreferences(Integer userId) {
        try {
            logOperation("getUserPreferences", userId);
            
            return preferenceRepository.findByUserId(userId).orElse(null);
            
        } catch (Exception e) {
            handleServiceException(e, "getUserPreferences");
            return null;
        }
    }

    public User getUser(Integer userId) {
        try {
            logOperation("getUser", userId);
            return userRepository.findById(userId).orElse(null);
        } catch (Exception e) {
            handleServiceException(e, "getUser");
            return null;
        }
    }

    public List<TravelHistory> getTravelHistory(User user) {
        try {
            logOperation("getTravelHistory", user.getId());
            return user.getTravelHistoryEntries() != null ? user.getTravelHistoryEntries() : List.of();
        } catch (Exception e) {
            handleServiceException(e, "getTravelHistory");
            return List.of();
        }
    }

    public List<PastTripResponseDTO> getPastTrips(User user) {
        try {
            logOperation("getPastTrips", user.getId());
            List<TravelHistory> travelHistory = user.getTravelHistoryEntries() != null ? 
                user.getTravelHistoryEntries() : List.of();
            
            return travelHistory.stream()
                .map(this::convertTravelHistoryToPastTripDTO)
                .collect(Collectors.toList());
        } catch (Exception e) {
            handleServiceException(e, "getPastTrips");
            return List.of();
        }
    }

    private PastTripResponseDTO convertTravelHistoryToPastTripDTO(TravelHistory travelHistory) {
        // Get destination name
        String destinationName = "Unknown Destination";
        try {
            Optional<Destination> destinationOpt = destinationRepository.findById(travelHistory.getDestinationId());
            if (destinationOpt.isPresent()) {
                destinationName = destinationOpt.get().getName();
            }
        } catch (Exception e) {
            log.warn("Error fetching destination for TravelHistory {}: {}", travelHistory.getId(), e.getMessage());
        }

        // Calculate duration
        int durationDays = 0;
        if (travelHistory.getVisitStartDate() != null && travelHistory.getVisitEndDate() != null) {
            durationDays = (int) java.time.temporal.ChronoUnit.DAYS.between(
                travelHistory.getVisitStartDate(), 
                travelHistory.getVisitEndDate()
            ) + 1; // Include both start and end days
        }

        return PastTripResponseDTO.builder()
            .id(travelHistory.getId())
            .name(destinationName)
            .startDate(travelHistory.getVisitStartDate())
            .endDate(travelHistory.getVisitEndDate())
            .durationDays(durationDays)
            .notes(travelHistory.getNotes())
            .totalCost(null) // TODO: Add cost tracking to TravelHistory if needed
            .rating(travelHistory.getRating())
            .build();
    }

    public Set<Destination> getBucketList(User user) {
        try {
            logOperation("getBucketList", user.getId());
            return user.getBucketList();
        } catch (Exception e) {
            handleServiceException(e, "getBucketList");
            return Set.of();
        }
    }

    public Set<TravelGoal> getTravelGoals(User user) {
        try {
            logOperation("getTravelGoals", user.getId());
            return Set.copyOf(user.getTravelGoals());
        } catch (Exception e) {
            handleServiceException(e, "getTravelGoals");
            return Set.of();
        }
    }

    public TravelGoal createTravelGoal(User user, TravelGoalDTO dto) {
        try {
            logOperation("createTravelGoal", user.getId());
            
            if (!validationService.validateUserInput(dto)) {
                return null;
            }

            if (dto.getTargetDate() != null && 
                !validationService.validateBusinessRules("future_date", dto.getTargetDate())) {
                return null;
            }

            TravelGoal goal = new TravelGoal();
            goal.setUserId(user.getId());
            goal.setName(dto.getName());
            goal.setCategory(dto.getCategory());
            goal.setDescription(dto.getDescription());
            goal.setTargetDate(dto.getTargetDate());
            goal.setProgress(dto.getProgress() != null ? dto.getProgress() : java.math.BigDecimal.ZERO);
            goal.setIsCompleted(dto.getIsCompleted() != null ? dto.getIsCompleted() : false);
            goal.setCreatedAt(LocalDateTime.now());

            TravelGoal savedGoal = travelGoalRepository.save(goal);
            user.addTravelGoal(savedGoal);

            return savedGoal;
            
        } catch (Exception e) {
            handleServiceException(e, "createTravelGoal");
            return null;
        }
    }

    public Boolean addGoal(User user, TravelGoal goal) {
        try {
            logOperation("addGoal", user.getId());
            
            goal.setUserId(user.getId());
            travelGoalRepository.save(goal);
            user.addTravelGoal(goal);
            
            return true;
            
        } catch (Exception e) {
            handleServiceException(e, "addGoal");
            return false;
        }
    }

    public Boolean updateTravelGoal(Integer userId, Integer goalId, TravelGoalDTO dto) {
        try {
            logOperation("updateTravelGoal", goalId);
            log.info("Updating travel goal {} for user {} with data: {}", goalId, userId, dto);
            
            if (!validationService.validateUserInput(dto)) {
                log.warn("Validation failed for travel goal update: {}", dto);
                return false;
            }

            Optional<TravelGoal> goalOpt = travelGoalRepository.findById(goalId);
            if (goalOpt.isEmpty()) {
                log.warn("Travel goal not found with ID: {}", goalId);
                return false;
            }
            
            TravelGoal goal = goalOpt.get();
            if (!goal.getUserId().equals(userId)) {
                log.warn("Travel goal {} does not belong to user {}. Goal belongs to user {}", goalId, userId, goal.getUserId());
                return false;
            }
            
            if (dto.getName() != null) {
                goal.setName(dto.getName());
            }
            if (dto.getCategory() != null) {
                goal.setCategory(dto.getCategory());
            }
            if (dto.getDescription() != null) {
                goal.setDescription(dto.getDescription());
            }
            if (dto.getTargetDate() != null) {
                goal.setTargetDate(dto.getTargetDate());
            }
            if (dto.getProgress() != null) {
                goal.setProgress(dto.getProgress());
            }
            if (dto.getIsCompleted() != null) {
                goal.setIsCompleted(dto.getIsCompleted());
            }
            
            goal.setUpdatedAt(LocalDateTime.now());
            TravelGoal savedGoal = travelGoalRepository.save(goal);
            log.info("Travel goal {} updated successfully. New progress: {}", goalId, savedGoal.getProgress());

            return true;
            
        } catch (Exception e) {
            handleServiceException(e, "updateTravelGoal");
            return false;
        }
    }

    public Boolean deleteTravelGoal(Integer userId, Integer goalId) {
        try {
            logOperation("deleteTravelGoal", goalId);
            
            Optional<TravelGoal> goalOpt = travelGoalRepository.findById(goalId);
            if (goalOpt.isEmpty() || !goalOpt.get().getUserId().equals(userId)) {
                return false;
            }

            travelGoalRepository.deleteById(goalId);
            return true;
            
        } catch (Exception e) {
            handleServiceException(e, "deleteTravelGoal");
            return false;
        }
    }

    public Boolean addToBucketList(User user, Destination destination) {
        try {
            logOperation("addToBucketList", user.getId());
            
            if (destination == null) {
                return false;
            }

            user.addToBucketList(destination);
            userRepository.save(user);
            
            return true;
            
        } catch (Exception e) {
            handleServiceException(e, "addToBucketList");
            return false;
        }
    }

    public Boolean addToBucketListByDestinationId(User user, Integer destinationId) {
        try {
            logOperation("addToBucketListByDestinationId", user.getId());
            
            if (destinationId == null) {
                return false;
            }

            Optional<Destination> destinationOpt = destinationRepository.findById(destinationId);
            if (destinationOpt.isEmpty()) {
                log.warn("Destination with ID {} not found", destinationId);
                return false;
            }

            user.addToBucketList(destinationOpt.get());
            userRepository.save(user);
            
            return true;
            
        } catch (Exception e) {
            handleServiceException(e, "addToBucketListByDestinationId");
            return false;
        }
    }

    public Boolean addToTravelHistoryByDestinationId(User user, Integer destinationId) {
        try {
            logOperation("addToTravelHistoryByDestinationId", user.getId());
            
            if (destinationId == null) {
                return false;
            }

            Optional<Destination> destinationOpt = destinationRepository.findById(destinationId);
            if (destinationOpt.isEmpty()) {
                log.warn("Destination with ID {} not found", destinationId);
                return false;
            }

            user.addToHistory(destinationOpt.get());
            userRepository.save(user);
            
            return true;
            
        } catch (Exception e) {
            handleServiceException(e, "addToTravelHistoryByDestinationId");
            return false;
        }
    }

    public TravelHistory createDetailedPastTrip(User user, PastTripDTO dto) {
        try {
            logOperation("createDetailedPastTrip", user.getId());
            
            if (!validationService.validateUserInput(dto)) {
                return null;
            }

            if (dto.getDestinationId() == null) {
                log.warn("Destination ID is required for past trip creation");
                return null;
            }

            // Validate destination exists
            Optional<Destination> destinationOpt = destinationRepository.findById(dto.getDestinationId());
            if (destinationOpt.isEmpty()) {
                log.warn("Destination with ID {} not found", dto.getDestinationId());
                return null;
            }

            // Validate rating if provided
            if (dto.getRating() != null && (dto.getRating() < 1 || dto.getRating() > 5)) {
                log.warn("Invalid rating: {}. Rating must be between 1 and 5", dto.getRating());
                return null;
            }

            // Validate dates if provided
            if (dto.getStartDate() != null && dto.getEndDate() != null && 
                dto.getStartDate().isAfter(dto.getEndDate())) {
                log.warn("Start date cannot be after end date");
                return null;
            }

            // Create travel history entry
            TravelHistory travelHistory = new TravelHistory();
            travelHistory.setUserId(user.getId());
            travelHistory.setDestinationId(dto.getDestinationId());
            travelHistory.setVisitStartDate(dto.getStartDate());
            travelHistory.setVisitEndDate(dto.getEndDate());
            travelHistory.setRating(dto.getRating());
            travelHistory.setNotes(dto.getNotes());
            travelHistory.setTripType("past_trip");
            // Note: totalCost is not currently stored in TravelHistory model

            TravelHistory savedHistory = travelHistoryRepository.save(travelHistory);
            
            eventHandlerService.createEvent(user.getId(), 
                EventContext.PROFILE_UPDATED, 
                "Past trip added with details");

            return savedHistory;
            
        } catch (Exception e) {
            handleServiceException(e, "createDetailedPastTrip");
            return null;
        }
    }

    public Boolean removeFromBucketList(Integer userId, Integer destinationId) {
        try {
            logOperation("removeFromBucketList", destinationId);
            
            Optional<User> userOpt = userRepository.findById(userId);
            Optional<Destination> destOpt = destinationRepository.findById(destinationId);
            
            if (userOpt.isEmpty() || destOpt.isEmpty()) {
                return false;
            }

            User user = userOpt.get();
            Destination destination = destOpt.get();
            
            user.removeFromBucketList(destination);
            userRepository.save(user);
            
            return true;
            
        } catch (Exception e) {
            handleServiceException(e, "removeFromBucketList");
            return false;
        }
    }

    public Boolean deletePastTrip(Integer userId, Integer tripId) {
        try {
            logOperation("deletePastTrip", tripId);
            
            // Verify the travel history entry exists and belongs to the user
            Optional<TravelHistory> historyOpt = travelHistoryRepository.findByUserIdAndId(userId, tripId);
            if (historyOpt.isEmpty()) {
                log.warn("Travel history entry {} not found for user {}", tripId, userId);
                return false;
            }

            // Delete the travel history entry
            travelHistoryRepository.deleteById(tripId);
            
            eventHandlerService.createEvent(userId, 
                EventContext.PROFILE_UPDATED, 
                "Past trip deleted");
            
            return true;
            
        } catch (Exception e) {
            handleServiceException(e, "deletePastTrip");
            return false;
        }
    }

    public Boolean updateDataSharingSettings(Integer userId, Boolean dataSharingEnabled) {
        try {
            logOperation("updateDataSharingSettings", userId);
            
            Optional<User> userOpt = userRepository.findById(userId);
            if (userOpt.isEmpty()) {
                return false;
            }

            User user = userOpt.get();
            // Temporarily commented out due to circular reference during citizenship testing
            // Preference preference = user.getPreference();
            Preference preference = null;
            
            if (preference == null) {
                preference = new Preference();
                preference.setUserId(userId);
            }
            
            preference.setDataSharing(dataSharingEnabled);
            preference.setUpdatedAt(LocalDateTime.now());
            preferenceRepository.save(preference);
            
            return true;
            
        } catch (Exception e) {
            handleServiceException(e, "updateDataSharingSettings");
            return false;
        }
    }

    public Set<DestinationResponseDTO> getUserBucketList(Integer userId) {
        try {
            logOperation("getUserBucketList", userId);
            
            Optional<User> userOpt = userRepository.findById(userId);
            if (userOpt.isEmpty()) {
                return Set.of();
            }

            Set<Destination> bucketList = userOpt.get().getBucketList();
            if (bucketList == null) {
                return Set.of();
            }

            return bucketList.stream()
                .map(this::buildDestinationResponseDTO)
                .collect(Collectors.toSet());
            
        } catch (Exception e) {
            handleServiceException(e, "getUserBucketList");
            return Set.of();
        }
    }

    public Set<TravelGoal> getUserTravelGoals(Integer userId) {
        try {
            logOperation("getUserTravelGoals", userId);
            
            Optional<User> userOpt = userRepository.findById(userId);
            if (userOpt.isEmpty()) {
                return Set.of();
            }

            return Set.copyOf(userOpt.get().getTravelGoals());
            
        } catch (Exception e) {
            handleServiceException(e, "getUserTravelGoals");
            return Set.of();
        }
    }

    public void clearAllUsers() {
        try {
            logOperation("clearAllUsers", null);
            userRepository.deleteAll();
        } catch (Exception e) {
            handleServiceException(e, "clearAllUsers");
            throw new RuntimeException("Failed to clear users", e);
        }
    }

    private UserResponseDTO buildUserResponseDTO(User user) {
        return userResponseDTOBuilder
            .setId(user.getId())
            .setFirstName(user.getFirstName())
            .setLastName(user.getLastName())
            .setEmail(user.getEmail())
            .setGender(user.getGender())
            .setDob(user.getDob())
            .setAge(user.getAge())
            .setIsVerified(user.getIsVerified())
            .setLoginCount(user.getLoginCount())
            .setCreatedAt(user.getCreatedAt())
            .setCitizenships(user.getCitizenships())
            .setPreferences(user.getPreferences())
            .setTravelHistory(convertTravelHistoryToDestinations(user.getTravelHistoryEntries()))
            .setBucketList(user.getBucketList())
            .getResult();
    }

    private Set<Destination> convertTravelHistoryToDestinations(List<TravelHistory> travelHistoryEntries) {
        if (travelHistoryEntries == null || travelHistoryEntries.isEmpty()) {
            return Set.of();
        }
        
        return travelHistoryEntries.stream()
            .map(entry -> {
                try {
                    Optional<Destination> destOpt = destinationRepository.findById(entry.getDestinationId());
                    if (destOpt.isPresent()) {
                        Destination dest = destOpt.get();
                        // Force initialization of the proxy to avoid serialization issues
                        dest.getName(); // This will trigger proxy initialization
                        return dest;
                    }
                    return null;
                } catch (Exception e) {
                    log.warn("Error fetching destination for TravelHistory entry {}: {}", entry.getId(), e.getMessage());
                    return null;
                }
            })
            .filter(dest -> dest != null)
            .collect(Collectors.toSet());
    }

    private DestinationResponseDTO buildDestinationResponseDTO(Destination destination) {
        // Safely get country information without triggering lazy loading
        String countryName = null;
        String continentName = null;
        
        try {
            if (destination.getCountryId() != null) {
                Optional<Country> countryOpt = countryRepository.findById(destination.getCountryId());
                if (countryOpt.isPresent()) {
                    Country country = countryOpt.get();
                    countryName = country.getName();
                    
                    if (country.getContinentId() != null) {
                        // We could fetch continent here if needed, but for now just use country name
                        continentName = null;
                    }
                }
            }
        } catch (Exception e) {
            log.warn("Error fetching country information for destination {}: {}", destination.getId(), e.getMessage());
        }
        
        return destinationResponseDTOBuilder
            .setId(destination.getId())
            .setName(destination.getName())
            .setDescription(destination.getDescription())
            .setCountryName(countryName)
            .setContinentName(continentName)
            .setClimate(destination.getClimate())
            .setPopularActivities(destination.getPopularActivities())
            .setImageUrl(destination.getImageUrl())
            .setTravelAdvisory(destination.getTravelAdvisory())
            .getResult();
    }

    public java.util.List<DestinationResponseDTO> getAllDestinations() {
        try {
            logOperation("getAllDestinations", null);
            return destinationRepository.findAll().stream()
                .map(destination -> DestinationResponseDTO.builder()
                    .id(destination.getId())
                    .name(destination.getName())
                    .description(destination.getDescription())
                    .climate(destination.getClimate())
                    .popularActivities(destination.getPopularActivities())
                    .imageUrl(destination.getImageUrl())
                    .travelAdvisory(destination.getTravelAdvisory())
                    .build())
                .collect(java.util.stream.Collectors.toList());
        } catch (Exception e) {
            handleServiceException(e, "getAllDestinations");
            return java.util.List.of();
        }
    }
}