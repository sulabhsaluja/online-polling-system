package com.polling.app.dto;

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

@DisplayName("VoteSubmissionDto Validation Tests")
class VoteSubmissionDtoTest {

    private Validator validator;

    @BeforeEach
    void setUp() {
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        validator = factory.getValidator();
    }

    private VoteSubmissionDto createValidDto() {
        return VoteSubmissionDto.builder()
                .optionId(1L)
                .build();
    }

    @Nested
    @DisplayName("Option ID Validation")
    class OptionIdValidation {

        @Test
        @DisplayName("Should pass with valid option ID")
        void shouldPassWithValidOptionId() {
            VoteSubmissionDto dto = createValidDto();
            
            Set<ConstraintViolation<VoteSubmissionDto>> violations = 
                validator.validate(dto);
            
            assertTrue(violations.isEmpty());
        }

        @Test
        @DisplayName("Should fail when option ID is null")
        void shouldFailWhenOptionIdIsNull() {
            VoteSubmissionDto dto = createValidDto();
            dto.setOptionId(null);
            
            Set<ConstraintViolation<VoteSubmissionDto>> violations = 
                validator.validate(dto);
            
            assertEquals(1, violations.size());
            assertTrue(violations.stream()
                .anyMatch(v -> v.getMessage().contains("Option ID is required")));
        }

        @Test
        @DisplayName("Should fail when option ID is zero")
        void shouldFailWhenOptionIdIsZero() {
            VoteSubmissionDto dto = createValidDto();
            dto.setOptionId(0L);
            
            Set<ConstraintViolation<VoteSubmissionDto>> violations = 
                validator.validate(dto);
            
            assertEquals(1, violations.size());
            assertTrue(violations.stream()
                .anyMatch(v -> v.getMessage().contains("Option ID must be a positive number")));
        }

        @Test
        @DisplayName("Should fail when option ID is negative")
        void shouldFailWhenOptionIdIsNegative() {
            VoteSubmissionDto dto = createValidDto();
            dto.setOptionId(-1L);
            
            Set<ConstraintViolation<VoteSubmissionDto>> violations = 
                validator.validate(dto);
            
            assertEquals(1, violations.size());
            assertTrue(violations.stream()
                .anyMatch(v -> v.getMessage().contains("Option ID must be a positive number")));
        }

        @Test
        @DisplayName("Should pass with positive option IDs")
        void shouldPassWithPositiveOptionIds() {
            Long[] validOptionIds = {1L, 2L, 10L, 100L, 1000L, 9999999L, Long.MAX_VALUE};
            
            for (Long optionId : validOptionIds) {
                VoteSubmissionDto dto = createValidDto();
                dto.setOptionId(optionId);
                
                Set<ConstraintViolation<VoteSubmissionDto>> violations = 
                    validator.validate(dto);
                
                assertTrue(violations.isEmpty(), "Option ID " + optionId + " should be valid");
            }
        }

        @Test
        @DisplayName("Should fail with negative option IDs")
        void shouldFailWithNegativeOptionIds() {
            Long[] invalidOptionIds = {-1L, -2L, -10L, -100L, -1000L, Long.MIN_VALUE};
            
            for (Long optionId : invalidOptionIds) {
                VoteSubmissionDto dto = createValidDto();
                dto.setOptionId(optionId);
                
                Set<ConstraintViolation<VoteSubmissionDto>> violations = 
                    validator.validate(dto);
                
                assertEquals(1, violations.size(), "Option ID " + optionId + " should be invalid");
                assertTrue(violations.stream()
                    .anyMatch(v -> v.getMessage().contains("Option ID must be a positive number")));
            }
        }

        @Test
        @DisplayName("Should handle boundary case with Long.MAX_VALUE")
        void shouldHandleBoundaryCaseWithMaxValue() {
            VoteSubmissionDto dto = createValidDto();
            dto.setOptionId(Long.MAX_VALUE);
            
            Set<ConstraintViolation<VoteSubmissionDto>> violations = 
                validator.validate(dto);
            
            assertTrue(violations.isEmpty());
        }

        @Test
        @DisplayName("Should handle boundary case with minimum valid value")
        void shouldHandleBoundaryCaseWithMinimumValidValue() {
            VoteSubmissionDto dto = createValidDto();
            dto.setOptionId(1L); // Minimum valid positive value
            
            Set<ConstraintViolation<VoteSubmissionDto>> violations = 
                validator.validate(dto);
            
            assertTrue(violations.isEmpty());
        }
    }

