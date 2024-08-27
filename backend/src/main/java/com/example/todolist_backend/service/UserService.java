package com.example.todolist_backend.service;

import com.example.todolist_backend.model.User;
import com.example.todolist_backend.repository.UserRepository;
import com.example.todolist_backend.util.JwtUtil;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import com.example.todolist_backend.exception.UserNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

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

    public User getUserByUsername(final String username) {
        User user = userRepository.findByUsername(username);
        if (user == null) {
            throw new UserNotFoundException(username);
        }
        return user;
    }

    // Crée un utilisateur dans la base de données avec un mot de passe encodé
    public User createUser(User user) {
        // Vérifie si l'utilisateur existe déjà
        if (userRepository.findByUsername(user.getUsername()) != null) {
            throw new IllegalArgumentException("User already exists with this username.");
        }

        // Définit le rôle par défaut si non spécifié
        if (user.getRole() == null) {
            user.setRole("USER");
        }

        // Encode le mot de passe avant de sauvegarder l'utilisateur
        user.setPassword(PasswordUtils.encodePassword(user.getPassword()));
        return userRepository.save(user);
    }

    public User updateUserPassword(Long id, String newPassword) {
        User existingUser = getUserById(id);
        existingUser.setPassword(PasswordUtils.encodePassword(newPassword));
        return userRepository.save(existingUser);
    }

    public void deleteUser(final Long id) {
        User existingUser = getUserById(id);
        userRepository.delete(existingUser);
    }

    public User validateUserCredentials(String username, String password) {
        User existingUser = userRepository.findByUsername(username);
        if (existingUser == null || !PasswordUtils.checkPassword(password, existingUser.getPassword())) {
            throw new IllegalArgumentException("Invalid credentials");
        }
        return existingUser;
    }

    // Corriger la méthode loginUser pour qu'elle accepte HttpServletResponse
    public ResponseEntity<?> loginUser(HttpServletResponse response, Map<String, String> loginRequest) {
        String username = loginRequest.get("username");
        String password = loginRequest.get("password");

        if (username == null || password == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Username and password must be provided");
        }

        try {
            User user = validateUserCredentials(username, password);
            String token = jwtUtil.generateToken(user.getUsername(), user.getRole());

            Cookie cookie = new Cookie("token", token);
            cookie.setHttpOnly(true);
            cookie.setSecure(true);
            cookie.setPath("/");
            cookie.setMaxAge(24 * 60 * 60);

            response.addCookie(cookie);

            return ResponseEntity.ok("Login successful");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
        }
    }

    public ResponseEntity<?> logoutUser(HttpServletRequest request, HttpServletResponse response) {
        try {
            // Lire le cookie du token
            Cookie[] cookies = request.getCookies();
            String token = null;

            if (cookies != null) {
                for (Cookie cookie : cookies) {
                    if (cookie.getName().equals("token")) {
                        token = cookie.getValue();
                        break;
                    }
                }
            }

            if (token == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Token not found in cookies");
            }

            // Blacklist le token
            tokenBlacklistService.blacklistToken(token);

            // Supprimer le cookie côté client
            Cookie deleteCookie = new Cookie("token", null);
            deleteCookie.setPath("/");
            deleteCookie.setHttpOnly(true);
            deleteCookie.setMaxAge(0);
            response.addCookie(deleteCookie);

            return ResponseEntity.ok("User logged out successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred during logout");
        }
    }

}
