import api from './api';

export const getAssets = async (baseId, equipmentTypeId) => {
  const params = new URLSearchParams();
  if (baseId) params.append('baseId', baseId);
  if (equipmentTypeId) params.append('equipmentTypeId', equipmentTypeId);
  const res = await api.get(`/assets?${params.toString()}`);
  return res.data;
};

export const getBases = async () => {
  const res = await api.get('/bases');
  return res.data;
};

export const getEquipmentTypes = async () => {
  const res = await api.get('/equipment-types');
  return res.data;
};
