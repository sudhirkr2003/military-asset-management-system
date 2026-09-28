package com.military.assetmanagement.controller;

import com.military.assetmanagement.dto.ExpenditureRequest;
import com.military.assetmanagement.entity.Expenditure;
import com.military.assetmanagement.service.ExpenditureService;
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
@RequestMapping("/api/expenditures")
@RequiredArgsConstructor
@Tag(name = "Expenditures", description = "Expenditure/consumption of assets (training, operational use)")
public class ExpenditureController {

    private final ExpenditureService expenditureService;

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'BASE_COMMANDER', 'LOGISTICS_OFFICER')")
    @Operation(summary = "Record asset expenditure")
    public ResponseEntity<Expenditure> recordExpenditure(
            @Valid @RequestBody ExpenditureRequest request,
            Authentication authentication,
            HttpServletRequest servletRequest) {
        String username = authentication.getName();
        String ipAddress = servletRequest.getRemoteAddr();
        return ResponseEntity.ok(expenditureService.recordExpenditure(request, username, ipAddress));
    }

    @GetMapping
    @Operation(summary = "Get expenditure records with optional filters")
    public ResponseEntity<List<Expenditure>> getExpenditures(
            @RequestParam(required = false) Long baseId,
            @RequestParam(required = false) Long equipmentTypeId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) {
        return ResponseEntity.ok(expenditureService.getExpenditures(baseId, equipmentTypeId, from, to));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get expenditure by ID")
    public ResponseEntity<Expenditure> getExpenditureById(@PathVariable Long id) {
        return ResponseEntity.ok(expenditureService.getExpenditureById(id));
    }
}
