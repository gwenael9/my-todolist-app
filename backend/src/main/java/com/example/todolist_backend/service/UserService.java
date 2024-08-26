package com.example.todolist_backend.service;

import com.example.todolist_backend.model.User;
import com.example.todolist_backend.repository.UserRepository;
import com.example.todolist_backend.util.JwtUtil;
import com.example.todolist_backend.exception.UserNotFoundException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;
import java.util.Map; 
import java.util.HashMap;

@Service
public class UserService {
 
    @Autowired
    private final UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private TokenBlacklistService tokenBlacklistService;

    public UserService(final UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User getUserById(final Long id) {
        return userRepository.findById(id)
            .orElseThrow(() -> new UserNotFoundException(id));
    }
    
    // seulement pour /me pour le Controller
    public User getUserByUsername(final String username) {
        User user = userRepository.findByUsername(username);
        if (user == null) {
            throw new UserNotFoundException(username);
        }
        return user;
    }

    // créer un user
    public User createUser(User user) {
        if (userRepository.findById(user.getId()) != null) {
            throw new IllegalArgumentException("L'utilisateur existe déjà.");
        }

        // encode du mot de passe avant de le sauvegarder en bdd
        user.setPassword(PasswordUtils.encodePassword(user.getPassword()));
        return userRepository.save(user);
    }

    // mettre à jour un utilisateur (seulement le mot de passe)
    public User updateUserPassword(Long id, String newPassword) {
        User existingUser = getUserById(id);

        // encoder le nouveau mot de passe et le mettre à jour
        existingUser.setPassword(PasswordUtils.encodePassword(newPassword));

        // Sauvegarder les modifications en base de données
        return userRepository.save(existingUser);
    }

    // supprimer un utilisateur
    public void deleteUser(final Long id) {
        User existingUser = getUserById(id);
        userRepository.delete(existingUser);
    }

    // Méthode pour vérifier l'utilisateur avec nom d'utilisateur et mot de passe
    public User validateUserCredentials(String username, String password) {
        User existingUser = userRepository.findByUsername(username);

        // Vérifier si l'utilisateur existe et si le mot de passe correspond
        if (existingUser == null || !PasswordUtils.checkPassword(password, existingUser.getPassword())) {
            throw new IllegalArgumentException("Invalid credentials");
        }

        return existingUser;
    }

    // Méthode de connexion qui prend une Map de requêtes (appelée depuis le contrôleur)
    public ResponseEntity<?> loginUser(@RequestBody Map<String, String> loginRequest) {
        String username = loginRequest.get("username");
        String password = loginRequest.get("password");

        if (username == null || password == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Username and password must be provided");
        }

        try {
            // Utilisation de la méthode validateUserCredentials pour vérifier les informations d'identification
            User user = validateUserCredentials(username, password);

            String token = jwtUtil.generateToken(user.getUsername()); // Générer un token JWT
            Map<String, Object> response = new HashMap<>();
            response.put("token", token);
            response.put("user", user);

            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
        }
    }

    // deconnexion
    public ResponseEntity<?> logoutUser(String token) {
        try {
            // Ajouter le token à la liste noire
            tokenBlacklistService.blacklistToken(token);
            return ResponseEntity.ok("User logged out successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred during logout");
        }
    }
}
