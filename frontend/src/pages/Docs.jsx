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
            { method: 'POST', path: '/api/transfers', frontendRoute: '/transfers', role: 'ADMIN, LOGISTICS_OFFICER, BASE_COMMANDER', description: 'Initiate transactional inter-base asset transfer' },
            { method: 'GET', path: '/api/assignments', frontendRoute: '/assignments-expenditures', role: 'AUTHENTICATED', description: 'Get personnel asset assignments history' },
            { method: 'POST', path: '/api/assignments', frontendRoute: '/assignments-expenditures', role: 'ADMIN, BASE_COMMANDER', description: 'Assign equipment/asset to military personnel' },
            { method: 'PUT', path: '/api/assignments/:id/return', frontendRoute: '/assignments-expenditures', role: 'ADMIN, BASE_COMMANDER', description: 'Return assigned asset back to base stock' },
            { method: 'GET', path: '/api/expenditures', frontendRoute: '/assignments-expenditures', role: 'AUTHENTICATED', description: 'Get operational expenditures history' },
            { method: 'POST', path: '/api/expenditures', frontendRoute: '/assignments-expenditures', role: 'ADMIN, BASE_COMMANDER, LOGISTICS_OFFICER', description: 'Record operational asset expenditure' },
            { method: 'GET', path: '/api/bases', frontendRoute: '/dashboard', role: 'AUTHENTICATED', description: 'List all military bases for dropdown filtering & selection' },
            { method: 'GET', path: '/api/equipment-types', frontendRoute: '/dashboard', role: 'AUTHENTICATED', description: 'List all equipment categories for dropdown filtering' },
            { method: 'GET', path: '/api/assets', frontendRoute: '/dashboard', role: 'AUTHENTICATED', description: 'List current stock balance levels per base & category' },
            { method: 'GET', path: '/api/health', frontendRoute: '/docs', role: 'PUBLIC', description: 'Service health check endpoint for uptime monitoring' },
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
      case 'GET': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'POST': return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'PUT': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'DELETE': return 'bg-rose-50 text-rose-700 border-rose-200';
      default: return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 glass-panel p-4 rounded-xl border border-slate-200">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <FileCode className="w-5 h-5 text-indigo-600" />
            API &amp; System Documentation
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            REST API endpoints, access roles, and frontend routes.
          </p>
        </div>

        <a
          href="/swagger-ui/index.html"
          target="_blank"
          rel="noreferrer"
          className="w-full sm:w-auto justify-center px-3 py-1.5 rounded-lg bg-slate-100 text-slate-800 text-xs font-semibold border border-slate-300 hover:bg-slate-200 transition-colors flex items-center gap-1.5 shrink-0"
        >
          <Server className="w-3.5 h-3.5 text-emerald-600" />
          <span>Swagger UI</span>
        </a>
      </div>

      {loading ? (
        <LoadingSpinner label="Loading API specifications..." />
      ) : docData ? (
        <div className="space-y-4">
          {/* RBAC Matrix Cards */}
          <div className="glass-panel p-4 rounded-xl border border-slate-200">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2.5 flex items-center gap-1.5">
              <Key className="w-4 h-4 text-amber-600" />
              Role-Based Access Control
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                <div className="text-[11px] font-mono font-bold text-amber-800 uppercase mb-0.5">ADMIN</div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Full system access across all bases, purchases, transfers, assignments, and audit logs.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                <div className="text-[11px] font-mono font-bold text-indigo-800 uppercase mb-0.5">BASE COMMANDER</div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Manage personnel asset assignments, record base expenditures, and view base inventory.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                <div className="text-[11px] font-mono font-bold text-emerald-800 uppercase mb-0.5">LOGISTICS OFFICER</div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Record purchases, initiate inter-base transfers, and monitor stock inventory.
                </p>
              </div>
            </div>
          </div>

          {/* Endpoints Table */}
          <div className="glass-panel rounded-xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="px-4 py-2.5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Terminal className="w-4 h-4 text-indigo-600" />
                REST Endpoints ({docData.endpoints?.length})
              </h3>
              <span className="text-[11px] font-mono text-slate-500">/api/docs</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-700 font-mono uppercase text-[10px] tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="px-3 py-2 font-bold whitespace-nowrap">Method</th>
                    <th className="px-3 py-2 font-bold whitespace-nowrap">API Endpoint</th>
                    <th className="px-3 py-2 font-bold whitespace-nowrap">Frontend Route</th>
                    <th className="px-3 py-2 font-bold">Access Role</th>
                    <th className="px-3 py-2 font-bold">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {docData.endpoints?.map((ep, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 transition-colors">
                      <td className="px-3 py-2 whitespace-nowrap">
                        <span className={`px-1.5 py-0.5 font-mono text-[10px] font-bold rounded border ${getMethodBadge(ep.method)}`}>
                          {ep.method}
                        </span>
                      </td>
                      <td className="px-3 py-2 font-mono text-indigo-700 font-semibold whitespace-nowrap">
                        {ep.path}
                      </td>
                      <td className="px-3 py-2 font-mono text-emerald-700 font-semibold whitespace-nowrap">
                        {ep.frontendRoute || ep.path}
                      </td>
                      <td className="px-3 py-2">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {ep.role.split(',').map((r, i) => (
                            <span 
                              key={i} 
                              className="inline-block font-mono text-[10px] leading-tight text-amber-800 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded font-bold whitespace-nowrap"
                            >
                              {r.trim()}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-3 py-2 text-slate-700 font-medium">
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
