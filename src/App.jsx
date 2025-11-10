import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Importe os NOVOS Componentes de Layout que você criará
// CORRIGIDO: Adicionando a extensão .jsx
import PublicLayout from './components/PublicLayout.jsx'; 
import ProtectedLayout from './components/ProtectedLayout.jsx'; 

// Importe suas páginas
import HomePage from './pages/HomePage';
import PortalPage from './pages/PortalPage';
import DoarPage from './pages/DoarPage';
import RelatoriosPage from './pages/RelatoriosPage';
import GovernancaPage from './pages/GovernancaPage';
import DashboardPage from './pages/DashboardPage.jsx'; 
import AdminPage from './pages/AdminPage';
import VoluntarioPage from './pages/VoluntarioPage';

function App() {
  return (
    <Routes>
        
        {/* --- ROTAS PÚBLICAS: USAM O PublicLayout (Header + Footer) --- */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/portal" element={<PortalPage />} />
          <Route path="/doar" element={<DoarPage />} />
          <Route path="/relatorios" element={<RelatoriosPage />} />
          <Route path="/governanca" element={<GovernancaPage />} />
        </Route>

        {/* --- ROTAS PRIVADAS: USAM O ProtectedLayout (DashboardHeader + Footer) --- */}
        
        {/* ROTA DASHBOARD */}
        <Route path="/dashboard" element={
          <ProtectedLayout allowedRoles={['doador', 'voluntario', 'admin']}>
            <DashboardPage />
          </ProtectedLayout>
        } />

        {/* ROTA VOLUNTÁRIO */}
        <Route path="/voluntario" element={
          <ProtectedLayout allowedRoles={['voluntario', 'admin']}>
            <VoluntarioPage />
          </ProtectedLayout>
        } />

        {/* ROTA ADMIN */}
        <Route path="/admin" element={
          <ProtectedLayout allowedRoles={['admin']}>
            <AdminPage />
          </ProtectedLayout>
        } />
        
        {/* Adicione rotas 404/Not Found aqui */}
        {/* <Route path="*" element={<NotFoundPage />} /> */}
    </Routes>
  );
}

export default App;