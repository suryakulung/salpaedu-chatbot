import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import DashboardLayout from './layouts/DashboardLayout';
import ChatHistory from './pages/ChatHistory';
import KnowledgeBase from './pages/KnowledgeBase';
import Leads from './pages/Leads';

import React from 'react';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/login" replace />;
  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route path="/" element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Navigate to="/history" />} />
          <Route path="history" element={<ChatHistory />} />
          <Route path="knowledge" element={<KnowledgeBase />} />
          <Route path="leads" element={<Leads />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
