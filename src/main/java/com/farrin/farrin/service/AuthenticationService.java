package com.farrin.farrin.service;

import com.farrin.farrin.dto.*;
import com.farrin.farrin.model.User;
import com.farrin.farrin.model.Country;
import com.farrin.farrin.model.Destination;
import com.farrin.farrin.model.TravelHistory;
import com.farrin.farrin.repository.UserRepository;
import com.farrin.farrin.repository.CountryRepository;
import com.farrin.farrin.repository.DestinationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Optional;
import java.util.Random;
import java.util.Set;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthenticationService extends BaseService {

    private final UserRepository userRepository;
    private final CountryRepository countryRepository;
    private final DestinationRepository destinationRepository;
    private final PasswordEncoder passwordEncoder;
    private final DataValidationService validationService;
    private final EmailService emailService;
    private final EventHandlerService eventHandlerService;
    private final UserResponseDTOBuilder userResponseDTOBuilder;
    private final DTODirector dtoDirector;

    public UserResponseDTO login(LoginDTO dto) {
        try {
            logOperation("login", dto.getEmail());
            
            // Input validation is now handled by @Valid annotations in controller
            // Only check for business logic here
            
            Optional<User> userOpt = userRepository.findByEmail(dto.getEmail());
            if (userOpt.isEmpty()) {
                log.warn("Login failed: user not found for email {}", dto.getEmail());
                return null;
            }

            User user = userOpt.get();
            if (!passwordEncoder.matches(dto.getPassword(), user.getPasswordHash())) {
                log.warn("Login failed: invalid password for email {}", dto.getEmail());
                return null;
            }

            if (!user.getIsVerified()) {
                log.warn("Login failed: email not verified for {}", dto.getEmail());
                return null;
            }

            // Update login status and increment counter
            user.setLoggedIn(true);
            user.setLastLoginAt(LocalDateTime.now());
            user.setLoginCount(user.getLoginCount() + 1);
            userRepository.save(user);

            // Log event
            eventHandlerService.createEvent(user.getId(), 
                com.farrin.farrin.model.EventContext.USER_REGISTERED, 
                "User logged in successfully");

            return buildUserResponseDTO(user);
            
        } catch (Exception e) {
            handleServiceException(e, "login");
            return null;
        }
    }

    public Boolean requestPasswordReset(String email) {
        try {
            logOperation("requestPasswordReset", email);
            
            if (!validationService.validateEmailFormat(email)) {
                return false;
            }

            Optional<User> userOpt = userRepository.findByEmail(email);
            if (userOpt.isEmpty()) {
                log.warn("Password reset requested for non-existent email: {}", email);
                return false; // Don't reveal if email exists
            }

            User user = userOpt.get();
            String resetCode = generateVerificationCode(user.getId());
            
            // Store reset code in user's verification code field
            user.setVerificationCode(resetCode);
            userRepository.save(user);
            
            // Log reset code to console for development testing
            log.warn("=================================");
            log.warn("🔐 PASSWORD RESET CODE");
            log.warn("Email: {}", email);
            log.warn("Code: {}", resetCode);
            log.warn("=================================");
            
            // Send reset email
            EmailDTO emailDTO = EmailDTO.builder()
                .emailTo(email)
                .body("Your password reset code is: " + resetCode)
                .build();

            emailService.sendEmail(emailDTO);
            return true;
            
        } catch (Exception e) {
            handleServiceException(e, "requestPasswordReset");
            return false;
        }
    }

    public Boolean resetPassword(User user, String newPassword) {
        try {
            logOperation("resetPassword", user.getEmail());
            
            if (!validationService.validatePasswordStrength(newPassword)) {
                log.warn("Password reset failed: weak password for user {}", user.getId());
                return false;
            }

            String hashedPassword = passwordEncoder.encode(newPassword);
            user.setPasswordHash(hashedPassword);
            userRepository.save(user);

            return true;
            
        } catch (Exception e) {
            handleServiceException(e, "resetPassword");
            return false;
        }
    }

    public Boolean resetPasswordWithCode(PasswordResetDTO dto) {
        try {
            logOperation("resetPasswordWithCode", dto.getEmail());
            
            if (!validationService.validateEmailFormat(dto.getEmail())) {
                return false;
            }

            Optional<User> userOpt = userRepository.findByEmail(dto.getEmail());
            if (userOpt.isEmpty()) {
                log.warn("Password reset failed: user not found for email {}", dto.getEmail());
                return false;
            }

            User user = userOpt.get();
            
            // Validate the reset code (using verification code field for simplicity)
            if (user.getVerificationCode() == null || !user.getVerificationCode().equals(dto.getResetCode())) {
                log.warn("Password reset failed: invalid reset code for email {}", dto.getEmail());
                return false;
            }
            
            // Reset the password
            Boolean result = resetPassword(user, dto.getNewPassword());
            if (result) {
                // Clear the verification code after successful reset
                user.setVerificationCode(null);
                userRepository.save(user);
                
                log.info("Password reset successful for user: {}", dto.getEmail());
                return true;
            }
            
            return false;
            
        } catch (Exception e) {
            handleServiceException(e, "resetPasswordWithCode");
            return false;
        }
    }

    public Boolean verifyEmail(String email, String verificationCode) {
        try {
            logOperation("verifyEmail", email);
            
            Optional<User> userOpt = userRepository.findByEmail(email);
            if (userOpt.isEmpty()) {
                log.warn("Email verification failed: user not found for email {}", email);
                return false;
            }

            User user = userOpt.get();
            
            // Validate the verification code
            if (user.getVerificationCode() == null || !user.getVerificationCode().equals(verificationCode)) {
                log.warn("Email verification failed: invalid verification code for email {}", email);
                return false;
            }
            
            // Mark user as verified and clear verification code
            user.setIsVerified(true);
            user.setVerificationCode(null);
            userRepository.save(user);
            
            log.info("Email verified successfully for user: {}", email);
            return true;
            
        } catch (Exception e) {
            handleServiceException(e, "verifyEmail");
            return false;
        }
    }

    public Boolean logout(Integer userId) {
        try {
            logOperation("logout", userId);
            
            Optional<User> userOpt = userRepository.findById(userId);
            if (userOpt.isEmpty()) {
                return false;
            }

            User user = userOpt.get();
            user.setLoggedIn(false);
            userRepository.save(user);

            return true;
            
        } catch (Exception e) {
            handleServiceException(e, "logout");
            return false;
        }
    }

    public String generateAndSendVerificationCode(String email) {
        try {
            Optional<User> userOpt = userRepository.findByEmail(email);
            if (userOpt.isEmpty()) {
                return null;
            }

            String code = generateVerificationCode(userOpt.get().getId());
            
            EmailDTO emailDTO = EmailDTO.builder()
                .emailTo(email)
                .body("Your email verification code is: " + code)
                .build();

            emailService.sendEmail(emailDTO);
            return code;
            
        } catch (Exception e) {
            handleServiceException(e, "generateAndSendVerificationCode");
            return null;
        }
    }

    @Transactional
    public User createUser(RegisterDTO dto) {
        try {
            log.info("Creating user for email: {}", dto.getEmail());
            
            // Email and password validation is now handled by @Valid annotations
            // Additional business logic validation
            if (dto.getEmail() == null || dto.getPassword() == null) {
                log.warn("Validation failed: null email or password");
                return null;
            }

            // Check if user already exists
            if (userRepository.existsByEmail(dto.getEmail())) {
                log.warn("User creation failed: email already exists {}", dto.getEmail());
                return null;
            }

            User user = new User();
            user.setFirstName(dto.getFirstName());
            user.setLastName(dto.getLastName());
            user.setEmail(dto.getEmail());
            user.setPasswordHash(passwordEncoder.encode(dto.getPassword()));
            user.setGender(dto.getGender());
            user.setLoginCount(0);
            // Parse date of birth from string
            if (dto.getDateOfBirth() != null) {
                user.setDob(LocalDate.parse(dto.getDateOfBirth()));
            }
            
            user.setIsVerified(false); // User needs to verify email
            user.setLoggedIn(false);
            user.setCreatedAt(LocalDateTime.now());
            
            // Generate verification code for development
            String verificationCode = generateVerificationCode(null);
            user.setVerificationCode(verificationCode);
            
            // Log verification code to console for development testing
            log.warn("=================================");
            log.warn("🔐 EMAIL VERIFICATION CODE");
            log.warn("Email: {}", dto.getEmail());
            log.warn("Code: {}", verificationCode);
            log.warn("=================================");

            // Handle citizenships if provided
            if (dto.getCitizenshipIds() != null && !dto.getCitizenshipIds().isEmpty()) {
                Set<Country> countries = new HashSet<>();
                for (Integer countryId : dto.getCitizenshipIds()) {
                    Optional<Country> countryOpt = countryRepository.findById(countryId);
                    if (countryOpt.isPresent()) {
                        countries.add(countryOpt.get());
                        log.info("Added citizenship: {} (ID: {}) for user: {}", countryOpt.get().getName(), countryId, dto.getEmail());
                    } else {
                        log.warn("Country not found with ID: {} for user: {}", countryId, dto.getEmail());
                    }
                }
                user.setCitizenships(countries);
            }

            User savedUser = userRepository.save(user);
            log.info("User created successfully with ID: {} and {} citizenships", 
                    savedUser.getId(), 
                    savedUser.getCitizenships() != null ? savedUser.getCitizenships().size() : 0);
            return savedUser;
            
        } catch (Exception e) {
            log.error("Error creating user: ", e);
            throw e; // Re-throw to trigger rollback
        }
    }

    public void registerUser(User user) {
        try {
            log.info("Registering user: {}", user.getEmail());
            // Skip email verification and events for now
        } catch (Exception e) {
            log.error("Error in registerUser: ", e);
        }
    }

    public RegisterDTO extractRegisterDTO(HTTPRequest request) {
        // In a real implementation, you'd parse the request body
        // This is a placeholder that would use Jackson or similar
        return new RegisterDTO();
    }

    public LoginDTO extractLoginDTO(HTTPRequest request) {
        // In a real implementation, you'd parse the request body
        return new LoginDTO();
    }

    public PasswordResetDTO extractPasswordResetDTO(HTTPRequest request) {
        // In a real implementation, you'd parse the request body
        return new PasswordResetDTO();
    }

    public String generateVerificationCode(Integer userId) {
        Random random = new Random();
        return String.format("%06d", random.nextInt(999999));
    }

    private UserResponseDTO buildUserResponseDTO(User user) {
        // Load user with all relations using the same queries as ProfileService
        Optional<User> userWithBasicRelations = userRepository.findByIdWithBasicRelations(user.getId());
        if (userWithBasicRelations.isPresent()) {
            User fullUser = userWithBasicRelations.get();
            
            // Load travel history and bucket list separately
            User userWithHistory = userRepository.findByIdWithTravelHistory(user.getId()).orElse(fullUser);
            User userWithBucketList = userRepository.findByIdWithBucketList(user.getId()).orElse(fullUser);
            
            // Set the loaded collections on the main user object
            if (userWithHistory.getTravelHistoryEntries() != null) {
                fullUser.setTravelHistoryEntries(userWithHistory.getTravelHistoryEntries());
            }
            if (userWithBucketList.getBucketList() != null) {
                fullUser.setBucketList(userWithBucketList.getBucketList());
            }
            
            return userResponseDTOBuilder
                .setId(fullUser.getId())
                .setFirstName(fullUser.getFirstName())
                .setLastName(fullUser.getLastName())
                .setEmail(fullUser.getEmail())
                .setGender(fullUser.getGender())
                .setDob(fullUser.getDob())
                .setAge(fullUser.getAge())
                .setIsVerified(fullUser.getIsVerified())
                .setLoginCount(fullUser.getLoginCount())
                .setCreatedAt(fullUser.getCreatedAt())
                .setCitizenships(fullUser.getCitizenships())
                .setPreferences(fullUser.getPreferences())
                .setTravelHistory(convertTravelHistoryToDestinations(fullUser.getTravelHistoryEntries()))
                .setBucketList(fullUser.getBucketList())
                .getResult();
        }
        
        // Fallback to basic data if queries fail
        return userResponseDTOBuilder
            .setId(user.getId())
            .setFirstName(user.getFirstName())
            .setLastName(user.getLastName())
            .setEmail(user.getEmail())
            .setGender(user.getGender())
            .setDob(user.getDob())
            .setAge(user.getAge())
            .setIsVerified(user.getIsVerified())
            .setLoginCount(user.getLoginCount())
            .setCreatedAt(user.getCreatedAt())
            .getResult();
    }

    public Boolean deleteAccount(Integer userId, String currentPassword) {
        try {
            logOperation("deleteAccount", userId);
            
            // Verify user exists
            Optional<User> userOpt = userRepository.findById(userId);
            if (userOpt.isEmpty()) {
                log.warn("Account deletion failed: user not found with ID {}", userId);
                return false;
            }
            
            User user = userOpt.get();
            
            // Verify current password
            if (!passwordEncoder.matches(currentPassword, user.getPasswordHash())) {
                log.warn("Account deletion failed: invalid password for user {}", user.getEmail());
                return false;
            }
            
            log.info("Starting account deletion process for user: {} (ID: {})", user.getEmail(), userId);
            
            // Step 1: Clean up ManyToMany relationships manually
            // These need to be removed first to avoid foreign key constraints
            
            // Clear citizenships
            user.getCitizenships().clear();
            
            // Clear bucket list
            if (user.getBucketList() != null) {
                user.getBucketList().clear();
            }
            
            // Clear recommendations
            if (user.getRecommendations() != null) {
                user.getRecommendations().clear();
            }
            
            // Remove user from any collaborative trips (if they exist)
            if (user.getCollaborativeTrips() != null) {
                user.getCollaborativeTrips().clear();
            }
            
            // Save the user to persist the relationship removals
            userRepository.save(user);
            
            // Step 2: Delete the user entity
            // Cascade settings will automatically handle:
            // - OneToOne: preferences
            // - OneToMany: travelGoals, trips, travelHistoryEntries
            userRepository.deleteById(userId);
            
            // Step 3: Log the successful deletion
            eventHandlerService.createEvent(userId, 
                com.farrin.farrin.model.EventContext.PROFILE_UPDATED, 
                "User account permanently deleted");
            
            log.info("Account deletion completed successfully for user ID: {}", userId);
            return true;
            
        } catch (Exception e) {
            handleServiceException(e, "deleteAccount");
            log.error("Account deletion failed for user ID: {}", userId, e);
            return false;
        }
    }

    public UserCheckResponseDTO checkUserByEmail(String email) {
        try {
            logOperation("checkUserByEmail", email);
            
            if (!validationService.validateEmailFormat(email)) {
                return UserCheckResponseDTO.builder()
                    .exists(false)
                    .build();
            }
            
            Optional<User> userOpt = userRepository.findByEmail(email);
            if (userOpt.isEmpty()) {
                return UserCheckResponseDTO.builder()
                    .exists(false)
                    .build();
            }
            
            User user = userOpt.get();
            return UserCheckResponseDTO.builder()
                .exists(true)
                .name(user.getFirstName() + " " + user.getLastName())
                .build();
                
        } catch (Exception e) {
            handleServiceException(e, "checkUserByEmail");
            return UserCheckResponseDTO.builder()
                .exists(false)
                .build();
        }
    }

    private Set<Destination> convertTravelHistoryToDestinations(List<TravelHistory> travelHistoryEntries) {
        if (travelHistoryEntries == null || travelHistoryEntries.isEmpty()) {
            return Set.of();
        }
        
        return travelHistoryEntries.stream()
            .map(entry -> {
                try {
                    return destinationRepository.findById(entry.getDestinationId()).orElse(null);
                } catch (Exception e) {
                    log.warn("Error fetching destination for TravelHistory entry {}: {}", entry.getId(), e.getMessage());
                    return null;
                }
            })
            .filter(dest -> dest != null)
            .collect(Collectors.toSet());
    }
}