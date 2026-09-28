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
    <div className="space-y-6">
      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold flex items-center gap-2.5">
          <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" /></svg>
          <span>{error}</span>
        </div>
      )}
      {/* Top Banner & Filters */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 glass-panel p-5 rounded-2xl border border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            Logistics Overview Dashboard
            <span className="px-2 py-0.5 text-xs font-mono font-semibold rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              Live Stock Feed
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">Real-time inventory movement, transfers, and balance audits across military bases.</p>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Base Filter */}
          <div className="relative">
            <select
              value={selectedBase}
              onChange={(e) => setSelectedBase(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-medium"
            >
              <option value="">All Bases (HQ)</option>
              {bases.map((b) => (
                <option key={b.id} value={b.id}>{b.name} ({b.code})</option>
              ))}
            </select>
          </div>

          {/* Equipment Filter */}
          <div className="relative">
            <select
              value={selectedEquipment}
              onChange={(e) => setSelectedEquipment(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-medium"
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
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-medium"
            placeholder="From"
          />
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-medium"
            placeholder="To"
          />
        </div>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : data ? (
        <>
          {/* Section 21 Dashboard Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Opening Balance */}
            <MetricCard
              title="Opening Balance"
              value={data.openingBalance}
              subtext="Inventory at start of period"
              icon={Layers}
              badgeText="PERIOD START"
              badgeColor="cyan"
              glowColor="cyan"
            />

            {/* Purchases */}
            <MetricCard
              title="Purchases"
              value={`+${data.purchases.toLocaleString()}`}
              subtext="Acquisitions from vendors"
              icon={ShoppingBag}
              badgeText="INFLOW"
              badgeColor="emerald"
              glowColor="emerald"
            />

            {/* Transfer In */}
            <MetricCard
              title="Transfer In"
              value={`+${data.transferIn.toLocaleString()}`}
              subtext="Received from other bases"
              icon={ArrowDownLeft}
              badgeText="INFLOW"
              badgeColor="indigo"
              glowColor="indigo"
            />

            {/* Transfer Out */}
            <MetricCard
              title="Transfer Out"
              value={`-${data.transferOut.toLocaleString()}`}
              subtext="Dispatched to other bases"
              icon={ArrowUpRight}
              badgeText="OUTFLOW"
              badgeColor="rose"
              glowColor="rose"
            />

            {/* Net Movement Card - CLICKABLE POPUP (Section 22) */}
            <MetricCard
              title="Net Movement"
              value={data.netMovement >= 0 ? `+${data.netMovement.toLocaleString()}` : data.netMovement.toLocaleString()}
              subtext="Click to view breakdown popup"
              icon={ArrowRightLeft}
              badgeText="CLICK FOR DETAILS"
              badgeColor={data.netMovement >= 0 ? "emerald" : "rose"}
              glowColor={data.netMovement >= 0 ? "emerald" : "rose"}
              onClick={() => setIsNetMovementModalOpen(true)}
            />

            {/* Assigned Quantity */}
            <MetricCard
              title="Assigned Stock"
              value={data.assignedQuantity}
              subtext="Currently deployed with personnel"
              icon={UserCheck}
              badgeText="DEPLOYED"
              badgeColor="amber"
              glowColor="amber"
            />

            {/* Expended Quantity */}
            <MetricCard
              title="Expended"
              value={data.expendedQuantity}
              subtext="Consumed during operations"
              icon={Flame}
              badgeText="CONSUMED"
              badgeColor="rose"
              glowColor="rose"
            />

            {/* Closing Balance */}
            <div className="glass-panel p-5 rounded-2xl border border-indigo-500/40 bg-gradient-to-br from-indigo-950/60 to-slate-900 shadow-2xl glow-indigo">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-300">Closing Balance</span>
                  <div className="text-3xl font-extrabold font-mono text-white mt-1">
                    {data.closingBalance.toLocaleString()}
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                  <Sparkles className="w-5 h-5 animate-pulse" />
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between text-xs text-indigo-200">
                <span>Current Total Active Inventory</span>
                <span className="px-2 py-0.5 font-mono text-[10px] font-bold rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  VERIFIED
                </span>
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Inventory Movement Trend Line Chart */}
            <div className="glass-panel p-5 rounded-2xl border border-slate-800">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-indigo-400" />
                  Inventory Movement Trends
                </h3>
                <span className="text-[11px] text-slate-400 font-mono">Daily Inflow / Outflow</span>
              </div>
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data.movementTrends}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="date" stroke="#64748b" tick={{ fontSize: 11 }} />
                    <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }} 
                    />
                    <Legend wrapperStyle={{ fontSize: '12px' }} />
                    <Line type="monotone" dataKey="purchases" stroke="#10b981" strokeWidth={2.5} name="Purchases" dot={{ r: 4 }} />
                    <Line type="monotone" dataKey="transfers" stroke="#6366f1" strokeWidth={2.5} name="Transfers" dot={{ r: 4 }} />
                    <Line type="monotone" dataKey="expenditures" stroke="#f43f5e" strokeWidth={2.5} name="Expenditures" dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Base Inventory Distribution Bar Chart */}
            <div className="glass-panel p-5 rounded-2xl border border-slate-800">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-emerald-400" />
                  Base Stock Levels Breakdown
                </h3>
                <span className="text-[11px] text-slate-400 font-mono">Available vs Assigned</span>
              </div>
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.baseSummaries}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="baseName" stroke="#64748b" tick={{ fontSize: 11 }} />
                    <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }} 
                    />
                    <Legend wrapperStyle={{ fontSize: '12px' }} />
                    <Bar dataKey="availableQuantity" fill="#10b981" name="Available Stock" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="assignedQuantity" fill="#f59e0b" name="Assigned" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="expendedQuantity" fill="#f43f5e" name="Expended" radius={[6, 6, 0, 0]} />
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
