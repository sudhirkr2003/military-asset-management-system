package com.military.assetmanagement.controller;

import com.military.assetmanagement.dto.TransferRequest;
import com.military.assetmanagement.entity.Transfer;
import com.military.assetmanagement.service.TransferService;
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
@RequestMapping("/api/transfers")
@RequiredArgsConstructor
@Tag(name = "Transfers", description = "Inter-base asset transfers and transaction history")
public class TransferController {

    private final TransferService transferService;

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'LOGISTICS_OFFICER', 'BASE_COMMANDER')")
    @Operation(summary = "Initiate and complete inter-base asset transfer")
    public ResponseEntity<Transfer> createTransfer(
            @Valid @RequestBody TransferRequest request,
            Authentication authentication,
            HttpServletRequest servletRequest) {
        String username = authentication.getName();
        String ipAddress = servletRequest.getRemoteAddr();
        return ResponseEntity.ok(transferService.createTransfer(request, username, ipAddress));
    }

    @GetMapping
    @Operation(summary = "Get transfer history with optional filters")
    public ResponseEntity<List<Transfer>> getTransfers(
            @RequestParam(required = false) Long baseId,
            @RequestParam(required = false) Long equipmentTypeId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) {
        return ResponseEntity.ok(transferService.getTransfers(baseId, equipmentTypeId, from, to));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get transfer record by ID")
    public ResponseEntity<Transfer> getTransferById(@PathVariable Long id) {
        return ResponseEntity.ok(transferService.getTransferById(id));
    }
}
