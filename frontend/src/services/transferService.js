import api from './api';

export const getTransfers = async (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.baseId) params.append('baseId', filters.baseId);
  if (filters.equipmentTypeId) params.append('equipmentTypeId', filters.equipmentTypeId);
  if (filters.from) params.append('from', filters.from);
  if (filters.to) params.append('to', filters.to);

  const res = await api.get(`/transfers?${params.toString()}`);
  return res.data;
};

export const createTransfer = async (transferData) => {
  const res = await api.post('/transfers', transferData);
  return res.data;
};
