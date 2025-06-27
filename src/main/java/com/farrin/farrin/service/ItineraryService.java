package com.farrin.farrin.service;

import com.farrin.farrin.dto.*;
import com.farrin.farrin.model.*;
import com.farrin.farrin.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Set;

@Service
@RequiredArgsConstructor
@Slf4j
public class ItineraryService extends BaseService {

    private final BookingRepository bookingRepository;
    private final EventRepository eventRepository;
    private final ItineraryRepository itineraryRepository;
    private final WeatherInfoRepository weatherInfoRepository;

    public Boolean addFlight(Integer userId, FlightDTO dto) {
        logOperation("addFlight", dto.getFlightNumber());
        return true;
    }

    public Boolean addAccommodation(Integer userId, AccommodationDTO dto) {
        logOperation("addAccommodation", dto.getName());
        return true;
    }

    public Boolean createEvent(Integer userId, EventDTO dto) {
        logOperation("createEvent", dto.getName());
        return true;
    }

    public Boolean updateEvent(Integer userId, Integer eventId, EventDTO dto) {
        logOperation("updateEvent", eventId);
        return true;
    }

    public Boolean deleteEvent(Integer userId, Integer eventId) {
        logOperation("deleteEvent", eventId);
        return true;
    }

    public Boolean addWeatherInfo(Integer userId, Integer tripId, String location, Set<LocalDate> dates) {
        logOperation("addWeatherInfo", location);
        return true;
    }

    public Itinerary getTripItinerary(Integer userId, Integer tripId) {
        logOperation("getTripItinerary", tripId);
        return itineraryRepository.findByTripId(tripId).orElse(null);
    }

    public Set<Event> getItineraryEvents(Integer userId, Integer itineraryId) {
        logOperation("getItineraryEvents", itineraryId);
        return Set.copyOf(eventRepository.findByItineraryId(itineraryId));
    }

    public Set<Booking> getItineraryBookings(Integer userId, Integer itineraryId) {
        logOperation("getItineraryBookings", itineraryId);
        return Set.copyOf(bookingRepository.findByItineraryId(itineraryId));
    }

    public Boolean updateBookingStatus(Integer userId, Integer bookingId, BookingStatus status) {
        logOperation("updateBookingStatus", bookingId);
        return true;
    }
}