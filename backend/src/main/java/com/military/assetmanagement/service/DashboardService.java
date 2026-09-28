package com.military.assetmanagement.service;

import com.military.assetmanagement.dto.DashboardSummaryDto;
import com.military.assetmanagement.entity.*;
import com.military.assetmanagement.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class DashboardService {

    private final AssetRepository assetRepository;
    private final BaseRepository baseRepository;
    private final PurchaseRepository purchaseRepository;
    private final TransferRepository transferRepository;
    private final ExpenditureRepository expenditureRepository;

    public DashboardSummaryDto getDashboardSummary(Long baseId, Long equipmentTypeId, LocalDate fromDate, LocalDate toDate) {
        try {
            if (fromDate == null) {
                fromDate = LocalDate.now().minusDays(30);
            }
            if (toDate == null) {
                toDate = LocalDate.now();
            }

            List<Purchase> purchasesList = purchaseRepository.findFilteredPurchases(baseId, equipmentTypeId, fromDate, toDate);
            if (purchasesList == null) purchasesList = Collections.emptyList();

            List<Transfer> transfersList = transferRepository.findFilteredTransfers(baseId, equipmentTypeId, fromDate, toDate);
            if (transfersList == null) transfersList = Collections.emptyList();

            List<Expenditure> expendituresList = expenditureRepository.findFilteredExpenditures(baseId, equipmentTypeId, fromDate, toDate);
            if (expendituresList == null) expendituresList = Collections.emptyList();

            List<Asset> currentAssets = assetRepository.findAll();
            if (currentAssets == null) currentAssets = Collections.emptyList();

            int totalPurchases = purchasesList.stream()
                    .mapToInt(p -> safeInt(p.getQuantity()))
                    .sum();

            int totalTransferIn = 0;
            int totalTransferOut = 0;

            for (Transfer t : transfersList) {
                if (t != null && "COMPLETED".equalsIgnoreCase(t.getStatus())) {
                    int qty = safeInt(t.getQuantity());
                    if (baseId != null) {
                        if (t.getToBase() != null && Objects.equals(t.getToBase().getId(), baseId)) {
                            totalTransferIn += qty;
                        }
                        if (t.getFromBase() != null && Objects.equals(t.getFromBase().getId(), baseId)) {
                            totalTransferOut += qty;
                        }
                    } else {
                        totalTransferIn += qty;
                        totalTransferOut += qty;
                    }
                }
            }

            int totalExpended = expendituresList.stream()
                    .mapToInt(e -> safeInt(e.getQuantity()))
                    .sum();

            List<Asset> filteredCurrentAssets = currentAssets.stream()
                    .filter(a -> baseId == null || (a.getBase() != null && Objects.equals(a.getBase().getId(), baseId)))
                    .filter(a -> equipmentTypeId == null || (a.getEquipmentType() != null && Objects.equals(a.getEquipmentType().getId(), equipmentTypeId)))
                    .toList();

            int currentTotalQuantity = filteredCurrentAssets.stream()
                    .mapToInt(a -> safeInt(a.getQuantity()))
                    .sum();
            int currentAvailableQuantity = filteredCurrentAssets.stream()
                    .mapToInt(a -> safeInt(a.getAvailableQuantity()))
                    .sum();
            int currentAssignedQuantity = filteredCurrentAssets.stream()
                    .mapToInt(a -> safeInt(a.getAssignedQuantity()))
                    .sum();

            int netMovement = totalPurchases + totalTransferIn - totalTransferOut;
            int closingBalance = currentTotalQuantity;
            int openingBalance = Math.max(0, closingBalance - netMovement + totalExpended);

            List<Base> allBases = baseRepository.findAll();
            if (allBases == null) allBases = Collections.emptyList();

            List<DashboardSummaryDto.BaseInventorySummary> baseSummaries = new ArrayList<>();
            for (Base b : allBases) {
                if (b != null && (baseId == null || Objects.equals(b.getId(), baseId))) {
                    List<Asset> bAssets = currentAssets.stream()
                            .filter(a -> a.getBase() != null && Objects.equals(a.getBase().getId(), b.getId()))
                            .filter(a -> equipmentTypeId == null || (a.getEquipmentType() != null && Objects.equals(a.getEquipmentType().getId(), equipmentTypeId)))
                            .toList();

                    int bTotal = bAssets.stream().mapToInt(a -> safeInt(a.getQuantity())).sum();
                    int bAvail = bAssets.stream().mapToInt(a -> safeInt(a.getAvailableQuantity())).sum();
                    int bAssign = bAssets.stream().mapToInt(a -> safeInt(a.getAssignedQuantity())).sum();
                    int bExpend = bAssets.stream().mapToInt(a -> safeInt(a.getExpendedQuantity())).sum();

                    baseSummaries.add(DashboardSummaryDto.BaseInventorySummary.builder()
                            .baseId(b.getId())
                            .baseName(b.getName() != null ? b.getName() : "Base #" + b.getId())
                            .baseCode(b.getCode() != null ? b.getCode() : "N/A")
                            .totalQuantity(bTotal)
                            .availableQuantity(bAvail)
                            .assignedQuantity(bAssign)
                            .expendedQuantity(bExpend)
                            .build());
                }
            }

            Map<String, List<Asset>> byCategory = filteredCurrentAssets.stream()
                    .collect(Collectors.groupingBy(a -> (a.getEquipmentType() != null && a.getEquipmentType().getCategory() != null)
                            ? a.getEquipmentType().getCategory()
                            : "General"));

            List<DashboardSummaryDto.EquipmentCategorySummary> categorySummaries = new ArrayList<>();
            byCategory.forEach((cat, assets) -> {
                categorySummaries.add(DashboardSummaryDto.EquipmentCategorySummary.builder()
                        .category(cat)
                        .totalQuantity(assets.stream().mapToInt(a -> safeInt(a.getQuantity())).sum())
                        .availableQuantity(assets.stream().mapToInt(a -> safeInt(a.getAvailableQuantity())).sum())
                        .assignedQuantity(assets.stream().mapToInt(a -> safeInt(a.getAssignedQuantity())).sum())
                        .expendedQuantity(assets.stream().mapToInt(a -> safeInt(a.getExpendedQuantity())).sum())
                        .build());
            });

            List<DashboardSummaryDto.MovementTrendPoint> movementTrends = generateTrendPoints(
                    purchasesList, transfersList, expendituresList, fromDate, toDate);

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

        } catch (Exception ex) {
            log.error("Error computing dashboard summary", ex);
            return DashboardSummaryDto.builder()
                    .openingBalance(0)
                    .purchases(0)
                    .transferIn(0)
                    .transferOut(0)
                    .netMovement(0)
                    .assignedQuantity(0)
                    .expendedQuantity(0)
                    .closingBalance(0)
                    .totalAvailableQuantity(0)
                    .baseSummaries(Collections.emptyList())
                    .categorySummaries(Collections.emptyList())
                    .movementTrends(Collections.emptyList())
                    .build();
        }
    }

    private int safeInt(Integer value) {
        return value != null ? value : 0;
    }

    private List<DashboardSummaryDto.MovementTrendPoint> generateTrendPoints(
            List<Purchase> purchases, List<Transfer> transfers, List<Expenditure> expenditures,
            LocalDate fromDate, LocalDate toDate) {

        Map<String, DashboardSummaryDto.MovementTrendPoint> dateMap = new LinkedHashMap<>();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMM dd");

        LocalDate cur = fromDate;
        while (!cur.isAfter(toDate)) {
            String dateStr = cur.format(formatter);
            dateMap.put(dateStr, new DashboardSummaryDto.MovementTrendPoint(dateStr, 0, 0, 0));
            cur = cur.plusDays(1);
        }

        if (purchases != null) {
            for (Purchase p : purchases) {
                if (p != null && p.getPurchaseDate() != null) {
                    String d = p.getPurchaseDate().format(formatter);
                    if (dateMap.containsKey(d)) {
                        DashboardSummaryDto.MovementTrendPoint pt = dateMap.get(d);
                        pt.setPurchases(pt.getPurchases() + safeInt(p.getQuantity()));
                    }
                }
            }
        }

        if (transfers != null) {
            for (Transfer t : transfers) {
                if (t != null && t.getTransferDate() != null) {
                    String d = t.getTransferDate().format(formatter);
                    if (dateMap.containsKey(d)) {
                        DashboardSummaryDto.MovementTrendPoint pt = dateMap.get(d);
                        pt.setTransfers(pt.getTransfers() + safeInt(t.getQuantity()));
                    }
                }
            }
        }

        if (expenditures != null) {
            for (Expenditure e : expenditures) {
                if (e != null && e.getExpenditureDate() != null) {
                    String d = e.getExpenditureDate().format(formatter);
                    if (dateMap.containsKey(d)) {
                        DashboardSummaryDto.MovementTrendPoint pt = dateMap.get(d);
                        pt.setExpenditures(pt.getExpenditures() + safeInt(e.getQuantity()));
                    }
                }
            }
        }

        return new ArrayList<>(dateMap.values());
    }
}
