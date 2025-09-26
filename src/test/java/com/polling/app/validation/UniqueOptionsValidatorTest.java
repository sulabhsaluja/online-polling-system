package com.polling.app.validation;

import com.polling.app.dto.PollCreationDto;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import jakarta.validation.ConstraintValidatorContext;
import jakarta.validation.ConstraintValidatorContext.ConstraintViolationBuilder;
import jakarta.validation.ConstraintValidatorContext.ConstraintViolationBuilder.NodeBuilderCustomizableContext;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@DisplayName("UniqueOptionsValidator Unit Tests")
class UniqueOptionsValidatorTest {

    private UniqueOptionsValidator validator;
    
    @Mock
    private ConstraintValidatorContext context;
    
    @Mock
    private ConstraintViolationBuilder violationBuilder;
    
    @Mock
    private NodeBuilderCustomizableContext nodeBuilder;
    
    @Mock
    private UniqueOptions uniqueOptions;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        validator = new UniqueOptionsValidator();
        
        // Set up mock chain for constraint violation building
        when(context.buildConstraintViolationWithTemplate(anyString())).thenReturn(violationBuilder);
        when(violationBuilder.addPropertyNode(anyString())).thenReturn(nodeBuilder);
        when(nodeBuilder.addConstraintViolation()).thenReturn(context);
    }

    @Nested
    @DisplayName("Initialization Tests")
    class InitializationTests {

        @Test
        @DisplayName("Should initialize without errors")
        void shouldInitializeWithoutErrors() {
            // Test that initialize method can be called without throwing exceptions
            assertDoesNotThrow(() -> validator.initialize(uniqueOptions));
        }

        @Test
        @DisplayName("Should initialize with null annotation")
        void shouldInitializeWithNullAnnotation() {
            // Test that initialize method handles null annotation gracefully
            assertDoesNotThrow(() -> validator.initialize(null));
        }
    }

    @Nested
    @DisplayName("Null and Empty Input Tests")
    class NullAndEmptyInputTests {

        @Test
        @DisplayName("Should return true when PollCreationDto is null")
        void shouldReturnTrueWhenPollCreationDtoIsNull() {
            boolean result = validator.isValid(null, context);
            
            assertTrue(result);
            verify(context, never()).disableDefaultConstraintViolation();
            verify(context, never()).buildConstraintViolationWithTemplate(anyString());
        }

        @Test
        @DisplayName("Should return true when options list is null")
        void shouldReturnTrueWhenOptionsListIsNull() {
            PollCreationDto dto = PollCreationDto.builder()
                    .title("Test Poll")
                    .options(null)
                    .build();
            
            boolean result = validator.isValid(dto, context);
            
            assertTrue(result);
            verify(context, never()).disableDefaultConstraintViolation();
            verify(context, never()).buildConstraintViolationWithTemplate(anyString());
        }

        @Test
        @DisplayName("Should return true when options list is empty")
        void shouldReturnTrueWhenOptionsListIsEmpty() {
            PollCreationDto dto = PollCreationDto.builder()
                    .title("Test Poll")
                    .options(Collections.emptyList())
                    .build();
            
            boolean result = validator.isValid(dto, context);
            
            assertTrue(result);
            verify(context, never()).disableDefaultConstraintViolation();
            verify(context, never()).buildConstraintViolationWithTemplate(anyString());
        }
    }

    @Nested
    @DisplayName("Valid Options Tests")
    class ValidOptionsTests {

        @Test
        @DisplayName("Should return true with unique options")
        void shouldReturnTrueWithUniqueOptions() {
            List<String> uniqueOptions = Arrays.asList("Java", "Python", "JavaScript", "C#");
            PollCreationDto dto = PollCreationDto.builder()
                    .title("Programming Languages Poll")
                    .options(uniqueOptions)
                    .build();
            
            boolean result = validator.isValid(dto, context);
            
            assertTrue(result);
            verify(context, never()).disableDefaultConstraintViolation();
            verify(context, never()).buildConstraintViolationWithTemplate(anyString());
        }

        @Test
        @DisplayName("Should return true with single option")
        void shouldReturnTrueWithSingleOption() {
            List<String> singleOption = Arrays.asList("Only Option");
            PollCreationDto dto = PollCreationDto.builder()
                    .title("Single Option Poll")
                    .options(singleOption)
                    .build();
            
            boolean result = validator.isValid(dto, context);
            
            assertTrue(result);
            verify(context, never()).disableDefaultConstraintViolation();
            verify(context, never()).buildConstraintViolationWithTemplate(anyString());
        }

        @Test
        @DisplayName("Should return true with case-sensitive different options")
        void shouldReturnTrueWithCaseSensitiveDifferentOptions() {
            List<String> caseSensitiveOptions = Arrays.asList("Java", "java", "JAVA", "Python");
            PollCreationDto dto = PollCreationDto.builder()
                    .title("Case Sensitive Poll")
                    .options(caseSensitiveOptions)
                    .build();
            
            boolean result = validator.isValid(dto, context);
            
            assertTrue(result);
            verify(context, never()).disableDefaultConstraintViolation();
            verify(context, never()).buildConstraintViolationWithTemplate(anyString());
        }

        @Test
        @DisplayName("Should return true with options containing spaces and special characters")
        void shouldReturnTrueWithOptionsContainingSpacesAndSpecialCharacters() {
            List<String> specialOptions = Arrays.asList(
                "Option 1", 
                "Option-2", 
                "Option_3", 
                "Option #4",
                "Option (5)"
            );
            PollCreationDto dto = PollCreationDto.builder()
                    .title("Special Characters Poll")
                    .options(specialOptions)
                    .build();
            
            boolean result = validator.isValid(dto, context);
            
            assertTrue(result);
            verify(context, never()).disableDefaultConstraintViolation();
            verify(context, never()).buildConstraintViolationWithTemplate(anyString());
        }

        @Test
        @DisplayName("Should return true with maximum allowed unique options")
        void shouldReturnTrueWithMaximumAllowedUniqueOptions() {
            List<String> maxOptions = Arrays.asList(
                "Option1", "Option2", "Option3", "Option4", "Option5",
                "Option6", "Option7", "Option8", "Option9", "Option10"
            );
            PollCreationDto dto = PollCreationDto.builder()
                    .title("Maximum Options Poll")
                    .options(maxOptions)
                    .build();
            
            boolean result = validator.isValid(dto, context);
            
            assertTrue(result);
            verify(context, never()).disableDefaultConstraintViolation();
            verify(context, never()).buildConstraintViolationWithTemplate(anyString());
        }
    }

    @Nested
    @DisplayName("Invalid Options Tests")
    class InvalidOptionsTests {

        @Test
        @DisplayName("Should return false with duplicate options")
        void shouldReturnFalseWithDuplicateOptions() {
            List<String> duplicateOptions = Arrays.asList("Java", "Python", "Java", "C#");
            PollCreationDto dto = PollCreationDto.builder()
                    .title("Duplicate Options Poll")
                    .options(duplicateOptions)
                    .build();
            
            boolean result = validator.isValid(dto, context);
            
            assertFalse(result);
            verify(context).disableDefaultConstraintViolation();
            verify(context).buildConstraintViolationWithTemplate("Poll options must be unique");
            verify(violationBuilder).addPropertyNode("options");
            verify(nodeBuilder).addConstraintViolation();
        }

        @Test
        @DisplayName("Should return false with multiple duplicate options")
        void shouldReturnFalseWithMultipleDuplicateOptions() {
            List<String> multipleDuplicates = Arrays.asList("Java", "Python", "Java", "Python", "C#");
            PollCreationDto dto = PollCreationDto.builder()
                    .title("Multiple Duplicates Poll")
                    .options(multipleDuplicates)
                    .build();
            
            boolean result = validator.isValid(dto, context);
            
            assertFalse(result);
            verify(context).disableDefaultConstraintViolation();
            verify(context).buildConstraintViolationWithTemplate("Poll options must be unique");
            verify(violationBuilder).addPropertyNode("options");
            verify(nodeBuilder).addConstraintViolation();
        }

        @Test
        @DisplayName("Should return false with all identical options")
        void shouldReturnFalseWithAllIdenticalOptions() {
            List<String> identicalOptions = Arrays.asList("Same", "Same", "Same", "Same");
            PollCreationDto dto = PollCreationDto.builder()
                    .title("All Identical Options Poll")
                    .options(identicalOptions)
                    .build();
            
            boolean result = validator.isValid(dto, context);
            
            assertFalse(result);
            verify(context).disableDefaultConstraintViolation();
            verify(context).buildConstraintViolationWithTemplate("Poll options must be unique");
            verify(violationBuilder).addPropertyNode("options");
            verify(nodeBuilder).addConstraintViolation();
        }

        @Test
        @DisplayName("Should return false with empty string duplicates")
        void shouldReturnFalseWithEmptyStringDuplicates() {
            List<String> emptyStringDuplicates = Arrays.asList("Option1", "", "Option2", "");
            PollCreationDto dto = PollCreationDto.builder()
                    .title("Empty String Duplicates Poll")
                    .options(emptyStringDuplicates)
                    .build();
            
            boolean result = validator.isValid(dto, context);
            
            assertFalse(result);
            verify(context).disableDefaultConstraintViolation();
            verify(context).buildConstraintViolationWithTemplate("Poll options must be unique");
            verify(violationBuilder).addPropertyNode("options");
            verify(nodeBuilder).addConstraintViolation();
        }

        @Test
        @DisplayName("Should return false with whitespace-only string duplicates")
        void shouldReturnFalseWithWhitespaceOnlyStringDuplicates() {
            List<String> whitespaceDuplicates = Arrays.asList("Option1", "   ", "Option2", "   ");
            PollCreationDto dto = PollCreationDto.builder()
                    .title("Whitespace Duplicates Poll")
                    .options(whitespaceDuplicates)
                    .build();
            
            boolean result = validator.isValid(dto, context);
            
            assertFalse(result);
            verify(context).disableDefaultConstraintViolation();
            verify(context).buildConstraintViolationWithTemplate("Poll options must be unique");
            verify(violationBuilder).addPropertyNode("options");
            verify(nodeBuilder).addConstraintViolation();
        }
    }

    @Nested
    @DisplayName("Edge Cases Tests")
    class EdgeCasesTests {

        @Test
        @DisplayName("Should return true with only two unique options")
        void shouldReturnTrueWithOnlyTwoUniqueOptions() {
            List<String> twoOptions = Arrays.asList("Option A", "Option B");
            PollCreationDto dto = PollCreationDto.builder()
                    .title("Two Options Poll")
                    .options(twoOptions)
                    .build();
            
            boolean result = validator.isValid(dto, context);
            
            assertTrue(result);
            verify(context, never()).disableDefaultConstraintViolation();
            verify(context, never()).buildConstraintViolationWithTemplate(anyString());
        }

        @Test
        @DisplayName("Should return false with only two identical options")
        void shouldReturnFalseWithOnlyTwoIdenticalOptions() {
            List<String> twoIdentical = Arrays.asList("Same Option", "Same Option");
            PollCreationDto dto = PollCreationDto.builder()
                    .title("Two Identical Options Poll")
                    .options(twoIdentical)
                    .build();
            
            boolean result = validator.isValid(dto, context);
            
            assertFalse(result);
            verify(context).disableDefaultConstraintViolation();
            verify(context).buildConstraintViolationWithTemplate("Poll options must be unique");
            verify(violationBuilder).addPropertyNode("options");
            verify(nodeBuilder).addConstraintViolation();
        }

        @Test
        @DisplayName("Should handle options with different whitespace patterns")
        void shouldHandleOptionsWithDifferentWhitespacePatterns() {
            // These are considered different options because exact string matching is used
            List<String> whitespaceOptions = Arrays.asList("Option", "Option ", " Option", " Option ");
            PollCreationDto dto = PollCreationDto.builder()
                    .title("Whitespace Patterns Poll")
                    .options(whitespaceOptions)
                    .build();
            
            boolean result = validator.isValid(dto, context);
            
            assertTrue(result);
            verify(context, never()).disableDefaultConstraintViolation();
            verify(context, never()).buildConstraintViolationWithTemplate(anyString());
        }

        @Test
        @DisplayName("Should handle options with Unicode characters")
        void shouldHandleOptionsWithUnicodeCharacters() {
            List<String> unicodeOptions = Arrays.asList("Java ☕", "Python 🐍", "JavaScript 💻", "C# 🔧");
            PollCreationDto dto = PollCreationDto.builder()
                    .title("Unicode Options Poll")
                    .options(unicodeOptions)
                    .build();
            
            boolean result = validator.isValid(dto, context);
            
            assertTrue(result);
            verify(context, never()).disableDefaultConstraintViolation();
            verify(context, never()).buildConstraintViolationWithTemplate(anyString());
        }

        @Test
        @DisplayName("Should handle very long option strings")
        void shouldHandleVeryLongOptionStrings() {
            String longOption1 = "A".repeat(100);
            String longOption2 = "B".repeat(100);
            List<String> longOptions = Arrays.asList(longOption1, longOption2);
            
            PollCreationDto dto = PollCreationDto.builder()
                    .title("Long Options Poll")
                    .options(longOptions)
                    .build();
            
            boolean result = validator.isValid(dto, context);
            
            assertTrue(result);
            verify(context, never()).disableDefaultConstraintViolation();
            verify(context, never()).buildConstraintViolationWithTemplate(anyString());
        }

        @Test
        @DisplayName("Should return false with duplicate very long option strings")
        void shouldReturnFalseWithDuplicateVeryLongOptionStrings() {
            String longOption = "A".repeat(100);
            List<String> duplicateLongOptions = Arrays.asList(longOption, longOption);
            
            PollCreationDto dto = PollCreationDto.builder()
                    .title("Duplicate Long Options Poll")
                    .options(duplicateLongOptions)
                    .build();
            
            boolean result = validator.isValid(dto, context);
            
            assertFalse(result);
            verify(context).disableDefaultConstraintViolation();
            verify(context).buildConstraintViolationWithTemplate("Poll options must be unique");
            verify(violationBuilder).addPropertyNode("options");
            verify(nodeBuilder).addConstraintViolation();
        }
    }

    @Nested
    @DisplayName("Context Interaction Tests")
    class ContextInteractionTests {

        @Test
        @DisplayName("Should not interact with context for valid cases")
        void shouldNotInteractWithContextForValidCases() {
            List<String> validOptions = Arrays.asList("Option1", "Option2", "Option3");
            PollCreationDto dto = PollCreationDto.builder()
                    .title("Valid Options Poll")
                    .options(validOptions)
                    .build();
            
            validator.isValid(dto, context);
            
            verifyNoInteractions(context);
        }

        @Test
        @DisplayName("Should properly build constraint violation for invalid cases")
        void shouldProperlyBuildConstraintViolationForInvalidCases() {
            List<String> duplicateOptions = Arrays.asList("Duplicate", "Unique", "Duplicate");
            PollCreationDto dto = PollCreationDto.builder()
                    .title("Constraint Violation Test Poll")
                    .options(duplicateOptions)
                    .build();
            
            validator.isValid(dto, context);
            
            // Verify the exact sequence of calls for building constraint violations
            verify(context).disableDefaultConstraintViolation();
            verify(context).buildConstraintViolationWithTemplate("Poll options must be unique");
            verify(violationBuilder).addPropertyNode("options");
            verify(nodeBuilder).addConstraintViolation();
        }

        @Test
        @DisplayName("Should use custom error message from template")
        void shouldUseCustomErrorMessageFromTemplate() {
            List<String> duplicateOptions = Arrays.asList("A", "B", "A");
            PollCreationDto dto = PollCreationDto.builder()
                    .title("Custom Message Test Poll")
                    .options(duplicateOptions)
                    .build();
            
            validator.isValid(dto, context);
            
            verify(context).buildConstraintViolationWithTemplate("Poll options must be unique");
        }
    }

    @Test
    @DisplayName("Should integrate properly with hasUniqueOptions method")
    void shouldIntegrateProperlyWithHasUniqueOptionsMethod() {
        // Create DTOs that should test the underlying hasUniqueOptions method
        PollCreationDto validDto = PollCreationDto.builder()
                .options(Arrays.asList("A", "B", "C"))
                .build();
        
        PollCreationDto invalidDto = PollCreationDto.builder()
                .options(Arrays.asList("A", "B", "A"))
                .build();
        
        // Test that the validator's result matches the hasUniqueOptions method
        assertTrue(validator.isValid(validDto, context));
        assertTrue(validDto.hasUniqueOptions());
        
        assertFalse(validator.isValid(invalidDto, context));
        assertFalse(invalidDto.hasUniqueOptions());
    }
}
