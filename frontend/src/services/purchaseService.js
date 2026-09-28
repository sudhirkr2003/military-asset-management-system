import api from './api';

export const getPurchases = async (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.baseId) params.append('baseId', filters.baseId);
  if (filters.equipmentTypeId) params.append('equipmentTypeId', filters.equipmentTypeId);
  if (filters.from) params.append('from', filters.from);
  if (filters.to) params.append('to', filters.to);

  const res = await api.get(`/purchases?${params.toString()}`);
  return res.data;
};

export const createPurchase = async (purchaseData) => {
  const res = await api.post('/purchases', purchaseData);
  return res.data;
};
