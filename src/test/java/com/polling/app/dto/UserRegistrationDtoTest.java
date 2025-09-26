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

@DisplayName("UserRegistrationDto Validation Tests")
class UserRegistrationDtoTest {

    private Validator validator;

    @BeforeEach
    void setUp() {
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        validator = factory.getValidator();
    }

    private UserRegistrationDto createValidDto() {
        return UserRegistrationDto.builder()
                .username("testuser123")
                .email("test@example.com")
                .password("StrongPass123!")
                .firstName("John")
                .lastName("Doe")
                .build();
    }

    @Nested
    @DisplayName("Username Validation")
    class UsernameValidation {

        @Test
        @DisplayName("Should pass with valid username")
        void shouldPassWithValidUsername() {
            UserRegistrationDto dto = createValidDto();
            Set<ConstraintViolation<UserRegistrationDto>> violations = 
                validator.validate(dto, ValidationGroups.Create.class);
            assertTrue(violations.isEmpty());
        }

        @Test
        @DisplayName("Should fail when username is null")
        void shouldFailWhenUsernameIsNull() {
            UserRegistrationDto dto = createValidDto();
            dto.setUsername(null);
            
            Set<ConstraintViolation<UserRegistrationDto>> violations = 
                validator.validate(dto, ValidationGroups.Create.class);
            
            assertEquals(1, violations.size());
            assertTrue(violations.stream()
                .anyMatch(v -> v.getMessage().contains("Username is required")));
        }

        @Test
        @DisplayName("Should fail when username is blank")
        void shouldFailWhenUsernameIsBlank() {
            UserRegistrationDto dto = createValidDto();
            dto.setUsername("   ");
            
            Set<ConstraintViolation<UserRegistrationDto>> violations = 
                validator.validate(dto, ValidationGroups.Create.class);
            
            assertFalse(violations.isEmpty());
            assertTrue(violations.stream()
                .anyMatch(v -> v.getMessage().contains("Username is required")));
        }

        @Test
        @DisplayName("Should fail when username is too short")
        void shouldFailWhenUsernameIsTooShort() {
            UserRegistrationDto dto = createValidDto();
            dto.setUsername("ab");
            
            Set<ConstraintViolation<UserRegistrationDto>> violations = 
                validator.validate(dto, ValidationGroups.Create.class);
            
            assertEquals(1, violations.size());
            assertTrue(violations.stream()
                .anyMatch(v -> v.getMessage().contains("Username must be between 3 and 50 characters")));
        }

        @Test
        @DisplayName("Should fail when username is too long")
        void shouldFailWhenUsernameIsTooLong() {
            UserRegistrationDto dto = createValidDto();
            dto.setUsername("a".repeat(51));
            
            Set<ConstraintViolation<UserRegistrationDto>> violations = 
                validator.validate(dto, ValidationGroups.Create.class);
            
            assertEquals(1, violations.size());
            assertTrue(violations.stream()
                .anyMatch(v -> v.getMessage().contains("Username must be between 3 and 50 characters")));
        }

        @Test
        @DisplayName("Should fail when username contains invalid characters")
        void shouldFailWhenUsernameContainsInvalidCharacters() {
            UserRegistrationDto dto = createValidDto();
            dto.setUsername("user@name");
            
            Set<ConstraintViolation<UserRegistrationDto>> violations = 
                validator.validate(dto, ValidationGroups.Create.class);
            
            assertEquals(1, violations.size());
            assertTrue(violations.stream()
                .anyMatch(v -> v.getMessage().contains("Username can only contain letters, numbers, dots, underscores, and hyphens")));
        }

        @Test
        @DisplayName("Should pass with valid username characters")
        void shouldPassWithValidUsernameCharacters() {
            String[] validUsernames = {"user123", "user.name", "user_name", "user-name", "123user"};
            
            for (String username : validUsernames) {
                UserRegistrationDto dto = createValidDto();
                dto.setUsername(username);
                
                Set<ConstraintViolation<UserRegistrationDto>> violations = 
                    validator.validate(dto, ValidationGroups.Create.class);
                
                assertTrue(violations.isEmpty(), "Username '" + username + "' should be valid");
            }
        }
    }

