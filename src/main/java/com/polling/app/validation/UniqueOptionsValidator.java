package com.polling.app.validation;

import com.polling.app.dto.PollCreationDto;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

/**
 * Custom validator to ensure poll options are unique
 */
public class UniqueOptionsValidator implements ConstraintValidator<UniqueOptions, PollCreationDto> {

    @Override
    public void initialize(UniqueOptions constraintAnnotation) {
        // No initialization needed
    }

    @Override
    public boolean isValid(PollCreationDto pollDto, ConstraintValidatorContext context) {
        if (pollDto == null || pollDto.getOptions() == null) {
            return true; // Let other validators handle null checks
        }

        boolean isValid = pollDto.hasUniqueOptions();
        
        if (!isValid) {
            context.disableDefaultConstraintViolation();
            context.buildConstraintViolationWithTemplate("Poll options must be unique")
                   .addPropertyNode("options")
                   .addConstraintViolation();
        }
        
        return isValid;
    }
}
