package com.farrin.farrin.service;

import com.farrin.farrin.model.*;
import com.farrin.farrin.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Set;

@Service
@RequiredArgsConstructor
@Slf4j
public class DataLoaderService implements CommandLineRunner {

    private final UserRepository userRepository;
    private final CountryRepository countryRepository;
    private final ContinentRepository continentRepository;
    private final DestinationRepository destinationRepository;
    private final PreferenceRepository preferenceRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        loadInitialData();
    }

    private void loadInitialData() {
        log.info("Loading initial test data...");

        // Create continents if they don't exist
        createContinentsIfNotExist();
        
        // Create countries if they don't exist
        createCountriesIfNotExist();
        
        // Create destinations if they don't exist
        createDestinationsIfNotExist();
        
        // Create test users if they don't exist
        createTestUsersIfNotExist();

        log.info("Initial test data loading completed.");
    }

    private void createContinentsIfNotExist() {
        if (continentRepository.count() == 0) {
            log.info("Creating continents...");
            Continent northAmerica = new Continent();
            northAmerica.setName("North America");
            continentRepository.save(northAmerica);
            
            Continent europe = new Continent();
            europe.setName("Europe");
            continentRepository.save(europe);
            
            Continent asia = new Continent();
            asia.setName("Asia");
            continentRepository.save(asia);
            
            Continent africa = new Continent();
            africa.setName("Africa");
            continentRepository.save(africa);
            
            Continent southAmerica = new Continent();
            southAmerica.setName("South America");
            continentRepository.save(southAmerica);
            
            Continent oceania = new Continent();
            oceania.setName("Oceania");
            continentRepository.save(oceania);
            
            Continent antarctica = new Continent();
            antarctica.setName("Antarctica");
            continentRepository.save(antarctica);
        }
    }

    private void createCountriesIfNotExist() {
        if (countryRepository.count() == 0) {
            log.info("Creating countries...");
            Continent northAmerica = continentRepository.findByName("North America").orElse(null);
            Continent europe = continentRepository.findByName("Europe").orElse(null);
            Continent asia = continentRepository.findByName("Asia").orElse(null);

            if (northAmerica != null) {
                Country usa = new Country();
                usa.setName("United States");
                usa.setCountryCode("USA");
                usa.setContinentId(northAmerica.getId());
                countryRepository.save(usa);
                
                Country canada = new Country();
                canada.setName("Canada");
                canada.setCountryCode("CAN");
                canada.setContinentId(northAmerica.getId());
                countryRepository.save(canada);
                
                Country mexico = new Country();
                mexico.setName("Mexico");
                mexico.setCountryCode("MEX");
                mexico.setContinentId(northAmerica.getId());
                countryRepository.save(mexico);
            }

            if (europe != null) {
                Country uk = new Country();
                uk.setName("United Kingdom");
                uk.setCountryCode("GBR");
                uk.setContinentId(europe.getId());
                countryRepository.save(uk);
                
                Country france = new Country();
                france.setName("France");
                france.setCountryCode("FRA");
                france.setContinentId(europe.getId());
                countryRepository.save(france);
                
                Country germany = new Country();
                germany.setName("Germany");
                germany.setCountryCode("DEU");
                germany.setContinentId(europe.getId());
                countryRepository.save(germany);
                
                Country italy = new Country();
                italy.setName("Italy");
                italy.setCountryCode("ITA");
                italy.setContinentId(europe.getId());
                countryRepository.save(italy);
                
                Country spain = new Country();
                spain.setName("Spain");
                spain.setCountryCode("ESP");
                spain.setContinentId(europe.getId());
                countryRepository.save(spain);
            }

            if (asia != null) {
                Country japan = new Country();
                japan.setName("Japan");
                japan.setCountryCode("JPN");
                japan.setContinentId(asia.getId());
                countryRepository.save(japan);
                
                Country china = new Country();
                china.setName("China");
                china.setCountryCode("CHN");
                china.setContinentId(asia.getId());
                countryRepository.save(china);
                
                Country india = new Country();
                india.setName("India");
                india.setCountryCode("IND");
                india.setContinentId(asia.getId());
                countryRepository.save(india);
                
                Country thailand = new Country();
                thailand.setName("Thailand");
                thailand.setCountryCode("THA");
                thailand.setContinentId(asia.getId());
                countryRepository.save(thailand);
            }
        }
    }

    private void createDestinationsIfNotExist() {
        if (destinationRepository.count() == 0) {
            log.info("Creating destinations...");
            Country usa = countryRepository.findByName("United States").orElse(null);
            Country france = countryRepository.findByName("France").orElse(null);
            Country japan = countryRepository.findByName("Japan").orElse(null);

            if (usa != null) {
                Destination nyc = new Destination();
                nyc.setName("New York City");
                nyc.setCountryId(usa.getId());
                nyc.setDescription("The city that never sleeps, famous for its skyline, Broadway shows, and cultural diversity.");
                nyc.setClimate(Climate.CONTINENTAL);
                nyc.setLatitude(java.math.BigDecimal.valueOf(40.7128));
                nyc.setLongitude(java.math.BigDecimal.valueOf(-74.0060));
                destinationRepository.save(nyc);

                Destination la = new Destination();
                la.setName("Los Angeles");
                la.setCountryId(usa.getId());
                la.setDescription("City of Angels, home to Hollywood and beautiful beaches.");
                la.setClimate(Climate.MEDITERRANEAN);
                la.setLatitude(java.math.BigDecimal.valueOf(34.0522));
                la.setLongitude(java.math.BigDecimal.valueOf(-118.2437));
                destinationRepository.save(la);
            }

            if (france != null) {
                Destination paris = new Destination();
                paris.setName("Paris");
                paris.setCountryId(france.getId());
                paris.setDescription("The City of Light, famous for its art, fashion, and cuisine.");
                paris.setClimate(Climate.CONTINENTAL);
                paris.setLatitude(java.math.BigDecimal.valueOf(48.8566));
                paris.setLongitude(java.math.BigDecimal.valueOf(2.3522));
                destinationRepository.save(paris);
            }

            if (japan != null) {
                Destination tokyo = new Destination();
                tokyo.setName("Tokyo");
                tokyo.setCountryId(japan.getId());
                tokyo.setDescription("Modern metropolis blending traditional culture with cutting-edge technology.");
                tokyo.setClimate(Climate.CONTINENTAL);
                tokyo.setLatitude(java.math.BigDecimal.valueOf(35.6762));
                tokyo.setLongitude(java.math.BigDecimal.valueOf(139.6503));
                destinationRepository.save(tokyo);
            }
        }
    }

    private void createTestUsersIfNotExist() {
        if (userRepository.count() == 0) {
            log.info("Creating test users...");

            // Create test user
            User testUser = new User();
            testUser.setFirstName("John");
            testUser.setLastName("Doe");
            testUser.setEmail("test@example.com");
            testUser.setPasswordHash(passwordEncoder.encode("password123"));
            testUser.setGender(Gender.MALE);
            testUser.setDob(LocalDate.of(1990, 1, 1));
            testUser.setIsVerified(true); // Pre-verified for testing
            testUser.setLoggedIn(false);
            testUser.setLoginCount(0);
            testUser.setCreatedAt(LocalDateTime.now());

            // Add citizenship
            Country usa = countryRepository.findByName("United States").orElse(null);
            if (usa != null) {
                testUser.setCitizenships(Set.of(usa));
            }

            User savedUser = userRepository.save(testUser);
            log.info("Created test user: {} with ID: {}", savedUser.getEmail(), savedUser.getId());

            // Create preferences for test user
            createTestPreferences(savedUser);

            // Create another test user
            User testUser2 = new User();
            testUser2.setFirstName("Jane");
            testUser2.setLastName("Smith");
            testUser2.setEmail("jane@example.com");
            testUser2.setPasswordHash(passwordEncoder.encode("password123"));
            testUser2.setGender(Gender.FEMALE);
            testUser2.setDob(LocalDate.of(1985, 5, 15));
            testUser2.setIsVerified(true);
            testUser2.setLoggedIn(false);
            testUser2.setLoginCount(0);
            testUser2.setCreatedAt(LocalDateTime.now());

            if (usa != null) {
                testUser2.setCitizenships(Set.of(usa));
            }

            User savedUser2 = userRepository.save(testUser2);
            log.info("Created test user: {} with ID: {}", savedUser2.getEmail(), savedUser2.getId());
            createTestPreferences(savedUser2);

            log.info("=================================");
            log.info("🧪 TEST USERS CREATED");
            log.info("Email: test@example.com");
            log.info("Password: password123");
            log.info("Email: jane@example.com");
            log.info("Password: password123");
            log.info("=================================");
        }
    }

    private void createTestPreferences(User user) {
        Preference preference = new Preference();
        preference.setUserId(user.getId());
        preference.setPrimaryInterest(Interest.CULTURAL_EXPERIENCE);
        preference.setPrimaryTravelStyle(TravelStyle.CASUAL);
        preference.setPreferredClimate(Climate.MEDITERRANEAN);
        preference.setPreferredTravelSeason(Season.SPRING);
        preference.setTotalBudget(5000);
        preference.setAccommodationBudget(2000);
        preference.setTransportationBudget(1500);
        preference.setAvgTravelDuration(7);  // Default 7 days
        preference.setTransportPreference(TransportType.FLIGHTS);
        preference.setDataSharing(true);
        preferenceRepository.save(preference);
        log.info("Created preferences for user: {}", user.getEmail());
    }
}