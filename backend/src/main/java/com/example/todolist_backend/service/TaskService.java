package com.example.todolist_backend.service;

import com.example.todolist_backend.model.Categorie;
import com.example.todolist_backend.model.Task;
import com.example.todolist_backend.model.User;
import com.example.todolist_backend.repository.CategorieRepository;
import com.example.todolist_backend.repository.TaskRepository;
import com.example.todolist_backend.exception.TaskNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

@Service
public class TaskService {

    @Autowired
    private final TaskRepository taskRepository;

    @Autowired
    private CategorieRepository categorieRepository;

    public TaskService(final TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    private Pageable createSortedPageable(Pageable pageable) {
        return PageRequest.of(
                pageable.getPageNumber(),
                pageable.getPageSize(),
                Sort.by(Sort.Direction.DESC, "dateCreate"));
    }

    // Récupérer les tâches créées par un utilisateur spécifique
    public Page<Task> getTasksByUser(User user, Pageable pageable) {
        return taskRepository.findByUser(user, createSortedPageable(pageable));
    }

    public Page<Task> getTaskFinishByUser(User user, Pageable pageable) {
        return taskRepository.findByUserAndCompletedTrue(user, createSortedPageable(pageable));
    }
    
    public Page<Task> getTaskNotFinishByUser(User user, Pageable pageable) {
        return taskRepository.findByUserAndCompletedFalse(user, createSortedPageable(pageable));
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
            throw new RuntimeException("Categorie inconnue : " + task.getCategorie().getName());
        }

        task.setCategorie(categorie);
        return taskRepository.save(task);
    }

    // Mettre à jour une tâche existante appartenant à un utilisateur
    public Task updateTask(Long id, Task taskDetails, User user) {
        Task existingTask = getTaskByIdAndUser(id, user);
        updateTaskDetails(existingTask, taskDetails);
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

    // mise à jour des détails de la tâche
    private void updateTaskDetails(Task existingTask, Task taskDetails) {
        existingTask.setTitle(taskDetails.getTitle());
        existingTask.setDescription(taskDetails.getDescription());
        if (taskDetails.getCategorie() != null && taskDetails.getCategorie().getId() != null) {
            Categorie categorie = categorieRepository.findById(taskDetails.getCategorie().getId())
                    .orElseThrow(() -> new RuntimeException("Erreur : catégorie non trouvée"));
            existingTask.setCategorie(categorie);
        }
    }
}