    @Nested
    @DisplayName("Email Validation")
    class EmailValidation {

        @Test
        @DisplayName("Should fail when email is null")
        void shouldFailWhenEmailIsNull() {
            UserRegistrationDto dto = createValidDto();
            dto.setEmail(null);
            
            Set<ConstraintViolation<UserRegistrationDto>> violations = 
                validator.validate(dto, ValidationGroups.Create.class);
            
            assertEquals(1, violations.size());
            assertTrue(violations.stream()
                .anyMatch(v -> v.getMessage().contains("Email is required")));
        }

        @Test
        @DisplayName("Should fail when email is blank")
        void shouldFailWhenEmailIsBlank() {
            UserRegistrationDto dto = createValidDto();
            dto.setEmail("   ");
            
            Set<ConstraintViolation<UserRegistrationDto>> violations = 
                validator.validate(dto, ValidationGroups.Create.class);
            
            assertFalse(violations.isEmpty());
            assertTrue(violations.stream()
                .anyMatch(v -> v.getMessage().contains("Email is required")));
        }

        @Test
        @DisplayName("Should fail when email format is invalid")
        void shouldFailWhenEmailFormatIsInvalid() {
            String[] invalidEmails = {"invalid", "invalid@", "@invalid.com", "invalid.com", "invalid@.com"};
            
            for (String email : invalidEmails) {
                UserRegistrationDto dto = createValidDto();
                dto.setEmail(email);
                
                Set<ConstraintViolation<UserRegistrationDto>> violations = 
                    validator.validate(dto, ValidationGroups.Create.class);
                
                assertFalse(violations.isEmpty(), "Email '" + email + "' should be invalid");
                assertTrue(violations.stream()
                    .anyMatch(v -> v.getMessage().contains("Please provide a valid email address")));
            }
        }

        @Test
        @DisplayName("Should fail when email is too long")
        void shouldFailWhenEmailIsTooLong() {
            UserRegistrationDto dto = createValidDto();
            dto.setEmail("a".repeat(95) + "@b.com"); // Total length > 100
            
            Set<ConstraintViolation<UserRegistrationDto>> violations = 
                validator.validate(dto, ValidationGroups.Create.class);
            
            assertFalse(violations.isEmpty());
            assertTrue(violations.stream()
                .anyMatch(v -> v.getMessage().contains("Email cannot exceed 100 characters")));
        }

        @Test
        @DisplayName("Should pass with valid emails")
        void shouldPassWithValidEmails() {
            String[] validEmails = {"test@example.com", "user.name@domain.co.uk", "user+tag@example.org"};
            
            for (String email : validEmails) {
                UserRegistrationDto dto = createValidDto();
                dto.setEmail(email);
                
                Set<ConstraintViolation<UserRegistrationDto>> violations = 
                    validator.validate(dto, ValidationGroups.Create.class);
                
                assertTrue(violations.isEmpty(), "Email '" + email + "' should be valid");
            }
        }
    }

    @Nested
    @DisplayName("Password Validation")
    class PasswordValidation {

        @Test
        @DisplayName("Should fail when password is null")
        void shouldFailWhenPasswordIsNull() {
            UserRegistrationDto dto = createValidDto();
            dto.setPassword(null);
            
            Set<ConstraintViolation<UserRegistrationDto>> violations = 
                validator.validate(dto, ValidationGroups.Create.class);
            
            assertEquals(1, violations.size());
            assertTrue(violations.stream()
                .anyMatch(v -> v.getMessage().contains("Password is required")));
        }

        @Test
        @DisplayName("Should fail when password is too short")
        void shouldFailWhenPasswordIsTooShort() {
            UserRegistrationDto dto = createValidDto();
            dto.setPassword("Short1!");
            
            Set<ConstraintViolation<UserRegistrationDto>> violations = 
                validator.validate(dto, ValidationGroups.Create.class);
            
            assertEquals(1, violations.size());
            assertTrue(violations.stream()
                .anyMatch(v -> v.getMessage().contains("Password must be between 8 and 100 characters")));
        }

