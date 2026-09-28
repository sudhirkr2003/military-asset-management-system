package com.military.assetmanagement.repository;

import com.military.assetmanagement.entity.Asset;
import com.military.assetmanagement.entity.Base;
import com.military.assetmanagement.entity.EquipmentType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface AssetRepository extends JpaRepository<Asset, Long> {
    Optional<Asset> findByBaseAndEquipmentType(Base base, EquipmentType equipmentType);
    Optional<Asset> findByBaseIdAndEquipmentTypeId(Long baseId, Long equipmentTypeId);
    List<Asset> findByBaseId(Long baseId);
    List<Asset> findByEquipmentTypeId(Long equipmentTypeId);
}
