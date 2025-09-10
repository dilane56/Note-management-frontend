package org.kfokam48.notemanagementbackend.exception;

public class AccessTokenRequiredException extends RuntimeException{
    public AccessTokenRequiredException(String message) {
        super(message);
    }

}
