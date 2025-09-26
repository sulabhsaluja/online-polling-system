package com.polling.app.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for vote submission requests
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VoteSubmissionDto {

    @NotNull(message = "Option ID is required")
    @Positive(message = "Option ID must be a positive number")
    private Long optionId;
}
