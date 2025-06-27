package com.farrin.farrin.dto;

import com.farrin.farrin.model.Climate;
import com.farrin.farrin.model.Interest;
import com.farrin.farrin.model.PreferredAccommodationType;
import com.farrin.farrin.model.Season;
import com.farrin.farrin.model.TransportType;
import com.farrin.farrin.model.TravelStyle;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PreferenceUpdateDTO {
    private Integer userId;
    private Integer accommodationBudget;
    private Integer transportationBudget;
    private Integer totalBudget;
    private Interest primaryInterest;
    private TravelStyle primaryTravelStyle;
    private Climate preferredClimate;
    private Season preferredTravelSeason;
    private PreferredAccommodationType preferredAccommodation;
    private Integer avgTravelDuration;
    private TransportType transportPreference;
    private Boolean dataSharing;
}