package com.polling.app.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.polling.app.dto.*;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import com.polling.app.service.UserService;
import com.polling.app.service.AdminService;
import com.polling.app.service.PollService;

import java.time.LocalDateTime;
import java.util.Arrays;

import static org.hamcrest.Matchers.containsString;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.polling.app.entity.User;
import com.polling.app.entity.Admin;
import org.junit.jupiter.api.BeforeEach;

@WebMvcTest(value = {UserController.class, AdminController.class}, excludeAutoConfiguration = {SecurityAutoConfiguration.class})
@DisplayName("Validation Integration Tests")
class ValidationIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private UserService userService;

    @MockBean
    private AdminService adminService;

    @MockBean
    private PollService pollService;

    @BeforeEach
    void setUp() {
        // Mock successful authentication for validation tests
        User mockUser = new User();
        mockUser.setId(1L);
        mockUser.setEmail("test@example.com");
        
        Admin mockAdmin = new Admin();
        mockAdmin.setId(1L);
        mockAdmin.setEmail("admin@example.com");
        
        when(userService.authenticateUser(anyString(), anyString())).thenReturn(mockUser);
        when(adminService.authenticateAdmin(anyString(), anyString())).thenReturn(mockAdmin);
        
        // Mock other service methods that might be called
        when(userService.createUser(any(User.class))).thenReturn(mockUser);
        when(adminService.createAdmin(any(Admin.class))).thenReturn(mockAdmin);
    }

    @Nested
    @DisplayName("User Registration Validation")
    class UserRegistrationValidation {

        @Test
        @DisplayName("Should accept valid user registration")
        void shouldAcceptValidUserRegistration() throws Exception {
            UserRegistrationDto validDto = UserRegistrationDto.builder()
                    .username("testuser123")
                    .email("test@example.com")
                    .password("ValidPass123!")
                    .firstName("John")
                    .lastName("Doe")
                    .build();

            mockMvc.perform(post("/api/user/register")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(validDto)))
                    .andExpect(status().isCreated());
        }

        @Test
        @DisplayName("Should reject user registration with invalid username")
        void shouldRejectUserRegistrationWithInvalidUsername() throws Exception {
            UserRegistrationDto invalidDto = UserRegistrationDto.builder()
                    .username("ab") // Too short
                    .email("test@example.com")
                    .password("ValidPass123!")
                    .firstName("John")
                    .lastName("Doe")
                    .build();

            mockMvc.perform(post("/api/user/register")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(invalidDto)))
                    .andExpect(status().isBadRequest())
                    .andExpect(content().string(containsString("Username must be between 3 and 50 characters")));
        }

        @Test
        @DisplayName("Should reject user registration with invalid email")
        void shouldRejectUserRegistrationWithInvalidEmail() throws Exception {
            UserRegistrationDto invalidDto = UserRegistrationDto.builder()
                    .username("testuser123")
                    .email("invalid-email") // Invalid format
                    .password("ValidPass123!")
                    .firstName("John")
                    .lastName("Doe")
                    .build();

            mockMvc.perform(post("/api/user/register")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(invalidDto)))
                    .andExpect(status().isBadRequest())
                    .andExpect(content().string(containsString("Please provide a valid email address")));
        }

        @Test
        @DisplayName("Should reject user registration with weak password")
        void shouldRejectUserRegistrationWithWeakPassword() throws Exception {
            UserRegistrationDto invalidDto = UserRegistrationDto.builder()
                    .username("testuser123")
                    .email("test@example.com")
                    .password("weakpass") // No uppercase, digit, or special char
                    .firstName("John")
                    .lastName("Doe")
                    .build();

            mockMvc.perform(post("/api/user/register")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(invalidDto)))
                    .andExpect(status().isBadRequest())
                    .andExpect(content().string(containsString("Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character")));
        }

        @Test
        @DisplayName("Should reject user registration with invalid names")
        void shouldRejectUserRegistrationWithInvalidNames() throws Exception {
            UserRegistrationDto invalidDto = UserRegistrationDto.builder()
                    .username("testuser123")
                    .email("test@example.com")
                    .password("ValidPass123!")
                    .firstName("John123") // Contains numbers
                    .lastName("Doe@") // Contains special characters
                    .build();

            mockMvc.perform(post("/api/user/register")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(invalidDto)))
                    .andExpect(status().isBadRequest())
                    .andExpect(content().string(containsString("First name can only contain letters and spaces")))
                    .andExpect(content().string(containsString("Last name can only contain letters and spaces")));
        }

        @Test
        @DisplayName("Should reject user registration with multiple validation errors")
        void shouldRejectUserRegistrationWithMultipleValidationErrors() throws Exception {
            UserRegistrationDto invalidDto = UserRegistrationDto.builder()
                    .username("ab") // Too short
                    .email("invalid") // Invalid format
                    .password("weak") // Too short and weak
                    .firstName("John123") // Contains numbers
                    .lastName("Doe@") // Contains special characters
                    .build();

            mockMvc.perform(post("/api/user/register")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(invalidDto)))
                    .andExpect(status().isBadRequest())
                    .andExpect(content().string(containsString("Username must be between 3 and 50 characters")))
                    .andExpect(content().string(containsString("Please provide a valid email address")))
                    .andExpect(content().string(containsString("Password must be between 8 and 100 characters")));
        }
    }

    @Nested
    @DisplayName("Admin Registration Validation")
    class AdminRegistrationValidation {

        @Test
        @DisplayName("Should accept valid admin registration")
        void shouldAcceptValidAdminRegistration() throws Exception {
            AdminRegistrationDto validDto = AdminRegistrationDto.builder()
                    .username("admin123")
                    .email("admin@example.com")
                    .password("AdminPass123!")
                    .firstName("Admin")
                    .lastName("User")
                    .build();

            mockMvc.perform(post("/api/admin/register")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(validDto)))
                    .andExpect(status().isCreated());
        }

        @Test
        @DisplayName("Should reject admin registration with invalid data")
        void shouldRejectAdminRegistrationWithInvalidData() throws Exception {
            AdminRegistrationDto invalidDto = AdminRegistrationDto.builder()
                    .username("ad") // Too short
                    .email("invalid-email") // Invalid format
                    .password("weak") // Too weak
                    .firstName("Admin123") // Contains numbers
                    .lastName("User@") // Contains special characters
                    .build();

            mockMvc.perform(post("/api/admin/register")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(invalidDto)))
                    .andExpect(status().isBadRequest());
        }
    }

    @Nested
    @DisplayName("Login Validation")
    class LoginValidation {

        @Test
        @DisplayName("Should accept valid user login")
        void shouldAcceptValidUserLogin() throws Exception {
            LoginDto validDto = LoginDto.builder()
                    .email("test@example.com")
                    .password("anypassword")
                    .build();

            mockMvc.perform(post("/api/user/login")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(validDto)))
                    .andExpect(status().isOk());
        }

        @Test
        @DisplayName("Should accept valid admin login")
        void shouldAcceptValidAdminLogin() throws Exception {
            LoginDto validDto = LoginDto.builder()
                    .email("admin@example.com")
                    .password("anypassword")
                    .build();

            mockMvc.perform(post("/api/admin/login")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(validDto)))
                    .andExpect(status().isOk());
        }

        @Test
        @DisplayName("Should reject login with invalid email")
        void shouldRejectLoginWithInvalidEmail() throws Exception {
            LoginDto invalidDto = LoginDto.builder()
                    .email("invalid-email")
                    .password("anypassword")
                    .build();

            mockMvc.perform(post("/api/user/login")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(invalidDto)))
                    .andExpect(status().isBadRequest())
                    .andExpect(content().string(containsString("Please provide a valid email address")));
        }

        @Test
        @DisplayName("Should reject login with blank email")
        void shouldRejectLoginWithBlankEmail() throws Exception {
            LoginDto invalidDto = LoginDto.builder()
                    .email("   ")
                    .password("anypassword")
                    .build();

            mockMvc.perform(post("/api/user/login")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(invalidDto)))
                    .andExpect(status().isBadRequest())
                    .andExpect(content().string(containsString("Email is required")));
        }

        @Test
        @DisplayName("Should reject login with blank password")
        void shouldRejectLoginWithBlankPassword() throws Exception {
            LoginDto invalidDto = LoginDto.builder()
                    .email("test@example.com")
                    .password("   ")
                    .build();

            mockMvc.perform(post("/api/user/login")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(invalidDto)))
                    .andExpect(status().isBadRequest())
                    .andExpect(content().string(containsString("Password is required")));
        }

        @Test
        @DisplayName("Should reject login with password too long")
        void shouldRejectLoginWithPasswordTooLong() throws Exception {
            LoginDto invalidDto = LoginDto.builder()
                    .email("test@example.com")
                    .password("a".repeat(101)) // Too long
                    .build();

            mockMvc.perform(post("/api/user/login")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(invalidDto)))
                    .andExpect(status().isBadRequest())
                    .andExpect(content().string(containsString("Password cannot exceed 100 characters")));
        }
    }

    @Nested
    @DisplayName("Poll Creation Validation")
    class PollCreationValidation {

        @Test
        @DisplayName("Should accept valid poll creation")
        void shouldAcceptValidPollCreation() throws Exception {
            PollCreationDto validDto = PollCreationDto.builder()
                    .title("What is your favorite programming language?")
                    .description("Choose your preferred language for web development.")
                    .options(Arrays.asList("Java", "Python", "JavaScript", "C#"))
                    .endsAt(LocalDateTime.now().plusDays(7))
                    .build();

            mockMvc.perform(post("/api/admin/1/polls")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(validDto)))
                    .andExpect(status().isCreated());
        }

        @Test
        @DisplayName("Should reject poll creation with too short title")
        void shouldRejectPollCreationWithTooShortTitle() throws Exception {
            PollCreationDto invalidDto = PollCreationDto.builder()
                    .title("Test") // Too short (less than 5 characters)
                    .description("Valid description.")
                    .options(Arrays.asList("Option1", "Option2"))
                    .endsAt(LocalDateTime.now().plusDays(7))
                    .build();

            mockMvc.perform(post("/api/admin/1/polls")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(invalidDto)))
                    .andExpect(status().isBadRequest())
                    .andExpect(content().string(containsString("Poll title must be between 5 and 200 characters")));
        }

        @Test
        @DisplayName("Should reject poll creation with too long title")
        void shouldRejectPollCreationWithTooLongTitle() throws Exception {
            PollCreationDto invalidDto = PollCreationDto.builder()
                    .title("A".repeat(201)) // Too long (more than 200 characters)
                    .description("Valid description.")
                    .options(Arrays.asList("Option1", "Option2"))
                    .endsAt(LocalDateTime.now().plusDays(7))
                    .build();

            mockMvc.perform(post("/api/admin/1/polls")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(invalidDto)))
                    .andExpect(status().isBadRequest())
                    .andExpect(content().string(containsString("Poll title must be between 5 and 200 characters")));
        }

        @Test
        @DisplayName("Should reject poll creation with too long description")
        void shouldRejectPollCreationWithTooLongDescription() throws Exception {
            PollCreationDto invalidDto = PollCreationDto.builder()
                    .title("Valid poll title")
                    .description("A".repeat(1001)) // Too long (more than 1000 characters)
                    .options(Arrays.asList("Option1", "Option2"))
                    .endsAt(LocalDateTime.now().plusDays(7))
                    .build();

            mockMvc.perform(post("/api/admin/1/polls")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(invalidDto)))
                    .andExpect(status().isBadRequest())
                    .andExpect(content().string(containsString("Poll description cannot exceed 1000 characters")));
        }

        @Test
        @DisplayName("Should reject poll creation with too few options")
        void shouldRejectPollCreationWithTooFewOptions() throws Exception {
            PollCreationDto invalidDto = PollCreationDto.builder()
                    .title("Valid poll title")
                    .description("Valid description.")
                    .options(Arrays.asList("OnlyOneOption")) // Less than 2 options
                    .endsAt(LocalDateTime.now().plusDays(7))
                    .build();

            mockMvc.perform(post("/api/admin/1/polls")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(invalidDto)))
                    .andExpect(status().isBadRequest())
                    .andExpect(content().string(containsString("Poll must have between 2 and 10 options")));
        }

        @Test
        @DisplayName("Should reject poll creation with too many options")
        void shouldRejectPollCreationWithTooManyOptions() throws Exception {
            PollCreationDto invalidDto = PollCreationDto.builder()
                    .title("Valid poll title")
                    .description("Valid description.")
                    .options(Arrays.asList("Option1", "Option2", "Option3", "Option4", "Option5",
                                          "Option6", "Option7", "Option8", "Option9", "Option10", "Option11")) // More than 10 options
                    .endsAt(LocalDateTime.now().plusDays(7))
                    .build();

            mockMvc.perform(post("/api/admin/1/polls")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(invalidDto)))
                    .andExpect(status().isBadRequest())
                    .andExpect(content().string(containsString("Poll must have between 2 and 10 options")));
        }

        @Test
        @DisplayName("Should reject poll creation with duplicate options")
        void shouldRejectPollCreationWithDuplicateOptions() throws Exception {
            PollCreationDto invalidDto = PollCreationDto.builder()
                    .title("Valid poll title")
                    .description("Valid description.")
                    .options(Arrays.asList("Java", "Python", "Java", "C#")) // Duplicate "Java"
                    .endsAt(LocalDateTime.now().plusDays(7))
                    .build();

            mockMvc.perform(post("/api/admin/1/polls")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(invalidDto)))
                    .andExpect(status().isBadRequest())
                    .andExpect(content().string(containsString("Poll options must be unique")));
        }

        @Test
        @DisplayName("Should reject poll creation with blank options")
        void shouldRejectPollCreationWithBlankOptions() throws Exception {
            PollCreationDto invalidDto = PollCreationDto.builder()
                    .title("Valid poll title")
                    .description("Valid description.")
                    .options(Arrays.asList("Valid Option", "   ", "Another Valid Option")) // Blank option
                    .endsAt(LocalDateTime.now().plusDays(7))
                    .build();

            mockMvc.perform(post("/api/admin/1/polls")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(invalidDto)))
                    .andExpect(status().isBadRequest())
                    .andExpect(content().string(containsString("Poll option cannot be empty")));
        }

        @Test
        @DisplayName("Should reject poll creation with options too long")
        void shouldRejectPollCreationWithOptionsTooLong() throws Exception {
            PollCreationDto invalidDto = PollCreationDto.builder()
                    .title("Valid poll title")
                    .description("Valid description.")
                    .options(Arrays.asList("Valid Option", "A".repeat(101), "Another Valid Option")) // Option too long
                    .endsAt(LocalDateTime.now().plusDays(7))
                    .build();

            mockMvc.perform(post("/api/admin/1/polls")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(invalidDto)))
                    .andExpect(status().isBadRequest())
                    .andExpect(content().string(containsString("Poll option must be between 1 and 100 characters")));
        }

        @Test
        @DisplayName("Should reject poll creation with past end date")
        void shouldRejectPollCreationWithPastEndDate() throws Exception {
            PollCreationDto invalidDto = PollCreationDto.builder()
                    .title("Valid poll title")
                    .description("Valid description.")
                    .options(Arrays.asList("Option1", "Option2"))
                    .endsAt(LocalDateTime.now().minusDays(1)) // Past date
                    .build();

            mockMvc.perform(post("/api/admin/1/polls")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(invalidDto)))
                    .andExpect(status().isBadRequest())
                    .andExpect(content().string(containsString("Poll end date must be in the future")));
        }

        @Test
        @DisplayName("Should reject poll creation with multiple validation errors")
        void shouldRejectPollCreationWithMultipleValidationErrors() throws Exception {
            PollCreationDto invalidDto = PollCreationDto.builder()
                    .title("Bad") // Too short
                    .description("A".repeat(1001)) // Too long
                    .options(Arrays.asList("Same", "Same")) // Duplicates
                    .endsAt(LocalDateTime.now().minusDays(1)) // Past date
                    .build();

            mockMvc.perform(post("/api/admin/1/polls")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(invalidDto)))
                    .andExpect(status().isBadRequest())
                    .andExpect(content().string(containsString("Poll title must be between 5 and 200 characters")))
                    .andExpect(content().string(containsString("Poll description cannot exceed 1000 characters")))
                    .andExpect(content().string(containsString("Poll options must be unique")))
                    .andExpect(content().string(containsString("Poll end date must be in the future")));
        }
    }

    @Nested
    @DisplayName("Vote Submission Validation")
    class VoteSubmissionValidation {

        @Test
        @DisplayName("Should accept valid vote submission")
        void shouldAcceptValidVoteSubmission() throws Exception {
            VoteSubmissionDto validDto = VoteSubmissionDto.builder()
                    .optionId(1L)
                    .build();

            mockMvc.perform(post("/api/user/1/polls/1/vote")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(validDto)))
                    .andExpect(status().isOk());
        }

        @Test
        @DisplayName("Should reject vote submission with null option ID")
        void shouldRejectVoteSubmissionWithNullOptionId() throws Exception {
            VoteSubmissionDto invalidDto = VoteSubmissionDto.builder()
                    .optionId(null) // Null option ID
                    .build();

            mockMvc.perform(post("/api/user/1/polls/1/vote")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(invalidDto)))
                    .andExpect(status().isBadRequest())
                    .andExpect(content().string(containsString("Option ID is required")));
        }

        @Test
        @DisplayName("Should reject vote submission with zero option ID")
        void shouldRejectVoteSubmissionWithZeroOptionId() throws Exception {
            VoteSubmissionDto invalidDto = VoteSubmissionDto.builder()
                    .optionId(0L) // Zero is not positive
                    .build();

            mockMvc.perform(post("/api/user/1/polls/1/vote")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(invalidDto)))
                    .andExpect(status().isBadRequest())
                    .andExpect(content().string(containsString("Option ID must be a positive number")));
        }

        @Test
        @DisplayName("Should reject vote submission with negative option ID")
        void shouldRejectVoteSubmissionWithNegativeOptionId() throws Exception {
            VoteSubmissionDto invalidDto = VoteSubmissionDto.builder()
                    .optionId(-1L) // Negative number
                    .build();

            mockMvc.perform(post("/api/user/1/polls/1/vote")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(invalidDto)))
                    .andExpect(status().isBadRequest())
                    .andExpect(content().string(containsString("Option ID must be a positive number")));
        }
    }

    @Nested
    @DisplayName("Content Type and JSON Structure Validation")
    class ContentTypeAndJsonStructureValidation {

        @Test
        @DisplayName("Should reject request with wrong content type")
        void shouldRejectRequestWithWrongContentType() throws Exception {
            UserRegistrationDto validDto = UserRegistrationDto.builder()
                    .username("testuser123")
                    .email("test@example.com")
                    .password("ValidPass123!")
                    .firstName("John")
                    .lastName("Doe")
                    .build();

            mockMvc.perform(post("/api/user/register")
                    .contentType(MediaType.TEXT_PLAIN) // Wrong content type
                    .content(objectMapper.writeValueAsString(validDto)))
                    .andExpect(status().isUnsupportedMediaType());
        }

        @Test
        @DisplayName("Should reject request with malformed JSON")
        void shouldRejectRequestWithMalformedJson() throws Exception {
            String malformedJson = "{\"username\":\"test\",\"email\":\"invalid json";

            mockMvc.perform(post("/api/user/register")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(malformedJson))
                    .andExpect(status().isBadRequest());
        }

        @Test
        @DisplayName("Should reject empty request body")
        void shouldRejectEmptyRequestBody() throws Exception {
            mockMvc.perform(post("/api/user/register")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(""))
                    .andExpect(status().isBadRequest());
        }
    }
}
