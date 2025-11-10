import React from 'react';
import { Outlet } from 'react-router-dom'; // Importa o Outlet
import Header from './Header.jsx'; // Confirme o nome do seu arquivo Header
import Footer from './Footer.jsx'; // Confirme o nome do seu arquivo Footer

function PublicLayout() {
  return (
    <>
      <Header />
      
      {/* Aqui é onde a página específica (ex: HomePage) será renderizada */}
      <main>
        <Outlet /> 
      </main>
      
      <Footer />
    </>
  );
}

export default PublicLayout;