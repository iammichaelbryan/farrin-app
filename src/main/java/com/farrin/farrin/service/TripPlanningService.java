package com.farrin.farrin.service;

import com.farrin.farrin.dto.*;
import com.farrin.farrin.model.*;
import com.farrin.farrin.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Set;

@Service
@RequiredArgsConstructor
@Slf4j
public class TripPlanningService extends BaseService {

    private final TravelRequirementRepository travelRequirementRepository;
    private final TripRepository tripRepository;
    private final ContinentRepository continentRepository;
    private final CountryRepository countryRepository;
    private final DestinationRepository destinationRepository;
    private final TripResponseDTOBuilder tripResponseDTOBuilder;

    public TravelRequirement getTravelRequirements(Integer originCountryId, Integer destinationCountryId) {
        logOperation("getTravelRequirements", originCountryId + " -> " + destinationCountryId);
        return travelRequirementRepository.findByOriginCountryIdAndDestinationCountryId(originCountryId, destinationCountryId)
            .orElse(null);
    }

    public TripResponseDTO createTrip(Integer userId, TripCreationDTO dto) {
        logOperation("createTrip", dto.getDestinationId());
        
        // Get destination for the name
        Destination destination = destinationRepository.findById(dto.getDestinationId())
            .orElseThrow(() -> new RuntimeException("Destination not found with ID: " + dto.getDestinationId()));
        
        Trip trip = new Trip();
        trip.setOwnerId(userId);
        trip.setDestinationId(dto.getDestinationId());
        trip.setTripType(dto.getTripType());
        trip.setStartDate(dto.getStartDate());
        trip.setDurationDays(dto.getDurationDays());
        trip.setStatus(TripStatus.PLANNED);
        trip.setCreatedAt(LocalDateTime.now());
        
        Trip savedTrip = tripRepository.save(trip);
        
        return tripResponseDTOBuilder
            .setId(savedTrip.getId())
            .setOwnerId(savedTrip.getOwnerId())
            .setDestinationId(savedTrip.getDestinationId())
            .setDestinationName(destination.getName())
            .setTripType(savedTrip.getTripType())
            .setStartDate(savedTrip.getStartDate())
            .setEndDate(savedTrip.getEndDate())
            .setDurationDays(savedTrip.getDurationDays())
            .setStatus(savedTrip.getStatus())
            .setCreatedAt(savedTrip.getCreatedAt())
            .getResult();
    }

    public Boolean inviteToTrip(Integer tripId, Integer inviterUserId, Set<String> inviteeEmails) {
        logOperation("inviteToTrip", tripId);
        return true;
    }

    public TripResponseDTO getTrip(Integer userId, Integer tripId) {
        logOperation("getTrip", tripId);
        
        return tripRepository.findById(tripId)
            .filter(trip -> trip.getOwnerId().equals(userId)) // Ensure user owns the trip
            .map(trip -> {
                // Get destination name
                String destinationName = destinationRepository.findById(trip.getDestinationId())
                    .map(Destination::getName)
                    .orElse("Unknown Destination");
                
                return tripResponseDTOBuilder
                    .setId(trip.getId())
                    .setOwnerId(trip.getOwnerId())
                    .setDestinationId(trip.getDestinationId())
                    .setDestinationName(destinationName)
                    .setTripType(trip.getTripType())
                    .setStartDate(trip.getStartDate())
                    .setEndDate(trip.getEndDate())
                    .setDurationDays(trip.getDurationDays())
                    .setStatus(trip.getStatus())
                    .setCreatedAt(trip.getCreatedAt())
                    .getResult();
            })
            .orElse(null);
    }

    public Set<TripResponseDTO> getUserTrips(Integer userId) {
        logOperation("getUserTrips", userId);
        
        return tripRepository.findByOwnerId(userId).stream()
            .map(trip -> {
                // Get destination name
                String destinationName = destinationRepository.findById(trip.getDestinationId())
                    .map(Destination::getName)
                    .orElse("Unknown Destination");
                
                return tripResponseDTOBuilder
                    .setId(trip.getId())
                    .setOwnerId(trip.getOwnerId())
                    .setDestinationId(trip.getDestinationId())
                    .setDestinationName(destinationName)
                    .setTripType(trip.getTripType())
                    .setStartDate(trip.getStartDate())
                    .setEndDate(trip.getEndDate())
                    .setDurationDays(trip.getDurationDays())
                    .setStatus(trip.getStatus())
                    .setCreatedAt(trip.getCreatedAt())
                    .getResult();
            })
            .collect(java.util.stream.Collectors.toSet());
    }

    public Boolean updateTripStatus(Integer userId, Integer tripId, TripStatus status) {
        logOperation("updateTripStatus", tripId);
        return true;
    }

    public Boolean deleteTrip(Integer userId, Integer tripId) {
        logOperation("deleteTrip", tripId);
        return true;
    }

    public Set<Continent> getContinents() {
        logOperation("getContinents", "all");
        return Set.copyOf(continentRepository.findAll());
    }

    public Set<Country> getAllCountries() {
        logOperation("getAllCountries", "all");
        return countryRepository.findAll().stream()
                .sorted((a, b) -> a.getName().compareToIgnoreCase(b.getName()))
                .collect(java.util.stream.Collectors.toCollection(java.util.LinkedHashSet::new));
    }

    public Set<Country> getCountriesByContinent(Integer continentId) {
        logOperation("getCountriesByContinent", continentId);
        return Set.copyOf(countryRepository.findByContinentId(continentId));
    }

    public Set<Destination> getAllDestinations() {
        logOperation("getAllDestinations", "all");
        return destinationRepository.findAll().stream()
                .sorted((a, b) -> a.getName().compareToIgnoreCase(b.getName()))
                .collect(java.util.stream.Collectors.toCollection(java.util.LinkedHashSet::new));
    }

    public Destination getDestination(Integer destinationId) {
        logOperation("getDestination", destinationId);
        return destinationRepository.findById(destinationId).orElse(null);
    }

    public Set<Destination> getDestinationsByCountry(Integer countryId) {
        logOperation("getDestinationsByCountry", countryId);
        return Set.copyOf(destinationRepository.findByCountryId(countryId));
    }

    public Boolean joinTrip(Integer userId, Integer tripId) {
        logOperation("joinTrip", tripId);
        return true;
    }

    public Boolean leaveTrip(Integer userId, Integer tripId) {
        logOperation("leaveTrip", tripId);
        return true;
    }
}