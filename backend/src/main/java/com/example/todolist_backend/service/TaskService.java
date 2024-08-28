package com.example.todolist_backend.service;

import com.example.todolist_backend.model.Categorie;
import com.example.todolist_backend.model.Task;
import com.example.todolist_backend.model.User;
import com.example.todolist_backend.repository.CategorieRepository;
import com.example.todolist_backend.repository.TaskRepository;
import com.example.todolist_backend.exception.TaskNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TaskService {

    @Autowired
    private final TaskRepository taskRepository;

    @Autowired
    private CategorieRepository categorieRepository;

    public TaskService(final TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    // Récupérer les tâches créées par un utilisateur spécifique
    public List<Task> getTasksByUser(User user) {
        return taskRepository.findByUser(user);
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
    public Task createTask(Task task) {
        Categorie categorie = categorieRepository.findByName(task.getCategorie().getName());

        if (categorie == null) {
            throw new RuntimeException("Categorie inconnu : " + task.getCategorie().getName());
        }

        task.setCategorie(categorie);

        return taskRepository.save(task);
    }

    // Mettre à jour une tâche existante appartenant à un utilisateur
    public Task updateTask(Long id, Task taskDetails, User user) {
        Task existingTask = getTaskByIdAndUser(id, user); 
        existingTask.setTitle(taskDetails.getTitle());
        existingTask.setDescription(taskDetails.getDescription());
        // existingTask.setCompleted(taskDetails.isCompleted());

        if (taskDetails.getCategorie() != null && taskDetails.getCategorie().getId() != null) {
            Optional<Categorie> categorieOpt = categorieRepository.findById(taskDetails.getCategorie().getId());

            Categorie categorie = categorieOpt.orElseThrow(() -> new RuntimeException("Erreuuuuuuur"));

            existingTask.setCategorie(categorie);
                
        }
        
        // existingTask.setCategorie(taskDetails.getCategorie());
        return taskRepository.save(existingTask);
    }
    
    // modification tâche terminée ou non
    public Task updateTaskCompleted(Long id, Task taskDetails, User user) {
        Task existingTask = getTaskByIdAndUser(id, user);
        existingTask.setCompleted(taskDetails.isCompleted());
        return taskRepository.save(existingTask);

    }

    // Supprimer une tâche par ID
    public void deleteTask(Long id, User user) {
        Task existingTask = getTaskByIdAndUser(id, user);
        taskRepository.delete(existingTask);
    }

    // Récupérer une tâche par ID et utilisateur
    public Task getTaskByIdAndUser(Long id, User user) {
        return taskRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new TaskNotFoundException(id));
    }
}
