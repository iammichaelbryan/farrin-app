package com.farrin.farrin.repository;

import com.farrin.farrin.model.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.test.context.ActiveProfiles;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
@ActiveProfiles("test")
class UserRepositoryIntegrationTest {

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private UserRepository userRepository;

    private User testUser;
    private Country testCountry;
    private Continent testContinent;
    private Destination testDestination;
    private Preference testPreference;

    @BeforeEach
    void setUp() {
        // Create test data
        testContinent = createAndPersistContinent();
        testCountry = createAndPersistCountry();
        testDestination = createAndPersistDestination();
        testUser = createAndPersistUser();
        testPreference = createAndPersistPreference();
        
        // Set up relationships
        setupUserRelationships();
        
        entityManager.flush();
        entityManager.clear();
    }

    @Test
    void findByIdWithBasicRelations_ShouldLoadUserWithPreferencesAndCitizenships() {
        // Act
        Optional<User> result = userRepository.findByIdWithBasicRelations(testUser.getId());

        // Assert
        assertTrue(result.isPresent());
        User user = result.get();
        
        assertNotNull(user);
        assertEquals(testUser.getId(), user.getId());
        assertEquals(testUser.getFirstName(), user.getFirstName());
        assertEquals(testUser.getEmail(), user.getEmail());
        assertEquals(testUser.getDob(), user.getDob());
        assertEquals(testUser.getCreatedAt(), user.getCreatedAt());
        
        // Check preferences are loaded
        assertNotNull(user.getPreferences());
        assertEquals(testPreference.getId(), user.getPreferences().getId());
        assertEquals(testPreference.getPrimaryInterest(), user.getPreferences().getPrimaryInterest());
        
        // Check citizenships are loaded
        assertNotNull(user.getCitizenships());
        assertFalse(user.getCitizenships().isEmpty());
        assertEquals(1, user.getCitizenships().size());
        
        Country citizenship = user.getCitizenships().iterator().next();
        assertEquals(testCountry.getId(), citizenship.getId());
        assertEquals(testCountry.getName(), citizenship.getName());
        assertEquals(testCountry.getCountryCode(), citizenship.getCountryCode());
    }

    @Test
    void findByIdWithTravelHistory_ShouldLoadUserWithTravelHistory() {
        // Act
        Optional<User> result = userRepository.findByIdWithTravelHistory(testUser.getId());

        // Assert
        assertTrue(result.isPresent());
        User user = result.get();
        
        assertNotNull(user);
        assertEquals(testUser.getId(), user.getId());
        
        // Check travel history is loaded
        assertNotNull(user.getTravelHistory());
        assertFalse(user.getTravelHistory().isEmpty());
        assertEquals(1, user.getTravelHistory().size());
        
        Destination history = user.getTravelHistory().iterator().next();
        assertEquals(testDestination.getId(), history.getId());
        assertEquals(testDestination.getName(), history.getName());
    }

    @Test
    void findByIdWithBucketList_ShouldLoadUserWithBucketList() {
        // Act
        Optional<User> result = userRepository.findByIdWithBucketList(testUser.getId());

        // Assert
        assertTrue(result.isPresent());
        User user = result.get();
        
        assertNotNull(user);
        assertEquals(testUser.getId(), user.getId());
        
        // Check bucket list is loaded
        assertNotNull(user.getBucketList());
        assertFalse(user.getBucketList().isEmpty());
        assertEquals(1, user.getBucketList().size());
        
        Destination bucketItem = user.getBucketList().iterator().next();
        assertEquals(testDestination.getId(), bucketItem.getId());
        assertEquals(testDestination.getName(), bucketItem.getName());
    }

    @Test
    void findByEmail_ShouldReturnUser_WhenEmailExists() {
        // Act
        Optional<User> result = userRepository.findByEmail(testUser.getEmail());

        // Assert
        assertTrue(result.isPresent());
        User user = result.get();
        assertEquals(testUser.getId(), user.getId());
        assertEquals(testUser.getEmail(), user.getEmail());
    }

    @Test
    void findByEmail_ShouldReturnEmpty_WhenEmailDoesNotExist() {
        // Act
        Optional<User> result = userRepository.findByEmail("nonexistent@example.com");

        // Assert
        assertFalse(result.isPresent());
    }

    @Test
    void existsByEmail_ShouldReturnTrue_WhenEmailExists() {
        // Act
        boolean result = userRepository.existsByEmail(testUser.getEmail());

        // Assert
        assertTrue(result);
    }

