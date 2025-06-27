package com.farrin.farrin.controller;

import com.farrin.farrin.dto.*;
import com.farrin.farrin.model.User;
import com.farrin.farrin.model.TravelGoal;
import com.farrin.farrin.model.TravelHistory;
import com.farrin.farrin.service.ProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/profile")
@RequiredArgsConstructor
public class ProfileController {

    private final ProfileService profileService;

    @GetMapping
    public ResponseEntity<Object> getUserProfile(@RequestParam Integer userId) {
        try {
            var userProfile = profileService.getUserProfile(userId);
            if (userProfile != null) {
                return ResponseEntity.ok(userProfile);
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(HTTPResponse.builder()
                .statusCode(500)
                .errorMessage("Internal server error")
                .build());
        }
    }

    @PutMapping
    public ResponseEntity<HTTPResponse> updateProfile(@RequestBody ProfileUpdateDTO dto) {
        try {
            User user = profileService.getUser(dto.getUserId());
            if (user == null) {
                return ResponseEntity.notFound().build();
            }
            
            Boolean result = profileService.updateProfile(user, dto);
            if (result) {
                return ResponseEntity.ok(HTTPResponse.builder()
                    .statusCode(200)
                    .body("Profile updated successfully")
                    .build());
            }
            return ResponseEntity.badRequest().body(HTTPResponse.builder()
                .statusCode(400)
                .errorMessage("Profile update failed")
                .build());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(HTTPResponse.builder()
                .statusCode(500)
                .errorMessage("Internal server error")
                .build());
        }
    }

    @PutMapping("/preferences")
    public ResponseEntity<HTTPResponse> updatePreferences(@RequestBody PreferenceUpdateDTO dto) {
        try {
            User user = profileService.getUser(dto.getUserId());
            if (user == null) {
                return ResponseEntity.notFound().build();
            }
            
            Boolean result = profileService.updatePreferences(user, dto);
            if (result) {
                return ResponseEntity.ok(HTTPResponse.builder()
                    .statusCode(200)
                    .body("Preferences updated successfully")
                    .build());
            }
            return ResponseEntity.badRequest().body(HTTPResponse.builder()
                .statusCode(400)
                .errorMessage("Preferences update failed")
                .build());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(HTTPResponse.builder()
                .statusCode(500)
                .errorMessage("Internal server error")
                .build());
        }
    }

    @PostMapping("/history")
    public ResponseEntity<Object> addPastTrip(@RequestBody PastTripDTO dto) {
        try {
            User user = profileService.getUser(dto.getUserId());
            if (user == null) {
                return ResponseEntity.notFound().build();
            }
            
            TravelHistory result = profileService.createDetailedPastTrip(user, dto);
            if (result != null) {
                return ResponseEntity.ok(result);
            }
            return ResponseEntity.badRequest().body(HTTPResponse.builder()
                .statusCode(400)
                .errorMessage("Failed to add past trip")
                .build());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(HTTPResponse.builder()
                .statusCode(500)
                .errorMessage("Internal server error")
                .build());
        }
    }

    @GetMapping("/preferences")
    public ResponseEntity<Object> getPreferences(@RequestParam Integer userId) {
        try {
            var preferences = profileService.getUserPreferences(userId);
            if (preferences != null) {
                return ResponseEntity.ok(preferences);
            }
            // Return default preferences instead of 404
            return ResponseEntity.ok(new com.farrin.farrin.model.Preference());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(HTTPResponse.builder()
                .statusCode(500)
                .errorMessage("Internal server error")
                .build());
        }
    }

    @GetMapping("/goals")
    public ResponseEntity<Object> getTravelGoals(@RequestParam Integer userId) {
        try {
            User user = profileService.getUser(userId);
            if (user == null) {
                return ResponseEntity.notFound().build();
            }
            
            var goals = profileService.getTravelGoals(user);
            return ResponseEntity.ok(goals);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(HTTPResponse.builder()
                .statusCode(500)
                .errorMessage("Internal server error")
                .build());
        }
    }

    @DeleteMapping("/clear-users")
    public ResponseEntity<HTTPResponse> clearAllUsers() {
        try {
            profileService.clearAllUsers();
            return ResponseEntity.ok(HTTPResponse.builder()
                .statusCode(200)
                .body("All users cleared from database")
                .build());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(HTTPResponse.builder()
                .statusCode(500)
                .errorMessage("Failed to clear users")
                .build());
        }
    }

    @PostMapping("/goals")
    public ResponseEntity<Object> createTravelGoal(@RequestBody TravelGoalDTO dto) {
        try {
            User user = profileService.getUser(dto.getUserId());
            if (user == null) {
                return ResponseEntity.notFound().build();
            }
            
            TravelGoal createdGoal = profileService.createTravelGoal(user, dto);
            if (createdGoal != null) {
                return ResponseEntity.ok(createdGoal);
            }
            return ResponseEntity.badRequest().body(HTTPResponse.builder()
                .statusCode(400)
                .errorMessage("Travel goal creation failed")
                .build());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(HTTPResponse.builder()
                .statusCode(500)
                .errorMessage("Internal server error")
                .build());
        }
    }

    @PutMapping("/goals/{goalId}")
    public ResponseEntity<HTTPResponse> updateTravelGoal(@PathVariable Integer goalId, 
                                                        @RequestBody TravelGoalDTO dto) {
        try {
            Boolean result = profileService.updateTravelGoal(dto.getUserId(), goalId, dto);
            if (result) {
                return ResponseEntity.ok(HTTPResponse.builder()
                    .statusCode(200)
                    .body("Travel goal updated successfully")
                    .build());
            }
            return ResponseEntity.badRequest().body(HTTPResponse.builder()
                .statusCode(400)
                .errorMessage("Travel goal update failed")
                .build());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(HTTPResponse.builder()
                .statusCode(500)
                .errorMessage("Internal server error")
                .build());
        }
    }

    @GetMapping("/history")
    public ResponseEntity<Object> getTravelHistory(@RequestParam Integer userId) {
        try {
            User user = profileService.getUser(userId);
            if (user == null) {
                return ResponseEntity.notFound().build();
            }
            
            var history = profileService.getPastTrips(user);
            return ResponseEntity.ok(history);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(HTTPResponse.builder()
                .statusCode(500)
                .errorMessage("Internal server error")
                .build());
        }
    }

    @DeleteMapping("/goals/{goalId}")
    public ResponseEntity<HTTPResponse> deleteTravelGoal(@PathVariable Integer goalId, 
                                                        @RequestParam Integer userId) {
        try {
            Boolean result = profileService.deleteTravelGoal(userId, goalId);
            if (result) {
                return ResponseEntity.ok(HTTPResponse.builder()
                    .statusCode(200)
                    .body("Travel goal deleted successfully")
                    .build());
            }
            return ResponseEntity.badRequest().body(HTTPResponse.builder()
                .statusCode(400)
                .errorMessage("Travel goal deletion failed")
                .build());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(HTTPResponse.builder()
                .statusCode(500)
                .errorMessage("Internal server error")
                .build());
        }
    }

    @DeleteMapping("/history/{tripId}")
    public ResponseEntity<HTTPResponse> deletePastTrip(@PathVariable Integer tripId, 
                                                      @RequestParam Integer userId) {
        try {
            Boolean result = profileService.deletePastTrip(userId, tripId);
            if (result) {
                return ResponseEntity.ok(HTTPResponse.builder()
                    .statusCode(200)
                    .body("Past trip deleted successfully")
                    .build());
            }
            return ResponseEntity.badRequest().body(HTTPResponse.builder()
                .statusCode(400)
                .errorMessage("Past trip deletion failed")
                .build());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(HTTPResponse.builder()
                .statusCode(500)
                .errorMessage("Internal server error")
                .build());
        }
    }

    @GetMapping("/bucket-list")
    public ResponseEntity<Object> getBucketList(@RequestParam Integer userId) {
        try {
            User user = profileService.getUser(userId);
            if (user == null) {
                return ResponseEntity.notFound().build();
            }
            
            var bucketList = profileService.getBucketList(user);
            return ResponseEntity.ok(bucketList);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(HTTPResponse.builder()
                .statusCode(500)
                .errorMessage("Internal server error")
                .build());
        }
    }

    @PostMapping("/bucket-list")
    public ResponseEntity<HTTPResponse> addToBucketList(@RequestBody BucketListDTO dto) {
        try {
            User user = profileService.getUser(dto.getUserId());
            if (user == null) {
                return ResponseEntity.notFound().build();
            }
            
            Boolean result = profileService.addToBucketListByDestinationId(user, dto.getDestinationId());
            if (result) {
                return ResponseEntity.ok(HTTPResponse.builder()
                    .statusCode(200)
                    .body("Destination added to bucket list")
                    .build());
            }
            return ResponseEntity.badRequest().body(HTTPResponse.builder()
                .statusCode(400)
                .errorMessage("Failed to add to bucket list")
                .build());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(HTTPResponse.builder()
                .statusCode(500)
                .errorMessage("Internal server error")
                .build());
        }
    }

    @DeleteMapping("/bucket-list/{destinationId}")
    public ResponseEntity<HTTPResponse> removeFromWishlist(@PathVariable Integer destinationId, 
                                                          @RequestParam Integer userId) {
        try {
            Boolean result = profileService.removeFromBucketList(userId, destinationId);
            if (result) {
                return ResponseEntity.ok(HTTPResponse.builder()
                    .statusCode(200)
                    .body("Destination removed from bucket list")
                    .build());
            }
            return ResponseEntity.badRequest().body(HTTPResponse.builder()
                .statusCode(400)
                .errorMessage("Failed to remove from bucket list")
                .build());
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
            var destinations = profileService.getAllDestinations();
            return ResponseEntity.ok(destinations);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(HTTPResponse.builder()
                .statusCode(500)
                .errorMessage("Internal server error")
                .build());
        }
    }

}