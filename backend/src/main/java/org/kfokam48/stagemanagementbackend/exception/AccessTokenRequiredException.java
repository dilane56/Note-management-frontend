package org.kfokam48.stagemanagementbackend.exception;

public class AccessTokenRequiredException extends RuntimeException{
    public AccessTokenRequiredException(String message) {
        super(message);
    }

}
