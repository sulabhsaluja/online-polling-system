package com.polling.app.exception;

import org.springframework.http.HttpStatus;

/**
 * Exception thrown when an operation is invalid or cannot be performed
 */
public class InvalidOperationException extends PollAppException {
    
    public InvalidOperationException(String message) {
        super(message, HttpStatus.BAD_REQUEST, "INVALID_OPERATION");
    }
    
    public InvalidOperationException(String message, Throwable cause) {
        super(message, cause, HttpStatus.BAD_REQUEST, "INVALID_OPERATION");
    }
}
