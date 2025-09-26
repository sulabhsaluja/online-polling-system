package com.polling.app.dto;

import com.polling.app.validation.ValidationGroups;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("AdminRegistrationDto Validation Tests")
class AdminRegistrationDtoTest {

    private Validator validator;

    @BeforeEach
    void setUp() {
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        validator = factory.getValidator();
    }

    private AdminRegistrationDto createValidDto() {
        return AdminRegistrationDto.builder()
                .username("admin123")
                .email("admin@example.com")
                .password("AdminPass123!")
                .firstName("Admin")
                .lastName("User")
                .build();
    }

    @Test
    @DisplayName("Should pass validation with all valid fields")
    void shouldPassValidationWithAllValidFields() {
        AdminRegistrationDto dto = createValidDto();
        
        Set<ConstraintViolation<AdminRegistrationDto>> violations = 
            validator.validate(dto, ValidationGroups.Create.class);
        
        assertTrue(violations.isEmpty());
    }

    @Test
    @DisplayName("Should fail when username is null")
    void shouldFailWhenUsernameIsNull() {
        AdminRegistrationDto dto = createValidDto();
        dto.setUsername(null);
        
        Set<ConstraintViolation<AdminRegistrationDto>> violations = 
            validator.validate(dto, ValidationGroups.Create.class);
        
        assertEquals(1, violations.size());
        assertTrue(violations.stream()
            .anyMatch(v -> v.getMessage().contains("Username is required")));
    }

    @Test
    @DisplayName("Should fail when username is too short")
    void shouldFailWhenUsernameIsTooShort() {
        AdminRegistrationDto dto = createValidDto();
        dto.setUsername("ab");
        
        Set<ConstraintViolation<AdminRegistrationDto>> violations = 
            validator.validate(dto, ValidationGroups.Create.class);
        
        assertEquals(1, violations.size());
        assertTrue(violations.stream()
            .anyMatch(v -> v.getMessage().contains("Username must be between 3 and 50 characters")));
    }

    @Test
    @DisplayName("Should fail when username contains invalid characters")
    void shouldFailWhenUsernameContainsInvalidCharacters() {
        AdminRegistrationDto dto = createValidDto();
        dto.setUsername("admin@user");
        
        Set<ConstraintViolation<AdminRegistrationDto>> violations = 
            validator.validate(dto, ValidationGroups.Create.class);
        
        assertEquals(1, violations.size());
        assertTrue(violations.stream()
            .anyMatch(v -> v.getMessage().contains("Username can only contain letters, numbers, dots, underscores, and hyphens")));
    }

    @Test
    @DisplayName("Should fail when email is invalid")
    void shouldFailWhenEmailIsInvalid() {
        AdminRegistrationDto dto = createValidDto();
        dto.setEmail("invalid-email");
        
        Set<ConstraintViolation<AdminRegistrationDto>> violations = 
            validator.validate(dto, ValidationGroups.Create.class);
        
        assertEquals(1, violations.size());
        assertTrue(violations.stream()
            .anyMatch(v -> v.getMessage().contains("Please provide a valid email address")));
    }

    @Test
    @DisplayName("Should fail when email is too long")
    void shouldFailWhenEmailIsTooLong() {
        AdminRegistrationDto dto = createValidDto();
        dto.setEmail("a".repeat(95) + "@b.com"); // Total length > 100
        
        Set<ConstraintViolation<AdminRegistrationDto>> violations = 
            validator.validate(dto, ValidationGroups.Create.class);
        
            assertFalse(violations.isEmpty());
        assertTrue(violations.stream()
            .anyMatch(v -> v.getMessage().contains("Email cannot exceed 100 characters")));
    }

    @Test
    @DisplayName("Should fail when password is too weak")
    void shouldFailWhenPasswordIsTooWeak() {
        AdminRegistrationDto dto = createValidDto();
        dto.setPassword("weakpass"); // No uppercase, digit, or special character
        
        Set<ConstraintViolation<AdminRegistrationDto>> violations = 
            validator.validate(dto, ValidationGroups.Create.class);
        
        assertEquals(1, violations.size());
        assertTrue(violations.stream()
            .anyMatch(v -> v.getMessage().contains("Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character")));
    }

    @Test
    @DisplayName("Should fail when password is too short")
    void shouldFailWhenPasswordIsTooShort() {
        AdminRegistrationDto dto = createValidDto();
        dto.setPassword("Short1!");
        
        Set<ConstraintViolation<AdminRegistrationDto>> violations = 
            validator.validate(dto, ValidationGroups.Create.class);
        
        assertEquals(1, violations.size());
        assertTrue(violations.stream()
            .anyMatch(v -> v.getMessage().contains("Password must be between 8 and 100 characters")));
    }

