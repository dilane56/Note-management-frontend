package org.kfokam48.stagemanagementbackend.exception;

public class RessourceNotFoundException extends  RuntimeException {
    public RessourceNotFoundException(String message) {
        super(message);
    }
}
