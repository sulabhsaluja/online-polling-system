package com.polling.app.validation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import java.lang.annotation.*;

@Documented
@Constraint(validatedBy = ValidPollOptionsValidator.class)
@Target({ElementType.FIELD})
@Retention(RetentionPolicy.RUNTIME)
public @interface ValidPollOptions {
    String message() default "Invalid poll options";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}
