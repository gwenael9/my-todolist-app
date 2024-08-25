package com.example.todolist_backend.service;

import com.example.todolist_backend.model.Task;
import com.example.todolist_backend.repository.TaskRepository;
import com.example.todolist_backend.exception.TaskNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TaskService {

    @Autowired
    private final TaskRepository taskRepository;

    public TaskService(final TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    // Récupérer toutes les tâches
    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }

    // Récupérer une tâche par ID
    public Task getTaskById(final Long id) {
        return taskRepository.findById(id)
            .orElseThrow(() -> new TaskNotFoundException(id));
    }

    // Créer une nouvelle tâche
    public Task createTask(final Task task) {
        return taskRepository.save(task);
    }

    // Mettre à jour une tâche existante
    public Task updateTask(final Long id, final Task taskDetails) {
        Task existingTask = getTaskById(id);
        existingTask.setTitle(taskDetails.getTitle());
        existingTask.setDescription(taskDetails.getDescription());
        existingTask.setCategorie(taskDetails.getCategorie());
        existingTask.setCompleted(taskDetails.isCompleted());
        return taskRepository.save(existingTask);
    }

    // Supprimer une tâche par ID
    public void deleteTask(final Long id) {
        Task existingTask = getTaskById(id);
        taskRepository.delete(existingTask);
    }
}
