package com.military.assetmanagement.repository;

import com.military.assetmanagement.entity.Expenditure;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface ExpenditureRepository extends JpaRepository<Expenditure, Long> {
    List<Expenditure> findByAssetBaseId(Long baseId);

    @Query("SELECT e FROM Expenditure e WHERE (:baseId IS NULL OR e.asset.base.id = :baseId) " +
           "AND (:equipmentTypeId IS NULL OR e.equipmentType.id = :equipmentTypeId) " +
           "AND (:fromDate IS NULL OR e.expenditureDate >= :fromDate) " +
           "AND (:toDate IS NULL OR e.expenditureDate <= :toDate) " +
           "ORDER BY e.expenditureDate DESC, e.id DESC")
    List<Expenditure> findFilteredExpenditures(
            @Param("baseId") Long baseId,
            @Param("equipmentTypeId") Long equipmentTypeId,
            @Param("fromDate") LocalDate fromDate,
            @Param("toDate") LocalDate toDate);
}
