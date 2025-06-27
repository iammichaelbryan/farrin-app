package com.farrin.farrin.controller;

import com.farrin.farrin.dto.*;
import com.farrin.farrin.service.AuthenticationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthenticationController {

    private final AuthenticationService authenticationService;

    @PostMapping("/register")
    public ResponseEntity<HTTPResponse> register(@Valid @RequestBody RegisterDTO dto, BindingResult bindingResult) {
        try {
            if (bindingResult.hasErrors()) {
                String errorMessage = bindingResult.getFieldErrors().stream()
                    .map(error -> error.getField() + ": " + error.getDefaultMessage())
                    .collect(Collectors.joining(", "));
                return ResponseEntity.badRequest().body(HTTPResponse.builder()
                    .statusCode(400)
                    .errorMessage("Validation failed: " + errorMessage)
                    .build());
            }
            
            System.out.println("Registration request received for: " + dto.getEmail());
            var user = authenticationService.createUser(dto);
            System.out.println("User creation result: " + (user != null ? "SUCCESS" : "FAILED"));
            if (user != null) {
                authenticationService.registerUser(user);
                return ResponseEntity.ok(HTTPResponse.builder()
                    .statusCode(200)
                    .body("Registration successful")
                    .build());
            }
            return ResponseEntity.badRequest().body(HTTPResponse.builder()
                .statusCode(400)
                .errorMessage("Registration failed")
                .build());
        } catch (Exception e) {
            System.out.println("Registration exception: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(HTTPResponse.builder()
                .statusCode(500)
                .errorMessage("Internal server error: " + e.getMessage())
                .build());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<UserResponseDTO> login(@Valid @RequestBody LoginDTO dto, BindingResult bindingResult) {
        try {
            if (bindingResult.hasErrors()) {
                String errorMessage = bindingResult.getFieldErrors().stream()
                    .map(error -> error.getField() + ": " + error.getDefaultMessage())
                    .collect(Collectors.joining(", "));
                return ResponseEntity.badRequest().build();
            }
            
            UserResponseDTO user = authenticationService.login(dto);
            if (user != null) {
                return ResponseEntity.ok(user);
            }
            return ResponseEntity.status(401).build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping("/password-reset-request")
    public ResponseEntity<HTTPResponse> requestPasswordReset(@RequestParam String email) {
        try {
            Boolean result = authenticationService.requestPasswordReset(email);
            if (result) {
                return ResponseEntity.ok(HTTPResponse.builder()
                    .statusCode(200)
                    .body("Password reset email sent")
                    .build());
            }
            return ResponseEntity.badRequest().body(HTTPResponse.builder()
                .statusCode(400)
                .errorMessage("Password reset request failed")
                .build());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(HTTPResponse.builder()
                .statusCode(500)
                .errorMessage("Internal server error")
                .build());
        }
    }

    @PutMapping("/password-reset")
    public ResponseEntity<HTTPResponse> resetPassword(@RequestBody PasswordResetDTO dto) {
        try {
            Boolean result = authenticationService.resetPasswordWithCode(dto);
            if (result) {
                return ResponseEntity.ok(HTTPResponse.builder()
                    .statusCode(200)
                    .body("Password reset successful")
                    .build());
            }
            return ResponseEntity.badRequest().body(HTTPResponse.builder()
                .statusCode(400)
                .errorMessage("Password reset failed - invalid code or email")
                .build());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(HTTPResponse.builder()
                .statusCode(500)
                .errorMessage("Internal server error")
                .build());
        }
    }

    @PutMapping("/verify-email")
    public ResponseEntity<HTTPResponse> verifyEmail(@RequestParam String email, 
                                                   @RequestParam String verificationCode) {
        try {
            Boolean result = authenticationService.verifyEmail(email, verificationCode);
            if (result) {
                return ResponseEntity.ok(HTTPResponse.builder()
                    .statusCode(200)
                    .body("Email verified successfully")
                    .build());
            }
            return ResponseEntity.badRequest().body(HTTPResponse.builder()
                .statusCode(400)
                .errorMessage("Email verification failed")
                .build());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(HTTPResponse.builder()
                .statusCode(500)
                .errorMessage("Internal server error")
                .build());
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<HTTPResponse> logout(@RequestParam Integer userId) {
        try {
            Boolean result = authenticationService.logout(userId);
            if (result) {
                return ResponseEntity.ok(HTTPResponse.builder()
                    .statusCode(200)
                    .body("Logout successful")
                    .build());
            }
            return ResponseEntity.badRequest().body(HTTPResponse.builder()
                .statusCode(400)
                .errorMessage("Logout failed")
                .build());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(HTTPResponse.builder()
                .statusCode(500)
                .errorMessage("Internal server error")
                .build());
        }
    }

    @DeleteMapping("/account")
    public ResponseEntity<HTTPResponse> deleteAccount(@RequestBody DeleteAccountDTO dto) {
        try {
            Boolean result = authenticationService.deleteAccount(dto.getUserId(), dto.getCurrentPassword());
            if (result) {
                return ResponseEntity.ok(HTTPResponse.builder()
                    .statusCode(200)
                    .body("Account deleted successfully")
                    .build());
            }
            return ResponseEntity.badRequest().body(HTTPResponse.builder()
                .statusCode(400)
                .errorMessage("Account deletion failed - invalid password or user not found")
                .build());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(HTTPResponse.builder()
                .statusCode(500)
                .errorMessage("Internal server error")
                .build());
        }
    }

    @GetMapping("/check-user")
    public ResponseEntity<UserCheckResponseDTO> checkUserByEmail(@RequestParam String email) {
        try {
            UserCheckResponseDTO result = authenticationService.checkUserByEmail(email);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(UserCheckResponseDTO.builder()
                .exists(false)
                .build());
        }
    }
}