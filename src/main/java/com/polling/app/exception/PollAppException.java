package com.polling.app.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

/**
 * Base exception class for Polling Application
 */
@Getter
public abstract class PollAppException extends RuntimeException {
    private final HttpStatus httpStatus;
    private final String errorCode;

    protected PollAppException(String message, HttpStatus httpStatus, String errorCode) {
        super(message);
        this.httpStatus = httpStatus;
        this.errorCode = errorCode;
    }

    protected PollAppException(String message, Throwable cause, HttpStatus httpStatus, String errorCode) {
        super(message, cause);
        this.httpStatus = httpStatus;
        this.errorCode = errorCode;
    }
}
