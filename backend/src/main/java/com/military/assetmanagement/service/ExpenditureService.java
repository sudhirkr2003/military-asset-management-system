package com.military.assetmanagement.service;

import com.military.assetmanagement.dto.ExpenditureRequest;
import com.military.assetmanagement.entity.*;
import com.military.assetmanagement.exception.InsufficientAssetException;
import com.military.assetmanagement.exception.ResourceNotFoundException;
import com.military.assetmanagement.repository.AssetRepository;
import com.military.assetmanagement.repository.ExpenditureRepository;
import com.military.assetmanagement.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ExpenditureService {

    private final ExpenditureRepository expenditureRepository;
    private final AssetRepository assetRepository;
    private final UserRepository userRepository;
    private final AuditLogService auditLogService;

    @Transactional
    public Expenditure recordExpenditure(ExpenditureRequest request, String username, String ipAddress) {
        Asset asset = assetRepository.findById(request.getAssetId())
                .orElseThrow(() -> new ResourceNotFoundException("Asset not found with id: " + request.getAssetId()));

        User recordedBy = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + username));

        if (asset.getAvailableQuantity() < request.getQuantity()) {
            throw new InsufficientAssetException("Insufficient available asset quantity for expenditure. Available: " +
                    asset.getAvailableQuantity() + ", Requested: " + request.getQuantity());
        }

        // Deduct from total and available, increment expended quantity
        asset.setQuantity(asset.getQuantity() - request.getQuantity());
        asset.setAvailableQuantity(asset.getAvailableQuantity() - request.getQuantity());
        asset.setExpendedQuantity(asset.getExpendedQuantity() + request.getQuantity());

        Expenditure expenditure = Expenditure.builder()
                .asset(asset)
                .equipmentType(asset.getEquipmentType())
                .quantity(request.getQuantity())
                .reason(request.getReason())
                .expenditureDate(request.getExpenditureDate() != null ? request.getExpenditureDate() : LocalDate.now())
                .recordedBy(recordedBy)
                .build();

        Expenditure savedExpenditure = expenditureRepository.save(expenditure);

        auditLogService.logAction(recordedBy, username, "EXPENDITURE_CREATED", "EXPENDITURE", savedExpenditure.getId(),
                "Expended " + request.getQuantity() + " " + asset.getEquipmentType().getName() + "(s) at " +
                        asset.getBase().getName() + ". Reason: " + request.getReason(), ipAddress);

        return savedExpenditure;
    }

    public List<Expenditure> getExpenditures(Long baseId, Long equipmentTypeId, LocalDate fromDate, LocalDate toDate) {
        return expenditureRepository.findFilteredExpenditures(baseId, equipmentTypeId, fromDate, toDate);
    }

    public Expenditure getExpenditureById(Long id) {
        return expenditureRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Expenditure not found with id: " + id));
    }
}
