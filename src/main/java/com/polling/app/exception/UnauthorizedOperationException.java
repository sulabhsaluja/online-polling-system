package com.polling.app.exception;

import org.springframework.http.HttpStatus;

/**
 * Exception thrown when a user tries to perform an operation they're not authorized for
 */
public class UnauthorizedOperationException extends PollAppException {
    
    public UnauthorizedOperationException(String message) {
        super(message, HttpStatus.FORBIDDEN, "UNAUTHORIZED_OPERATION");
    }
    
    public UnauthorizedOperationException(String operation, String resource) {
        super(String.format("Not authorized to %s %s", operation, resource), 
              HttpStatus.FORBIDDEN, "UNAUTHORIZED_OPERATION");
    }
}
