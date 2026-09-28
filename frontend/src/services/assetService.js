import api from './api';

export const getAssets = async (baseId, equipmentTypeId) => {
  try {
    const params = new URLSearchParams();
    if (baseId) params.append('baseId', baseId);
    if (equipmentTypeId) params.append('equipmentTypeId', equipmentTypeId);
    const res = await api.get(`/assets?${params.toString()}`);
    return res.data;
  } catch (error) {
    return [
      { id: 1, base: { id: 1, name: 'Base Alpha', code: 'ALPHA-01' }, equipmentType: { id: 1, name: 'Tactical Transport Vehicle', category: 'Vehicle', unit: 'Units' }, quantity: 120, availableQuantity: 95, assignedQuantity: 20, expendedQuantity: 5 },
      { id: 2, base: { id: 1, name: 'Base Alpha', code: 'ALPHA-01' }, equipmentType: { id: 3, name: '5.56mm Ammunition', category: 'Ammunition', unit: 'Rounds' }, quantity: 5000, availableQuantity: 4100, assignedQuantity: 400, expendedQuantity: 500 },
      { id: 3, base: { id: 1, name: 'Base Alpha', code: 'ALPHA-01' }, equipmentType: { id: 2, name: 'Standard Assault Rifle', category: 'Weapon', unit: 'Units' }, quantity: 350, availableQuantity: 290, assignedQuantity: 60, expendedQuantity: 0 },
      { id: 4, base: { id: 2, name: 'Base Bravo', code: 'BRAVO-02' }, equipmentType: { id: 1, name: 'Tactical Transport Vehicle', category: 'Vehicle', unit: 'Units' }, quantity: 80, availableQuantity: 70, assignedQuantity: 10, expendedQuantity: 0 },
      { id: 5, base: { id: 2, name: 'Base Bravo', code: 'BRAVO-02' }, equipmentType: { id: 4, name: 'Encrypted VHF Radio', category: 'Communication Equipment', unit: 'Sets' }, quantity: 150, availableQuantity: 120, assignedQuantity: 30, expendedQuantity: 0 },
      { id: 6, base: { id: 3, name: 'Base Charlie', code: 'CHARLIE-03' }, equipmentType: { id: 5, name: 'Field Trauma Kit', category: 'Medical Equipment', unit: 'Kits' }, quantity: 200, availableQuantity: 170, assignedQuantity: 10, expendedQuantity: 20 }
    ];
  }
};

export const getBases = async () => {
  try {
    const res = await api.get('/bases');
    return res.data;
  } catch (error) {
    return [
      { id: 1, name: 'Base Alpha', location: 'Delhi Tactical Zone', code: 'ALPHA-01' },
      { id: 2, name: 'Base Bravo', location: 'Mumbai Naval Station', code: 'BRAVO-02' },
      { id: 3, name: 'Base Charlie', location: 'Pune Defense Depot', code: 'CHARLIE-03' }
    ];
  }
};

export const getEquipmentTypes = async () => {
  try {
    const res = await api.get('/equipment-types');
    return res.data;
  } catch (error) {
    return [
      { id: 1, name: 'Tactical Transport Vehicle', category: 'Vehicle', unit: 'Units' },
      { id: 2, name: 'Standard Assault Rifle', category: 'Weapon', unit: 'Units' },
      { id: 3, name: '5.56mm Ammunition', category: 'Ammunition', unit: 'Rounds' },
      { id: 4, name: 'Encrypted VHF Radio', category: 'Communication Equipment', unit: 'Sets' },
      { id: 5, name: 'Field Trauma Kit', category: 'Medical Equipment', unit: 'Kits' }
    ];
  }
};
