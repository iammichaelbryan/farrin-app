package com.farrin.farrin.controller;

import com.farrin.farrin.dto.*;
import com.farrin.farrin.model.TripStatus;
import com.farrin.farrin.service.TripPlanningService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Set;

@RestController
@RequestMapping("/trips")
@RequiredArgsConstructor
public class TripController {

    private final TripPlanningService tripPlanningService;

    @GetMapping("/requirements")
    public ResponseEntity<Object> getTravelRequirements(@RequestParam Integer originCountryId, 
                                                        @RequestParam Integer destinationCountryId) {
        try {
            var requirements = tripPlanningService.getTravelRequirements(originCountryId, destinationCountryId);
            if (requirements != null) {
                return ResponseEntity.ok(requirements);
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(HTTPResponse.builder()
                .statusCode(500)
                .errorMessage("Internal server error")
                .build());
        }
    }

    @PostMapping
    public ResponseEntity<Object> createTrip(@RequestBody TripCreationDTO dto) {
        try {
            var trip = tripPlanningService.createTrip(dto.getUserId(), dto);
            if (trip != null) {
                return ResponseEntity.ok(trip);
            }
            return ResponseEntity.badRequest().body(HTTPResponse.builder()
                .statusCode(400)
                .errorMessage("Trip creation failed")
                .build());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(HTTPResponse.builder()
                .statusCode(500)
                .errorMessage("Internal server error")
                .build());
        }
    }

    @PostMapping("/{tripId}/invites")
    public ResponseEntity<HTTPResponse> inviteToTrip(@PathVariable Integer tripId, 
                                                    @RequestParam Integer inviterUserId,
                                                    @RequestBody Set<String> inviteeEmails) {
        try {
            Boolean result = tripPlanningService.inviteToTrip(tripId, inviterUserId, inviteeEmails);
            if (result) {
                return ResponseEntity.ok(HTTPResponse.builder()
                    .statusCode(200)
                    .body("Invitations sent successfully")
                    .build());
            }
            return ResponseEntity.badRequest().body(HTTPResponse.builder()
                .statusCode(400)
                .errorMessage("Failed to send invitations")
                .build());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(HTTPResponse.builder()
                .statusCode(500)
                .errorMessage("Internal server error")
                .build());
        }
    }

    @GetMapping("/{tripId}")
    public ResponseEntity<Object> getTrip(@PathVariable Integer tripId, 
                                         @RequestParam Integer userId) {
        try {
            var trip = tripPlanningService.getTrip(userId, tripId);
            if (trip != null) {
                return ResponseEntity.ok(trip);
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(HTTPResponse.builder()
                .statusCode(500)
                .errorMessage("Internal server error")
                .build());
        }
    }

    @GetMapping
    public ResponseEntity<Object> getUserTrips(@RequestParam Integer userId) {
        try {
            var trips = tripPlanningService.getUserTrips(userId);
            return ResponseEntity.ok(trips);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(HTTPResponse.builder()
                .statusCode(500)
                .errorMessage("Internal server error")
                .build());
        }
    }

    @PutMapping("/{tripId}/status")
    public ResponseEntity<HTTPResponse> updateTripStatus(@PathVariable Integer tripId, 
                                                        @RequestParam Integer userId,
                                                        @RequestBody TripStatus status) {
        try {
            Boolean result = tripPlanningService.updateTripStatus(userId, tripId, status);
            if (result) {
                return ResponseEntity.ok(HTTPResponse.builder()
                    .statusCode(200)
                    .body("Trip status updated successfully")
                    .build());
            }
            return ResponseEntity.badRequest().body(HTTPResponse.builder()
                .statusCode(400)
                .errorMessage("Failed to update trip status")
                .build());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(HTTPResponse.builder()
                .statusCode(500)
                .errorMessage("Internal server error")
                .build());
        }
    }

    @DeleteMapping("/{tripId}")
    public ResponseEntity<HTTPResponse> deleteTrip(@PathVariable Integer tripId, 
                                                  @RequestParam Integer userId) {
        try {
            Boolean result = tripPlanningService.deleteTrip(userId, tripId);
            if (result) {
                return ResponseEntity.ok(HTTPResponse.builder()
                    .statusCode(200)
                    .body("Trip deleted successfully")
                    .build());
            }
            return ResponseEntity.badRequest().body(HTTPResponse.builder()
                .statusCode(400)
                .errorMessage("Failed to delete trip")
                .build());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(HTTPResponse.builder()
                .statusCode(500)
                .errorMessage("Internal server error")
                .build());
        }
    }

    @GetMapping("/continents")
    public ResponseEntity<Object> getContinents() {
        try {
            var continents = tripPlanningService.getContinents();
            return ResponseEntity.ok(continents);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(HTTPResponse.builder()
                .statusCode(500)
                .errorMessage("Internal server error")
                .build());
        }
    }

    @GetMapping("/countries")
    public ResponseEntity<Object> getAllCountries() {
        try {
            var countries = tripPlanningService.getAllCountries();
            return ResponseEntity.ok(countries);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(HTTPResponse.builder()
                .statusCode(500)
                .errorMessage("Internal server error")
                .build());
        }
    }

    @GetMapping("/continents/{continentId}/countries")
    public ResponseEntity<Object> getCountriesByContinent(@PathVariable Integer continentId) {
        try {
            var countries = tripPlanningService.getCountriesByContinent(continentId);
            return ResponseEntity.ok(countries);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(HTTPResponse.builder()
                .statusCode(500)
                .errorMessage("Internal server error")
                .build());
        }
    }

    @GetMapping("/destinations")
    public ResponseEntity<Object> getAllDestinations() {
        try {
            var destinations = tripPlanningService.getAllDestinations();
            return ResponseEntity.ok(destinations);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(HTTPResponse.builder()
                .statusCode(500)
                .errorMessage("Internal server error")
                .build());
        }
    }

    @GetMapping("/destinations/{destinationId}")
    public ResponseEntity<Object> getDestination(@PathVariable Integer destinationId) {
        try {
            var destination = tripPlanningService.getDestination(destinationId);
            if (destination != null) {
                return ResponseEntity.ok(destination);
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(HTTPResponse.builder()
                .statusCode(500)
                .errorMessage("Internal server error")
                .build());
        }
    }

    @GetMapping("/countries/{countryId}/destinations")
    public ResponseEntity<Object> getDestinationsByCountry(@PathVariable Integer countryId) {
        try {
            var destinations = tripPlanningService.getDestinationsByCountry(countryId);
            return ResponseEntity.ok(destinations);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(HTTPResponse.builder()
                .statusCode(500)
                .errorMessage("Internal server error")
                .build());
        }
    }

    @PostMapping("/{tripId}/join")
    public ResponseEntity<HTTPResponse> joinTrip(@PathVariable Integer tripId, 
                                                @RequestParam Integer userId) {
        try {
            Boolean result = tripPlanningService.joinTrip(userId, tripId);
            if (result) {
                return ResponseEntity.ok(HTTPResponse.builder()
                    .statusCode(200)
                    .body("Successfully joined trip")
                    .build());
            }
            return ResponseEntity.badRequest().body(HTTPResponse.builder()
                .statusCode(400)
                .errorMessage("Failed to join trip")
                .build());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(HTTPResponse.builder()
                .statusCode(500)
                .errorMessage("Internal server error")
                .build());
        }
    }

    @PostMapping("/{tripId}/leave")
    public ResponseEntity<HTTPResponse> leaveTrip(@PathVariable Integer tripId, 
                                                 @RequestParam Integer userId) {
        try {
            Boolean result = tripPlanningService.leaveTrip(userId, tripId);
            if (result) {
                return ResponseEntity.ok(HTTPResponse.builder()
                    .statusCode(200)
                    .body("Successfully left trip")
                    .build());
            }
            return ResponseEntity.badRequest().body(HTTPResponse.builder()
                .statusCode(400)
                .errorMessage("Failed to leave trip")
                .build());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(HTTPResponse.builder()
                .statusCode(500)
                .errorMessage("Internal server error")
                .build());
        }
    }
}