package com.military.assetmanagement.service;

import com.military.assetmanagement.dto.PurchaseRequest;
import com.military.assetmanagement.entity.*;
import com.military.assetmanagement.exception.ResourceNotFoundException;
import com.military.assetmanagement.repository.BaseRepository;
import com.military.assetmanagement.repository.EquipmentTypeRepository;
import com.military.assetmanagement.repository.PurchaseRepository;
import com.military.assetmanagement.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PurchaseService {

    private final PurchaseRepository purchaseRepository;
    private final BaseRepository baseRepository;
    private final EquipmentTypeRepository equipmentTypeRepository;
    private final UserRepository userRepository;
    private final AssetService assetService;
    private final AuditLogService auditLogService;

    @Transactional
    public Purchase createPurchase(PurchaseRequest request, String username, String ipAddress) {
        Base base = baseRepository.findById(request.getBaseId())
                .orElseThrow(() -> new ResourceNotFoundException("Base not found with id: " + request.getBaseId()));

        EquipmentType equipmentType = equipmentTypeRepository.findById(request.getEquipmentTypeId())
                .orElseThrow(() -> new ResourceNotFoundException("Equipment Type not found with id: " + request.getEquipmentTypeId()));

        User createdBy = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + username));

        Asset asset = assetService.getOrCreateAsset(base.getId(), equipmentType.getId());
        asset.setQuantity(asset.getQuantity() + request.getQuantity());
        asset.setAvailableQuantity(asset.getAvailableQuantity() + request.getQuantity());

        Purchase purchase = Purchase.builder()
                .base(base)
                .equipmentType(equipmentType)
                .quantity(request.getQuantity())
                .purchaseDate(request.getPurchaseDate() != null ? request.getPurchaseDate() : LocalDate.now())
                .vendor(request.getVendor())
                .referenceNumber(request.getReferenceNumber())
                .createdBy(createdBy)
                .build();

        Purchase savedPurchase = purchaseRepository.save(purchase);

        auditLogService.logAction(createdBy, username, "PURCHASE_CREATED", "PURCHASE", savedPurchase.getId(),
                "Purchased " + request.getQuantity() + " " + equipmentType.getName() + "(s) for " + base.getName() + " from " + request.getVendor(), ipAddress);

        return savedPurchase;
    }

    public List<Purchase> getPurchases(Long baseId, Long equipmentTypeId, LocalDate fromDate, LocalDate toDate) {
        return purchaseRepository.findFilteredPurchases(baseId, equipmentTypeId, fromDate, toDate);
    }

    public Purchase getPurchaseById(Long id) {
        return purchaseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Purchase not found with id: " + id));
    }
}
