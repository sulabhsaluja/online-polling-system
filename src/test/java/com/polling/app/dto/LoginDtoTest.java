package com.polling.app.dto;

import com.polling.app.validation.ValidationGroups;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("LoginDto Validation Tests")
class LoginDtoTest {

    private Validator validator;

    @BeforeEach
    void setUp() {
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        validator = factory.getValidator();
    }

    private LoginDto createValidDto() {
        return LoginDto.builder()
                .email("test@example.com")
                .password("anyPassword")
                .build();
    }

    @Nested
    @DisplayName("Email Validation")
    class EmailValidation {

        @Test
        @DisplayName("Should pass with valid email")
        void shouldPassWithValidEmail() {
            LoginDto dto = createValidDto();
            
            Set<ConstraintViolation<LoginDto>> violations = 
                validator.validate(dto, ValidationGroups.Login.class);
            
            assertTrue(violations.isEmpty());
        }

        @Test
        @DisplayName("Should fail when email is null")
        void shouldFailWhenEmailIsNull() {
            LoginDto dto = createValidDto();
            dto.setEmail(null);
            
            Set<ConstraintViolation<LoginDto>> violations = 
                validator.validate(dto, ValidationGroups.Login.class);
            
            assertEquals(1, violations.size());
            assertTrue(violations.stream()
                .anyMatch(v -> v.getMessage().contains("Email is required")));
        }

        @Test
        @DisplayName("Should fail when email is blank")
        void shouldFailWhenEmailIsBlank() {
            LoginDto dto = createValidDto();
            dto.setEmail("   ");
            
            Set<ConstraintViolation<LoginDto>> violations = 
                validator.validate(dto, ValidationGroups.Login.class);
            
            assertFalse(violations.isEmpty());
            assertTrue(violations.stream()
                .anyMatch(v -> v.getMessage().contains("Email is required")));
        }

        @Test
        @DisplayName("Should fail when email is empty string")
        void shouldFailWhenEmailIsEmptyString() {
            LoginDto dto = createValidDto();
            dto.setEmail("");
            
            Set<ConstraintViolation<LoginDto>> violations = 
                validator.validate(dto, ValidationGroups.Login.class);
            
            assertEquals(1, violations.size());
            assertTrue(violations.stream()
                .anyMatch(v -> v.getMessage().contains("Email is required")));
        }

        @Test
        @DisplayName("Should fail when email format is invalid")
        void shouldFailWhenEmailFormatIsInvalid() {
            String[] invalidEmails = {
                "invalid",
                "invalid@",
                "@invalid.com",
                "invalid.com",
                "invalid@.com",
                "invalid..email@example.com",
                "invalid@example.",
                "invalid@.example.com"
            };
            
            for (String email : invalidEmails) {
                LoginDto dto = createValidDto();
                dto.setEmail(email);
                
                Set<ConstraintViolation<LoginDto>> violations = 
                    validator.validate(dto, ValidationGroups.Login.class);
                
                assertFalse(violations.isEmpty(), "Email '" + email + "' should be invalid");
                assertTrue(violations.stream()
                    .anyMatch(v -> v.getMessage().contains("Please provide a valid email address")));
            }
        }

        @Test
        @DisplayName("Should pass with valid email formats")
        void shouldPassWithValidEmailFormats() {
            String[] validEmails = {
                "test@example.com",
                "user.name@domain.co.uk",
                "user+tag@example.org",
                "admin@company.com",
                "user123@test-domain.net",
                "first.last+tag@subdomain.domain.com"
            };
            
            for (String email : validEmails) {
                LoginDto dto = createValidDto();
                dto.setEmail(email);
                
                Set<ConstraintViolation<LoginDto>> violations = 
                    validator.validate(dto, ValidationGroups.Login.class);
                
                assertTrue(violations.isEmpty(), "Email '" + email + "' should be valid");
            }
        }
    }

    @Nested
    @DisplayName("Password Validation")
    class PasswordValidation {

        @Test
        @DisplayName("Should pass with valid password")
        void shouldPassWithValidPassword() {
            LoginDto dto = createValidDto();
            
            Set<ConstraintViolation<LoginDto>> violations = 
                validator.validate(dto, ValidationGroups.Login.class);
            
            assertTrue(violations.isEmpty());
        }

        @Test
        @DisplayName("Should fail when password is null")
        void shouldFailWhenPasswordIsNull() {
            LoginDto dto = createValidDto();
            dto.setPassword(null);
            
            Set<ConstraintViolation<LoginDto>> violations = 
                validator.validate(dto, ValidationGroups.Login.class);
            
            assertEquals(1, violations.size());
            assertTrue(violations.stream()
                .anyMatch(v -> v.getMessage().contains("Password is required")));
        }

        @Test
        @DisplayName("Should fail when password is blank")
        void shouldFailWhenPasswordIsBlank() {
            LoginDto dto = createValidDto();
            dto.setPassword("   ");
            
            Set<ConstraintViolation<LoginDto>> violations = 
                validator.validate(dto, ValidationGroups.Login.class);
            
            assertEquals(1, violations.size());
            assertTrue(violations.stream()
                .anyMatch(v -> v.getMessage().contains("Password is required")));
        }

