package com.military.assetmanagement.repository;

import com.military.assetmanagement.entity.Assignment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface AssignmentRepository extends JpaRepository<Assignment, Long> {
    List<Assignment> findByAssetBaseId(Long baseId);

    @Query("SELECT a FROM Assignment a WHERE (:baseId IS NULL OR a.asset.base.id = :baseId) " +
           "AND (:equipmentTypeId IS NULL OR a.asset.equipmentType.id = :equipmentTypeId) " +
           "AND (:fromDate IS NULL OR a.assignedDate >= :fromDate) " +
           "AND (:toDate IS NULL OR a.assignedDate <= :toDate) " +
           "ORDER BY a.assignedDate DESC, a.id DESC")
    List<Assignment> findFilteredAssignments(
            @Param("baseId") Long baseId,
            @Param("equipmentTypeId") Long equipmentTypeId,
            @Param("fromDate") LocalDate fromDate,
            @Param("toDate") LocalDate toDate);
}
