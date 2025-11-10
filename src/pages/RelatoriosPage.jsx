import React from 'react';

function RelatoriosPage() {
  return (
    <main className="page-wrapper">
      <div className="page-header">
        <h1>Relatórios e Prestações de Contas</h1>
        <div className="thin-bar" style={{ backgroundColor: '#6efff1' }}></div>
      </div>

      <div className="reports-container">
        <h2>Nossos Documentos:</h2>
        
        <div className="report-list">
          
          <div className="report-item">
            <h3>CNPJ Instituto Alma</h3>
            <a href="/documentos/CNPJ ALMA.pdf" target="_blank" rel="noopener noreferrer" className="btn btn-red">Ver PDF</a>
          </div>

          <div className="report-item">
            <h3>Cláusula de Remunerçaõ - 2021</h3>
            <a href="/documentos/estatuto instituto.pdf" target="_blank" rel="noopener noreferrer" className="btn btn-red">Ver PDF</a>
          </div>
          
          <div className="report-item">
            <h3>Inscrição Municipal</h3>
            <a href="/documentos/INSCRIÇÃOMUNICIPAL ALMA.pdf" target="_blank" rel="noopener noreferrer" className="btn btn-red">Ver PDF</a>
          </div>

          <div className="report-item">
            <h3>REDESIM Consulta Pública</h3>
            <a href="/documentos/Redesim.pdf" target="_blank" rel="noopener noreferrer" className="btn btn-red">Ver PDF</a>
          </div>

        </div>
      </div>
    </main>
  );
}

export default RelatoriosPage;