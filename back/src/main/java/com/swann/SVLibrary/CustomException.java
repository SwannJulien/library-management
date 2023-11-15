package com.swann.SVLibrary;

public class CustomException extends Throwable {
    public static class ResourceNotFoundException extends RuntimeException {
        public ResourceNotFoundException(String message) {
            super(message);
        }
    }
}
