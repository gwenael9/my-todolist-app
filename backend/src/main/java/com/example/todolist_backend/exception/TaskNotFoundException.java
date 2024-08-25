package com.example.todolist_backend.exception;

public class TaskNotFoundException extends RuntimeException {
    public TaskNotFoundException(Long id) {
        super("Cette tâche est indisponible avec l'ID : " + id);
    }
}
