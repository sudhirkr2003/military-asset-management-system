import api from './api';

export const getAssignments = async (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.baseId) params.append('baseId', filters.baseId);
  if (filters.equipmentTypeId) params.append('equipmentTypeId', filters.equipmentTypeId);
  if (filters.from) params.append('from', filters.from);
  if (filters.to) params.append('to', filters.to);

  const res = await api.get(`/assignments?${params.toString()}`);
  return res.data;
};

export const createAssignment = async (assignmentData) => {
  const res = await api.post('/assignments', assignmentData);
  return res.data;
};

export const returnAssignment = async (assignmentId) => {
  const res = await api.put(`/assignments/${assignmentId}/return`);
  return res.data;
};
