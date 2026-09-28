package com.military.assetmanagement.config;

import com.military.assetmanagement.entity.*;
import com.military.assetmanagement.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final BaseRepository baseRepository;
    private final EquipmentTypeRepository equipmentTypeRepository;
    private final UserRepository userRepository;
    private final AssetRepository assetRepository;
    private final PurchaseRepository purchaseRepository;
    private final TransferRepository transferRepository;
    private final AssignmentRepository assignmentRepository;
    private final ExpenditureRepository expenditureRepository;
    private final AuditLogRepository auditLogRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (roleRepository.count() == 0) {
            log.info("Initializing mandatory roles...");
            roleRepository.save(Role.builder().name(RoleName.ADMIN).build());
            roleRepository.save(Role.builder().name(RoleName.BASE_COMMANDER).build());
            roleRepository.save(Role.builder().name(RoleName.LOGISTICS_OFFICER).build());
        }
        log.info("DataSeeder completed (auto-dummy data insertion is disabled).");
    }
}
