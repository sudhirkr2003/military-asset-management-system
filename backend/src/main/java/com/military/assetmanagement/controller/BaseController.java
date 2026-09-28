package com.military.assetmanagement.controller;

import com.military.assetmanagement.entity.Base;
import com.military.assetmanagement.exception.ResourceNotFoundException;
import com.military.assetmanagement.repository.BaseRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bases")
@RequiredArgsConstructor
@Tag(name = "Bases", description = "Military Base Management")
public class BaseController {

    private final BaseRepository baseRepository;

    @GetMapping
    @Operation(summary = "Get all military bases")
    public ResponseEntity<List<Base>> getAllBases() {
        return ResponseEntity.ok(baseRepository.findAll());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get base by ID")
    public ResponseEntity<Base> getBaseById(@PathVariable Long id) {
        return ResponseEntity.ok(baseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Base not found with id: " + id)));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Create a new military base (Admin only)")
    public ResponseEntity<Base> createBase(@RequestBody Base base) {
        return ResponseEntity.ok(baseRepository.save(base));
    }
}
