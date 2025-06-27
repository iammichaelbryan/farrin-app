package com.farrin.farrin.service;

import com.farrin.farrin.dto.*;
import com.farrin.farrin.model.*;
import com.farrin.farrin.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.mockito.Mockito.lenient;

@ExtendWith(MockitoExtension.class)
class ProfileServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PreferenceRepository preferenceRepository;

    @Mock
    private TravelGoalRepository travelGoalRepository;

    @Mock
    private DestinationRepository destinationRepository;

    @Mock
    private DataValidationService validationService;

    @Mock
    private EventHandlerService eventHandlerService;

    @Mock
    private UserResponseDTOBuilder userResponseDTOBuilder;

    @Mock
    private DestinationResponseDTOBuilder destinationResponseDTOBuilder;

    @Mock
    private DTODirector dtoDirector;

    @InjectMocks
    private ProfileService profileService;

    private User testUser;
    private UserResponseDTO testUserResponse;

    @BeforeEach
    void setUp() {
        testUser = createTestUser();
        testUserResponse = createTestUserResponse();
        
        // Mock the builder pattern with lenient stubbing
        lenient().when(userResponseDTOBuilder.setId(any())).thenReturn(userResponseDTOBuilder);
        lenient().when(userResponseDTOBuilder.setFirstName(any())).thenReturn(userResponseDTOBuilder);
        lenient().when(userResponseDTOBuilder.setLastName(any())).thenReturn(userResponseDTOBuilder);
        lenient().when(userResponseDTOBuilder.setEmail(any())).thenReturn(userResponseDTOBuilder);
        lenient().when(userResponseDTOBuilder.setGender(any())).thenReturn(userResponseDTOBuilder);
        lenient().when(userResponseDTOBuilder.setDob(any())).thenReturn(userResponseDTOBuilder);
        lenient().when(userResponseDTOBuilder.setAge(any())).thenReturn(userResponseDTOBuilder);
        lenient().when(userResponseDTOBuilder.setIsVerified(any())).thenReturn(userResponseDTOBuilder);
        lenient().when(userResponseDTOBuilder.setLoginCount(any())).thenReturn(userResponseDTOBuilder);
        lenient().when(userResponseDTOBuilder.setCreatedAt(any())).thenReturn(userResponseDTOBuilder);
        lenient().when(userResponseDTOBuilder.setCitizenships(any())).thenReturn(userResponseDTOBuilder);
        lenient().when(userResponseDTOBuilder.setPreferences(any())).thenReturn(userResponseDTOBuilder);
        lenient().when(userResponseDTOBuilder.setTravelHistory(any())).thenReturn(userResponseDTOBuilder);
        lenient().when(userResponseDTOBuilder.setBucketList(any())).thenReturn(userResponseDTOBuilder);
        lenient().when(userResponseDTOBuilder.getResult()).thenReturn(testUserResponse);
    }

    @Test
    void getUserProfile_ShouldReturnUserResponseDTO_WhenUserExists() {
        // Arrange
        Integer userId = 1;
        when(userRepository.findByIdWithBasicRelations(userId)).thenReturn(Optional.of(testUser));
        when(userRepository.findByIdWithTravelHistory(userId)).thenReturn(Optional.of(testUser));
        when(userRepository.findByIdWithBucketList(userId)).thenReturn(Optional.of(testUser));

        // Act
        UserResponseDTO result = profileService.getUserProfile(userId);

        // Assert
        assertNotNull(result);
        assertEquals(testUserResponse.getId(), result.getId());
        assertEquals(testUserResponse.getFirstName(), result.getFirstName());
        assertEquals(testUserResponse.getLastName(), result.getLastName());
        assertEquals(testUserResponse.getEmail(), result.getEmail());
        assertEquals(testUserResponse.getDob(), result.getDob());
        assertEquals(testUserResponse.getAge(), result.getAge());
        assertEquals(testUserResponse.getIsVerified(), result.getIsVerified());
        assertEquals(testUserResponse.getCreatedAt(), result.getCreatedAt());

        // Verify repository calls
        verify(userRepository).findByIdWithBasicRelations(userId);
        verify(userRepository).findByIdWithTravelHistory(userId);
        verify(userRepository).findByIdWithBucketList(userId);
    }

    @Test
    void getUserProfile_ShouldReturnNull_WhenUserDoesNotExist() {
        // Arrange
        Integer userId = 999;
        when(userRepository.findByIdWithBasicRelations(userId)).thenReturn(Optional.empty());

        // Act
        UserResponseDTO result = profileService.getUserProfile(userId);

        // Assert
        assertNull(result);
        verify(userRepository).findByIdWithBasicRelations(userId);
        verify(userRepository, never()).findByIdWithTravelHistory(any());
        verify(userRepository, never()).findByIdWithBucketList(any());
    }

    @Test
    void updateProfile_ShouldReturnTrue_WhenValidData() {
        // Arrange
        ProfileUpdateDTO updateDTO = createTestProfileUpdateDTO();
        when(validationService.validateUserInput(updateDTO)).thenReturn(true);
        when(validationService.validateEmailFormat(updateDTO.getEmail())).thenReturn(true);
        lenient().when(userRepository.findByEmail(updateDTO.getEmail())).thenReturn(Optional.empty());
        when(userRepository.save(testUser)).thenReturn(testUser);

        // Act
        Boolean result = profileService.updateProfile(testUser, updateDTO);

        // Assert
        assertTrue(result);
        assertEquals(updateDTO.getFirstName(), testUser.getFirstName());
        assertEquals(updateDTO.getLastName(), testUser.getLastName());
        assertEquals(updateDTO.getEmail(), testUser.getEmail());
        assertEquals(updateDTO.getDob(), testUser.getDob());

        verify(validationService).validateUserInput(updateDTO);
        verify(validationService).validateEmailFormat(updateDTO.getEmail());
        verify(userRepository).save(testUser);
        verify(eventHandlerService).createEvent(eq(testUser.getId()), eq(EventContext.PROFILE_UPDATED), anyString());
    }

    @Test
    void updateProfile_ShouldReturnFalse_WhenEmailAlreadyTaken() {
        // Arrange
        ProfileUpdateDTO updateDTO = createTestProfileUpdateDTO();
        updateDTO.setEmail("existing@example.com");
        
        User existingUser = new User();
        existingUser.setId(2); // Different user ID
        existingUser.setEmail("existing@example.com");
        
        when(validationService.validateUserInput(updateDTO)).thenReturn(true);
        when(validationService.validateEmailFormat(updateDTO.getEmail())).thenReturn(true);
        when(userRepository.findByEmail(updateDTO.getEmail())).thenReturn(Optional.of(existingUser));

        // Act
        Boolean result = profileService.updateProfile(testUser, updateDTO);

        // Assert
        assertFalse(result);
        verify(validationService).validateUserInput(updateDTO);
        verify(validationService).validateEmailFormat(updateDTO.getEmail());
        verify(userRepository).findByEmail(updateDTO.getEmail());
        verify(userRepository, never()).save(any());
        verify(eventHandlerService, never()).createEvent(any(), any(), any());
    }

    @Test
    void updateProfile_ShouldReturnFalse_WhenValidationFails() {
        // Arrange
        ProfileUpdateDTO updateDTO = createTestProfileUpdateDTO();
        when(validationService.validateUserInput(updateDTO)).thenReturn(false);

        // Act
        Boolean result = profileService.updateProfile(testUser, updateDTO);

        // Assert
        assertFalse(result);
        verify(validationService).validateUserInput(updateDTO);
        verify(userRepository, never()).save(any());
        verify(eventHandlerService, never()).createEvent(any(), any(), any());
    }

    @Test
    void getUserPreferences_ShouldReturnPreference_WhenExists() {
        // Arrange
        Integer userId = 1;
        Preference preference = createTestPreference();
        when(preferenceRepository.findByUserId(userId)).thenReturn(Optional.of(preference));

        // Act
        Preference result = profileService.getUserPreferences(userId);

        // Assert
        assertNotNull(result);
        assertEquals(preference.getId(), result.getId());
        assertEquals(preference.getUserId(), result.getUserId());
        assertEquals(preference.getPrimaryInterest(), result.getPrimaryInterest());
        verify(preferenceRepository).findByUserId(userId);
    }

    @Test
    void getUserPreferences_ShouldReturnNull_WhenNotExists() {
        // Arrange
        Integer userId = 1;
        when(preferenceRepository.findByUserId(userId)).thenReturn(Optional.empty());

        // Act
        Preference result = profileService.getUserPreferences(userId);

        // Assert
        assertNull(result);
        verify(preferenceRepository).findByUserId(userId);
    }

    @Test
    void getUser_ShouldReturnUser_WhenExists() {
        // Arrange
        Integer userId = 1;
        when(userRepository.findById(userId)).thenReturn(Optional.of(testUser));

        // Act
        User result = profileService.getUser(userId);

        // Assert
        assertNotNull(result);
        assertEquals(testUser.getId(), result.getId());
        assertEquals(testUser.getFirstName(), result.getFirstName());
        verify(userRepository).findById(userId);
    }

    @Test
    void getUser_ShouldReturnNull_WhenNotExists() {
        // Arrange
        Integer userId = 999;
        when(userRepository.findById(userId)).thenReturn(Optional.empty());

        // Act
        User result = profileService.getUser(userId);

        // Assert
        assertNull(result);
        verify(userRepository).findById(userId);
    }

    @Test
    void getTravelHistory_ShouldReturnHistorySet() {
        // Arrange
        Set<Destination> travelHistory = createTestDestinations();
        testUser.setTravelHistory(travelHistory);

        // Act
        Set<Destination> result = profileService.getTravelHistory(testUser);

        // Assert
        assertNotNull(result);
        assertEquals(travelHistory.size(), result.size());
        assertEquals(travelHistory, result);
    }

    @Test
    void getBucketList_ShouldReturnBucketListSet() {
        // Arrange
        Set<Destination> bucketList = createTestDestinations();
        testUser.setBucketList(bucketList);

        // Act
        Set<Destination> result = profileService.getBucketList(testUser);

        // Assert
        assertNotNull(result);
        assertEquals(bucketList.size(), result.size());
        assertEquals(bucketList, result);
    }

    // Helper methods for creating test data
    private User createTestUser() {
        User user = new User();
        user.setId(1);
        user.setFirstName("John");
        user.setLastName("Doe");
        user.setEmail("john.doe@example.com");
        user.setGender(Gender.MALE);
        user.setDob(LocalDate.of(1998, 1, 15));
        user.setIsVerified(true);
        user.setLoginCount(5);
        user.setCreatedAt(LocalDateTime.now());
        
        // Initialize collections
        user.setCitizenships(new HashSet<>());
        user.setTravelHistory(new HashSet<>());
        user.setBucketList(new HashSet<>());
        
        return user;
    }

    private UserResponseDTO createTestUserResponse() {
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
                .citizenships(new HashSet<>())
                .preferences(null)
                .travelHistory(new HashSet<>())
                .bucketList(new HashSet<>())
                .build();
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

    private Preference createTestPreference() {
        Preference preference = new Preference();
        preference.setId(1);
        preference.setUserId(1);
        preference.setPrimaryInterest(Interest.CULTURAL_EXPERIENCE);
        preference.setPrimaryTravelStyle(TravelStyle.CASUAL);
        preference.setPreferredClimate(Climate.MEDITERRANEAN);
        preference.setDataSharing(true);
        return preference;
    }

    private Set<Destination> createTestDestinations() {
        Set<Destination> destinations = new HashSet<>();
        Destination destination = new Destination();
        destination.setId(1);
        destination.setName("Paris");
        destination.setDescription("City of Light");
        destinations.add(destination);
        return destinations;
    }
}