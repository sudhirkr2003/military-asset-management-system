import React from 'react';
import Modal from './Modal';
import { ArrowDownLeft, ArrowUpRight, ShoppingBag, ArrowRightLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const NetMovementModal = ({ isOpen, onClose, metrics }) => {
  const navigate = useNavigate();

  if (!metrics) return null;

  const { purchases = 0, transferIn = 0, transferOut = 0, netMovement = 0 } = metrics;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Net Inventory Movement Details" maxWidth="max-w-md">
      <div className="space-y-4">
        <p className="text-xs text-slate-400">
          Breakdown of total inventory inflows and outflows recorded for the selected operational period.
        </p>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl divide-y divide-slate-800/80">
          {/* Purchases */}
          <div className="flex items-center justify-between p-3.5">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <div className="text-sm font-medium text-slate-200">Purchases</div>
                <div className="text-xs text-slate-400">New equipment acquisitions</div>
              </div>
            </div>
            <span className="font-mono text-sm font-semibold text-emerald-400">+{purchases.toLocaleString()}</span>
          </div>

          {/* Transfer In */}
          <div className="flex items-center justify-between p-3.5">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <ArrowDownLeft className="w-4 h-4" />
              </div>
              <div>
                <div className="text-sm font-medium text-slate-200">Transfer In</div>
                <div className="text-xs text-slate-400">Stock received from other bases</div>
              </div>
            </div>
            <span className="font-mono text-sm font-semibold text-indigo-400">+{transferIn.toLocaleString()}</span>
          </div>

          {/* Transfer Out */}
          <div className="flex items-center justify-between p-3.5">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20">
                <ArrowUpRight className="w-4 h-4" />
              </div>
              <div>
                <div className="text-sm font-medium text-slate-200">Transfer Out</div>
                <div className="text-xs text-slate-400">Stock transferred to other bases</div>
              </div>
            </div>
            <span className="font-mono text-sm font-semibold text-rose-400">-{transferOut.toLocaleString()}</span>
          </div>
        </div>

        {/* Net Movement Total */}
        <div className="p-4 rounded-xl bg-gradient-to-r from-slate-900 to-indigo-950/60 border border-indigo-500/30 flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-indigo-300">Total Net Movement</div>
            <div className="text-xs text-slate-400">Formula: Purchases + Transfer In - Transfer Out</div>
          </div>
          <div className={`font-mono text-xl font-bold ${netMovement >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {netMovement >= 0 ? `+${netMovement.toLocaleString()}` : netMovement.toLocaleString()}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={() => {
              onClose();
              navigate('/transfers');
            }}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-colors flex items-center gap-2 shadow-lg shadow-indigo-600/30"
          >
            <ArrowRightLeft className="w-3.5 h-3.5" />
            View Transfer Records
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default NetMovementModal;