        @Test
        @DisplayName("Should fail when password is empty string")
        void shouldFailWhenPasswordIsEmptyString() {
            LoginDto dto = createValidDto();
            dto.setPassword("");
            
            Set<ConstraintViolation<LoginDto>> violations = 
                validator.validate(dto, ValidationGroups.Login.class);
            
            assertFalse(violations.isEmpty());
            assertTrue(violations.stream()
                .anyMatch(v -> v.getMessage().contains("Password is required")));
        }

        @Test
        @DisplayName("Should fail when password is too long")
        void shouldFailWhenPasswordIsTooLong() {
            LoginDto dto = createValidDto();
            dto.setPassword("a".repeat(101)); // Length > 100
            
            Set<ConstraintViolation<LoginDto>> violations = 
                validator.validate(dto, ValidationGroups.Login.class);
            
            assertEquals(1, violations.size());
            assertTrue(violations.stream()
                .anyMatch(v -> v.getMessage().contains("Password cannot exceed 100 characters")));
        }

        @Test
        @DisplayName("Should pass with passwords of various lengths (within limit)")
        void shouldPassWithPasswordsOfVariousLengthsWithinLimit() {
            String[] validPasswords = {
                "a",                          // Minimum length (1)
                "shortpass",                  // Short password
                "mediumlengthpassword123",    // Medium length
                "a".repeat(100)               // Maximum length (100)
            };
            
            for (String password : validPasswords) {
                LoginDto dto = createValidDto();
                dto.setPassword(password);
                
                Set<ConstraintViolation<LoginDto>> violations = 
                    validator.validate(dto, ValidationGroups.Login.class);
                
                assertTrue(violations.isEmpty(), "Password with length " + password.length() + " should be valid");
            }
        }

        @Test
        @DisplayName("Should pass with special characters in password")
        void shouldPassWithSpecialCharactersInPassword() {
            String[] passwordsWithSpecialChars = {
                "pass@word",
                "pa$$w0rd",
                "p@ssw0rd!",
                "password#123",
                "myPass&word",
                "test*password",
                "login+password"
            };
            
            for (String password : passwordsWithSpecialChars) {
                LoginDto dto = createValidDto();
                dto.setPassword(password);
                
                Set<ConstraintViolation<LoginDto>> violations = 
                    validator.validate(dto, ValidationGroups.Login.class);
                
                assertTrue(violations.isEmpty(), "Password '" + password + "' should be valid for login");
            }
        }
    }

    @Test
    @DisplayName("Should pass validation with valid credentials")
    void shouldPassValidationWithValidCredentials() {
        LoginDto dto = createValidDto();
        
        Set<ConstraintViolation<LoginDto>> violations = 
            validator.validate(dto, ValidationGroups.Login.class);
        
        assertTrue(violations.isEmpty());
    }

    @Test
    @DisplayName("Should accumulate multiple validation errors")
    void shouldAccumulateMultipleValidationErrors() {
        LoginDto dto = LoginDto.builder()
                .email("invalid-email")  // Invalid email format
                .password(null)          // Null password
                .build();
        
        Set<ConstraintViolation<LoginDto>> violations = 
            validator.validate(dto, ValidationGroups.Login.class);
        
        assertEquals(2, violations.size());
        assertTrue(violations.stream()
            .anyMatch(v -> v.getMessage().contains("Please provide a valid email address")));
        assertTrue(violations.stream()
            .anyMatch(v -> v.getMessage().contains("Password is required")));
    }

    @Test
    @DisplayName("Should not validate against other validation groups")
    void shouldNotValidateAgainstOtherValidationGroups() {
        // Create a DTO that would fail Create validation but should pass Login validation
        LoginDto dto = LoginDto.builder()
                .email("test@example.com")
                .password("simplepass") // This would fail Create validation for complexity but should pass Login
                .build();
        
        // Should pass Login validation
        Set<ConstraintViolation<LoginDto>> loginViolations = 
            validator.validate(dto, ValidationGroups.Login.class);
        assertTrue(loginViolations.isEmpty());
        
        // Should also pass default validation (no groups)
        Set<ConstraintViolation<LoginDto>> defaultViolations = 
            validator.validate(dto);
        assertTrue(defaultViolations.isEmpty());
    }

    @Test
    @DisplayName("Should handle boundary cases for password length")
    void shouldHandleBoundaryCasesForPasswordLength() {
        // Test exactly 100 characters (should pass)
        LoginDto dto100 = createValidDto();
        dto100.setPassword("a".repeat(100));
        
        Set<ConstraintViolation<LoginDto>> violations100 = 
            validator.validate(dto100, ValidationGroups.Login.class);
        assertTrue(violations100.isEmpty());
        
        // Test exactly 101 characters (should fail)
        LoginDto dto101 = createValidDto();
        dto101.setPassword("a".repeat(101));
        
        Set<ConstraintViolation<LoginDto>> violations101 = 
            validator.validate(dto101, ValidationGroups.Login.class);
        assertEquals(1, violations101.size());
        assertTrue(violations101.stream()
            .anyMatch(v -> v.getMessage().contains("Password cannot exceed 100 characters")));
    }
}
