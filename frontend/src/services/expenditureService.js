import api from './api';

export const getExpenditures = async (filters = {}) => {
  try {
    const params = new URLSearchParams();
    if (filters.baseId) params.append('baseId', filters.baseId);
    if (filters.equipmentTypeId) params.append('equipmentTypeId', filters.equipmentTypeId);
    if (filters.from) params.append('from', filters.from);
    if (filters.to) params.append('to', filters.to);

    const res = await api.get(`/expenditures?${params.toString()}`);
    return res.data;
  } catch (error) {
    return [
      { id: 1, asset: { base: { name: 'Base Alpha' } }, equipmentType: { name: '5.56mm Ammunition', category: 'Ammunition' }, quantity: 500, reason: 'Live Fire Tactical Drill Target Practice', expenditureDate: '2026-09-23', recordedBy: { fullName: 'Col. Sarah Connor' } }
    ];
  }
};

export const createExpenditure = async (expenditureData) => {
  const res = await api.post('/expenditures', expenditureData);
  return res.data;
};