        @Test
        @DisplayName("Should fail when password is too long")
        void shouldFailWhenPasswordIsTooLong() {
            UserRegistrationDto dto = createValidDto();
            dto.setPassword("A".repeat(101));
            
            Set<ConstraintViolation<UserRegistrationDto>> violations = 
                validator.validate(dto, ValidationGroups.Create.class);
            
            assertFalse(violations.isEmpty());
            assertTrue(violations.stream()
                .anyMatch(v -> v.getMessage().contains("Password must be between 8 and 100 characters")));
        }

        @Test
        @DisplayName("Should fail when password lacks lowercase letter")
        void shouldFailWhenPasswordLacksLowercase() {
            UserRegistrationDto dto = createValidDto();
            dto.setPassword("PASSWORD123!");
            
            Set<ConstraintViolation<UserRegistrationDto>> violations = 
                validator.validate(dto, ValidationGroups.Create.class);
            
            assertEquals(1, violations.size());
            assertTrue(violations.stream()
                .anyMatch(v -> v.getMessage().contains("Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character")));
        }

        @Test
        @DisplayName("Should fail when password lacks uppercase letter")
        void shouldFailWhenPasswordLacksUppercase() {
            UserRegistrationDto dto = createValidDto();
            dto.setPassword("password123!");
            
            Set<ConstraintViolation<UserRegistrationDto>> violations = 
                validator.validate(dto, ValidationGroups.Create.class);
            
            assertEquals(1, violations.size());
            assertTrue(violations.stream()
                .anyMatch(v -> v.getMessage().contains("Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character")));
        }

        @Test
        @DisplayName("Should fail when password lacks digit")
        void shouldFailWhenPasswordLacksDigit() {
            UserRegistrationDto dto = createValidDto();
            dto.setPassword("Password!");
            
            Set<ConstraintViolation<UserRegistrationDto>> violations = 
                validator.validate(dto, ValidationGroups.Create.class);
            
            assertEquals(1, violations.size());
            assertTrue(violations.stream()
                .anyMatch(v -> v.getMessage().contains("Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character")));
        }

        @Test
        @DisplayName("Should fail when password lacks special character")
        void shouldFailWhenPasswordLacksSpecialCharacter() {
            UserRegistrationDto dto = createValidDto();
            dto.setPassword("Password123");
            
            Set<ConstraintViolation<UserRegistrationDto>> violations = 
                validator.validate(dto, ValidationGroups.Create.class);
            
            assertEquals(1, violations.size());
            assertTrue(violations.stream()
                .anyMatch(v -> v.getMessage().contains("Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character")));
        }

        @Test
        @DisplayName("Should pass with valid passwords")
        void shouldPassWithValidPasswords() {
            String[] validPasswords = {"StrongPass123!", "MyP@ssw0rd", "Secure&123", "Valid$Pass9"};
            
            for (String password : validPasswords) {
                UserRegistrationDto dto = createValidDto();
                dto.setPassword(password);
                
                Set<ConstraintViolation<UserRegistrationDto>> violations = 
                    validator.validate(dto, ValidationGroups.Create.class);
                
                assertTrue(violations.isEmpty(), "Password '" + password + "' should be valid");
            }
        }
    }

    @Nested
    @DisplayName("Name Validation")
    class NameValidation {

        @Test
        @DisplayName("Should fail when first name is null")
        void shouldFailWhenFirstNameIsNull() {
            UserRegistrationDto dto = createValidDto();
            dto.setFirstName(null);
            
            Set<ConstraintViolation<UserRegistrationDto>> violations = 
                validator.validate(dto, ValidationGroups.Create.class);
            
            assertEquals(1, violations.size());
            assertTrue(violations.stream()
                .anyMatch(v -> v.getMessage().contains("First name is required")));
        }

