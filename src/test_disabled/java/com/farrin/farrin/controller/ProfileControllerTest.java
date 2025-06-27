package com.farrin.farrin.controller;

import com.farrin.farrin.dto.HTTPResponse;
import com.farrin.farrin.dto.PreferenceUpdateDTO;
import com.farrin.farrin.dto.ProfileUpdateDTO;
import com.farrin.farrin.dto.TravelGoalDTO;
import com.farrin.farrin.dto.UserResponseDTO;
import com.farrin.farrin.model.*;
import com.farrin.farrin.service.ProfileService;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
class ProfileControllerTest {

    @Mock
    private ProfileService profileService;

    @InjectMocks
    private ProfileController profileController;

    private MockMvc mockMvc;
    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(profileController).build();
        objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());
    }

    @Test
    void getUserProfile_ShouldReturnUserResponse_WhenUserExists() throws Exception {
        // Arrange
        Integer userId = 1;
        UserResponseDTO userResponse = createTestUserResponse();
        
        when(profileService.getUserProfile(userId)).thenReturn(userResponse);

        // Act & Assert
        mockMvc.perform(get("/profile")
                .param("userId", userId.toString()))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id").value(userId))
                .andExpect(jsonPath("$.firstName").value("John"))
                .andExpect(jsonPath("$.lastName").value("Doe"))
                .andExpect(jsonPath("$.email").value("john.doe@example.com"))
                .andExpect(jsonPath("$.age").value(25))
                .andExpect(jsonPath("$.isVerified").value(true))
                .andExpect(jsonPath("$.dob").exists())
                .andExpect(jsonPath("$.createdAt").exists())
                .andExpect(jsonPath("$.citizenships").isArray())
                .andExpect(jsonPath("$.travelHistory").isArray())
                .andExpect(jsonPath("$.bucketList").isArray());

        verify(profileService).getUserProfile(userId);
    }

    @Test
    void getUserProfile_ShouldReturnNotFound_WhenUserDoesNotExist() throws Exception {
        // Arrange
        Integer userId = 999;
        when(profileService.getUserProfile(userId)).thenReturn(null);

        // Act & Assert
        mockMvc.perform(get("/profile")
                .param("userId", userId.toString()))
                .andExpect(status().isNotFound());

        verify(profileService).getUserProfile(userId);
    }

    @Test
    void updateProfile_ShouldReturnSuccess_WhenValidData() throws Exception {
        // Arrange
        ProfileUpdateDTO updateDTO = createTestProfileUpdateDTO();
        User user = createTestUser();
        
        when(profileService.getUser(updateDTO.getUserId())).thenReturn(user);
        when(profileService.updateProfile(user, updateDTO)).thenReturn(true);

        // Act & Assert
        mockMvc.perform(put("/profile")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updateDTO)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.statusCode").value(200))
                .andExpect(jsonPath("$.body").value("Profile updated successfully"));

        verify(profileService).getUser(updateDTO.getUserId());
        verify(profileService).updateProfile(user, updateDTO);
    }

    @Test
    void updateProfile_ShouldReturnNotFound_WhenUserDoesNotExist() throws Exception {
        // Arrange
        ProfileUpdateDTO updateDTO = createTestProfileUpdateDTO();
        when(profileService.getUser(updateDTO.getUserId())).thenReturn(null);

        // Act & Assert
        mockMvc.perform(put("/profile")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updateDTO)))
                .andExpect(status().isNotFound());

        verify(profileService).getUser(updateDTO.getUserId());
        verify(profileService, never()).updateProfile(any(), any());
    }

    @Test
    void getPreferences_ShouldReturnPreferences_WhenPreferencesExist() throws Exception {
        // Arrange
        Integer userId = 1;
        Preference preference = createTestPreference();
        
        when(profileService.getUserPreferences(userId)).thenReturn(preference);

        // Act & Assert
        mockMvc.perform(get("/profile/preferences")
                .param("userId", userId.toString()))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id").value(preference.getId()))
                .andExpect(jsonPath("$.userId").value(preference.getUserId()))
                .andExpect(jsonPath("$.primaryInterest").value(preference.getPrimaryInterest().toString()))
                .andExpect(jsonPath("$.dataSharing").value(preference.getDataSharing()));

        verify(profileService).getUserPreferences(userId);
    }

    @Test
    void getPreferences_ShouldReturnDefaultPreferences_WhenPreferencesDoNotExist() throws Exception {
        // Arrange
        Integer userId = 1;
        when(profileService.getUserPreferences(userId)).thenReturn(null);

        // Act & Assert
        mockMvc.perform(get("/profile/preferences")
                .param("userId", userId.toString()))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON));

        verify(profileService).getUserPreferences(userId);
    }

    @Test
    void getTravelGoals_ShouldReturnGoals_WhenUserExists() throws Exception {
        // Arrange
        Integer userId = 1;
        User user = createTestUser();
        Set<TravelGoal> goals = createTestTravelGoals();
        
        when(profileService.getUser(userId)).thenReturn(user);
        when(profileService.getTravelGoals(user)).thenReturn(goals);

        // Act & Assert
        mockMvc.perform(get("/profile/goals")
                .param("userId", userId.toString()))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$.length()").value(goals.size()));

        verify(profileService).getUser(userId);
        verify(profileService).getTravelGoals(user);
    }

    @Test
    void createTravelGoal_ShouldReturnSuccess_WhenValidData() throws Exception {
        // Arrange
        TravelGoalDTO goalDTO = createTestTravelGoalDTO();
        User user = createTestUser();
        
        when(profileService.getUser(goalDTO.getUserId())).thenReturn(user);
        when(profileService.createTravelGoal(user, goalDTO)).thenReturn(true);

        // Act & Assert
        mockMvc.perform(post("/profile/goals")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(goalDTO)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.statusCode").value(200))
                .andExpect(jsonPath("$.body").value("Travel goal created successfully"));

        verify(profileService).getUser(goalDTO.getUserId());
        verify(profileService).createTravelGoal(user, goalDTO);
    }

    // Helper methods for creating test data
    private UserResponseDTO createTestUserResponse() {
        Set<Country> citizenships = new HashSet<>();
        citizenships.add(createTestCountry());
        
        return UserResponseDTO.builder()
                .id(1)
                .firstName("John")
                .lastName("Doe")
                .email("john.doe@example.com")
                .gender(Gender.MALE)
                .dob(LocalDate.of(1998, 1, 15))
                .age(25)
                .isVerified(true)
                .loginCount(5)
                .createdAt(LocalDateTime.now())
                .citizenships(citizenships)
                .preferences(createTestPreference())
                .travelHistory(new HashSet<>())
                .bucketList(new HashSet<>())
                .build();
    }

    private User createTestUser() {
        User user = new User();
        user.setId(1);
        user.setFirstName("John");
        user.setLastName("Doe");
        user.setEmail("john.doe@example.com");
        user.setGender(Gender.MALE);
        user.setDob(LocalDate.of(1998, 1, 15));
        user.setIsVerified(true);
        user.setCreatedAt(LocalDateTime.now());
        return user;
    }

    private Country createTestCountry() {
        Country country = new Country();
        country.setId(1);
        country.setName("United States");
        country.setCountryCode("USA");
        return country;
    }

    private Preference createTestPreference() {
        Preference preference = new Preference();
        preference.setId(1);
        preference.setUserId(1);
        preference.setPrimaryInterest(Interest.CULTURAL_EXPERIENCE);
        preference.setPrimaryTravelStyle(TravelStyle.CASUAL);
        preference.setPreferredClimate(Climate.MEDITERRANEAN);
        preference.setDataSharing(true);
        preference.setLowerLimitBudget(1000);
        preference.setUpperLimitBudget(5000);
        return preference;
    }

    private Set<TravelGoal> createTestTravelGoals() {
        Set<TravelGoal> goals = new HashSet<>();
        TravelGoal goal = new TravelGoal();
        goal.setId(1);
        goal.setUserId(1);
        goal.setDescription("Visit all 7 continents");
        goal.setTargetDate(LocalDateTime.now().plusYears(5));
        goal.setProgress(BigDecimal.valueOf(0.2));
        goal.setIsCompleted(false);
        goals.add(goal);
        return goals;
    }

    private ProfileUpdateDTO createTestProfileUpdateDTO() {
        ProfileUpdateDTO dto = new ProfileUpdateDTO();
        dto.setUserId(1);
        dto.setFirstName("John");
        dto.setLastName("Doe");
        dto.setEmail("john.doe@example.com");
        dto.setDob(LocalDate.of(1998, 1, 15));
        return dto;
    }

    private TravelGoalDTO createTestTravelGoalDTO() {
        TravelGoalDTO dto = new TravelGoalDTO();
        dto.setUserId(1);
        dto.setDescription("Visit Japan");
        dto.setTargetDate(LocalDateTime.now().plusYears(2));
        dto.setProgress(BigDecimal.ZERO);
        dto.setIsCompleted(false);
        return dto;
    }
}