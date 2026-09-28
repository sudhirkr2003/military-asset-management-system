package com.military.assetmanagement.config;

import com.military.assetmanagement.entity.Role;
import com.military.assetmanagement.entity.RoleName;
import com.military.assetmanagement.repository.RoleRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {

    private final RoleRepository roleRepository;

    @Override
    public void run(String... args) throws Exception {
        if (roleRepository.count() == 0) {
            roleRepository.save(Role.builder().name(RoleName.ADMIN).build());
            roleRepository.save(Role.builder().name(RoleName.BASE_COMMANDER).build());
            roleRepository.save(Role.builder().name(RoleName.LOGISTICS_OFFICER).build());
        }
        log.info("DataSeeder completed (all automatic data seeding is completely disabled).");
    }
}
