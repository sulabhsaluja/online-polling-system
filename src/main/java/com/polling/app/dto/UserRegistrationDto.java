package com.polling.app.dto;

import com.polling.app.validation.ValidationGroups;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for user registration requests
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserRegistrationDto {

    @NotBlank(message = "Username is required", groups = ValidationGroups.Create.class)
    @Size(min = 3, max = 50, message = "Username must be between 3 and 50 characters", groups = ValidationGroups.Create.class)
    @Pattern(regexp = "^[a-zA-Z0-9._-]+$", 
             message = "Username can only contain letters, numbers, dots, underscores, and hyphens", 
             groups = ValidationGroups.Create.class)
    private String username;

    @NotBlank(message = "Email is required", groups = ValidationGroups.Create.class)
    @Email(message = "Please provide a valid email address", groups = ValidationGroups.Create.class)
    @Size(max = 100, message = "Email cannot exceed 100 characters", groups = ValidationGroups.Create.class)
    private String email;

    @NotBlank(message = "Password is required", groups = ValidationGroups.Create.class)
    @Size(min = 8, max = 100, message = "Password must be between 8 and 100 characters", groups = ValidationGroups.Create.class)
    @Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]+$",
             message = "Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character",
             groups = ValidationGroups.Create.class)
    private String password;

    @NotBlank(message = "First name is required", groups = ValidationGroups.Create.class)
    @Size(min = 1, max = 50, message = "First name must be between 1 and 50 characters", groups = ValidationGroups.Create.class)
    @Pattern(regexp = "^[a-zA-Z\\s]+$", 
             message = "First name can only contain letters and spaces", 
             groups = ValidationGroups.Create.class)
    private String firstName;

    @NotBlank(message = "Last name is required", groups = ValidationGroups.Create.class)
    @Size(min = 1, max = 50, message = "Last name must be between 1 and 50 characters", groups = ValidationGroups.Create.class)
    @Pattern(regexp = "^[a-zA-Z\\s]+$", 
             message = "Last name can only contain letters and spaces", 
             groups = ValidationGroups.Create.class)
    private String lastName;
}
