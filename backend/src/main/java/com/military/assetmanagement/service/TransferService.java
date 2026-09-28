package com.military.assetmanagement.service;

import com.military.assetmanagement.dto.TransferRequest;
import com.military.assetmanagement.entity.*;
import com.military.assetmanagement.exception.InsufficientAssetException;
import com.military.assetmanagement.exception.ResourceNotFoundException;
import com.military.assetmanagement.repository.BaseRepository;
import com.military.assetmanagement.repository.EquipmentTypeRepository;
import com.military.assetmanagement.repository.TransferRepository;
import com.military.assetmanagement.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TransferService {

    private final TransferRepository transferRepository;
    private final BaseRepository baseRepository;
    private final EquipmentTypeRepository equipmentTypeRepository;
    private final UserRepository userRepository;
    private final AssetService assetService;
    private final AuditLogService auditLogService;

    @Transactional
    public Transfer createTransfer(TransferRequest request, String username, String ipAddress) {
        if (request.getFromBaseId().equals(request.getToBaseId())) {
            throw new IllegalArgumentException("Source base and destination base cannot be the same");
        }

        Base fromBase = baseRepository.findById(request.getFromBaseId())
                .orElseThrow(() -> new ResourceNotFoundException("Source Base not found with id: " + request.getFromBaseId()));

        Base toBase = baseRepository.findById(request.getToBaseId())
                .orElseThrow(() -> new ResourceNotFoundException("Destination Base not found with id: " + request.getToBaseId()));

        EquipmentType equipmentType = equipmentTypeRepository.findById(request.getEquipmentTypeId())
                .orElseThrow(() -> new ResourceNotFoundException("Equipment Type not found with id: " + request.getEquipmentTypeId()));

        User initiatedBy = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + username));

        // Get source asset and check stock
        Asset sourceAsset = assetService.getOrCreateAsset(fromBase.getId(), equipmentType.getId());
        if (sourceAsset.getAvailableQuantity() < request.getQuantity()) {
            throw new InsufficientAssetException("Insufficient available asset quantity at " + fromBase.getName() +
                    ". Available: " + sourceAsset.getAvailableQuantity() + ", Requested: " + request.getQuantity());
        }

        // Deduct from source base
        sourceAsset.setQuantity(sourceAsset.getQuantity() - request.getQuantity());
        sourceAsset.setAvailableQuantity(sourceAsset.getAvailableQuantity() - request.getQuantity());

        // Add to destination base
        Asset destAsset = assetService.getOrCreateAsset(toBase.getId(), equipmentType.getId());
        destAsset.setQuantity(destAsset.getQuantity() + request.getQuantity());
        destAsset.setAvailableQuantity(destAsset.getAvailableQuantity() + request.getQuantity());

        // Record Transfer
        Transfer transfer = Transfer.builder()
                .fromBase(fromBase)
                .toBase(toBase)
                .equipmentType(equipmentType)
                .quantity(request.getQuantity())
                .transferDate(request.getTransferDate() != null ? request.getTransferDate() : LocalDate.now())
                .status("COMPLETED")
                .referenceNumber(request.getReferenceNumber())
                .initiatedBy(initiatedBy)
                .build();

        Transfer savedTransfer = transferRepository.save(transfer);

        // Record Audit Log
        auditLogService.logAction(initiatedBy, username, "TRANSFER_CREATED", "TRANSFER", savedTransfer.getId(),
                "Transferred " + request.getQuantity() + " " + equipmentType.getName() + "(s) from " +
                        fromBase.getName() + " to " + toBase.getName() + " (Ref: " + request.getReferenceNumber() + ")", ipAddress);

        return savedTransfer;
    }

    public List<Transfer> getTransfers(Long baseId, Long equipmentTypeId, LocalDate fromDate, LocalDate toDate) {
        return transferRepository.findFilteredTransfers(baseId, equipmentTypeId, fromDate, toDate);
    }

    public Transfer getTransferById(Long id) {
        return transferRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Transfer not found with id: " + id));
    }
}
