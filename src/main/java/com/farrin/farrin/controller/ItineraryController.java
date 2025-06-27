package com.farrin.farrin.controller;

import com.farrin.farrin.dto.*;
import com.farrin.farrin.model.BookingStatus;
import com.farrin.farrin.service.ItineraryService;
import com.farrin.farrin.service.ExternalApiGatewayService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Set;

@RestController
@RequestMapping("/itinerary")
@RequiredArgsConstructor
public class ItineraryController {

    private final ItineraryService itineraryService;
    private final ExternalApiGatewayService externalApiGatewayService;

    @PostMapping("/flights")
    public ResponseEntity<HTTPResponse> addFlight(@RequestBody FlightDTO dto) {
        try {
            Boolean result = itineraryService.addFlight(dto.getUserId(), dto);
            if (result) {
                return ResponseEntity.ok(HTTPResponse.builder()
                    .statusCode(200)
                    .body("Flight added successfully")
                    .build());
            }
            return ResponseEntity.badRequest().body(HTTPResponse.builder()
                .statusCode(400)
                .errorMessage("Failed to add flight")
                .build());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(HTTPResponse.builder()
                .statusCode(500)
                .errorMessage("Internal server error")
                .build());
        }
    }

    @GetMapping("/flights/search")
    public ResponseEntity<Object> getFlightOptions(@RequestParam Integer originId,
                                                   @RequestParam Integer destinationId,
                                                   @RequestParam LocalDateTime departureDate) {
        try {
            var flightOptions = externalApiGatewayService.fetchFlightOptions(originId, destinationId, departureDate);
            return ResponseEntity.ok(flightOptions);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(HTTPResponse.builder()
                .statusCode(500)
                .errorMessage("Internal server error")
                .build());
        }
    }

    @PostMapping("/accommodations")
    public ResponseEntity<HTTPResponse> addAccommodation(@RequestBody AccommodationDTO dto) {
        try {
            Boolean result = itineraryService.addAccommodation(dto.getUserId(), dto);
            if (result) {
                return ResponseEntity.ok(HTTPResponse.builder()
                    .statusCode(200)
                    .body("Accommodation added successfully")
                    .build());
            }
            return ResponseEntity.badRequest().body(HTTPResponse.builder()
                .statusCode(400)
                .errorMessage("Failed to add accommodation")
                .build());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(HTTPResponse.builder()
                .statusCode(500)
                .errorMessage("Internal server error")
                .build());
        }
    }

    @GetMapping("/accommodations/search")
    public ResponseEntity<Object> getAccommodationOptions(@RequestParam Integer destinationId,
                                                          @RequestParam LocalDateTime checkIn,
                                                          @RequestParam LocalDateTime checkOut) {
        try {
            var accommodationOptions = externalApiGatewayService.fetchAccommodationOptions(destinationId, checkIn, checkOut);
            return ResponseEntity.ok(accommodationOptions);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(HTTPResponse.builder()
                .statusCode(500)
                .errorMessage("Internal server error")
                .build());
        }
    }

    @PostMapping("/events")
    public ResponseEntity<HTTPResponse> createEvent(@RequestBody EventDTO dto) {
        try {
            Boolean result = itineraryService.createEvent(dto.getUserId(), dto);
            if (result) {
                return ResponseEntity.ok(HTTPResponse.builder()
                    .statusCode(200)
                    .body("Event created successfully")
                    .build());
            }
            return ResponseEntity.badRequest().body(HTTPResponse.builder()
                .statusCode(400)
                .errorMessage("Failed to create event")
                .build());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(HTTPResponse.builder()
                .statusCode(500)
                .errorMessage("Internal server error")
                .build());
        }
    }