    @Test
    @DisplayName("Should pass validation with all valid fields")
    void shouldPassValidationWithAllValidFields() {
        VoteSubmissionDto dto = createValidDto();
        
        Set<ConstraintViolation<VoteSubmissionDto>> violations = 
            validator.validate(dto);
        
        assertTrue(violations.isEmpty());
    }

    @Test
    @DisplayName("Should accumulate multiple validation errors when option ID is null")
    void shouldAccumulateMultipleValidationErrorsWhenOptionIdIsNull() {
        VoteSubmissionDto dto = VoteSubmissionDto.builder()
                .optionId(null)
                .build();
        
        Set<ConstraintViolation<VoteSubmissionDto>> violations = 
            validator.validate(dto);
        
        // Should have exactly one violation for null option ID
        // (both @NotNull and @Positive should be violated, but @Positive doesn't validate null values)
        assertEquals(1, violations.size());
        assertTrue(violations.stream()
            .anyMatch(v -> v.getMessage().contains("Option ID is required")));
    }

    @Test
    @DisplayName("Should create valid DTO using builder pattern")
    void shouldCreateValidDtoUsingBuilderPattern() {
        VoteSubmissionDto dto = VoteSubmissionDto.builder()
                .optionId(42L)
                .build();
        
        Set<ConstraintViolation<VoteSubmissionDto>> violations = 
            validator.validate(dto);
        
        assertTrue(violations.isEmpty());
        assertEquals(42L, dto.getOptionId());
    }

    @Test
    @DisplayName("Should create valid DTO using no-args constructor")
    void shouldCreateValidDtoUsingNoArgsConstructor() {
        VoteSubmissionDto dto = new VoteSubmissionDto();
        dto.setOptionId(99L);
        
        Set<ConstraintViolation<VoteSubmissionDto>> violations = 
            validator.validate(dto);
        
        assertTrue(violations.isEmpty());
        assertEquals(99L, dto.getOptionId());
    }

    @Test
    @DisplayName("Should create valid DTO using all-args constructor")
    void shouldCreateValidDtoUsingAllArgsConstructor() {
        VoteSubmissionDto dto = new VoteSubmissionDto(123L);
        
        Set<ConstraintViolation<VoteSubmissionDto>> violations = 
            validator.validate(dto);
        
        assertTrue(violations.isEmpty());
        assertEquals(123L, dto.getOptionId());
    }

    @Test
    @DisplayName("Should handle realistic voting scenarios")
    void shouldHandleRealisticVotingScenarios() {
        // Test various realistic option IDs that might be used in a polling application
        Long[] realisticOptionIds = {1L, 2L, 5L, 10L, 25L, 50L, 100L, 500L, 1000L};
        
        for (Long optionId : realisticOptionIds) {
            VoteSubmissionDto dto = VoteSubmissionDto.builder()
                    .optionId(optionId)
                    .build();
            
            Set<ConstraintViolation<VoteSubmissionDto>> violations = 
                validator.validate(dto);
            
            assertTrue(violations.isEmpty(), 
                "Realistic option ID " + optionId + " should be valid for voting");
        }
    }

    @Test
    @DisplayName("Should properly validate DTO equality and hash code")
    void shouldProperlyValidateDtoEqualityAndHashCode() {
        VoteSubmissionDto dto1 = VoteSubmissionDto.builder().optionId(1L).build();
        VoteSubmissionDto dto2 = VoteSubmissionDto.builder().optionId(1L).build();
        VoteSubmissionDto dto3 = VoteSubmissionDto.builder().optionId(2L).build();
        
        // Test that DTOs with same option ID are equal (assuming Lombok generates equals/hashCode)
        assertEquals(dto1, dto2);
        assertEquals(dto1.hashCode(), dto2.hashCode());
        
        // Test that DTOs with different option IDs are not equal
        assertNotEquals(dto1, dto3);
        assertNotEquals(dto1.hashCode(), dto3.hashCode());
        
        // All should pass validation
        assertTrue(validator.validate(dto1).isEmpty());
        assertTrue(validator.validate(dto2).isEmpty());
        assertTrue(validator.validate(dto3).isEmpty());
    }

    @Test
    @DisplayName("Should have meaningful toString representation")
    void shouldHaveMeaningfulToStringRepresentation() {
        VoteSubmissionDto dto = VoteSubmissionDto.builder()
                .optionId(42L)
                .build();
        
        String toString = dto.toString();
        
        // Verify toString contains the option ID (assuming Lombok generates toString)
        assertTrue(toString.contains("42"), "toString should contain the option ID");
        assertTrue(toString.contains("VoteSubmissionDto"), "toString should contain the class name");
    }
}
