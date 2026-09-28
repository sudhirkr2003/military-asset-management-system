import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Purchases from './pages/Purchases';
import Transfers from './pages/Transfers';
import AssignmentsExpenditures from './pages/AssignmentsExpenditures';
import Docs from './pages/Docs';

const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-slate-950 dark:bg-slate-950 light:bg-slate-50 bg-tactical-grid dark:text-slate-100 light:text-slate-900 flex flex-col transition-colors">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 overflow-y-auto max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
};

function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route path="/dashboard" element={<ProtectedRoute><MainLayout><Dashboard /></MainLayout></ProtectedRoute>} />
      <Route path="/purchases" element={<ProtectedRoute><MainLayout><Purchases /></MainLayout></ProtectedRoute>} />
      <Route path="/transfers" element={<ProtectedRoute><MainLayout><Transfers /></MainLayout></ProtectedRoute>} />
      
      <Route path="/assignments-expenditures" element={<ProtectedRoute><MainLayout><AssignmentsExpenditures initialTab="assignments" /></MainLayout></ProtectedRoute>} />
      <Route path="/assignments" element={<ProtectedRoute><MainLayout><AssignmentsExpenditures initialTab="assignments" /></MainLayout></ProtectedRoute>} />
      <Route path="/expenditures" element={<ProtectedRoute><MainLayout><AssignmentsExpenditures initialTab="expenditures" /></MainLayout></ProtectedRoute>} />

      <Route path="/docs" element={<ProtectedRoute><MainLayout><Docs /></MainLayout></ProtectedRoute>} />

      <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
