import api from './api';

export const getDashboardSummary = async (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.baseId) params.append('baseId', filters.baseId);
  if (filters.equipmentTypeId) params.append('equipmentTypeId', filters.equipmentTypeId);
  if (filters.from) params.append('from', filters.from);
  if (filters.to) params.append('to', filters.to);

  const response = await api.get(`/dashboard?${params.toString()}`);
  return response.data;
};
