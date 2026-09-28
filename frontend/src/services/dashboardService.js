import api from './api';

export const getDashboardSummary = async (filters = {}) => {
  try {
    const params = new URLSearchParams();
    if (filters.baseId) params.append('baseId', filters.baseId);
    if (filters.equipmentTypeId) params.append('equipmentTypeId', filters.equipmentTypeId);
    if (filters.from) params.append('from', filters.from);
    if (filters.to) params.append('to', filters.to);

    const response = await api.get(`/dashboard?${params.toString()}`);
    return response.data;
  } catch (error) {
    // Fallback Mock Data for preview
    return {
      openingBalance: 1250,
      purchases: 120,
      transferIn: 80,
      transferOut: 40,
      netMovement: 160,
      assignedQuantity: 150,
      expendedQuantity: 30,
      closingBalance: 1380,
      totalAvailableQuantity: 1230,
      baseSummaries: [
        { baseId: 1, baseName: 'Base Alpha', baseCode: 'ALPHA-01', totalQuantity: 5470, availableQuantity: 4485, assignedQuantity: 480, expendedQuantity: 505 },
        { baseId: 2, baseName: 'Base Bravo', baseCode: 'BRAVO-02', totalQuantity: 230, availableQuantity: 190, assignedQuantity: 40, expendedQuantity: 0 },
        { baseId: 3, baseName: 'Base Charlie', baseCode: 'CHARLIE-03', totalQuantity: 200, availableQuantity: 170, assignedQuantity: 10, expendedQuantity: 20 },
      ],
      categorySummaries: [
        { category: 'Vehicle', totalQuantity: 200, availableQuantity: 165, assignedQuantity: 30, expendedQuantity: 5 },
        { category: 'Weapon', totalQuantity: 350, availableQuantity: 290, assignedQuantity: 60, expendedQuantity: 0 },
        { category: 'Ammunition', totalQuantity: 5000, availableQuantity: 4100, assignedQuantity: 400, expendedQuantity: 500 },
        { category: 'Communication Equipment', totalQuantity: 150, availableQuantity: 120, assignedQuantity: 30, expendedQuantity: 0 },
        { category: 'Medical Equipment', totalQuantity: 200, availableQuantity: 170, assignedQuantity: 10, expendedQuantity: 20 }
      ],
      movementTrends: [
        { date: 'Sep 18', purchases: 20, transfers: 5, expenditures: 0 },
        { date: 'Sep 19', purchases: 0, transfers: 15, expenditures: 50 },
        { date: 'Sep 20', purchases: 50, transfers: 0, expenditures: 0 },
        { date: 'Sep 21', purchases: 0, transfers: 25, expenditures: 10 },
        { date: 'Sep 22', purchases: 10, transfers: 0, expenditures: 0 },
        { date: 'Sep 23', purchases: 30, transfers: 10, expenditures: 20 },
        { date: 'Sep 24', purchases: 10, transfers: 25, expenditures: 500 }
      ]
    };
  }
};
