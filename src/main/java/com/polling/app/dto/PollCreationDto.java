package com.polling.app.dto;

import com.polling.app.validation.UniqueOptions;
import com.polling.app.validation.ValidationGroups;
import jakarta.validation.constraints.*;
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
@UniqueOptions(groups = ValidationGroups.Create.class)
public class PollCreationDto {

    @NotBlank(message = "Poll title is required", groups = ValidationGroups.Create.class)
    @Size(min = 5, max = 200, message = "Poll title must be between 5 and 200 characters", groups = ValidationGroups.Create.class)
    private String title;

    @Size(max = 1000, message = "Poll description cannot exceed 1000 characters", groups = ValidationGroups.Create.class)
    private String description;

    @NotNull(message = "Poll options are required", groups = ValidationGroups.Create.class)
    @Size(min = 2, max = 10, message = "Poll must have between 2 and 10 options", groups = ValidationGroups.Create.class)
    private List<@NotBlank(message = "Poll option cannot be empty") 
                  @Size(min = 1, max = 100, message = "Poll option must be between 1 and 100 characters") 
                  String> options;

    @Future(message = "Poll end date must be in the future", groups = ValidationGroups.Create.class)
    private LocalDateTime endsAt;

    // Custom validation to ensure all options are unique
    public boolean hasUniqueOptions() {
        if (options == null) return true;
        return options.stream().distinct().count() == options.size();
    }
}
