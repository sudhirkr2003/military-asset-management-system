package com.military.assetmanagement.repository;

import com.military.assetmanagement.entity.Transfer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface TransferRepository extends JpaRepository<Transfer, Long> {
    List<Transfer> findByFromBaseIdOrToBaseId(Long fromBaseId, Long toBaseId);

    @Query("SELECT t FROM Transfer t WHERE (:baseId IS NULL OR t.fromBase.id = :baseId OR t.toBase.id = :baseId) " +
           "AND (:equipmentTypeId IS NULL OR t.equipmentType.id = :equipmentTypeId) " +
           "AND (:fromDate IS NULL OR t.transferDate >= :fromDate) " +
           "AND (:toDate IS NULL OR t.transferDate <= :toDate) " +
           "ORDER BY t.transferDate DESC, t.id DESC")
    List<Transfer> findFilteredTransfers(
            @Param("baseId") Long baseId,
            @Param("equipmentTypeId") Long equipmentTypeId,
            @Param("fromDate") LocalDate fromDate,
            @Param("toDate") LocalDate toDate);
}
