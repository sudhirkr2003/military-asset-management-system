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
        if (roleRepository.count() > 0) {
            log.info("Database already seeded. Skipping initial data population.");
            return;
        }

        log.info("Seeding initial database data...");

        // 1. Roles
        Role adminRole = roleRepository.save(Role.builder().name(RoleName.ADMIN).build());
        Role commanderRole = roleRepository.save(Role.builder().name(RoleName.BASE_COMMANDER).build());
        roleRepository.save(Role.builder().name(RoleName.LOGISTICS_OFFICER).build());

        // 2. Bases
        Base baseAlpha = baseRepository.save(Base.builder().name("Base Alpha").location("Delhi Tactical Zone").code("ALPHA-01").build());
        Base baseBravo = baseRepository.save(Base.builder().name("Base Bravo").location("Mumbai Naval Station").code("BRAVO-02").build());
        Base baseCharlie = baseRepository.save(Base.builder().name("Base Charlie").location("Pune Defense Depot").code("CHARLIE-03").build());

        // 3. Equipment Types
        EquipmentType vehicle = equipmentTypeRepository.save(EquipmentType.builder()
                .name("Tactical Transport Vehicle").category("Vehicle").description("Armored multi-purpose transport vehicle").unit("Units").build());
        EquipmentType weapon = equipmentTypeRepository.save(EquipmentType.builder()
                .name("Standard Assault Rifle").category("Weapon").description("5.56mm service rifle").unit("Units").build());
        EquipmentType ammo = equipmentTypeRepository.save(EquipmentType.builder()
                .name("5.56mm Ammunition").category("Ammunition").description("Standard NATO cartridge").unit("Rounds").build());
        EquipmentType comms = equipmentTypeRepository.save(EquipmentType.builder()
                .name("Encrypted VHF Radio").category("Communication Equipment").description("Secure tactical radio transceiver").unit("Sets").build());
        EquipmentType medical = equipmentTypeRepository.save(EquipmentType.builder()
                .name("Field Trauma Kit").category("Medical Equipment").description("Emergency medical responder pack").unit("Kits").build());

        // 4. Users
        User adminUser = userRepository.save(User.builder()
                .username("admin")
                .email("admin@test.com")
                .password(passwordEncoder.encode("Admin@123"))
                .fullName("Gen. Arthur Vance")
                .role(adminRole)
                .base(null)
                .enabled(true)
                .build());

        User commanderAlphaUser = userRepository.save(User.builder()
                .username("commander_alpha")
                .email("commander.alpha@test.com")
                .password(passwordEncoder.encode("Commander@123"))
                .fullName("Col. Sarah Connor")
                .role(commanderRole)
                .base(baseAlpha)
                .enabled(true)
                .build());

        userRepository.save(User.builder()
                .username("commander_bravo")
                .email("commander.bravo@test.com")
                .password(passwordEncoder.encode("Commander@123"))
                .fullName("Col. James Rhodes")
                .role(commanderRole)
                .base(baseBravo)
                .enabled(true)
                .build());

        User logisticsUser = userRepository.save(User.builder()
                .username("logistics")
                .email("logistics@test.com")
                .password(passwordEncoder.encode("Logistics@123"))
                .fullName("Maj. Roy Mustang")
                .role(roleRepository.findByName(RoleName.LOGISTICS_OFFICER).orElse(adminRole))
                .base(baseAlpha)
                .enabled(true)
                .build());

        // 5. Assets Stock
        Asset alphaVehicle = assetRepository.save(Asset.builder().base(baseAlpha).equipmentType(vehicle).quantity(120).availableQuantity(95).assignedQuantity(20).expendedQuantity(5).build());
        Asset alphaAmmo = assetRepository.save(Asset.builder().base(baseAlpha).equipmentType(ammo).quantity(5000).availableQuantity(4100).assignedQuantity(400).expendedQuantity(500).build());
        Asset alphaWeapon = assetRepository.save(Asset.builder().base(baseAlpha).equipmentType(weapon).quantity(350).availableQuantity(290).assignedQuantity(60).expendedQuantity(0).build());

        assetRepository.save(Asset.builder().base(baseBravo).equipmentType(vehicle).quantity(80).availableQuantity(70).assignedQuantity(10).expendedQuantity(0).build());
        assetRepository.save(Asset.builder().base(baseBravo).equipmentType(comms).quantity(150).availableQuantity(120).assignedQuantity(30).expendedQuantity(0).build());

        assetRepository.save(Asset.builder().base(baseCharlie).equipmentType(medical).quantity(200).availableQuantity(170).assignedQuantity(10).expendedQuantity(20).build());

        // 6. Purchases
        purchaseRepository.save(Purchase.builder()
                .base(baseAlpha).equipmentType(vehicle).quantity(50)
                .purchaseDate(LocalDate.now().minusDays(20))
                .vendor("Oshkosh Defense").referenceNumber("PO-2026-001")
                .createdBy(adminUser).build());

        Purchase p2 = purchaseRepository.save(Purchase.builder()
                .base(baseAlpha).equipmentType(ammo).quantity(3000)
                .purchaseDate(LocalDate.now().minusDays(15))
                .vendor("Munitions Corp").referenceNumber("PO-2026-002")
                .createdBy(logisticsUser).build());

        purchaseRepository.save(Purchase.builder()
                .base(baseBravo).equipmentType(comms).quantity(100)
                .purchaseDate(LocalDate.now().minusDays(10))
                .vendor("Harris Systems").referenceNumber("PO-2026-003")
                .createdBy(logisticsUser).build());

        // 7. Transfers
        Transfer t1 = transferRepository.save(Transfer.builder()
                .fromBase(baseAlpha).toBase(baseBravo).equipmentType(vehicle).quantity(15)
                .transferDate(LocalDate.now().minusDays(8))
                .status("COMPLETED").referenceNumber("TRF-2026-001")
                .initiatedBy(logisticsUser).build());

        transferRepository.save(Transfer.builder()
                .fromBase(baseAlpha).toBase(baseCharlie).equipmentType(weapon).quantity(25)
                .transferDate(LocalDate.now().minusDays(4))
                .status("COMPLETED").referenceNumber("TRF-2026-002")
                .initiatedBy(adminUser).build());

        // 8. Assignments
        assignmentRepository.save(Assignment.builder()
                .asset(alphaVehicle).personnelName("Capt. John Miller").personnelId("MIL-8842").quantity(2)
                .assignedDate(LocalDate.now().minusDays(5)).assignedBy(commanderAlphaUser).status("ASSIGNED").build());

        assignmentRepository.save(Assignment.builder()
                .asset(alphaWeapon).personnelName("Sgt. Marcus Fenix").personnelId("SQD-1024").quantity(5)
                .assignedDate(LocalDate.now().minusDays(3)).assignedBy(commanderAlphaUser).status("ASSIGNED").build());

        // 9. Expenditures
        expenditureRepository.save(Expenditure.builder()
                .asset(alphaAmmo).equipmentType(ammo).quantity(500)
                .reason("Live Fire Tactical Drill Target Practice")
                .expenditureDate(LocalDate.now().minusDays(2))
                .recordedBy(commanderAlphaUser).build());

        // 10. Audit Logs
        auditLogRepository.save(AuditLog.builder()
                .user(adminUser).username(adminUser.getUsername()).action("SYSTEM_INIT").entityType("SYSTEM").entityId(1L)
                .description("System initial seed completed").ipAddress("127.0.0.1").timestamp(LocalDateTime.now().minusDays(25)).build());

        auditLogRepository.save(AuditLog.builder()
                .user(logisticsUser).username(logisticsUser.getUsername()).action("PURCHASE_CREATED").entityType("PURCHASE").entityId(p2.getId())
                .description("Purchased 3000 5.56mm Ammunition for Base Alpha").ipAddress("127.0.0.1").timestamp(LocalDateTime.now().minusDays(15)).build());

        auditLogRepository.save(AuditLog.builder()
                .user(logisticsUser).username(logisticsUser.getUsername()).action("TRANSFER_CREATED").entityType("TRANSFER").entityId(t1.getId())
                .description("Transferred 15 Tactical Transport Vehicle from Base Alpha to Base Bravo").ipAddress("127.0.0.1").timestamp(LocalDateTime.now().minusDays(8)).build());

        log.info("Database seeding completed successfully.");
    }
}
