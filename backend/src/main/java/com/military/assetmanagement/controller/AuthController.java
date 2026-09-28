package com.military.assetmanagement.controller;

import com.military.assetmanagement.dto.LoginRequest;
import com.military.assetmanagement.dto.LoginResponse;
import com.military.assetmanagement.dto.RegisterRequest;
import com.military.assetmanagement.entity.User;
import com.military.assetmanagement.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "Endpoints for user login, registration, and user profile retrieval")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    @Operation(summary = "Authenticate user and return JWT bearer token")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request, HttpServletRequest servletRequest) {
        String ipAddress = servletRequest.getRemoteAddr();
        return ResponseEntity.ok(authService.login(request, ipAddress));
    }

    @PostMapping("/register")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Register new user (Admin only)")
    public ResponseEntity<User> register(@Valid @RequestBody RegisterRequest request, Authentication authentication, HttpServletRequest servletRequest) {
        String currentUsername = authentication != null ? authentication.getName() : null;
        String ipAddress = servletRequest.getRemoteAddr();
        return ResponseEntity.ok(authService.registerUser(request, currentUsername, ipAddress));
    }

    @GetMapping("/me")
    @Operation(summary = "Get currently authenticated user details")
    public ResponseEntity<User> getCurrentUser(Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.ok(authService.getUserByUsername(authentication.getName()));
    }
}
