package com.military.assetmanagement.service;

import com.military.assetmanagement.entity.Asset;
import com.military.assetmanagement.entity.Base;
import com.military.assetmanagement.entity.EquipmentType;
import com.military.assetmanagement.exception.ResourceNotFoundException;
import com.military.assetmanagement.repository.AssetRepository;
import com.military.assetmanagement.repository.BaseRepository;
import com.military.assetmanagement.repository.EquipmentTypeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AssetService {

    private final AssetRepository assetRepository;
    private final BaseRepository baseRepository;
    private final EquipmentTypeRepository equipmentTypeRepository;

    public List<Asset> getAllAssets(Long baseId, Long equipmentTypeId) {
        if (baseId != null && equipmentTypeId != null) {
            return assetRepository.findByBaseIdAndEquipmentTypeId(baseId, equipmentTypeId)
                    .map(List::of)
                    .orElse(List.of());
        } else if (baseId != null) {
            return assetRepository.findByBaseId(baseId);
        } else if (equipmentTypeId != null) {
            return assetRepository.findByEquipmentTypeId(equipmentTypeId);
        }
        return assetRepository.findAll();
    }

    public Asset getAssetById(Long id) {
        return assetRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Asset not found with id: " + id));
    }

    public Asset getOrCreateAsset(Long baseId, Long equipmentTypeId) {
        return assetRepository.findByBaseIdAndEquipmentTypeId(baseId, equipmentTypeId)
                .orElseGet(() -> {
                    Base base = baseRepository.findById(baseId)
                            .orElseThrow(() -> new ResourceNotFoundException("Base not found with id: " + baseId));
                    EquipmentType equipmentType = equipmentTypeRepository.findById(equipmentTypeId)
                            .orElseThrow(() -> new ResourceNotFoundException("Equipment Type not found with id: " + equipmentTypeId));

                    Asset newAsset = Asset.builder()
                            .base(base)
                            .equipmentType(equipmentType)
                            .quantity(0)
                            .availableQuantity(0)
                            .assignedQuantity(0)
                            .expendedQuantity(0)
                            .build();
                    return assetRepository.save(newAsset);
                });
    }
}
