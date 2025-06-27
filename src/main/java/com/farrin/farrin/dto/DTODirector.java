package com.farrin.farrin.dto;

import org.springframework.stereotype.Component;

@Component
public class DTODirector {

    public Boolean construct(DTOBuilder<?> builder) {
        if (builder == null) {
            return false;
        }
        builder.reset();
        return true;
    }

    // Core Request DTOs
    public RegisterDTO makeRegisterDTO(RegisterDTOBuilder regDTOBuilder) {
        if (regDTOBuilder == null) {
            return null;
        }
        return regDTOBuilder.getResult();
    }

    public LoginDTO makeLoginDTO(LoginDTOBuilder loginDTOBuilder) {
        if (loginDTOBuilder == null) {
            return null;
        }
        return loginDTOBuilder.getResult();
    }

    public PasswordResetDTO makePasswordResetDTO(PasswordResetDTOBuilder resetDTOBuilder) {
        if (resetDTOBuilder == null) {
            return null;
        }
        return resetDTOBuilder.getResult();
    }

    public ProfileUpdateDTO makeProfileUpdateDTO(ProfileUpdateDTOBuilder profileDTOBuilder) {
        if (profileDTOBuilder == null) {
            return null;
        }
        return profileDTOBuilder.getResult();
    }

    public PreferenceUpdateDTO makePreferenceUpdateDTO(PreferenceUpdateDTOBuilder prefDTOBuilder) {
        if (prefDTOBuilder == null) {
            return null;
        }
        return prefDTOBuilder.getResult();
    }

    public TripCreationDTO makeTripCreationDTO(TripCreationDTOBuilder tripDTOBuilder) {
        if (tripDTOBuilder == null) {
            return null;
        }
        return tripDTOBuilder.getResult();
    }

    public TravelGoalDTO makeTravelGoalDTO(TravelGoalDTOBuilder goalDTOBuilder) {
        if (goalDTOBuilder == null) {
            return null;
        }
        return goalDTOBuilder.getResult();
    }

    public PastTripDTO makePastTripDTO(PastTripDTOBuilder dto) {
        if (dto == null) {
            return null;
        }
        return dto.getResult();
    }

    public BucketListDTO makeBucketListDTO(BucketListDTOBuilder bucketListDTOBuilder) {
        if (bucketListDTOBuilder == null) {
            return null;
        }
        return bucketListDTOBuilder.getResult();
    }

    public FlightDTO makeFlightDTO(FlightDTOBuilder flightDTOBuilder) {
        if (flightDTOBuilder == null) {
            return null;
        }
        return flightDTOBuilder.getResult();
    }

    public AccommodationDTO makeAccommodationDTO(AccommodationDTOBuilder accommodationDTOBuilder) {
        if (accommodationDTOBuilder == null) {
            return null;
        }
        return accommodationDTOBuilder.getResult();
    }

    public EventDTO makeEventDTO(EventDTOBuilder eventDTOBuilder) {
        if (eventDTOBuilder == null) {
            return null;
        }
        return eventDTOBuilder.getResult();
    }

    // Response DTOs
    public UserResponseDTO makeUserResponseDTO(UserResponseDTOBuilder userResponseDTOBuilder) {
        if (userResponseDTOBuilder == null) {
            return null;
        }
        return userResponseDTOBuilder.getResult();
    }

    public DestinationResponseDTO makeDestinationResponseDTO(DestinationResponseDTOBuilder destinationResponseDTOBuilder) {
        if (destinationResponseDTOBuilder == null) {
            return null;
        }
        return destinationResponseDTOBuilder.getResult();
    }

    public TripResponseDTO makeTripResponseDTO(TripResponseDTOBuilder tripResponseDTOBuilder) {
        if (tripResponseDTOBuilder == null) {
            return null;
        }
        return tripResponseDTOBuilder.getResult();
    }

    public RecommendationResponseDTO makeRecommendationResponseDTO(RecommendationResponseDTOBuilder recommendationResponseDTOBuilder) {
        if (recommendationResponseDTOBuilder == null) {
            return null;
        }
        return recommendationResponseDTOBuilder.getResult();
    }

    // External API DTOs
    public ExternalApiResponseDTO makeExternalApiResponseDTO(ExternalApiResponseDTOBuilder apiDTOBuilder) {
        if (apiDTOBuilder == null) {
            return null;
        }
        return apiDTOBuilder.getResult();
    }

    public CurrencyRateDTO makeCurrencyRateDTO(CurrencyRateDTOBuilder currencyDTOBuilder) {
        if (currencyDTOBuilder == null) {
            return null;
        }
        return currencyDTOBuilder.getResult();
    }

    public FlightOptionDTO makeFlightOptionDTO(FlightOptionDTOBuilder flightOptionDTOBuilder) {
        if (flightOptionDTOBuilder == null) {
            return null;
        }
        return flightOptionDTOBuilder.getResult();
    }

    public AccommodationOptionDTO makeAccommodationOptionDTO(AccommodationOptionDTOBuilder accommodationOptionDTOBuilder) {
        if (accommodationOptionDTOBuilder == null) {
            return null;
        }
        return accommodationOptionDTOBuilder.getResult();
    }

    public WeatherDataDTO makeWeatherDataDTO(WeatherDataDTOBuilder weatherDataDTOBuilder) {
        if (weatherDataDTOBuilder == null) {
            return null;
        }
        return weatherDataDTOBuilder.getResult();
    }

    // Additional DTOs
    public EmailDTO makeEmailDTO(EmailDTOBuilder emailDTOBuilder) {
        if (emailDTOBuilder == null) {
            return null;
        }
        return emailDTOBuilder.getResult();
    }

    public ActionEventDTO makeActionEventDTO(ActionEventDTOBuilder actionEvent) {
        if (actionEvent == null) {
            return null;
        }
        return actionEvent.getResult();
    }
}