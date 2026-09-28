package com.military.assetmanagement.controller;

import com.military.assetmanagement.entity.EquipmentType;
import com.military.assetmanagement.exception.ResourceNotFoundException;
import com.military.assetmanagement.repository.EquipmentTypeRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/equipment-types")
@RequiredArgsConstructor
@Tag(name = "Equipment Types", description = "Equipment definitions and categories")
public class EquipmentTypeController {

    private final EquipmentTypeRepository equipmentTypeRepository;

    @GetMapping
    @Operation(summary = "Get all equipment types")
    public ResponseEntity<List<EquipmentType>> getAllEquipmentTypes() {
        return ResponseEntity.ok(equipmentTypeRepository.findAll());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get equipment type by ID")
    public ResponseEntity<EquipmentType> getEquipmentTypeById(@PathVariable Long id) {
        return ResponseEntity.ok(equipmentTypeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Equipment type not found with id: " + id)));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'LOGISTICS_OFFICER')")
    @Operation(summary = "Create a new equipment type")
    public ResponseEntity<EquipmentType> createEquipmentType(@RequestBody EquipmentType equipmentType) {
        return ResponseEntity.ok(equipmentTypeRepository.save(equipmentType));
    }
}
