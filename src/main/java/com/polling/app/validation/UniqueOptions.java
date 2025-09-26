package com.polling.app.validation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.*;

/**
 * Custom validation annotation to ensure poll options are unique
 */
@Documented
@Constraint(validatedBy = UniqueOptionsValidator.class)
@Target({ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
public @interface UniqueOptions {
    
    String message() default "Poll options must be unique";
    
    Class<?>[] groups() default {};
    
    Class<? extends Payload>[] payload() default {};
}
