package com.military.assetmanagement.repository;

import com.military.assetmanagement.entity.Base;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface BaseRepository extends JpaRepository<Base, Long> {
    Optional<Base> findByCode(String code);
    Optional<Base> findByName(String name);
}
