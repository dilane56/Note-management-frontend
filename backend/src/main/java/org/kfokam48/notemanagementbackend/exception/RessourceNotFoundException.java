package org.kfokam48.notemanagementbackend.exception;

public class RessourceNotFoundException extends  RuntimeException {
    public RessourceNotFoundException(String message) {
        super(message);
    }
}
