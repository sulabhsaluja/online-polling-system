package com.polling.app.dto;

import com.polling.app.validation.ValidationGroups;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for login requests
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LoginDto {

    @NotBlank(message = "Email is required", groups = ValidationGroups.Login.class)
    @Email(message = "Please provide a valid email address", groups = ValidationGroups.Login.class)
    private String email;

    @NotBlank(message = "Password is required", groups = ValidationGroups.Login.class)
    @Size(min = 1, max = 100, message = "Password cannot exceed 100 characters", groups = ValidationGroups.Login.class)
    private String password;
}
