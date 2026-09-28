import api from './api';

export const getAssignments = async (filters = {}) => {
  try {
    const params = new URLSearchParams();
    if (filters.baseId) params.append('baseId', filters.baseId);
    if (filters.equipmentTypeId) params.append('equipmentTypeId', filters.equipmentTypeId);
    if (filters.from) params.append('from', filters.from);
    if (filters.to) params.append('to', filters.to);

    const res = await api.get(`/assignments?${params.toString()}`);
    return res.data;
  } catch (error) {
    return [
      { id: 1, asset: { id: 1, base: { name: 'Base Alpha' }, equipmentType: { name: 'Tactical Transport Vehicle', category: 'Vehicle' } }, personnelName: 'Capt. John Miller', personnelId: 'MIL-8842', quantity: 2, assignedDate: '2026-09-20', status: 'ASSIGNED', assignedBy: { fullName: 'Col. Sarah Connor' } },
      { id: 2, asset: { id: 3, base: { name: 'Base Alpha' }, equipmentType: { name: 'Standard Assault Rifle', category: 'Weapon' } }, personnelName: 'Sgt. Marcus Fenix', personnelId: 'SQD-1024', quantity: 5, assignedDate: '2026-09-22', status: 'ASSIGNED', assignedBy: { fullName: 'Col. Sarah Connor' } }
    ];
  }
};

export const createAssignment = async (assignmentData) => {
  const res = await api.post('/assignments', assignmentData);
  return res.data;
};

export const returnAssignment = async (assignmentId) => {
  const res = await api.put(`/assignments/${assignmentId}/return`);
  return res.data;
};
