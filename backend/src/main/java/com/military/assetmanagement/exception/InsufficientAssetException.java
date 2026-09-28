package com.military.assetmanagement.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_REQUEST)
public class InsufficientAssetException extends RuntimeException {
    public InsufficientAssetException(String message) {
        super(message);
    }
}
