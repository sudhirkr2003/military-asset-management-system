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

        if (userRepository.count() == 0) {
            log.info("Initializing default admin account for local development...");
            Role adminRole = roleRepository.findByName(RoleName.ADMIN).orElse(null);
            userRepository.save(User.builder()
                    .username("admin")
                    .password(passwordEncoder.encode("Admin@123"))
                    .email("admin@military.gov")
                    .fullName("Commander In Chief")
                    .role(adminRole)
                    .enabled(true)
                    .build());
        }

        if (baseRepository.count() == 0) {
            log.info("Initializing default bases...");
            baseRepository.save(Base.builder().name("Northern Command Base").code("NC-01").location("Udhampur Tactical Sector").build());
            baseRepository.save(Base.builder().name("Western Air Command").code("WAC-02").location("Ambala Air Station").build());
            baseRepository.save(Base.builder().name("Eastern Naval Command").code("ENC-03").location("Visakhapatnam Dockyard").build());
        }

        if (equipmentTypeRepository.count() == 0) {
            log.info("Initializing default equipment types...");
            equipmentTypeRepository.save(EquipmentType.builder().name("Tactical Transport Vehicle").category("Vehicle").unit("Units").description("Armored multi-purpose transport vehicle").build());
            equipmentTypeRepository.save(EquipmentType.builder().name("Standard Assault Rifle").category("Weapon").unit("Units").description("5.56mm service rifle").build());
            equipmentTypeRepository.save(EquipmentType.builder().name("5.56mm Ammunition").category("Ammunition").unit("Rounds").description("Standard NATO cartridge").build());
            equipmentTypeRepository.save(EquipmentType.builder().name("Encrypted VHF Radio").category("Communication Equipment").unit("Sets").description("Secure tactical radio transceiver").build());
            equipmentTypeRepository.save(EquipmentType.builder().name("Field Trauma Kit").category("Medical Equipment").unit("Kits").description("Emergency medical responder pack").build());
        }

        log.info("DataSeeder completed.");
    }
}
