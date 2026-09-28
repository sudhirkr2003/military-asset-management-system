import React, { useState, useEffect } from 'react';
import { getErrorMessage } from '../utils/errorHandler';
import { getDashboardSummary } from '../services/dashboardService';
import { getBases, getEquipmentTypes } from '../services/assetService';
import MetricCard from '../components/MetricCard';
import NetMovementModal from '../components/NetMovementModal';
import LoadingSpinner from '../components/LoadingSpinner';
import { 
  Building2, 
  Package, 
  Calendar, 
  TrendingUp, 
  ShoppingBag, 
  ArrowDownLeft, 
  ArrowUpRight, 
  ArrowRightLeft, 
  UserCheck, 
  Flame, 
  Layers,
  Sparkles,
  Info
} from 'lucide-react';
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend 
} from 'recharts';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [bases, setBases] = useState([]);
  const [equipmentTypes, setEquipmentTypes] = useState([]);

  // Filters
  const [selectedBase, setSelectedBase] = useState('');
  const [selectedEquipment, setSelectedEquipment] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  // Net Movement Modal trigger
  const [isNetMovementModalOpen, setIsNetMovementModalOpen] = useState(false);

  const fetchDashboard = async () => {
    setLoading(true);
    setError('');
    try {
      const summary = await getDashboardSummary({
        baseId: selectedBase || null,
        equipmentTypeId: selectedEquipment || null,
        from: fromDate || null,
        to: toDate || null,
      });
      setData(summary);
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to load dashboard data. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    Promise.all([getBases(), getEquipmentTypes()])
      .then(([bList, eList]) => {
        setBases(bList);
        setEquipmentTypes(eList);
      })
      .catch((err) => {
        setError(getErrorMessage(err, 'Failed to load filter options.'));
      });
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [selectedBase, selectedEquipment, fromDate, toDate]);

  return (
    <div className="space-y-4">
      {error && (
        <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
          <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" /></svg>
          <span>{error}</span>
        </div>
      )}
      {/* Top Banner & Filters */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 glass-panel p-4 rounded-xl border border-slate-200">
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            Logistics Overview
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">Inventory balances, transfers, and command stock levels.</p>
        </div>

        {/* Filter Controls */}
        <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2 w-full lg:w-auto">
          {/* Base Filter */}
          <div className="relative w-full sm:w-auto">
            <select
              value={selectedBase}
              onChange={(e) => setSelectedBase(e.target.value)}
              className="w-full sm:w-auto bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-indigo-500 font-medium"
            >
              <option value="">All Bases (HQ)</option>
              {bases.map((b) => (
                <option key={b.id} value={b.id}>{b.name} ({b.code})</option>
              ))}
            </select>
          </div>

          {/* Equipment Filter */}
          <div className="relative w-full sm:w-auto">
            <select
              value={selectedEquipment}
              onChange={(e) => setSelectedEquipment(e.target.value)}
              className="w-full sm:w-auto bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-indigo-500 font-medium"
            >
              <option value="">All Equipment</option>
              {equipmentTypes.map((e) => (
                <option key={e.id} value={e.id}>{e.name}</option>
              ))}
            </select>
          </div>

          {/* Date Range Filters */}
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="w-full sm:w-auto bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-indigo-500 font-medium"
            placeholder="From"
          />
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="w-full sm:w-auto bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-indigo-500 font-medium"
            placeholder="To"
          />
        </div>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : data ? (
        <>
          {/* Dashboard Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {/* Opening Balance */}
            <MetricCard
              title="Opening Balance"
              value={data.openingBalance}
              subtext="At start of period"
              icon={Layers}
              badgeColor="cyan"
              glowColor="cyan"
            />

            {/* Purchases */}
            <MetricCard
              title="Purchases"
              value={`+${data.purchases.toLocaleString()}`}
              subtext="Acquisitions"
              icon={ShoppingBag}
              badgeText="Inflow"
              badgeColor="emerald"
              glowColor="emerald"
            />

            {/* Transfer In */}
            <MetricCard
              title="Transfer In"
              value={`+${data.transferIn.toLocaleString()}`}
              subtext="Received from bases"
              icon={ArrowDownLeft}
              badgeText="Inflow"
              badgeColor="indigo"
              glowColor="indigo"
            />

            {/* Transfer Out */}
            <MetricCard
              title="Transfer Out"
              value={`-${data.transferOut.toLocaleString()}`}
              subtext="Dispatched to bases"
              icon={ArrowUpRight}
              badgeText="Outflow"
              badgeColor="rose"
              glowColor="rose"
            />

            {/* Net Movement Card - CLICKABLE POPUP */}
            <MetricCard
              title="Net Movement"
              value={data.netMovement >= 0 ? `+${data.netMovement.toLocaleString()}` : data.netMovement.toLocaleString()}
              subtext="Click to view breakdown"
              icon={ArrowRightLeft}
              badgeText={data.netMovement >= 0 ? "+Net" : "-Net"}
              badgeColor={data.netMovement >= 0 ? "emerald" : "rose"}
              glowColor={data.netMovement >= 0 ? "emerald" : "rose"}
              onClick={() => setIsNetMovementModalOpen(true)}
            />

            {/* Assigned Quantity */}
            <MetricCard
              title="Assigned Stock"
              value={data.assignedQuantity}
              subtext="Issued to personnel"
              icon={UserCheck}
              badgeText="Assigned"
              badgeColor="amber"
              glowColor="amber"
            />

            {/* Expended Quantity */}
            <MetricCard
              title="Expended"
              value={data.expendedQuantity}
              subtext="Consumed in operations"
              icon={Flame}
              badgeText="Expended"
              badgeColor="rose"
              glowColor="rose"
            />

            {/* Closing Balance */}
            <div className="p-4 sm:p-5 rounded-xl border border-indigo-200 bg-indigo-50/70 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-indigo-900">Closing Balance</span>
                  <div className="text-xl sm:text-2xl font-bold font-mono text-indigo-950 mt-0.5 sm:mt-1">
                    {data.closingBalance.toLocaleString()}
                  </div>
                </div>
                <div className="p-2 rounded-lg bg-indigo-100 text-indigo-700">
                  <Sparkles className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-2.5 flex items-center justify-between text-[11px] sm:text-xs text-indigo-700">
                <span>Active Inventory</span>
                <span className="px-1.5 py-0.5 font-mono text-[9px] font-bold rounded bg-indigo-100 text-indigo-800 border border-indigo-200">
                  Verified
                </span>
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Inventory Movement Trend Line Chart */}
            <div className="glass-panel p-4 sm:p-5 rounded-2xl border border-slate-200">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <h3 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-1.5 sm:gap-2">
                  <TrendingUp className="w-4 h-4 text-indigo-600" />
                  Inventory Movement Trends
                </h3>
                <span className="text-[10px] sm:text-[11px] text-slate-500 font-mono">Daily Inflow / Outflow</span>
              </div>
              <div className="h-60 sm:h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data.movementTrends}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="date" stroke="#64748b" tick={{ fontSize: 11 }} />
                    <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', borderRadius: '12px', fontSize: '12px', color: '#0f172a', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }} 
                    />
                    <Legend wrapperStyle={{ fontSize: '11px' }} />
                    <Line type="monotone" dataKey="purchases" stroke="#10b981" strokeWidth={2.5} name="Purchases" dot={{ r: 3 }} />
                    <Line type="monotone" dataKey="transfers" stroke="#6366f1" strokeWidth={2.5} name="Transfers" dot={{ r: 3 }} />
                    <Line type="monotone" dataKey="expenditures" stroke="#f43f5e" strokeWidth={2.5} name="Expenditures" dot={{ r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Base Inventory Distribution Bar Chart */}
            <div className="glass-panel p-4 sm:p-5 rounded-2xl border border-slate-200">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <h3 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-1.5 sm:gap-2">
                  <Building2 className="w-4 h-4 text-emerald-600" />
                  Base Stock Levels Breakdown
                </h3>
                <span className="text-[10px] sm:text-[11px] text-slate-500 font-mono">Available vs Assigned</span>
              </div>
              <div className="h-60 sm:h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.baseSummaries}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="baseName" stroke="#64748b" tick={{ fontSize: 11 }} />
                    <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', borderRadius: '12px', fontSize: '12px', color: '#0f172a', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }} 
                    />
                    <Legend wrapperStyle={{ fontSize: '11px' }} />
                    <Bar dataKey="availableQuantity" fill="#10b981" name="Available Stock" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="assignedQuantity" fill="#f59e0b" name="Assigned" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="expendedQuantity" fill="#f43f5e" name="Expended" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </>
      ) : null}

      {/* Net Movement Popup Modal (Section 22) */}
      <NetMovementModal
        isOpen={isNetMovementModalOpen}
        onClose={() => setIsNetMovementModalOpen(false)}
        metrics={data}
      />
    </div>
  );
};

export default Dashboard;