    @PutMapping("/events/{eventId}")
    public ResponseEntity<HTTPResponse> updateEvent(@PathVariable Integer eventId,
                                                   @RequestBody EventDTO dto) {
        try {
            Boolean result = itineraryService.updateEvent(dto.getUserId(), eventId, dto);
            if (result) {
                return ResponseEntity.ok(HTTPResponse.builder()
                    .statusCode(200)
                    .body("Event updated successfully")
                    .build());
            }
            return ResponseEntity.badRequest().body(HTTPResponse.builder()
                .statusCode(400)
                .errorMessage("Failed to update event")
                .build());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(HTTPResponse.builder()
                .statusCode(500)
                .errorMessage("Internal server error")
                .build());
        }
    }

    @DeleteMapping("/events/{eventId}")
    public ResponseEntity<HTTPResponse> deleteEvent(@PathVariable Integer eventId,
                                                   @RequestParam Integer userId) {
        try {
            Boolean result = itineraryService.deleteEvent(userId, eventId);
            if (result) {
                return ResponseEntity.ok(HTTPResponse.builder()
                    .statusCode(200)
                    .body("Event deleted successfully")
                    .build());
            }
            return ResponseEntity.badRequest().body(HTTPResponse.builder()
                .statusCode(400)
                .errorMessage("Failed to delete event")
                .build());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(HTTPResponse.builder()
                .statusCode(500)
                .errorMessage("Internal server error")
                .build());
        }
    }

    @GetMapping("/events")
    public ResponseEntity<Object> getEvents(@RequestParam Integer userId,
                                           @RequestParam Integer itineraryId) {
        try {
            var events = itineraryService.getItineraryEvents(userId, itineraryId);
            return ResponseEntity.ok(events);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(HTTPResponse.builder()
                .statusCode(500)
                .errorMessage("Internal server error")
                .build());
        }
    }

    @PostMapping("/weather")
    public ResponseEntity<HTTPResponse> addWeatherInfo(@RequestParam Integer userId,
                                                      @RequestParam Integer tripId,
                                                      @RequestParam String location,
                                                      @RequestBody Set<LocalDate> dates) {
        try {
            Boolean result = itineraryService.addWeatherInfo(userId, tripId, location, dates);
            if (result) {
                return ResponseEntity.ok(HTTPResponse.builder()
                    .statusCode(200)
                    .body("Weather info added successfully")
                    .build());
            }
            return ResponseEntity.badRequest().body(HTTPResponse.builder()
                .statusCode(400)
                .errorMessage("Failed to add weather info")
                .build());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(HTTPResponse.builder()
                .statusCode(500)
                .errorMessage("Internal server error")
                .build());
        }
    }

    @GetMapping("/{tripId}")
    public ResponseEntity<Object> getTripItinerary(@PathVariable Integer tripId,
                                                   @RequestParam Integer userId) {
        try {
            var itinerary = itineraryService.getTripItinerary(userId, tripId);
            if (itinerary != null) {
                return ResponseEntity.ok(itinerary);
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(HTTPResponse.builder()
                .statusCode(500)
                .errorMessage("Internal server error")
                .build());
        }
    }

    @GetMapping("/bookings")
    public ResponseEntity<Object> getBookings(@RequestParam Integer userId,
                                             @RequestParam Integer itineraryId) {
        try {
            var bookings = itineraryService.getItineraryBookings(userId, itineraryId);
            return ResponseEntity.ok(bookings);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(HTTPResponse.builder()
                .statusCode(500)
                .errorMessage("Internal server error")
                .build());
        }
    }

    @PutMapping("/bookings/{bookingId}")
    public ResponseEntity<HTTPResponse> updateBookingStatus(@PathVariable Integer bookingId,
                                                           @RequestParam Integer userId,
                                                           @RequestBody BookingStatus status) {
        try {
            Boolean result = itineraryService.updateBookingStatus(userId, bookingId, status);
            if (result) {
                return ResponseEntity.ok(HTTPResponse.builder()
                    .statusCode(200)
                    .body("Booking status updated successfully")
                    .build());
            }
            return ResponseEntity.badRequest().body(HTTPResponse.builder()
                .statusCode(400)
                .errorMessage("Failed to update booking status")
                .build());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(HTTPResponse.builder()
                .statusCode(500)
                .errorMessage("Internal server error")
                .build());
        }
    }
}