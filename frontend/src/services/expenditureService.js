import api from './api';

export const getExpenditures = async (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.baseId) params.append('baseId', filters.baseId);
  if (filters.equipmentTypeId) params.append('equipmentTypeId', filters.equipmentTypeId);
  if (filters.from) params.append('from', filters.from);
  if (filters.to) params.append('to', filters.to);

  const res = await api.get(`/expenditures?${params.toString()}`);
  return res.data;
};

export const createExpenditure = async (expenditureData) => {
  const res = await api.post('/expenditures', expenditureData);
  return res.data;
};
