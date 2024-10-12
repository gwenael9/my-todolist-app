package com.example.todolist_backend.controller;

import com.example.todolist_backend.service.TaskService;
import com.example.todolist_backend.service.UserService;
import com.example.todolist_backend.util.JwtUtil;

import jakarta.servlet.http.HttpServletRequest;

import com.example.todolist_backend.model.Task;
import com.example.todolist_backend.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.time.LocalDateTime;

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

    @GetMapping
    public List<Task> getAllTasks(HttpServletRequest request) {
        // extraire le token et username
        String token = jwtUtil.extractTokenFromRequest(request);
        String username = jwtUtil.extractUsername(token);

        // récupère l'user connecté
        User user = userService.getUserByUsername(username);

        // retourne les tâches de cet user
        return taskService.getTasksByUser(user);
    }

    // Récupère une tâche par ID pour l'utilisateur connecté
    @GetMapping("/{id}")
    public ResponseEntity<Task> getTaskById(@PathVariable Long id, HttpServletRequest request) {
        // Extraire le token et le nom d'utilisateur
        String token = jwtUtil.extractTokenFromRequest(request);
        String username = jwtUtil.extractUsername(token);

        // Récupérer l'utilisateur connecté
        User user = userService.getUserByUsername(username);

        // Récupérer la tâche si elle appartient à l'utilisateur
        Task task = taskService.getTaskByIdAndUser(id, user);
        return ResponseEntity.ok(task);
    }

    // Crée une tâche pour l'utilisateur connecté
    @PostMapping
    public Task createTask(@RequestBody Task task, HttpServletRequest request) {
        // Extraire le token et le nom d'utilisateur
        String token = jwtUtil.extractTokenFromRequest(request);
        String username = jwtUtil.extractUsername(token);

        // Récupérer l'utilisateur connecté
        User user = userService.getUserByUsername(username);

        // Assigner l'utilisateur à la tâche avant de la créer
        task.setUser(user);
        task.setDateCreate(LocalDateTime.now());
        return taskService.createTask(task);
    }

    // Met à jour une tâche existante de l'utilisateur connecté
    @PutMapping("/{id}")
    public ResponseEntity<Task> updateTask(@PathVariable Long id, @RequestBody Task taskDetails,
            HttpServletRequest request) {
        // Extraire le token et le nom d'utilisateur
        String token = jwtUtil.extractTokenFromRequest(request);
        String username = jwtUtil.extractUsername(token);

        // Récupérer l'utilisateur connecté
        User user = userService.getUserByUsername(username);

        // Mettre à jour la tâche si elle appartient à l'utilisateur
        Task updatedTask = taskService.updateTask(id, taskDetails, user);
        return ResponseEntity.ok(updatedTask);
    }

    // Mettre à jour l'état 'completed' d'une tâche
    @PatchMapping("/{id}/completed")
    public ResponseEntity<Task> updateTaskCompleted(@PathVariable Long id, @RequestBody Task taskDetails,
            HttpServletRequest request) {
        // Extraire le token et l'utilisateur connecté
        String token = jwtUtil.extractTokenFromRequest(request);
        String username = jwtUtil.extractUsername(token);
        User user = userService.getUserByUsername(username);

        // Mettre à jour le statut 'completed' de la tâche
        Task updatedTask = taskService.updateTaskCompleted(id, taskDetails, user);
        return ResponseEntity.ok(updatedTask);
    }

    // Supprime une tâche appartenant à l'utilisateur connecté
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteTask(@PathVariable Long id, HttpServletRequest request) {
        // Extraire le token et le nom d'utilisateur
        String token = jwtUtil.extractTokenFromRequest(request);
        String username = jwtUtil.extractUsername(token);

        // Récupérer l'utilisateur connecté
        User user = userService.getUserByUsername(username);

        // Supprimer la tâche si elle appartient à l'utilisateur
        taskService.deleteTask(id, user);
        return ResponseEntity.ok("La tâche a bien été supprimée.");
    }
}
