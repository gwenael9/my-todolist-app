package com.example.todolist_backend.controller;

import com.example.todolist_backend.service.TaskService;
import com.example.todolist_backend.service.UserService;
import com.example.todolist_backend.util.JwtUtil;

import jakarta.servlet.http.HttpServletRequest;

import com.example.todolist_backend.model.Task;
import com.example.todolist_backend.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;


@RestController
@RequestMapping("/tasks")
public class TaskController {

    @Autowired
    private final TaskService taskService;

    @Autowired
    private final UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    public TaskController(TaskService taskService, UserService userService, JwtUtil jwtUtil) {
        this.taskService = taskService;
        this.userService = userService;
        this.jwtUtil = jwtUtil;
    }

    private User getAuthenticatedUser(HttpServletRequest request) {
        String token = jwtUtil.extractTokenFromRequest(request);
        String username = jwtUtil.extractUsername(token);
        return userService.getUserByUsername(username);
    }

    @GetMapping
    public ResponseEntity<Page<Task>> getAllTasks(HttpServletRequest request,
            @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size) {

        // Récupérer l'utilisateur connecté
        User user = getAuthenticatedUser(request);
        Pageable pageable = PageRequest.of(page, size);

        // Retourner les tâches de cet utilisateur sous forme de page
        Page<Task> tasksPage = taskService.getTasksByUser(user, pageable);

        return ResponseEntity.ok(tasksPage);
    }

    @GetMapping("/finish")
    public ResponseEntity<Page<Task>> getAllTasksFinish(HttpServletRequest request,
            @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size) {
                
        // Récupérer l'utilisateur connecté
        User user = getAuthenticatedUser(request);
        Pageable pageable = PageRequest.of(page, size);

        // Retourner les tâches de cet utilisateur sous forme de page
        Page<Task> tasksPage = taskService.getTaskFinishByUser(user, pageable);

        return ResponseEntity.ok(tasksPage);
    }
    
    @GetMapping("/progress")
    public ResponseEntity<Page<Task>> getAllTasksNotFinish(HttpServletRequest request,
            @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size) {

        // Récupérer l'utilisateur connecté
        User user = getAuthenticatedUser(request);
        Pageable pageable = PageRequest.of(page, size);

        // Retourner les tâches de cet utilisateur sous forme de page
        Page<Task> tasksPage = taskService.getTaskNotFinishByUser(user, pageable);

        return ResponseEntity.ok(tasksPage);
    }
    

    // Récupère une tâche par ID pour l'utilisateur connecté
    @GetMapping("/{id}")
    public ResponseEntity<Task> getTaskById(@PathVariable Long id, HttpServletRequest request) {

        // Récupérer l'utilisateur connecté
        User user = getAuthenticatedUser(request);

        // Récupérer la tâche si elle appartient à l'utilisateur
        Task task = taskService.getTaskByIdAndUser(id, user);
        return ResponseEntity.ok(task);
    }

    // Crée une tâche pour l'utilisateur connecté
    @PostMapping
    public Task createTask(@RequestBody Task task, HttpServletRequest request) {
        // Récupérer l'utilisateur connecté
        User user = getAuthenticatedUser(request);

        // Assigner l'utilisateur à la tâche avant de la créer
        task.setUser(user);
        task.setDateCreate(LocalDateTime.now());
        return taskService.createTask(task);
    }

    // Met à jour une tâche existante de l'utilisateur connecté
    @PutMapping("/{id}")
    public ResponseEntity<Task> updateTask(@PathVariable Long id, @RequestBody Task taskDetails,
            HttpServletRequest request) {
        // Récupérer l'utilisateur connecté
        User user = getAuthenticatedUser(request);

        // Mettre à jour la tâche si elle appartient à l'utilisateur
        Task updatedTask = taskService.updateTask(id, taskDetails, user);
        return ResponseEntity.ok(updatedTask);
    }

    // Mettre à jour l'état 'completed' d'une tâche
    @PatchMapping("/{id}/completed")
    public ResponseEntity<Task> updateTaskCompleted(@PathVariable Long id, @RequestBody Task taskDetails,
            HttpServletRequest request) {
        User user = getAuthenticatedUser(request);

        // Mettre à jour le statut 'completed' de la tâche
        Task updatedTask = taskService.updateTaskCompleted(id, taskDetails, user);
        return ResponseEntity.ok(updatedTask);
    }

    // Supprime une tâche appartenant à l'utilisateur connecté
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteTask(@PathVariable Long id, HttpServletRequest request) {

        // Récupérer l'utilisateur connecté
        User user = getAuthenticatedUser(request);

        // Supprimer la tâche si elle appartient à l'utilisateur
        taskService.deleteTask(id, user);
        return ResponseEntity.ok("La tâche a bien été supprimée.");
    }
}
