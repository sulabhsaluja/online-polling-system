package com.polling.app.dto;

import com.polling.app.validation.UniqueOptions;
import com.polling.app.validation.ValidPollOptions;
import com.polling.app.validation.ValidationGroups;
import jakarta.validation.constraints.*;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

/**
 * DTO for poll creation requests
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@UniqueOptions
public class PollCreationDto {

    @NotBlank(message = "Poll title is required")
    @Size(min = 5, max = 200, message = "Poll title must be between 5 and 200 characters")
    private String title;

    @Size(max = 1000, message = "Poll description cannot exceed 1000 characters")
    private String description;

    @NotNull(message = "Poll options are required")
    @Size(min = 2, max = 10, message = "Poll must have between 2 and 10 options")
    @ValidPollOptions
    private List<String> options;

    @Future(message = "Poll end date must be in the future")
    private LocalDateTime endsAt;

    // Custom validation to ensure all options are unique
    public boolean hasUniqueOptions() {
        if (options == null) return true;
        return options.stream().distinct().count() == options.size();
    }
}