        @Test
        @DisplayName("Should fail when last name is null")
        void shouldFailWhenLastNameIsNull() {
            UserRegistrationDto dto = createValidDto();
            dto.setLastName(null);
            
            Set<ConstraintViolation<UserRegistrationDto>> violations = 
                validator.validate(dto, ValidationGroups.Create.class);
            
            assertEquals(1, violations.size());
            assertTrue(violations.stream()
                .anyMatch(v -> v.getMessage().contains("Last name is required")));
        }

        @Test
        @DisplayName("Should fail when first name is too long")
        void shouldFailWhenFirstNameIsTooLong() {
            UserRegistrationDto dto = createValidDto();
            dto.setFirstName("A".repeat(51));
            
            Set<ConstraintViolation<UserRegistrationDto>> violations = 
                validator.validate(dto, ValidationGroups.Create.class);
            
            assertEquals(1, violations.size());
            assertTrue(violations.stream()
                .anyMatch(v -> v.getMessage().contains("First name must be between 1 and 50 characters")));
        }

        @Test
        @DisplayName("Should fail when last name is too long")
        void shouldFailWhenLastNameIsTooLong() {
            UserRegistrationDto dto = createValidDto();
            dto.setLastName("A".repeat(51));
            
            Set<ConstraintViolation<UserRegistrationDto>> violations = 
                validator.validate(dto, ValidationGroups.Create.class);
            
            assertEquals(1, violations.size());
            assertTrue(violations.stream()
                .anyMatch(v -> v.getMessage().contains("Last name must be between 1 and 50 characters")));
        }

        @Test
        @DisplayName("Should fail when first name contains invalid characters")
        void shouldFailWhenFirstNameContainsInvalidCharacters() {
            UserRegistrationDto dto = createValidDto();
            dto.setFirstName("John123");
            
            Set<ConstraintViolation<UserRegistrationDto>> violations = 
                validator.validate(dto, ValidationGroups.Create.class);
            
            assertEquals(1, violations.size());
            assertTrue(violations.stream()
                .anyMatch(v -> v.getMessage().contains("First name can only contain letters and spaces")));
        }

        @Test
        @DisplayName("Should fail when last name contains invalid characters")
        void shouldFailWhenLastNameContainsInvalidCharacters() {
            UserRegistrationDto dto = createValidDto();
            dto.setLastName("Doe@123");
            
            Set<ConstraintViolation<UserRegistrationDto>> violations = 
                validator.validate(dto, ValidationGroups.Create.class);
            
            assertEquals(1, violations.size());
            assertTrue(violations.stream()
                .anyMatch(v -> v.getMessage().contains("Last name can only contain letters and spaces")));
        }

        @Test
        @DisplayName("Should pass with valid names")
        void shouldPassWithValidNames() {
            String[] validNames = {"John", "Mary Jane", "O Connor", "van Der Berg"};
            
            for (String name : validNames) {
                UserRegistrationDto dto = createValidDto();
                dto.setFirstName(name);
                dto.setLastName(name);
                
                Set<ConstraintViolation<UserRegistrationDto>> violations = 
                    validator.validate(dto, ValidationGroups.Create.class);
                
                assertTrue(violations.isEmpty(), "Name '" + name + "' should be valid");
            }
        }
    }

    @Test
    @DisplayName("Should pass validation with all valid fields")
    void shouldPassValidationWithAllValidFields() {
        UserRegistrationDto dto = createValidDto();
        
        Set<ConstraintViolation<UserRegistrationDto>> violations = 
            validator.validate(dto, ValidationGroups.Create.class);
        
        assertTrue(violations.isEmpty());
    }

    @Test
    @DisplayName("Should accumulate multiple validation errors")
    void shouldAccumulateMultipleValidationErrors() {
        UserRegistrationDto dto = UserRegistrationDto.builder()
                .username("ab")  // Too short
                .email("invalid-email")  // Invalid format
                .password("weak")  // Too short and weak
                .firstName("John123")  // Contains numbers
                .lastName("Doe@")  // Contains invalid characters
                .build();
        
        Set<ConstraintViolation<UserRegistrationDto>> violations = 
            validator.validate(dto, ValidationGroups.Create.class);
        
        assertTrue(violations.size() >= 5);
    }
}
