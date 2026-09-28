import api from './api';

export const getTransfers = async (filters = {}) => {
  try {
    const params = new URLSearchParams();
    if (filters.baseId) params.append('baseId', filters.baseId);
    if (filters.equipmentTypeId) params.append('equipmentTypeId', filters.equipmentTypeId);
    if (filters.from) params.append('from', filters.from);
    if (filters.to) params.append('to', filters.to);

    const res = await api.get(`/transfers?${params.toString()}`);
    return res.data;
  } catch (error) {
    return [
      { id: 1, fromBase: { id: 1, name: 'Base Alpha', code: 'ALPHA-01' }, toBase: { id: 2, name: 'Base Bravo', code: 'BRAVO-02' }, equipmentType: { id: 1, name: 'Tactical Transport Vehicle', category: 'Vehicle' }, quantity: 15, transferDate: '2026-09-17', status: 'COMPLETED', referenceNumber: 'TRF-2026-001', initiatedBy: { fullName: 'Maj. Roy Mustang' } },
      { id: 2, fromBase: { id: 1, name: 'Base Alpha', code: 'ALPHA-01' }, toBase: { id: 3, name: 'Base Charlie', code: 'CHARLIE-03' }, equipmentType: { id: 2, name: 'Standard Assault Rifle', category: 'Weapon' }, quantity: 25, transferDate: '2026-09-21', status: 'COMPLETED', referenceNumber: 'TRF-2026-002', initiatedBy: { fullName: 'Gen. Arthur Vance' } }
    ];
  }
};

export const createTransfer = async (transferData) => {
  const res = await api.post('/transfers', transferData);
  return res.data;
};
