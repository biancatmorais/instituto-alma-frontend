import React from 'react';
// Importe os componentes necessários
import ProtectedRoute from './ProtectedRoute.jsx'; 
import DashboardHeader from './DashboardHeader.jsx';
import Footer from './Footer.jsx';

// Recebe 'children' (a página a ser renderizada) e 'allowedRoles' (as permissões)
function ProtectedLayout({ children, allowedRoles }) {
  return (
    // 1. O ProtectedRoute verifica o token e a role antes de renderizar qualquer coisa abaixo
    <ProtectedRoute allowedRoles={allowedRoles}>
      
      <DashboardHeader />
      
      {/* Renderiza a página privada (ex: AdminPage) se a permissão for concedida */}
      <main>
        {children} 
      </main>
      
      <Footer />
    </ProtectedRoute>
  );
}

export default ProtectedLayout;