package com.military.assetmanagement.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardSummaryDto {
    private Integer openingBalance;
    private Integer purchases;
    private Integer transferIn;
    private Integer transferOut;
    private Integer netMovement;
    private Integer assignedQuantity;
    private Integer expendedQuantity;
    private Integer closingBalance;
    private Integer totalAvailableQuantity;

    private List<BaseInventorySummary> baseSummaries;
    private List<EquipmentCategorySummary> categorySummaries;
    private List<MovementTrendPoint> movementTrends;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class BaseInventorySummary {
        private Long baseId;
        private String baseName;
        private String baseCode;
        private Integer totalQuantity;
        private Integer availableQuantity;
        private Integer assignedQuantity;
        private Integer expendedQuantity;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class EquipmentCategorySummary {
        private String category;
        private Integer totalQuantity;
        private Integer availableQuantity;
        private Integer assignedQuantity;
        private Integer expendedQuantity;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MovementTrendPoint {
        private String date;
        private Integer purchases;
        private Integer transfers;
        private Integer expenditures;
    }
}
