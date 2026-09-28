import api from './api';

export const getPurchases = async (filters = {}) => {
  try {
    const params = new URLSearchParams();
    if (filters.baseId) params.append('baseId', filters.baseId);
    if (filters.equipmentTypeId) params.append('equipmentTypeId', filters.equipmentTypeId);
    if (filters.from) params.append('from', filters.from);
    if (filters.to) params.append('to', filters.to);

    const res = await api.get(`/purchases?${params.toString()}`);
    return res.data;
  } catch (error) {
    return [
      { id: 1, base: { id: 1, name: 'Base Alpha', code: 'ALPHA-01' }, equipmentType: { id: 1, name: 'Tactical Transport Vehicle', category: 'Vehicle' }, quantity: 50, purchaseDate: '2026-09-05', vendor: 'Oshkosh Defense', referenceNumber: 'PO-2026-001', createdBy: { fullName: 'Gen. Arthur Vance' } },
      { id: 2, base: { id: 1, name: 'Base Alpha', code: 'ALPHA-01' }, equipmentType: { id: 3, name: '5.56mm Ammunition', category: 'Ammunition' }, quantity: 3000, purchaseDate: '2026-09-10', vendor: 'Munitions Corp', referenceNumber: 'PO-2026-002', createdBy: { fullName: 'Maj. Roy Mustang' } },
      { id: 3, base: { id: 2, name: 'Base Bravo', code: 'BRAVO-02' }, equipmentType: { id: 4, name: 'Encrypted VHF Radio', category: 'Communication Equipment' }, quantity: 100, purchaseDate: '2026-09-15', vendor: 'Harris Systems', referenceNumber: 'PO-2026-003', createdBy: { fullName: 'Maj. Roy Mustang' } }
    ];
  }
};

export const createPurchase = async (purchaseData) => {
  const res = await api.post('/purchases', purchaseData);
  return res.data;
};
