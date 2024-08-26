package com.example.todolist_backend.service;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class PasswordUtils {

    private static final PasswordEncoder encoder = new BCryptPasswordEncoder();

    public static String encodePassword(String password) {
        return encoder.encode(password);
    }

    public static boolean checkPassword(String rawPassword, String encodedPassword) {
        return encoder.matches(rawPassword, encodedPassword);
    }
}
