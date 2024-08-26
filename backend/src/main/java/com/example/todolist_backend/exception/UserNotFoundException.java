package com.example.todolist_backend.exception;

public class UserNotFoundException extends RuntimeException {
    public UserNotFoundException(Long id) {
        super("Cette utilisateur est introuvable avec l'ID : " + id);
    }

    public UserNotFoundException(String username) {
        super("User not found with username: " + username);
    }
}
