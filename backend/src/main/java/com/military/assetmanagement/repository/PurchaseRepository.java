package com.military.assetmanagement.repository;

import com.military.assetmanagement.entity.Purchase;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface PurchaseRepository extends JpaRepository<Purchase, Long> {
    List<Purchase> findByBaseId(Long baseId);
    List<Purchase> findByEquipmentTypeId(Long equipmentTypeId);
    List<Purchase> findByBaseIdAndEquipmentTypeId(Long baseId, Long equipmentTypeId);

    @Query("SELECT p FROM Purchase p WHERE (:baseId IS NULL OR p.base.id = :baseId) " +
           "AND (:equipmentTypeId IS NULL OR p.equipmentType.id = :equipmentTypeId) " +
           "AND (:fromDate IS NULL OR p.purchaseDate >= :fromDate) " +
           "AND (:toDate IS NULL OR p.purchaseDate <= :toDate) " +
           "ORDER BY p.purchaseDate DESC, p.id DESC")
    List<Purchase> findFilteredPurchases(
            @Param("baseId") Long baseId,
            @Param("equipmentTypeId") Long equipmentTypeId,
            @Param("fromDate") LocalDate fromDate,
            @Param("toDate") LocalDate toDate);
}
