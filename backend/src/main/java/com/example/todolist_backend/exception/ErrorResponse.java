package com.example.todolist_backend.exception;

public class ErrorResponse {
    private String messageError;
    
    public ErrorResponse(String messageError) {
        this.messageError = messageError;
    }

    public String getMessageError() {
        return messageError;
    }

    public void setMessageError(String messageError) {
        this.messageError = messageError;
    }
}
