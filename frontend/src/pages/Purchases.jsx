import React, { useState, useEffect } from 'react';
import { getPurchases, createPurchase } from '../services/purchaseService';
import { getBases, getEquipmentTypes } from '../services/assetService';
import { useAuth } from '../context/AuthContext';
import { canManagePurchases } from '../utils/permissions';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import LoadingSpinner from '../components/LoadingSpinner';
import { ShoppingBag, Plus, Calendar, Building2, Tag, Hash, Truck } from 'lucide-react';

const Purchases = () => {
  const { user } = useAuth();
  const [purchases, setPurchases] = useState([]);
  const [bases, setBases] = useState([]);
  const [equipmentTypes, setEquipmentTypes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    baseId: '',
    equipmentTypeId: '',
    quantity: 1,
    purchaseDate: new Date().toISOString().split('T')[0],
    vendor: '',
    referenceNumber: ''
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const [pList, bList, eList] = await Promise.all([
        getPurchases(),
        getBases(),
        getEquipmentTypes()
      ]);
      setPurchases(pList);
      setBases(bList);
      setEquipmentTypes(eList);
      if (bList.length > 0) setFormData(prev => ({ ...prev, baseId: bList[0].id }));
      if (eList.length > 0) setFormData(prev => ({ ...prev, equipmentTypeId: eList[0].id }));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      const payload = {
        baseId: Number(formData.baseId),
        equipmentTypeId: Number(formData.equipmentTypeId),
        quantity: Number(formData.quantity),
        purchaseDate: formData.purchaseDate,
        vendor: formData.vendor,
        referenceNumber: formData.referenceNumber || `PO-${Date.now().toString().slice(-6)}`
      };
      await createPurchase(payload);
      setIsModalOpen(false);
      loadData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to record purchase transaction');
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    { 
      header: 'Reference #', 
      render: (r) => <span className="font-mono text-indigo-400 font-semibold">{r.referenceNumber}</span> 
    },
    { 
      header: 'Base', 
      render: (r) => (
        <span className="font-semibold text-slate-200">
          {r.base?.name || 'Base Alpha'}
        </span>
      )
    },
    { 
      header: 'Equipment', 
      render: (r) => (
        <div>
          <div className="font-semibold text-slate-200">{r.equipmentType?.name}</div>
          <span className="text-[10px] font-mono text-slate-400">{r.equipmentType?.category}</span>
        </div>
      )
    },
    { 
      header: 'Quantity', 
      render: (r) => (
        <span className="font-mono text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
          +{r.quantity?.toLocaleString()}
        </span>
      )
    },
    { 
      header: 'Vendor', 
      render: (r) => <span className="text-slate-300 font-medium">{r.vendor}</span> 
    },
    { 
      header: 'Purchase Date', 
      render: (r) => <span className="font-mono text-slate-400">{r.purchaseDate}</span> 
    },
    { 
      header: 'Recorded By', 
      render: (r) => <span className="text-xs text-slate-400">{r.createdBy?.fullName || 'Logistics Officer'}</span> 
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-5 rounded-2xl border border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-emerald-400" />
            Asset Purchases & Acquisitions
          </h2>
          <p className="text-xs text-slate-400 mt-1">Track procurement of military equipment and vendor purchase orders.</p>
        </div>

        {canManagePurchases(user) && (
          <button
            onClick={() => {
              setFormData({
                baseId: bases[0]?.id || '',
                equipmentTypeId: equipmentTypes[0]?.id || '',
                quantity: 10,
                purchaseDate: new Date().toISOString().split('T')[0],
                vendor: '',
                referenceNumber: `PO-${Date.now().toString().slice(-6)}`
              });
              setIsModalOpen(true);
            }}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white text-xs font-semibold uppercase tracking-wider shadow-lg shadow-emerald-600/30 flex items-center gap-2 transition-all"
          >
            <Plus className="w-4 h-4" />
            Record Purchase
          </button>
        )}
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <DataTable
          columns={columns}
          data={purchases}
          searchPlaceholder="Search purchases by PO, vendor, base..."
        />
      )}

      {/* Record Purchase Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Record New Purchase Transaction">
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase font-mono mb-1">Target Base</label>
              <select
                value={formData.baseId}
                onChange={(e) => setFormData({ ...formData, baseId: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                required
              >
                {bases.map(b => (
                  <option key={b.id} value={b.id}>{b.name} ({b.code})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase font-mono mb-1">Equipment Type</label>
              <select
                value={formData.equipmentTypeId}
                onChange={(e) => setFormData({ ...formData, equipmentTypeId: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                required
              >
                {equipmentTypes.map(e => (
                  <option key={e.id} value={e.id}>{e.name} ({e.category})</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase font-mono mb-1">Quantity</label>
              <input
                type="number"
                min="1"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase font-mono mb-1">Purchase Date</label>
              <input
                type="date"
                value={formData.purchaseDate}
                onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase font-mono mb-1">Vendor / Supplier</label>
            <input
              type="text"
              placeholder="e.g. Oshkosh Defense Inc."
              value={formData.vendor}
              onChange={(e) => setFormData({ ...formData, vendor: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase font-mono mb-1">PO Reference Number</label>
            <input
              type="text"
              placeholder="PO-2026-XXXX"
              value={formData.referenceNumber}
              onChange={(e) => setFormData({ ...formData, referenceNumber: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              required
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-emerald-600 text-white hover:bg-emerald-500 shadow-lg shadow-emerald-600/30"
            >
              {submitting ? 'Recording...' : 'Confirm Purchase'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Purchases;
