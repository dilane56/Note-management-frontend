package org.kfokam48.notemanagementbackend.exception;

public class InvalidGradeValueException extends RuntimeException {
    public InvalidGradeValueException(String message) {
        super(message);
    }
}