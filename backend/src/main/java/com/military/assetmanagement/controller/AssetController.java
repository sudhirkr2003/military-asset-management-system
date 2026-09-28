package com.military.assetmanagement.controller;

import com.military.assetmanagement.entity.Asset;
import com.military.assetmanagement.service.AssetService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/assets")
@RequiredArgsConstructor
@Tag(name = "Assets", description = "Current stock balance levels per base and equipment category")
public class AssetController {

    private final AssetService assetService;

    @GetMapping
    @Operation(summary = "Get all inventory assets, with optional base or equipment filtering")
    public ResponseEntity<List<Asset>> getAssets(
            @RequestParam(required = false) Long baseId,
            @RequestParam(required = false) Long equipmentTypeId) {
        return ResponseEntity.ok(assetService.getAllAssets(baseId, equipmentTypeId));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get asset by ID")
    public ResponseEntity<Asset> getAssetById(@PathVariable Long id) {
        return ResponseEntity.ok(assetService.getAssetById(id));
    }
}