    @Test
    void existsByEmail_ShouldReturnFalse_WhenEmailDoesNotExist() {
        // Act
        boolean result = userRepository.existsByEmail("nonexistent@example.com");

        // Assert
        assertFalse(result);
    }

    @Test
    void findVerifiedUserByEmail_ShouldReturnUser_WhenUserIsVerified() {
        // Arrange
        testUser.setIsVerified(true);
        entityManager.merge(testUser);
        entityManager.flush();

        // Act
        Optional<User> result = userRepository.findVerifiedUserByEmail(testUser.getEmail());

        // Assert
        assertTrue(result.isPresent());
        User user = result.get();
        assertEquals(testUser.getId(), user.getId());
        assertTrue(user.getIsVerified());
    }

    @Test
    void findVerifiedUserByEmail_ShouldReturnEmpty_WhenUserIsNotVerified() {
        // Arrange
        testUser.setIsVerified(false);
        entityManager.merge(testUser);
        entityManager.flush();

        // Act
        Optional<User> result = userRepository.findVerifiedUserByEmail(testUser.getEmail());

        // Assert
        assertFalse(result.isPresent());
    }

    @Test
    void userAgeCalculation_ShouldReturnCorrectAge() {
        // Arrange
        LocalDate birthDate = LocalDate.of(1990, 5, 15);
        testUser.setDob(birthDate);
        entityManager.merge(testUser);
        entityManager.flush();
        entityManager.clear();

        // Act
        Optional<User> result = userRepository.findById(testUser.getId());

        // Assert
        assertTrue(result.isPresent());
        User user = result.get();
        assertNotNull(user.getAge());
        
        // Calculate expected age
        int expectedAge = LocalDate.now().getYear() - birthDate.getYear();
        if (LocalDate.now().getDayOfYear() < birthDate.getDayOfYear()) {
            expectedAge--;
        }
        
        assertEquals(expectedAge, user.getAge());
    }

    // Helper methods for creating test data
    private Continent createAndPersistContinent() {
        Continent continent = new Continent();
        continent.setName("North America");
        return entityManager.persistAndFlush(continent);
    }

    private Country createAndPersistCountry() {
        Country country = new Country();
        country.setName("United States");
        country.setCountryCode("USA");
        country.setContinentId(testContinent.getId());
        return entityManager.persistAndFlush(country);
    }

    private Destination createAndPersistDestination() {
        Destination destination = new Destination();
        destination.setName("New York");
        destination.setDescription("The Big Apple");
        destination.setCountryId(testCountry.getId());
        destination.setClimate(Climate.CONTINENTAL);
        return entityManager.persistAndFlush(destination);
    }

    private User createAndPersistUser() {
        User user = new User();
        user.setFirstName("John");
        user.setLastName("Doe");
        user.setEmail("john.doe@example.com");
        user.setPasswordHash("hashedpassword");
        user.setGender(Gender.MALE);
        user.setDob(LocalDate.of(1998, 1, 15));
        user.setIsVerified(true);
        user.setCreatedAt(LocalDateTime.now());
        user.setLoginCount(0);
        user.setLoggedIn(false);
        
        // Initialize collections
        user.setCitizenships(new HashSet<>());
        user.setTravelHistory(new HashSet<>());
        user.setBucketList(new HashSet<>());
        
        return entityManager.persistAndFlush(user);
    }

    private Preference createAndPersistPreference() {
        Preference preference = new Preference();
        preference.setUserId(testUser.getId());
        preference.setPrimaryInterest(Interest.CULTURAL_EXPERIENCE);
        preference.setPrimaryTravelStyle(TravelStyle.CASUAL);
        preference.setPreferredClimate(Climate.MEDITERRANEAN);
        preference.setDataSharing(true);
        preference.setLowerLimitBudget(1000);
        preference.setUpperLimitBudget(5000);
        return entityManager.persistAndFlush(preference);
    }

    private void setupUserRelationships() {
        // Add citizenship
        Set<Country> citizenships = testUser.getCitizenships();
        citizenships.add(testCountry);
        testUser.setCitizenships(citizenships);
        
        // Add travel history
        Set<Destination> travelHistory = testUser.getTravelHistory();
        travelHistory.add(testDestination);
        testUser.setTravelHistory(travelHistory);
        
        // Add bucket list
        Set<Destination> bucketList = testUser.getBucketList();
        bucketList.add(testDestination);
        testUser.setBucketList(bucketList);
        
        // Set preference relationship
        testUser.setPreferences(testPreference);
        
        entityManager.merge(testUser);
    }
}