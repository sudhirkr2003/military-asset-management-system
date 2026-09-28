package com.military.assetmanagement.service;

import com.military.assetmanagement.dto.AssignmentRequest;
import com.military.assetmanagement.entity.*;
import com.military.assetmanagement.exception.InsufficientAssetException;
import com.military.assetmanagement.exception.ResourceNotFoundException;
import com.military.assetmanagement.repository.AssetRepository;
import com.military.assetmanagement.repository.AssignmentRepository;
import com.military.assetmanagement.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AssignmentService {

    private final AssignmentRepository assignmentRepository;
    private final AssetRepository assetRepository;
    private final UserRepository userRepository;
    private final AuditLogService auditLogService;

    @Transactional
    public Assignment assignAsset(AssignmentRequest request, String username, String ipAddress) {
        Asset asset = assetRepository.findById(request.getAssetId())
                .orElseThrow(() -> new ResourceNotFoundException("Asset not found with id: " + request.getAssetId()));

        User assignedBy = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + username));

        if (asset.getAvailableQuantity() < request.getQuantity()) {
            throw new InsufficientAssetException("Insufficient available quantity for assignment. Available: " +
                    asset.getAvailableQuantity() + ", Requested: " + request.getQuantity());
        }

        asset.setAvailableQuantity(asset.getAvailableQuantity() - request.getQuantity());
        asset.setAssignedQuantity(asset.getAssignedQuantity() + request.getQuantity());

        Assignment assignment = Assignment.builder()
                .asset(asset)
                .personnelName(request.getPersonnelName())
                .personnelId(request.getPersonnelId())
                .quantity(request.getQuantity())
                .assignedDate(request.getAssignedDate() != null ? request.getAssignedDate() : LocalDate.now())
                .assignedBy(assignedBy)
                .status("ASSIGNED")
                .build();

        Assignment savedAssignment = assignmentRepository.save(assignment);

        auditLogService.logAction(assignedBy, username, "ASSIGNMENT_CREATED", "ASSIGNMENT", savedAssignment.getId(),
                "Assigned " + request.getQuantity() + " " + asset.getEquipmentType().getName() + "(s) to " +
                        request.getPersonnelName() + " (ID: " + request.getPersonnelId() + ") at " + asset.getBase().getName(), ipAddress);

        return savedAssignment;
    }

    @Transactional
    public Assignment returnAssignment(Long assignmentId, String username, String ipAddress) {
        Assignment assignment = assignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Assignment not found with id: " + assignmentId));

        if ("RETURNED".equals(assignment.getStatus())) {
            throw new IllegalArgumentException("Assignment is already marked as returned");
        }

        User returnedBy = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + username));

        Asset asset = assignment.getAsset();
        asset.setAssignedQuantity(asset.getAssignedQuantity() - assignment.getQuantity());
        asset.setAvailableQuantity(asset.getAvailableQuantity() + assignment.getQuantity());

        assignment.setStatus("RETURNED");
        Assignment updatedAssignment = assignmentRepository.save(assignment);

        auditLogService.logAction(returnedBy, username, "ASSIGNMENT_RETURNED", "ASSIGNMENT", updatedAssignment.getId(),
                "Returned " + assignment.getQuantity() + " " + asset.getEquipmentType().getName() + "(s) from " +
                        assignment.getPersonnelName() + " back to available pool at " + asset.getBase().getName(), ipAddress);

        return updatedAssignment;
    }

    public List<Assignment> getAssignments(Long baseId, Long equipmentTypeId, LocalDate fromDate, LocalDate toDate) {
        return assignmentRepository.findFilteredAssignments(baseId, equipmentTypeId, fromDate, toDate);
    }

    public Assignment getAssignmentById(Long id) {
        return assignmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Assignment not found with id: " + id));
    }
}
