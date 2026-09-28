package com.military.assetmanagement.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/health")
@Tag(name = "Health", description = "Public health check endpoint for monitoring")
public class HealthController {

    @GetMapping
    @Operation(summary = "Check backend running status")
    public ResponseEntity<Map<String, Object>> checkHealth() {
        Map<String, Object> health = new HashMap<>();
        health.put("status", "UP");
        health.put("service", "Military Asset Management Backend");
        health.put("version", "1.0.0");
        health.put("timestamp", LocalDateTime.now());
        return ResponseEntity.ok(health);
    }
}