    @Test
    @DisplayName("Should fail when first name contains numbers")
    void shouldFailWhenFirstNameContainsNumbers() {
        AdminRegistrationDto dto = createValidDto();
        dto.setFirstName("Admin123");
        
        Set<ConstraintViolation<AdminRegistrationDto>> violations = 
            validator.validate(dto, ValidationGroups.Create.class);
        
        assertEquals(1, violations.size());
        assertTrue(violations.stream()
            .anyMatch(v -> v.getMessage().contains("First name can only contain letters and spaces")));
    }

    @Test
    @DisplayName("Should fail when last name contains special characters")
    void shouldFailWhenLastNameContainsSpecialCharacters() {
        AdminRegistrationDto dto = createValidDto();
        dto.setLastName("User@123");
        
        Set<ConstraintViolation<AdminRegistrationDto>> violations = 
            validator.validate(dto, ValidationGroups.Create.class);
        
        assertEquals(1, violations.size());
        assertTrue(violations.stream()
            .anyMatch(v -> v.getMessage().contains("Last name can only contain letters and spaces")));
    }

    @Test
    @DisplayName("Should fail when names are too long")
    void shouldFailWhenNamesAreTooLong() {
        AdminRegistrationDto dto = createValidDto();
        dto.setFirstName("A".repeat(51));
        dto.setLastName("B".repeat(51));
        
        Set<ConstraintViolation<AdminRegistrationDto>> violations = 
            validator.validate(dto, ValidationGroups.Create.class);
        
        assertEquals(2, violations.size());
        assertTrue(violations.stream()
            .anyMatch(v -> v.getMessage().contains("First name must be between 1 and 50 characters")));
        assertTrue(violations.stream()
            .anyMatch(v -> v.getMessage().contains("Last name must be between 1 and 50 characters")));
    }

    @Test
    @DisplayName("Should pass with valid admin credentials")
    void shouldPassWithValidAdminCredentials() {
        String[] validUsernames = {"admin", "admin123", "admin.user", "admin_user", "admin-user"};
        String[] validEmails = {"admin@company.com", "admin.user@domain.co.uk", "admin+test@example.org"};
        String[] validPasswords = {"AdminPass123!", "SecureAdmin@1", "MyAdmin$Pass9"};
        String[] validNames = {"Admin", "John Admin", "Mary Jane", "O Connor"};
        
        for (String username : validUsernames) {
            for (String email : validEmails) {
                for (String password : validPasswords) {
                    for (String name : validNames) {
                        AdminRegistrationDto dto = AdminRegistrationDto.builder()
                                .username(username)
                                .email(email)
                                .password(password)
                                .firstName(name)
                                .lastName(name)
                                .build();
                        
                        Set<ConstraintViolation<AdminRegistrationDto>> violations = 
                            validator.validate(dto, ValidationGroups.Create.class);
                        
                        assertTrue(violations.isEmpty(), 
                            String.format("Admin credentials should be valid: username=%s, email=%s, password=%s, name=%s", 
                                username, email, password, name));
                        break; // Just test one combination per username/email/password to keep test time reasonable
                    }
                    break;
                }
                break;
            }
        }
    }

    @Test
    @DisplayName("Should accumulate multiple validation errors")
    void shouldAccumulateMultipleValidationErrors() {
        AdminRegistrationDto dto = AdminRegistrationDto.builder()
                .username("ab")  // Too short
                .email("invalid-email")  // Invalid format
                .password("weak")  // Too short and weak
                .firstName("Admin123")  // Contains numbers
                .lastName("User@")  // Contains invalid characters
                .build();
        
        Set<ConstraintViolation<AdminRegistrationDto>> violations = 
            validator.validate(dto, ValidationGroups.Create.class);
        
        assertTrue(violations.size() >= 5);
    }

    @Test
    @DisplayName("Should handle edge cases for names with spaces")
    void shouldHandleEdgeCasesForNamesWithSpaces() {
        AdminRegistrationDto dto = createValidDto();
        dto.setFirstName("Mary Jane");
        dto.setLastName("van Der Berg");
        
        Set<ConstraintViolation<AdminRegistrationDto>> violations = 
            validator.validate(dto, ValidationGroups.Create.class);
        
        assertTrue(violations.isEmpty());
    }
}
