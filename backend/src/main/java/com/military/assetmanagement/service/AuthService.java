package com.military.assetmanagement.service;

import com.military.assetmanagement.dto.LoginRequest;
import com.military.assetmanagement.dto.LoginResponse;
import com.military.assetmanagement.dto.RegisterRequest;
import com.military.assetmanagement.entity.Base;
import com.military.assetmanagement.entity.Role;
import com.military.assetmanagement.entity.User;
import com.military.assetmanagement.exception.DuplicateResourceException;
import com.military.assetmanagement.exception.ResourceNotFoundException;
import com.military.assetmanagement.repository.BaseRepository;
import com.military.assetmanagement.repository.RoleRepository;
import com.military.assetmanagement.repository.UserRepository;
import com.military.assetmanagement.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final BaseRepository baseRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;
    private final AuditLogService auditLogService;

    public LoginResponse login(LoginRequest request, String ipAddress) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );

        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getUsername());
        Map<String, Object> extraClaims = new HashMap<>();
        extraClaims.put("role", user.getRole().getName().name());
        if (user.getBase() != null) {
            extraClaims.put("baseId", user.getBase().getId());
        }

        String token = jwtService.generateToken(userDetails, extraClaims);

        auditLogService.logAction(user, user.getUsername(), "USER_LOGIN", "USER", user.getId(),
                "User " + user.getUsername() + " logged in successfully", ipAddress);

        return LoginResponse.builder()
                .token(token)
                .userId(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .role(user.getRole().getName().name())
                .baseId(user.getBase() != null ? user.getBase().getId() : null)
                .baseName(user.getBase() != null ? user.getBase().getName() : "All Bases (HQ)")
                .build();
    }

    @Transactional
    public User registerUser(RegisterRequest request, String currentUsername, String ipAddress) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new DuplicateResourceException("Username '" + request.getUsername() + "' is already taken.");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("Email '" + request.getEmail() + "' is already in use.");
        }

        Role role = roleRepository.findById(request.getRoleId())
                .orElseThrow(() -> new ResourceNotFoundException("Role not found with id: " + request.getRoleId()));

        Base base = null;
        if (request.getBaseId() != null) {
            base = baseRepository.findById(request.getBaseId())
                    .orElseThrow(() -> new ResourceNotFoundException("Base not found with id: " + request.getBaseId()));
        }

        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .fullName(request.getFullName())
                .role(role)
                .base(base)
                .enabled(true)
                .build();

        User savedUser = userRepository.save(user);

        User currentUser = currentUsername != null ? userRepository.findByUsername(currentUsername).orElse(null) : null;
        auditLogService.logAction(currentUser, currentUsername != null ? currentUsername : "SYSTEM",
                "USER_CREATED", "USER", savedUser.getId(),
                "Created user " + savedUser.getUsername() + " with role " + role.getName().name(), ipAddress);

        return savedUser;
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User getUserByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + username));
    }
}
