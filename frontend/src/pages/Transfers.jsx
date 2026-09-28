import React, { useState, useEffect } from 'react';
import { getErrorMessage } from '../utils/errorHandler';
import { getTransfers, createTransfer } from '../services/transferService';
import { getBases, getEquipmentTypes, getAssets } from '../services/assetService';
import { useAuth } from '../context/AuthContext';
import { canManageTransfers } from '../utils/permissions';
import Modal from '../components/Modal';
import LoadingSpinner from '../components/LoadingSpinner';
import { ArrowRightLeft, Plus, ArrowRight, ShieldCheck, AlertCircle, Building2, Package } from 'lucide-react';

const Transfers = () => {
  const { user } = useAuth();
  const [transfers, setTransfers] = useState([]);
  const [bases, setBases] = useState([]);
  const [equipmentTypes, setEquipmentTypes] = useState([]);
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    fromBaseId: '',
    toBaseId: '',
    equipmentTypeId: '',
    quantity: 1,
    transferDate: new Date().toISOString().split('T')[0],
    referenceNumber: ''
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const [tList, bList, eList, aList] = await Promise.all([
        getTransfers(),
        getBases(),
        getEquipmentTypes(),
        getAssets()
      ]);
      setTransfers(tList);
      setBases(bList);
      setEquipmentTypes(eList);
      setAssets(aList);
      if (bList.length > 1) {
        setFormData(prev => ({
          ...prev,
          fromBaseId: bList[0].id,
          toBaseId: bList[1].id
        }));
      }
      if (eList.length > 0) setFormData(prev => ({ ...prev, equipmentTypeId: eList[0].id }));
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to load transfer records.'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Compute available stock at source base
  const selectedSourceAsset = assets.find(
    a => a.base?.id === Number(formData.fromBaseId) && a.equipmentType?.id === Number(formData.equipmentTypeId)
  );
  const availableQtyAtSource = selectedSourceAsset ? selectedSourceAsset.availableQuantity : 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.fromBaseId === formData.toBaseId) {
      setError('Source Base and Destination Base cannot be identical');
      return;
    }

    if (formData.quantity > availableQtyAtSource && availableQtyAtSource > 0) {
      setError(`Insufficient stock at source base. Available: ${availableQtyAtSource}, Requested: ${formData.quantity}`);
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        fromBaseId: Number(formData.fromBaseId),
        toBaseId: Number(formData.toBaseId),
        equipmentTypeId: Number(formData.equipmentTypeId),
        quantity: Number(formData.quantity),
        transferDate: formData.transferDate,
        referenceNumber: formData.referenceNumber || `TRF-${Date.now().toString().slice(-6)}`
      };
      await createTransfer(payload);
      setIsModalOpen(false);
      loadData();
    } catch (err) {
      setError(getErrorMessage(err, 'Transfer operation failed. Please verify stock availability.'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-5 rounded-2xl border border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <ArrowRightLeft className="w-5 h-5 text-indigo-400" />
            Inter-Base Asset Transfers
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Reallocate inventory stock between bases with automated transactional stock adjustments.
          </p>
        </div>

        {canManageTransfers(user) && (
          <button
            onClick={() => {
              setFormData({
                fromBaseId: bases[0]?.id || '',
                toBaseId: bases[1]?.id || '',
                equipmentTypeId: equipmentTypes[0]?.id || '',
                quantity: 5,
                transferDate: new Date().toISOString().split('T')[0],
                referenceNumber: `TRF-${Date.now().toString().slice(-6)}`
              });
              setIsModalOpen(true);
            }}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white text-xs font-semibold uppercase tracking-wider shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition-all"
          >
            <Plus className="w-4 h-4" />
            Create Transfer
          </button>
        )}
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between px-2 text-xs font-mono font-semibold uppercase tracking-wider text-slate-400">
            <span>Transfer Transaction Log</span>
            <span>{transfers.length} Total Completed Transfers</span>
          </div>

          {/* Section 24 Visual Flow History Cards */}
          <div className="grid grid-cols-1 gap-4">
            {transfers.map((t) => (
              <div 
                key={t.id}
                className="glass-panel p-5 rounded-2xl border border-slate-800 hover:border-indigo-500/40 transition-all flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl"
              >
                {/* Visual Flow: Source ---> Equipment Quantity ---> Destination */}
                <div className="flex items-center gap-4 w-full md:w-auto">
                  {/* Source Base */}
                  <div className="text-center p-3 rounded-xl bg-slate-950 border border-slate-800 min-w-[120px]">
                    <div className="text-[10px] uppercase font-mono text-slate-500 font-semibold">From</div>
                    <div className="text-xs font-bold text-slate-200 mt-0.5">{t.fromBase?.name}</div>
                    <div className="text-[10px] font-mono text-indigo-400">{t.fromBase?.code}</div>
                  </div>

                  {/* Transfer Flow Line */}
                  <div className="flex-1 flex flex-col items-center justify-center px-4">
                    <div className="text-xs font-mono font-bold text-emerald-400 flex items-center gap-1.5 mb-1 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
                      <Package className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{t.quantity?.toLocaleString()} {t.equipmentType?.name}</span>
                    </div>
                    <div className="w-full h-0.5 bg-gradient-to-r from-indigo-500 via-emerald-400 to-indigo-500 relative flex items-center justify-center">
                      <ArrowRight className="w-4 h-4 text-emerald-400 absolute right-0 -top-1.5" />
                    </div>
                  </div>

                  {/* Destination Base */}
                  <div className="text-center p-3 rounded-xl bg-slate-950 border border-slate-800 min-w-[120px]">
                    <div className="text-[10px] uppercase font-mono text-slate-500 font-semibold">To</div>
                    <div className="text-xs font-bold text-slate-200 mt-0.5">{t.toBase?.name}</div>
                    <div className="text-[10px] font-mono text-indigo-400">{t.toBase?.code}</div>
                  </div>
                </div>

                {/* Transfer Metadata */}
                <div className="flex items-center gap-6 border-t md:border-t-0 md:border-l border-slate-800 pt-3 md:pt-0 md:pl-6 w-full md:w-auto justify-between md:justify-end">
                  <div className="text-left">
                    <div className="text-[10px] font-mono text-slate-500 uppercase">Reference #</div>
                    <div className="text-xs font-mono font-semibold text-indigo-400">{t.referenceNumber}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">By: {t.initiatedBy?.fullName || 'Logistics Officer'}</div>
                  </div>

                  <div className="text-right">
                    <span className="px-2.5 py-1 text-[10px] font-mono font-semibold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" />
                      COMPLETED
                    </span>
                    <div className="text-[11px] font-mono text-slate-500 mt-1">{t.transferDate}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Create Transfer Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Initiate Inter-Base Asset Transfer">
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase font-mono mb-1">From Base (Source)</label>
              <select
                value={formData.fromBaseId}
                onChange={(e) => setFormData({ ...formData, fromBaseId: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                required
              >
                {bases.map(b => (
                  <option key={b.id} value={b.id}>{b.name} ({b.code})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase font-mono mb-1">To Base (Destination)</label>
              <select
                value={formData.toBaseId}
                onChange={(e) => setFormData({ ...formData, toBaseId: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                required
              >
                {bases.map(b => (
                  <option key={b.id} value={b.id}>{b.name} ({b.code})</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase font-mono mb-1">Equipment</label>
              <select
                value={formData.equipmentTypeId}
                onChange={(e) => setFormData({ ...formData, equipmentTypeId: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                required
              >
                {equipmentTypes.map(e => (
                  <option key={e.id} value={e.id}>{e.name}</option>
                ))}
              </select>
            </div>

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
          </div>

          {/* Stock availability banner */}
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-400">Available Stock at Source Base:</span>
            <span className={`font-mono font-bold ${availableQtyAtSource >= formData.quantity ? 'text-emerald-400' : 'text-rose-400'}`}>
              {availableQtyAtSource.toLocaleString()} Units Available
            </span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase font-mono mb-1">Reference Number</label>
            <input
              type="text"
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
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg shadow-indigo-600/30"
            >
              {submitting ? 'Processing Transfer...' : 'Execute Transfer'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Transfers;
