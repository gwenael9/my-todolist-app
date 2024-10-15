package com.example.todolist_backend.repository;

import com.example.todolist_backend.model.Task;
import com.example.todolist_backend.model.User;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TaskRepository extends JpaRepository<Task, Long> {
    // Récupérer toutes les tâches créées par un utilisateur
    Page<Task> findByUser(User user, Pageable pageable);

    // Récupérer une tâche par ID si elle appartient à un utilisateur spécifique
    Optional<Task> findByIdAndUser(Long id, User user);

    // convention de nommage
    Page<Task> findByUserAndCompletedTrue(User user, Pageable pageable);
    Page<Task> findByUserAndCompletedFalse(User user, Pageable pageable);
}
