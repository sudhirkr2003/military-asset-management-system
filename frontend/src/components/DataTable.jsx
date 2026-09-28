import React, { useState } from 'react';
import { Search, ChevronLeft, ChevronRight, Inbox } from 'lucide-react';

const DataTable = ({ 
  columns, 
  data = [], 
  searchPlaceholder = "Search records...", 
  keyField = "id",
  actions,
  pageSize = 8 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const filteredData = data.filter((item) => {
    if (!searchTerm) return true;
    return Object.values(item).some((val) => {
      if (val === null || val === undefined) return false;
      if (typeof val === 'object') {
        return Object.values(val).some(v => v && v.toString().toLowerCase().includes(searchTerm.toLowerCase()));
      }
      return val.toString().toLowerCase().includes(searchTerm.toLowerCase());
    });
  });

  const totalPages = Math.ceil(filteredData.length / pageSize) || 1;
  const currentData = filteredData.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm transition-colors">
      {/* Search Header */}
      <div className="p-3 border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-2.5 bg-slate-50">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-2 w-3.5 h-3.5 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            placeholder={searchPlaceholder}
            className="w-full bg-white border border-slate-300 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 font-medium transition-colors"
          />
        </div>
        <div className="text-[11px] text-slate-500 font-mono">
          Showing <span className="text-slate-900 font-bold">{filteredData.length}</span> records
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-100 text-slate-700 uppercase font-mono font-bold text-[10px] tracking-wider border-b border-slate-200">
            <tr>
              {columns.map((col, idx) => (
                <th key={idx} className="px-3.5 py-2.5 whitespace-nowrap">{col.header}</th>
              ))}
              {actions && <th className="px-3.5 py-2.5 text-right whitespace-nowrap">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {currentData.length > 0 ? (
              currentData.map((row, rIdx) => (
                <tr key={row[keyField] || rIdx} className="hover:bg-slate-50 transition-colors">
                  {columns.map((col, cIdx) => (
                    <td key={cIdx} className="px-3.5 py-2 text-slate-800">
                      {col.render ? col.render(row) : row[col.accessorKey]}
                    </td>
                  ))}
                  {actions && (
                    <td className="px-3.5 py-2 text-right">
                      {actions(row)}
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length + (actions ? 1 : 0)} className="py-8 text-center text-slate-400">
                  <div className="flex flex-col items-center justify-center gap-1.5">
                    <Inbox className="w-6 h-6 stroke-1 text-slate-400" />
                    <span className="text-xs">No records found</span>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="px-3.5 py-2.5 border-t border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="text-xs text-slate-500 font-medium">
            Page <span className="text-slate-900 font-bold">{currentPage}</span> of <span className="text-slate-900 font-bold">{totalPages}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
              className="p-1 rounded-lg border border-slate-300 text-slate-600 hover:text-slate-900 hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
              className="p-1 rounded-lg border border-slate-300 text-slate-600 hover:text-slate-900 hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;
