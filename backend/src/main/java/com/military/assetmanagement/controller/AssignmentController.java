package com.military.assetmanagement.controller;

import com.military.assetmanagement.dto.AssignmentRequest;
import com.military.assetmanagement.entity.Assignment;
import com.military.assetmanagement.service.AssignmentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/assignments")
@RequiredArgsConstructor
@Tag(name = "Assignments", description = "Asset assignments to military personnel and return processing")
public class AssignmentController {

    private final AssignmentService assignmentService;

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'BASE_COMMANDER')")
    @Operation(summary = "Assign asset to personnel")
    public ResponseEntity<Assignment> assignAsset(
            @Valid @RequestBody AssignmentRequest request,
            Authentication authentication,
            HttpServletRequest servletRequest) {
        String username = authentication.getName();
        String ipAddress = servletRequest.getRemoteAddr();
        return ResponseEntity.ok(assignmentService.assignAsset(request, username, ipAddress));
    }

    @PutMapping("/{id}/return")
    @PreAuthorize("hasAnyRole('ADMIN', 'BASE_COMMANDER')")
    @Operation(summary = "Return assigned asset back to available inventory")
    public ResponseEntity<Assignment> returnAssignment(
            @PathVariable Long id,
            Authentication authentication,
            HttpServletRequest servletRequest) {
        String username = authentication.getName();
        String ipAddress = servletRequest.getRemoteAddr();
        return ResponseEntity.ok(assignmentService.returnAssignment(id, username, ipAddress));
    }

    @GetMapping
    @Operation(summary = "Get assignments with optional filters")
    public ResponseEntity<List<Assignment>> getAssignments(
            @RequestParam(required = false) Long baseId,
            @RequestParam(required = false) Long equipmentTypeId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) {
        return ResponseEntity.ok(assignmentService.getAssignments(baseId, equipmentTypeId, from, to));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get assignment by ID")
    public ResponseEntity<Assignment> getAssignmentById(@PathVariable Long id) {
        return ResponseEntity.ok(assignmentService.getAssignmentById(id));
    }
}
