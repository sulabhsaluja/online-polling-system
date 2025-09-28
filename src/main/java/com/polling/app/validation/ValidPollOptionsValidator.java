package com.polling.app.validation;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import java.util.List;

public class ValidPollOptionsValidator implements ConstraintValidator<ValidPollOptions, List<String>> {

    @Override
    public void initialize(ValidPollOptions constraintAnnotation) {
        // No initialization needed
    }

    @Override
    public boolean isValid(List<String> options, ConstraintValidatorContext context) {
        if (options == null) {
            return true; // Let @NotNull handle null validation
        }
        
        boolean isValid = true;
        context.disableDefaultConstraintViolation();
        
        for (int i = 0; i < options.size(); i++) {
            String option = options.get(i);
            
            // Check for blank options
            if (option == null || option.trim().isEmpty()) {
                context.buildConstraintViolationWithTemplate("Poll option cannot be empty")
                       .addConstraintViolation();
                isValid = false;
            } 
            // Check for option length (only if not blank)
            else if (option.length() > 100) {
                context.buildConstraintViolationWithTemplate("Poll option must be between 1 and 100 characters")
                       .addConstraintViolation();
                isValid = false;
            }
        }
        
        return isValid;
    }
}
