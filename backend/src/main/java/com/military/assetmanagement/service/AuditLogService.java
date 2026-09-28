package com.military.assetmanagement.service;

import com.military.assetmanagement.entity.AuditLog;
import com.military.assetmanagement.entity.User;
import com.military.assetmanagement.repository.AuditLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AuditLogService {

    private final AuditLogRepository auditLogRepository;

    @Transactional
    public void logAction(User user, String username, String action, String entityType, Long entityId, String description, String ipAddress) {
        AuditLog auditLog = AuditLog.builder()
                .user(user)
                .username(username != null ? username : (user != null ? user.getUsername() : "SYSTEM"))
                .action(action)
                .entityType(entityType)
                .entityId(entityId)
                .description(description)
                .ipAddress(ipAddress != null ? ipAddress : "127.0.0.1")
                .timestamp(LocalDateTime.now())
                .build();
        auditLogRepository.save(auditLog);
    }

    public List<AuditLog> getAllAuditLogs(String username, String action) {
        return auditLogRepository.findFilteredLogs(username, action);
    }
}
