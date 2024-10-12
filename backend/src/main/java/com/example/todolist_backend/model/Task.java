package com.example.todolist_backend.model;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

// modele de données pour une tâche, il définit les champs comme id, title, description...

@Entity
@Table(name = "tasks")
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String description;
    private LocalDateTime date_creation;

    @ManyToOne
    @JoinColumn(name = "category_id")
    private Categorie categorie;

    private boolean completed;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    public Task() {
        this.date_creation = LocalDateTime.now();
    }

    public Task(String title, String description, LocalDateTime date_creation, Categorie categorie, boolean completed, User user) {
        this.title = title;
        this.description = description;
        this.categorie = categorie;
        this.completed = completed;
        this.user = user;
        this.date_creation = LocalDateTime.now();
    }

    // getters et setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDateTime getDateCreate() {
        return date_creation;
    }

    // pas sur car normalement on ne peux pas modifier la date de creation, il faudrais la définir dès la création de la tâche et ne plus y toucher
    public void setDateCreate(LocalDateTime date_creation) {
        this.date_creation = date_creation;
    }

    public Categorie getCategorie() {
        return categorie;
    }

    public void setCategorie(Categorie categorie) {
        this.categorie = categorie;
    }

    public boolean isCompleted() {
        return completed;
    }

    public void setCompleted(boolean completed) {
        this.completed = completed;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}
