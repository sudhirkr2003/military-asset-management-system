import React, { useState, useEffect } from 'react';
import { getErrorMessage } from '../utils/errorHandler';
import { getAssignments, createAssignment } from '../services/assignmentService';
import { getExpenditures, createExpenditure } from '../services/expenditureService';
import { getAssets } from '../services/assetService';
import { useAuth } from '../context/AuthContext';
import { canAssignAssets, canRecordExpenditure } from '../utils/permissions';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import LoadingSpinner from '../components/LoadingSpinner';
import { UserCheck, Flame, Plus, User, AlertCircle, Layers } from 'lucide-react';

const AssignmentsExpenditures = ({ initialTab = 'assignments' }) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState(initialTab);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);
  const [assignments, setAssignments] = useState([]);
  const [expenditures, setExpenditures] = useState([]);
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal States
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isExpendModalOpen, setIsExpendModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Form States
  const [assignForm, setAssignForm] = useState({
    assetId: '',
    personnelName: '',
    personnelId: '',
    quantity: 1,
    assignedDate: new Date().toISOString().split('T')[0]
  });

  const [expendForm, setExpendForm] = useState({
    assetId: '',
    quantity: 10,
    reason: '',
    expenditureDate: new Date().toISOString().split('T')[0]
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const [assignList, expendList, assetList] = await Promise.all([
        getAssignments(),
        getExpenditures(),
        getAssets()
      ]);
      setAssignments(assignList);
      setExpenditures(expendList);
      setAssets(assetList);
      if (assetList.length > 0) {
        setAssignForm(prev => ({ ...prev, assetId: assetList[0].id }));
        setExpendForm(prev => ({ ...prev, assetId: assetList[0].id }));
      }
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to load records.'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAssignSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      await createAssignment({
        assetId: Number(assignForm.assetId),
        personnelName: assignForm.personnelName,
        personnelId: assignForm.personnelId,
        quantity: Number(assignForm.quantity),
        assignedDate: assignForm.assignedDate
      });
      setIsAssignModalOpen(false);
      loadData();
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to create assignment. Please try again.'));
    } finally {
      setSubmitting(false);
    }
  };

  const selectedExpendAsset = assets.find(a => a.id === Number(expendForm.assetId));
  const availQty = selectedExpendAsset ? selectedExpendAsset.availableQuantity : 0;
  const reqQty = Number(expendForm.quantity) || 0;
  const isExpendValid = reqQty > 0 && reqQty <= availQty;

  const handleExpendSubmit = async (e) => {
    e.preventDefault();
    if (!isExpendValid) {
      setError(`Insufficient available quantity. Available: ${availQty}, Requested: ${reqQty}`);
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      await createExpenditure({
        assetId: Number(expendForm.assetId),
        quantity: reqQty,
        reason: expendForm.reason,
        expenditureDate: expendForm.expenditureDate
      });
      setIsExpendModalOpen(false);
      loadData();
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to record expenditure. Please try again.'));
    } finally {
      setSubmitting(false);
    }
  };

  const assignmentColumns = [
    { 
      header: 'Personnel Name & ID', 
      render: (r) => (
        <div>
          <div className="font-bold text-slate-900 dark:text-slate-200 flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            {r.personnelName}
          </div>
          <span className="text-[10px] font-mono text-amber-700 dark:text-amber-400 bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.2 rounded font-bold">
            ID: {r.personnelId}
          </span>
        </div>
      )
    },
    { 
      header: 'Assigned Asset', 
      render: (r) => (
        <div>
          <div className="font-bold text-slate-900 dark:text-slate-200">{r.asset?.equipmentType?.name || 'Assault Rifle'}</div>
          <span className="text-[10px] text-slate-600 dark:text-slate-400 font-mono font-semibold">{r.asset?.base?.name}</span>
        </div>
      )
    },
    { 
      header: 'Quantity', 
      render: (r) => <span className="font-mono text-slate-900 dark:text-slate-100 font-extrabold">{r.quantity}</span> 
    },
    { 
      header: 'Assigned Date', 
      render: (r) => <span className="font-mono text-slate-600 dark:text-slate-400 font-medium">{r.assignedDate}</span> 
    },
    { 
      header: 'Assigned By', 
      render: (r) => <span className="text-xs text-slate-600 dark:text-slate-400 font-semibold">{r.assignedBy?.fullName || 'Commander'}</span> 
    },
  ];

  const expenditureColumns = [
    { 
      header: 'Equipment Type', 
      render: (r) => (
        <div>
          <div className="font-bold text-slate-900 dark:text-slate-200">{r.equipmentType?.name || 'Ammunition'}</div>
          <span className="text-[10px] font-mono text-slate-600 dark:text-slate-400 font-semibold">{r.asset?.base?.name}</span>
        </div>
      )
    },
    { 
      header: 'Quantity Expended', 
      render: (r) => (
        <span className="font-mono text-rose-600 dark:text-rose-400 font-extrabold bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded">
          -{r.quantity?.toLocaleString()}
        </span>
      )
    },
    { 
      header: 'Reason', 
      render: (r) => <span className="text-slate-800 dark:text-slate-300 font-medium">{r.reason}</span> 
    },
    { 
      header: 'Expenditure Date', 
      render: (r) => <span className="font-mono text-slate-600 dark:text-slate-400 font-medium">{r.expenditureDate}</span> 
    },
    { 
      header: 'Recorded By', 
      render: (r) => <span className="text-xs text-slate-600 dark:text-slate-400 font-semibold">{r.recordedBy?.fullName || 'Commander'}</span> 
    },
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header & Section Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 bg-white dark:bg-slate-950/80 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
        <div>
          <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            Assignments &amp; Expenditures Management
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 sm:mt-1 font-semibold">
            Assign assets to military personnel and record operational expenditures.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
          {canAssignAssets(user) && (
            <button
              onClick={() => {
                setAssignForm({
                  assetId: assets[0]?.id || '',
                  personnelName: '',
                  personnelId: `MIL-${Math.floor(1000 + Math.random() * 9000)}`,
                  quantity: 1,
                  assignedDate: new Date().toISOString().split('T')[0]
                });
                setIsAssignModalOpen(true);
              }}
              className="w-full sm:w-auto justify-center px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-extrabold uppercase tracking-wider shadow-md shadow-amber-600/20 flex items-center gap-1.5 transition-all shrink-0"
            >
              <Plus className="w-4 h-4" />
              Assign Asset
            </button>
          )}

          {canRecordExpenditure(user) && (
            <button
              onClick={() => {
                setExpendForm({
                  assetId: assets[0]?.id || '',
                  quantity: 50,
                  reason: 'Training Exercise',
                  expenditureDate: new Date().toISOString().split('T')[0]
                });
                setIsExpendModalOpen(true);
              }}
              className="w-full sm:w-auto justify-center px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-extrabold uppercase tracking-wider shadow-md shadow-rose-600/20 flex items-center gap-1.5 transition-all shrink-0"
            >
              <Plus className="w-4 h-4" />
              Record Expenditure
            </button>
          )}
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 font-semibold text-xs">
        <button
          onClick={() => setActiveTab('assignments')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
            activeTab === 'assignments'
              ? 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/40 font-bold shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span>Personnel Assignments ({assignments.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('expenditures')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
            activeTab === 'expenditures'
              ? 'bg-rose-500/15 text-rose-700 dark:text-rose-400 border border-rose-500/40 font-bold shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Flame className="w-4 h-4" />
          <span>Expended Assets ({expenditures.length})</span>
        </button>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : activeTab === 'assignments' ? (
        <DataTable
          columns={assignmentColumns}
          data={assignments}
          searchPlaceholder="Search assignments by personnel name or ID..."
        />
      ) : (
        <DataTable
          columns={expenditureColumns}
          data={expenditures}
          searchPlaceholder="Search expenditures by reason or equipment..."
        />
      )}

      {/* Modal: Assign Asset */}
      <Modal isOpen={isAssignModalOpen} onClose={() => setIsAssignModalOpen(false)} title="Assign Asset to Personnel">
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleAssignSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-400 uppercase font-mono mb-1">Select Asset Pool</label>
            <select
              value={assignForm.assetId}
              onChange={(e) => setAssignForm({ ...assignForm, assetId: e.target.value })}
              className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-slate-200 focus:outline-none focus:border-indigo-500 font-semibold"
              required
            >
              {assets.map(a => (
                <option key={a.id} value={a.id}>
                  {a.equipmentType?.name} - {a.base?.name} (Available: {a.availableQuantity})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-400 uppercase font-mono mb-1">Personnel Full Name</label>
              <input
                type="text"
                placeholder="e.g. Capt. John Miller"
                value={assignForm.personnelName}
                onChange={(e) => setAssignForm({ ...assignForm, personnelName: e.target.value })}
                className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-slate-200 focus:outline-none focus:border-indigo-500 font-semibold"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-400 uppercase font-mono mb-1">Personnel ID / Service #</label>
              <input
                type="text"
                placeholder="e.g. MIL-8842"
                value={assignForm.personnelId}
                onChange={(e) => setAssignForm({ ...assignForm, personnelId: e.target.value })}
                className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-slate-200 focus:outline-none focus:border-indigo-500 font-semibold"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-400 uppercase font-mono mb-1">Quantity</label>
              <input
                type="number"
                min="1"
                value={assignForm.quantity}
                onChange={(e) => setAssignForm({ ...assignForm, quantity: e.target.value })}
                className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-slate-200 focus:outline-none focus:border-indigo-500 font-semibold"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-400 uppercase font-mono mb-1">Assignment Date</label>
              <input
                type="date"
                value={assignForm.assignedDate}
                onChange={(e) => setAssignForm({ ...assignForm, assignedDate: e.target.value })}
                className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-slate-200 focus:outline-none focus:border-indigo-500 font-semibold"
                required
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setIsAssignModalOpen(false)}
              className="px-4 py-2 text-xs font-bold rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 text-xs font-bold rounded-xl bg-amber-600 text-white hover:bg-amber-500 shadow-md shadow-amber-600/30"
            >
              {submitting ? 'Assigning...' : 'Confirm Assignment'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal: Record Expenditure */}
      <Modal isOpen={isExpendModalOpen} onClose={() => setIsExpendModalOpen(false)} title="Record Asset Expenditure">
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleExpendSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-400 uppercase font-mono mb-1">Select Asset Pool</label>
            <select
              value={expendForm.assetId}
              onChange={(e) => setExpendForm({ ...expendForm, assetId: e.target.value })}
              className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-slate-200 focus:outline-none focus:border-indigo-500 font-semibold"
              required
            >
              {assets.map(a => (
                <option key={a.id} value={a.id}>
                  {a.equipmentType?.name} - {a.base?.name} (Available: {a.availableQuantity})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-400 uppercase font-mono mb-1">Quantity Expended</label>
              <input
                type="number"
                min="1"
                value={expendForm.quantity}
                onChange={(e) => setExpendForm({ ...expendForm, quantity: e.target.value })}
                className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-slate-200 focus:outline-none focus:border-indigo-500 font-semibold"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-400 uppercase font-mono mb-1">Expenditure Date</label>
              <input
                type="date"
                value={expendForm.expenditureDate}
                onChange={(e) => setExpendForm({ ...expendForm, expenditureDate: e.target.value })}
                className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-slate-200 focus:outline-none focus:border-indigo-500 font-semibold"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-400 uppercase font-mono mb-1">Reason / Operational Details</label>
            <textarea
              rows="3"
              placeholder="e.g. Live Fire Tactical Drill, Field Exercise..."
              value={expendForm.reason}
              onChange={(e) => setExpendForm({ ...expendForm, reason: e.target.value })}
              className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl p-3 text-xs text-slate-900 dark:text-slate-200 focus:outline-none focus:border-indigo-500 font-semibold"
              required
            ></textarea>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setIsExpendModalOpen(false)}
              className="px-4 py-2 text-xs font-bold rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 text-xs font-bold rounded-xl bg-rose-600 text-white hover:bg-rose-500 shadow-md shadow-rose-600/30"
            >
              {submitting ? 'Recording...' : 'Record Expenditure'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AssignmentsExpenditures;
