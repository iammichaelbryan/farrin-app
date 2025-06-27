package com.farrin.farrin.controller;

import com.farrin.farrin.dto.*;
import com.farrin.farrin.service.EventHandlerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/events")
@RequiredArgsConstructor
public class EventHandlerController {

    private final EventHandlerService eventHandlerService;

    @PostMapping("/process")
    public ResponseEntity<HTTPResponse> processEvents(@RequestBody List<Object> events) {
        try {
            Boolean result = eventHandlerService.processEvents(events);
            if (result) {
                return ResponseEntity.ok(HTTPResponse.builder()
                    .statusCode(200)
                    .body("Events processed successfully")
                    .build());
            }
            return ResponseEntity.badRequest().body(HTTPResponse.builder()
                .statusCode(400)
                .errorMessage("Failed to process events")
                .build());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(HTTPResponse.builder()
                .statusCode(500)
                .errorMessage("Internal server error")
                .build());
        }
    }

    @GetMapping("/history")
    public ResponseEntity<Object> getEventHistory(@RequestParam(required = false) Integer userId,
                                                 @RequestParam(required = false) String eventType) {
        try {
            var eventHistory = eventHandlerService.getEventHistory(userId, eventType);
            return ResponseEntity.ok(eventHistory);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(HTTPResponse.builder()
                .statusCode(500)
                .errorMessage("Internal server error")
                .build());
        }
    }

    @PostMapping
    public ResponseEntity<HTTPResponse> createEvent(@RequestBody Object eventData) {
        try {
            Boolean result = eventHandlerService.createEvent(eventData);
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

    @GetMapping("/{eventId}")
    public ResponseEntity<Object> getEventDetails(@PathVariable Integer eventId) {
        try {
            var eventDetails = eventHandlerService.getEventDetails(eventId);
            return ResponseEntity.ok(eventDetails);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(HTTPResponse.builder()
                .statusCode(500)
                .errorMessage("Internal server error")
                .build());
        }
    }

    @PutMapping("/{eventId}/status")
    public ResponseEntity<HTTPResponse> updateEventStatus(@PathVariable Integer eventId,
                                                         @RequestBody Object statusUpdate) {
        try {
            Boolean result = eventHandlerService.updateEventStatus(eventId, statusUpdate);
            if (result) {
                return ResponseEntity.ok(HTTPResponse.builder()
                    .statusCode(200)
                    .body("Event status updated successfully")
                    .build());
            }
            return ResponseEntity.badRequest().body(HTTPResponse.builder()
                .statusCode(400)
                .errorMessage("Failed to update event status")
                .build());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(HTTPResponse.builder()
                .statusCode(500)
                .errorMessage("Internal server error")
                .build());
        }
    }

    @DeleteMapping("/{eventId}")
    public ResponseEntity<HTTPResponse> deleteEvent(@PathVariable Integer eventId) {
        try {
            Boolean result = eventHandlerService.deleteEvent(eventId);
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
}