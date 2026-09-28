import React, { useState, useEffect } from 'react';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { FileCode, Server, Key, Terminal } from 'lucide-react';

const Docs = () => {
  const [docData, setDocData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/docs')
      .then(res => {
        setDocData(res.data);
      })
      .catch(() => {
        setDocData({
          system: 'Military Asset Management System',
          version: '1.0.0',
          description: 'Role-based logistics and inventory tracking system across military bases.',
          roles: {
            'ADMIN': 'Full access to all bases, operations, and transaction audit logs',
            'BASE_COMMANDER': 'Access restricted to operations and inventory for assigned base',
            'LOGISTICS_OFFICER': 'Limited to purchases, inter-base transfers, and inventory viewing'
          },
          endpoints: [
            { method: 'POST', path: '/api/auth/login', frontendRoute: '/login', role: 'PUBLIC', description: 'Authenticate user credentials & return JWT bearer token' },
            { method: 'GET', path: '/api/dashboard', frontendRoute: '/dashboard', role: 'AUTHENTICATED', description: 'Calculate Opening/Closing balances, Net Movement breakdown & stock metrics' },
            { method: 'GET', path: '/api/purchases', frontendRoute: '/purchases', role: 'AUTHENTICATED', description: 'Get filtered purchase history table' },
            { method: 'POST', path: '/api/purchases', frontendRoute: '/purchases', role: 'ADMIN, LOGISTICS_OFFICER, BASE_COMMANDER', description: 'Record new asset purchase per base & update stock' },
            { method: 'GET', path: '/api/transfers', frontendRoute: '/transfers', role: 'AUTHENTICATED', description: 'Get inter-base transfer movement history timeline' },
            { method: 'POST', path: '/api/transfers', frontendRoute: '/transfers', role: 'ADMIN, LOGISTICS_OFFICER, BASE_COMMANDER', description: 'Initiate transactional inter-base asset transfer (@Transactional)' },
            { method: 'GET', path: '/api/assignments', frontendRoute: '/assignments-expenditures', role: 'AUTHENTICATED', description: 'Get personnel asset assignments history' },
            { method: 'POST', path: '/api/assignments', frontendRoute: '/assignments-expenditures', role: 'ADMIN, BASE_COMMANDER', description: 'Assign equipment/asset to military personnel' },
            { method: 'PUT', path: '/api/assignments/:id/return', frontendRoute: '/assignments-expenditures', role: 'ADMIN, BASE_COMMANDER', description: 'Return assigned asset back to base stock' },
            { method: 'GET', path: '/api/expenditures', frontendRoute: '/assignments-expenditures', role: 'AUTHENTICATED', description: 'Get operational expenditures (consumption) history' },
            { method: 'POST', path: '/api/expenditures', frontendRoute: '/assignments-expenditures', role: 'ADMIN, BASE_COMMANDER, LOGISTICS_OFFICER', description: 'Record operational asset expenditure' },
            { method: 'GET', path: '/api/bases', frontendRoute: '/dashboard', role: 'AUTHENTICATED', description: 'List all military bases for dropdown filtering & selection' },
            { method: 'GET', path: '/api/equipment-types', frontendRoute: '/dashboard', role: 'AUTHENTICATED', description: 'List all equipment categories for dropdown filtering & selection' },
            { method: 'GET', path: '/api/assets', frontendRoute: '/dashboard', role: 'AUTHENTICATED', description: 'List current stock balance levels per base & category' },
            { method: 'GET', path: '/api/health', frontendRoute: '/docs', role: 'PUBLIC', description: 'Check live backend service health status (used for UptimeRobot monitoring)' },
            { method: 'GET', path: '/api/docs', frontendRoute: '/docs', role: 'PUBLIC', description: 'Get system API documentation JSON' }
          ]
        });
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const getMethodBadge = (method) => {
    switch (method) {
      case 'GET': return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30';
      case 'POST': return 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/30';
      case 'PUT': return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30';
      case 'DELETE': return 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30';
      default: return 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/30';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <FileCode className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            System API & Frontend Architecture Documentation
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 font-semibold">
            Complete mapping between Backend REST APIs, Frontend UI Pages, Role-Based Access Control, and functionality.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="http://localhost:8080/swagger-ui/index.html"
            target="_blank"
            rel="noreferrer"
            className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200 text-xs font-bold border border-slate-300 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5"
          >
            <Server className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Open Swagger / OpenAPI UI</span>
          </a>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner label="Loading System API Specifications..." />
      ) : docData ? (
        <div className="space-y-6">
          {/* RBAC Matrix Cards */}
          <div className="glass-panel p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-200 mb-3 flex items-center gap-2">
              <Key className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              Role-Based Access Control (RBAC) Matrix
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-amber-500/30">
                <div className="text-xs font-mono font-bold text-amber-700 dark:text-amber-400 uppercase mb-1">ADMIN</div>
                <p className="text-xs text-slate-700 dark:text-slate-300 font-semibold leading-relaxed">
                  Full system access across all military bases, purchases, transfers, assignments, expenditures, and audit logs.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-indigo-500/30">
                <div className="text-xs font-mono font-bold text-indigo-700 dark:text-indigo-400 uppercase mb-1">BASE COMMANDER</div>
                <p className="text-xs text-slate-700 dark:text-slate-300 font-semibold leading-relaxed">
                  Base scope. Manage personnel asset assignments, record base expenditures, and view base inventory & transfers.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-emerald-500/30">
                <div className="text-xs font-mono font-bold text-emerald-700 dark:text-emerald-400 uppercase mb-1">LOGISTICS OFFICER</div>
                <p className="text-xs text-slate-700 dark:text-slate-300 font-semibold leading-relaxed">
                  Logistics scope. Record new purchases, initiate transactional inter-base asset transfers, and view stock levels.
                </p>
              </div>
            </div>
          </div>

          {/* Endpoints Table */}
          <div className="glass-panel rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-200 flex items-center gap-2">
                <Terminal className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                Backend REST APIs & Frontend UI Route Specification ({docData.endpoints?.length})
              </h3>
              <span className="text-xs font-mono font-bold text-emerald-700 dark:text-emerald-400">Endpoint: /api/docs</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 dark:bg-slate-950 text-slate-800 dark:text-slate-400 font-mono uppercase text-[10px] tracking-wider border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="px-4 py-3.5">Method</th>
                    <th className="px-4 py-3.5">Backend REST Endpoint</th>
                    <th className="px-4 py-3.5">Frontend UI Route</th>
                    <th className="px-4 py-3.5">Role Required</th>
                    <th className="px-4 py-3.5">Exact Purpose / Function</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60 font-semibold">
                  {docData.endpoints?.map((ep, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="px-4 py-3.5">
                        <span className={`px-2 py-0.5 font-mono text-[10px] font-bold rounded-md border ${getMethodBadge(ep.method)}`}>
                          {ep.method}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 font-mono text-indigo-700 dark:text-indigo-400 font-bold">
                        {ep.path}
                      </td>
                      <td className="px-4 py-3.5 font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                        {ep.frontendRoute || ep.path}
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="font-mono text-[11px] text-amber-700 dark:text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded font-bold">
                          {ep.role}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-slate-800 dark:text-slate-300 font-semibold">
                        {ep.description}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default Docs;
