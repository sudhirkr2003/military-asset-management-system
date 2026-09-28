package com.military.assetmanagement.service;

import com.military.assetmanagement.dto.DashboardSummaryDto;
import com.military.assetmanagement.entity.*;
import com.military.assetmanagement.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final AssetRepository assetRepository;
    private final BaseRepository baseRepository;
    private final PurchaseRepository purchaseRepository;
    private final TransferRepository transferRepository;
    private final ExpenditureRepository expenditureRepository;

    public DashboardSummaryDto getDashboardSummary(Long baseId, Long equipmentTypeId, LocalDate fromDate, LocalDate toDate) {
        if (fromDate == null) {
            fromDate = LocalDate.now().minusDays(30);
        }
        if (toDate == null) {
            toDate = LocalDate.now();
        }

        List<Purchase> purchasesList = purchaseRepository.findFilteredPurchases(baseId, equipmentTypeId, fromDate, toDate);
        List<Transfer> transfersList = transferRepository.findFilteredTransfers(baseId, equipmentTypeId, fromDate, toDate);
        List<Expenditure> expendituresList = expenditureRepository.findFilteredExpenditures(baseId, equipmentTypeId, fromDate, toDate);
        List<Asset> currentAssets = assetRepository.findAll();

        int totalPurchases = purchasesList.stream().mapToInt(Purchase::getQuantity).sum();
        
        int totalTransferIn = 0;
        int totalTransferOut = 0;

        for (Transfer t : transfersList) {
            if ("COMPLETED".equalsIgnoreCase(t.getStatus())) {
                if (baseId != null) {
                    if (t.getToBase().getId().equals(baseId)) {
                        totalTransferIn += t.getQuantity();
                    }
                    if (t.getFromBase().getId().equals(baseId)) {
                        totalTransferOut += t.getQuantity();
                    }
                } else {
                    totalTransferIn += t.getQuantity();
                    totalTransferOut += t.getQuantity();
                }
            }
        }

        int totalExpended = expendituresList.stream().mapToInt(Expenditure::getQuantity).sum();

        List<Asset> filteredCurrentAssets = currentAssets.stream()
                .filter(a -> baseId == null || a.getBase().getId().equals(baseId))
                .filter(a -> equipmentTypeId == null || a.getEquipmentType().getId().equals(equipmentTypeId))
                .collect(Collectors.toList());

        int currentTotalQuantity = filteredCurrentAssets.stream().mapToInt(Asset::getQuantity).sum();
        int currentAvailableQuantity = filteredCurrentAssets.stream().mapToInt(Asset::getAvailableQuantity).sum();
        int currentAssignedQuantity = filteredCurrentAssets.stream().mapToInt(Asset::getAssignedQuantity).sum();

        int netMovement = totalPurchases + totalTransferIn - totalTransferOut;
        int closingBalance = currentTotalQuantity;
        int openingBalance = Math.max(0, closingBalance - netMovement + totalExpended);

        List<Base> allBases = baseRepository.findAll();
        List<DashboardSummaryDto.BaseInventorySummary> baseSummaries = new ArrayList<>();
        for (Base b : allBases) {
            if (baseId == null || b.getId().equals(baseId)) {
                List<Asset> bAssets = currentAssets.stream()
                        .filter(a -> a.getBase().getId().equals(b.getId()))
                        .filter(a -> equipmentTypeId == null || a.getEquipmentType().getId().equals(equipmentTypeId))
                        .toList();

                int bTotal = bAssets.stream().mapToInt(Asset::getQuantity).sum();
                int bAvail = bAssets.stream().mapToInt(Asset::getAvailableQuantity).sum();
                int bAssign = bAssets.stream().mapToInt(Asset::getAssignedQuantity).sum();
                int bExpend = bAssets.stream().mapToInt(Asset::getExpendedQuantity).sum();

                baseSummaries.add(DashboardSummaryDto.BaseInventorySummary.builder()
                        .baseId(b.getId())
                        .baseName(b.getName())
                        .baseCode(b.getCode())
                        .totalQuantity(bTotal)
                        .availableQuantity(bAvail)
                        .assignedQuantity(bAssign)
                        .expendedQuantity(bExpend)
                        .build());
            }
        }

        Map<String, List<Asset>> byCategory = filteredCurrentAssets.stream()
                .collect(Collectors.groupingBy(a -> a.getEquipmentType().getCategory()));

        List<DashboardSummaryDto.EquipmentCategorySummary> categorySummaries = new ArrayList<>();
        byCategory.forEach((cat, assets) -> {
            categorySummaries.add(DashboardSummaryDto.EquipmentCategorySummary.builder()
                    .category(cat)
                    .totalQuantity(assets.stream().mapToInt(Asset::getQuantity).sum())
                    .availableQuantity(assets.stream().mapToInt(Asset::getAvailableQuantity).sum())
                    .assignedQuantity(assets.stream().mapToInt(Asset::getAssignedQuantity).sum())
                    .expendedQuantity(assets.stream().mapToInt(Asset::getExpendedQuantity).sum())
                    .build());
        });

        List<DashboardSummaryDto.MovementTrendPoint> movementTrends = generateTrendPoints(purchasesList, transfersList, expendituresList, fromDate, toDate, baseId);

        return DashboardSummaryDto.builder()
                .openingBalance(openingBalance)
                .purchases(totalPurchases)
                .transferIn(totalTransferIn)
                .transferOut(totalTransferOut)
                .netMovement(netMovement)
                .assignedQuantity(currentAssignedQuantity)
                .expendedQuantity(totalExpended)
                .closingBalance(closingBalance)
                .totalAvailableQuantity(currentAvailableQuantity)
                .baseSummaries(baseSummaries)
                .categorySummaries(categorySummaries)
                .movementTrends(movementTrends)
                .build();
    }

    private List<DashboardSummaryDto.MovementTrendPoint> generateTrendPoints(
            List<Purchase> purchases, List<Transfer> transfers, List<Expenditure> expenditures,
            LocalDate fromDate, LocalDate toDate, Long baseId) {

        Map<String, DashboardSummaryDto.MovementTrendPoint> dateMap = new LinkedHashMap<>();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMM dd");

        LocalDate cur = fromDate;
        while (!cur.isAfter(toDate)) {
            String dateStr = cur.format(formatter);
            dateMap.put(dateStr, new DashboardSummaryDto.MovementTrendPoint(dateStr, 0, 0, 0));
            cur = cur.plusDays(1);
        }

        for (Purchase p : purchases) {
            String d = p.getPurchaseDate().format(formatter);
            if (dateMap.containsKey(d)) {
                DashboardSummaryDto.MovementTrendPoint pt = dateMap.get(d);
                pt.setPurchases(pt.getPurchases() + p.getQuantity());
            }
        }

        for (Transfer t : transfers) {
            String d = t.getTransferDate().format(formatter);
            if (dateMap.containsKey(d)) {
                DashboardSummaryDto.MovementTrendPoint pt = dateMap.get(d);
                pt.setTransfers(pt.getTransfers() + t.getQuantity());
            }
        }

        for (Expenditure e : expenditures) {
            String d = e.getExpenditureDate().format(formatter);
            if (dateMap.containsKey(d)) {
                DashboardSummaryDto.MovementTrendPoint pt = dateMap.get(d);
                pt.setExpenditures(pt.getExpenditures() + e.getQuantity());
            }
        }

        return new ArrayList<>(dateMap.values());
    }
}
